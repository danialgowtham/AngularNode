import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeJobSearchComponent } from './employee-job-search.component';

describe('EmployeeJobSearchComponent', () => {
  let component: EmployeeJobSearchComponent;
  let fixture: ComponentFixture<EmployeeJobSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeJobSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeJobSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
