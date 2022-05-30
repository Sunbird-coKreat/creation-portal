import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCalendarCardComponent } from './home-calendar-card.component';

describe('HomeCalendarCardComponent', () => {
  let component: HomeCalendarCardComponent;
  let fixture: ComponentFixture<HomeCalendarCardComponent>;



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCalendarCardComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HomeCalendarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
