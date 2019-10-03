import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrRrfApproveListComponent } from './hr-rrf-approve-list.component';

describe('HrRrfApproveListComponent', () => {
  let component: HrRrfApproveListComponent;
  let fixture: ComponentFixture<HrRrfApproveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrRrfApproveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrRrfApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
