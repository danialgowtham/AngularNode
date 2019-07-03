import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { LoaderService } from '../shared/loader.subject';
import { MatDialog } from '@angular/material';
import { TopmenuService } from "../shared/top-menu.subject";
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { InternalJobViewComponent } from "../internal-job-view/internal-job-view.component"



@Component({
  selector: 'app-internal-job-edit',
  templateUrl: './internal-job-edit.component.html',
  styleUrls: ['./internal-job-edit.component.css']
})
export class InternalJobEditComponent implements OnInit {
  @ViewChild('applied_employee_detail') applied_employee_detail: MatPaginator;
  @ViewChild('job_detail_paginator') job_detail_paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;

  displayedColumns: string[] = ['employee_name', 'applied_on','action'];
  displayedColumnsJob: string[] = ['competency_name', 'skill_name'];
  job_detail: any;
  employee_detail: any;
  applied_employee_details: any;
  mapping_detail: any;
  edit_page: boolean = false;
  help_text: String = "View Job Detail";
  constructor(private location: Location, private route: ActivatedRoute, private loader_subject: LoaderService, private topmenu_service: TopmenuService, private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    var url = this.router.url.split(";")
    if (url[0] == "/internal_job_edit") {
      this.edit_page = true
      this.help_text = "Edit Job Detail";
    }
    this.loader_subject.setLoader(true);
    this.topmenu_service.setActiveTab("rmg");
    this.skill_service.getJobPostDetail(this.route.snapshot.params.job_id)
      .subscribe(
        response => {
          this.job_detail = response["data"]["job_post_details"]["job_post_detail"][0];
          this.employee_detail = response["data"]["employee_detail"];
          console.log( this.job_detail);
          this.applied_employee_details = new MatTableDataSource(response["data"]["job_post_details"]["job_post_detail"][0]['applied_employees']);
          this.mapping_detail = new MatTableDataSource(response["data"]["job_post_details"]['job_detail']);
          setTimeout(() => {
            this.mapping_detail.paginator = this.job_detail_paginator;
            this.applied_employee_details.paginator = this.applied_employee_detail;
          });
        }
      )
  }
  ngAfterViewInit() {
    this.loader_subject.setLoader(false);
  }
  change_status(job_post_id, status) {
    this.loader_subject.setLoader(true);
    this.skill_service.updateJobPostDetail(job_post_id, status)
      .subscribe(
        response => {
          this.loader_subject.setLoader(false);
          this.router.navigate(['/internal_job_list']);
        }
      )
  }
  go_back() {
    this.location.back();
  }
  openDialog(job_master_id,employee_id, job_post_id): void {
    this.skill_service.getJobDetail(job_master_id, employee_id, job_post_id)
      .subscribe(
        response => {
          var mapping_detail = response["data"];
          this.dialog.open(InternalJobViewComponent,
            {
              width: '90vw', height: '90vh', data: { mapping_detail,employee_id }, closeOnNavigation: true, autoFocus: false, hasBackdrop: true, disableClose: true
            });
        }
      );
  }
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    let range = XLSX.utils.decode_range(ws["!ref"]);

    XLSX.utils.book_append_sheet(wb, ws, 'Applied Employee');

    /* save to file */
    XLSX.writeFile(wb, 'Applied Employee List ' + new Date() + '.xlsx');

  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
