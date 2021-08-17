import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionSetEditorComponent } from './question-set-editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CacheService } from 'ng2-cache-service';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { UserService } from '@sunbird/core';
import { of as observableOf, of, throwError as observableError } from 'rxjs';

describe('QuestionSetEditorComponent', () => {
  let component: QuestionSetEditorComponent;
  let fixture: ComponentFixture<QuestionSetEditorComponent>;
  let debugElement: DebugElement;
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
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [QuestionSetEditorComponent],
      providers: [ConfigService, TelemetryService, CacheService, CollectionHierarchyService,
        BrowserCacheTtlService, ToasterService, ResourceService, DatePipe,
        { provide: Router },
        { provide: ActivatedRoute },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: UserService, useValue: UserServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetEditorComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#editorEventListener should call editorEventListener for sendForCorrections', () => {
    const event = {
      identifier: '1234', comment: 'comment', action: 'sendForCorrections'
    };
    spyOn(component, 'requestCorrectionsBySourcing').and.callThrough();
    component.editorEventListener(event);
    expect(component.requestCorrectionsBySourcing).toHaveBeenCalledWith(event.identifier, event.comment);
  });
  it('#editorEventListener should call editorEventListener for backContent', () => {
    const event = { action: 'backContent' };
    spyOn(component['programsService'], 'emitHeaderEvent').and.callThrough();
    component.editorEventListener(event);
    expect(component['programsService'].emitHeaderEvent).toHaveBeenCalledWith(true);
  });
  it('#editorEventListener should call editorEventListener for saveCollection', () => {
    const event = { action: 'saveCollection' };
    spyOn(component['programStageService'], 'removeLastStage').and.callThrough();
    component.editorEventListener(event);
    expect(component['programStageService'].removeLastStage).toHaveBeenCalled();
  });
  it('#editorEventListener should call editorEventListener for sourcingApprove', () => {
    const event = { action: 'sourcingApprove' };
    component.sessionContext = {hierarchyObj:  ''};
    spyOn(component['helperService'], 'manageSourcingActions').and.callFake(() => {});
    component.editorEventListener(event);
    expect(component['helperService'].manageSourcingActions).toHaveBeenCalledWith('accept', component.sessionContext, undefined, undefined);
  });
  it('#editorEventListener should call editorEventListener for sourcingReject', () => {
    const event = { action: 'sourcingReject' };
    spyOn(component['helperService'], 'manageSourcingActions').and.callFake(() => {});
    component.editorEventListener(event);
    expect(component['helperService'].manageSourcingActions).toHaveBeenCalledWith('reject', undefined, undefined,  undefined, undefined);
  });
  it('#editorEventListener should call editorEventListener for submitContent', () => {
    const event = { action: 'submitContent', identifier: '1234' };
    component.sessionContext =  {currentOrgRole: ''};
    component.sessionContext =  {sampleContent: {}};
    spyOn(component['helperService'], 'isIndividualAndNotSample').and.returnValue(true);
    spyOn(component, 'publishQuestionSet').and.callThrough();
    component.editorEventListener(event);
    expect(component.publishQuestionSet).toHaveBeenCalledWith(event.identifier);
  });
  it('#hasRole should call hasRole', () => {
    const role = 'CONTRIBUTOR';
    component.sessionContext =  {currentOrgRole: ''};
    component.sessionContext =  {sampleContent: {}, currentRoles: []};
    spyOn(component, 'hasRole').and.callThrough();
    const data = component.hasRole(role);
    expect(data).toBeFalsy();
  });
  it('#hasAccessFor should call hasAccessFor', () => {
    const role = ['CONTRIBUTOR'];
    component.sessionContext =  {currentOrgRole: ''};
    component.sessionContext =  {sampleContent: {}, currentRoles: []};
    spyOn(component, 'hasRole').and.callThrough();
    const data = component.hasAccessFor(role);
    expect(data).toBeFalsy();
  });
});
