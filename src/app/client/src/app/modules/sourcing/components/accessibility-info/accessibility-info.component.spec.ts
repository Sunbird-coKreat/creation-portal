import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityInfoComponent } from './accessibility-info.component';

describe('AccessibilityInfoComponent', () => {
  let component: AccessibilityInfoComponent;
  let fixture: ComponentFixture<AccessibilityInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessibilityInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
