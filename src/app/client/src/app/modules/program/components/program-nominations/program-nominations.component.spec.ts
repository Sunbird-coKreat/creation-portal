import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService, ProgramsService } from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
import * as SpecData from './program-nominations.spec.data';
import { ProgramNominationsComponent } from './program-nominations.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysToGoPipe, TextbookListComponent } from '../../../shared-feature';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../cbse-program';
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

describe('Program Component', () => {
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

    fixture.detectChanges();
  });

  it('should have create and defined component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
  });

  // it('should contribution dashboard data should not be empty', () => {
  //   spyOn(programsService, 'get').and.callFake(() => {
  //       return of(SpecData.readProgramApiSuccessRes);
  //   });
  //   let postAlreadyCalled = false;
  //   spyOn(programsService, 'post').and.callFake(() => {
  //       if (postAlreadyCalled) {
  //           return of(SpecData.approvedNominationListApiSuccessRes);
  //       }
  //       postAlreadyCalled = true;
  //       return of(SpecData.nominationListCountApiSuccessRes);
  //   });
  //   spyOn(collectionHierarchyService, 'getContentAggregation').and.callFake(() => {
  //       return of(SpecData.searchContentApiSuccessRes);
  //   });
  //   spyOn(collectionHierarchyService, 'getCollectionWithProgramId').and.callFake(() => {
  //       return of(SpecData.programCollectionListApiSuccessRes);
  //   });
  //   component.getProgramDetails();
  //   expect(component.contributionDashboardData.length).toBe(2);
  // });

  // it('should call getContribDashboardHeaders method', () => {
  //   spyOn(programsService, 'get').and.callFake(() => {
  //       return of(SpecData.readProgramApiSuccessRes);
  //   });
  //   let postAlreadyCalled = false;
  //   spyOn(programsService, 'post').and.callFake(() => {
  //       if (postAlreadyCalled) {
  //           return of(SpecData.approvedNominationListApiSuccessRes);
  //       }
  //       postAlreadyCalled = true;
  //       return of(SpecData.nominationListCountApiSuccessRes);
  //   });
  //   spyOn(collectionHierarchyService, 'getContentAggregation').and.callFake(() => {
  //       return of(SpecData.searchContentApiSuccessRes);
  //   });
  //   spyOn(collectionHierarchyService, 'getCollectionWithProgramId').and.callFake(() => {
  //       return of(SpecData.programCollectionListApiSuccessRes);
  //   });
  //   spyOn(component, 'getContribDashboardHeaders');

  //   component.ngOnInit();

  //   component.downloadContribDashboardDetails();
  //   expect(component.getContribDashboardHeaders).toHaveBeenCalled();
  // });

  // it('should call generateCSV method', () => {
  //   spyOn(programsService, 'get').and.callFake(() => {
  //       return of(SpecData.readProgramApiSuccessRes);
  //   });
  //   let postAlreadyCalled = false;
  //   spyOn(programsService, 'post').and.callFake(() => {
  //       if (postAlreadyCalled) {
  //           return of(SpecData.approvedNominationListApiSuccessRes);
  //       }
  //       postAlreadyCalled = true;
  //       return of(SpecData.nominationListCountApiSuccessRes);
  //   });
  //   spyOn(collectionHierarchyService, 'getContentAggregation').and.callFake(() => {
  //       return of(SpecData.searchContentApiSuccessRes);
  //   });
  //   spyOn(collectionHierarchyService, 'getCollectionWithProgramId').and.callFake(() => {
  //       return of(SpecData.programCollectionListApiSuccessRes);
  //   });
  //   spyOn(programsService, 'generateCSV');

  //   component.ngOnInit();

  //   component.downloadContribDashboardDetails();

  //   expect(programsService.generateCSV).toHaveBeenCalled();
  // });
});
