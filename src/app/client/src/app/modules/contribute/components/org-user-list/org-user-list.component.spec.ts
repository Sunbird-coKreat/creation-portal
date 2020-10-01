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
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';

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
      imports: [HttpClientTestingModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule,
        SuiTabsModule, SuiModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ OrgUserListComponent ],
      providers: [
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
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  // it('reset the user list when there is no search input', () => {
  //   spyOn(component, 'sortUsersList');
  //   component.searchInput = '';
  //   expect(component.sortUsersList).toHaveBeenCalledWith(userDetail.result.response.content);
  // });
  // it('get the user list when there is a search input', () => {
  //   spyOn(component, 'sortUsersList');
  //   component.searchInput = 'jnc68';
  //   const  registryService  = TestBed.get(RegistryService);
  //   const userList = registryService.getSearchedUserList(userDetail.result.response.content, component.searchInput)
  //   expect(component.sortUsersList).toHaveBeenCalledWith(userList);
  //   });
//  it('call the sortUsersList method when there is input', () => {
//     component.pageLimit = 1;
//     component.searchInput = 'jnc68';
//     const  programsService  = TestBed.get(ProgramsService);
//     component.sortUsersList(userDetail.result.response.content);
//     const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'asc')
//     expect(component.paginatedContributorOrgUsers).toBe(sortedList);
//     expect(component.contributorOrgUsers).toBe(chunkedUserList[0]);
//     expect(component.orgUserscnt).toBe(chunkedUserList[0].length);
//   });
  // it('call the sortUsersList method when there is empty input', () => {
  //    component.pageLimit = 1;
  //    component.searchInput = '';
  //    const  programsService  = TestBed.get(ProgramsService);
  //    component.sortUsersList(userDetail.result.response.content);
  //    const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'asc')
  //    expect(component.paginatedContributorOrgUsers).toBe(sortedList);
  //    expect(component.contributorOrgUsers).toBe(userDetail.result.response.content);
  //    expect(component.orgUserscnt).toBe(userDetail.result.response.content.length);
  //   });

    it('call the sortUsersList method when there is input from user', () => {
      // component.pageLimit = 1;
      // component.searchInput = '';
      const  programsService  = TestBed.get(ProgramsService);
      component.sortUsersList(userDetail.result.response.content);
      const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc')
      expect(component.paginatedContributorOrgUsers).toBe(sortedList);
      expect(component.contributorOrgUsers).toBe(userDetail.result.response.content);
      expect(component.orgUserscnt).toBe(userDetail.result.response.content.length);
     });
     it('call the sortUsersList method and put user to initial org list', () => {
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
