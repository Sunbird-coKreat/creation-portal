import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToasterService, ResourceService, NavigationHelperService, ConfigService, PaginationService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IPagination} from '../../../cbse-program/interfaces';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService, RegistryService, ProgramsService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-org-user-list',
  templateUrl: './org-user-list.component.html',
  styleUrls: ['./org-user-list.component.scss']
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
  public contributorOrgUsers: any = [];
  public tempSortOrgUser: any = [];
  public direction = 'asc';
  public sortColumn = '';
  //public roles = [{ name: 'Reviewer', value: 'sourcing_reviewer'}, { name: 'Admin', value: 'sourcing_admin'}];
  public roles = [{ name: 'Reviewer', value: 'sourcing_reviewer'}];
  pager: IPagination;
  pageNumber = 1;
  pageLimit = 250;

  constructor(private toasterService: ToasterService, private configService: ConfigService,
    private navigationHelperService: NavigationHelperService, public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router,
    public registryService: RegistryService, public programsService: ProgramsService, public cacheService: CacheService,
    private paginationService: PaginationService ) {

    /*if (this.isSourcingOrgAdmin()) {
      this.getSourcingOrgUsers();
    } else {
      this.getContributionOrgUsers();
    }*/
    this.getContributionOrgUsers();
  }

  ngOnInit() {
    this.position = 'top center';
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
      ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : '';
    this.orgLink = `${baseUrl}/sourcing/join/${this.userService.userProfile.userRegData.Org.osid}`;
    this.telemetryInteractCdata = [{id: this.userService.userProfile.rootOrgId || '', type: 'Organisation'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{ 'type': 'Organisation', 'id': this.userService.userProfile.rootOrgId || '' }];
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
          pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
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
    this.registryService.getcontributingOrgUsersDetails(true).then((orgUsers) => {
      this.setOrgUsers(orgUsers);
    });
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
    this.allContributorOrgUsers = this.programsService.sortCollection(this.allContributorOrgUsers, column, this.direction);
    this.paginatedContributorOrgUsers = _.chunk( this.allContributorOrgUsers, this.pageLimit);
    this.contributorOrgUsers = this.paginatedContributorOrgUsers[this.pageNumber-1];
    this.pager = this.paginationService.getPager(this.orgUserscnt, this.pageNumber, this.pageLimit);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  onRoleChange(user) {
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
        this.toasterService.error(this.resourceService.messages.emsg.m0077);
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

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }
}
