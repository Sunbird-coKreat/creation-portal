
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { mockUserData } from './user.mock.spec.data';
import { ConfigService, SharedModule} from '@sunbird/shared';
import { TestBed, inject, async } from '@angular/core/testing';
import { LearnerService, UserService, CoreModule, ContentService } from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Location} from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd} from '@angular/router';
import * as _ from 'lodash-es';

describe('userService', () => {
  let location: Location;
  let router: Router;
  
  class MockRouter {
    navigate = jasmine.createSpy('navigate');
    public navigationEnd = new NavigationEnd(1, '/learn', '/learn');
    public navigationEnd2 = new NavigationEnd(2, '/search/All/1', '/search/All/1');
    public url = '/profile';
    public events = new Observable(observer => {
      observer.next(this.navigationEnd);
      observer.complete();
    });
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule],
      providers: [ConfigService, UserService, LearnerService, ContentService, { provide: Router, useClass: MockRouter}, Location],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
  });

  it('should fetch user profile details', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    expect(userService._userProfile).toBeDefined();
  }));
  it('should emit user profile data on success', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.userProfile).toBeDefined();
    });
  }));
  it('should emit error on api failure', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableThrowError(mockUserData.error));
    userService.initialize(true);
    userService.userData$.subscribe(userData => {
      expect(userData.err).toBeDefined();
    });
  }));
  it('should return userProfile when userProfile get method is called', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    const userProfile = userService.userProfile;
    expect(userProfile).toBeDefined();
  }));
  it('should set rootOrgAdmin to true', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.rootOrgSuccess));
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeTruthy();
  }));
  it('should set rootOrgAdmin to false', inject([UserService], (service: UserService) => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'getWithHeaders').and.returnValue(observableOf(mockUserData.success));
    userService.initialize(true);
    expect(userService._userProfile.rootOrgAdmin).toBeFalsy();
  }));

  it('should fetch userFeed Data', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(mockUserData.feedSuccessResponse);
    userService.getFeedData();
    const url = {url : 'user/v1/feed/' + userService.userId};
    expect(learnerService.get).toHaveBeenCalledWith(url);
  });

  it('should migrate custodian user', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    const params = {
      'request' : {
        'userId': '12345',
        'action': 'accept',
        'userExtId': 'bt240',
        'channel': 'TN',
        'feedId': '32145669877'
      }
    };
    spyOn(learnerService, 'post').and.returnValue(mockUserData.migrateSuccessResponse);
    userService.userMigrate(params);
    const options = { url: 'user/v1/migrate', data: params};
    expect(learnerService.post).toHaveBeenCalledWith(options);
  });

  it('Should return true if logged in user belongs to current project', () => {
    const program = { sourcing_org_name: 'Vidya2' };
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const result = userService.isDefaultContributingOrg(program);
    expect(result).toBe(true);
  });

  it('Should return false if logged in user does not belongs to current project', () => {
    const program = { sourcing_org_name: 'test' };
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const result = userService.isDefaultContributingOrg(program);
    expect(result).toBe(false);
  });

  it('Should return true if user is contributor org admin', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const result = userService.isContributingOrgAdmin();
    expect(result).toBe(true);
  });

  it('Should return false if user is not contributor org admin', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    userService._userProfile.userRegData.User_Org.roles = ["user"];
    const result = userService.isContributingOrgAdmin();
    expect(result).toBe(false);
  });

  it('Should return true if user is contributor org user', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    userService._userProfile.userRegData.User_Org.roles = ["user"];
    const result = userService.isContributingOrgUser();
    expect(result).toBe(true);
  });

  it('Should return false if user is not contributor org user', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const result = userService.isContributingOrgUser();
    expect(result).toBe(false);
  });

  it('Should return true if user belongs to org', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const result = userService.isUserBelongsToOrg();
    expect(result).toBe(true);
  });

  it('Should return false if user does belongs to org', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.individualContributorDetails);
    const result = userService.isUserBelongsToOrg();
    expect(result).toBe(false);
  });

  it('Should return array of user roles if user belongs to org', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const result = userService.getUserOrgRole();
    expect(result).toEqual(["admin"]);
  });

  it('Should return blank array as user roles if user does not belong to org', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.individualContributorDetails);
    const result = userService.getUserOrgRole();
    expect(result).toEqual([]);
  });

  it('Should return user id of user', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.individualContributorDetails);
    const userId = userService.getUserId();
    expect(userId).toEqual('19ba0e4e-9285-4335-8dd0-f674bf03fa4d');
  });

  it('Should return org id of user', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const orgId = userService.getUserOrgId();
    expect(orgId).toEqual('e0ab89f4-0fcb-47ea-9b70-3ed0f12b1b7a');
  });

  it('Should return true if user is sourcing org admin', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributorOrgAdminDetails);
    const result = userService.isSourcingOrgAdmin();
    expect(result).toBe(true);
  });

  it('Should return false if user is not sourcing org admin', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.individualContributorDetails);
    const result = userService.isSourcingOrgAdmin();
    expect(result).toBe(false);
  });

  it('Should return true if user is assigned CONTRIBUTOR role for the program', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributingOrgContributorDetails);
    const result = userService.isContributingOrgContributor(mockUserData.nominationDetails);
    expect(result).toBe(true);
  });

  it('Should return false if user is assigned CONTRIBUTOR role for the program', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributingOrgContributorDetails);
    const nominationDetails = _.cloneDeep(mockUserData.nominationDetails);
    nominationDetails.rolemapping.CONTRIBUTOR = [];
    const result = userService.isContributingOrgContributor(nominationDetails);
    expect(result).toBe(false);
  });

  it('Should return true if user is assigned REVIEWER role for the program', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributingOrgContributorDetails);
    const result = userService.isContributingOrgReviewer(mockUserData.nominationDetails);
    expect(result).toBe(true);
  });

  it('Should return false if user is assigned REVIEWER role for the program', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributingOrgContributorDetails);
    const nominationDetails = _.cloneDeep(mockUserData.nominationDetails);
    nominationDetails.rolemapping.REVIEWER = [];
    const result = userService.isContributingOrgReviewer(nominationDetails);
    expect(result).toBe(false);
  });

  it('Should return array of user roles assigned to the program', () => {
    const userService = TestBed.get(UserService);
    userService._userProfile = _.cloneDeep(mockUserData.contributingOrgContributorDetails);
    const nominationDetails = _.cloneDeep(mockUserData.nominationDetails);
    const roles = userService.getMyRoleForProgram(nominationDetails);
    expect(roles.length).toBe(2);
  });
});
