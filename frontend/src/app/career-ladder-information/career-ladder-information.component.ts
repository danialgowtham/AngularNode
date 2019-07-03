import { Component, OnInit } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatDialog } from '@angular/material/dialog';
import { ApplyJobComponent } from "../apply-job/apply-job.component"


@Component({
  selector: 'app-career-ladder-information',
  templateUrl: './career-ladder-information.component.html',
  styleUrls: ['./career-ladder-information.component.css']
})
export class CareerLadderInformationComponent implements OnInit {
  jsonObj = JSON.parse(localStorage.currentUser);
  job_list: any;
  CurrentDate = new Date();
  constructor(private skill_service: EmployeeSkillMappingService, public dialog: MatDialog) { }

  ngOnInit() {
    this.CurrentDate.setDate(this.CurrentDate.getDate() - 7);
    this.skill_service.getJobPosts()
      .subscribe(
        response => {
          this.job_list = response["data"];
        }
      )
  }
  openDialog(job_master_id, job_post_id): void {
    var jsonObj = JSON.parse(localStorage.currentUser);
    var employee_id = jsonObj.id
    this.skill_service.getJobDetail(job_master_id, employee_id, job_post_id)
      .subscribe(
        response => {
          var mapping_detail = response["data"];
          this.dialog.open(ApplyJobComponent,
            {
              width: '90vw', height: '90vh', data: { mapping_detail, job_post_id }, closeOnNavigation: true, autoFocus: false, hasBackdrop: true, disableClose: true
            });
        }
      );

  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

