import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Location } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BACK_END_URL } from '../shared/app.globals';


@Component({
  selector: 'app-rrf-view',
  templateUrl: './rrf-view.component.html',
  styleUrls: ['./rrf-view.component.css']
})
export class RrfViewComponent implements OnInit {
  employee_detail: any;
  rrf_detail: any;
  @Output() rrf_id: any;
  job_detail: any;
  BACK_END_URL = BACK_END_URL;
  dataSource: any = [];
  displayedColumns: string[] = ['level', 'employee_name'];
  displayedColumnsJob: string[] = ['competency_name', 'skill_name'];
  form_data: any;
  customer_project: any;
  view_type: any = "view";
  minDate = new Date();
  manager_detail: any;
  base_location: any;
  @Input() rrf_approve;
  @ViewChild('job_detail_paginator') job_detail_paginator: MatPaginator;

  constructor(private router: Router, private location: Location, private skill_service: EmployeeSkillMappingService, private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.form_data = new FormGroup({
      reject_reason: new FormControl("", [Validators.required]),
      with_internal_job: new FormControl("", [Validators.required]),
      ijp_end_date: new FormControl(),
    });
    this.form_data.controls.with_internal_job.valueChanges.subscribe(value => {
      if (value == "Yes") {
        this.form_data.controls.ijp_end_date.setValidators([Validators.required]);
        this.form_data.controls.ijp_end_date.updateValueAndValidity();
      } else {
        this.form_data.controls.ijp_end_date.setValidators(null);
        this.form_data.controls.ijp_end_date.updateValueAndValidity();
      }
    });
    if (this.route.snapshot.params.rrf_id) {
      this.rrf_id = this.route.snapshot.params.rrf_id;
      this.skill_service.getRRFDetail(this.rrf_id)
        .subscribe(
          response => {
            this.rrf_detail = response["data"]["rrf_detail"]["rrf_detail"];
            this.employee_detail = response["data"]["employee_detail"];
            this.customer_project = response["data"]["customer_project"];
            this.manager_detail = response["data"]["manager_detail"];
            this.base_location = response["data"]["base_location"];
            this.job_detail = new MatTableDataSource(response["data"]["rrf_detail"]["job_detail"])
            setTimeout(() => {
              this.job_detail.paginator = this.job_detail_paginator;
            });
            var index = 0;
            for (var level_object of this.rrf_detail["interview_panel"]) {
              var employee_names = '';
              index++;
              for (var employee_object of level_object) {
                employee_names += employee_object["itemName"];
                employee_names += ", ";
              }
              this.dataSource.push({ "level": "Level " + index, "employee_name": employee_names.slice(0, -2) });
            }
            this.dataSource = new MatTableDataSource(this.dataSource);
          });
    }
    if (this.route.snapshot.params.view_type) {
      this.view_type = this.route.snapshot.params.view_type;
    }
  }
  counter(i: number) {
    return new Array(i);
  }
  go_back() {
    this.location.back();
  }
  submit_approve(type) {
    var jsonObj = JSON.parse(localStorage.currentUser);
    var employee_id = jsonObj.id;
    var update_object = {};
    var redirect_url;
    if (this.view_type == "manager") {
      var status = "RM ";
      update_object["manager_id"] = employee_id.toString();;
      update_object["manager_reject_reason"] = this.form_data.value.reject_reason;
      update_object["manager_status_changed_on"] = new Date();
      redirect_url = '/rrf_approve_list';
    } else {
      var status = "RMG ";
      update_object["rmg_id"] = employee_id.toString();;
      update_object["rmg_reject_reason"] = this.form_data.value.reject_reason;
      update_object["with_internal_job"] = this.form_data.value.with_internal_job;
      update_object["rmg_status_changed_on"] = new Date();
      redirect_url = '/rrf_rmg_list';
      if (this.form_data.value.with_internal_job == "Yes") {
        update_object["ijp_end_date"] = this.form_data.value.ijp_end_date;

      }
    }
    if (type == "approve") {
      status += "Approved"
      this.form_data.controls.reject_reason.setValidators(null);
      if (this.view_type == "rmg") {
        this.form_data.controls.with_internal_job.setValidators([Validators.required]);
      } else {
        this.form_data.controls.with_internal_job.setValidators(null);
      }
      this.form_data.controls.reject_reason.updateValueAndValidity();
      this.form_data.controls.with_internal_job.updateValueAndValidity();
    } else {
      status += "Rejected";
      this.form_data.controls.with_internal_job.setValidators(null);
      this.form_data.controls.reject_reason.setValidators([Validators.required]);
      this.form_data.controls.reject_reason.updateValueAndValidity();
      this.form_data.controls.with_internal_job.updateValueAndValidity();
    }
    if (this.form_data.valid) {
      update_object["status"] = status;
      this.skill_service.updateRRFStatus(update_object, this.rrf_id)
        .subscribe(
          response => {
            this.router.navigate([redirect_url]);
          }
        );
    }
  }
}
