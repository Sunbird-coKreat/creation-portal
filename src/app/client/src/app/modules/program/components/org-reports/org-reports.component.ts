import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService} from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { UsageService } from '@sunbird/dashboard';
import { IImpressionEventInput} from '@sunbird/telemetry';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { ProgramTelemetryService } from '../../../program/services';
import * as _ from 'lodash-es';
import { SourcingService } from '../../../sourcing/services';

@Component({
  selector: 'app-org-reports',
  templateUrl: './org-reports.component.html',
  styleUrls: ['./org-reports.component.scss']
})
export class OrgReportsComponent implements OnInit, AfterViewInit {

  public reportsLocation: string;
  public slug: string;
  public reportFormat = '.csv';
  public reportPrefix = 'sourcing';
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;
  public instance: string;
  public collectionLevelReportGapDescription: string;
  public folderLevelReportGapDescription: string;
  public visitorsReportDescription: string;
  public projectLevelFunnelReportDescription: string;
  public contentDetailsReportDescription: string;

  constructor( public resourceService: ResourceService, private userService: UserService, public configService: ConfigService,
    private usageService: UsageService, private toasterService: ToasterService, private activatedRoute: ActivatedRoute,
    private router: Router, private navigationHelperService: NavigationHelperService,
    public programTelemetryService: ProgramTelemetryService, private sourcingService: SourcingService) {}

    ngOnInit() {
      this.userService.userData$.subscribe(user =>{
        this.slug = _.get(user, 'userProfile.rootOrg.slug');
      });
      this.reportsLocation = (<HTMLInputElement>document.getElementById('reportsLocation')).value;
      this.telemetryInteractCdata = [{id: this.userService.channel || '', type: 'sourcing_organization'}];
      this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
      this.telemetryInteractObject = {};

      this.instance = this.resourceService.instance;
      this.collectionLevelReportGapDescription = this.resourceService.frmelmnts.lbl.collectionLevelReportGapDescription.replaceAll('{instance}', this.instance);

      this.folderLevelReportGapDescription = this.resourceService.frmelmnts.lbl.folderLevelReportGapDescription.replaceAll('{instance}', this.instance);

      this.visitorsReportDescription = this.resourceService.frmelmnts.lbl.visitorsReportDescription.replaceAll('{instance}', this.instance);

      this.projectLevelFunnelReportDescription = this.resourceService.frmelmnts.lbl.projectLevelFunnelReportDescription.replaceAll('{instance}', this.instance);

      this.contentDetailsReportDescription = this.resourceService.frmelmnts.lbl.contentDetailsReportDescription.replaceAll('{instance}', this.instance);
    }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{id: this.userService.channel || '', type: 'sourcing_organization'}];
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

  downloadReport(reportName: string, isSourcingPrefix: boolean) {
    let filepath;
    if (isSourcingPrefix) {
      filepath = `/${this.reportsLocation}/${this.reportPrefix}/${this.slug}/${reportName}${this.reportFormat}`;
    } else {
      filepath = `/${this.reportsLocation}/${this.slug}/${reportName}${this.reportFormat}`;
    }
    this.usageService.getData(filepath).subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        const url = _.get(response, 'result.signedUrl');
        if (url) { window.open(url, '_blank'); }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0076);
      }
    }, (err) => {
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.m0076,
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env
      };
      this.sourcingService.apiErrorHandling(err, errInfo);
    });
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }


}
