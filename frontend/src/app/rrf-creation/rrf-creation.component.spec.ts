import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RrfCreationComponent } from './rrf-creation.component';

describe('RrfCreationComponent', () => {
  let component: RrfCreationComponent;
  let fixture: ComponentFixture<RrfCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RrfCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrfCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
