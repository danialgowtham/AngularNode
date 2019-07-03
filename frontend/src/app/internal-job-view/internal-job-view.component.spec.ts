import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalJobViewComponent } from './internal-job-view.component';

describe('InternalJobViewComponent', () => {
  let component: InternalJobViewComponent;
  let fixture: ComponentFixture<InternalJobViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalJobViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalJobViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
