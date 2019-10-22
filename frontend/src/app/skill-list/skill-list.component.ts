import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { RedirectService } from "../services/redirect";
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('200ms cubic-bezier(0.1, 0.1, 0.1, 0.1)')),
    ]),
  ]
})
export class SkillListComponent implements OnInit {
  skill_list_data: any;
  form_data: any;
  sub_practices: any = [];
  practices: any = [];
  units: any = [];
  competency_list: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['unit', 'practice', 'sub_practice', 'competency', 'action'];
  constructor(private router: Router, private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, public redirect: RedirectService) {
  }
  ngOnInit() {
    this.form_data = new FormGroup({
      unit: new FormControl(""),
      practice: new FormControl(""),
      sub_practice: new FormControl(""),
      competency: new FormControl(""),
    });
    this.form_data.controls.unit.valueChanges.subscribe(value => {
      if (value)
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
      if (value)
        this.skill_service.getUnit(value)
          .subscribe(
            response => {
              this.form_data.controls["sub_practice"].setValue(null);
              this.sub_practices = response
            }
          );
    });
    this.form_data.controls.sub_practice.valueChanges.subscribe(value => {
      if (value)
        this.skill_service.getCompetency(value, [])
          .subscribe(
            response => {
              this.competency_list = response
            }
          );
    });

    this.skill_service.getUnit("0")
      .subscribe(
        response => {
          this.units = response
        }
      );
    this.onSubmit();
  }

  onSubmit() {
    this.skill_service.getOrganizationSkillList(this.form_data.value)
      .subscribe(
        response => {
          this.skill_list_data = new MatTableDataSource(response["data"]);
          this.skill_list_data.paginator = this.paginator;
        }
      );
  }

  redirectPage(page_link, rrf_id) {
    this.redirect.change_page_with_data(page_link, { rrf_id });
  }
  ngOnDestroy() {
    this.dialog.closeAll();
  }


}
