import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { EditorService } from '../../services/editor/editor.service';
import { HelperService } from '../../services/helper/helper.service';
import { ConfigService } from '../../services/config/config.service';

import * as _ from 'lodash-es';
@Component({
  selector: 'lib-manage-collaborator',
  templateUrl: './manage-collaborator.component.html',
  styleUrls: ['./manage-collaborator.component.scss']
})
export class ManageCollaboratorComponent implements OnInit {
  @Output() modalDismissEmitter = new EventEmitter<any>();
  @ViewChild('modal') private modal;
  @Input() addCollaborator;
  @Input() collectionId;
  public showCollaborationPopup: boolean;
  public contentCollaborators: any;
  public contentOwner;
  public creatorAndCollaboratorsIds;
  public selectedUsers = [];
  public selectedcollaborators = [];
  public users = [];
  public collaborators = [];
  public manageCollaboratorTabVisit = 0;
  public updatedCollaborators = [];
  public isAddCollaboratorTab: boolean;
  public searchKeyword = '';
  public searchRes = { count: 0, content: [], isEmptyResponse: false, errorMessage: '', searchStatus: 'start' };
  public userSearchBody = {
    request: {
        query: '',
        filters: {
            'organisations.roles': 'CONTENT_CREATOR',
            rootOrgId: ''
        },
        fields: ['email', 'firstName', 'identifier', 'lastName', 'organisations', 'rootOrgName', 'phone'],
        offset: 0,
        limit: 200
    }
  };
  public isContentOwner = false;
  public isRootOrgAdmin: boolean;
  public currentUser: any;
  public allUsersCount = 0;

  constructor(
    public helperService: HelperService,
    public toasterService: ToasterService,
    public configService: ConfigService,
    public editorService: EditorService,
    public telemetryService: EditorTelemetryService
    ) { }

  ngOnInit() {
    this.currentUser = _.get(this.editorService.editorConfig, 'context.user');
    this.isRootOrgAdmin = _.has(this.currentUser, 'isRootOrgAdmin') ? this.currentUser.isRootOrgAdmin : false;
    if (_.has(this.currentUser, 'orgIds')) {
      this.userSearchBody.request.filters.rootOrgId = this.currentUser.orgIds;
    }
    this.setCreatorAndCollaborators();
  }

  setCreatorAndCollaborators() {
    this.editorService.fetchContentDetails(this.collectionId).subscribe(res => {
      this.contentCollaborators = _.get(res.result.content, 'collaborators', []);
      this.contentOwner = [_.get(res.result.content, 'createdBy')];
      this.creatorAndCollaboratorsIds = [...this.contentCollaborators, ...this.contentOwner];
      this.checkUserRole();
    });
  }

  checkUserRole() {
    if (this.contentOwner && (this.contentOwner[0] === this.currentUser.id)) {
      this.isContentOwner = true;
    }
    if (this.isContentOwner || this.isRootOrgAdmin) {
      this.isAddCollaboratorTab = true;
      this.getAllUserList();
    } else {
      this.getCollaborators();
    }
    this.showCollaborationPopup =  this.addCollaborator;
  }

  dismissCollaborationPopup() {
    this.showCollaborationPopup = false;
    this.modalDismissEmitter.emit({});
  }

