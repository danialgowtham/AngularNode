import { Component, OnInit, Output } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";

@Component({
  selector: 'app-about-information',
  templateUrl: './about-information.component.html',
  styleUrls: ['./about-information.component.css']
})
export class AboutInformationComponent implements OnInit {

  constructor(private skill_service: EmployeeSkillMappingService) { }
  @Output() employee_detail: any;
  ngOnInit() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.skill_service.getEmployeeDetail(jsonObj.id)
      .subscribe(
        response => {
          this.employee_detail = response["data"];
        });
  }

}
