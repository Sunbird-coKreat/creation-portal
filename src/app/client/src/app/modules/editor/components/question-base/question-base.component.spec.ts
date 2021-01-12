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

  it('#prepareTelemetryEvents should call after calls ngOnInit', () => {
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

  xit('#getMcqQuestionHtmlBody() should return expected result', fakeAsync(() => {
    const question = '<p>capital of india is?</p>';
    const templateId = 'mcq-vertical';
    const questionHtmlbody = component.getMcqQuestionHtmlBody(question, templateId);
    expect(questionHtmlbody).toEqual(testData.questionHtml.body);
  }));
});
