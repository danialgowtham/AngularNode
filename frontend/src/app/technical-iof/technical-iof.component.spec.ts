import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalIofComponent } from './technical-iof.component';

describe('TechnicalIofComponent', () => {
  let component: TechnicalIofComponent;
  let fixture: ComponentFixture<TechnicalIofComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalIofComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalIofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
