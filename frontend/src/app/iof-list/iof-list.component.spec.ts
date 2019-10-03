import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IofListComponent } from './iof-list.component';

describe('IofListComponent', () => {
  let component: IofListComponent;
  let fixture: ComponentFixture<IofListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IofListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IofListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
