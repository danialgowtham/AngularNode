import { Component, OnInit, ViewChild, Input, Inject, Output } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-job-view',
  templateUrl: './employee-job-view.component.html',
  styleUrls: ['./employee-job-view.component.css']
})
export class EmployeeJobViewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() mapping_detail: any;
  @Input() view_type: any;
  @Input() no_popup: any;
  mapping_data: any;
  job_fitment_score: Number = 0;
  employee_search: Boolean = false;
  disable_popup: Boolean = false;
  displayedColumns: string[] = ['competency_name', 'skill_name', 'skill_proficiency_name', 'employee_proficiency', 'color_code'];
  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    var url = this.router.url.split(";");
    if (this.view_type == "employee") {
      this.employee_search = true;
      var updated_mapping_data = this.mapping_detail["mapping_data"]["job_detail"]
    } else {
      this.displayedColumns.unshift("checked");
      var updated_mapping_data = this.mapping_detail["mapping_data"]["job_detail"].map(function (value, index) {
        value["checked"] = true;
        return value;
      });
    }

    if (this.no_popup) {
      this.disable_popup = true;
    }
    this.job_fitment_score = this.mapping_detail["mapping_data"]["fitment_score_percentage"];
    this.mapping_data = new MatTableDataSource(updated_mapping_data);
    this.mapping_data.paginator = this.paginator;
  }
  updateJobDetail() {
    var fitment_score = 0;
    var disseleceted_job_detail_object = [];
    this.mapping_detail["mapping_data"]["job_detail"].forEach(function (value) {
      if (!value.checked)
        disseleceted_job_detail_object.push(value.job_competency_id);
    });

    for (var i = 0; i < this.mapping_detail["mapping_data"]["job_detail"].length; i++) {
      if (!disseleceted_job_detail_object.includes(this.mapping_detail["mapping_data"]["job_detail"][i]["job_competency_id"])) {
        fitment_score += Number(this.mapping_detail["mapping_data"]["job_detail"][i]["fitment_score"]);
      }
    }
    var score = (100 / (this.mapping_detail["mapping_data"]["job_detail"].length - disseleceted_job_detail_object.length)) * fitment_score;
    if (isNaN(score)) {
      this.job_fitment_score = 0
    } else {
      this.job_fitment_score = Math.round(Number(score));
    }
  }

  open_competency_popup(definition, description, proficiency_name) {
    this.dialog.closeAll();
    this.dialog.open(Popup, { closeOnNavigation: true, data: { definition, description, proficiency_name, type: "competency" }, hasBackdrop: true,disableClose: true });
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }


}
@Component({
  selector: 'competency-description',
  templateUrl: 'competency-description.html',
  styles: ['.back_button{display: flex;justify-content: space-between;}']
})
export class Popup {
  constructor(@Inject(MAT_DIALOG_DATA) public competency_data: any, public dialogRef: MatDialogRef<Popup>, ) { };
  skill_array: any = [];
  job_code_data: any = [];
  ngOnInit() {
    if (this.competency_data.type == "skill") {
      var start = 0;
      for (var index in this.competency_data.proficiency_list) {
        if (this.competency_data.proficiency_list[index]["experience_month"] != "999") {
          this.skill_array.push({ proficiency_name: this.competency_data.proficiency_list[index]["proficiency_name"], experience_month: start + " - " + this.competency_data.proficiency_list[index]["experience_month"] })
        } else {
          this.skill_array.push({ proficiency_name: this.competency_data.proficiency_list[index]["proficiency_name"], experience_month: start + " and Above" })
        }
        start = Number(this.competency_data.proficiency_list[index]["experience_month"]) + 1;
      }
    }
    this.job_code_data = [
      { name: "AT2", code: "1" },
      { name: "A1", code: "2" },
      { name: "A2", code: "3" },
      { name: "L1", code: "4" },
      { name: "L2", code: "5" },
      { name: "M1", code: "6" },
      { name: "M2", code: "7" },
      { name: "M3", code: "8" },
    ];

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
