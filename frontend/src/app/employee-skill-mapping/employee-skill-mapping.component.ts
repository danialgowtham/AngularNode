import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeSkillMappingService } from '../services/employee_skill_mapping.service';
import { MatDialog } from '@angular/material';
import { PopupModalComponent } from '../popup-modal/popup-modal'

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
  btn_disable: boolean = true;
  @Output() already_selected_skill = new Array();
  @Output() rowList: Array<{ id: Number }> = [];
  @Output() selected_competency = new Array();
  overall_competecny_list = new Map();
  submit_data=new Array();
  constructor(private skill_service: EmployeeSkillMappingService, private router: Router, public dialog: MatDialog) { this.rowList = [] }

  ngOnInit() {
    this.onAddNew();
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getCompetencyMapping(jsonObj.id,"a")
      .subscribe(
        response => {
          this.employee_detail = response["data"]["employee_detail"];
          this.mapping_detail = response["data"]["skill"];
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
      this.overall_competecny_list.set(data.get("row_id"),{"skill_list":data.get("competency_list"),"sub_sbu":data.get("sub_practice")})
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PopupModalComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "yes") {
        this.SubmitData();
      }
    });
  }
  SubmitData() {
    for (let com_list of this.overall_competecny_list.values()) {
      console.log(com_list.skill_list)
      console.log(com_list.sub_sbu)
      var skill_list_array:skillObject={};
      for (let [key, value] of com_list.skill_list) {
        this.submit_data.push({"sub_sbu_id":com_list.sub_sbu,"skill_id":key,"experience":value})
      }
      // this.submit_data[com_list.sub_sbu]=skill_list_array;
    }
    var jsonObj = JSON.parse(localStorage.currentUser);
    var data = { "employee_id": jsonObj.id, "data": this.submit_data,"updated_data": this.updated_skill_list };
    console.log(data);
    this.skill_service.saveCompetencyMapping(data)
      .subscribe(
        response => {
          this.router.navigate(['/employee_skill_view']);
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
  update_skill(master_id,skill_id ,exp_month) {
    if (this.updated_skill_list[master_id])
      delete this.updated_skill_list[master_id]
    if (this.approved_skill_list.get(master_id) != exp_month && Number(exp_month)>0)
      this.updated_skill_list[master_id] = {"skill_id":skill_id,"experience":exp_month};
  }
  check_disable(){
    if (Object.keys(this.updated_skill_list).length || this.overall_competecny_list.size)
     return false;
    else
     return true;
  }

}

export interface skillObject {
  [key: string]: skillObjectInner
}
export interface skillObjectInner {
  [key: string]: any
}
