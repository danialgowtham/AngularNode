import { Component, OnInit } from '@angular/core';
import{UserService} from '../services/user.service';
import{sharedData} from '../services/shared.data';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent implements OnInit {
  employee_id:number;
  employee_info:any;
  profile_image:string;
  constructor( private users:UserService, private shared:sharedData) { }

  ngOnInit() {
    this.employee_id=this.shared.getEmployeeId()
    this.users.getById(this.employee_id )
    .pipe(first())
    .subscribe(response => {     
      this.employee_info =response[0]
      if(response[0] && response[0]['employee_photo']){
        this.profile_image="assets/employee_pics/"+response[0]['employee_photo'];
      }else{
          this.profile_image="assets/employee_pics/profile_picture.jpg";
      }        
    });
  }

}
