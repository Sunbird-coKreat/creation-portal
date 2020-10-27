import { Injectable } from '@angular/core';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';


@Injectable({
  providedIn: 'root'
})
export class ProgramTelemetryService {

  constructor( public userService: UserService, public configService: ConfigService ) { }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }
  getTelemetryInteractPdata(id?: string, pid?: string) {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    return {
      id,
      ver: version,
      pid
    };
  }
  getTelemetryInteractObject(id: string, type: string, ver: string, rollup?: any): IInteractEventObject {
    return _.omitBy({
      id, type, ver, rollup
    }, _.isUndefined);
  }
  getTelemetryInteractCdata(id: string, type: string) {
    return [{
      type, id
    }];
  }
}
