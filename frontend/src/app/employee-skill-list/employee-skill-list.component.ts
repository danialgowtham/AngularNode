import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { EmployeeViewPopupComponent } from '../employee-view-popup/employee-view-popup';
import {RedirectService} from "../services/redirect"

@Component({
  selector: 'app-employee-skill-list',
  templateUrl: './employee-skill-list.component.html',
  styleUrls: ['./employee-skill-list.component.css']
})
export class EmployeeSkillListComponent implements OnInit {
  mapping_data: any;
  employee_data: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['employee_name', 'band_name', 'submitted_on', 'status', 'action'];
  constructor(private skill_service: EmployeeSkillMappingService, public dialog: MatDialog, public redirect : RedirectService) {

  }
  ngOnInit() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getReporteeSkillMappingList(jsonObj.id)
      .subscribe(
        response => {
          this.mapping_data = new MatTableDataSource(response["data"]["employee_skill_data"]);
          this.employee_data = response["data"]["employee_detail"]
          this.mapping_data.paginator = this.paginator;
        }
      );
  }
  openEmployeeSkill(employee_id) {
    this.dialog.open(EmployeeViewPopupComponent, { closeOnNavigation:true, width: '90vw',height:  '80vh', maxWidth: '90vw',maxHeight: '80vh', autoFocus: false, data: employee_id, hasBackdrop: false });
  }

  redirectPage(page_link,employee_id){
    this.redirect.change_page_with_data(page_link,{employee_id});
  }
  ngOnDestroy (){
    this.dialog.closeAll();
  }

}
