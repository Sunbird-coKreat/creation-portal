import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToasterService, ResourceService, NavigationHelperService, ConfigService, PaginationService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination} from '../../../sourcing/interfaces';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { UserService, RegistryService, ProgramsService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { SourcingService } from '../../../sourcing/services';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-org-user-list',
  templateUrl: './org-user-list.component.html',
  styleUrls: ['./org-user-list.component.scss'],
  providers: [DatePipe]
})
export class OrgUserListComponent implements OnInit, AfterViewInit {
  public position;
  public showNormalModal;
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public orgLink;
  public paginatedContributorOrgUsers: any = [];
  public allContributorOrgUsers: any = [];
  public orgUserscnt = 0;
  public orgDetails: any = {};
  public showLoader = true;
  public impressionEventTriggered: Boolean = false;
  public contributorOrgUsers: any = [];
  public tempSortOrgUser: any = [];
  public direction = 'desc';
  public sortColumn = 'selectedRole';
  //public roles = [{ name: 'Reviewer', value: 'sourcing_reviewer'}, { name: 'Admin', value: 'sourcing_admin'}];
  public roles = [{ name: 'Reviewer', value: 'sourcing_reviewer'}];
  pager: IPagination;
  pageNumber = 1;
  pageLimit: any;
  userRegData: any = {};
  searchInput: any;
  initialSourcingOrgUser = [];
  searchLimitMessage: any;
  searchLimitCount: any;
  public telemetryPageId: string;
  constructor(private toasterService: ToasterService, public configService: ConfigService, private telemetryService: TelemetryService,
    private navigationHelperService: NavigationHelperService, public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router,
    public registryService: RegistryService, public programsService: ProgramsService, public cacheService: CacheService,
    private paginationService: PaginationService, private sourcingService: SourcingService
    ) {

    /*if (this.isSourcingOrgAdmin()) {
      this.getSourcingOrgUsers();
    } else {
      this.getContributionOrgUsers();
    }*/
    this.position = 'top center';
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
    ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : '';
    this.registryService.getOpenSaberOrgByOrgId(this.userService.userProfile).subscribe((res1) => {
      this.userRegData['Org'] = (_.get(res1, 'result.Org').length > 0) ? _.first(_.get(res1, 'result.Org')) : {};
      this.orgLink = `${baseUrl}/sourcing/join/${this.userRegData.Org.osid}`;
      this.getContributionOrgUsers();
    }, (error) => {
     console.log('No opensaber org for sourcing');
     const errInfo = {
      telemetryPageId: this.getPageId(),
      telemetryCdata : [{id: this.userService.channel, type: 'sourcing_organization'}],
      env : this.activatedRoute.snapshot.data.telemetry.env,
     };
     this.sourcingService.apiErrorHandling(error, errInfo);
   });
  }

