import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { LoaderService } from '../shared/loader.subject';
import { MatDialog } from '@angular/material';
import { TopmenuService } from "../shared/top-menu.subject";


@Component({
  selector: 'app-internal-job-creation',
  templateUrl: './internal-job-creation.component.html',
  styleUrls: ['./internal-job-creation.component.css']
})
export class InternalJobCreationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  bands: any;
  roles: any;
  units: any;
  bands_list: any;
  job_codes: any;
  employee_list: any = [];
  filtered_employee_list: any = [];
  employee_search: Boolean = true;
  Object = Object;
  show_table: boolean = false;
  @Output() mapping_detail: any = [];
  formdata: any;
  update_mapping_detail: any;
  disseleceted_job_detail_object: any = [];
  displayedColumns: string[] = ['checked', 'competency_name', 'skill_name'];
  constructor(private loader_subject: LoaderService, private topmenu_service: TopmenuService, private skill_service: EmployeeSkillMappingService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.loader_subject.setLoader(true);
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
      ])),
      min_fitment_score: new FormControl("")
    });

    this.topmenu_service.setActiveTab("rmg");

    this.skill_service.getBands()
      .subscribe(
        response => {
          this.bands_list = response["data"];
          this.bands = response["data"];
        }
      )
    this.skill_service.getUnit("0")
      .subscribe(
        response => {
          this.units = response;
        });
  }
  ngAfterViewInit() {
    this.loader_subject.setLoader(false);
  }
  clearAllSelected() {
    this.job_codes = [];
    this.mapping_detail = [];
    this.roles = [];

    this.formdata.controls["job_code"].setValue(null);
    this.formdata.controls["role"].setValue(null);
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
      var jsonObj = JSON.parse(localStorage.currentUser);
      employee_id = jsonObj.id
      this.skill_service.getJobDetail(this.formdata.controls["job_code"].value, employee_id,'')
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
    } else {
      this.mapping_detail = [];
    }
  }
  updateJobDetail() {
    var disseleceted_competency_object = []
    this.update_mapping_detail.forEach(function (value) {
      if (!value.checked)
        disseleceted_competency_object.push(value.job_competency_id);
    });
    this.disseleceted_job_detail_object = disseleceted_competency_object;
  }
  post_job() {
    this.loader_subject.setLoader(true);
    var jsonObj = JSON.parse(localStorage.currentUser);
    var employee_id = jsonObj.id;
    this.formdata.value["disseleceted_job_detail_object"] = this.disseleceted_job_detail_object;
    this.skill_service.creatNewInternalJob(this.formdata.value, employee_id)
      .subscribe(
        response => {
          this.loader_subject.setLoader(false);
          this.router.navigate(['/internal_job_list']);
        }
      );
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
