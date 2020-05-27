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
  public roles = [{ name: 'User', value: 'user'}, { name: 'Admin', value: 'admin'}];
  pager: IPagination;
  pageNumber = 1;
  pageLimit = 200;

  constructor(private toasterService: ToasterService, private configService: ConfigService,
    private navigationHelperService: NavigationHelperService, public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router,
    public registryService: RegistryService, public programsService: ProgramsService, public cacheService: CacheService,
    private paginationService: PaginationService ) {
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
    this.registryService.getcontributingOrgUsersDetails().then((orgUsers) => {
      this.allContributorOrgUsers = orgUsers;
      //this.tempSortOrgUser = orgUsers;
      if (!_.isEmpty(this.allContributorOrgUsers) && this.allContributorOrgUsers.length > 0) {
        this.orgUserscnt =  this.allContributorOrgUsers.length;
        this.sortCollection('selectedRole');
      }

      this.showLoader = false;
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
