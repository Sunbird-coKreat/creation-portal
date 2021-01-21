import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSetEditorComponent } from './question-set-editor.component';

describe('QuestionSetEditorComponent', () => {
  let component: QuestionSetEditorComponent;
  let fixture: ComponentFixture<QuestionSetEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSetEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
