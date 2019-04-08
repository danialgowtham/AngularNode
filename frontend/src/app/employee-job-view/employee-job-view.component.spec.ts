import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeJobViewComponent } from './employee-job-view.component';

describe('EmployeeJobViewComponent', () => {
  let component: EmployeeJobViewComponent;
  let fixture: ComponentFixture<EmployeeJobViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeJobViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeJobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
