import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedComponent } from './published.component';

describe('PublishedComponent', () => {
  let component: PublishedComponent;
  let fixture: ComponentFixture<PublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
