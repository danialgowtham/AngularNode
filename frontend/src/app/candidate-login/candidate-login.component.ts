import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../services';
@Component({
  selector: 'app-candidate-login',
  templateUrl: './candidate-login.component.html',
  styleUrls: ['./candidate-login.component.css']
})
export class CandidateLoginComponent implements OnInit {
  formdata;
  loginForm: FormGroup;
  disable_btn: Boolean = false;
  returnUrl: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }
  ngOnInit() {
    this.formdata = new FormGroup({
      user_name: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ])),
      password: new FormControl("", this.passwordvalidation)
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/my_profile';
  }
  passwordvalidation(formcontrol) {
    if (formcontrol.value.length < 5 || formcontrol.value.length > 13) {
      return { "password": true };
    }
  }
  onClickSubmit() {
    if (this.formdata.valid) {
      this.disable_btn = true;
      this.authenticationService.candidate_login(this.formdata.value.user_name, this.formdata.value.password)
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.disable_btn = false;
            this.alertService.error(error);
          });
    }

  }
}
