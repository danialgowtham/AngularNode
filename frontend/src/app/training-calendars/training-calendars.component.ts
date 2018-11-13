import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { TrainingService } from '../services/training_service';
import { sharedData } from '../shared/shared.data';
import {RedirectService} from '../services/redirect';
import * as FileSaver from 'file-saver';


// import {MatPaginator, MatTableDataSource} from '@angular/material';

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
  //angular material table
  // displayedColumns: string[] = ['title', 'venue', 'date', 'band','unit','maximum_nomination','training_type','status','action'];
  // dataSource:any;
 
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private training: TrainingService, private router: Router, private shared: sharedData, private redirect :RedirectService) { }
  ngOnInit() {
 
      var data= [{}];
      this.training.getTrainings(data)
      .pipe(first())
      .subscribe(response => {
        this.training_detail = response['data']['data'];
        this.total_record = response['data']['totalCount'];
        //angular material table
        // this.dataSource = new MatTableDataSource( response['data']['data']);
        // this.dataSource.paginator = this.paginator;
      });
    
  }
  changePage(page_number) {
    var data= [{}];
    data['page_number']=page_number
    this.training.getTrainings(data)
      .pipe(first())
      .subscribe(response => {
        //angular material table
        // this.dataSource = new MatTableDataSource( response['data']['data']);
        // this.dataSource.paginator = this.paginator;
        this.training_detail = response['data']['data'];
      });
  }
  redirectPage(page_route,training_id) {
    console.log(page_route);
    console.log(training_id);
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
  onClickExport(title,nom_type){
    console.log(title);
    console.log(nom_type);
    var data= [{}];
    data['title']=title;
    data['nomination_type']=nom_type;
    data['type']='export';
    console.log(data);
    this.training.getTrainings(data)
      .pipe()
      .subscribe(res => {
        // new Blob([res],{ type: 'application/vnd.ms-excel' });
           FileSaver.saveAs(res,'training_calander.xlsx');
      },
      error=>{
        console.log(error);
          console.log('Error while Export');
      });
  }
  

}
