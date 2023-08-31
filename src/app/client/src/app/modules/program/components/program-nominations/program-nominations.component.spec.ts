import { TestBed, ComponentFixture,  } from '@angular/core/testing';
import { SharedModule, ToasterService, ConfigService, ResourceService, NavigationHelperService, PaginationService } from '@sunbird/shared';
import { ProgramsService, UserService, FrameworkService, NotificationService, ContentHelperService, RegistryService } from '@sunbird/core';
import { DynamicModule } from 'ng-dynamic-component';
import * as _ from 'lodash-es';
import { throwError, of, Subject } from 'rxjs';
import * as SpecData from './program-nominations.spec.data';
import { userDetail, chunkedUserList } from '../../services/programUserTestData';
import { ProgramNominationsComponent } from './program-nominations.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysToGoPipe, TextbookListComponent } from '../../../shared-feature';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../sourcing';
import { ContributorProfilePopupComponent } from '../contributor-profile-popup/contributor-profile-popup.component';
import { convertToParamMap } from '@angular/router';
import { HelperService } from '../../../sourcing/services/helper.service';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';
import { ProgramTelemetryService } from '../../services';
import { SourcingService } from '../../../sourcing/services';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

const errorInitiate = false;
const userServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(SpecData.addParticipentResponseSample);
    }
  },
  userid: SpecData.userProfile.userId,
  userProfile: SpecData.userProfile,
  appId: '12345'
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
      return of({ err: null, result: SpecData.programDetailsWithUserDetails });
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
      return of(SpecData.extFrameWorkPostData);
    }
  }
};

const frameworkServiceStub = {
  initialize() {
    return null;
  },
  frameworkData$: of(SpecData.frameWorkData)
};

