import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { SharedModule, ToasterService } from '@sunbird/shared';
import { FrameworkService, UserService, ExtPluginService, RegistryService , ProgramsService} from '@sunbird/core';

import { DynamicModule } from 'ng-dynamic-component';
import { ProgramComponent } from './program.component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { addParticipentResponseSample, userProfile,  frameWorkData, programDetailsWithOutUserDetails,
  programDetailsWithOutUserAndForm, extFrameWorkPostData, programDetailsWithUserDetails, roleNames, orgUser, updateNominationSuccessResponse, updateNominationErrorResponse } from './program.component.spec.data';
import { CollectionComponent } from '../../../cbse-program/components/collection/collection.component';
import { ProgramHeaderComponent } from '../program-header/program-header.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
// tslint:disable-next-line:prefer-const
let errorInitiate;
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {userDetail, chunkedUserList} from '../../services/programUserTestData';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DaysToGoPipe } from '../../../shared-feature';
import { DatePipe } from '@angular/common';

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


const frameworkServiceStub = {
  initialize() {
    return null;
  },
  frameworkData$:  of(frameWorkData)
};

describe('ProgramComponent On Bording test', () => {
  let component: ProgramComponent;
  let toasterService: ToasterService;
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
        FormsModule,
        TelemetryModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [
        ProgramComponent,
        OnboardPopupComponent,
        ProgramHeaderComponent,
        DaysToGoPipe
      ],
      providers: [
        ToasterService,
        RegistryService,
        DatePipe,
        DaysToGoPipe,
        CollectionHierarchyService,
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
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramComponent);
    toasterService = TestBed.get(ToasterService);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should execute OnboardEvent on initialization of component', () => {
    component.programId = null;
    component.ngOnInit();
  });


  it('should call fetchProgramDetails', inject([HttpTestingController],
    (httpMock: HttpTestingController) => {
      component.getProgramDetails();
    })
  );
  it('should fetchFrameWorkDetails be called', () => {
    component.sessionContext.framework = 'NCFCOPY';

    component.fetchFrameWorkDetails();
    expect(component.sessionContext.frameworkData.length).toBeGreaterThan(0);
  });


  // it('should open onboarding pop up', () => {
  //   spyOn(component, 'userOnboarding');
  //   component.ngOnInit();
  //   expect(component.userOnboarding).not.toHaveBeenCalled();
  // });

  // it('onboarding popup property should be initiated as false', () => {
  //   spyOn(component, 'userOnboarding');
  //   component.ngOnInit();
  //   expect(component.showOnboardPopup).toBe(false);
  // });


  // it('should not trigger the onboard popup as participant details are available in DB', () => {
  //   spyOn(component, 'userOnboarding');
  //   component.programDetails = programDetailsWithUserDetails;
  //   component.handleOnboarding();
  //   expect(component.showOnboardPopup).toBe(false);
  //   expect(component.userOnboarding).not.toHaveBeenCalled();
  // });

  // it('should trigger the onboard popup as participant details are not available in DB', () => {
  //   component.programDetails = programDetailsWithOutUserDetails;
  //   component.handleOnboarding();
  //   spyOn(component, 'userOnboarding');
  //   expect(component.showOnboardPopup).toBe(true);
  //   expect(component.userOnboarding).not.toHaveBeenCalled();
  // });

  // it('should not trigger the onboard popup as no onboarding form even though no user details are available in DB', () => {
  //   spyOn(component, 'userOnboarding');
  //   component.programDetails = programDetailsWithOutUserAndForm;
  //   component.handleOnboarding();
  //   expect(component.userOnboarding).toHaveBeenCalled();
  // });


  // it('should userOnboarding be triggered', () => {
  //   spyOn(component, 'setUserParticipantDetails');
  //   component.userOnboarding();
  //   expect(component.setUserParticipantDetails).toHaveBeenCalledWith({data: extFrameWorkPostData, onBoardingData: {}});
  //   // expect(component.programDetails.userDetails) =
  // });


  // it('should set userDetails when calling setUserParticipantDetails', () => {
  //   const userDetailsMock = {
  //     enrolledOn: extFrameWorkPostData.ts,
  //     onBoarded: true,
  //     onBoardingData: {},
  //     programId: extFrameWorkPostData.result.programId,
  //     roles: ['CONTRIBUTOR'], // TODO: get default role from config
  //     userId: component.userService.userid
  //   };
  //   component.setUserParticipantDetails({data: extFrameWorkPostData, onBoardingData: {}});
  //   expect(component.programDetails.userDetails).toEqual(jasmine.objectContaining(userDetailsMock));
  // });


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


  // it('should getDefaultActiveTab be called', () => {
  //   component.programDetails = programDetailsWithUserDetails;
  //   expect(component.getDefaultActiveTab()).toEqual(1);
  // });

  // it('should initiateHeader be called', () => {
  //   component.initiateHeader('failure');
  // });


  it('should unsubscribe subject', () => {
    component.ngOnDestroy();
  });
  it('reset the user list when there is no search input', () => {
    spyOn(component, 'sortUsersList');
    component.searchInput = '';
    expect(component.sortUsersList).toHaveBeenCalledWith(userDetail.result.response.content);
  });
  it('get the user list when there is a search input', () => {
    spyOn(component, 'sortUsersList');
    component.searchInput = 'jnc68';
    const  registryService  = TestBed.get(RegistryService);
    const userList = registryService.getSearchedUserList(userDetail.result.response.content, component.searchInput)
    expect(component.sortUsersList).toHaveBeenCalledWith(userList);
    });
 it('call the sortUsersList method when there is input', () => {
    component.pageLimit = 1;
    component.searchInput = 'jnc68';
    const  programsService  = TestBed.get(ProgramsService);
    component.sortUsersList(userDetail.result.response.content);
    const sortedList = programsService.sortCollection(userDetail.result.response.content,  'projectselectedRole', 'asc')
    expect(component.paginatedContributorOrgUsers).toBe(sortedList);
    expect(component.contributorOrgUser).toBe(chunkedUserList[0]);
    expect(component.OrgUsersCnt).toBe(chunkedUserList[0].length);
  });
  it('call the sortUsersList method when there is empty input', () => {
     component.pageLimit = 1;
     component.searchInput = '';
     const  programsService  = TestBed.get(ProgramsService);
     component.sortUsersList(userDetail.result.response.content);
     const sortedList = programsService.sortCollection(userDetail.result.response.content,  'projectselectedRole', 'asc')
     expect(component.paginatedContributorOrgUsers).toBe(sortedList);
     expect(component.contributorOrgUser).toBe(userDetail.result.response.content);
     expect(component.OrgUsersCnt).toBe(userDetail.result.response.content.length);
    });
    it('Should return true if nomination from organization', () => {
      component.sessionContext = { nominationDetails: { organisation_id: '12345' } };
      const result = component.isNominationOrg();
      expect(result).toBe(true);
    });

    it('Should return false if nomination is not from organization', () => {
      component.sessionContext = { nominationDetails: { } };
      const result = component.isNominationOrg();
      expect(result).toBe(false);
    });

    it('Should throw error toaster if selected role is not in configured roles', () => {
      const user = { newRole: 'test' };
      component.roleNames = roleNames;
      spyOn(toasterService, 'error').and.callThrough();
      component.onRoleChange(user);
      expect(toasterService.error).toHaveBeenCalled();
    });

    it('Should show confirmation modal if newRole is NONE', () => {
      const user = { newRole: 'NONE' };
      component.roleNames = roleNames;
      component.onRoleChange(user);
      expect(component.showUserRemoveRoleModal).toBe(true);
    });

    it('Should call getProgramRoleMapping if newRole is not NONE', () => {
      const user = _.cloneDeep(orgUser);
      user['newRole'] = 'CONTRIBUTOR';
      component.roleNames = roleNames;
      spyOn(component, 'getProgramRoleMapping').and.callThrough();
      component.onRoleChange(user);
      expect(component.getProgramRoleMapping).toHaveBeenCalled();
    });

    it('Should show the option CONTRIBUTOR if user has CONTRIBUTOR role', () => {
      const result = component.showUserRoleOption('CONTRIBUTOR', 'CONTRIBUTOR');
      expect(result).toBe(true);
    });

    it('Should show the option REVIEWER if user has REVIEWER role', () => {
      const result = component.showUserRoleOption('REVIEWER', 'REVIEWER');
      expect(result).toBe(true);
    });

    it('Should not show the option NONE if user has no role', () => {
      const result = component.showUserRoleOption('NONE', 'Select Role');
      expect(result).toBe(false);
    });

    it('Should assign the old role back if confirmation is rejected and close the confirmation modal', () => {
      const user = _.cloneDeep(orgUser);
      user['projectselectedRole'] = 'REVIEWER';
      user['newRole'] = 'NONE';
      component.selectedUserToRemoveRole = user;
      component.cancelRemoveUserFromProgram();
      expect(component.selectedUserToRemoveRole['newRole']).toBe('REVIEWER');
      expect(component.showUserRemoveRoleModal).toBe(false);
    });

    it('Should not call api until previous api response comes', () => {
      component.userRemoveRoleLoader = true;
      const result = component.removeUserFromProgram();
      expect(result).toBe(false);
    });

    it('Should call getProgramRoleMapping if not already called', () => {
      const user = _.cloneDeep(orgUser);
      user['projectselectedRole'] = 'CONTRIBUTOR';
      user['newRole'] = 'NONE';
      component.selectedUserToRemoveRole = user;
      spyOn(component, 'getProgramRoleMapping').and.callThrough();
      component.removeUserFromProgram();
      expect(component.getProgramRoleMapping).toHaveBeenCalled();
    });

    it('Should show error toaster if failed to update the nomination rolemapping', () => {
      const user = _.cloneDeep(orgUser);
      user['projectselectedRole'] = 'CONTRIBUTOR';
      user['newRole'] = 'NONE';
      errorInitiate =true;
      component.selectedUserToRemoveRole = user;
      spyOn(TestBed.get(ProgramsService), 'updateNomination').and.callFake(() => of(updateNominationErrorResponse));
      spyOn(toasterService, 'error').and.callThrough();
      component.removeUserFromProgram();
      component.onRoleChange(user);
      expect(toasterService.error).toHaveBeenCalled();
      expect(component.showUserRemoveRoleModal).toBe(false);
      expect(component.userRemoveRoleLoader).toBe(false);
    });

    it('Should show success toaster if nomination update successful', () => {
      component.nominationDetails = {};
      const user = _.cloneDeep(orgUser);
      user['projectselectedRole'] = 'CONTRIBUTOR';
      user['newRole'] = 'NONE';
      errorInitiate =true;
      component.selectedUserToRemoveRole = user;
      spyOn(TestBed.get(ProgramsService), 'updateNomination').and.callFake(() => of(updateNominationSuccessResponse));
      spyOn(toasterService, 'success').and.callThrough();
      component.removeUserFromProgram();
      component.onRoleChange(user);
      expect(toasterService.success).toHaveBeenCalled();
      expect(component.showUserRemoveRoleModal).toBe(false);
      expect(component.userRemoveRoleLoader).toBe(false);
      expect(component.selectedUserToRemoveRole.newRole).toBe('Select Role');
    });
});