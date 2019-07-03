import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.css']
})
export class ApplyJobComponent implements OnInit {
  @Output() mapping_detail: any = [];
  @Output() view_type: String = "employee";
  @Output() no_popup: Boolean = true;
  job_post_id: any;
  already_applied: any = [];
  min_fitment_score_flag: any = [];
  fitment_score: any;
  constructor(private _snackBar: MatSnackBar, private skill_service: EmployeeSkillMappingService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ApplyJobComponent>, ) { };

  ngOnInit() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    var employee_id = jsonObj.id
    this.mapping_detail['mapping_data'] = this.data["mapping_detail"];
    this.job_post_id = this.data["job_post_id"];
    this.skill_service.applyJobCheck(this.job_post_id, employee_id, this.data["mapping_detail"]['fitment_score_percentage'])
      .subscribe(
        response => {
          this.min_fitment_score_flag = response["data"]["min_fitment_score_flag"];
          this.already_applied = response["data"]["already_applied_flag"];
          if (response["data"]["min_fitment_score_flag"].length != 0) {
            this.fitment_score = this.min_fitment_score_flag[0]["min_fitment_score"];
          }
        }
      );
  }

  closeDialog() {
    this.dialogRef.close();
  }
  apply_job() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    var employee_id = jsonObj.id
    this.skill_service.applyJob(this.job_post_id, employee_id)
      .subscribe(
        response => {
          this.dialogRef.close();
          this.openSnackBar();
        }
      );
  }

  openSnackBar() {
    this._snackBar.open('Job Applied Successfully', '', {
      duration: 2000,
    });
  }


}
