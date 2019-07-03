import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-role-information',
  templateUrl: './role-information.component.html',
  styleUrls: ['./role-information.component.css']
})
export class RoleInformationComponent implements OnInit {
  formdata: any;
  bands: any;
  roles: any;
  units: any;
  mapping_detail: any = [];
  displayedColumns: string[] = ['competency_name', 'skill_name'];
  show_table: Boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private skill_service: EmployeeSkillMappingService) { }
  ngOnInit() {
    this.formdata = new FormGroup({

      unit: new FormControl("", Validators.compose([
        Validators.required,
      ])),
      band: new FormControl("", Validators.compose([
        Validators.required,
      ])),
      role: new FormControl("", Validators.compose([
        Validators.required,
      ])),
    });
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getBands()
      .subscribe(
        response => {
          if (response["data"].indexOf(jsonObj.band_name) != -1) {
            this.bands = response["data"].slice(response["data"].indexOf(jsonObj.band_name));
          } else {
            this.bands = response["data"]
          }
        }
      )
    this.skill_service.getUnit("0")
      .subscribe(
        response => {
          this.units = response;
        });
    this.mapping_detail.paginator = this.paginator;
  }
  get_roles() {
    this.formdata.controls["role"].setValue(null);
    if (this.formdata.controls["unit"].status == "VALID" && this.formdata.controls["band"].status == "VALID") {
      this.skill_service.getRoles(this.formdata.controls["unit"].value, this.formdata.controls["band"].value)
        .subscribe(
          response => {
            this.roles = response["data"];
            this.show_table = false;
          }
        )
    } else {
      this.show_table = false;
    }
  }
  get_job_detail() {
    var employee_id;
    if (this.formdata.status == "VALID") {
      this.show_table = false;
      var jsonObj = JSON.parse(localStorage.currentUser);
      employee_id = jsonObj.id
      this.skill_service.getJobDetail(this.formdata.controls["role"].value, employee_id,'')
        .subscribe(
          response => {
            this.mapping_detail = new MatTableDataSource(response["data"]["job_detail"]);
            this.show_table = true;
            setTimeout(() => this.mapping_detail.paginator = this.paginator);
          }
        );
    } else {
      this.show_table = false;
    }
  }
  clearAllSelected() {
    this.show_table = false;
    this.roles = [];
    this.formdata.controls["role"].setValue(null);
    this.get_roles();
  }

}
