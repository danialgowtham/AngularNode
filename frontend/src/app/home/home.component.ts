import { Component, OnInit } from '@angular/core';
import { TopmenuService } from "../shared/top-menu.subject";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {

  flags: any = { career_flag: true, role_flag: false };
  employee_details = JSON.parse(localStorage.currentUser);
  constructor(private topmenu_service: TopmenuService) { }

  ngOnInit() {
    this.topmenu_service.setActiveTab("home");
  }

  change_body(flag) {
    this.clear_flag();
    this.flags[flag] = true;
  }
  clear_flag() {
    for (var key in this.flags) {
      this.flags[key] = false;
    }
  }

}
