import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-internal-job-view',
  templateUrl: './internal-job-view.component.html',
  styleUrls: ['./internal-job-view.component.css']
})
export class InternalJobViewComponent implements OnInit {
  @Output() mapping_detail: any = [];
  @Output() view_type: String = "employee";
  @Output() no_popup: Boolean = true;
  employee_detail: any;
  job_post_id: any;
  already_applied: any = [];
  displayedColumns: string[] = ['competency_name', 'skill_name'];

  constructor(private skill_service: EmployeeSkillMappingService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<InternalJobViewComponent>) { };

  ngOnInit() {
    if (this.data["employee_id"])
      this.skill_service.getEmployeeDetail(this.data["employee_id"])
        .subscribe(
          response => {
            this.employee_detail = response["data"];
          });
    if (this.data["mapping_detail"])
      this.mapping_detail['mapping_data'] = this.data["mapping_detail"];
  }

  closeDialog() {
    this.dialogRef.close();
  }
  getBase64Image(img) {
    var canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);
    return dataURL;
  }
  public captureScreen() {
    html2canvas(document.getElementById('contentToConvert')).then(function (canvas) {
      var img = canvas.toDataURL("image/png");
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var doc = new jsPDF('p', 'mm', 'a4');
      var position = 0;
      doc.addImage(img, 'PNG', 0, position, imgWidth, imgHeight)
      doc.save('Resume.pdf');
    });
  }

}