describe('ProgramNominationsComponent', () => {
  let component: ProgramNominationsComponent;
  let collectionHierarchyService: CollectionHierarchyService;
  let programsService: ProgramsService;
  let programStageService: ProgramStageService;
  let registryService: RegistryService;
  let fixture: ComponentFixture<ProgramNominationsComponent>;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: () => {
      return {
        extras: {
          state: {
            arcadeSelectedGame: '-LAbVp7C0lTu9CV-Mgt-'
          }
        }
      }
    },
    url: '/sourcing'
  }

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
      },
      data: {
        telemetry: {
          env: 'programs',
          pageid: 'program-nomination'
        }
      }
    },
    queryParamMap: of(convertToParamMap({
      tab: 'contributionDashboard'
    }))
  };
  const resourceBundle = {
    messages: {
      emsg: {
        blueprintViolation: 'Please provide all required blueprint values'
      }
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DynamicModule,
        SuiModule,
        SharedModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        TelemetryModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [
        ProgramNominationsComponent,
        OnboardPopupComponent,
        DaysToGoPipe,
        TextbookListComponent,
        ContributorProfilePopupComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: UserService, useValue: userServiceStub },
        { provide: ResourceService, useValue: resourceBundle },
        ToasterService, ConfigService, DatePipe, ProgramStageService,
        ProgramsService, FrameworkService, HelperService, Subject, PaginationService,
        NavigationHelperService, CollectionHierarchyService, ContentHelperService,
        SourcingService, ProgramTelemetryService, TelemetryService, NotificationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ProgramNominationsComponent);
    component = fixture.componentInstance;
    programsService = TestBed.inject(ProgramsService);
    programStageService = TestBed.inject(ProgramStageService);
    registryService = TestBed.inject(RegistryService);
    collectionHierarchyService = TestBed.inject(CollectionHierarchyService);
    // fixture.detectChanges();
    let router: Router = TestBed.inject(Router);
    component.telemetryImpression = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [{}],
        pdata: {
          id: 'userService.appId',
          ver: 'version',
          pid: 'PID'
        },
        did: ''
      },
      edata: {
        type: 'snapshot.data.telemetry.type',
        pageid: 'getPageId',
        uri: 'router.url',
        duration: 10
      }
    };
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should have create and defined component', () => {
    expect(component).toBeDefined();
  });

  xit('should contribution dashboard data should not be empty', () => {
    spyOn(programsService, 'get').and.callFake(() => {
      return of(SpecData.readProgramApiSuccessRes);
    });
    let postAlreadyCalled = false;
    spyOn(programsService, 'post').and.callFake(() => {
      if (postAlreadyCalled) {
        return of(SpecData.approvedNominationListApiSuccessRes);
      }
      postAlreadyCalled = true;
      return of(SpecData.nominationListCountApiSuccessRes);
    });
    spyOn(collectionHierarchyService, 'getContentAggregation').and.callFake(() => {
      return of(SpecData.searchContentApiSuccessRes);
    });
    spyOn(collectionHierarchyService, 'getCollectionWithProgramId').and.callFake(() => {
      return of(SpecData.programCollectionListApiSuccessRes);
    });
    component.getProgramDetails();
    expect(component.contributionDashboardData.length).toBe(2);
  });

  it('#ngOnInit() method should initialize', () => {
    spyOn(component, 'getPageId').and.callFake(() => {return '' });
    spyOn(component, 'getProgramDetails').and.callFake(() => { });
    spyOn(programStageService, 'initialize').and.callFake(() => { });
    spyOn(programStageService, 'addStage').and.callFake(() => { });
    spyOn(programStageService, 'getStage').and.returnValue(of({ stages: {} }));
    spyOn(component, 'changeView').and.callFake(() => { });
    component.ngOnInit();
    expect(component.filterApplied).toBeNull();
    expect(component.programId).toBeDefined();
    expect(component.getPageId).toHaveBeenCalled();
    expect(component.getProgramDetails).toHaveBeenCalled();
    expect(component.telemetryInteractCdata).toBeDefined();
    expect(component.telemetryInteractPdata).toBeDefined();
    expect(programStageService.initialize).toHaveBeenCalled();
    expect(programStageService.addStage).toHaveBeenCalled();
    expect(component.changeView).toHaveBeenCalled();
    expect(component.searchLimitCount).toBeDefined();
    expect(component.pageLimit).toBeDefined();
  });

  xit('#ngAfterViewInit() should set variable', () => {
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(component.telemetryImpression).toBeDefined();
  });

  it('#setTelemetryPageId() should return routes pageid', () => {
    component.telemetryPageId = 'nomination';
    component['activatedRoute'] = undefined;
    spyOn(component, 'getPageId').and.callThrough();
    const pageId = component.getPageId();
    expect(pageId).toBeDefined();
  });

  it('#setTelemetryPageId() should set telemetryPageId for textbook', () => {
    spyOn(component, 'setTelemetryPageId').and.callThrough();
    component.setTelemetryPageId('textbook');
    expect(component.telemetryPageId).toBeDefined();
  });

  it('#setTelemetryPageId() should set telemetryPageId for nomination', () => {
    spyOn(component, 'setTelemetryPageId').and.callThrough();
    component.setTelemetryPageId('nomination');
    expect(component.telemetryPageId).toBeDefined();
  });

  it('#setTelemetryPageId() should set telemetryPageId for user', () => {
    spyOn(component, 'setTelemetryPageId').and.callThrough();
    component.setTelemetryPageId('user');
    expect(component.telemetryPageId).toBeDefined();
  });

  it('#setTelemetryPageId() should set telemetryPageId for contributionDashboard', () => {
    spyOn(component, 'setTelemetryPageId').and.callThrough();
    component.setTelemetryPageId('contributionDashboard');
    expect(component.telemetryPageId).toBeDefined();
  });

  it('#setTelemetryPageId() should set telemetryPageId for report', () => {
    spyOn(component, 'setTelemetryPageId').and.callThrough();
    component.setTelemetryPageId('report');
    expect(component.telemetryPageId).toBeDefined();
  });

  it('#sortCollection() should set nominations value', () => {
    component.direction = 'desc';
    component.nominations = [];
    spyOn(programsService, 'sortCollection').and.returnValue([]);
    spyOn(component, 'sortCollection').and.callThrough();
    component.sortCollection('name');
    expect(programsService.sortCollection).toHaveBeenCalled();
    expect(component.direction).toEqual('asc');
    expect(component.sortColumn).toEqual('name');
  });

  xit('#getUserDetailsBySearch() should call sortUsersList', () => {
    component.searchLimitCount = 1;
    component['initialSourcingOrgUser'] = ['1234abcd'];
    component.searchInput = 'abcd';
    spyOn(registryService, 'getSearchedUserList').and.returnValue({} as any);
    spyOn(component, 'getUserDetailsBySearch').and.callThrough();
    spyOn(component, 'sortUsersList').and.callFake(() => []);
    component.getUserDetailsBySearch();
    expect(registryService.getSearchedUserList).toHaveBeenCalled();
    expect(component.searchLimitMessage).toBeFalsy();
  });

  xit('should call generateCSV method', () => {
    spyOn(programsService, 'get').and.callFake(() => {
      return of(SpecData.readProgramApiSuccessRes);
    });
    let postAlreadyCalled = false;
    spyOn(programsService, 'post').and.callFake(() => {
      if (postAlreadyCalled) {
        return of(SpecData.approvedNominationListApiSuccessRes);
      }
      postAlreadyCalled = true;
      return of(SpecData.nominationListCountApiSuccessRes);
    });
    spyOn(collectionHierarchyService, 'getContentAggregation').and.callFake(() => {
      return of(SpecData.searchContentApiSuccessRes);
    });
    spyOn(collectionHierarchyService, 'getCollectionWithProgramId').and.callFake(() => {
      return of(SpecData.programCollectionListApiSuccessRes);
    });
    spyOn(programsService, 'generateCSV');

    component.ngOnInit();

    component.downloadContribDashboardDetails();

    expect(programsService.generateCSV).toHaveBeenCalled();
  });
  xit('reset the user list when there is no search input', () => {
    spyOn(component, 'sortUsersList');
    component.searchInput = '';
    expect(component.sortUsersList).toHaveBeenCalledWith(userDetail.result.response.content);
  });
  xit('get the user list when there is a search input', () => {
    spyOn(component, 'sortUsersList');
    component.searchInput = 'jnc68';
    const registryService = TestBed.get(RegistryService);
    const userList = registryService.getSearchedUserList(userDetail.result.response.content, component.searchInput);
    expect(component.sortUsersList).toHaveBeenCalledWith(userList);
  });
  xit('call the sortUsersList method when there is input', () => {
    component.pageLimit = 1;
    component.searchInput = 'jnc68';
    component.sortUsersList(userDetail.result.response.content);
    const sortedList = programsService.sortCollection(userDetail.result.response.content, 'selectedRole', 'desc');
    expect(component.paginatedSourcingUsers).toBe(sortedList);
    expect(component.sourcingOrgUser).toBe(chunkedUserList[0]);
    expect(component.sourcingOrgUserCnt).toBe(chunkedUserList[0].length);
  });
  xit('call the sortUsersList method when there is empty input', () => {
    component.pageLimit = 1;
    component.searchInput = '';
    component.sortUsersList(userDetail.result.response.content);
    const sortedList = programsService.sortCollection(userDetail.result.response.content, 'selectedRole', 'desc');
    expect(component.paginatedSourcingUsers).toBe(sortedList);
    expect(component.sourcingOrgUser).toBe(userDetail.result.response.content);
    expect(component.sourcingOrgUserCnt).toBe(userDetail.result.response.content.length);
  });
  xit('#setTargetCollectionValue() should set targetCollection values', () => {
    spyOn(programsService, 'setTargetCollectionName').and.returnValue('Digital Textbook');
    component.programDetails = SpecData.programDetailsTargetCollection;
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).not.toBeUndefined();
  });
  it('#setTargetCollectionValue() should not set targetCollection values in program-nomination', () => {
    component.targetCollection = undefined;
    component.programDetails = undefined;
    spyOn(programsService, 'setTargetCollectionName').and.returnValue(undefined);
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).toBeUndefined();
  });
  it('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    component.programDetails = SpecData.programDetailsTargetCollection;
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
  xit('#getCollectionCategoryDefinition() Should call programsService.getCategoryDefinition() method', () => {
    component['programDetails'] = { target_collection_category: 'Course' };
    component['userService'] = TestBed.inject(UserService);
    component.firstLevelFolderLabel = undefined;
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(SpecData.objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).toHaveBeenCalled();
    expect(component.firstLevelFolderLabel).toBeDefined();
  });

  it('#getCollectionCategoryDefinition() Should not call programsService.getCategoryDefinition() method', () => {
    component['programDetails'] = { target_collection_category: undefined };
    component['userService'] = TestBed.inject(UserService);
    component.firstLevelFolderLabel = undefined;
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(SpecData.objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).not.toHaveBeenCalled();
  });

  it('#getTelemetryInteractEdata() should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('download_contribution_details',
      'click', 'launch', 'sourcing_my_projects', undefined);
    expect(returnObj).not.toContain(undefined);
  });

  it('#setContextualHelpConfig should set mangeUsersContextualConfig', () => {
    const contextualHelpConfig = {
      'sourcing': {
        'assignUsersToProject': {
          'url': 'https://dock.preprod.ntp.net.in/help/contribute/reviewer/review-contributions/index.html',
          'header': 'This table allow you to see a list of users',
          'message': ''
        },
        'noUsersFound': {
          'url': 'https://dock.preprod.ntp.net.in/help/contribute/reviewer/review-contributions/index.html',
          'header': 'no users found',
          'message': ''
        }
      }
    };
    component.assignUsersHelpConfig = undefined;
    component.noUsersFoundHelpConfig = undefined;
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'getContextualHelpConfig').and.returnValue(contextualHelpConfig);
    // spyOn(component, 'setContextualHelpConfig').and.callThrough();
    component.setContextualHelpConfig();
    expect(component.assignUsersHelpConfig).toBeDefined();
    expect(component.noUsersFoundHelpConfig).toBeDefined();
  });

  it('#resetStatusFilter() Should reset Status Filter', () => {

    mockRouter.navigate([], {});
    expect(mockRouter.navigate).toHaveBeenCalled();
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'], 'getUserPreferencesforProgram').and.returnValue(of({ result: { sourcing_preference: 'notnull' },
    id: 'api.programsService',
    params: {
        err: null,
        errmsg : null,
        msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
        resmsgid : null,
        status : 'success'},
   responseCode: 'OK',
   ts:'',
   ver:'' }));
    spyOn(component, 'getProgramCollection').and.returnValue(of({ result: {} }));
    component.resetStatusFilter('textbook');
    component.visitedTab = ['user'];
    component.resetStatusFilter('nomination');
    expect(component['programsService'].getUserPreferencesforProgram).toHaveBeenCalled();
  });

  it('#resetStatusFilter() Should reset Status Filter for nomination tab', () => {

    mockRouter.navigate([], {});
    expect(mockRouter.navigate).toHaveBeenCalled();
    component.visitedTab = ['user'];
    component.resetStatusFilter('nomination');
    // expect(component.resetStatusFilter).toHaveBeenCalled();
  });

  it('#resetStatusFilter() Should reset Status Filter for user tab', () => {

    mockRouter.navigate([], {});
    expect(mockRouter.navigate).toHaveBeenCalled();
    component.visitedTab = ['nomination'];
    component.resetStatusFilter('user');
    // expect(component.resetStatusFilter).toHaveBeenCalled();
  });

  it('#resetStatusFilter() Should reset Status Filter for contributionDashboard tab', () => {

    mockRouter.navigate([], {});
    expect(mockRouter.navigate).toHaveBeenCalled();
    component.programCollections = [];
    spyOn(component, 'getProgramCollection').and.returnValue(of({ result: {} }));
    spyOn(component, 'getNominationList').and.callFake(() => { });

    component.visitedTab = ['nomination'];
    component.resetStatusFilter('contributionDashboard');
    expect(component.getProgramCollection).toHaveBeenCalled();
  });

  it('sortUsersList should sort the Users List', () => {
    component.pageLimit = 1;
    component.searchInput = 'jnc68';
    const usersList = ['bbbb', 'bbbbb']
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'] , 'sortCollection').and.returnValue(['bbbb', 'bbbbb']);
    spyOn(component, 'logTelemetryImpressionEvent').and.callFake(() => {});
    component.sortUsersList(usersList, true);
    expect(programsService.sortCollection).toHaveBeenCalled();
    expect(component.logTelemetryImpressionEvent).toHaveBeenCalled();
  });

  it('onStatusChange should change the status', () => {
    component.onStatusChange('notAll');
    expect(component.filterApplied).toBeTruthy();
  });

  
  it('getSampleContent should get Sample Content', () => {
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);
    spyOn(component['collectionHierarchyService'] , 'getContentAggregation').and.returnValue(of({result:{count:22,QuestionSet:{},content:{}},
      id: 'api.collectionHierarchyService',
    params: {
        err: null,
        errmsg : null,
        msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
        resmsgid : null,
        status : 'success'},
   responseCode: 'OK',
   ts:'',
   ver:''}));
    spyOn(component, 'setNominationSampleCounts').and.callFake(() => {});
    component.getSampleContent();
    expect(component['collectionHierarchyService'].getContentAggregation).toHaveBeenCalled();
  });

  it('getProgramCollection should get Program Collection for questionSets', () => {
    component.programDetails={
      target_type: 'questionSets'
    }
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);
    spyOn(component['collectionHierarchyService'] , 'getCollectionWithProgramId').and.returnValue(of({result:{xyz: 'xyz'},
    id: 'api.collectionHierarchyService',
    params: {
        err: null,
        errmsg : null,
        msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
        resmsgid : null,
        status : 'success'},
   responseCode: 'OK',
   ts:'',
   ver:''
  }));
    component.getProgramCollection();
    
    expect(component['collectionHierarchyService'].getCollectionWithProgramId).toHaveBeenCalled();
  });

  it('getProgramCollection should get Program Collection for searchCriteria', () => {
    component.programDetails={
      target_type: 'searchCriteria'
    }
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);
    spyOn(component['collectionHierarchyService'] , 'getnonCollectionProgramContents').and.returnValue(of({result:{xyz: 'xyz'},
     id: 'api.collectionHierarchyService',
    params: {
        err: null,
        errmsg : null,
        msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
        resmsgid : null,
        status : 'success'},
   responseCode: 'OK',
   ts:'',
   ver:''}));
    component.getProgramCollection();
    
    expect(component['collectionHierarchyService'].getnonCollectionProgramContents).toHaveBeenCalled();
  });

  it('getDashboardData should get get Dashboard Data', () => {
    component.programDetails={
      target_type: 'collections'
    }
    component.contentAggregationData = [{},{},{}];
    component['collectionHierarchyService'] = TestBed.inject(CollectionHierarchyService);
    spyOn(component['collectionHierarchyService'] , 'setProgram').and.callFake(() => {});
    spyOn(component['collectionHierarchyService'] , 'getContentCounts').and.callFake(() => {return { sourcingOrgStatus: {}, total: 2, sample: 2, review: 2, draft: 2, rejected: 2, correctionsPending: 2, live: 2, individualStatus: {}, individualStatusForSample: {}, mvcContributionsCount: 2 } });
    spyOn(component, 'getOverAllCounts').and.callFake(() => {});
    
    component.getDashboardData([{organisation_id:1},{organisation_id:1},{organisation_id:1}]);
    expect(component['collectionHierarchyService'].setProgram).toHaveBeenCalled();
    expect(component['collectionHierarchyService'].getContentCounts).toHaveBeenCalled();
  });

  xit('openContent should set reviewContributionHelpConfig', () => {
    component.sessionContext = {nominationDetails : {
      organisation_id : 'organisation_id',
      user_id : 'user_id'
    }};
    component['contentHelperService']  = TestBed.inject(ContentHelperService);
    spyOn(programStageService, 'addStage').and.callFake(() => {});
    spyOn(component['contentHelperService'] , 'initialize').and.callFake(() => {});
    spyOn(component['contentHelperService'] , 'openContent').and.callFake(() => {
      return Promise.resolve(1);
    });
    component.openContent('');
    expect(component['contentHelperService'].initialize).toHaveBeenCalled();
    expect(component['contentHelperService'].openContent).toHaveBeenCalled();
  });

  it('getOriginForApprovedContents should get Origin For Approved Contents', () => {
    component.programDetails={
      acceptedcontents: [{},{}]
    }
    component['collectionHierarchyService']  = TestBed.inject(CollectionHierarchyService);
    spyOn(component['collectionHierarchyService'] , 'getOriginForApprovedContents').and.returnValue(of({result:{count: 1,content:[],QuestionSet:[]},
      id: 'api.programsService',
      params: {
          err: null,
          errmsg : null,
          msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
          resmsgid : null,
          status : 'success'},
     responseCode: 'OK',
     ts:'',
     ver:''}));
    component.getOriginForApprovedContents();
    expect(component['collectionHierarchyService'].getOriginForApprovedContents).toHaveBeenCalled();
  });

  it('viewContribution should show contribution', () => {
    component.programDetails={
      target_type: 'notsearchCriteria',
      program_id: 123,
      config:{
        components:[{ 'id': 'ng.sunbird.chapterList' }]
      }
    };
    component.nominations=['abc','xyz']
    const collection = {
      identifier:'',
      name:'',
      primaryCategory:''
    }
    component.telemetryInteractCdata = [{id: 'userService.channel', type: 'sourcing_organization'}, {id: 'programId', type: 'project'}];
    component['helperService']  = TestBed.inject(HelperService);
    spyOn(programStageService, 'addStage').and.callFake(() => {});
    spyOn(component['helperService'] , 'getSharedProperties').and.returnValue({result:{}});
    spyOn(component,'setFrameworkCategories').and.callFake(() => {});
    component.viewContribution(collection);
    expect(programStageService.addStage).toHaveBeenCalled();
    expect(component['helperService'].getSharedProperties).toHaveBeenCalled();
    expect(component.setFrameworkCategories).toHaveBeenCalled();
     
  });

  it('navigateToSourcingPage should get Program Details', () => {
  component.pagerUsers={
    totalPages:10,
    totalItems: 12,
    currentPage: 12,
    pageSize: 12,
    startPage: 12,
    endPage: 12,
    startIndex: 12,
    endIndex: 12,
    pages: [1,2,3]
  };
  component.paginatedSourcingUsers=['fff'];
    component['paginationService']  = TestBed.inject(PaginationService);
    spyOn(component['paginationService'] , 'getPager').and.returnValue({}as any);
    component.navigateToSourcingPage(1);
    expect(component['paginationService'].getPager).toHaveBeenCalled();
  });

  it('NavigateTonominationPage should get Program Details', () => {
    component.pager={
      totalPages:10,
      totalItems: 12,
      currentPage: 12,
      pageSize: 12,
      startPage: 12,
      endPage: 12,
      startIndex: 12,
      endIndex: 12,
      pages: [1,2,3]
    };
    component.pageLimit = 29;
    component.paginatedSourcingUsers=['fff'];
      component['paginationService']  = TestBed.inject(PaginationService);
      spyOn(component['paginationService'] , 'getPager').and.returnValue({}as any);
      spyOn(programsService , 'post').and.returnValue(of({result:[{totalPages:20}],id: 'api.paginationService',
      params: {
          err: null,
          errmsg : null,
          msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
          resmsgid : null,
          status : 'success'},
     responseCode: 'OK',
     ts:'',
     ver:''}));
      spyOn(component , 'getSampleContent').and.callFake(() => { });
      spyOn(component , 'getDashboardData').and.callFake(() => { });
      component.NavigateTonominationPage(3);
      expect(component['paginationService'].getPager).toHaveBeenCalled();
      expect(programsService.post).toHaveBeenCalled();
      expect(component.getSampleContent).toHaveBeenCalled();
    });
  

  xit('updateUserRoleMapping should update User Role Mapping', () => {
    const user={
      newRole :"NONE"
    };
      component['toasterService']  = TestBed.inject(ToasterService);
      spyOn(programsService , 'updateProgram').and.returnValue(of({result:{ssf:'sfg'},id: 'api.paginationService',
      params: {
          err: null,
          errmsg : null,
          msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
          resmsgid : null,
          status : 'success'},
     responseCode: 'OK',
     ts:'',
     ver:''}));
      spyOn(component['toasterService'], 'success').and.callFake(() => { });
      component.updateUserRoleMapping({},user);
      expect(programsService.updateProgram).toHaveBeenCalled();

    });
  
  
});
