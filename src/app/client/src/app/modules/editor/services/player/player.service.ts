import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { UserService, ContentService} from '@sunbird/core';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private userService: UserService, public contentService: ContentService,
    public configService: ConfigService) { }

  /**
   * returns player config details.
   */
  getConfig() {
    const configuration: any = {
      context: {},
      metadata: {contentData: []},
      data: {}
    };
    configuration.context.mode = 'edit';
    configuration.context.sid = this.userService.sessionId;
    configuration.context.uid = this.userService.userid;
    configuration.context.timeDiff = this.userService.getServerTimeDiff;
    configuration.context.contextRollup = this.getRollUpData(this.userService.userProfile.hashTagIds);
    configuration.context.channel = this.userService.channel;
    configuration.context.cdata = {};
    configuration.context.pdata = {};
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    configuration.context.did = deviceId ? deviceId.value : '';
    const tags = [];
    _.forEach(this.userService.userProfile.organisations, (org) => {
      if (org.hashTagId) {
        tags.push(org.hashTagId);
      }
    });
    configuration.context.tags = tags;
    configuration.context.app = [this.userService.channel];
    // configuration.context.host = '';
    // configuration.context.endpoint = '/data/v3/telemetry';
    configuration.context.userData = {};
    configuration.context.userData.firstName = '';
    configuration.context.userData.lastName = '';
    if (!_.isUndefined(this.userService.userProfile.firstName)) {
      configuration.context.userData.firstName = this.userService.userProfile.firstName;
    }
    if (!_.isUndefined(this.userService.userProfile.lastName)) {
      configuration.context.userData.lastName = this.userService.userProfile.lastName;
    }
    return configuration;
  }

  /**
   *
   *
   * @private
   * @param {Array<string>} [data=[]]
   * @returns
   * @memberof TelemetryService
   */
  private getRollUpData(data: Array<string> = []) {
    const rollUp = {};
    data.forEach((element, index) => rollUp['l' + (index + 1)] = element);
    return rollUp;
  }
}
