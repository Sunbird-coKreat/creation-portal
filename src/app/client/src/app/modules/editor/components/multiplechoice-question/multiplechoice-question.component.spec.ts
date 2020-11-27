import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplechoiceQuestionComponent } from './multiplechoice-question.component';

describe('MultiplechoiceQuestionComponent', () => {
  let component: MultiplechoiceQuestionComponent;
  let fixture: ComponentFixture<MultiplechoiceQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiplechoiceQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplechoiceQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
