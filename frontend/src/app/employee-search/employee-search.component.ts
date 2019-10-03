import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeeViewPopupComponent } from '../employee-view-popup/employee-view-popup';


@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.css']
})
export class EmployeeSearchComponent implements OnInit {
  mapping_data: any;
  employee_data: any;
  formdata: any;
  filtered_employee_list: any = {};
  Object = Object;
  skill_data: any = [];
  filtered_skill_list: any = [];
  filtered_role_list: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['employee_name', 'unit', 'band', 'action'];
  constructor( private skill_service: EmployeeSkillMappingService, public dialog: MatDialog) {
  }
  ngOnInit() {
    this.skill_service.getEmployeeSkillMappingList({})
      .subscribe(
        response => {
          this.mapping_data = new MatTableDataSource(response["data"]["employee_skill_data"]);
          this.mapping_data.paginator = this.paginator;
          this.employee_data = response["data"]["employee_detail"];
        }
      );
    this.skill_service.getSkillList()
      .subscribe(
        response => {
          this.skill_data = response["data"]["skill_proficiency_array"];
          this.filtered_skill_list = this.skill_data;
        }
      );
    this.formdata = new FormGroup({
      employee: new FormControl(),
      skill: new FormControl(),
      skill_search: new FormControl(),
      role: new FormControl()
    });
    this.formdata.controls["skill"].setValue([]);
    this.formdata.controls.skill_search.valueChanges
      .subscribe(() => {
        this.update_skill();
      });
  }
  openEmployeeSkill(employee_id) {
    this.dialog.closeAll();
    this.dialog.open(EmployeeViewPopupComponent, { closeOnNavigation: true, width: '90vw', height: '80vh', maxWidth: '90vw', maxHeight: '80vh', autoFocus: false, data: employee_id, hasBackdrop: true, disableClose: true });
  }
  update_employee_list(event) {
    var value = event.target.value;
    const filterValue = value.toLowerCase();
    if (filterValue) {
      this.skill_service.getFilteredEmployeeList(filterValue)
        .subscribe(
          response => {
            this.filtered_employee_list = response["data"];
          }
        );
    } else {
      this.filtered_employee_list = {};
    }
    // this.filtered_employee_list = Object.keys(this.employee_data).filter(employee_id => {
    //   return this.employee_data[employee_id].employee_name.toLowerCase().includes(filterValue)
    // }).map(filteredEmployeeId => this.employee_data[filteredEmployeeId]);
  }

  displayFn(employee): string | undefined {
    return employee ? employee.employee_name : undefined;
  }
  update_skill() {
    var skill = this.formdata.controls.skill_search.value
    const filterValue = skill.toLowerCase();
    this.filtered_skill_list = this.skill_data.filter(skill => {
      return skill.skill_name.toLowerCase().includes(filterValue)
    })
  }
  filter_employees() {
    if (this.formdata.value.employee || this.formdata.value.skill || this.formdata.value.role) {
      this.skill_service.getEmployeeSkillMappingList(this.formdata.value)
        .subscribe(
          response => {
            this.mapping_data = new MatTableDataSource(response["data"]["employee_skill_data"]);
            this.mapping_data.paginator = this.paginator;
          }
        );
    } else {
      this.skill_service.getEmployeeSkillMappingList({})
        .subscribe(
          response => {
            this.mapping_data = new MatTableDataSource(response["data"]["employee_skill_data"]);
            this.mapping_data.paginator = this.paginator;
          }
        );
    }
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
  update_role_list(event) {
    var value = event.target.value;
    const filterValue = value.toLowerCase();
    if (filterValue) {
      this.skill_service.getRoleList(filterValue)
        .subscribe(
          response => {
            this.filtered_role_list = response["data"]["role_list"];
          }
        );
    } else {
      this.filtered_role_list = [];
    }
  }

  displayRole(role): string | undefined {
    return role ? role : undefined;
  }
 

}
