import { Component, OnInit, ViewChild, Output, Input } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog, MatSort } from '@angular/material';
import { Popup } from "../employee-job-view/employee-job-view.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee-skill-view',
  templateUrl: './employee-skill-view.component.html',
  styleUrls: ['./employee-skill-view.component.css']
})
export class EmployeeSkillViewComponent implements OnInit {
  mapping_data: any;
  @Output() employee_detail: any;
  @Input() selected_employee_id: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  disable_popup: Boolean = false;
  current_role: any;
  displayedColumns: string[] = ['strucure', 'competency_name', 'skill_name', 'experience_month', 'employee_proficiency', 'manager_proficiency'];
  constructor(private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, private router: Router) {

  }

  ngOnInit() {
    var employee_id;
    if (this.selected_employee_id) {
      employee_id = this.selected_employee_id;
      this.disable_popup = true
    } else {
      var jsonObj = JSON.parse(localStorage.currentUser);
      employee_id = jsonObj.id
    }
   
    if (this.router.url == "/employee_skill_view") {
      this.disable_popup = true
    }
    this.skill_service.getCompetencyMapping(employee_id, null, null)
      .subscribe(
        response => {
          this.mapping_data = new MatTableDataSource(response["data"]["skill"]);
          this.employee_detail = response["data"]["employee_detail"];
          this.mapping_data.paginator = this.paginator;
          this.mapping_data.sort = this.sort;
          this.current_role = response["data"]["skill"][0]["current_role"]
        }
      );
  }

  open_proficiency_popup(mapping_id) {
    this.skill_service.getproficiencyDecription(mapping_id)
      .subscribe(
        response => {
          var proficiency_list = response["data"];
          this.dialog.closeAll();
          this.dialog.open(Popup, { data: { closeOnNavigation: true, proficiency_list, type: "skill" }, hasBackdrop: true, disableClose: true });
        }
      );
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
