import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrfRmgActivityComponent } from './rrf-rmg-activity.component';

describe('RrfRmgActivityComponent', () => {
  let component: RrfRmgActivityComponent;
  let fixture: ComponentFixture<RrfRmgActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrfRmgActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrfRmgActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
