import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { RedirectService } from "../services/redirect";
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-rrf-report',
  templateUrl: './rrf-report.component.html',
  styleUrls: ['./rrf-report.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.1, 0.1, 0.1, 0.1)')),
    ]),
  ]
})
export class RrfReportComponent implements OnInit {
  rrf_list_data: any;
  form_data: any;
  employee_data: any;
  view_type = "employee";
  minDate = new Date('2019-08-01');
  filtered_employee_list: any = {};
  Object = Object;
  sub_practices: any = [];
  practices: any = [];
  units: any = [];
  status_list: any = ['Submitted', 'RM Approved', 'RM Rejected', 'RMG Approved', 'RMG Rejected', 'Closed'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['rrf_id', 'requested_by', 'unit', 'role', 'submitted_on', 'status', 'action'];
  constructor( private router: Router, private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, public redirect: RedirectService) {
  }
  ngOnInit() {
    this.form_data = new FormGroup({
      unit: new FormControl(""),
      practice: new FormControl(""),
      sub_practice: new FormControl(""),
      requested_by: new FormControl(""),
      from_date: new FormControl(""),
      to_date: new FormControl(""),
      status: new FormControl(""),
    });
    this.form_data.controls.unit.valueChanges.subscribe(value => {
      this.skill_service.getUnit(value)
        .subscribe(
          response => {
            this.form_data.controls["practice"].setValue(null);
            this.form_data.controls["sub_practice"].setValue(null);
            this.sub_practices = [];
            this.practices = response;
          }
        )
    });
    this.form_data.controls.practice.valueChanges.subscribe(value => {
      this.skill_service.getUnit(value)
        .subscribe(
          response => {
            this.form_data.controls["sub_practice"].setValue(null);
            this.sub_practices = response
          }
        );
    });
    this.form_data.controls.from_date.valueChanges.subscribe(value => {
      this.form_data.controls["to_date"].setValue(null);
    });
    this.skill_service.getUnit("0")
      .subscribe(
        response => {
          this.units = response
        }
      );
    this.onSubmit();
  }
  update_employee_list(event) {
    var value = event.target.value;
    const filterValue = value.toLowerCase();
    if (filterValue) {
      this.skill_service.getFilteredEmployeeList(filterValue)
        .subscribe(
          response => {
            this.filtered_employee_list = response["data"];
          }
        );
    } else {
      this.filtered_employee_list = {};
    }
  }
  onSubmit() {
    this.skill_service.getRRFReportList(this.form_data.value)
      .subscribe(
        response => {
          this.rrf_list_data = new MatTableDataSource(response["data"]["rrf_list"]);
          this.employee_data = response["data"]["employee_detail"];
          this.rrf_list_data.paginator = this.paginator;
        }
      );
  }
  redirectPage(page_link, rrf_id) {
    this.redirect.change_page_with_data(page_link, { rrf_id });
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }
  displayFn(employee): string | undefined {
    return employee ? employee.employee_name : undefined;
  }
}
