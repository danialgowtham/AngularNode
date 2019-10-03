import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { HrRrfApproveComponent } from '../hr-rrf-approve/hr-rrf-approve.component';
import { BACK_END_URL } from '../shared/app.globals';
@Component({
  selector: 'app-hr-rrf-approve-list',
  templateUrl: './hr-rrf-approve-list.component.html',
  styleUrls: ['./hr-rrf-approve-list.component.css']
})
export class HrRrfApproveListComponent implements OnInit {
  rrf_list_data: any;
  view_type = "employee";
  BACK_END_URL = BACK_END_URL;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['rrf_id', 'candidate_name', 'resume', 'role', 'status', 'action'];
  constructor(private skill_service: EmployeeSkillMappingService, public dialog: MatDialog) {

  }
  ngOnInit() {
    this.skill_service.getHrApprovePendingList()
      .subscribe(
        response => {
          this.rrf_list_data = new MatTableDataSource(response["data"]);
          this.rrf_list_data.paginator = this.paginator;
        }
      );
  }

  openIOFForm(rrf_object) {
    const dialogRef = this.dialog.open(HrRrfApproveComponent, { closeOnNavigation: true, width: '80vw', maxWidth: '80vw', maxHeight: '80vh', autoFocus: false, data: rrf_object, hasBackdrop: true, disableClose: true });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
