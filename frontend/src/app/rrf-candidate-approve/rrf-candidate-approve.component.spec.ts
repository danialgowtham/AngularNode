import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrfCandidateApproveComponent } from './rrf-candidate-approve.component';

describe('RrfCandidateApproveComponent', () => {
  let component: RrfCandidateApproveComponent;
  let fixture: ComponentFixture<RrfCandidateApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrfCandidateApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrfCandidateApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
