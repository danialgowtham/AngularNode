import { Component, OnInit } from '@angular/core';
import { RedirectService } from '../../services/redirect';
import { TopmenuService } from '../../shared/top-menu.subject'

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  is_manager: boolean;
  is_rmg: boolean;
  tabs: any = { home: "", employee: "", manager: "", rmg: "" }
  constructor(private redirect: RedirectService, private topmenu_service: TopmenuService) { }

  ngOnInit() {
    var jsonObj = JSON.parse(localStorage.currentUser);
    this.is_manager = jsonObj.is_manager;
    this.is_rmg = jsonObj.is_rmg;

  }
  ngAfterViewInit() {
    this.topmenu_service.getActiveTab().subscribe(active_tab => setTimeout(() => {
      this.clear_tabs();
      this.tabs[active_tab] = "active";
    }));
  }
  change_page(page_link, active) {
    this.redirect.change_page(page_link);
  }
  clear_tabs() {
    for (var key in this.tabs) {
      this.tabs[key] = "";
    }
  }

}
