import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRrfApproveViewComponent } from './hr-rrf-approve-view.component';

describe('HrRrfApproveViewComponent', () => {
  let component: HrRrfApproveViewComponent;
  let fixture: ComponentFixture<HrRrfApproveViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRrfApproveViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRrfApproveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
