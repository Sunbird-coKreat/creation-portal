import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService } from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
import * as SpecData from './program.component.spec.data';
import { ProgramHeaderComponent } from '../program-header/program-header.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
// tslint:disable-next-line:prefer-const
let errorInitiate;
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysToGoPipe } from '../../../shared-feature';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../cbse-program';

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

describe('Program Component Tests', () => {
  let component: ProgramComponent;
  let userService: UserService;
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
          env: 'programs'
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
        ReactiveFormsModule,
        FormsModule,
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
        CollectionHierarchyService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);

    fixture.detectChanges();
  });

  it('should have create and defined component', () => {
    expect(component).toBeDefined() && expect(component).toBeTruthy();
  });

  it('User should not belong to org', () => {
    userService.userRegistryData = true;
    const isUserBelongToOrg = component.checkIfUserBelongsToOrg();
    expect(isUserBelongToOrg).toBeFalsy();
  });

  it('User should belong to org', () => {
    userService.userRegistryData = true;
    userService.userProfile.userRegData['User_Org'] = SpecData.orgUserRegData;
    const isUserBelongToOrg = component.checkIfUserBelongsToOrg();
    expect(isUserBelongToOrg).toBeTruthy();
  });

  it('User should be org admin', () => {
    userService.userRegistryData = true;
    userService.userProfile.userRegData['User_Org'] = SpecData.orgAdminUserRegData;
    const isUserOrgAdmin = component.isUserOrgAdmin();
    expect(isUserOrgAdmin).toBeTruthy();
  });

  it('User should not be org admin', () => {
    userService.userRegistryData = true;
    userService.userProfile.userRegData['User_Org'] = SpecData.orgUserRegData;
    const isUserOrgAdmin = component.isUserOrgAdmin();
    expect(isUserOrgAdmin).toBeFalsy();
  });

});
