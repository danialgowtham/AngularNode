import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { LoaderService } from '../shared/loader.subject';
import { MatDialog } from '@angular/material';
import { TopmenuService } from "../shared/top-menu.subject";
import {InternalJobViewComponent} from "../internal-job-view/internal-job-view.component"

@Component({
  selector: 'app-applied-job-list',
  templateUrl: './applied-job-list.component.html',
  styleUrls: ['./applied-job-list.component.css']
})
export class AppliedJobListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  job_detail: any;
  employee_detail: any;
  displayedColumns: string[] = ['role', 'applied_on', 'status','action'];
  constructor(private loader_subject: LoaderService, private topmenu_service: TopmenuService, private skill_service: EmployeeSkillMappingService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loader_subject.setLoader(true);
    this.topmenu_service.setActiveTab("employee");
    var jsonObj = JSON.parse(localStorage.currentUser);
    var employee_id = jsonObj.id
    this.skill_service.getAppliedJobPost(employee_id)
      .subscribe(
        response => {
          this.job_detail = new MatTableDataSource(response["data"]);
          setTimeout(() => this.job_detail.paginator = this.paginator);
        }
      )

  }
  openDialog(job_master_id, job_post_id): void {
    var jsonObj = JSON.parse(localStorage.currentUser);
    var employee_id = jsonObj.id
    this.skill_service.getJobDetail(job_master_id, employee_id,job_post_id)
      .subscribe(
        response => {
          var mapping_detail = response["data"];
          this.dialog.open(InternalJobViewComponent,
            {
              width: '90vw', height: '90vh', data: { mapping_detail }, closeOnNavigation: true, autoFocus: false, hasBackdrop: true,disableClose: true
            });
        }
      );
  }
  applyFilter(filterValue: string) {
    this.job_detail.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit() {
    this.loader_subject.setLoader(false);
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
