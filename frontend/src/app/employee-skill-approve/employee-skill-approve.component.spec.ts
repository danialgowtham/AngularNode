import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSkillApproveComponent } from './employee-skill-approve.component';

describe('EmployeeSkillApproveComponent', () => {
  let component: EmployeeSkillApproveComponent;
  let fixture: ComponentFixture<EmployeeSkillApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSkillApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSkillApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
