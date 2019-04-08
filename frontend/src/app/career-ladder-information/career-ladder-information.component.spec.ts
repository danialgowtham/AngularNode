import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerLadderInformationComponent } from './career-ladder-information.component';

describe('CareerLadderInformationComponent', () => {
  let component: CareerLadderInformationComponent;
  let fixture: ComponentFixture<CareerLadderInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerLadderInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerLadderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
