import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { TechnicalIofComponent } from '../technical-iof/technical-iof.component';
import { BACK_END_URL } from '../shared/app.globals';

@Component({
  selector: 'app-iof-list',
  templateUrl: './iof-list.component.html',
  styleUrls: ['./iof-list.component.css']
})
export class IofListComponent implements OnInit {
  rrf_list_data: any;
  view_type = "employee";
  BACK_END_URL = BACK_END_URL;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['rrf_id', 'candidate_name', 'resume', 'role', 'action'];
  constructor( private skill_service: EmployeeSkillMappingService, public dialog: MatDialog) {

  }
  ngOnInit() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getIOFPendingList(jsonObj.id)
      .subscribe(
        response => {
          this.rrf_list_data = new MatTableDataSource(response["data"]);
          this.rrf_list_data.paginator = this.paginator;
        }
      );
  }

  openIOFForm(rrf_object) {
    const dialogRef = this.dialog.open(TechnicalIofComponent, { closeOnNavigation: true, width: '80vw', maxWidth: '80vw', maxHeight: '80vh', autoFocus: false, data: rrf_object, hasBackdrop: true, disableClose: true });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    //   if (result) {
    //     this.rrf_detail = result;
    //     this.candidate_detail = new MatTableDataSource(result["candidate_detail"].reverse())
    //     setTimeout(() => {
    //       this.candidate_detail.paginator = this.candidate_paginator;
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

}
