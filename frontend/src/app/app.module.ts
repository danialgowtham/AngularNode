import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCardModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpModule } from "@angular/http";


import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { CommonheaderComponent } from './layout/commonheader/commonheader.component';
import { FooterComponent } from './layout/footer/footer.component';
import { UserloginComponent } from './userlogin/userlogin.component';

import { AuthGuard } from './guards';
import { AlertService, AuthenticationService, RedirectService } from './services';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { AlertComponent } from './directives';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TopMenuComponent } from './layout/top-menu/top-menu.component';
import { EmployeeSkillMappingModule } from './employee-skill-mapping/employee-skill-mapping.module';

import { customFilter } from './pipe/training_pipe';
import { EmployeeSkillMappingComponent } from './employee-skill-mapping/employee-skill-mapping.component';
import { EmployeeSkillListComponent } from './employee-skill-list/employee-skill-list.component';
import { EmployeeSkillViewComponent } from './employee-skill-view/employee-skill-view.component';
import { EmployeeSkillApproveComponent } from './employee-skill-approve/employee-skill-approve.component'

//For Front end session
import { UserIdleModule } from 'angular-user-idle';


const appRoutes: Routes = [
  {
    path: 'login',
    component: UserloginComponent
  },
  {
    path: 'employee_skill',
    component: EmployeeSkillMappingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee_skill_view',
    component: EmployeeSkillViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee_skill_approve_list',
    component: EmployeeSkillListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee_skill_approve',
    component: EmployeeSkillApproveComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserloginComponent,
    AlertComponent,
    CommonheaderComponent,
    TopMenuComponent,
    customFilter,
    EmployeeSkillListComponent,
    EmployeeSkillViewComponent,
    EmployeeSkillApproveComponent
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
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    HttpClientModule,
    NgbModule,
    EmployeeSkillMappingModule,
    MatCardModule,
    UserIdleModule.forRoot({ idle: 900, timeout: 1, ping: 1 })
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    RedirectService,
    // {provide: 'rootVar', useValue: 'hello'},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
