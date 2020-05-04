import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ToasterService, ResourceService, NavigationHelperService, ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { OrgUsersListComponent } from '../../../shared-feature/components/org-users-list/org-users-list.component';


@Component({
  selector: 'app-org-user-list',
  templateUrl: './org-user-list.component.html',
  styleUrls: ['./org-user-list.component.scss']
})
export class OrgUserListComponent implements OnInit, AfterViewInit {
  @ViewChild(OrgUsersListComponent) childUserListComponent;
  data;
  position;
  options;
  showNormalModal;
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  orgLink;
  public userLists: any;
  public contributorOrgUser: any = [];
  public orgDetails: any = {};
  public showLoader = true;
  count = 0;
  isShowCountFromChild = false;

  constructor(private toasterService: ToasterService, private configService: ConfigService,
    private navigationHelperService: NavigationHelperService, public resourceService: ResourceService,
    private activatedRoute: ActivatedRoute, public userService: UserService, private router: Router) { }

  ngOnInit() {
    this.position = 'top center';
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

  ngDoCheck() {
    if (this.count === this.childUserListComponent.contributorOrgUser.length) {
    } else {
      if (this.childUserListComponent.showLoader === false) {
        this.count = this.childUserListComponent.contributorOrgUser.length;
      }
    }
    this.showLoader = this.childUserListComponent.showLoader;
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
    console.log(this.showNormalModal);

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
