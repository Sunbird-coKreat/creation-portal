import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '@sunbird/core';
import { OrgUserListComponent } from './org-user-list.component';
import { RegistryService , ProgramsService,} from '@sunbird/core';
import {userDetail, chunkedUserList} from '../../services/programUserTestData';
import { SharedModule, ResourceService, ToasterService, ConfigService, NavigationHelperService} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { UsageService } from '@sunbird/dashboard';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash-es';

// import {mockData} from './org-reports.component.spec.data'

describe('OrgUserListComponent', () => {
  let component: OrgUserListComponent;
  let fixture: ComponentFixture<OrgUserListComponent>;
  const fakeActivatedRoute = {
    snapshot: { data: {
      roles: 'programSourcingRole',
      telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'list-org-reports' }
    }}
  };
  const userServiceStub = {
    userProfile : userDetail.result
  };
  const resourceBundle = userDetail.params;

  const routerStub = { url: '/sourcing/orgreports' };
  beforeEach(async(() => {
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
        ToasterService, ResourceService, NavigationHelperService, ConfigService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, { provide: Router, useValue: routerStub },
        {provide: APP_BASE_HREF, useValue: '/'}, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        {provide: UserService, useValue: userServiceStub},
        { provide: ResourceService, useValue: resourceBundle  }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUserListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    component.telemetryImpression = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata: [],
        pdata: {
          id: '1234567891011213',
          ver: '1',
          pid: 'dummy'
        },
        did: ''
      },
      edata: {
        type: _.get(fakeActivatedRoute, 'snapshot.data.telemetry.type'),
        pageid: 'org-user',
        uri: '',
        duration: 2000
      }
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    const user = {selectedRole: 'dummy', User_Org: { osid: '12345' }};
    spyOn(component, 'updateUserRole');
    component.onRoleChange(user);
    expect(component.updateUserRole).toHaveBeenCalledWith(user.User_Org.osid, user.selectedRole);
  })

  it ('#updateUserRole() should call programsService.updateUserRole()', () => {
    const osid = '12345';
    const role = 'dummy';
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'updateUserRole').and.callThrough();
    component.updateUserRole(osid, role);
    expect(programsService.updateUserRole).toHaveBeenCalledWith(osid, [role]);
  })


  xit('#getContributionOrgUsers() should call registeryService.getcontributingOrgUsersDetails()', () => {
    const  registryService  = TestBed.get(RegistryService);
    spyOn(registryService, 'getcontributingOrgUsersDetails').and.callFake(() => observableOf({}));
    component.getContributionOrgUsers();
    expect(registryService.getcontributingOrgUsersDetails).toHaveBeenCalled();
  });

  it('#getUserDetailsBySearch() should call sortUsersList()', () => {
    component.searchInput = '';
    component.initialSourcingOrgUser = ['dummy'];
    spyOn(component, 'sortUsersList').and.callThrough();
    component.getUserDetailsBySearch();
    expect(component.sortUsersList).toHaveBeenCalledWith(component.initialSourcingOrgUser, true);
  } )

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
});
