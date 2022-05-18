import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContributorTextbooksComponent } from './list-contributor-textbooks.component';
import { NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { DaysToGoPipe } from '@sunbird/shared-feature';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SharedModule, ToasterService, ConfigService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DynamicModule } from 'ng-dynamic-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import * as SpecData from './list-contributor-textbooks.spec.data';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { throwError, Subject, of } from 'rxjs';
import { ProgramsService, UserService, FrameworkService, NotificationService, ContentHelperService } from '@sunbird/core';
import { HelperService } from '../../../sourcing/services/helper.service';
import { SourcingService } from './../../../sourcing/services';
import { ProgramTelemetryService } from '../../services';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';

describe('ListContributorTextbooksComponent', () => {
  let component: ListContributorTextbooksComponent;
  let fixture: ComponentFixture<ListContributorTextbooksComponent>;
  const routerStub = { url: '/sourcing' };
const errorInitiate = false;
  const userServiceStub = {
    get() {
      if (errorInitiate) {
        return throwError ({
          result: {
            responseCode: 404
          }
        });
      }
    },
    userid: SpecData.userProfile.userId,
    userProfile : SpecData.userProfile
  };
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '12345'
      },
      data: {
        telemetry: {
          env: 'workspace', pageid: 'list-contributor', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    },
    fragment:({})
  };
  const resourceBundle = {
    messages: {
      emsg: {
        blueprintViolation : 'Please provide all required blueprint values'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
     imports: [
            DynamicModule,
            SuiModule,
            SharedModule.forRoot(),
            ReactiveFormsModule,
            FormsModule,
            TelemetryModule.forRoot(),
            HttpClientTestingModule,
            RouterModule.forRoot([])
        ],
      declarations: [ ListContributorTextbooksComponent, DaysToGoPipe],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: UserService, useValue: userServiceStub },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ResourceService, useValue: resourceBundle },
        ToasterService , ConfigService, DatePipe, ProgramStageService, 
        ProgramsService, FrameworkService, HelperService, Subject,
        ViewChild, NavigationHelperService, CollectionHierarchyService, ContentHelperService,
        SourcingService, ProgramTelemetryService, TelemetryService, NotificationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContributorTextbooksComponent);
    component = fixture.componentInstance;
    component.stageSubscription= new Subject;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    const  programsService  = TestBed.get(ProgramsService);
    component.targetCollections = 'Question papers';
    component.programDetails = SpecData.programDetailsTargetCollection;
    spyOn(programsService, 'setTargetCollectionName').and.returnValue('Question papers');
    component.fetchProgramDetails();
    expect(component.programDetails).toBe(SpecData.programDetailsTargetCollection);
    expect(component.targetCollections).toEqual('Question papers');
  });

  it('#setFrameworkCategories() should call helperService.setFrameworkCategories()', () => {
    const collection = {};
    const  helperService  = TestBed.get(HelperService);
    spyOn(helperService, 'setFrameworkCategories').and.returnValue({});
    spyOn(component, 'setFrameworkCategories').and.callThrough();
    component.setFrameworkCategories(collection);
    expect(helperService.setFrameworkCategories).toHaveBeenCalledWith({});
  });

  it('#getPageId() should return pageId', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const pageId = component.getPageId();
    expect(pageId).toBeDefined();
  });

  it('#getTelemetryInteractEdata() should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('download_collection_level_content_gap_report',
    'click', 'launch', 'sourcing_my_projects', undefined);
    expect(returnObj).not.toContain(undefined);
  });

  it('#setContextualHelpConfig should set reviewContributionHelpConfig', () => {
    component.reviewContributionHelpConfig = undefined;
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'getContextualHelpConfig').and.returnValue(SpecData.contextualHelpConfig);
    spyOn(component, 'setContextualHelpConfig').and.callThrough();
    component.setContextualHelpConfig();
    expect(component.reviewContributionHelpConfig).toBeDefined();
  });

  it('#getProgramContents should get Program Contents', () => {

    component.contributor = {nominationData : {status : 'Pending'}};
    component.sessionContext = {nominationDetails :{
      organisation_id :'organisation_id',
      user_id : 'user_id'
    }};
    const collectionHierarchyService = TestBed.get(CollectionHierarchyService);
    spyOn(collectionHierarchyService, 'getContentAggregation').and.returnValue(of({result: 'content'}));
    spyOn(component, 'getProgramContents').and.callThrough();
    component.getProgramContents();
    expect(component.getProgramContents).toHaveBeenCalled();
  });

  it('#openContent should set reviewContributionHelpConfig', () => {
    const contentHelperService = TestBed.get(ContentHelperService);
    const programStageService = TestBed.get(ProgramStageService);
    spyOn(component, 'openContent').and.returnValue(of({'dynamicInputs':'',
    'currentComponent':'',
   'currentComponentName':''}));
    component.openContent('');
    spyOn(contentHelperService, 'initialize').and.callFake(() => {});
    spyOn(contentHelperService, 'openContent').and.callFake(() => {});
    spyOn(programStageService, 'addStage').and.callThrough();
    expect(component.openContent).toHaveBeenCalled();
   // expect(contentHelperService.initialize).toHaveBeenCalled();
   // expect(programStageService.addStage).toHaveBeenCalled();
  });

  it('#showTexbooklist should show Texbook list', () => {
    component.reviewContributionHelpConfig = undefined;
    const collectionHierarchyService = TestBed.get(CollectionHierarchyService);
    component.selectedNominationDetails = {
      nominationData: {
        collection_ids: ['1', '2']
      }
    };
    component.sessionContext = { nominationDetails: true };
    component.sessionContext = {
      nominationDetails: {
        status: 'Pending'
      }
    };
    spyOn(component, 'isNominationOrg').and.returnValue(false);
    spyOn(collectionHierarchyService, 'getContentAggregation').and.returnValue(of({ result: { 'content': [] } }));
    spyOn(collectionHierarchyService, 'getIndividualCollectionStatus').and.callFake(() => { });
    spyOn(component, 'showTexbooklist').and.callThrough();
    const res = {
      result: {
        content: ['bbbb', 'hhh']
      }
    }
    component.showTexbooklist(res);
    expect(component.showTexbooklist).toHaveBeenCalled();
  });

  it('#showTexbooklist should throw error on service failure', () => {
    component.reviewContributionHelpConfig = undefined;
    const collectionHierarchyService = TestBed.get(CollectionHierarchyService);
    component.selectedNominationDetails = {
      nominationData: {
        collection_ids: ['1', '2']
      }
    };
    component.sessionContext = { nominationDetails: true };
    component.sessionContext = {
      nominationDetails: {
        status: 'Pending'
      }
    };
    spyOn(component, 'isNominationOrg').and.returnValue(false);
    spyOn(collectionHierarchyService, 'getContentAggregation').and.returnValue(of(throwError({})));
    const res = {
      result: {
        content: ['bbbb', 'hhh']
      }
    }
    component.showTexbooklist(res);
    expect(component.showTexbooklist).toThrowError();
  });

  xit('#ngOnInit should initialize the member variables', () => {
    TestBed.get(ActivatedRoute).snapshot.params = of({ programId: '12345'});
    //component.programId = undefined;
    component.contributor = JSON.parse('{"nominationData":{"targetprimarycategories": "{}"}}');
    component.contributor = true;
    const programStageService = TestBed.get(ProgramStageService);
    spyOn(programStageService, 'initialize').and.callFake(() => {});
    spyOn(component, 'getPageId').and.callFake(() => {});
    spyOn(component, 'changeView').and.callFake(() => {});
    spyOn(programStageService, 'getStage').and.callFake(() => {});
    spyOn(programStageService, 'addStage').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.getPageId).toHaveBeenCalled();
    expect(component.programContext).toBeDefined();
    expect(component.changeView).toHaveBeenCalled();
/*     expect(component.programConfig).toBeDefined();
    expect(component.localBlueprint).toBeDefined();
    expect(component.localBlueprintMap).toBeDefined(); */
  });
});
