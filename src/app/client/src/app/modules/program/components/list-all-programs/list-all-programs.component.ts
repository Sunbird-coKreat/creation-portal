import { ResourceService, ConfigService, ServerResponse, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-list-all-programs',
  templateUrl: './list-all-programs.component.html',
  styleUrls: ['./list-all-programs.component.scss']
})
export class ListAllProgramsComponent implements OnInit, AfterViewInit {
  public telemetryImpression: IImpressionEventInput;
  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService,
    public userService: UserService, public tosterService: ToasterService) { }

  ngOnInit() {
    if (!this.programsService.sourcingOrgReviewers) {
      if (this.userService.userProfile.organisations && this.userService.userProfile.organisations.length) {
        const OrgDetails = this.userService.userProfile.organisations[0];
        const filters = {
              'organisations.organisationId': OrgDetails.organisationId,
              'organisations.roles': ['CONTENT_REVIEWER']
              };
      // tslint:disable-next-line:max-line-length
      this.programsService.getSourcingOrgUsers(filters).subscribe((res) => {}, (err) => {
        this.tosterService.error(this.resourceService.messages.emsg.organisation.m0001);
      });
      } else {
        this.tosterService.error(this.resourceService.messages.emsg.organisation.m0002);
      }
    }
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.config.appConfig.TELEMETRY.PID
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
}
