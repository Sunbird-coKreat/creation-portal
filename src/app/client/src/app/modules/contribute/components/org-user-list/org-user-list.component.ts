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
    if (this.isSourcingOrgAdmin) {
      this.getSourcingOrgUsers();
    } else {
      this.getContributionOrgUsers();
    }
  }
  
  ngOnInit() {
    this.position = 'top center';
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
      ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : '';
    this.orgLink = `${baseUrl}/contribute/join/${this.userService.userProfile.userRegData.Org.osid}`;
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
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }
  
  isSourcingOrgAdmin() {
    return this.userService.userProfile.userRoles.includes('ORG_ADMIN');
  }

  getSourcingOrgUsers() {
    const userRegData = _.get(this.userService, 'userProfile.userRegData');
    const sourcingOrgId = _.get(this.userService, 'userProfile.organisations[0].organisationId');
    const filters = {
      'organisations.organisationId': sourcingOrgId,
      'organisations.roles': ['CONTENT_REVIEWER', 'CONTENT_CREATOR']
      };
    this.programsService.getSourcingOrgUsers(filters).subscribe((res) => {
      const sourcingOrgUsers =  _.get(res, 'result.response.content');
      
      if (!_.isEmpty(sourcingOrgUsers)) {
        const storedOrglist = this.cacheService.get('orgUsersDetails');
        const orgId = _.get(this.userService, 'userProfile.userRegData.Org.osid');
        
        this.registryService.getAllContributionOrgUsers(orgId)
        .then((allOrgUsers) => {

          console.log("sourcingOrgUsers:", sourcingOrgUsers);
          console.log("===================");
          console.log('allOrgUsers:', allOrgUsers);
          console.log("===================");
          
          if (!_.isEmpty(allOrgUsers)) {
            let userList = [];
            let userOsIds = [];
            // Remove currently logged in user
            const users = _.filter(allOrgUsers, obj => { 
              if (obj.userId !== userRegData.User.userId) { 
                userList.push(obj.userId);
                userOsIds.push(obj.osid);
                return obj;
              }
            });

            userList = _.uniq(userList);
            userOsIds = _.uniq(userOsIds);
            console.log('userList:', userList);
            console.log("===================");
            console.log('userOsIds:', userOsIds);
            console.log("===================");

            if (userList.length == 0) {
              this.allContributorOrgUsers = [];
              return false;
            }

            if (userList && storedOrglist && userList.length === storedOrglist.length) {
              this.allContributorOrgUsers = this.cacheService.get('orgUsersDetails');
              return false;
            }
            
            console.log('users:', users.map(a => a.userId));
            console.log('sourcingOrgUsers:', sourcingOrgUsers.map(a => a.identifier));

            let orgUsersDetails = _.map(users, (obj) => {
              const newObj = {};
              const tempUserObj = _.find(sourcingOrgUsers, { 'identifier': obj.userId });

              console.log('obj:', obj);
              console.log('tempUserObj:', tempUserObj);

              if (tempUserObj) {
                newObj["name"] = `${tempUserObj.firstName} ${tempUserObj.lastName || ''}`;
                newObj["User"] = tempUserObj;
                newObj["User_Org"] = obj;
                newObj["selectedRole"] = _.first(obj.roles);

                console.log('newObj:', newObj);
                return newObj;
              }
            });
return;
            this.cacheService.set('orgUsersDetails', _.compact(orgUsersDetails));
            this.allContributorOrgUsers = this.cacheService.get('orgUsersDetails');

            this.orgUserscnt =  this.allContributorOrgUsers.length;
            return true;
          }
          
          this.allContributorOrgUsers = [];
          return false;
        });
      }

      // this.allContributorOrgUsers = sourcingOrgUsers;
      // this.orgUserscnt =  sourcingOrgUsers.length;
      // _.forEach(sourcingOrgUsers, (user) => {
      //   console.log("user:", user);
      // });
    }, (err) => {
      console.log('error:', err);
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

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }
}
