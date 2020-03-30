import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToasterService, ResourceService, NavigationHelperService, ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService, ProgramsService } from '@sunbird/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-org-user-list',
  templateUrl: './org-user-list.component.html',
  styleUrls: ['./org-user-list.component.scss']
})
export class OrgUserListComponent implements OnInit, AfterViewInit {
  data;
  options;
  showNormalModal;
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  orgLink;
  orgName;
  public userLists: any;

  constructor(private toasterService: ToasterService, private configService: ConfigService,
    private navigationHelperService: NavigationHelperService, public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router, private programsService: ProgramsService) { }

  ngOnInit() {

    this.data = {
      'board': [{
          'name': 'admin',
          'value': 'Admin'
      }, {
          'name': 'reviewer',
          'value': 'Reviewer'
      }]
    };
  this.telemetryInteractCdata = [{id: this.userService.userProfile.rootOrgId || '', type: 'Organisation_id'}];
  this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
  this.telemetryInteractObject = {};
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
      ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : '';
    this.orgLink = `${baseUrl}/contribute/join/${this.userService.userProfile.userRegData.Org.osid}`;
    this.orgName = this.userService.userProfile.userRegData.Org.name;
    this.searchUser()
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

  copyLinkToClipboard() {
    if (!this.orgLink) {
      this.toasterService.error(this.resourceService.messages.emsg.invite.user.m0001);
      this.showNormalModal = false;
      return ;
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.orgLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toasterService.success(this.resourceService.frmelmnts.lbl.linkCopied);
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }
  searchUser()
  {
    const orgSearch = {
      entityType: ["User_Org"],
      filters: {
        orgId: {eq :this.userService.userProfile.userRegData.User_Org.orgId}
      }
    };
    this.programsService.searchRegistry(orgSearch).subscribe(
      (response) => {
        if (!_.isEmpty(response.result.User_Org)) {
          this.fetchUserData(response.result.User_Org)
        }
      },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || this.resourceService.messages.fmsg.contributorjoin.m0001);
      }
    );
  }

  fetchUserData(data)
  {
    if(!_.isEmpty(data))
    {
      const userList = [];
      _.forEach(data, (userID) => {
        const userSearch = {
          entityType: ["User"],
          filters: {
            osid: {eq : userID.userId }
          }
        };

        this.programsService.searchRegistry(userSearch).subscribe(
          (response) => {
            if (!_.isEmpty(response.result.User[0])) {
              userList.push(response.result.User[0]);
            }
          },
          (err) => {
            const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
            this.toasterService.warning(errorMes || this.resourceService.messages.fmsg.contributorjoin.m0001);
          }
        );
      });
      this.userLists = userList;
      console.log(this.userLists)
      //return userList;
      }
  }

}
