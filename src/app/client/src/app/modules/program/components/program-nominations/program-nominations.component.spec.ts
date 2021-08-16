import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService, ProgramsService , RegistryService} from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
import * as SpecData from './program-nominations.spec.data';
import {userDetail, chunkedUserList} from '../../services/programUserTestData';
import { ProgramNominationsComponent } from './program-nominations.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysToGoPipe, TextbookListComponent } from '../../../shared-feature';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../sourcing';
import { ContributorProfilePopupComponent } from '../contributor-profile-popup/contributor-profile-popup.component';
import { convertToParamMap } from '@angular/router';
import { HelperService } from '../../../sourcing/services/helper.service';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';

const errorInitiate = false;
const userServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError ({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(SpecData.addParticipentResponseSample);
    }
  },
  userid: SpecData.userProfile.userId,
  userProfile : SpecData.userProfile,
  appId: '12345'
};

const extPluginServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError ({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of({err: null, result: SpecData.programDetailsWithUserDetails});
    }
  },
  post() {
    if (errorInitiate) {
      return throwError ({
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
  frameworkData$:  of(SpecData.frameWorkData)
};

describe('ProgramNominationsComponent', () => {
  let component: ProgramNominationsComponent;
  let collectionHierarchyService: CollectionHierarchyService;
  let programsService: ProgramsService;
  let programStageService: ProgramStageService;
  let registryService: RegistryService;
  let fixture: ComponentFixture<ProgramNominationsComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DynamicModule,
        SuiModule,
        SharedModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
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
        {
          provide: Router,
          useClass: RouterStub
        }, {
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
        ResourceService,
        CollectionHierarchyService,
        HelperService,
        ProgramStageService,
        RegistryService,
        ConfigService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramNominationsComponent);
    component = fixture.componentInstance;
    programsService = TestBed.inject(ProgramsService);
    programStageService = TestBed.inject(ProgramStageService);
    registryService = TestBed.inject(RegistryService);
    collectionHierarchyService = TestBed.inject(CollectionHierarchyService);
    // fixture.detectChanges();
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
    spyOn(component, 'getPageId').and.callFake(() => {});
    spyOn(component, 'getProgramDetails').and.callFake(() => {});
    spyOn(programStageService, 'initialize').and.callFake(() => {});
    spyOn(programStageService, 'addStage').and.callFake(() => {});
    spyOn(programStageService, 'getStage').and.returnValue(of({stages: {}}));
    spyOn(component, 'changeView').and.callFake(() => {});
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

  it('#ngAfterViewInit() should set variable', () => {
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(component.telemetryImpression).toBeUndefined();
  });

  xit('#setTelemetryPageId() should return routes pageid', () => {
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
    spyOn(programsService, 'sortCollection').and.returnValue({});
    spyOn(component, 'sortCollection').and.callThrough();
    component.sortCollection('name', {});
    expect(programsService.sortCollection).toHaveBeenCalled();
    expect(component.direction).toEqual('asc');
    expect(component.sortColumn).toEqual('name');
  });

  it('#getUserDetailsBySearch() should call sortUsersList', () => {
    component.searchLimitCount = 1;
    component['initialSourcingOrgUser'] = ['1234abcd'];
    component.searchInput = 'abcd';
    spyOn(registryService, 'getSearchedUserList').and.returnValue({});
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
    const  registryService  = TestBed.get(RegistryService);
    const userList = registryService.getSearchedUserList(userDetail.result.response.content, component.searchInput);
    expect(component.sortUsersList).toHaveBeenCalledWith(userList);
    });
 xit('call the sortUsersList method when there is input', () => {
    component.pageLimit = 1;
    component.searchInput = 'jnc68';
    component.sortUsersList(userDetail.result.response.content);
    const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc');
    expect(component.paginatedSourcingUsers).toBe(sortedList);
    expect(component.sourcingOrgUser).toBe(chunkedUserList[0]);
    expect(component.sourcingOrgUserCnt).toBe(chunkedUserList[0].length);
  });
  xit('call the sortUsersList method when there is empty input', () => {
     component.pageLimit = 1;
     component.searchInput = '';
     component.sortUsersList(userDetail.result.response.content);
     const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc');
     expect(component.paginatedSourcingUsers).toBe(sortedList);
     expect(component.sourcingOrgUser).toBe(userDetail.result.response.content);
     expect(component.sourcingOrgUserCnt).toBe(userDetail.result.response.content.length);
    });
    it ('#setTargetCollectionValue() should set targetCollection values', () => {
      spyOn(programsService, 'setTargetCollectionName').and.returnValue('Digital Textbook');
      component.programDetails = SpecData.programDetailsTargetCollection;
      spyOn(component, 'setTargetCollectionValue').and.callThrough();
      component.setTargetCollectionValue();
      expect(component.targetCollection).not.toBeUndefined();
    });
    it ('#setTargetCollectionValue() should not set targetCollection values in program-nomination', () => {
      component.targetCollection = undefined;
      component.programDetails = undefined;
      spyOn(programsService, 'setTargetCollectionName').and.returnValue(undefined);
      spyOn(component, 'setTargetCollectionValue').and.callThrough();
      component.setTargetCollectionValue();
      expect(component.targetCollection).toBeUndefined();
      });
    it ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
      component.programDetails = SpecData.programDetailsTargetCollection;
      spyOn(component, 'setTargetCollectionValue').and.callThrough();
      spyOn(programsService, 'setTargetCollectionName').and.callThrough();
      component.setTargetCollectionValue();
      expect(programsService.setTargetCollectionName).toHaveBeenCalled();
    });
    it('#setFrameworkCategories() should call helperService.setFrameworkCategories()', () => {
      const collection = {};
      const  helperService  = TestBed.get(HelperService);
      spyOn(helperService, 'setFrameworkCategories').and.returnValue({});
      spyOn(component, 'setFrameworkCategories').and.callThrough();
      component.setFrameworkCategories(collection);
      expect(helperService.setFrameworkCategories).toHaveBeenCalledWith({});
    });
    it('#getCollectionCategoryDefinition() Should call programsService.getCategoryDefinition() method', () => {
      component['programDetails'] = {target_collection_category: 'Course'};
      component['userService'] = TestBed.inject(UserService);
      component.firstLevelFolderLabel = undefined;
      spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(SpecData.objectCategoryDefinition));
      component.getCollectionCategoryDefinition();
      expect(component['programsService'].getCategoryDefinition).toHaveBeenCalled();
      expect(component.firstLevelFolderLabel).toBeDefined();
    });
    it('#getCollectionCategoryDefinition() Should not call programsService.getCategoryDefinition() method', () => {
      component['programDetails'] = {target_collection_category: undefined};
      component['userService'] = TestBed.inject(UserService);
      component.firstLevelFolderLabel = undefined;
      spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(SpecData.objectCategoryDefinition));
      component.getCollectionCategoryDefinition();
      expect(component['programsService'].getCategoryDefinition).not.toHaveBeenCalled();
    });
});
