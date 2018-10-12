import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first,tap } from 'rxjs/operators';
import{UserService} from '../services/user.service';
// import { User } from '../models/user';

@Component({
   selector: 'app-mainpage',
   templateUrl: './mainpage.component.html',
})

export class MainpageComponent implements OnInit {
    user_name:string;
    profile_pic:string;
    designation:string;
    country_city:string;
    manager_name:string;
    structure_name:string;
    band_name:string;
    res:any;
    constructor(private http: HttpClient,private users:UserService) { }
   ngOnInit() {
    var jsonObj=JSON.parse(localStorage.currentUser);
    this.user_name=jsonObj.username+' '+jsonObj.first_name+' '+jsonObj.last_name;
    this.designation=jsonObj.designation;
    this.country_city=jsonObj.city+', '+jsonObj.country;
    this.structure_name=jsonObj.structure_name;
    this.band_name=jsonObj.band_name;
    
    this.users.getById(jsonObj.manager)
    .pipe(first())
    .subscribe(response => {
        this.res=response[0];
        this.manager_name=this.res.username+' '+this.res.first_name+' '+this.res.last_name;
    });
    // console.log(this.res);
    
    if(jsonObj.employee_photo){
        this.profile_pic="assets/employee_pics/"+jsonObj.employee_photo;
    }else{
        this.profile_pic="assets/employee_pics/profile_picture.jpg";
    }
    // document.getElementById("employee_name").innerHTML=jsonObj.first_name+' '+jsonObj.last_name;
   }
   onClickSubmit(data) {
      
   }
}
