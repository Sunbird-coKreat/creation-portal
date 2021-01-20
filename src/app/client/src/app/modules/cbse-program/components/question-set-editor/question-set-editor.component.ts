import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { IUserProfile, ConfigService } from '@sunbird/shared';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-question-set-editor',
  templateUrl: './question-set-editor.component.html',
  styleUrls: ['./question-set-editor.component.scss']
})
export class QuestionSetEditorComponent implements OnInit {

  @Input() questionSetEditorComponentInput: any;
  @Input() pageView;
  editorConfig: any;
  editorParams: any;
  private userProfile: IUserProfile;
  private deviceId: string;
  private buildNumber: string;
  private portalVersion: string;
  showLoader = true;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private telemetryService: TelemetryService, private configService: ConfigService) {
      const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    this.deviceId = deviceId ? deviceId.value : '';
    this.buildNumber = buildNumber ? buildNumber.value : '1.0';
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    this.editorParams = {
      collectionId: _.get(this.activatedRoute, 'snapshot.params.questionSetId'),
    };
  }

  ngOnInit() {
    console.log('pageView', this.pageView);
    this.setEditorContext();
  }

  private setEditorContext() {
    this.editorConfig = {
      context: {
        identifier: _.get(this.questionSetEditorComponentInput, 'identifier'),
        mode: 'create',
        sid: this.userService.sessionId,
        did: this.deviceId,
        uid: this.userService.userid,
        channel: this.userService.channel,
        pdata: {
          id: this.userService.appId,
          ver: this.portalVersion,
          pid: this.configService.appConfig.TELEMETRY.PID
        },
        // contextRollUp: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
        contextRollUp: {},
        tags: this.userService.dims,
        cdata: [],
        timeDiff: this.userService.getServerTimeDiff,
        objectRollup: {},
        host: '',
        endpoint: '/data/v3/telemetry',
        // defaultLicense: this.frameworkService.getDefaultLicense(),
        // framework: this.routeParams.framework,
        env: 'question_set',
        userData: {
          firstName: '',
          lastName: ''
        }
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
