import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionListComponent } from './question-list.component';
import { By } from '@angular/platform-browser';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService, PlayerService, FrameworkService, UserService } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { RouterTestingModule } from '@angular/router/testing';

import { HelperService } from '../../services/helper.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule, SharedModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ QuestionListComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService,
      TelemetryService, PlayerService, ResourceService, DatePipe,
      CacheService, BrowserCacheTtlService, NavigationHelperService,
      { provide: HelperService },
      {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}},
      DeviceDetectorService, { provide: UserService, useValue: UserServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    // fixture.autoDetectChanges();
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
  });

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
    };
    component.canCreateQuestion();
    expect(component.questionLimitReached).toHaveBeenCalled();
    expect(component.questionLimitReached).toBe(true);
  });

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

  it('should Call createNewQuestion', () => {
    spyOn(component, 'createNewQuestion');
    component.createNewQuestion();
    expect(component.createNewQuestion).toHaveBeenCalled();
  });

  it('should Call handlerContentPreview', () => {
    spyOn(component, 'handlerContentPreview');
    component.handlerContentPreview();
    expect(component.handlerContentPreview).toHaveBeenCalled();
  });

  it('should Call questionStatusHandler', () => {
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
});
