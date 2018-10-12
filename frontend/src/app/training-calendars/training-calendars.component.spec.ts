import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCalendarsComponent } from './training-calendars.component';

describe('TrainingCalendarsComponent', () => {
  let component: TrainingCalendarsComponent;
  let fixture: ComponentFixture<TrainingCalendarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingCalendarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingCalendarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
