import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProgramComponent } from './edit-program.component';

describe('EditProgramComponent', () => {
  let component: EditProgramComponent;
  let fixture: ComponentFixture<EditProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProgramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
