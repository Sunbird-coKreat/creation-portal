import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule, TELEMETRY_PROVIDER, TelemetryService} from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '@sunbird/core';
import { OrgUserListComponent } from './org-user-list.component';
import { RegistryService , ProgramsService,} from '@sunbird/core';
import {userDetail, chunkedUserList, telemetryData } from '../../services/programUserTestData';
import { SharedModule, ResourceService, ToasterService, ConfigService, NavigationHelperService, PaginationService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { UsageService } from '@sunbird/dashboard';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import * as _ from 'lodash-es';
import { SourcingService, HelperService } from '../../../sourcing/services';
import { contextualHelpConfig} from './org-user-list.component.spec.data';
describe('OrgUserListComponent', () => {
  let component: OrgUserListComponent;
  let fixture: ComponentFixture<OrgUserListComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '12345'
      },
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-draft', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };
  const userServiceStub = {
    userProfile : {
      userId: "149d152e-9192-4721-9e69-01e1e47f9b70",
      rootOrg: {
          slug: "NIT"
      }
    },
    channel: '12345',
    appId: 'abcd1234',
    hashTagId: '01309282781705830427'
  };

  const resourceBundle = {
    messages: {
      emsg: {
        blueprintViolation : 'Please provide all required blueprint values'
      }
    }
  };

  const routerStub = { url: '/sourcing/orgreports' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(),
         TelemetryModule.forRoot(), RouterTestingModule,
        SuiTabsModule, SuiModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ OrgUserListComponent ],
      providers: [
        DatePipe,
        RegistryService,
        ProgramsService,
        ToasterService, NavigationHelperService, ConfigService, SourcingService, PaginationService, TelemetryService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, { provide: Router, useValue: routerStub },
        {provide: APP_BASE_HREF, useValue: '/'}, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        {provide: UserService, useValue: userServiceStub},
        { provide: ResourceService, useValue: resourceBundle  },
        HelperService
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(OrgUserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('getPageId should return page id', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const page = component.getPageId();
    expect(component.telemetryPageId).toBeDefined();
    expect(page).toBeDefined();
  });
  it('#setOrgUsers() should call sortCollection()', () => {
    const orgUsersDetails = ['dummyValue'];
    spyOn(component, 'sortCollection');
    component.setOrgUsers(orgUsersDetails);
    expect(component.allContributorOrgUsers).toBe(orgUsersDetails);
    expect(component.orgUserscnt).toBe(1);
    expect(component.sortCollection).toHaveBeenCalled();
  });

  it('#sortCollection() should call sortUsersList', () => {
    component.allContributorOrgUsers = ['dummyValue'];
    spyOn(component, 'sortUsersList');
    component.sortCollection('name');
    expect(component.sortUsersList).toHaveBeenCalled();
  })

  it ('#onRoleChange() should call setTelemetryForonRoleChange()', () => {
    const user = {selectedRole: 'dummy', User_Org: { osid: '12345' }};
    spyOn(component, 'setTelemetryForonRoleChange');
    component.onRoleChange(user);
    expect(component.setTelemetryForonRoleChange).toHaveBeenCalledWith(user);
  })

  it ('#onRoleChange() should call updateUserRole()', () => {
    const user = {selectedRole: 'dummy', User_Org: { osid: '12345' }, User: { osid: '12345' }};
    spyOn(component, 'updateUserRole');
    component.onRoleChange(user);
    expect(component.updateUserRole).toHaveBeenCalledWith(user.User_Org.osid, user.selectedRole, user.User.osid);
  })

  it ('#updateUserRole() should call programsService.updateUserRole()', () => {
    const osid = '12345';
    const role = 'dummy';
    const userId = '123';
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'updateUserRole').and.callThrough();
    component.updateUserRole(osid, role, userId);
    expect(programsService.updateUserRole).toHaveBeenCalledWith(osid, [role]);
  })


  xit('#getContributionOrgUsers() should call registeryService.getOrgUsersDetails()', () => {
    const  registryService  = TestBed.get(RegistryService);
    spyOn(registryService, 'getOrgUsersDetails').and.callFake(() => observableOf({}));
    component.getContributionOrgUsers();
    expect(registryService.getOrgUsersDetails).toHaveBeenCalled();
  });

  it('#getUserDetailsBySearch() should call sortUsersList()', () => {
    component.searchInput = '';
    component.initialSourcingOrgUser = ['dummy'];
    spyOn(component, 'sortUsersList').and.callThrough();
    component.telemetryImpression = telemetryData;
    component.getUserDetailsBySearch();
    component.sortColumn = 'selectedRole';
    expect(component.sortUsersList).toHaveBeenCalledWith(component.initialSourcingOrgUser, true);
  } )
  it('logTelemetryImpressionEvent should log impression', () => {
    spyOn(component, 'logTelemetryImpressionEvent').and.callThrough();
    component.impressionEventTriggered = false;
    const returnObj = component.getTelemetryInteractEdata('1234', 'dummyType', 'dummySubtype', 'create', undefined);
    expect(returnObj).not.toContain(undefined);
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
      const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'asc')
      expect(component.paginatedContributorOrgUsers).toBe(sortedList);
      expect(component.contributorOrgUsers).toBe(chunkedUserList[0]);
      expect(component.orgUserscnt).toBe(chunkedUserList[0].length);
    });

  xit('call the sortUsersList method when there is empty input', () => {
     component.pageLimit = 1;
     component.searchInput = '';
     const  programsService  = TestBed.get(ProgramsService);
     component.sortUsersList(userDetail.result.response.content);
     const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'asc')
     expect(component.paginatedContributorOrgUsers).toBe(sortedList);
     expect(component.contributorOrgUsers).toBe(userDetail.result.response.content);
     expect(component.orgUserscnt).toBe(userDetail.result.response.content.length);
    });

  xit('call the sortUsersList method when there is input from user', () => {
    // component.pageLimit = 1;
    // component.searchInput = '';
    const  programsService  = TestBed.get(ProgramsService);
    component.sortUsersList(userDetail.result.response.content);
    const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc')
    expect(component.paginatedContributorOrgUsers).toBe(sortedList);
    expect(component.contributorOrgUsers).toBe(userDetail.result.response.content);
    expect(component.orgUserscnt).toBe(userDetail.result.response.content.length);
    });

    xit('call the sortUsersList method and put user to initial org list', () => {
    component.isInitialSourcingOrgUser = true;
    const  programsService  = TestBed.get(ProgramsService);
    component.sortUsersList(userDetail.result.response.content);
    const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc')
    expect(component.paginatedContributorOrgUsers).toBe(sortedList);
    expect(component.contributorOrgUsers).toBe(userDetail.result.response.content);
    expect(component.initialSourcingOrgUser).toBe(userDetail.result.response.content);
    expect(component.orgUserscnt).toBe(userDetail.result.response.content.length);
    });

    it('#setContextualHelpConfig should set mangeUsersHelpConfig and noUsersHelpConfig', () => {
      component.mangeUsersHelpConfig = undefined;
      component.noUsersHelpConfig = undefined;
      const helperService = TestBed.get(HelperService);
      spyOn(helperService, 'getContextualHelpConfig').and.returnValue(contextualHelpConfig);
      spyOn(component, 'setContextualHelpConfig').and.callThrough();
      component.setContextualHelpConfig();
      expect(component.mangeUsersHelpConfig).toBeDefined();
      expect(component.noUsersHelpConfig).toBeDefined();
    });
});
