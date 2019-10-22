import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { RedirectService } from "../services/redirect";
import { Router } from '@angular/router';

@Component({
  selector: 'app-rrf-list',
  templateUrl: './rrf-list.component.html',
  styleUrls: ['./rrf-list.component.css']
})
export class RrfListComponent implements OnInit {
  rrf_list_data: any;
  employee_data: any;
  view_type = "employee";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['rrf_id', 'unit', 'band', 'role', 'submitted_on', 'status', 'action'];
  constructor(  private router: Router, private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, public redirect: RedirectService) {

  }
  ngOnInit() {
    if (this.router.url == "/rrf_request_list") {
      this.view_type = "employee";
    } else if (this.router.url == "/rrf_approve_list") {
      this.view_type = "manager";
      this.displayedColumns.splice(1, 0, "requested_by");
    } else {
      this.view_type = "rmg";
      this.displayedColumns.splice(1, 0, "requested_by");
    }

    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getRRFList(this.view_type, jsonObj.id)
      .subscribe(
        response => {
          this.rrf_list_data = new MatTableDataSource(response["data"]["rrf_list"]);
          this.employee_data = response["data"]["employee_detail"];
          this.rrf_list_data.paginator = this.paginator;
        }
      );
  }

  redirectPage(page_link, rrf_id) {
    if (page_link == "/rrf_approve")
      this.redirect.change_page_with_data(page_link, { rrf_id, view_type: this.view_type });
    else
      this.redirect.change_page_with_data(page_link, { rrf_id });
  }
  applyFilter(filterValue: string) {
    this.rrf_list_data.filter = filterValue.trim().toLowerCase();
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
