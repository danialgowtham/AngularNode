import { Component, OnInit } from '@angular/core';
import { RedirectService } from '../../services/redirect';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  is_manager: boolean;
  is_rmg: boolean;
  tabs: any = { home: "active", employee: "", manager: "", rmg: "" }
  employee_tab: string = "active";
  manager_tab: string;
  rmg_tab: string;
  constructor(private redirect: RedirectService) { }

  ngOnInit() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.is_manager = jsonObj.is_manager;
    this.is_rmg = jsonObj.is_rmg;
  }
  change_page(page_link, active) {
    this.clear_tabs();
    this.tabs[active] = "active";
    this.redirect.change_page(page_link);
  }
  clear_tabs() {
    for (var key in this.tabs) {
      this.tabs[key] = "";
    }
  }

}
