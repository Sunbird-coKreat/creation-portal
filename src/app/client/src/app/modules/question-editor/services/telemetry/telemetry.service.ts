import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import { IEditorConfig, Context } from '../../interfaces/editor';
import { HelperService } from '../helper/helper.service';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class EditorTelemetryService {
  duration: number;
  channel: string;
  telemetryEvent = new EventEmitter<any>();
  private context: Context;
  private telemetryObject: any;
  private pdata: any;
  private sid: string;
  private uid: string;
  private rollup: any;
  private env: string;
  // tslint:disable-next-line:variable-name
  private _telemetryPageId: any;

  constructor( public helperService: HelperService, public configService: ConfigService ) {}

  initializeTelemetry(config: IEditorConfig) {
    this.duration = new Date().getTime();
    this.context = config.context;
    this.channel = config.context.channel;
    this.pdata = this.context.pdata;
    this.sid =  this.context.sid;
    this.uid =  this.context.uid;
    this.env =  this.context.env;
    this.pdata.pid = `${this.context.pdata.pid}.${this.env}`;
    this.rollup = this.context.contextRollup;
    if (!CsTelemetryModule.instance.isInitialised) {
      CsTelemetryModule.instance.init({});
      CsTelemetryModule.instance.telemetryService.initTelemetry(
        {
          config: {
            pdata: config.context.pdata,
            env: config.context.env,
            channel: config.context.channel,
            did: config.context.did,
            authtoken: config.context.authToken || '',
            uid: config.context.uid || '',
            sid: config.context.sid,
            batchsize: 20,
            mode: config.context.mode,
            host: config.context.host || document.location.origin,
            endpoint: config.context.endpoint || _.get(this.configService.urlConFig, 'URLS.telemetry'),
            tags: config.context.tags,
            cdata: this.context.cdata || []
          },
          userOrgDetails: {}
        }
      );
    }

    this.telemetryObject = {
      id: config.context.identifier,
      type: 'Content',
      ver: '1.0', // TODO :: config.metadata.pkgVersion + ''
      rollup: this.context.objectRollup || {}
    };
  }

  set telemetryPageId(value: any) {
    this._telemetryPageId = value;
  }

  get telemetryPageId() {
    return this._telemetryPageId;
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any) {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  public start(edata) {
    CsTelemetryModule.instance.telemetryService.raiseStartTelemetry(
      {
        options: this.getEventOptions(),
        edata
      }
    );
  }
  public end(edata) {
    CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
      edata,
      options: this.getEventOptions()
    });
  }

  public interact(eventData) {
    CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
      options: this.getEventOptions(),
      edata: eventData.edata
    });
  }


  public impression(edata) {
    CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
      options: this.getEventOptions(),
      edata
    });
  }

  public error(edata) {
    CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
      edata
    });
  }

  public getEventOptions() {
    return ({
      object: this.telemetryObject,
      context: {
        channel: this.channel,
        pdata: this.pdata,
        env: this.env,
        sid: this.sid,
        uid: this.uid,
        cdata: this.context.cdata || [],
        rollup: this.rollup || {}
      }
    });
  }

}
