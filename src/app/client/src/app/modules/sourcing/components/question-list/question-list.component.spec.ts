import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { QuestionListComponent } from './question-list.component';
import { McqCreationComponent } from '../mcq-creation/mcq-creation.component';
import { By } from '@angular/platform-browser';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DebugElement, NO_ERRORS_SCHEMA, ChangeDetectorRef} from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule, NgForm, UntypedFormBuilder } from '@angular/forms';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, of, throwError as observableError } from 'rxjs';
import { UserService, ActionService, ContentService, NotificationService, ProgramsService, FrameworkService } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { RouterTestingModule } from '@angular/router/testing';

import { HelperService } from '../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';
import { McqCreationStubComponent } from '../mcq-creation/mcq-creation-stub.component.spec';
import { ProgramStageService } from '../../../program/services';
import { ProgramTelemetryService } from '../../../program/services';
import { questionData, programContext } from './question-list.component.spec.data';
import { ItemsetService } from '../../services/itemset/itemset.service';
import { SourcingService } from '../../services';

describe('QuestionListComponent', () => {

  let fixture: ComponentFixture<QuestionListComponent>;
  let component: QuestionListComponent;

  const UserServiceStub = {
    userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
    userProfile: {
      firstName: 'Creator',
      lastName: 'ekstep'
    },
    slug: 'custchannel'
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule, SharedModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ QuestionListComponent, McqCreationStubComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService,
      TelemetryService, ResourceService, DatePipe,
      CacheService, BrowserCacheTtlService, NavigationHelperService,
      HelperService, ActionService, ChangeDetectorRef, UntypedFormBuilder, NotificationService,
      SourcingService, ContentService, ItemsetService, ProgramStageService, 
      ProgramsService, FrameworkService, ProgramTelemetryService,
      {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}},
      {provide: Router, useValue: RouterStub},
      DeviceDetectorService, { provide: UserService, useValue: UserServiceStub }]
    })
    .compileComponents();
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.debugElement.componentInstance;
    component.sessionContext = {targetCollectionFrameworksData: {
      framework: 'cbse_framework'
    }};
    component.questionList = ['do_123'];
    component.sessionContext['questionList'] = ['do_123'];
    component.questionCreationChild = TestBed.createComponent(McqCreationStubComponent).componentInstance as McqCreationComponent;
    // fixture.autoDetectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create QuestionListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should Call preprareTelemetryEvents', () => {
    spyOn(component, 'preprareTelemetryEvents');
    component.preprareTelemetryEvents();
    expect(component.preprareTelemetryEvents).toHaveBeenCalled();
  });

  it('should Call contentStatusNotify', () => {
    spyOn(component, 'contentStatusNotify');
    component.contentStatusNotify('accept');
    expect(component.contentStatusNotify).toHaveBeenCalled();
  });

  it('should Call setResourceStatus', () => {
    spyOn(component, 'setResourceStatus');
    component.setResourceStatus();
    expect(component.setResourceStatus).toHaveBeenCalled();
  });

  it('should Call getLicences', () => {
    spyOn(component, 'getLicences');
    component.getLicences();
    expect(component.getLicences).toHaveBeenCalled();
  });

  it('should Call handleActionButtons', () => {
    spyOn(component, 'handleActionButtons');
    component.handleActionButtons();
    expect(component.handleActionButtons).toHaveBeenCalled();
  });

  xit('should call canCreateQuestion', () => {
    spyOn(component, 'canCreateQuestion');
    component.handleActionButtons();
    expect(component.canCreateQuestion).toHaveBeenCalled();
  })

  xit('should call questionLimitReached', () => {
    spyOn(component, 'questionLimitReached');
    component.templateDetails = {
      objectMetadata: {
        schema: {
          properties: {
            maxQuestions: {
              default: 1
            }
          }
        }
      }
    }
    component.canCreateQuestion();
    expect(component.questionLimitReached).toHaveBeenCalled();
    expect(component.questionLimitReached).toBe(true);
  })

  it('should Call createDefaultQuestionAndItemset', () => {
    spyOn(component, 'createDefaultQuestionAndItemset');
    component.createDefaultQuestionAndItemset();
    expect(component.createDefaultQuestionAndItemset).toHaveBeenCalled();
  });

  it('should Call fetchQuestionList', () => {
    spyOn(component, 'handleQuestionTabChange');
    component.handleQuestionTabChange('do_1235678', 'Live');
    expect(component.handleQuestionTabChange).toHaveBeenCalled();
  });

  it('should Call fetchQuestionList', () => {
    spyOn(component, 'handleQuestionTabChange');
    component.handleQuestionTabChange('do_1235678', 'Live');
    expect(component.handleQuestionTabChange).toHaveBeenCalled();
  });

  it('should Call checkCurrentQuestionStatus', () => {
    spyOn(component, 'checkCurrentQuestionStatus');
    component.checkCurrentQuestionStatus();
    expect(component.checkCurrentQuestionStatus).toHaveBeenCalled();
  });

  it('should Call getQuestionDetails', () => {
    spyOn(component, 'getQuestionDetails');
    component.getQuestionDetails('do_1235678');
    expect(component.getQuestionDetails).toHaveBeenCalled();
  });

  xit('should Call createNewQuestion call createDefaultAssessmentItem', async() => {
    component.questionList = [];
    component.sessionContext.questionList = [];
    component.resourceName = 'abcd';
    spyOn(component, 'checkCurrentQuestionStatus').and.returnValue(true);
    spyOn(component.questionCreationChild, 'validateCurrentQuestion').and.returnValue(true);
    spyOn(component, 'createDefaultAssessmentItem').and.returnValue(of(questionData));
    spyOn(component, 'updateItemset').and.returnValue(of(questionData));
    component.programContext = programContext;
    component.createNewQuestion();
    expect(component.checkCurrentQuestionStatus).toHaveBeenCalled();
    expect(component.questionCreationChild.validateCurrentQuestion).toHaveBeenCalled();
    expect(component.createDefaultAssessmentItem).toHaveBeenCalled();
    expect(component.updateItemset).toHaveBeenCalled();
  });

  xit('should Call handlerContentPreview', () => {
    spyOn(component.questionCreationChild, 'buttonTypeHandler').and.callFake(() => {});
    spyOn(component, 'handlerContentPreview').and.callThrough();
    component.handlerContentPreview();
    expect(component.handlerContentPreview).toHaveBeenCalled();
    expect(component.questionCreationChild.buttonTypeHandler).toHaveBeenCalled();
  });

  it('should Call questionStatusHandler', () => {
    component.sessionContext['questionList'] = ['do_123'];
    spyOn(component, 'handleQuestionTabChange');
    component.questionStatusHandler({'evnt': 'call'});
    expect(component.handleQuestionTabChange).toHaveBeenCalled();
  });

  it('should Call handleRefresEvent', () => {
    spyOn(component, 'handleRefresEvent');
    component.handleRefresEvent();
    expect(component.handleRefresEvent).toHaveBeenCalled();
  });

  it('should Call saveContent', () => {
    spyOn(component, 'saveContent');
    component.saveContent('do_1235678');
    expect(component.saveContent).toHaveBeenCalled();
  });

  it('should Call isIndividualAndNotSample', () => {
    spyOn(component, 'isIndividualAndNotSample');
    component.isIndividualAndNotSample();
    expect(component.isIndividualAndNotSample).toHaveBeenCalled();
  });

  it('should Call sendForReview', () => {
    spyOn(component, 'sendForReview');
    component.sendForReview();
    expect(component.sendForReview).toHaveBeenCalled();
  });

  it('should Call publishContent', () => {
    spyOn(component, 'publishContent');
    component.publishContent();
    expect(component.publishContent).toHaveBeenCalled();
  });

  it('should Call requestChanges', () => {
    spyOn(component, 'requestChanges');
    component.requestChanges();
    expect(component.requestChanges).toHaveBeenCalled();
  });

  it('should Call dismissPublishModal', () => {
    spyOn(component, 'dismissPublishModal');
    component.dismissPublishModal();
    expect(component.dismissPublishModal).toHaveBeenCalled();
  });

  it('should Call openDeleteQuestionModal', () => {
    spyOn(component, 'openDeleteQuestionModal');
    component.openDeleteQuestionModal('do_1235678', 'Live');
    expect(component.openDeleteQuestionModal).toHaveBeenCalled();
  });

  it('should Call deleteQuestion', () => {
    spyOn(component, 'deleteQuestion');
    component.deleteQuestion();
    expect(component.deleteQuestion).toHaveBeenCalled();
  });

  xit('should Call showResourceTitleEditor', () => {
    spyOn(component, 'showResourceTitleEditor');
    component.showResourceTitleEditor();
    expect(component.showResourceTitleEditor).toHaveBeenCalled();
  });

  it('should Call onResourceNameChange', () => {
    spyOn(component, 'onResourceNameChange');
    component.onResourceNameChange('do_1235678');
    expect(component.onResourceNameChange).toHaveBeenCalled();
  });

  xit('should Call saveResourceName', () => {
    spyOn(component, 'saveResourceName');
    component.saveResourceName();
    expect(component.saveResourceName).toHaveBeenCalled();
  });

  it('should Call createDefaultAssessmentItem', () => {
    spyOn(component, 'createDefaultAssessmentItem');
    component.createDefaultAssessmentItem();
    expect(component.createDefaultAssessmentItem).toHaveBeenCalled();
  });

  it('should Call prepareQuestionReqBody', () => {
    spyOn(component, 'prepareQuestionReqBody');
    component.prepareQuestionReqBody();
    expect(component.prepareQuestionReqBody).toHaveBeenCalled();
  });

  it('should Call prepareSharedContext', () => {
    spyOn(component, 'prepareSharedContext');
    component.prepareSharedContext();
    expect(component.prepareSharedContext).toHaveBeenCalled();
  });

  it('should Call getMcqQuestionBody', () => {
    spyOn(component, 'getMcqQuestionBody');
    component.getMcqQuestionBody();
    expect(component.getMcqQuestionBody).toHaveBeenCalled();
  });

  it('should Call getReferenceQuestionBody', () => {
    spyOn(component, 'getReferenceQuestionBody');
    component.getReferenceQuestionBody();
    expect(component.getReferenceQuestionBody).toHaveBeenCalled();
  });

  it('should Call createItemSet', () => {
    spyOn(component, 'createItemSet');
    component.createItemSet('do_124678');
    expect(component.createItemSet).toHaveBeenCalled();
  });

  it ('#validateFormConfiguration() should call helperService.validateFormConfiguration', () => {
    component.formFieldProperties = [{code: 'name', name: 'name' }];
    const  helperService  = TestBed.get(HelperService);
    spyOn(component, 'validateFormConfiguration').and.callThrough();
    spyOn(helperService, 'initializeFormFields').and.returnValue([{code: 'name'}]);
    spyOn(component, 'showEditDetailsForm').and.callThrough();
    spyOn(helperService, 'validateFormConfiguration').and.returnValue(false);
    component.validateFormConfiguration();
    expect(helperService.validateFormConfiguration).toHaveBeenCalled();
    expect(component.showEditDetailsForm).toHaveBeenCalled();
  });

  it ('#showEditDetailsForm() should call helperService.initializeFormFields', () => {
     const sampleFieldArray = [{code: 'name', name: 'name' }];
     const sampleFieldArrayWithData = [{code: 'name', name: 'name', default: 'test content'}];
    component.formFieldProperties = sampleFieldArray;
    component.resourceDetails = {name: 'test content'};
    const  helperService  = TestBed.get(HelperService);
    spyOn(helperService, 'initializeFormFields').and.returnValue(sampleFieldArrayWithData);
    spyOn(component, 'showEditDetailsForm').and.callThrough();
    component.showEditDetailsForm();
    expect(helperService.initializeFormFields).toHaveBeenCalled();
    expect(component.formFieldProperties).toBe(sampleFieldArrayWithData);
    expect(component.showEditMetaForm).toBeTruthy();
  });

  it ('#formStatusEventListener() should set formstatus value', () => {
    const statusEvent = {isValid: true};
    spyOn(component, 'formStatusEventListener').and.callThrough();
    component.formStatusEventListener(statusEvent);
    expect(component.formstatus).toBe(statusEvent);
  });

  it ('#getFormData() should set formInputData value', () => {
    const formInput = {name: 'test content'};
    spyOn(component, 'formStatusEventListener').and.callThrough();
    component.getFormData(formInput);
    expect(component.formInputData).toBe(formInput);
  });

  it ('#handleBack() should call generateTelemetryEndEvent()', () => {
    const programStageService = TestBed.inject(ProgramStageService);
    spyOn(programStageService, 'removeLastStage').and.callFake(() =>  {});
    spyOn(component.questionCreationChild, 'validateCurrentQuestion').and.returnValue(true);
    spyOn(component, 'checkCurrentQuestionStatus').and.returnValue(true);
    spyOn(component, 'generateTelemetryEndEvent').and.callFake(() =>  {});
    spyOn(component, 'handleBack').and.callThrough();
    component.handleBack();
    expect(component.handleBack).toHaveBeenCalled();
    expect(component.questionCreationChild.validateCurrentQuestion).toHaveBeenCalled();
    expect(component.checkCurrentQuestionStatus).toHaveBeenCalled();
    expect(component.generateTelemetryEndEvent).toHaveBeenCalled();
    expect(programStageService.removeLastStage).toHaveBeenCalled();
  });

  it ('#handleBack() should not call generateTelemetryEndEvent()', () => {
    const programStageService = TestBed.inject(ProgramStageService);
    spyOn(programStageService, 'removeLastStage').and.callFake(() =>  {});
    spyOn(component.questionCreationChild, 'validateCurrentQuestion').and.returnValue(false);
    spyOn(component, 'checkCurrentQuestionStatus').and.returnValue(true);
    spyOn(component, 'generateTelemetryEndEvent').and.callFake(() =>  {});
    spyOn(component, 'handleBack').and.callThrough();
    component.handleBack();
    expect(component.handleBack).toHaveBeenCalled();
    expect(component.questionCreationChild.validateCurrentQuestion).toHaveBeenCalled();
    expect(component.checkCurrentQuestionStatus).not.toHaveBeenCalled();
    expect(component.generateTelemetryEndEvent).not.toHaveBeenCalled();
    expect(programStageService.removeLastStage).not.toHaveBeenCalled();
  });

  it ('#handleQuestionTabChange() should not call validateCurrentQuestion()', () => {
    component.sessionContext['questionList'] = ['do_123'];
    spyOn(component, 'checkCurrentQuestionStatus').and.returnValue(false);
    spyOn(component.questionCreationChild, 'validateCurrentQuestion').and.returnValue(false);
    spyOn(component, 'getQuestionDetails').and.returnValue({} as any);
    spyOn(component, 'handleQuestionTabChange').and.callThrough();
    component.handleQuestionTabChange('do_12345');
    expect(component.handleQuestionTabChange).toHaveBeenCalled();
    expect(component.checkCurrentQuestionStatus).toHaveBeenCalled();
    expect(component.questionCreationChild.validateCurrentQuestion).toHaveBeenCalled();
    expect(component.getQuestionDetails).not.toHaveBeenCalled();
  });

});
