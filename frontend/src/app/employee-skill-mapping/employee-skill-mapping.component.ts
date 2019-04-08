import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeSkillMappingService } from '../services/employee_skill_mapping.service';
import { MatDialog } from '@angular/material';
import { PopupModalComponent } from '../popup-modal/popup-modal';

@Component({
  selector: 'app-employee-skill-mapping',
  templateUrl: './employee-skill-mapping.component.html',
  styleUrls: ['./employee-skill-mapping.component.css']
})
export class EmployeeSkillMappingComponent implements OnInit {
  rowId: number = 0;
  employee_detail: any;
  mapping_detail: any;
  approved_skill_list = new Map();
  updated_skill_list = {};
  updated_skill_list_error = {};
  btn_disable: boolean = true;
  hide_submit_btn: boolean = false;
  hide_view_skill: Boolean = true;
  selectedIndex: Number = 0;
  help_text_array: any = { "Add Skill": "Allows employees to add all the skills they have irrespective of their current role", "Edit Skill": "Allows employees to edit their skills", "View Skill": "Allows employees to view their skills" };
  help_text = this.help_text_array["Add Skill"];
  @Output() overall_experience_month: number = 0;
  @Output() already_selected_skill = new Array();
  @Output() rowList: Array<{ id: Number }> = [];
  @Output() selected_competency = new Array();
  overall_competecny_list = new Map();
  submit_data = new Array();
  constructor(private skill_service: EmployeeSkillMappingService, private router: Router, public dialog: MatDialog) { this.rowList = [] }

  ngOnInit() {
    this.view_skill_show();
    this.onAddNew();
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getCompetencyMapping(jsonObj.id, "a")
      .subscribe(
        response => {
          this.employee_detail = response["data"]["employee_detail"];
          this.overall_experience_month = response["data"]["employee_detail"]["overall_experience_month"];
          this.mapping_detail = response["data"]["skill"];
        }
      );

  }

  view_skill_show() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getCompetencyMapping(jsonObj.id, null)
      .subscribe(
        response => {
          if (response["data"]["skill"].length > 0) {
            this.hide_view_skill = false;
            this.hide_submit_btn = true;
            this.selectedIndex = 2;
            this.help_text = this.help_text_array["View Skill"];
          }
          for (let skill_object of response["data"]["skill"]) {
            this.already_selected_skill.push(skill_object.skill_id)
            this.approved_skill_list.set(skill_object.employee_skill_set_id, skill_object.experience_month);
          }
        }
      );
  }

  onDeleteRow(row: any) {
    this.rowList = this.rowList.filter(rowObj => rowObj.id != row.id);
    if (this.overall_competecny_list.has(row.id))
      this.overall_competecny_list.delete(row.id);
    if (this.rowList.length == 0) {
      this.onAddNew();
    }
  }

  onAddNew() {
    this.rowId++;
    this.rowList.push({ id: this.rowId }
    );

  }
  pushCompetency(sel_competency) {
    var index = this.selected_competency.indexOf(sel_competency.old_value);
    if (index != -1)
      this.selected_competency[index] = sel_competency.new_value;
    else
      this.selected_competency.push(sel_competency.new_value)
  }
  pushCompetencyList(data) {
    if (this.overall_competecny_list.has(data.get("row_id")))
      this.overall_competecny_list.delete(data.get("row_id"));
    if (data.get("competency_list").size > 0)
      this.overall_competecny_list.set(data.get("row_id"), { "skill_list": data.get("competency_list"), "sub_sbu": data.get("sub_practice") })
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PopupModalComponent, { closeOnNavigation: true, disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "yes") {
        this.SubmitData();
      }
    });
  }
  SubmitData() {
    this.hide_submit_btn = true;
    for (let com_list of this.overall_competecny_list.values()) {
      for (let [key, value] of com_list.skill_list) {
        this.submit_data.push({ "sub_sbu_id": com_list.sub_sbu, "skill_id": key, "experience": value })
      }
    }
    var jsonObj = JSON.parse(localStorage.currentUser);
    var data = { "band_name": jsonObj.band_name, "employee_id": jsonObj.id, "data": this.submit_data, "updated_data": this.updated_skill_list };
    this.skill_service.saveCompetencyMapping(data)
      .subscribe(
        response => {
          this.router.navigateByUrl('/employee_skill_view', { skipLocationChange: true }).then(() =>
            this.router.navigate(["employee_skill"]));
        }
      );
  }
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  update_skill(master_id, skill_id, exp_month) {
    if (this.updated_skill_list[master_id]) {
      delete this.updated_skill_list[master_id]
    }
    if (this.updated_skill_list_error[master_id]) {
      delete this.updated_skill_list_error[master_id]
    }
    if (Number(exp_month) == 0 || Number(exp_month) > this.overall_experience_month)
      this.updated_skill_list_error[master_id] = "error";
    else if (this.approved_skill_list.get(master_id) != exp_month)
      this.updated_skill_list[master_id] = { "skill_id": skill_id, "experience": exp_month };

  }
  check_disable() {
    if ((Object.keys(this.updated_skill_list).length && Object.keys(this.updated_skill_list_error).length == 0) || this.overall_competecny_list.size)
      return false;
    else
      return true;
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
  change_tab(event) {
    this.help_text = this.help_text_array[event.tab.textLabel];
    if (event.tab.textLabel == "View Skill") {
      this.hide_submit_btn = true
    } else {
      this.hide_submit_btn = false;
    }
  }

}

export interface skillObject {
  [key: string]: skillObjectInner
}
export interface skillObjectInner {
  [key: string]: any
}
