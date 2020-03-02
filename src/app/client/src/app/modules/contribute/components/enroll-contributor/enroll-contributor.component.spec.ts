import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollContributorComponent } from './enroll-contributor.component';

describe('EnrollContributorComponent', () => {
  let component: EnrollContributorComponent;
  let fixture: ComponentFixture<EnrollContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
