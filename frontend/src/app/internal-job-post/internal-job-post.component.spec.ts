import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalJobPostComponent } from './internal-job-post.component';

describe('InternalJobPostComponent', () => {
  let component: InternalJobPostComponent;
  let fixture: ComponentFixture<InternalJobPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalJobPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalJobPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
