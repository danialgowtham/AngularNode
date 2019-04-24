import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-career-ladder-information',
  templateUrl: './career-ladder-information.component.html',
  styleUrls: ['./career-ladder-information.component.css']
})
export class CareerLadderInformationComponent implements OnInit {
  jsonObj = JSON.parse(localStorage.currentUser);
  constructor() { }

  ngOnInit() {
  }
}
