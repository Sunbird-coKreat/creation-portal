import { async, ComponentFixture, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { QuestionBaseComponent } from './question-base.component';
import { CoreModule } from '@sunbird/core';
import { SharedModule, ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import * as mockData from './question-base.component.spec.data';
import * as _ from 'lodash-es';
import {QuestionService} from '../../services/question/question.service';
import { of as observableOf, throwError as observableThrowError, } from 'rxjs';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
const testData = mockData.mockRes;

describe('QuestionBaseComponent', () => {
  let component: QuestionBaseComponent;
  let fixture: ComponentFixture<QuestionBaseComponent>;
  // let debugElement: DebugElement;
  const fakeActivatedRoute = {
    queryParams: observableOf({questionId: '', type: 'default'}),
    snapshot: {
      data: {
        hideHeaderNFooter: 'true',
        telemetry: { env: 'creation-portal', type: 'list', subtype: 'paginate', pageid: 'question' }
      },
      ['_routerState'] : {url : 'create/questionSet/do_1131737119720488961123/question?type=default&questionId=do_1131737393366138881132'}
    }
  };
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
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBaseComponent ],
      imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot(), RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        DatePipe, TelemetryService,
        QuestionService, ConfigService, DeviceDetectorService,
        { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ResourceService, useValue: resourceBundle }, ToasterService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('#initialize should call after calls ngOnInit', () => {
    spyOn(component, 'prepareTelemetryEvents').and.callThrough();
    component.ngOnInit();
    expect(component.prepareTelemetryEvents).toHaveBeenCalled();
  });

  it('#prepareTelemetryEvents() should set telemetry data', () => {
    spyOn(component, 'setTelemetryStartData').and.callThrough();
    component.prepareTelemetryEvents();
    // tslint:disable-next-line:max-line-length
    expect(Object.keys(component.telemetryPageDetails)).toEqual(['telemetryPageId', 'telemetryInteractCdata', 'telemetryInteractPdata', 'telemetryInteractObject']);
    expect(component.setTelemetryStartData).toHaveBeenCalled();
  });

  it('#getPageId() should return expected result', () => {
    component.getPageId();
    expect(component.telemetryPageId).toBe('question');
  });

  it('#setTelemetryStartData() should set telemetry start event data', fakeAsync(() => {
    expect(component.telemetryStart).toBeUndefined();
    component.prepareTelemetryEvents();
    tick(1000);
    expect(Object.keys(component.telemetryStart)).toEqual(['object', 'context', 'edata']);
  }));

  it('#generateTelemetryEndEvent() should set telemetry end event data', () => {
    const telemetryService: TelemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'end').and.callThrough();
    expect(component.telemetryEnd).toBeUndefined();
    component.generateTelemetryEndEvent('submit');
    expect(Object.keys(component.telemetryEnd)).toEqual(['object', 'context', 'edata']);
    expect(component.telemetryEnd.edata.mode).toBe('submit');
    expect(telemetryService.end).toHaveBeenCalledWith(component.telemetryEnd);
  });

  it('should get question interaction data', fakeAsync(() => {
    const interactionData = component.getInteractions(testData.questionOptions);
    expect(interactionData).toEqual(testData.questionInteraction);
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

  xit('should call addQuestionToQuestionset and get success response', inject([QuestionService],
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

  it('should call updateQuestion and get success response', inject([QuestionService],
    (questionService) => {
      spyOn(questionService, 'updateQuestion').and.callFake(() => observableOf(testData.updateResponse));
      spyOn(component, 'updateQuestion').and.callThrough();
      component.updateQuestion(testData.updateMetadata, 'do_1131823509449031681174');
      expect(component.updateQuestion).toHaveBeenCalledWith(testData.updateMetadata, 'do_1131823509449031681174');
      questionService.updateQuestion(testData.updateMetadata, 'do_1131823509449031681174').
      subscribe(apiResponse => {
        expect(apiResponse.responseCode).toBe('OK');
        expect(apiResponse.params.status).toBe('successful');
      });
    }));
});
