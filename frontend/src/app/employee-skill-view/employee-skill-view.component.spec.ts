import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSkillViewComponent } from './employee-skill-view.component';

describe('EmployeeSkillViewComponent', () => {
  let component: EmployeeSkillViewComponent;
  let fixture: ComponentFixture<EmployeeSkillViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSkillViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSkillViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
