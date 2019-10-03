import { Component, OnInit, Output } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Popup } from "../employee-job-view/employee-job-view.component";
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-employee-job-search',
  templateUrl: './employee-job-search.component.html',
  styleUrls: ['./employee-job-search.component.css']
})
export class EmployeeJobSearchComponent implements OnInit {
  bands: any;
  roles: any;
  units: any;
  bands_list: any;
  job_codes: any;
  employee_list: any = [];
  filtered_employee_list: any = [];
  employee_search: Boolean = true;
  Object = Object;

  help_text: any = "Employees can check their fitment for any role in the organization and get the fitment score";
  @Output() mapping_detail: any = [];
  @Output() view_type: String = "employee";
  formdata: any;
  constructor(private skill_service: EmployeeSkillMappingService, private router: Router, public dialog: MatDialog) { }

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
      job_code: new FormControl("", Validators.compose([
        Validators.required,
      ]))
    });
    var jsonObj = JSON.parse(localStorage.currentUser);
    if (this.router.url == "/rmg_job_mapping") {
      this.employee_search = false;
      this.view_type = "rmg";
      this.skill_service.getEmployeeList()
        .subscribe(
          response => {
            this.employee_list = response["data"];
            this.filtered_employee_list = this.employee_list;
          });
      this.formdata.addControl("employee", new FormControl("", Validators.compose([Validators.required])));
      this.help_text = "Based on their requirement, RMG can check the skills of all individuals in the organization to find the right fit";
    } else if (this.router.url == "/manager_job_mapping") {
      this.employee_search = false;
      this.view_type = "manager";
      this.skill_service.getReporteeList(jsonObj.id)
        .subscribe(
          response => {
            this.employee_list = response["data"];
            this.filtered_employee_list = this.employee_list
          });
      this.formdata.addControl("employee", new FormControl("", Validators.compose([Validators.required])));
      this.help_text = "Managers can check the fitment and areas of development of the members in their team";
    }
    this.skill_service.getBands()
      .subscribe(
        response => {
          this.bands_list = response["data"];
          if (this.router.url == "/employee_job_mapping") {
            if (response["data"].indexOf(jsonObj.band_name) != -1) {
              this.bands = response["data"].slice(response["data"].indexOf(jsonObj.band_name));
            } else {
              this.bands = response["data"];
            }
          }
        }
      )
    this.skill_service.getUnit("0")
      .subscribe(
        response => {
          this.units = response;
        });
  }
  clearAllSelected() {
    this.job_codes = [];
    this.mapping_detail = [];
    this.roles = [];
    this.formdata.controls["job_code"].setValue(null);
    this.formdata.controls["role"].setValue(null);
    this.get_roles();
  }

  get_roles() {
    this.formdata.controls["role"].setValue(null);
    this.formdata.controls["job_code"].setValue(null);
    if (this.formdata.controls["unit"].status == "VALID" && this.formdata.controls["band"].status == "VALID") {
      this.skill_service.getRoles(this.formdata.controls["unit"].value, this.formdata.controls["band"].value)
        .subscribe(
          response => {
            this.roles = response["data"];
            this.job_codes = [];
            this.mapping_detail = [];
          }
        )
    } else {
      this.job_codes = [];
      this.mapping_detail = [];
    }
  }
  get_job_codes() {
    this.formdata.controls["job_code"].setValue(null);
    if (this.formdata.controls["role"].status == "VALID" && this.formdata.controls["band"].status == "VALID") {
      this.skill_service.getJobCodes(this.formdata.controls["role"].value, this.formdata.controls["band"].value)
        .subscribe(
          response => {
            this.job_codes = response["data"];
            this.mapping_detail = [];
          }
        )
    } else {
      this.mapping_detail = [];
    }
  }
  get_job_detail() {
    var employee_id;
    if (this.formdata.status == "VALID") {
      this.mapping_detail = [];
      if (this.router.url != "/employee_job_mapping") {
        employee_id = this.formdata.value.employee.id;
      } else {
        var jsonObj = JSON.parse(localStorage.currentUser);
        employee_id = jsonObj.id
      }
      this.skill_service.getJobDetail(this.formdata.controls["job_code"].value, employee_id, '')
        .subscribe(
          response => {
            this.mapping_detail["mapping_data"] = response["data"];
            // this.mapping_detail["job_master_id"] = this.formdata.controls["job_code"].value;
            // this.mapping_detail["employee_id"] = employee_id;
          }
        );
      // this.skill_service.getEmployeeDetail(employee_id)
      //   .subscribe(
      //     response => {
      //       this.mapping_detail["employee_data"] = response["data"];
      //     }
      //   );
    } else {
      this.mapping_detail = [];
    }
  }
  update_employee_list(event) {
    var value = event.target.value;
    const filterValue = value.toLowerCase();
    this.filtered_employee_list = Object.keys(this.employee_list).filter(employee_id => {
      return this.employee_list[employee_id].employee_name.toLowerCase().includes(filterValue)
    }).map(filteredEmployeeId => this.employee_list[filteredEmployeeId]);
  }
  displayFn(employee): string | undefined {

    return employee ? employee.employee_name : undefined;
  }
  update_band(employee) {
    this.job_codes = [];
    this.mapping_detail = [];
    this.roles = [];
    this.formdata.controls["job_code"].setValue(null);
    this.formdata.controls["role"].setValue(null);
    this.formdata.controls["band"].setValue(null);
    this.get_roles();
    if (this.bands_list.indexOf(employee.option.value.band_name) != -1) {
      this.bands = this.bands_list.slice(this.bands_list.indexOf(employee.option.value.band_name));
    } else {
      this.bands = this.bands_list;
    }
  }
  open_job_code_description_popup() {
    this.dialog.open(Popup, { width: "30%", closeOnNavigation: true, data: { type: "job_code" }, hasBackdrop: true,disableClose: true });
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
