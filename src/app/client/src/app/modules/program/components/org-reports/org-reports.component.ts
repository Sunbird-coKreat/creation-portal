import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService} from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { UsageService } from '@sunbird/dashboard';
import { IImpressionEventInput} from '@sunbird/telemetry';
import { ProgramTelemetryService } from '../../../program/services';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-org-reports',
  templateUrl: './org-reports.component.html',
  styleUrls: ['./org-reports.component.scss']
})
export class OrgReportsComponent implements OnInit, AfterViewInit {

  public reportsLocation: string;
  public slug: string;
  public reportFormat = '.csv';
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;

  constructor( public resourceService: ResourceService, private userService: UserService, private configService: ConfigService,
    private usageService: UsageService, private toasterService: ToasterService, private activatedRoute: ActivatedRoute,
    private router: Router, private navigationHelperService: NavigationHelperService,
    public programTelemetryService: ProgramTelemetryService) {}

  ngOnInit() {
    this.reportsLocation = (<HTMLInputElement>document.getElementById('reportsLocation')).value;
    this.slug = _.get(this.userService, 'userProfile.rootOrg.slug');
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

  downloadReport(reportName: string) {
    const filepath = `/${this.reportsLocation}/${this.slug}/${reportName}${this.reportFormat}`;
    this.usageService.getData(filepath).subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        const url = _.get(response, 'result.signedUrl');
        if (url) { window.open(url, '_blank'); }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0076);
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0076);
    });
  }

}