  getAllUserList() {
    this.helperService.getAllUser(this.userSearchBody).subscribe((response: any) => {
      this.users = [];
      if (_.has(response, 'result.response.content')) {
        const allUsers = _.get(response, 'result.response.content');
        this.allUsersCount = allUsers.length - 1;
        this.users = this.excludeCreatorAndCollaborators(allUsers);
      }
    },
    (error) => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
      console.log(error);
    });
  }

  excludeCreatorAndCollaborators(allUsers) {
    return _.filter(allUsers, user => {
      return !_.includes(this.creatorAndCollaboratorsIds, user.identifier);
    });
  }

  toggleSelectionUser(userIdentifier) {
    _.forEach(this.users, user => {
      if (user.identifier === userIdentifier) {
        if (_.has(user, 'isSelected') && user.isSelected === true) {
          user.isSelected = false;
          const index = this.selectedUsers.indexOf(userIdentifier);
          if (index > -1) {
            this.selectedUsers.splice(index, 1);
          }
        } else {
          user.isSelected = true;
          this.selectedUsers.push(userIdentifier);
        }
      }
    });
  }

  toggleSelectionCollaborator(userIdentifier) {
    _.forEach(this.collaborators, user => {
      if (user.identifier === userIdentifier) {
        if (_.has(user, 'isSelected') && user.isSelected === true) {
          user.isSelected = false;
          const index = this.selectedcollaborators.indexOf(userIdentifier);
          if (index > -1) {
            this.selectedcollaborators.splice(index, 1);
          }
        } else {
          user.isSelected = true;
          this.selectedcollaborators.push(userIdentifier);
        }
      }
    });
  }

  addRemoveCollaboratorToCourse(modal) {
    this.updatedCollaborators = this.contentCollaborators;
    this.updatedCollaborators = _.concat(this.updatedCollaborators, this.selectedUsers);
    this.updatedCollaborators = _.difference(this.updatedCollaborators, this.selectedcollaborators);
    this.helperService.updateCollaborator(this.collectionId, this.updatedCollaborators).subscribe((response: any) => {
      if (response.params.status === 'successful') {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.012'));
      } else {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
      }
    },
    (error) => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
      console.log(error);
    });
    modal.deny();
  }

  /* to be called when user change tab to add collaborator */
  getAllusers() {
    this.isAddCollaboratorTab = true;
  }

  /* to be called when user change tab to manage collaborator */
  getCollaborators() {
    this.isAddCollaboratorTab = false;
    this.manageCollaboratorTabVisit += 1;
    if (this.manageCollaboratorTabVisit <= 1) {
      // tslint:disable-next-line:no-string-literal
      this.userSearchBody.request.filters['userId'] = this.contentCollaborators;
      if (!_.isEmpty(this.contentCollaborators)) {
        this.helperService.getAllUser(this.userSearchBody).subscribe((response: any) => {
          this.collaborators = [];
          if (_.has(response, 'result.response.content')) {
            this.collaborators = _.get(response, 'result.response.content');
          }
        },
        (error) => {
          this.collaborators = [];
          this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
          console.log(error);
        });
      }
    }
  }

  sortUsersList(value) {
    if (value === 'firstName') {
      this.users = _.orderBy(this.users, [user => user[value].toLowerCase()]);
    } else {
      this.users = _.orderBy(this.users, [user => user.organisations[0].orgName ? user.organisations[0].orgName.toLowerCase() : '']);
    }
  }

  searchByKeyword() {
    const searchRequest = this.userSearchBody;
    if (this.validateEmail(this.searchKeyword)) {
      // tslint:disable-next-line:no-string-literal
      searchRequest.request.filters['email'] = this.searchKeyword;
    } else if (/^\d+$/.test(this.searchKeyword)) {
        // tslint:disable-next-line:no-string-literal
        searchRequest.request.filters['phone'] = this.searchKeyword;
    } else {
        searchRequest.request.query = this.searchKeyword;
    }

    this.helperService.getAllUser(searchRequest).subscribe((response: any) => {
        this.searchRes.searchStatus = 'end';
        if (_.has(response, 'result.response.content')) {
          this.searchRes.content = this.excludeCreatorAndCollaborators(_.get(response, 'result.response.content'));
          if (this.searchRes.content.length) {
            this.searchRes.isEmptyResponse = false;
          } else {
            this.searchRes.isEmptyResponse = true;
            this.searchRes.content = [];
          }
        }
    },
    (error) => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.001'));
      console.log(error);
      this.searchRes.content = [];
      this.searchRes.isEmptyResponse = true;
      this.searchRes.errorMessage = _.get(this.configService, 'labelConfig.messages.error.001');
    });
  }

  resetSearch() {
    this.searchRes.content = [];
    this.searchRes.isEmptyResponse = false;
  }

  refreshSearch() {
    this.searchKeyword = '';
    this.searchByKeyword();
  }

  validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  selectUser(user) {
    this.toggleSelectionUser(user.identifier);
  }

  viewAllResults() {
    this.users = this.searchRes.content;
  }
}
