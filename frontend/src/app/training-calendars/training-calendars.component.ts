import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TrainingService } from '../services/training_service';
import { sharedData } from '../services/shared.data';
import {RedirectService} from '../services/redirect';
import { FormBuilder, FormControl, Validators,FormGroup } from '@angular/forms';

@Component({
  selector: 'app-training-calendars',
  templateUrl: './training-calendars.component.html',
  styleUrls: ['./training-calendars.component.css']
})

export class TrainingCalendarsComponent implements OnInit {
  training_detail: any = [];
  total_record: string;
  res: any;
  validations:any;
  constructor(private training: TrainingService, private formBuilder: FormBuilder, private router: Router, private shared: sharedData, private redirect :RedirectService) { }
  ngOnInit() {
      var data= [{}];
      this.training.getTrainings(data)
      .pipe(first())
      .subscribe(response => {
        this.training_detail = response['data']['data'];
        this.total_record = response['data']['totalCount'];
      });
    
  }
  changePage(page_number) {
    var data= [{}];
    data['page_number']=page_number
    this.training.getTrainings(data)
      .pipe(first())
      .subscribe(response => {
        this.training_detail = response['data']['docs'];
      });
  }
  redirectPage(page_route,training_id) {
    console.log(page_route);
    console.log(training_id);
    if(training_id)
    this.shared.setTrainingId(training_id)
    this.redirect.change_page(page_route);
  }
  onClickSearch(title,nom_type){
    console.log(title);
    console.log(nom_type);
    var data= [{}];
    data['title']=title;
    data['nomination_type']=nom_type;
    console.log(data);
    this.training.getTrainings(data)
      .pipe(first())
      .subscribe(response => {
        this.training_detail = response['data']['data'];
        this.total_record = response['data']['totalCount'];
      },
      error=>{
          console.log('error while searching');
      });
  }
  

}
