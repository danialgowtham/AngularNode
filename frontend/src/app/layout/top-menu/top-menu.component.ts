import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RedirectService } from '../../services/redirect';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  is_manager:boolean;
  constructor(private redirect: RedirectService) { }

  ngOnInit() {
    var jsonObj = JSON.parse(sessionStorage.currentUser);
    this.is_manager=jsonObj.is_manager;
  }
  change_page(page_link) {
    this.redirect.change_page(page_link);
    console.log(page_link);
  }

}
