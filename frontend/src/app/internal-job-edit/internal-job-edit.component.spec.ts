import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalJobEditComponent } from './internal-job-edit.component';

describe('InternalJobEditComponent', () => {
  let component: InternalJobEditComponent;
  let fixture: ComponentFixture<InternalJobEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalJobEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalJobEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
