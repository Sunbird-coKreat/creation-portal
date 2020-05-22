import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToasterService, ResourceService, NavigationHelperService, ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
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
  public contributorOrgUser: any = [];
  public orgDetails: any = {};
  public showLoader = true;
  public contributorOrgUsers: any = [];
  public tempSortOrgUser: any = [];
  public direction = 'asc';
  public sortColumn = '';
  public totalPages: number;
  public usersPerPage = 200;
  public currentPage: number;
  public totalUsers: number;
  public allUsersList: any = [];
  public tableLoader = false;
  public disablePagination = {};
  public pageNumArray: Array<number>;
  public  offset = 0;
  public limit = 200;
  public roles = [{ name: 'User', value: 'user'}, { name: 'Admin', value: 'admin'}];

  constructor(private toasterService: ToasterService, private configService: ConfigService,
    private navigationHelperService: NavigationHelperService, public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router,
    public registryService: RegistryService, public programsService: ProgramsService, public cacheService: CacheService ) {
      this.getContributionOrgUsers();
    }

  ngOnInit() {
    this.position = 'top center';
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
      ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : '';
    this.orgLink = `${baseUrl}/contribute/join/${this.userService.userProfile.userRegData.Org.osid}`;
    this.telemetryInteractCdata = [{id: this.userService.userProfile.rootOrgId || '', type: 'Organisation_id'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{ 'type': 'Organisation_id', 'id': this.userService.userProfile.rootOrgId || '' }];
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
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  getContributionOrgUsers() {
    this.registryService.getcontributingOrgUsersDetails(this.offset, this.limit).then((orgUsers: any) => {
      if (orgUsers && orgUsers.length > 0) {
        this.offset = this.offset + this.limit;
        this.limit = this.limit + 200;
        this.allUsersList = _.concat(this.allUsersList, orgUsers);
        this.getContributionOrgUsers();
      } else {
        this.currentPage = 1;
        this.totalUsers = this.allUsersList.length;
        this.totalPages = Math.ceil(this.totalUsers / this.usersPerPage);
        this.getPaginatedUsers(0);
        this.handlePageNumArray();
        this.disablePaginationButtons();
      }
    });
  }

  getPaginatedUsers(offset) {
      this.contributorOrgUsers = this.allUsersList.slice(offset, offset + this.usersPerPage );
      this.tempSortOrgUser = this.contributorOrgUsers;
      if (!_.isEmpty(this.contributorOrgUsers) && this.contributorOrgUsers.length > 0) {
        this.direction = 'asc';
        this.sortCollection('selectedRole');
      }
      this.showLoader = false;
  }

  navigatePage(pageNum) {
    switch (pageNum) {
      case 'first':
        this.currentPage = 1;
        break;
      case 'last':
        this.currentPage = this.totalPages;
        break;
      case 'prev':
        this.currentPage = this.currentPage - 1;
        break;
      case 'next':
        this.currentPage = this.currentPage + 1;
        break;
      default:
        this.currentPage = pageNum;
    }
    this.handlePagination(this.currentPage);
}

handlePagination(pageNum) {
  const offset = (pageNum - 1) * this.usersPerPage;
  this.showLoader = true;
  this.getPaginatedUsers(offset);
  this.handlePageNumArray();
  this.disablePaginationButtons();
  }

  disablePaginationButtons() {
    this.disablePagination = {};
    if (this.currentPage === 1) {
      this.disablePagination['first'] = true;
      this.disablePagination['prev'] = true;
    }
    if (this.currentPage === this.totalPages) {
     this.disablePagination['last'] = true;
     this.disablePagination['next'] = true;
    }
   }

   handlePageNumArray() {
    if ((this.currentPage + 5) >= (this.totalPages + 1)) {
      const initValue = this.totalPages - 4 <= 0 ? 1 : this.totalPages - 4;
      this.pageNumArray = _.range(initValue , (this.totalPages + 1));
    } else {
      this.pageNumArray = _.range(this.currentPage, (this.currentPage + 5));
      }
    }

  sortCollection(column) {
    this.contributorOrgUsers = this.programsService.sortCollection(this.tempSortOrgUser, column, this.direction);
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

    this.programsService.updateUserRole(osid, [selectedRole]).subscribe(
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

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }
}
