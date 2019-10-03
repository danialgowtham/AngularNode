import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { FileValidator } from 'ngx-material-file-input';
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BACK_END_URL } from '../shared/app.globals';
import { InterviewScheduleComponent } from '../interview-schedule/interview-schedule.component'
import { TechnicalIofViewComponent } from '../technical-iof-view/technical-iof-view.component';
import { HrRrfApproveViewComponent } from '../hr-rrf-approve-view/hr-rrf-approve-view.component';
import 'flatpickr/dist/flatpickr.css';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-rrf-rmg-activity',
  templateUrl: './rrf-rmg-activity.component.html',
  styleUrls: ['./rrf-rmg-activity.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.1, 0.1, 0.1, 0.1)')),
    ]),
  ]
})
export class RrfRmgActivityComponent implements OnInit {

  @ViewChild('file') file;
  @ViewChild('candidate_paginator') candidate_paginator: MatPaginator;
  @Input() rrf_id: any;
  @Input() view_type: any;
  @Input() rrf_detail: any;
  displayedColumns: string[] = ['candidate_name', 'candidate_email', 'resume', 'iof_detail', 'status', 'interview_schedule', 'file_upload'];
  form_data: any;
  BACK_END_URL = BACK_END_URL;
  FRONT_END_URL = "http://10.18.1.59:4200/";
  candidate_detail: any;
  maxSize: number = 2097152;
  accepted_file_exetension = ['pdf', 'doc', 'docx'];
  uploaded_candidate_details: any = [];
  duplicate_error_flag: boolean = false;
  grand_ctc: any;
  constructor(private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, ) { }

  ngOnInit() {
    this.form_data = new FormGroup({
      candidate_name: new FormControl("", [Validators.required]),
      candidate_email: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      candidate_basic_information: new FormControl(""),
      resume: new FormControl("", [FileValidator.maxContentSize(this.maxSize), Validators.required]
      )
    });
    this.grand_ctc = new FormControl('', [Validators.required]);
    this.form_data.controls.resume.valueChanges.subscribe(value => {
      if (value) {
        var uploaded_file_type = value.fileNames.split('.').pop();
        if (!this.accepted_file_exetension.includes(uploaded_file_type)) {
          this.form_data.controls.resume.setValue(null, { emitEvent: false });
        }
      }

    });
    this.candidate_detail = new MatTableDataSource(this.rrf_detail['candidate_detail'].reverse())
    setTimeout(() => {
      this.candidate_detail.paginator = this.candidate_paginator;
    });
  }
  add_candidate() {
    if (this.form_data.status == 'VALID') {
      this.skill_service.candidateDuplicateCheck(this.rrf_id, this.form_data.value.candidate_email)
        .subscribe(
          response => {
            if (response['data'] == true) {
              this.duplicate_error_flag = true;
            } else {
              this.duplicate_error_flag = false;
              this.save_candidate_detail();
            }
          }
        )
    }
  }
  save_candidate_detail() {
    if (this.form_data.status == 'VALID') {
      var jsonObj = JSON.parse(localStorage.currentUser);
      var employee_id = jsonObj.id;
      this.form_data.value.uploaded_by = employee_id;
      const formData = new FormData();
      formData.append("file", this.form_data.value.resume.files[0]);
      delete this.form_data.value.resume;
      Object.keys(this.form_data.value).forEach((key) => {
        formData.append(key, this.form_data.value[key]);
      });
      this.skill_service.uploadCandidate(this.rrf_id, formData)
        .subscribe(
          response => {
            this.form_data.reset();
            this.candidate_detail = new MatTableDataSource(response["data"].reverse())
            setTimeout(() => {
              this.candidate_detail.paginator = this.candidate_paginator;
            });
          }
        );
    }
  }
  reset_form() {
    this.form_data.reset();
  }

  addFiles() {
    this.file.nativeElement.click();
  }
  openInterviewSchedule(type, schedule_data, candidate_id) {
    const dialogRef = this.dialog.open(InterviewScheduleComponent, { closeOnNavigation: true, width: '80vw', maxWidth: '80vw', maxHeight: '80vh', autoFocus: false, data: { rrf_detail: this.rrf_detail, rrf_id: this.rrf_id, candidate_id, type, schedule_data }, hasBackdrop: true, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.candidate_detail = new MatTableDataSource(result.reverse())
        setTimeout(() => {
          this.candidate_detail.paginator = this.candidate_paginator;
        });
      }
    });
  }
  openIOF(iof_detail, type) {
    if (type == 'hr') {
      this.dialog.open(HrRrfApproveViewComponent, { closeOnNavigation: true, width: '80vw', maxWidth: '80vw', maxHeight: '80vh', autoFocus: false, data: iof_detail, hasBackdrop: true, disableClose: true });
    } else {
      this.dialog.open(TechnicalIofViewComponent, { closeOnNavigation: true, width: '80vw', maxWidth: '80vw', maxHeight: '80vh', autoFocus: false, data: iof_detail, hasBackdrop: true, disableClose: true });
    }
  }
  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  generate_offer_letter(candidate_id) {
    this.skill_service.generateOfferLetter(candidate_id, this.grand_ctc.value)
      .subscribe(
        response => {
          console.log(response)
          this.dialog.closeAll();
          this.dialog.open(OfferLetterPreviewModal, { maxHeight: '90vh', closeOnNavigation: true, data: response["data"], hasBackdrop: true, disableClose: true });

        }
      );
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }


}

@Component({
  selector: 'offer-letter-preview',
  templateUrl: 'offer-letter-preview.html',
  styleUrls: ['./rrf-rmg-activity.component.css'],
  styles: ['.back_button{display: flex;justify-content: space-between;}textarea {resize: none;}']
})
export class OfferLetterPreviewModal {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<OfferLetterPreviewModal>, ) { };
  src: any;
  BACK_END_URL = BACK_END_URL;
  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
