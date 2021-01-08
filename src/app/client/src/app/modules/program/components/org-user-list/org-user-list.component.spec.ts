import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUserListComponent } from './org-user-list.component';
import {userDetail, chunkedUserList} from '../../services/programUserTestData';
import { ProgramsService , RegistryService} from '@sunbird/core';
import { APP_BASE_HREF,DatePipe } from '@angular/common';

xdescribe('OrgUserListComponent', () => {
  let component: OrgUserListComponent;
  let fixture: ComponentFixture<OrgUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUserListComponent ],
      providers: [
        ProgramsService,
        RegistryService,DatePipe
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc')
    expect(component.paginatedContributorOrgUsers).toBe(sortedList);
    expect(component.contributorOrgUsers).toBe(chunkedUserList[0]);
    expect(component.orgUserscnt).toBe(chunkedUserList[0].length);
  });
  it('call the sortUsersList method when there is empty input', () => {
     component.pageLimit = 1;
     component.searchInput = '';
     const  programsService  = TestBed.get(ProgramsService);
     component.sortUsersList(userDetail.result.response.content);
     const sortedList = programsService.sortCollection(userDetail.result.response.content,  'selectedRole', 'desc')
     expect(component.paginatedContributorOrgUsers).toBe(sortedList);
     expect(component.contributorOrgUsers).toBe(userDetail.result.response.content);
     expect(component.orgUserscnt).toBe(userDetail.result.response.content.length);
    });
});
