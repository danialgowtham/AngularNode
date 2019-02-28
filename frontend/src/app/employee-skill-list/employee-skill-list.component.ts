import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource } from '@angular/material';
import {RedirectService} from '../services/redirect';

@Component({
  selector: 'app-employee-skill-list',
  templateUrl: './employee-skill-list.component.html',
  styleUrls: ['./employee-skill-list.component.css']
})
export class EmployeeSkillListComponent implements OnInit {
  mapping_data: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['employee_name', 'band_name', 'submitted_on', 'status', 'action'];
  constructor(private skill_service: EmployeeSkillMappingService,private redirect :RedirectService) {

  }
  ngOnInit() {
    var jsonObj = JSON.parse(sessionStorage.currentUser);
    this.skill_service.getEmployeeSkillMappingList(jsonObj.id)
      .subscribe(
        response => {
          console.log(response);
          this.mapping_data = new MatTableDataSource(response["data"]);
          this.mapping_data.paginator = this.paginator;
          console.log(response["data"])
        }
      );
  }
  redirectPage(page_link,employee_id){
    let url_data={"employee_id":employee_id};
    this.redirect.change_page_with_data(page_link,url_data);
  }

}
