import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hr-rrf-approve',
  templateUrl: './hr-rrf-approve.component.html',
  styleUrls: ['./hr-rrf-approve.component.css']
})
export class HrRrfApproveComponent implements OnInit {
  formdata: any;
  overallRating: any = 0;
  constructor(private router: Router, private _snackBar: MatSnackBar, private skill_service: EmployeeSkillMappingService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<HrRrfApproveComponent>) { }

  ngOnInit() {
    console.log(this.data);
    this.formdata = new FormGroup({
      interview_performance: new FormGroup({
        presentation: new FormControl(""),
        clarity_of_thought: new FormControl(""),
        communication: new FormControl(""),
        problem_solving_skills: new FormControl(""),
        job_stability: new FormControl(""),
        excitement_and_enthusiasm_for_the_job: new FormControl(""),
        attitude: new FormControl(""),
        team_player_and_leadership_skills: new FormControl(""),
        listening_skills: new FormControl(""),
        fitment_to_HTL_culture: new FormControl(""),
        qualification_details: new FormControl(""),
        work_experience_details: new FormControl(""),
        reason_for_job_change: new FormControl(""),
        notice_period: new FormControl(""),
        others: new FormControl(""),
      }),
      evaluation_result_and_remarks: new FormGroup({
        evaluation_remarks: new FormControl(""),
        evaluation_result: new FormControl("", [Validators.required])
      }),
      other_comments: new FormGroup({
        strength_and_weaknesses: new FormControl(""),
        reference_check_details: new FormControl(""),
        commitments_given: new FormControl("")
      })
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }

  save_iof() {
    if (this.formdata.valid) {
      var jsonObj = JSON.parse(localStorage.currentUser);
      var employee_id = jsonObj.id;
      this.formdata.value["submitted_by"] = employee_id;
      if (this.formdata.value['evaluation_result_and_remarks']['evaluation_result'] == 'Selected') {
        var status = 'HR Round Cleared';
      } else {
        var status = 'Rejected'
      }
      this.skill_service.saveHRIOFDetail(this.formdata.value, this.data['candidate_detail']['rrf_master_id'], this.data['candidate_detail']['_id'], status)
        .subscribe(
          response => {
            this.dialogRef.close();
            this.router.navigateByUrl('/employee_skill_view', { skipLocationChange: true }).then(() => {
              this.router.navigate(["hr_rrf_approve_list"]);
            });
            this.openSnackBar();
          }
        );
    }
  }
  openSnackBar() {
    this._snackBar.open('Interview Observation Form Saved Successfully', '', {
      duration: 2000,
    });
  }
}
