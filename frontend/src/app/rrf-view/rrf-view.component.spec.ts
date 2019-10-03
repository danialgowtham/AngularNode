import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrfViewComponent } from './rrf-view.component';

describe('RrfViewComponent', () => {
  let component: RrfViewComponent;
  let fixture: ComponentFixture<RrfViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrfViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
