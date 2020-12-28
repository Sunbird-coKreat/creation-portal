import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { ConfigService, ToasterService, SharedModule } from '@sunbird/shared';
import { DeviceDetectorService } from 'ngx-device-detector';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableThrowError, } from 'rxjs';
import { EditorBaseComponent } from './editor-base.component';
import { mockData } from './editor-base.component.spec.data';
import {EditorService, TreeService} from '../../services';

describe('EditorBaseComponent', () => {
  let component: EditorBaseComponent;
  let fixture: ComponentFixture<EditorBaseComponent>;
  let debugElement: DebugElement;

  const fakeActivatedRoute = {
    snapshot: {
      params: mockData.fakeParamMap,
      data: {
        hideHeaderNFooter: 'true',
        telemetry: { env: 'creation-portal', type: 'list', subtype: 'paginate', pageid: 'question_set' }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule, RouterTestingModule, SharedModule.forRoot()],
      declarations: [EditorBaseComponent],
      // tslint:disable-next-line:max-line-length
      providers: [{ provide: Router }, { provide: ActivatedRoute, useValue: fakeActivatedRoute }, DatePipe, TelemetryService,
        ConfigService, DeviceDetectorService,
      { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, { provide: APP_BASE_HREF, useValue: '/' }, EditorService, TreeService,
      ToasterService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorBaseComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#initialize should call after calls ngOnInit', () => {
    spyOn(component, 'prepareTelemetryEvents').and.callThrough();
    spyOn(component, 'fetchQuestionSetHierarchy').and.callThrough();
    component.ngOnInit();
    expect(component.editorParams.collectionId).toBe(mockData.fakeParamMap.questionSetId);
    expect(component.prepareTelemetryEvents).toHaveBeenCalled();
    expect(component.fetchQuestionSetHierarchy).toHaveBeenCalled();
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
    // tslint:disable-next-line:max-line-length
    expect(component.telemetryPageId).toBe('question_set');
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

  it('#logTelemetryImpressionEvent() should generate telemetry impression event', () => {
    const telemetryService: TelemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'impression').and.callThrough();
    expect(component.impressionEventTriggered).toBe(false);
    component.collectionTreeNodes = mockData.readQuestionSetSuccess;
    component.telemetryImpression = mockData.impressionEventData;
    component.logTelemetryImpressionEvent();
    expect(component.impressionEventTriggered).toBe(true);
    expect(telemetryService.impression).toHaveBeenCalled();
  });

  it('#logTelemetryImpressionEvent() should not generate telemetry impression event if generated', () => {
    const telemetryService: TelemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'impression').and.callThrough();
    expect(component.impressionEventTriggered).toBe(false);
    component.collectionTreeNodes = mockData.readQuestionSetSuccess;
    component.telemetryImpression = mockData.impressionEventData;
    component.logTelemetryImpressionEvent();
    expect(component.impressionEventTriggered).toBe(true);
    component.logTelemetryImpressionEvent();
    expect(telemetryService.impression).toHaveBeenCalledTimes(1);
  });

  it('#fetchQuestionSetHierarchy() should return expected question set details', () => {
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'getQuestionSetHierarchy').and.returnValue(observableOf(mockData.readQuestionSetSuccess));
    spyOn(component, 'logTelemetryImpressionEvent').and.callThrough();
    component.telemetryImpression = mockData.impressionEventData;
    component.fetchQuestionSetHierarchy();
    expect(component.showLoader).toBe(false);
    expect(component.logTelemetryImpressionEvent).toHaveBeenCalledTimes(1);
    expect(component.collectionTreeNodes).toEqual(mockData.readQuestionSetSuccess);
  });

  xit('#fetchQuestionSetHierarchy() should throw error message when API failed', () => {
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'getQuestionSetHierarchy').and.returnValue(observableThrowError({}));
    spyOn(component, 'logTelemetryImpressionEvent').and.callThrough();
    component.telemetryImpression = mockData.impressionEventData;
    component.collectionTreeNodes = [];
    component.fetchQuestionSetHierarchy();
    expect(component.showLoader).toBe(false);
    expect(component.logTelemetryImpressionEvent).toHaveBeenCalledTimes(1);
    expect(component.collectionTreeNodes).toBeUndefined();
  });

  it('#toolbarEventListener() should call #saveCollection method', () => {
    spyOn(component, 'saveCollection').and.callFake(() => {});
    component.toolbarEventListener({'button': { type: 'saveCollection' }});
    expect(component.saveCollection).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #submitCollection method', () => {
    spyOn(component, 'submitCollection').and.callFake(() => {});
    component.toolbarEventListener({'button': { type: 'submitCollection' }});
    expect(component.submitCollection).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should show question template popup', () => {
    expect(component.showQuestionTemplatePopup).toBe(false);
    component.toolbarEventListener({'button': { type: 'showQuestionTemplate' }});
    expect(component.showQuestionTemplatePopup).toBe(true);
  });

  it('#saveCollection() should save collection and return expected result', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'replaceNodeId').and.callFake(() => {});
    spyOn(treeService, 'clearTreeCache').and.callThrough();
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'updateQuestionSetHierarchy').and.returnValue(observableOf(mockData.updateQuestionSetHierarchySuccess));
    component.saveCollection();
    expect(treeService.replaceNodeId).toHaveBeenCalled();
    expect(treeService.clearTreeCache).toHaveBeenCalled();
  });

  it('#submitCollection() should send for review and return expected result', () => {
    const toasterService: ToasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callThrough();
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'sendQuestionSetForReview').and.returnValue(observableOf(mockData.reviewQuestionSetSuccess));
    spyOn(component, 'generateTelemetryEndEvent').and.callThrough();
    component.submitCollection();
    expect(toasterService.success).toHaveBeenCalledWith('Question set sent for review');
    expect(component.generateTelemetryEndEvent).toHaveBeenCalledWith('submit');
  });

  it('#submitCollection() should throw error message if already sent', () => {
    const toasterService: ToasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'sendQuestionSetForReview').and.returnValue(observableThrowError({}));
    component.submitCollection();
    expect(toasterService.error).toHaveBeenCalledWith('Sending question set for review failed. Please try again...');
  });


  xit('#treeEventListener() should set #selectedQuestionData', () => {
    const questionData = {'type': 'nodeSelect', 'data': { 'title': 'question one'}};
    component.treeEventListener(questionData);
    expect(component.selectedQuestionData).toBeDefined();
  });

  it('#removeNode() should remove node', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'removeNode').and.callFake(() => {});
    component.removeNode();
    expect(treeService.removeNode).toHaveBeenCalled();
  });

  it('#handleTemplateSelection() should set proper question type', () => {
    spyOn(component, 'redirectToQuestionTab').and.callFake(() => {});
    component.handleTemplateSelection({'type': 'default'});
    expect(component.showQuestionTemplatePopup).toBe(false);
    expect(component.redirectToQuestionTab).toHaveBeenCalledWith('default');
  });

  xit('should call Router.navigateByUrl("create/questionSet/:ID/question?params")', () => {
    component.redirectToQuestionTab('default');
  });

});
