import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSkillListComponent } from './employee-skill-list.component';

describe('EmployeeSkillListComponent', () => {
  let component: EmployeeSkillListComponent;
  let fixture: ComponentFixture<EmployeeSkillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSkillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSkillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
