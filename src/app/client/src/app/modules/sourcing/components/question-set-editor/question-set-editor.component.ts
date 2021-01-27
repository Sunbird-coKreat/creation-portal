import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, FrameworkService } from '@sunbird/core';
import { IUserProfile, ConfigService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-question-set-editor',
  templateUrl: './question-set-editor.component.html',
  styleUrls: ['./question-set-editor.component.scss']
})
export class QuestionSetEditorComponent implements OnInit {

  editorConfig: any;
  editorParams: any;
  private userProfile: IUserProfile;
  private deviceId: string;
  private buildNumber: string;
  private portalVersion: string;
  showLoader = true;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private telemetryService: TelemetryService, private configService: ConfigService,
    private frameworkService: FrameworkService
    ) {
      const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
      const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
      this.deviceId = deviceId ? deviceId.value : '';
      this.buildNumber = buildNumber ? buildNumber.value : '1.0';
      this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
      this.editorParams = {
        questionSetId: _.get(this.activatedRoute, 'snapshot.params.questionSetId'),
      };
     }

  ngOnInit() {
    this.userProfile = this.userService.userProfile;
    this.setEditorContext();
  }

  private setEditorContext() {
    this.editorConfig = {
      context: {
        user: {
          id: this.userService.userid,
          name : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.firstName + ' ' + this.userProfile.lastName :
          this.userProfile.firstName,
          orgIds: this.userProfile.organisationIds,
          organisations: this.userService.orgIdNameMap
        },
        identifier: this.editorParams.questionSetId,
        mode: 'edit',
        authToken: '',
        sid: this.userService.sessionId,
        did: this.deviceId,
        uid: this.userService.userid,
        channel: this.userService.channel,
        pdata: {
          id: this.userService.appId,
          ver: this.portalVersion,
          pid: this.configService.appConfig.TELEMETRY.PID
        },
        contextRollUp: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
        tags: this.userService.dims,
        cdata: [],
        timeDiff: this.userService.getServerTimeDiff,
        objectRollup: {},
        host: '',
        defaultLicense: this.frameworkService.getDefaultLicense(),
        endpoint: '/data/v3/telemetry',
        userData: {
          firstName: '',
          lastName: ''
        },
        env: 'question_set',
        framework: 'ekstep_ncert_k-12',
        aws_s3_urls : this.userService.cloudStorageUrls ||
        ['https://s3.ap-south-1.amazonaws.com/ekstep-public-qa/', 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/',
        'https://dockstorage.blob.core.windows.net/sunbird-content-dock/']
      }
    };
    if (!_.isUndefined(this.userService.userProfile.firstName) && !_.isNull(this.userService.userProfile.firstName)) {
      this.editorConfig.context.userData.firstName = this.userService.userProfile.firstName;
    }
    if (!_.isUndefined(this.userService.userProfile.lastName) && !_.isNull(this.userService.userProfile.lastName)) {
      this.editorConfig.context.userData.lastName = this.userService.userProfile.lastName;
    }
    this.showLoader = false;
  }
}
