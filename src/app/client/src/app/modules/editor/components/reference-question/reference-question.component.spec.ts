import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceQuestionComponent } from './reference-question.component';

describe('ReferenceQuestionComponent', () => {
  let component: ReferenceQuestionComponent;
  let fixture: ComponentFixture<ReferenceQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
