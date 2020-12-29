import { async, ComponentFixture, fakeAsync, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { QuestionBaseComponent } from './question-base.component';
import { CoreModule } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import * as mockData from './question-base.component.spec.data';
import * as _ from 'lodash-es';
import {QuestionService} from '../../services/question/question.service';
import { of as observableOf } from 'rxjs';
const testData = mockData.mockRes;
describe('QuestionBaseComponent', () => {
  let component: QuestionBaseComponent;
  let fixture: ComponentFixture<QuestionBaseComponent>;
  const resourceBundle = {
    'messages': {
      'smsg': {
        'm0070': 'Question is successfully saved',
        'm0071': 'Question is successfully updated',
        'm0072': 'Question is successfully added to questionset'
      },
      'emsg': {
        'm0028': 'Unable to save question',
        'm0029': 'Unable to update question',
        'm0030': 'Unable to add question to questionset'
      }
    },
    languageSelected$: observableOf({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBaseComponent ],
      imports: [CoreModule, SharedModule.forRoot(), RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [QuestionService,
        { provide: ResourceService, useValue: resourceBundle }
      ]
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

  it('should call createQuestion and get success response', inject([QuestionService],
    (questionService) => {
      spyOn(questionService, 'createQuestion').and.callFake(() => observableOf(testData.createResponse));
      spyOn(component, 'createQuestion').and.callThrough();
      component.createQuestion(testData.createMetadata);
      expect(component.createQuestion).toHaveBeenCalledWith(testData.createMetadata);
      questionService.createQuestion(testData.createMetadata).
      subscribe(apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.params.status).toBe('successful');
      });
    }));

  it('should call updateQuestion and get success response', inject([QuestionService],
    (questionService) => {
      spyOn(questionService, 'updateQuestion').and.callFake(() => observableOf(testData.updateResponse));
      spyOn(component, 'updateQuestion').and.callThrough();
      const questionId = 'do_1131823509449031681174';
      component.updateQuestion(testData.updateMetadata, questionId);
      expect(component.updateQuestion).toHaveBeenCalledWith(testData.updateMetadata, questionId);
      questionService.updateQuestion(testData.updateMetadata, questionId).
      subscribe(apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.params.status).toBe('successful');
      });
    }));

  it('should call addQuestionToQuestionset and get success response', inject([QuestionService],
    (questionService) => {
      const questionsetId = 'do_1131737119720488961123';
      const questionId = 'do_1131824542805278721176';
      spyOn(questionService, 'addQuestionToQuestionSet').and.callFake(() => observableOf(testData.addQuestionQuestionsetResponse));
      spyOn(component, 'addQuestionToQuestionSet').and.callThrough();
      component.addQuestionToQuestionSet(questionsetId, questionId);
      expect(component.addQuestionToQuestionSet).toHaveBeenCalledWith(questionsetId, questionId);
      questionService.addQuestionToQuestionSet(questionsetId, questionId).
      subscribe(apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.params.status).toBe('successful');
      });
    }));
});
