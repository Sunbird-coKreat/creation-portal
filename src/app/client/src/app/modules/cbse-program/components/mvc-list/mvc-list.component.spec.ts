import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvcListComponent } from './mvc-list.component';

describe('MvcListComponent', () => {
  let component: MvcListComponent;
  let fixture: ComponentFixture<MvcListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvcListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
