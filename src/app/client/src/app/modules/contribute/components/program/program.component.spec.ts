import { TestBed, inject, ComponentFixture,  } from '@angular/core/testing';
import { SharedModule, ToasterService, ResourceService, NavigationHelperService, PaginationService, ConfigService } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService, RegistryService, ProgramsService, ActionService, ContentHelperService } from '@sunbird/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import * as _ from 'lodash-es';
import { of as observableOf, throwError, of } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { addParticipentResponseSample, userProfile, frameWorkData, programDetailsWithOutUserDetails, programDetailsWithOutUserAndForm, extFrameWorkPostData, programDetailsWithUserDetails, programDetailsTargetCollection, contextualHelpConfig } from './program.component.spec.data';
import { CollectionComponent } from '../../../sourcing/components/collection/collection.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
// tslint:disable-next-line:prefer-const
let errorInitiate;
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { userDetail, chunkedUserList } from '../../services/programUserTestData';
import { DaysToGoPipe } from '@sunbird/shared-feature';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { programSession } from './data';
import { HelperService } from '../../../sourcing/services/helper.service';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { ProgramComponentsService } from '../../services/program-components/program-components.service';
import { TelemetryService } from '@sunbird/telemetry';
import { SourcingService } from '../../../sourcing/services';
import { ServerResponse } from 'http';

const userServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(addParticipentResponseSample);
    }
  },
  isUserBelongsToOrg: () => {
    return of({
      userRegData: {
        User_Org: 'User_Org'
      }
    })
  },
  getUserOrgRole() {

  },
  isContributingOrgContributor() {

  },
  isDefaultContributingOrg() {

  },
  getMyRoleForProgram() {

  },
  getUserOrgId() {

  },
  userid: userProfile.userId,
  userProfile: userProfile,
  channel: '123456789',
  appId: 'dummyValue',
  isContributingOrgAdmin: () => {
    return true;
  }

};

const extPluginServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of({ err: null, result: programDetailsWithUserDetails });
    }
  },
  post() {
    if (errorInitiate) {
      return throwError({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(extFrameWorkPostData);
    }
  }
};

const resourceServiceStub = {
  messages: {
    emsg: {
      project: {
        m0001: 'm0001'
      }
    }
  }
};


const frameworkServiceStub = {
  initialize() {
    return null;
  },
  getMasterCategories() {

  },
  readFramworkCategories: of(frameWorkData),
  frameworkData$: of(frameWorkData)
};

xdescribe('ProgramComponent', () => {
  let component: ProgramComponent;
  let fixture: ComponentFixture<ProgramComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const routerStub = { url: '/sourcing/contribute' };
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
      },
      data: {
        telemetry: {
          env: 'programs',
          pageid: 'program'
        }
      }
    }
  };



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DynamicModule,
        SuiModule,
        SharedModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TelemetryModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [
        ProgramComponent,
        OnboardPopupComponent,
        DaysToGoPipe
      ],
      providers: [
        RegistryService,
        {
          provide: Router,
          useValue: routerStub
        },
        {
          provide: FrameworkService,
          useValue: frameworkServiceStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        },
        {
          provide: ExtPluginService,
          useValue: extPluginServiceStub
        },
        DatePipe,
        CollectionHierarchyService,
        ToasterService,
        {
          provide: ResourceService,
          useValue: resourceServiceStub
        },
        HelperService, ConfigService, ProgramStageService, ProgramComponentsService, ProgramsService,
        NavigationHelperService, PaginationService, ActionService, TelemetryService, UntypedFormBuilder,
        SourcingService, ProgramTelemetryService, ContentHelperService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ProgramComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should call toaster.error when program is null', () => {
    component.programId = null;
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    spyOn(component, 'getPageId').and.callThrough();
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.project.m0001);
    expect(component.getPageId).toHaveBeenCalled();
  });

  it('#ngOnInit() should call #getPageId()', () => {
    spyOn(component, 'getPageId').and.callThrough();
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.getPageId).toHaveBeenCalled();
  });

  it('#getPageId() should set telemetryPageId value', () => {
    spyOn(component, 'getPageId').and.callThrough();
    component.getPageId();
    expect(component.telemetryPageId).toBeDefined();
  });


  it('#ngOnInit() should call #getProgramDetails()', () => {
    spyOn(component, 'getProgramDetails').and.callThrough();
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.getProgramDetails).toHaveBeenCalled();
  });

  it('#getProgramDetails() should get Program Details', () => {
    component.programId = '12345';
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'], 'getProgram').and.returnValue(of({ result: { config: { roles: [{ a: 'sss' }, { b: 'rrr' }] } } })as any);
    spyOn(component['programsService'], 'getProgramTargetPrimaryCategories').and.callFake(() => { });
    spyOn(component, 'getNominationStatus').and.callFake(() => { });
    spyOn(component, 'setTargetCollectionValue').and.callFake(() => { });
    spyOn(component, 'getCollectionCategoryDefinition').and.callFake(() => { });
    component.getProgramDetails();

    expect(component['programsService'].getProgram).toHaveBeenCalled();
  });


  it('#getProgramContents() should get Program contents', () => {
    component.programId = '12345';
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);
    component['contentHelperService'] = TestBed.inject(ContentHelperService);
    spyOn(component['collectionHierarchyService'], 'getContentAggregation').and.returnValue(of({ result: { content: { roles: [{ a: 'sss' }, { b: 'rrr' }] } } })as any);
    spyOn(component['contentHelperService'], 'shouldContentBeVisible').and.callFake(() => {return false});
    spyOn(component['contentHelperService'], 'checkSourcingStatus').and.callFake(() => {return 'Approved'});
    spyOn(component['contentHelperService'], 'getContentDisplayStatus').and.callFake(() => []);
    spyOn(component, 'logTelemetryImpressionEvent').and.callFake(() => {return false});
    component.getProgramContents();

    expect(component['collectionHierarchyService'].getContentAggregation).toHaveBeenCalled();
  });

  it('#showTexbooklist() should show Texbook list', () => {
    component.programDetails = {
      target_type: 'questionSets'
    };
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);
    spyOn(component['collectionHierarchyService'], 'getContentAggregation').and.returnValue(of(
      {
        result: {
          content: { roles: [{ a: 'sss' }, { b: 'rrr' }] },
          Question: { Question: [{ a: 'sss' }, { b: 'rrr' }] },
          QuestionSet: { QuestionSet: [{ a: 'sss' }, { b: 'rrr' }] }
        },
        id: '',
        params: { resmsgid: '', status: '' },
        responseCode: '200',
        ts: '',
        ver:''
      }
    )) as unknown as ServerResponse;
    spyOn(component['collectionHierarchyService'], 'getContentCounts').and.callFake(() => {return { sourcingOrgStatus: {}, total: 2, sample: 2, review: 2, draft: 2, rejected: 2, correctionsPending: 2, live: 2, individualStatus: {}, individualStatusForSample: {}, mvcContributionsCount: 2 } });
    spyOn(component['collectionHierarchyService'], 'getIndividualCollectionStatus').and.callFake(() => { });
    spyOn(component, 'logTelemetryImpressionEvent').and.callFake(() => { return true});
    component.showTexbooklist(['aaa']);

    expect(component['collectionHierarchyService'].getContentAggregation).toHaveBeenCalled();
  });

  xit('#setOrgUsers() should set Org Users', () => {
    component.nominationDetails = { rolemapping: { ccc: 'cccc' } };
    spyOn(component['userService'], 'getMyRoleForProgram').and.returnValue(['CONTRIBUTOR']);
    spyOn(component, 'sortOrgUsers').and.callFake(() => { });
    spyOn(component, 'logTelemetryImpressionEvent').and.callFake(() => {return true });
    const result = component.setOrgUsers([{ "selectedRole": "user" }]);
    expect(result).toBeTruthy();
  });

  it('#handleActionButtons() should handle Action Buttons', () => {
    component.programDetails = {
      target_type: 'collections'
    }
    component.nominationDetails = {
      id: 'id'
    }
    component.currentNominationStatus = 'Approved'
    component['helperService'] = TestBed.inject(HelperService);
    component['programsService'] = TestBed.inject(ProgramsService);

    spyOn(component['userService'], 'getMyRoleForProgram').and.returnValue(['CONTRIBUTOR']);
    spyOn(component['programsService'], 'ifSourcingInstance').and.callFake(() => {return true });
    spyOn(component['helperService'], 'isOpenForNomination').and.callFake(() => { return true});
    spyOn(component['helperService'], 'canAcceptContribution').and.callFake(() => { return true});
    component.handleActionButtons();
    expect(component.visibility).toBeTruthy();
  });

  it('#deleteContent() should retire contents ', () => {
    component.contributorTextbooks = [{
      identifier: 0
    }]
    component.contentId = '0';
    component['helperService'] = TestBed.inject(HelperService);

    spyOn(component['helperService'], 'retireContent').and.returnValue(of(
      { result: { node_id: 'node_id' },
      id: '',
      params: { resmsgid: '', status: '' },
      responseCode: '200',
      ts: '',
      ver:''
     }
      ));
    component.deleteContent();

    expect(component['helperService'].retireContent).toHaveBeenCalled();
  });

  it('#getOriginForApprovedContents() should get Origin For ApprovedContents ', () => {
    component.programDetails = {
      acceptedcontents: 'component'
    }
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);

    spyOn(component['collectionHierarchyService'], 'getOriginForApprovedContents').and.returnValue(of({ result: { count: 5, content: ['count'], QuestionSet: [{}] },
    id: '',
    params: { resmsgid: '', status: '' },
    responseCode: '200',
    ts: '',
    ver:'' }));
    component.getOriginForApprovedContents();

    expect(component['collectionHierarchyService'].getOriginForApprovedContents).toHaveBeenCalled();
  });

  it('#getProgramContentAggregation() should get Program Content Aggregation ', () => {
    component.currentNominationStatus = 'Initiated';

    
    component['userService'] = TestBed.inject(UserService);
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);
    
    spyOn(component['userService'], 'isUserBelongsToOrg').and.callFake(() => { return true});
    spyOn(component['collectionHierarchyService'], 'getContentAggregation').and.returnValue(of({ result: { count: 5, content: ['count'], QuestionSet: [{}] }, id: '',
    params: { resmsgid: '', status: '' },
    responseCode: '200',
    ts: '',
    ver:'' }));
    component.getProgramContentAggregation();

    expect(component['collectionHierarchyService'].getContentAggregation).toHaveBeenCalled();
  });

  

  it('#openCollection() should open Collection', () => {
    component.programDetails = {
      program_id: 'program_id'
    }
    component.sessionContext = {
      framework: 'framework0'
    }
    component['helperService'] = TestBed.inject(HelperService);
    component['frameworkService'] = TestBed.inject(FrameworkService);
    spyOn(component['userService'], 'getMyRoleForProgram').and.returnValue(['CONTRIBUTOR']);
    spyOn(component['helperService'], 'getSharedProperties').and.returnValue({ framework: 'framework' });
    spyOn(component['frameworkService'], 'readFramworkCategories').and.returnValue(of({ categories: 'categories', type: 'type' }));

    spyOn(component, 'sortOrgUsers').and.callFake(() => { });
    spyOn(component, 'setFrameworkCategories').and.callFake(() => { });
    component.openCollection({
      primaryCategory: 'user',
      mimeType: 'mimeType',
      objectType: 'objectType',
      identifier: 'identifier',
      name: 'name'
    });

    expect(component['helperService'].getSharedProperties).toHaveBeenCalled();
    expect(component['frameworkService'].readFramworkCategories).toHaveBeenCalled();

  });

  it('#getNominationStatus() should get nomination status', () => {

    component.programDetails = {
      target_type: 'collections',
    };
    component['programsService'] = TestBed.inject(ProgramsService);
    component['helperService'] = TestBed.inject(HelperService);
    component['frameworkService'] = TestBed.inject(FrameworkService);

    spyOn(component['programsService'], 'getNominationList').and.returnValue(of({
      result: {
        content_types: 'content_types',
        status: 'status',
        collection_ids: 'collection_ids',
        defaultContributeOrgReview: {},
        type: 'restricted'
      }, 
      id: '',
      params: { resmsgid: '', status: '' },
      responseCode: '200',
      ts: '',
      ver:'' 

    }));

    spyOn(component['programsService'], 'getProgramTargetPrimaryCategories').and.callFake(() => { });
    spyOn(component['helperService'], 'getSharedProperties').and.callFake(() => { });
    spyOn(component['frameworkService'], 'getMasterCategories').and.callFake(() => { });
    spyOn(component['frameworkService'], 'readFramworkCategories').and.returnValue(of({
      result: {
        content_types: 'content_types',
        status: 'status',
        collection_ids: 'collection_ids',
        categories: { code: 'topic' },
        type: 'restricted'
      }
    }));

    spyOn(component, 'handleActionButtons').and.callFake(() => { });
    spyOn(component, 'setifSampleInSession').and.callFake(() => { });
    spyOn(component, 'setProgramRole').and.callFake(() => { });
    component.getNominationStatus();

    expect(component['programsService'].getNominationList).toHaveBeenCalled();
  });

  xit('#setProgramRole() should set Program Role', () => {

    component.currentNominationStatus = 'Approved';

    component.sessionContext = {
      nominationDetails: {
        rolemapping: 'rolemapping',
      },
      //currentRoles: ['name'],
      currentOrgRole: 'admin'
    }
    component.sessionContext.currentRoles = ['name'];
    component.programDetails = {
      config: {
        defaultContributeOrgReview: false,
      },
      type: 'restricted'
    };
    component.roles = [{
      name: 'name',
      id: 'id'
    }];
    spyOn(component['userService'], 'isContributingOrgContributor').and.callFake(() => { });
    spyOn(component['userService'], 'isDefaultContributingOrg').and.callFake(() => {return true });
    component.setProgramRole();

    expect(component['userService'].isContributingOrgContributor).toHaveBeenCalled();
    expect(component['userService'].isDefaultContributingOrg).toHaveBeenCalled();
  });

  it('fetchProgramFramework should called #frameworkService()', () => {
    component.sessionContext = {
      framework: 'NCFCOPY'
    }
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'fetchProgramFramework').and.returnValue({});
    helperService.fetchProgramFramework(component.sessionContext)
    expect(helperService.fetchProgramFramework).toHaveBeenCalledWith(component.sessionContext);
  });

  it('should tabChangeHandler be triggered', () => {
    component.tabChangeHandler('collectionComponent');
    expect(component.component).toBe(CollectionComponent);
  });

  xit('stageSubscription should get subcribe on component initialize', () => {
    expect(component.stageSubscription).toBeDefined();
  });

  xit('should call changeView on stage change', () => {
    // const programStageSpy = jasmine.createSpyObj('programStageService', ['getStage']);
    // programStageSpy.getStage.and.returnValue('stubValue');
    component.programStageService.getStage = jasmine.createSpy('getstage() spy').and.callFake(() => {
      return observableOf({ stages: [] });
    });
    spyOn(component, 'changeView');
    component.ngOnInit();
    expect(component.changeView).toHaveBeenCalled();
  });

  it('should unsubscribe subject', () => {
    component.ngOnDestroy();
  });

  it('#getUserDetailsBySearch() should call #sortUsersList() when there is no search input', () => {
    component.searchInput = '';
    component.initialSourcingOrgUser = ['dummyUser'];
    spyOn(component, 'sortUsersList').and.callThrough();
    spyOn(component, 'getUserDetailsBySearch').and.callThrough();
    component.getUserDetailsBySearch();
    expect(component.sortUsersList).toHaveBeenCalledWith(['dummyUser'], true);
  });

  it('#getUserDetailsBySearch() should call registryService.getSearchedUserList() when there is a search input', () => {
    component.searchInput = 'jnc68';
    component.initialSourcingOrgUser = ['dummyUser'];
    const sortUsersListData = ['user1', 'user2', 'user3'];
    component['registryService'] = TestBed.inject(RegistryService);
    spyOn(component, 'sortUsersList').and.callFake(() => { });;
    spyOn(component['registryService'], 'getSearchedUserList').and.returnValue(sortUsersListData);
    component.getUserDetailsBySearch();
    expect(component['registryService'].getSearchedUserList).toHaveBeenCalledWith(['dummyUser'], 'jnc68');
    expect(component.sortUsersList).toHaveBeenCalledWith(sortUsersListData, true);
  });

  it('#sortUsersList() should call programsService.sortCollection()', () => {
    const usersList = ['user1', 'user2', 'user3'];
    const usersListDesc = ['user3', 'user2', 'user1'];
    component.sortColumnOrgUsers = 'projectselectedRole';
    component.directionOrgUsers = 'desc';
    component.OrgUsersCnt = 0;
    const programsService = TestBed.get(ProgramsService);
    spyOn(component, 'sortUsersList').and.callThrough();
    spyOn(programsService, 'sortCollection').and.returnValue(usersListDesc);
    component.sortUsersList(usersList);
    expect(component.OrgUsersCnt).toEqual(usersList.length);
    expect(programsService.sortCollection).toHaveBeenCalledWith(usersList, 'projectselectedRole', 'desc');
    expect(component.allContributorOrgUsers).toEqual(usersListDesc);
  });

  it('call the sortUsersList method and put user to initial org list', () => {
    component.pageLimit = 1;
    const usersList = ['user1', 'user2', 'user3'];
    const usersListDesc = ['user3', 'user2', 'user1'];
    const chunkList = [['user3'], ['user2'], ['user1']];
    component.isInitialSourcingOrgUser = true;
    const programsService = TestBed.get(ProgramsService);
    spyOn(component, 'sortUsersList').and.callThrough();
    spyOn(programsService, 'sortCollection').and.returnValue(usersListDesc);
    component.sortUsersList(usersList, true);
    const sortedList = programsService.sortCollection(usersList, 'projectselectedRole', 'desc');
    expect(component.paginatedContributorOrgUsers).toEqual(chunkList);
    expect(component.contributorOrgUser).toEqual(chunkList[0]);
  });

  it('#setTargetCollectionValue() should set targetCollection values', () => {
    component.targetCollections = undefined;
    component.programDetails = programDetailsTargetCollection;
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'setTargetCollectionName').and.returnValue('Digital Textbook');
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).not.toBeUndefined();
  });

  it('#setTargetCollectionValue() should not set targetCollection values', () => {
    component.targetCollections = undefined;
    component.programDetails = undefined;
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'setTargetCollectionName').and.returnValue(undefined);
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).toBeUndefined();
  });

  it('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    const programsService = TestBed.get(ProgramsService);
    component.programDetails = programDetailsTargetCollection;
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    spyOn(programsService, 'setTargetCollectionName').and.callThrough();
    component.setTargetCollectionValue();
    expect(programsService.setTargetCollectionName).toHaveBeenCalled();
  });

  it('#setFrameworkCategories() should call helperService.setFrameworkCategories()', () => {
    const collection = {};
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'setFrameworkCategories').and.returnValue({});
    spyOn(component, 'setFrameworkCategories').and.callThrough();
    component.setFrameworkCategories(collection);
    expect(helperService.setFrameworkCategories).toHaveBeenCalledWith({});
  });

  it('#getTelemetryInteractEdata() should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('select_content_types',
      'click', 'launch', 'sourcing_my_projects', undefined);
    expect(returnObj).not.toContain(undefined);
  });

  
  xit('#setContextualHelpConfig should set variable values', () => {
    component.assignUserHelpSectionConfig = undefined;
    component.contributeHelpSectionConfig = undefined;
    component.nominationHelpSectionConfig = undefined;
    component.noUsersFoundHelpConfig = undefined;
    component.reviewHelpSectionConfig = undefined;
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'getContextualHelpConfig').and.returnValue(contextualHelpConfig);
    component.setContextualHelpConfig();
    expect(component.assignUserHelpSectionConfig).toBeDefined();
    expect(component.contributeHelpSectionConfig).toBeDefined();
    expect(component.nominationHelpSectionConfig).toBeDefined();
    expect(component.noUsersFoundHelpConfig).toBeDefined();
    expect(component.reviewHelpSectionConfig).toBeDefined();
  });
});