  ngOnInit() {
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.searchLimitCount = this.registryService.searchLimitCount; // getting it from service file for better changing page limit
    this.pageLimit = this.registryService.programUserPageLimit;
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata,
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  setOrgUsers(orgUsersDetails) {
    this.allContributorOrgUsers = orgUsersDetails;

    if (!_.isEmpty(this.allContributorOrgUsers)) {
      this.orgUserscnt =  this.allContributorOrgUsers.length;
      this.sortCollection('selectedRole');
    }
    this.showLoader = false;
  }

  getContributionOrgUsers() {
    this.registryService.getcontributingOrgUsersDetails(this.userRegData, true).then((orgUsers) => {
      this.setOrgUsers(orgUsers);
    }).catch((error) => {
       console.log('Error while getting all users');
       const errInfo = {
        telemetryPageId: this.getPageId(),
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: this.userRegData
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }
  getUserDetailsBySearch(clearInput?) {
    clearInput ? this.searchInput = '' : this.searchInput;
    if (this.searchInput) {
      let filteredUser = this.registryService.getSearchedUserList(this.initialSourcingOrgUser, this.searchInput);
      filteredUser.length > this.searchLimitCount ? this.searchLimitMessage = true: this.searchLimitMessage = false;
      this.sortUsersList(filteredUser, true);
    } else {
      this.searchLimitMessage = false;
      this.sortUsersList(this.initialSourcingOrgUser, true);
    }
  }

  sortUsersList(usersList, isUserSearch?) {
     this.orgUserscnt = usersList.length;
     this.allContributorOrgUsers = this.programsService.sortCollection(usersList, this.sortColumn, this.direction);
     isUserSearch ? this.allContributorOrgUsers:  this.initialSourcingOrgUser =  this.allContributorOrgUsers
     usersList = _.chunk(this.allContributorOrgUsers, this.pageLimit);
     this.paginatedContributorOrgUsers = usersList;
     this.contributorOrgUsers = isUserSearch ? usersList[0] : usersList[this.pageNumber-1];
     this.logTelemetryImpressionEvent();
     this.pager = this.paginationService.getPager(this.orgUserscnt, isUserSearch ? 1 : this.pageNumber, this.pageLimit);
  }

  public logTelemetryImpressionEvent() {
    if (this.impressionEventTriggered) { return false; }
    this.impressionEventTriggered = true;
    const telemetryImpression = _.cloneDeep(this.telemetryImpression);
    telemetryImpression.edata.visits = _.map(this.contributorOrgUsers, (user) => {
      return { objid: user.identifier, objtype: 'user' };
    });
    this.telemetryService.impression(telemetryImpression);
  }


  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.contributorOrgUsers = this.paginatedContributorOrgUsers[this.pageNumber -1];
    this.pager = this.paginationService.getPager(this.orgUserscnt, this.pageNumber, this.pageLimit);
  }

  sortCollection(column) {
    this.sortUsersList(this.allContributorOrgUsers);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }
  setTelemetryForonRoleChange(user) {
    const edata =  {
      id: 'assign_role_by_sourcingOrg',
      type: this.configService.telemetryLabels.eventType.click,
      subtype: this.configService.telemetryLabels.eventSubtype.submit,
      pageid: this.telemetryPageId,
      extra : {values: [user.identifier, user.selectedRole]}
    };
     this.registryService.generateUserRoleUpdateTelemetry(this.activatedRoute.snapshot.data.telemetry.env,this.telemetryInteractCdata,this.telemetryInteractPdata, edata )
  }
  onRoleChange(user) {
    this.setTelemetryForonRoleChange(user);
    const selectedRole = _.get(user, 'selectedRole');
    const osid = _.get(user, 'User_Org.osid');
    // const org = this.userService.userProfile.userRegData.Org;

    this.updateUserRole(osid, selectedRole);

    /*
    // Already user in Open Saber so update the role directly
    if (!_.isUndefined(osid)) {
      this.updateUserRole(osid, selectedRole);
      return true;
    }

    // Get user's Open Saber profile
    this.registryService.openSaberRegistrySearch(user.identifier).then((userProfile) => {
      console.log('userProfile', userProfile);

      if (!_.isEmpty(_.get(userProfile, 'user'))) {
        this.saveUserOrgMapping(userProfile, selectedRole, user);
        return true;
      }
      // If user is not in open saber then create one
      const userAdd = {
        User: {
          firstName: this.userService.userProfile.firstName,
          lastName: this.userService.userProfile.lastName || '',
          userId: this.userService.userProfile.identifier,
          enrolledDate: new Date().toISOString(),
          board : org.board,
          medium: org.medium,
          gradeLevel: org.gradeLevel,
          subject: org.subject
        }
      };

      this.programsService.addToRegistry(userAdd).subscribe((res) => {
        this.saveUserOrgMapping(userProfile, selectedRole, user);
      }, (error) => {console.log('error: ', error)});
    }); */
  }

  /*saveUserOrgMapping(userProfile, selectedRole, user) {
    // User have org then update te role
    if (!_.isEmpty(_.get(userProfile, 'user_org'))) {
      const osid = _.get(userProfile, 'user_org.osid');
      this.updateUserRole(osid, selectedRole);
      return true;
    }

    // If user is not associated with org then add him with selected role
    let userOrgAdd = {
      User_Org: {
        userId: _.get(userProfile, 'user.osid'),
        orgId: _.get(this.userService, 'userProfile.userRegData.Org.osid'),
        roles: [selectedRole]
      }
    };

    this.programsService.addToRegistry(userOrgAdd).subscribe(
      (userAddRes) => {
        console.log("User added to org"+ user.identifier, userAddRes);
        this.toasterService.success(this.resourceService.messages.smsg.m0065);
        this.cacheService.remove('orgUsersDetails');
        return true;
      },
      (userAddErr) => {
        console.log("Errro while adding User added to org"+ user.identifier,userAddErr);
        this.toasterService.error(this.resourceService.messages.emsg.m0077);
        return false;
      }
    );
  }*/

  updateUserRole(osid, role) {
    this.programsService.updateUserRole(osid, [role]).subscribe(
      (res) => {
        this.toasterService.success(this.resourceService.messages.smsg.m0065);
        this.cacheService.remove('orgUsersDetails');
      },
      (error) => {
        console.log(error);
        const errInfo = {
          errorMsg: this.resourceService.messages.emsg.m0077,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
          request: {'id': osid, role: role}
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      }
    );
  }

  copyOnLoad() {
    this.showNormalModal = true;
    setTimeout(() => {
      this.copyLinkToClipboard();
    }, 300);
  }

  copyLinkToClipboard() {
    if (!this.orgLink) {
      this.toasterService.error(this.resourceService.messages.emsg.invite.user.m0001);
      this.showNormalModal = false;
      return ;
    }
    if (this.showNormalModal) {
      const input = document.getElementById('copyLinkData') as HTMLInputElement;
      input.select();
      input.focus();
      document.execCommand('copy');
    }
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string,  pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }
}
