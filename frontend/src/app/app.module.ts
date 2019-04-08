import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule, MatSortModule, MatBadgeModule, MatTooltipModule, MatBottomSheetModule, MatDialogModule, MatTabsModule, MatAutocompleteModule, MatGridListModule, MatTableModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCardModule, MatExpansionModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

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
// import { EmployeeSkillMappingModule } from './employee-skill-mapping/employee-skill-mapping.module';

import { customFilter } from './pipe/training_pipe';
import { EmployeeSkillMappingComponent } from './employee-skill-mapping/employee-skill-mapping.component';
import { EmployeeSkillListComponent } from './employee-skill-list/employee-skill-list.component';
import { EmployeeSkillViewComponent } from './employee-skill-view/employee-skill-view.component';
import { EmployeeSkillApproveComponent } from './employee-skill-approve/employee-skill-approve.component'

//For Front end session
import { UserIdleModule } from 'angular-user-idle';
import { EmployeeJobSearchComponent } from './employee-job-search/employee-job-search.component';
import { EmployeeJobViewComponent } from './employee-job-view/employee-job-view.component';
import { Popup } from './employee-job-view/employee-job-view.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeSearchComponent } from './employee-search/employee-search.component';
import { EmployeeViewPopupComponent } from './employee-view-popup/employee-view-popup';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AboutInformationComponent } from './about-information/about-information.component';
import { CareerLadderInformationComponent } from './career-ladder-information/career-ladder-information.component';
import { RoleInformationComponent } from './role-information/role-information.component';
import { RowComponent } from './employee-skill-mapping/dynamic-row/row.component'
import { SkillList } from './employee-skill-mapping/dynamic-row/row.component'
import { EmployeeSkillMappingService } from './services/employee_skill_mapping.service';
import { PopupModalComponent } from "./popup-modal/popup-modal";
import { LoaderService } from "./shared/loader.subject";

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
  {
    path: 'employee_job_mapping',
    component: EmployeeJobSearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'manager_job_mapping',
    component: EmployeeJobSearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rmg_job_mapping',
    component: EmployeeJobSearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee_search',
    component: EmployeeSearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my_profile',
    component: HomeComponent,
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
    EmployeeSkillApproveComponent,
    EmployeeJobSearchComponent,
    EmployeeJobViewComponent,
    Popup,
    EmployeeViewPopupComponent,
    EmployeeDetailComponent,
    EmployeeSearchComponent,
    HomeComponent,
    AboutInformationComponent,
    CareerLadderInformationComponent,
    RoleInformationComponent,
    RowComponent,
    SkillList,
    PopupModalComponent,
    EmployeeSkillMappingComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    HttpModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    HttpClientModule,
    NgbModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatBadgeModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSortModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
    UserIdleModule.forRoot({ idle: 900, timeout: 1, ping: 1 })
  ],
  entryComponents: [Popup, EmployeeDetailComponent, EmployeeViewPopupComponent, SkillList, PopupModalComponent],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    RedirectService,
    EmployeeSkillMappingService,
    LoaderService,
    // {provide: 'rootVar', useValue: 'hello'},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
