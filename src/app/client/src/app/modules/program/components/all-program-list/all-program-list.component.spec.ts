import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProgramListComponent } from './all-program-list.component';

describe('AllProgramListComponent', () => {
  let component: AllProgramListComponent;
  let fixture: ComponentFixture<AllProgramListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllProgramListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
