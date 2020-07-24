import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { SharedModule, ToasterService } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService, ProgramsService, ActionService } from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import * as _ from 'lodash-es';
import {  throwError , of, Subscription } from 'rxjs';
import * as SpecData from './program.component.spec.data';
import { ProgramHeaderComponent } from '../program-header/program-header.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
// tslint:disable-next-line:prefer-const
let errorInitiate;
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DaysToGoPipe } from '../../../shared-feature';
import { DatePipe } from '@angular/common';
import { CollectionHierarchyService } from '../../../cbse-program';
import { ProgramTelemetryService } from '../../services';

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
  slug: 'sunbird'
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

const PrefModel = {
  deny() { return null; }
};

describe('Program Component Tests', () => {
  let component: ProgramComponent;
  let userService: UserService;
  let programsService: ProgramsService;
  let toasterService: ToasterService;
  let actionService: ActionService;
  let fixture: ComponentFixture<ProgramComponent>;
  let prefModal: any;

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
        ActionService,
        ProgramTelemetryService,
        DatePipe,
        CollectionHierarchyService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    programsService = TestBed.get(ProgramsService);
    toasterService = TestBed.get(ToasterService);
    actionService = TestBed.get(ActionService);
    prefModal = PrefModel;

    fixture.detectChanges();
  });

  it('should have create and defined component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
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

  it('Should call getProgramDetails', () => {
    spyOn(programsService, 'get').and.callFake(() => {
      return of(SpecData.readProgramApiSuccessRes);
    });
    spyOn(component, 'getProgramDetails');
    component.getProgramDetails();
    expect(component.getProgramDetails).toHaveBeenCalled();
  });

  it('should set programDetails correctly', () => {
    spyOn(programsService, 'get').and.callFake(() => {
      return of(SpecData.readProgramApiSuccessRes);
    });
    component.getProgramDetails();
    expect(component.programDetails).toEqual(SpecData.readProgramApiSuccessRes.result);
  });

  it('should show error toast message if programId has falsy value', () => {
    spyOn(toasterService, 'error');
    component.programId = null;
    component.ngOnInit();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('Should call fetchFrameWorkDetails', () => {
    spyOn(programsService, 'get').and.callFake(() => {
      return of(SpecData.readProgramApiSuccessRes);
    });
    spyOn(component, 'fetchFrameWorkDetails');
    component.getProgramDetails();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
  });

  it('should return true for if nomination from organisation', () => {
    component.sessionContext.nominationDetails = SpecData.nominationByOrg;
    component.ngOnInit();
    const isNominationFromOrg = component.isNominationOrg();
    expect(isNominationFromOrg).toBe(true);
  });

  it('should call applyPreferences if called applyTextbookFilters', () => {
    spyOn(programsService, 'setUserPreferencesforProgram').and.callFake(() => {
      return of(SpecData.preferenceApiSuccessRes);
    });
    spyOn(component, 'applyPreferences');
    component.ngOnInit();
    component.applyPreferences();
    expect(component.applyPreferences).toHaveBeenCalled();
  });

  it('should show warning toaster message if failed to create user preferences', () => {
    spyOn(programsService, 'setUserPreferencesforProgram').and.callFake(() => {
      return throwError(SpecData.preferenceApiErrorRes);
    });
    spyOn(toasterService, 'warning');
    component.ngOnInit();
    component.applyPreferences();
    expect(toasterService.warning).toHaveBeenCalled();
  });

  it('should unsubscribe from stage subscription on destroy', () => {
    component.stageSubscription = new Subscription();
    spyOn(component.stageSubscription, 'unsubscribe');
    fixture.detectChanges();
    component.ngOnDestroy();
    expect(component.stageSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should get the interact edata for telemetry', () => {
    const result = component.getTelemetryInteractEdata('textbook-tab', 'click', 'list-nominated-textbooks');
    expect(result).toEqual({'id': 'textbook-tab', 'type': 'click', 'pageid': 'list-nominated-textbooks'});
  });

  it('should not able to upload the content if dates are passed', () => {
    component.programDetails = {
      content_submission_enddate: '2020-07-02T18:30:00.000Z',
      enddate: '2020-07-05T18:30:00.000Z'
    };
    const result = component.canUploadContent();
    expect(result).toEqual(false);
  });

  it('should able to upload the content if future dates', () => {
    component.programDetails = {
      content_submission_enddate: '2099-07-02T18:30:00.000Z',
      enddate: '2099-07-05T18:30:00.000Z'
    };
    const result = component.canUploadContent();
    expect(result).toEqual(true);
  });

  it('should set correct active date', () => {
    component.programDetails = {
      nomination_enddate: '2020-07-03T18:30:00.000Z',
      shortlisting_enddate: '2020-07-05T18:30:00.000Z',
      content_submission_enddate: '2020-07-07T18:30:00.000Z',
      enddate: '2022-07-20T18:30:00.000Z',
    };
    component.setActiveDate();
    expect(component.activeDate).toEqual('enddate');
  });

  it('checkArrayCondition should keep the array as is if value is array', () => {
    component.sharedContext = {'gradeLevel' : ['Class 10'] };
    component.checkArrayCondition('gradeLevel');
    expect(_.isArray(component.sharedContext['gradeLevel'])).toEqual(true);
  });

  it('checkArrayCondition should convert into array if value is string', () => {
    component.sharedContext = {'gradeLevel' : 'Class 10, Class 11' };
    component.checkArrayCondition('gradeLevel');
    expect(_.isArray(component.sharedContext['gradeLevel'])).toEqual(true);
  });

  it('Should call applyTextbookFilters', () => {
    spyOn(component, 'applyTextbookFilters');
    component.applyTextbookFilters();
    expect(component.applyTextbookFilters).toHaveBeenCalled();
  });

  it('Should call resetTextbookFilters', () => {
    spyOn(component, 'resetTextbookFilters');
    component.resetTextbookFilters();
    expect(component.resetTextbookFilters).toHaveBeenCalled();
  });

  it('Should call getProgramTextbooks', () => {
    // spyOn(actionService, 'setUserPreferencesforProgram').and.callFake(() => {
    //   return throwError(SpecData.preferenceApiErrorRes);
    // });
    spyOn(component, 'getProgramTextbooks');
    component.getProgramTextbooks();
    expect(component.getProgramTextbooks).toHaveBeenCalled();
  });
});
