import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalJobCreationComponent } from './internal-job-creation.component';

describe('InternalJobCreationComponent', () => {
  let component: InternalJobCreationComponent;
  let fixture: ComponentFixture<InternalJobCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalJobCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalJobCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
