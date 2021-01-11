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
      context: {}
    };
    configuration.context['mode'] = this.configService.appConfig.PLAYER_CONFIG.playerConfig.context.mode;
    configuration.context['sid'] = this.userService.sessionId;
    configuration.context['uid'] = this.userService.userid;
    configuration.context['timeDiff'] = this.userService.getServerTimeDiff;
    configuration.context['contextRollup'] = this.getRollUpData(this.userService.userProfile.hashTagIds);
    configuration.context['channel'] = this.userService.channel;
    configuration.context['cdata'] = [];
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    configuration.context['did'] = deviceId ? deviceId.value : '';
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    configuration.context['pdata'] = this.configService.appConfig.PLAYER_CONFIG.playerConfig.context.pdata;
    configuration.context.pdata.ver = buildNumber && buildNumber.value ?
    buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const tags = [];
    _.forEach(this.userService.userProfile.organisations, (org) => {
      if (org.hashTagId) {
        tags.push(org.hashTagId);
      }
    });
    configuration.context['tags'] = tags;
    configuration.context['app'] = [this.userService.channel];
    configuration.context.pdata.id = this.userService.appId;
    configuration.context['host'] = '/data/v3/telemetry';
    // if (_.has(this.userService._userProfile, 'firstName')) {
    //   configuration.context.userData.firstName = this.userService._userProfile.firstName;
    // }
    // if (_.has(this.userService._userProfile, 'lastName')) {
    //   configuration.context.userData.lastName = this.userService._userProfile.lastName;
    // }
    configuration.context['userData'] = {};
    configuration.context['userData']['firstName'] = 'John';
    configuration.context['userData']['lastName'] = 'Doe';
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
