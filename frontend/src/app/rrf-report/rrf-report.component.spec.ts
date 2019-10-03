import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrfReportComponent } from './rrf-report.component';

describe('RrfReportComponent', () => {
  let component: RrfReportComponent;
  let fixture: ComponentFixture<RrfReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrfReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
