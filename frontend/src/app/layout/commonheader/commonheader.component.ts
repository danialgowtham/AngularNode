import { Component, OnInit} from '@angular/core';
import { AuthenticationService } from '../../services';
import { Router} from '@angular/router';

@Component({
  selector: 'app-commonheader',
  templateUrl: './commonheader.component.html',
  styleUrls: ['./commonheader.component.css']
})
export class CommonheaderComponent implements OnInit {
  profile_pic:string;
  constructor(private authenticationService: AuthenticationService,   private router: Router   ) {}

  ngOnInit() {
    var jsonObj=JSON.parse(localStorage.currentUser);
    document.getElementById("user_name").innerHTML=jsonObj.first_name;
    if(jsonObj.employee_photo){
      this.profile_pic="assets/employee_pics/"+jsonObj.employee_photo;
    }else{
      this.profile_pic="assets/employee_pics/profile_picture.jpg";
    }
    
   
  }
  change_page() {
    this.router.navigate(['/my_profile']);
  }  
  Onlogout(){
    console.log("inside of logout")
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }


}
