import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSkillMappingComponent } from './employee-skill-mapping.component';

describe('EmployeeSkillMappingComponent', () => {
  let component: EmployeeSkillMappingComponent;
  let fixture: ComponentFixture<EmployeeSkillMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSkillMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSkillMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
