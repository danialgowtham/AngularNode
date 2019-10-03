import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-technical-iof',
  templateUrl: './technical-iof.component.html',
  styleUrls: ['./technical-iof.component.css']
})
export class TechnicalIofComponent implements OnInit {
  formdata: any;
  overallRating: any = 0;
  constructor(private router: Router, private _snackBar: MatSnackBar, private skill_service: EmployeeSkillMappingService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TechnicalIofComponent>) { }

  ngOnInit() {
    this.formdata = new FormGroup({
      skill_detail: new FormArray([
        new FormGroup({ primary_skill: new FormControl(""), overall_experience: new FormControl(""), relevant_experience: new FormControl("") }),
        new FormGroup({ primary_skill: new FormControl(""), overall_experience: new FormControl(""), relevant_experience: new FormControl("") })
      ]),
      qualification_detail: new FormGroup({ highest_qualification: new FormControl(""), year_of_passing: new FormControl("") }),
      interview_performance: new FormGroup({
        primary_skill_and_proficiency: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        secondary_skill_and_proficiency: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        clarity_of_technical_concept: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        communication: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        project_management: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        team_management: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        problem_solving_skill: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        creativity_and_innovation: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        tool_or_written_test_taken: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        fitment_to_job_description: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
        others: new FormGroup({ comments: new FormControl(""), rating: new FormControl("") }),
      }),
      evaluation_result_and_remarks: new FormGroup({
        evaluation_remarks: new FormControl(""),
        evaluation_result: new FormControl("", [Validators.required])
      }),
      training_requirements: new FormControl("")
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  keyPress(event: any) {
    const pattern = /[0-5]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  calculate_overall_rating() {
    const rating_object = this.formdata.value.interview_performance;
    var overall_array = Object.keys(rating_object);
    var current_rating = 0;
    var length = 0;
    for (var i = 0; i < overall_array.length; i++) {
      if (rating_object[overall_array[i]]['rating']) {
        length++;
        current_rating = Number(current_rating) + Number(rating_object[overall_array[i]]['rating'])
      }
    }
    this.overallRating = current_rating / length;
  }
  save_iof() {
    if (this.formdata.valid) {
      var jsonObj = JSON.parse(localStorage.currentUser);
      var employee_id = jsonObj.id;
      this.formdata.value["submitted_by"] = employee_id;
      if (this.formdata.value['evaluation_result_and_remarks']['evaluation_result'] == 'Selected') {
        if (Number(this.data['candidate_detail']['interview_schedule']['level']) == (Number(this.data['interview_round']) - 1)) {
          var status = 'Technical Round Cleared';
        } else {
          var level = Number(this.data['candidate_detail']['interview_schedule']['level']) + 1;
          var status = 'Level-' + level + ' Cleared';
        }
      } else {
        var status = 'Rejected'
      }
      this.skill_service.saveIOFDetail(this.formdata.value, this.data['candidate_detail']['rrf_master_id'], this.data['candidate_detail']['_id'], this.data['candidate_detail']['interview_schedule']['_id'], status)
        .subscribe(
          response => {
            this.dialogRef.close();
            this.router.navigateByUrl('/employee_skill_view', { skipLocationChange: true }).then(() => {
              this.router.navigate(["iof_list"]);
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
