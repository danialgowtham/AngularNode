import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule, MatSnackBarModule, MatIconModule, MatProgressSpinnerModule, MatSortModule, MatBadgeModule, MatTooltipModule, MatBottomSheetModule, MatDialogModule, MatTabsModule, MatAutocompleteModule, MatGridListModule, MatTableModule, MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatCardModule, MatExpansionModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';
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
import { JwtInterceptor, ErrorInterceptor, LoaderInterceptor } from './helpers';
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
import { TopmenuService } from "./shared/top-menu.subject";
import { PushNotificationService } from "./services/push_notification.service";
// import { NgCircleProgressModule } from 'ng-circle-progress';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { NgSelectModule } from '@ng-select/ng-select';

// import { ChatsModule } from "./chats/chat.module";



//for push notification
import { ToasterModule } from 'angular5-toaster';
import { InternalJobCreationComponent } from './internal-job-creation/internal-job-creation.component';
import { InternalJobPostComponent } from './internal-job-post/internal-job-post.component';
import { InternalJobEditComponent } from './internal-job-edit/internal-job-edit.component';
import { ApplyJobComponent } from './apply-job/apply-job.component';
import { AppliedJobListComponent } from './applied-job-list/applied-job-list.component';
import { InternalJobViewComponent } from './internal-job-view/internal-job-view.component';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { RrfCreationComponent } from './rrf-creation/rrf-creation.component';
import { RrfListComponent } from './rrf-list/rrf-list.component';
import { RrfViewComponent } from './rrf-view/rrf-view.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { RrfRmgActivityComponent } from './rrf-rmg-activity/rrf-rmg-activity.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { InterviewScheduleComponent } from './interview-schedule/interview-schedule.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { IofListComponent } from './iof-list/iof-list.component';
import { TechnicalIofComponent } from './technical-iof/technical-iof.component';
import { HrRrfApproveListComponent } from './hr-rrf-approve-list/hr-rrf-approve-list.component';
import { HrRrfApproveComponent } from './hr-rrf-approve/hr-rrf-approve.component';
import { TechnicalIofViewComponent } from './technical-iof-view/technical-iof-view.component';
import { HrRrfApproveViewComponent } from './hr-rrf-approve-view/hr-rrf-approve-view.component';
import { RrfReportComponent } from './rrf-report/rrf-report.component';
import { CandidateLoginComponent } from './candidate-login/candidate-login.component';
import { CandidateFileUploadComponent } from './candidate-file-upload/candidate-file-upload.component';
import { RrfCandidateApproveComponent } from './rrf-candidate-approve/rrf-candidate-approve.component';
import { CandidateApproveModal } from './rrf-candidate-approve/rrf-candidate-approve.component';
import { OfferLetterPreviewModal } from './rrf-rmg-activity/rrf-rmg-activity.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SkillListComponent } from './skill-list/skill-list.component';

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
  {
    path: 'internal_job_creation',
    component: InternalJobCreationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internal_job_list',
    component: InternalJobPostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internal_job_edit',
    component: InternalJobEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internal_job_view',
    component: InternalJobEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'applied_jobs',
    component: AppliedJobListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_creation',
    component: RrfCreationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_edit',
    component: RrfCreationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_request_list',
    component: RrfListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_approve_list',
    component: RrfListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_rmg_list',
    component: RrfListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_view',
    component: RrfViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_approve',
    component: RrfViewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'iof_list',
    component: IofListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hr_rrf_approve_list',
    component: HrRrfApproveListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_report',
    component: RrfReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_candidate_approve_hr',
    component: RrfCandidateApproveComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_candidate_approve_buh',
    component: RrfCandidateApproveComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rrf_candidate_approve_rmg',
    component: RrfCandidateApproveComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'candidate_login',
    component: CandidateLoginComponent,
  },
  {
    path: 'candidate_file_upload',
    component: CandidateFileUploadComponent,
  },
  {
    path: 'skill_list',
    component: SkillListComponent,
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
    CandidateApproveModal,
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
    EmployeeSkillMappingComponent,
    InternalJobCreationComponent,
    InternalJobPostComponent,
    InternalJobEditComponent,
    ApplyJobComponent,
    AppliedJobListComponent,
    InternalJobViewComponent,
    RrfCreationComponent,
    RrfListComponent,
    RrfViewComponent,
    RrfRmgActivityComponent,
    InterviewScheduleComponent,
    IofListComponent,
    TechnicalIofComponent,
    HrRrfApproveListComponent,
    HrRrfApproveComponent,
    TechnicalIofViewComponent,
    HrRrfApproveViewComponent,
    RrfReportComponent,
    CandidateLoginComponent,
    CandidateFileUploadComponent,
    RrfCandidateApproveComponent,
    OfferLetterPreviewModal,
    SkillListComponent
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
    MatListModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatBadgeModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule,
    MatSnackBarModule,
    ToasterModule,
    ScrollDispatchModule,
    NgSelectModule,
    AngularMultiSelectModule,
    MatSelectInfiniteScrollModule,
    MaterialFileInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PdfViewerModule,
    FlatpickrModule.forRoot(),
    UserIdleModule.forRoot({ idle: 900, timeout: 1, ping: 1 })
  ],
  entryComponents: [OfferLetterPreviewModal, CandidateApproveModal, Popup, HrRrfApproveViewComponent, TechnicalIofViewComponent, HrRrfApproveComponent, TechnicalIofComponent, InterviewScheduleComponent, InternalJobViewComponent, ApplyJobComponent, EmployeeDetailComponent, EmployeeViewPopupComponent, SkillList, PopupModalComponent],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    RedirectService,
    EmployeeSkillMappingService,
    LoaderService,
    PushNotificationService,
    TopmenuService,
    // {provide: 'rootVar', useValue: 'hello'},
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor(private push_notification_service: PushNotificationService) {
    // Consume events: Change
    this.push_notification_service.consumeEvenOnSkillApprove();
    this.push_notification_service.consumeEvenOnSkillSubmit();
  }
}
