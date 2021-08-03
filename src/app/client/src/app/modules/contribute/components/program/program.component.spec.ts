import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { SharedModule, ToasterService, ResourceService } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService, RegistryService , ProgramsService} from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { addParticipentResponseSample, userProfile,  frameWorkData, programDetailsWithOutUserDetails,
  programDetailsWithOutUserAndForm, extFrameWorkPostData, programDetailsWithUserDetails, programDetailsTargetCollection } from './program.component.spec.data';
import { CollectionComponent } from '../../../sourcing/components/collection/collection.component';
import { ProgramHeaderComponent } from '../program-header/program-header.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
// tslint:disable-next-line:prefer-const
let errorInitiate;
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {userDetail, chunkedUserList} from '../../services/programUserTestData';
import { DaysToGoPipe } from '@sunbird/shared-feature';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { programSession } from './data';
import { HelperService } from '../../../sourcing/services/helper.service';
const userServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError ({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(addParticipentResponseSample);
    }
  },
  userid: userProfile.userId,
  userProfile : userProfile,
  channel: '123456789',
  appId: 'dummyValue',
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
      return of({err: null, result: programDetailsWithUserDetails});
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
  frameworkData$:  of(frameWorkData)
};

describe('ProgramComponent', () => {
  let component: ProgramComponent;
  let fixture: ComponentFixture<ProgramComponent>;

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
          pageid: 'program'
        }
      }
    }
  };

  beforeEach(async(() => {
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
        ProgramHeaderComponent,
        DaysToGoPipe
      ],
      providers: [
        RegistryService,
        {
          provide: Router,
          useClass: RouterStub
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
        HelperService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramComponent);
    component = fixture.componentInstance;

    // fixture.detectChanges();
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

  it('#fetchFrameWorkDetails() should called #frameworkService()', () => {
    component.programDetails = {
      config: { framework: 'NCFCOPY'}
    }
    const frameworkService = TestBed.get(FrameworkService);
    spyOn(frameworkService, 'initialize').and.callThrough();
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    component.fetchFrameWorkDetails();
    expect(frameworkService.initialize).toHaveBeenCalledWith('NCFCOPY');
  });

  it('should tabChangeHandler be triggered', () => {
    component.tabChangeHandler('collectionComponent');
    expect(component.component).toBe(CollectionComponent);
  });

  it('should changeView be called when stages is empty', () => {
    component.changeView();
    expect(component.currentStage).toBeUndefined();
  });

  it('should changeView be called when stages is not empty', () => {
    component.state.stages = [
      {
        'stageId': 1,
        'stage': 'collectionComponent'
      }
    ];
    component.changeView();
    expect(component.currentStage).toBe('collectionComponent');
  });

  xit('should unsubscribe subject', () => {
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
    const  registryService  = TestBed.get(RegistryService);
    spyOn(component, 'sortUsersList');
    spyOn(registryService, 'getSearchedUserList').and.returnValue(sortUsersListData);
    spyOn(component, 'getUserDetailsBySearch').and.callThrough();
    component.getUserDetailsBySearch();
    expect(registryService.getSearchedUserList).toHaveBeenCalledWith(['dummyUser'], 'jnc68');
    expect(component.sortUsersList).toHaveBeenCalledWith(sortUsersListData, true);
  });

  it('#sortUsersList() should call programsService.sortCollection()', () => {
   const usersList = ['user1', 'user2', 'user3'];
   const usersListDesc = ['user3', 'user2', 'user1'];
   component.sortColumnOrgUsers = 'projectselectedRole';
   component.directionOrgUsers = 'desc';
   component.OrgUsersCnt = 0;
   const  programsService  = TestBed.get(ProgramsService);
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
    const chunkList = [ ['user3'], ['user2'], ['user1']];
    component.isInitialSourcingOrgUser = true;
    const  programsService  = TestBed.get(ProgramsService);
    spyOn(component, 'sortUsersList').and.callThrough();
    spyOn(programsService, 'sortCollection').and.returnValue(usersListDesc);
    component.sortUsersList(usersList, true);
    const sortedList = programsService.sortCollection(usersList,  'projectselectedRole', 'desc');
    expect(component.paginatedContributorOrgUsers).toEqual(chunkList);
    expect(component.contributorOrgUser).toEqual(chunkList[0]);
    });

    it ('#setTargetCollectionValue() should set targetCollection values', () => {
      component.targetCollections = undefined;
      component.programDetails = programDetailsTargetCollection;
      const  programsService  = TestBed.get(ProgramsService);
      spyOn(programsService, 'setTargetCollectionName').and.returnValue('Digital Textbook');
      spyOn(component, 'setTargetCollectionValue').and.callThrough();
      component.setTargetCollectionValue();
      expect(component.targetCollection).not.toBeUndefined();
  });

  it ('#setTargetCollectionValue() should not set targetCollection values', () => {
    component.targetCollections = undefined;
    component.programDetails = undefined;
    const  programsService  = TestBed.get(ProgramsService);
    spyOn(programsService, 'setTargetCollectionName').and.returnValue(undefined);
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).toBeUndefined();
  });

  it ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    const  programsService  = TestBed.get(ProgramsService);
    component.programDetails = programDetailsTargetCollection;
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
});
