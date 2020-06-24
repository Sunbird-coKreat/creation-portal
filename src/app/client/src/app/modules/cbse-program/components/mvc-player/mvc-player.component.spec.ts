import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvcPlayerComponent } from './mvc-player.component';

describe('MvcPlayerComponent', () => {
  let component: MvcPlayerComponent;
  let fixture: ComponentFixture<MvcPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvcPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
