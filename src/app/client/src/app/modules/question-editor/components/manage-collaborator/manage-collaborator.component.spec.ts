import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageCollaboratorComponent } from './manage-collaborator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { HelperService } from '../../services/helper/helper.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { mockData } from './manage-collaborator.component.spec.data';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';

const mockEditorService = {
  editorConfig: {
    config: {
      assetConfig: {
        image: {
          size: '1',
          accepted: 'png, jpeg'
        }
      }
    },
    context: {
      user: {
        id: 123,
        fullName: 'Ram Gopal',
        isRootOrgAdmin: false,
        orgIds: '12345'

      },
      channel: 'sunbird'
    }
  },
  fetchContentDetails() {
  }
};
describe('ManageCollaboratorComponent', () => {
  let component: ManageCollaboratorComponent;
  let fixture: ComponentFixture<ManageCollaboratorComponent>;
  let editorService;
  let helperService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ManageCollaboratorComponent ],
      providers: [EditorService, ToasterService, { provide: EditorService, useValue: mockEditorService }],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCollaboratorComponent);
    component = fixture.componentInstance;
    editorService = TestBed.inject(EditorService);
    helperService = TestBed.inject(HelperService);
    component.addCollaborator = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should call setCreatorAndCollaborators method', () => {
    spyOn(component, 'setCreatorAndCollaborators').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.isRootOrgAdmin).toBeDefined();
    expect(component.userSearchBody.request.filters.rootOrgId).toBeDefined();
    expect(component.setCreatorAndCollaborators).toHaveBeenCalled();
  });

  it('#setCreatorAndCollaborators() should call editorService.fetchContentDetails method', () => {
    spyOn(editorService, 'fetchContentDetails').and.returnValue(of({result: {content: {
      name: 'test',  collaborators: ['5a587cc1-e018-4859-a0a8-e842650b9d645'], createdBy: '5a587cc1-e018-4859-a0a8-e842650b9d64'}}}));
    spyOn(component, 'checkUserRole').and.callFake(() => {});
    spyOn(component, 'setCreatorAndCollaborators').and.callThrough();
    component.setCreatorAndCollaborators();
    expect(component.contentCollaborators).toBeDefined();
    expect(component.contentOwner).toBeDefined();
    expect(component.creatorAndCollaboratorsIds).toBeDefined();
    expect(component.checkUserRole).toHaveBeenCalled();
  });

  it('#checkUserRole() should call getAllUserList method', () => {
    component.isRootOrgAdmin = true;
    component.contentOwner = ['12345'];
    component.currentUser = {id: '12345'};
    spyOn(component, 'getCollaborators');
    spyOn(component, 'getAllUserList').and.callFake(() => {});
    spyOn(component, 'checkUserRole').and.callThrough();
    expect(component.isContentOwner).toBeFalsy();
    expect(component.contentOwner).toBeDefined();
    component.checkUserRole();
    expect(component.isContentOwner).toBeTruthy();
    expect(component.getAllUserList).toHaveBeenCalled();
    expect(component.getCollaborators).not.toHaveBeenCalled();
  });

  it('#checkUserRole() should call getCollaborators method', () => {
    component.isRootOrgAdmin = false;
    component.contentOwner = ['12345'];
    component.currentUser = {id: '123456'};
    spyOn(component, 'getAllUserList');
    spyOn(component, 'getCollaborators').and.callFake(() => {});
    spyOn(component, 'checkUserRole').and.callThrough();
    component.checkUserRole();
    expect(component.isContentOwner).toBeFalsy();
    expect(component.getAllUserList).not.toHaveBeenCalled();
    expect(component.getCollaborators).toHaveBeenCalled();
  });

  it('#dismissCollaborationPopup() should call modalDismissEmitter', () => {
    spyOn(component.modalDismissEmitter, 'emit');
    component.dismissCollaborationPopup();
    expect(component.showCollaborationPopup).toBeFalsy();
    expect(component.modalDismissEmitter.emit).toHaveBeenCalled();
  });

  it('#getAllUserList() should call helperService.getAllUser', () => {
    spyOn(helperService, 'getAllUser').and.returnValue(of(mockData.alluserRes));
    spyOn(component, 'excludeCreatorAndCollaborators').and.callFake(() => {});
    spyOn(component, 'getAllUserList').and.callThrough();
    component.getAllUserList();
    expect(component.excludeCreatorAndCollaborators).toHaveBeenCalledWith(mockData.alluserRes.result.response.content);
  });

  it('#getAllUserList() should call toasterService.error', () => {
    const toasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(helperService, 'getAllUser').and.returnValue(throwError({}));
    spyOn(component, 'getAllUserList').and.callThrough();
    component.getAllUserList();
    expect(component.users.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#excludeCreatorAndCollaborators() should return excluded users', () => {
    component.creatorAndCollaboratorsIds = ['5a587cc1-e018-4859-a0a8-e842650b9d64'];
    spyOn(component, 'excludeCreatorAndCollaborators').and.callThrough();
    const allUsers = component.excludeCreatorAndCollaborators(mockData.alluserRes.result.response.content);
    expect(allUsers.length).toEqual(0);
  });

  it('#toggleSelectionUser() should set selectedUsers', () => {
    component.users = mockData.alluserRes.result.response.content;
    spyOn(component, 'toggleSelectionUser').and.callThrough();
    component.toggleSelectionUser(mockData.alluserRes.result.response.content[0].identifier);
    expect(component.selectedUsers).toContain(mockData.alluserRes.result.response.content[0].identifier);
  });

  it('#toggleSelectionUser() should set selectedUsers to empty', () => {
    component.selectedUsers = [mockData.alluserRes.result.response.content[0].identifier];
    component.users = mockData.alluserRes.result.response.content;
    spyOn(component, 'toggleSelectionUser').and.callThrough();
    component.toggleSelectionUser(mockData.alluserRes.result.response.content[0].identifier);
    expect(component.selectedUsers.length).toEqual(0);
  });

  it('#toggleSelectionCollaborator() should set selectedcollaborators', () => {
    component.collaborators = mockData.alluserRes.result.response.content;
    spyOn(component, 'toggleSelectionCollaborator').and.callThrough();
    component.toggleSelectionCollaborator(mockData.alluserRes.result.response.content[0].identifier);
    expect(component.selectedcollaborators).toContain(mockData.alluserRes.result.response.content[0].identifier);
  });

  it('#toggleSelectionCollaborator() should set selectedcollaborators to empty', () => {
    component.selectedcollaborators = [mockData.alluserRes.result.response.content[0].identifier];
    component.collaborators = mockData.alluserRes.result.response.content;
    spyOn(component, 'toggleSelectionCollaborator').and.callThrough();
    component.toggleSelectionCollaborator(mockData.alluserRes.result.response.content[0].identifier);
    expect(component.selectedcollaborators.length).toEqual(0);
  });

  it('#addRemoveCollaboratorToCourse() should call helperService.updateCollaborator', () => {
    component.contentCollaborators = ['5a587cc1-e018-4859-a0a8-e842650b9d64'];
    component.selectedUsers = [];
    component.selectedcollaborators = [];
    component.collectionId = 'do_113301063790198784120';
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(helperService, 'updateCollaborator').and.returnValue(of(mockData.allCollaboratorSuccess));
    const toasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'success').and.callFake(() => {});
    spyOn(component, 'addRemoveCollaboratorToCourse').and.callThrough();
    component.addRemoveCollaboratorToCourse(modal);
    expect(component.updatedCollaborators).toContain('5a587cc1-e018-4859-a0a8-e842650b9d64');
    expect(helperService.updateCollaborator).toHaveBeenCalledWith('do_113301063790198784120', ['5a587cc1-e018-4859-a0a8-e842650b9d64']);
    expect(toasterService.success).toHaveBeenCalled();
  });

  it('#addRemoveCollaboratorToCourse() should call toasterService.error', () => {
    component.contentCollaborators = ['5a587cc1-e018-4859-a0a8-e842650b9d64'];
    component.selectedUsers = [];
    component.selectedcollaborators = [];
    component.collectionId = 'do_113301063790198784120';
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(helperService, 'updateCollaborator').and.returnValue(throwError({}));
    const toasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'addRemoveCollaboratorToCourse').and.callThrough();
    component.addRemoveCollaboratorToCourse(modal);
    expect(component.updatedCollaborators).toContain('5a587cc1-e018-4859-a0a8-e842650b9d64');
    expect(helperService.updateCollaborator).toHaveBeenCalledWith('do_113301063790198784120', ['5a587cc1-e018-4859-a0a8-e842650b9d64']);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#getAllusers() should set isAddCollaboratorTab to true', () => {
    // component.isAddCollaboratorTab = false;
    spyOn(component, 'getAllusers').and.callThrough();
    component.getAllusers();
    expect(component.isAddCollaboratorTab).toBeTruthy();
  });

  it('#getCollaborators() should call helperService.getAllUser', () => {
    component.isAddCollaboratorTab = false;
    component.contentCollaborators = ['5a587cc1-e018-4859-a0a8-e842650b9d64'];
    spyOn(helperService, 'getAllUser').and.returnValue(of(mockData.alluserRes));
    spyOn(component, 'getCollaborators').and.callThrough();
    component.getCollaborators();
    expect(component.isAddCollaboratorTab).toBeFalsy();
    expect(component.manageCollaboratorTabVisit).toEqual(1);
    expect(helperService.getAllUser).toHaveBeenCalled();
    expect(component.collaborators.length).toEqual(1);
  });

  it('#getCollaborators() should call toasterService.error', () => {
    component.isAddCollaboratorTab = false;
    component.contentCollaborators = ['5a587cc1-e018-4859-a0a8-e842650b9d64'];
    spyOn(helperService, 'getAllUser').and.returnValue(throwError({}));
    const toasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'getCollaborators').and.callThrough();
    component.getCollaborators();
    expect(component.isAddCollaboratorTab).toBeFalsy();
    expect(component.manageCollaboratorTabVisit).toEqual(1);
    expect(helperService.getAllUser).toHaveBeenCalled();
    expect(component.collaborators.length).toEqual(0);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#searchByKeyword() should call helperService.getAllUser', () => {
    component.searchKeyword = 'n11@yopmail.com';
    spyOn(component, 'validateEmail').and.callThrough();
    spyOn(helperService, 'getAllUser').and.returnValue(of(mockData.alluserRes));
    spyOn(component, 'searchByKeyword').and.callThrough();
    component.searchByKeyword();
    expect(component.searchKeyword).toBeDefined();
    expect(component.validateEmail).toHaveBeenCalled();
    expect(helperService.getAllUser).toHaveBeenCalled();
    expect(component.searchRes.searchStatus).toEqual('end');
    expect(component.searchRes.content).toEqual(mockData.alluserRes.result.response.content);
  });

  it('#resetSearch() should reset searchRes', () => {
    spyOn(component, 'resetSearch').and.callThrough();
    component.resetSearch();
    expect(component.searchRes.content.length).toEqual(0);
    expect(component.searchRes.isEmptyResponse).toBeFalsy();
  });

  it('#refreshSearch() should call searchByKeyword', () => {
    spyOn(component, 'searchByKeyword').and.callFake(() => {});
    spyOn(component, 'refreshSearch').and.callThrough();
    component.refreshSearch();
    expect(component.searchKeyword).toEqual('');
    expect(component.searchByKeyword).toHaveBeenCalled();
  });

  it('#validateEmail() should return true', () => {
    spyOn(component, 'validateEmail').and.callThrough();
    const isEmail = component.validateEmail('abcd@gmail.com');
    expect(isEmail).toBeTruthy();
  });

  it('#validateEmail() should return false', () => {
    spyOn(component, 'validateEmail').and.callThrough();
    const isEmail = component.validateEmail('abcd');
    expect(isEmail).toBeFalsy();
  });

  it('#selectUser() should call toggleSelectionUser method', () => {
    spyOn(component, 'toggleSelectionUser').and.callFake(() => {});
    spyOn(component, 'selectUser').and.callThrough();
    component.selectUser({identifier: '12345'});
    expect(component.toggleSelectionUser).toHaveBeenCalled();
  });

  it('#viewAllResults() should set user data', () => {
    component.searchRes.content = mockData.alluserRes.result.response.content;
    spyOn(component, 'viewAllResults').and.callThrough();
    component.viewAllResults();
    expect(component.users).toBe(mockData.alluserRes.result.response.content);
  });

});
