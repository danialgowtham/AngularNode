import { Component, OnInit } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-employee-skill-approve',
  templateUrl: './employee-skill-approve.component.html',
  styleUrls: ['./employee-skill-approve.component.css']
})
export class EmployeeSkillApproveComponent implements OnInit {
  mapping_data= new Array();
  employee_detail: any;
  proficiencies: any;
  approve_data = {};
  employee_id:any;
  constructor(private skill_service: EmployeeSkillMappingService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    if (this.route.snapshot.params.employee_id) {
     this.employee_id = this.route.snapshot.params.employee_id;
    }
    this.skill_service.getCompetencyMapping(this.employee_id, "m")
      .subscribe(
        response => {
          this.mapping_data = response["data"]["skill"];
          this.employee_detail = response["data"]["employee_detail"];
          console.log(response["data"]);
        }
      )
    this.skill_service.getProficiency()
      .subscribe(
        response => {
          this.proficiencies = response["data"];
          console.log(response["data"]);
        }
      );
  }
  update_approve_list(ess_id, value) {
    if (this.approve_data[ess_id])
      delete this.approve_data[ess_id]
    this.approve_data[ess_id] = value;
    console.log(this.approve_data);
  }
  check_disable() {
    if (Object.keys(this.approve_data).length == this.mapping_data.length)
      return false;
    else
      return true;
  }
  submit_data(){
    var jsonObj = JSON.parse(sessionStorage.currentUser);
    this.skill_service.saveManagerProficiency(this.approve_data,this.employee_id,jsonObj.id)
      .subscribe(
        response => {
          console.log(response)
          this.router.navigate(['/employee_skill_approve_list']);
        }
      )
  }

}
