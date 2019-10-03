import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrfListComponent } from './rrf-list.component';

describe('RrfListComponent', () => {
  let component: RrfListComponent;
  let fixture: ComponentFixture<RrfListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrfListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
