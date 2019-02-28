import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { MatPaginator, MatTableDataSource } from '@angular/material';
import {  ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-employee-skill-view',
  templateUrl: './employee-skill-view.component.html',
  styleUrls: ['./employee-skill-view.component.css']
})
export class EmployeeSkillViewComponent implements OnInit {
  mapping_data: any;
  employee_detail:any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['strucure', 'competency_name', 'skill_name', 'experience_month', 'employee_proficiency', 'manager_proficiency'];
  constructor(private skill_service: EmployeeSkillMappingService,private route: ActivatedRoute,) {

  }

  ngOnInit() {
    var employee_id;
    if(this.route.snapshot.params.employee_id){
      employee_id=this.route.snapshot.params.employee_id;
    }else{
      var jsonObj = JSON.parse(sessionStorage.currentUser);
      employee_id = jsonObj.id
    }
    
    this.skill_service.getCompetencyMapping(employee_id,null)
      .subscribe(
        response => {
          this.mapping_data = new MatTableDataSource(response["data"]["skill"]);
          this.employee_detail=response["data"]["employee_detail"];
          this.mapping_data.paginator = this.paginator;
          console.log(this.employee_detail);
        }
      );
  }

}
