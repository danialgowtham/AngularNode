import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalIofViewComponent } from './technical-iof-view.component';

describe('TechnicalIofViewComponent', () => {
  let component: TechnicalIofViewComponent;
  let fixture: ComponentFixture<TechnicalIofViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalIofViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalIofViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
