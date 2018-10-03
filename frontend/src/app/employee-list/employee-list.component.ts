import { Component, OnInit,NgModule} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import{UserService} from '../services/user.service';
import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';




@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
@NgModule({
  imports: [NgbPaginationModule, NgbAlertModule],
})

export class EmployeeListComponent implements OnInit {
    employee_detail: any = [];
    total_record:string;
    res:any;
    constructor(private http: HttpClient,private users:UserService) { }
   ngOnInit() {
    this.users.getUsers(1)
    .pipe(first())
    .subscribe(response => {
        this.employee_detail=response['data']['docs'];
        this.total_record=response['data']['total'];      
    });
   
   }
  changePage(page_number){
    this.users.getUsers(page_number)
    .pipe(first())
    .subscribe(response => {
        this.employee_detail=response['data']['docs'];    
    });
  }
}

