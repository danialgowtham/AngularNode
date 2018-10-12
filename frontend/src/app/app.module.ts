import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,MatSelectModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpModule} from "@angular/http";


import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { CommonheaderComponent } from './layout/commonheader/commonheader.component';
import { FooterComponent } from './layout/footer/footer.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { MainpageComponent } from './mainpage/mainpage.component';

import { AuthGuard } from './guards';
import { AlertService, AuthenticationService, UserService,sharedData,TrainingService,RedirectService } from './services';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { AlertComponent } from './directives';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { TopMenuComponent } from './layout/top-menu/top-menu.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { TrainingCalendarsComponent } from './training-calendars/training-calendars.component';
import { AddTrainingComponent } from './add-training/add-training.component';

import { customFilter } from './pipe/training_pipe'


const appRoutes: Routes = [
  {
     path: 'login',
     component: UserloginComponent   
  },
  {
    path: 'homepage',
    component: MainpageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee_list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee_view',
    component: EmployeeViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'add_employee',
    component:AddEmployeeComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'training_list',
    component:TrainingCalendarsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'add_training',
    component:AddTrainingComponent,
    canActivate:[AuthGuard]
  },
   { path: '**', redirectTo: '/login' },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserloginComponent,
    MainpageComponent,
    AlertComponent,
    CommonheaderComponent,
    EmployeeListComponent,
    EmployeeViewComponent,
    TopMenuComponent,
    AddEmployeeComponent,
    TrainingCalendarsComponent,
    AddTrainingComponent,
    customFilter
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    HttpModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    sharedData,
    TrainingService,
    RedirectService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider
],
  bootstrap: [AppComponent]
})

export class AppModule { }
