import { Component, OnInit,NgModule} from '@angular/core';
import { Router} from '@angular/router';
import { first } from 'rxjs/operators';
import{UserService} from '../services/user.service';
import{sharedData} from '../shared/shared.data';
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
    constructor(private users:UserService, private shared:sharedData,private router: Router) { }
   ngOnInit() {
    this.users.getUsers(1)
    .subscribe(response => {
        this.employee_detail=response['data']['docs'];
        this.total_record=response['data']['total'];      
    });
   
   }
  changePage(page_number){
    this.users.getUsers(page_number)
    .subscribe(response => {
        this.employee_detail=response['data']['docs'];    
    });
  }
  view_employee_details(employee_id){
    this.shared.setEmployeeId(employee_id)
    this.router.navigate(['/employee_view']);
  }
}

