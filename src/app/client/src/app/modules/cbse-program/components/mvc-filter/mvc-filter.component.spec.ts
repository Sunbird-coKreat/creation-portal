import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvcFilterComponent } from './mvc-filter.component';

describe('MvcFilterComponent', () => {
  let component: MvcFilterComponent;
  let fixture: ComponentFixture<MvcFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvcFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
