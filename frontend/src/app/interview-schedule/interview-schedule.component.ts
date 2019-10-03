import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-interview-schedule',
  templateUrl: './interview-schedule.component.html',
  styleUrls: ['./interview-schedule.component.css']
})
export class InterviewScheduleComponent implements OnInit {
  displayedColumns: string[] = ['level', 'interviewer_name', 'schedule_date', 'schedule_time'];
  dataSource: any = [];
  interview_panel: any = [];
  formdata: any;
  rrf_id: any;
  minDate = new Date();
  type: any;
  schedule_data: any = [];
  constructor(private _snackBar: MatSnackBar, private skill_service: EmployeeSkillMappingService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<InterviewScheduleComponent>, ) { };
  ngOnInit() {
    this.formdata = new FormGroup({
      interview_schedule: new FormArray([])
    });
    var index = 0;
    this.schedule_data = this.data['schedule_data'];
    this.type = this.data['type'];
    for (var level_object of this.data['rrf_detail']["interview_panel"]) {
      var employee_names = '';
      index++;
      for (var employee_object of level_object) {
        employee_names += employee_object["itemName"];
        employee_names += ", ";
      }
      this.interview_panel.push({ "level": "Level " + index, "employee_name": employee_names.slice(0, -2) });
    }
    this.add_form_control();
    this.dataSource = new MatTableDataSource(this.interview_panel);
  }
  add_form_control() {
    this.formdata.setControl('interview_schedule', new FormArray([]));
    let control = <FormArray>this.formdata.controls.interview_schedule;
    this.interview_panel.forEach((value, index) => {
      control.push(this.patchValues(index))
    });
  }
  patchValues(index) {
    var interview_date = '';
    var time_range = '';
    if (this.schedule_data.length > 0) {
      interview_date = this.schedule_data[index]['interview_date'];
      time_range = this.schedule_data[index]['time_range'];
    }
    return new FormGroup({
      interview_date: new FormControl(interview_date, Validators.compose([
        Validators.required])),
      time_range: new FormControl(time_range, Validators.compose([
        Validators.required, this.checkDate]))
    })
  }
  checkDate(formcontrol) {
    if (formcontrol.value && formcontrol.value[0] && formcontrol.value[1]) {
      var date1 = new Date(formcontrol.value[0]);
      var date2 = new Date(formcontrol.value[1]);
      var diff = Math.abs(date1.getTime() - date2.getTime());
      var diffMin = Math.floor(((diff / 1000) / 60));
      if (diffMin < 10) {
        return { "custom_time_check": true };
      }
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  save_date() {
    if (this.formdata.valid) {
      var jsonObj = JSON.parse(localStorage.currentUser);
      this.formdata.value["scheduled_by"] = jsonObj.id;
      this.formdata.value['interview_schedule'].forEach(function (element, index) {
        var start_time = new Date(element['time_range'][0]);
        var end_time = new Date(element['time_range'][1]);
        var interview_date = new Date(element['interview_date']);
        start_time.setDate(interview_date.getDate());
        start_time.setMonth(interview_date.getMonth());
        start_time.setFullYear(interview_date.getFullYear());
        end_time.setDate(interview_date.getDate());
        end_time.setMonth(interview_date.getMonth());
        end_time.setFullYear(interview_date.getFullYear());
        element['time_range'][0] = start_time.toJSON();
        element['time_range'][1] = end_time.toJSON();
        element['level'] = index;
      });
      this.skill_service.scheduleInterview(this.formdata.value, this.data['rrf_id'], this.data['candidate_id'])
        .subscribe(
          response => {
            this.dialogRef.close(response['data']);
            this.openSnackBar();
          }
        );
    }
  }
  openSnackBar() {
    this._snackBar.open('Interview Sceduled Successfully', '', {
      duration: 2000,
    });
  }

}
