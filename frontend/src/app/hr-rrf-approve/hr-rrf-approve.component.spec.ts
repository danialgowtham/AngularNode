import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRrfApproveComponent } from './hr-rrf-approve.component';

describe('HrRrfApproveComponent', () => {
  let component: HrRrfApproveComponent;
  let fixture: ComponentFixture<HrRrfApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRrfApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRrfApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
