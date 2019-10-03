import { Component, OnInit, Output } from '@angular/core';
import { EmployeeSkillMappingService } from "../services/employee_skill_mapping.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PushNotificationService } from "../services/push_notification.service";

@Component({
  selector: 'app-employee-skill-approve',
  templateUrl: './employee-skill-approve.component.html',
  styleUrls: ['./employee-skill-approve.component.css']
})
export class EmployeeSkillApproveComponent implements OnInit {
  mapping_data = new Array();
  @Output() employee_detail: any;
  proficiencies: any;
  approve_data = {};
  employee_id: any;
  roles: any;
  role_error: Boolean = false;
  current_role: any;
  constructor(private push_notification_service: PushNotificationService, private skill_service: EmployeeSkillMappingService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.params.employee_id) {
      this.employee_id = this.route.snapshot.params.employee_id;
    }
    this.skill_service.getCompetencyMapping(this.employee_id, "m", null)
      .subscribe(
        response => {
          this.mapping_data = response["data"]["skill"];
          this.employee_detail = response["data"]["employee_detail"];
          this.current_role = response["data"]["current_role"];
          for (var skill_value of this.mapping_data) {
            this.approve_data[skill_value.employee_skill_set_id] = skill_value.employee_proficiency_id;
          }
        }
      )
    this.skill_service.getRole(this.employee_id)
      .subscribe(
        response => {
          this.roles = response["data"]["role_list"];
        }
      )
    this.skill_service.getProficiency()
      .subscribe(
        response => {
          this.proficiencies = response["data"];
        }
      );
  }
  update_approve_list(ess_id, value) {
    if (this.approve_data[ess_id])
      delete this.approve_data[ess_id]
    this.approve_data[ess_id] = value;
  }
  check_disable() {
    if (Object.keys(this.approve_data).length == this.mapping_data.length)
      return false;
    else
      return true;
  }
  submit_data(current_role) {
    if (current_role) {
      this.role_error = false;
      var jsonObj = JSON.parse(localStorage.currentUser);
      this.skill_service.saveManagerProficiency(this.approve_data, this.employee_id, jsonObj.id, current_role)
        .subscribe(
          response => {
            this.push_notification_service.emitEventOnEmployeeSkillApprove({ "show_employee_id": this.employee_id, "first_name": jsonObj.first_name })
            this.router.navigate(['/employee_skill_approve_list']);
          }
        )
    } else {
      this.role_error = true;
    }

  }

}
