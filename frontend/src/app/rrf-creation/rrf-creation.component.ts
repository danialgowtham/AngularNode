import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FileValidator } from 'ngx-material-file-input';
import { BACK_END_URL } from '../shared/app.globals';

@Component({
  selector: 'app-rrf-creation',
  templateUrl: './rrf-creation.component.html',
  styleUrls: ['./rrf-creation.component.css'],

})

export class RrfCreationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  form_data: any;
  employee_detail: any;
  minDate = new Date();
  rrf_field_value: any = {};
  sub_practices: any;
  practices: any;
  projects: any;
  roles: any;
  BACK_END_URL = BACK_END_URL;
  job_codes: any;
  work_location_sub_list: any = [];
  mapping_detail: any;
  update_mapping_detail: any;
  show_table: boolean = false;
  displayedColumns: string[] = ['checked', 'competency_name', 'skill_name'];
  disseleceted_job_detail_object: any;
  interview_round_array: any = [];
  view_type: any = 'add';
  rrf_detail: any;
  rrf_id: any = '';
  settings: any;
  settings_manager: any;
  employee_list: any = [];
  interview_error_message: Boolean = false;
  rm_error_message: Boolean = false;
  manager_list: any = {};
  filtered_manager_list: any = {};
  Object = Object;
  maxSize: number = 2097152;
  accepted_file_exetension = ['pdf', 'doc', 'docx'];
  file_url: any = '';
  constructor(private location: Location, private route: ActivatedRoute, private skill_service: EmployeeSkillMappingService, private router: Router) { }

  ngOnInit() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.form_data = new FormGroup({
      unit: new FormControl("", [Validators.required]),
      practice: new FormControl("", [Validators.required]),
      sub_practice: new FormControl("", [Validators.required]),
      band: new FormControl("", [Validators.required]),
      manager_id: new FormControl("", [Validators.required]),
      customer_type: new FormControl("", [Validators.required]),
      customer_interview: new FormControl("", [Validators.required]),
      customer_name: new FormControl(""),
      project: new FormControl(""),
      billable: new FormControl("", [Validators.required]),
      duration: new FormControl("", [Validators.required]),
      base_location: new FormControl("", [Validators.required]),
      work_location: new FormControl("", [Validators.required]),
      sub_work_location: new FormControl(""),
      interview_round: new FormControl("", [Validators.required]),
      salary: new FormControl("", [Validators.required]),
      start_date: new FormControl("", [Validators.required]),
      billing_start_date: new FormControl(""),
      billing_end_date: new FormControl(""),
      note: new FormControl(""),
      source: new FormControl(""),
      role: new FormControl("", [Validators.required]),
      no_of_position: new FormControl("", [Validators.required]),
      job_code: new FormControl("", [Validators.required]),
      role_band: new FormControl("", [Validators.required]),
      minimum_fitment_score: new FormControl(""),
      interview_panel: new FormArray([]),
      customer_job_description: new FormControl("", [FileValidator.maxContentSize(this.maxSize)])
    });
    this.form_data.controls.customer_type.valueChanges.subscribe(value => {
      if (value == "External") {
        this.form_data.controls.customer_name.setValidators([Validators.required]);
        this.form_data.controls.project.setValidators([Validators.required]);
      } else {
        this.form_data.controls.customer_name.setValidators(null);
        this.form_data.controls.project.setValidators(null);
      }
      this.form_data.controls.customer_name.updateValueAndValidity();
      this.form_data.controls.project.updateValueAndValidity();
    });
    this.form_data.controls.customer_job_description.valueChanges.subscribe(value => {
      if (value) {
        var uploaded_file_type = value.fileNames.split('.').pop();
        if (!this.accepted_file_exetension.includes(uploaded_file_type)) {
          this.form_data.controls.customer_job_description.setValue(null, { emitEvent: false });
        }
      }
    });
    this.form_data.controls.manager_id.valueChanges.subscribe(value => {
      if (this.form_data.controls.manager_id.status == "INVALID") {
        this.rm_error_message = true;
      } else {
        this.rm_error_message = false;
      }
    });
    this.form_data.controls.unit.valueChanges.subscribe(value => {
      if (value == 3) {
        this.form_data.controls["customer_type"].setValue('Internal');
        this.form_data.controls["customer_name"].setValue('429');
        this.form_data.controls["project"].disable();
        this.form_data.controls["billable"].disable();
        this.form_data.controls["billing_start_date"].disable();
        this.form_data.controls["billing_end_date"].disable();
      } else {
        this.form_data.controls["customer_type"].setValue(null);
        this.form_data.controls["customer_name"].setValue(null);
        this.form_data.controls["project"].enable();
        this.form_data.controls["billable"].enable();
        this.form_data.controls["billing_start_date"].enable();
        this.form_data.controls["billing_end_date"].enable();
      }
      this.skill_service.getUnit(value)
        .subscribe(
          response => {
            this.form_data.controls["practice"].setValue(null);
            this.form_data.controls["sub_practice"].setValue(null);
            this.sub_practices = [];
            this.practices = response;
          }
        )
    });
    this.form_data.controls.practice.valueChanges.subscribe(value => {
      this.skill_service.getUnit(value)
        .subscribe(
          response => {
            this.form_data.controls["sub_practice"].setValue(null);
            this.sub_practices = response
          }
        );
    });
    this.form_data.controls.customer_name.valueChanges.subscribe(value => {
      this.form_data.controls["project"].setValue(null);
      if (value) {
        this.skill_service.getProject(value)
          .subscribe(
            response => {
              this.projects = response;
            }
          );
      }
    });
    this.form_data.controls.work_location.valueChanges.subscribe(value => {
      this.skill_service.getSubWorkLocation(value)
        .subscribe(
          response => {
            this.work_location_sub_list = response;
            if (this.work_location_sub_list.length) {
              this.form_data.controls.sub_work_location.setValidators([Validators.required]);
            } else {
              this.form_data.controls.sub_work_location.setValidators(null);
            }
          }
        );
    });
    this.form_data.controls.interview_round.valueChanges.subscribe(value => {
      this.counter();
    });
    this.form_data.controls.role_band.valueChanges.subscribe(value => {
      if (this.form_data.controls["unit"].value && this.form_data.controls["role_band"].value) {
        this.skill_service.getRoles(this.form_data.controls["unit"].value, this.form_data.controls["role_band"].value)
          .subscribe(
            response => {
              this.roles = response["data"];
              this.job_codes = [];
              this.mapping_detail = [];
            }
          );
      }
      this.show_table = false;
    });
    this.form_data.controls.unit.valueChanges.subscribe(value => {
      if (this.form_data.controls["unit"].value && this.form_data.controls["role_band"].value) {
        this.skill_service.getRoles(this.form_data.controls["unit"].value, this.form_data.controls["role_band"].value)
          .subscribe(
            response => {
              this.roles = response["data"];
              this.job_codes = [];
              this.mapping_detail = [];
            }
          );
      }
      this.show_table = false;
    });
    this.form_data.controls.role.valueChanges.subscribe(value => {
      this.show_table = false;
      this.skill_service.getJobCodes(this.form_data.controls["role"].value, this.form_data.controls["role_band"].value)
        .subscribe(
          response => {
            this.job_codes = response["data"];
            this.mapping_detail = [];
          }
        )
    });
    this.form_data.controls.job_code.valueChanges.subscribe(value => {
      var employee_id;
      this.mapping_detail = [];
      var jsonObj = JSON.parse(localStorage.currentUser);
      employee_id = jsonObj.id;
      this.skill_service.getJobDetail(this.form_data.controls["job_code"].value, employee_id, '')
        .subscribe(
          response => {
            this.update_mapping_detail = response["data"]["job_detail"].map(function (value, index) {
              value["checked"] = true;
              return value;
            });
            this.mapping_detail = new MatTableDataSource(this.update_mapping_detail);
            this.show_table = true;
            setTimeout(() => this.mapping_detail.paginator = this.paginator);
          }
        );
    });
    this.counter();
    this.skill_service.getEmployeeDetail(jsonObj.id)
      .subscribe(
        response => {
          this.employee_detail = response["data"];
        });
    if (this.route.snapshot.params.rrf_id) {
      this.view_type = 'edit';
      this.rrf_id = this.route.snapshot.params.rrf_id;
      this.skill_service.getRRFEditDetail(this.rrf_id)
        .subscribe(
          response => {
            this.rrf_field_value["customer"] = response["data"]["customer"];
            this.projects = response["data"]["project"];
            this.rrf_field_value["unit"] = response["data"]["unit"];
            this.rrf_detail = response["data"]["rrf_detail"];
            this.practices = response["data"]["practice"];
            this.sub_practices = response["data"]["sub_practice"];
            this.rrf_field_value["band"] = response["data"]["band"];
            this.rrf_field_value["work_location"] = response["data"]["work_location"];
            this.rrf_field_value["base_location"] = response["data"]["base_location"];
            this.work_location_sub_list = response["data"]["sub_work_location"];
            this.employee_list = response["data"]["employees"];
            this.roles = response["data"]["role"];
            this.job_codes = response["data"]["job_code"];
            this.manager_list = response["data"]["managers"];
            this.filtered_manager_list = response["data"]["managers"];
            this.disseleceted_job_detail_object = response["data"]["rrf_detail"].disselected_job_competency;
            this.update_mapping_detail = response["data"]["mapping_detail"].map(function (value, index) {
              if (response["data"]["rrf_detail"].disselected_job_competency.includes(value.job_competency_id))
                value["checked"] = false;
              else
                value["checked"] = true;
              return value;
            });
            this.mapping_detail = new MatTableDataSource(this.update_mapping_detail);
            this.show_table = true;
            setTimeout(() => {
              this.mapping_detail.paginator = this.paginator;
            });
            Object.keys(this.form_data.controls).forEach(key => {
              if (key == "customer_job_description")
                this.file_url = this.rrf_detail[key]
              else {
                this.form_data.controls[key].setValue(this.rrf_detail[key], { emitEvent: false });
                if (key == "interview_round") {
                  this.counter();
                }
              }
            });

          });
    } else {
      this.skill_service.getRRFCreationData()
        .subscribe(
          response => {
            this.rrf_field_value = response["data"];
            this.employee_list = this.rrf_field_value.employees;
            this.manager_list = response["data"]["managers"];
            this.filtered_manager_list = response["data"]["managers"];
          });
    }
    this.settings = {
      text: "Select Employee Name",
      enableSearchFilter: true,
      lazyLoading: true,
      enableCheckAll: false,
      enableFilterSelectAll: false,
      searchPlaceholderText: "Search Employee Name",
      badgeShowLimit: 1,
      limitSelection: 3,
    };
    this.settings_manager = {
      singleSelection: true,
      text: "Select Manager Name",
      enableSearchFilter: true,
      lazyLoading: true,
      searchPlaceholderText: "Search Manager Name",
      badgeShowLimit: 1,
      limitSelection: 3,
    };
  }
  update_employee_list(event) {
    var value = event.target.value;
    const filterValue = value.toLowerCase();
    this.filtered_manager_list = Object.keys(this.manager_list).filter(employee_id => {
      return this.manager_list[employee_id].employee_name.toLowerCase().includes(filterValue)
    }).map(filteredEmployeeId => this.manager_list[filteredEmployeeId]);
  }
  // update_employee_list(event) {
  //   var value = event.target.value;
  //   const filterValue = value.toLowerCase();
  //   if (filterValue) {
  //     this.skill_service.getFilteredEmployeeList(filterValue)
  //       .subscribe(
  //         response => {
  //           this.filtered_manager_list = response["data"];
  //         }
  //       );
  //   } else {
  //     this.filtered_manager_list = {};
  //   }
  // }

  displayFn(employee): string | undefined {
    return this.manager_list[employee] ? this.manager_list[employee].employee_name : undefined;
  }
  counter() {
    this.form_data.setControl('interview_panel', new FormArray([]));
    let control = <FormArray>this.form_data.controls.interview_panel;
    var i = this.form_data.controls["interview_round"].value ? this.form_data.controls["interview_round"].value : 1;
    this.interview_round_array = Array.from(Array(Number(i))).map((x, y) => y);
    this.interview_round_array.forEach(x => {
      control.push(this.patchValues());
    });
  }
  updateJobDetail() {
    var disseleceted_competency_object = []
    this.update_mapping_detail.forEach(function (value) {
      if (!value.checked) {
        disseleceted_competency_object.push(value.job_competency_id);
      }
    });
    this.disseleceted_job_detail_object = disseleceted_competency_object;
  }
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  go_back() {
    this.location.back();
  }
  patchValues() {
    return new FormControl("", [Validators.required]);
  }
  onSubmit() {
    if (this.form_data.controls.interview_panel.status == "INVALID") {
      this.interview_error_message = true;
    } else {
      this.interview_error_message = false;
    }
    if (this.form_data.controls.manager_id.status == "INVALID") {
      this.rm_error_message = true;
    } else {
      this.rm_error_message = false;
    }
    if (this.form_data.valid) {
      var jsonObj = JSON.parse(localStorage.currentUser);
      var employee_id = jsonObj.id;
      this.form_data.value["rrf_id"] = this.rrf_id;
      this.form_data.value["disselected_job_competency"] = this.disseleceted_job_detail_object;
      const formData = new FormData();
      if (this.form_data.value.customer_job_description) {
        formData.append("file", this.form_data.value.customer_job_description.files[0]);

      }
      if (this.rrf_id && this.file_url && !this.form_data.value.customer_job_description) {
        formData.append("customer_job_description", this.file_url);
        delete this.form_data.value.customer_job_description;
      }
      Object.keys(this.form_data.value).forEach((key) => {
        if (key == "disselected_job_competency" || key == "interview_panel")
          formData.append(key, JSON.stringify(this.form_data.value[key]));
        else
          formData.append(key, this.form_data.value[key]);
      });

      // this.form_data.value['manager_id'] = this.form_data.value['manager_id']['id'];
      this.skill_service.creatNewRRF(formData, employee_id)
        .subscribe(
          response => {
            //this.router.navigate(['/rrf_request_list']);
          }
        );
    }
  }
}
