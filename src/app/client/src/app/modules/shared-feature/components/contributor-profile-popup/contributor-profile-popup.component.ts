import { UserService, ProgramsService } from '@sunbird/core';
import { ResourceService, ToasterService  } from '@sunbird/shared';
import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, } from '@angular/core';
import * as _ from 'lodash-es';
import { tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-contributor-profile-popup',
  templateUrl: './contributor-profile-popup.component.html',
  styleUrls: ['./contributor-profile-popup.component.scss']
})
export class ContributorProfilePopupComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<any>();
  @ViewChild('modal') private modal;
  @Input() userId?: string;
  @Input() orgId?: string;
  contributor: any;
  name: string;
  contact: string;
  website: string;
  board: any[];
  medium: any[];
  gradeLevel: any[];
  subject: any[];
  contentTypes: any[];
  showLoader = true;
  userType: string;
  profile = {};

  constructor(
    public userService: UserService,
    public toasterService: ToasterService,
    public programsService: ProgramsService,
    public resourceService: ResourceService
  ) { }

  ngOnInit() {
    if (_.isEmpty(this.orgId) && _.isEmpty(this.userId)) {
      this.toasterService.error(this.resourceService.messages.emsg.contributor.profile.m0001);
      return;
    }

    this.getUserprofileDetails();
  }

  getUserOrgProfile(osid) {
    const orgSearchReq = {
      entityType: ['User_Org'],
      filters: {
        userId: {eq: osid}
      }
    };
    return this.programsService.searchRegistry(orgSearchReq);
  }

  getUserprofileDetails() {
    const observables = [];
    if (!_.isEmpty(this.orgId)) {
      observables.push(this.getOrgProfile());
    }
    if (!_.isEmpty(this.userId)) {
      observables.push(this.getUserProfile());
    }
    forkJoin(observables).subscribe((data) => {
      let userOrg;
      const user = _.get(this.profile, 'User');
      const org = _.get(this.profile, 'Org');
      this.getUserOrgProfile(user.osid).subscribe(
        (response) => {
          const userOrgs = _.get(response, 'result.User_Org');
          if (!_.isEmpty(userOrgs)) {
            userOrg = _.find(userOrgs, (o) => {
              return o.orgId === this.orgId;
            });
          }

        this.getUsersDetails();

        let details = user;
        if (!_.isEmpty(org) && !_.isEmpty(user) && !_.isEmpty(userOrg) && !_.includes(userOrg.roles, 'admin')) {
          this.userType = 'org_user';
        } else if (!_.isEmpty(org)) {
          this.userType = 'org';
          details = org;
        } else if (!_.isEmpty(user)) {
          this.userType = 'individual_user';
        }
        this.setProfileDetails(details);
        this.showLoader = false;
      });
    },
    (err) => {
      this.handleError(err, this.resourceService.messages.emsg.contributor.profile.m0001);
      return false;
    });
  }

  getUsersDetails() {
    const req = {
      'identifier': this.userId
    };
    this.programsService.getOrgUsersDetails(req).subscribe((response) => {
      const users = _.get(response, 'result.response.content');
      if (!_.isEmpty(users)) {
        const user = users[0];
        if (!_.isEmpty(user.maskedEmail)) {
          this.contact = user.maskedEmail;
        }
        if (!_.isEmpty(user.maskedPhone)) {
          this.contact = user.maskedPhone;
        }
      }
    });
  }

  setProfileDetails(details) {
    if (this.userType === 'org') {
      this.name = details.name;
    } else {
      this.name = details.firstName;
      if (!_.isEmpty(details.lastName)) {
        this.name  += ' ' + details.lastName;
      }
    }
    this.website = _.get(details, 'website');
    this.contentTypes = _.get(details, 'contentTypes');
    this.gradeLevel = _.get(details, 'gradeLevel');
    this.medium = _.get(details, 'medium');
    this.subject = _.get(details, 'subject');
    this.board = _.get(details, 'board');
  }

  getUserProfile() {
    const userSearchReq = {
      entityType: ['User'],
      filters: {
        userId: { eq : this.userId }
      }
    };
    return this.programsService.searchRegistry(userSearchReq).pipe(
      tap((response) => {
        const users = _.get(response, 'result.User');
        if (_.isEmpty(users)) {
          this.toasterService.warning(this.resourceService.messages.emsg.profile.m0001);
          return false;
        }
        this.profile['User'] = users[0];
      }
    ));
  }

  getOrgProfile() {
    const orgSearchReq = {
      entityType: ['Org'],
      filters: {
        osid: { eq : this.orgId }
      }
    };
    return this.programsService.searchRegistry(orgSearchReq).pipe(
      tap((response) => {
        const org = _.get(response, 'result.Org');
        if (_.isEmpty(org)) {
          this.toasterService.warning(this.resourceService.messages.emsg.contributorjoin.m0001);
          return false;
        }
        this.profile['Org'] = org[0];
      })
    );
  }

  handleError(err, customErrMsg) {
    console.log(err);
    const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
    this.toasterService.warning(errorMes || customErrMsg);
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

  closePopup() {
    this.modal.deny();
    this.close.emit();
  }
}
