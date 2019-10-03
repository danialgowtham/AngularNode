import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RedirectService } from "../services/redirect";
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BACK_END_URL } from '../shared/app.globals';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-rrf-candidate-approve',
  templateUrl: './rrf-candidate-approve.component.html',
  styleUrls: ['./rrf-candidate-approve.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.1, 0.1, 0.1, 0.1)')),
    ]),
  ]
})
export class RrfCandidateApproveComponent implements OnInit {
  rrf_list_data: any;
  employee_data: any;
  BACK_END_URL = BACK_END_URL;
  view_type = "HR";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['rrf_id', 'requested_by', 'unit', 'band', 'role', 'candidate_name', 'status', 'action'];
  constructor(private router: Router, private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, public redirect: RedirectService) {

  }
  ngOnInit() {
    if (this.router.url == "/rrf_candidate_approve_buh") {
      this.view_type = "BUH";
    } else if (this.router.url == "/rrf_candidate_approve_rmg") {
      this.view_type = "RMG";
    }
    this.getRRFCandidateList();
  }
  open_competency_popup(candidate_id) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(CandidateApproveModal, { closeOnNavigation: true, data: { candidate_id, view_type: this.view_type }, hasBackdrop: true, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      this.getRRFCandidateList();
    });
  }
  getRRFCandidateList() {
    this.skill_service.getRRFCandidateApproveList(this.view_type)
      .subscribe(
        response => {
          this.rrf_list_data = new MatTableDataSource(response["data"]["rrf_candidate_approve_list"]);
          this.employee_data = response["data"]["employee_detail"];
          this.rrf_list_data.paginator = this.paginator;
        }
      );
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
@Component({
  selector: 'candidate-approve-modal',
  templateUrl: 'candidate-approve-modal.html',
  styleUrls: ['./rrf-candidate-approve.component.css'],
  styles: ['.back_button{display: flex;justify-content: space-between;}textarea {resize: none;}']
})
export class CandidateApproveModal {
  constructor(private skill_service: EmployeeSkillMappingService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CandidateApproveModal>, ) { };
  reject_reason: any;
  ngOnInit() {
    this.reject_reason = new FormControl('', [Validators.required]);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  candidate_feedback(type) {
    if (type == "Approved") {
      this.reject_reason.setValidators(null);
    } else {
      this.reject_reason.setValidators([Validators.required]);
    }
    this.reject_reason.updateValueAndValidity();
    if (this.reject_reason.status == "VALID") {
      var jsonObj = JSON.parse(localStorage.currentUser);
      var status = this.data.view_type + " " + type;
      this.skill_service.saveRRFCandidateApprove(this.data.candidate_id, status, jsonObj.id)
        .subscribe(
          response => {
            this.dialogRef.close();
          }
        );
    }
  }
}
