import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { QuestionBaseComponent } from './question-base.component';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import * as mockData from './question-base.component.spec.data';
import * as _ from 'lodash-es';
const testData = mockData.mockRes;
describe('QuestionBaseComponent', () => {
  let component: QuestionBaseComponent;
  let fixture: ComponentFixture<QuestionBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBaseComponent ],
      imports: [CoreModule, SharedModule.forRoot(), RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get formatted subjective metadata', fakeAsync(() => {
    let subjectiveMeta = component.getSubjectiveMetadata(testData.subjectiveEditorState);
    subjectiveMeta = _.omit(subjectiveMeta, ['code', 'status', 'name', 'qType']);
    expect(subjectiveMeta).toEqual(testData.subjectiveMetadata);
  }));

  it('should get formatted MCQ metadata', fakeAsync(() => {
    let McqMeta = component.getMcqMetadata(testData.McqEditorState);
    McqMeta = _.omit(McqMeta, ['code', 'status', 'name', 'qType', 'responseDeclaration']);
    expect(McqMeta).toEqual(testData.McqMetadata);
  }));

  it('should get questionHtml', fakeAsync(() => {
    const question = '<p>capital of india is?</p>';
    const editorState = {
      'question': '<p>capital of india is?</p>',
      'options': [
        {
          'body': '<p>delhi</p>',
          'length': 0
        },
        {
          'body': '<p>mumbai</p>',
          'length': 0
        }
      ],
      'answer': '0',
      'numberOfOptions': 2
    };
    const questionHtml = component.getQuestionHtml(question, editorState);
    expect(questionHtml).toEqual(testData.questionHtml);
  }));

  it('should get question interaction data', fakeAsync(() => {
    const interactionData = component.getInteractions(testData.questionOptions);
    expect(interactionData).toEqual(testData.questionInteraction);
  }));
});
