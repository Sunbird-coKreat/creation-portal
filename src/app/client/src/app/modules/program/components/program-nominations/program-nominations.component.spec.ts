import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService, ProgramsService , RegistryService} from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
import * as SpecData from './program-nominations.spec.data';
import {userDetail, chunkedUserList} from '../../services/programUserTestData';
import { ProgramNominationsComponent } from './program-nominations.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysToGoPipe, TextbookListComponent } from '../../../shared-feature';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../sourcing';
import { ContributorProfilePopupComponent } from '../contributor-profile-popup/contributor-profile-popup.component';
import { convertToParamMap } from '@angular/router';

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
  userProfile : SpecData.userProfile
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
          env: 'programs'
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
        CollectionHierarchyService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramNominationsComponent);
    component = fixture.componentInstance;
    programsService = TestBed.get(ProgramsService);
    collectionHierarchyService = TestBed.get(CollectionHierarchyService);

    // fixture.detectChanges();
  });

  it('should have create and defined component', () => {
    expect(component).toBeDefined() && expect(component).toBeTruthy();
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
    expect(component.contributionDashboardData.length).toBe(2)
  });

  xit('should call getContribDashboardHeaders method', () => {
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
    spyOn(component, 'getContribDashboardHeaders');

    component.ngOnInit();

    component.downloadContribDashboardDetails();
    expect(component.getContribDashboardHeaders).toHaveBeenCalled();
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
    const userList = registryService.getSearchedUserList(userDetail.result.response.content, component.searchInput)
    expect(component.sortUsersList).toHaveBeenCalledWith(userList);
    });
 xit('call the sortUsersList method when there is input', () => {
    component.pageLimit = 1;
    component.searchInput = 'jnc68';
    const  programsService  = TestBed.get(ProgramsService);
    component.sortUsersList(userDetail.result.response.content);
    const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc')
    expect(component.paginatedSourcingUsers).toBe(sortedList);
    expect(component.sourcingOrgUser).toBe(chunkedUserList[0]);
    expect(component.sourcingOrgUserCnt).toBe(chunkedUserList[0].length);
  });
  xit('call the sortUsersList method when there is empty input', () => {
     component.pageLimit = 1;
     component.searchInput = '';
     const  programsService  = TestBed.get(ProgramsService);
     component.sortUsersList(userDetail.result.response.content);
     const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc')
     expect(component.paginatedSourcingUsers).toBe(sortedList);
     expect(component.sourcingOrgUser).toBe(userDetail.result.response.content);
     expect(component.sourcingOrgUserCnt).toBe(userDetail.result.response.content.length);
    });
    it ('#setTargetCollectionValue() should set targetCollection values', () => {
      const  service  = TestBed.get(ProgramsService);
      spyOn(service, 'setTargetCollectionName').and.returnValue('Digital Textbook');
      component.programDetails = SpecData.programDetailsTargetCollection;
      spyOn(component, 'setTargetCollectionValue').and.callThrough();
      component.setTargetCollectionValue();
      expect(component.targetCollection).not.toBeUndefined();
      expect(component.targetCollections).not.toBeUndefined();
    });
    it ('#setTargetCollectionValue() should not set targetCollection values', () => {
      const  service  = TestBed.get(ProgramsService);
      spyOn(service, 'setTargetCollectionName').and.returnValue(undefined);
      component.programDetails = undefined;
      spyOn(component, 'setTargetCollectionValue').and.callThrough();
      component.setTargetCollectionValue();
      expect(component.targetCollection).toBeUndefined();
      expect(component.targetCollections).toBeUndefined();
      });
    it ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
      const  service  = TestBed.get(ProgramsService);
      component.programDetails = SpecData.programDetailsTargetCollection;
      spyOn(component, 'setTargetCollectionValue').and.callThrough();
      spyOn(service, 'setTargetCollectionName').and.callThrough();
      component.setTargetCollectionValue();
      expect(service.setTargetCollectionName).toHaveBeenCalled();
    });
});
