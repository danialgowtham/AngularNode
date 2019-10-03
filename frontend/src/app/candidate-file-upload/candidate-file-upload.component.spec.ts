import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFileUploadComponent } from './candidate-file-upload.component';

describe('CandidateFileUploadComponent', () => {
  let component: CandidateFileUploadComponent;
  let fixture: ComponentFixture<CandidateFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
