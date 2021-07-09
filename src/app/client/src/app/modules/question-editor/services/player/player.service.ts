import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
import { EditorService } from '../../services/editor/editor.service';

interface PlayerConfig {
  config: any;
  context: any;
  data: any;
  metadata: any;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  qumlPlayerSideMenuConfig = {
    showShare: true,
    showDownload: true,
    showReplay: true,
    showExit: false,
  };
  constructor(private editorService: EditorService, private configService: ConfigService) { }

  /**
   * returns QUML player config details.
   */
  getQumlPlayerConfig() {
    const configuration: any = _.cloneDeep(this.editorService.editorConfig);
    configuration.context.userData = { firstName: configuration.context.user.firstName, lastName: configuration.context.user.lastName },
    configuration.config = {...configuration.config, sideMenu : this.qumlPlayerSideMenuConfig };
    configuration.context.mode = 'play';
    configuration.metadata = {};
    configuration.data = {};
    return configuration;
  }

  /**
   * returns player config details.
   */
   getPlayerConfig(contentDetails): PlayerConfig {
    const configuration: any = _.cloneDeep(_.get(this.configService.playerConfig, 'playerConfig'));
    configuration.context.contentId = contentDetails.contentId;
    configuration.context.sid = _.get(this.editorService.editorConfig, 'context.sid');
    configuration.context.uid = _.get(this.editorService.editorConfig, 'context.uid');
    configuration.context.timeDiff = _.get(this.editorService.editorConfig, 'context.timeDiff');
    configuration.context.contextRollup = _.get(this.editorService.editorConfig, 'context.contextRollup');
    // this.getRollUpData(this.userService.userProfile.hashTagIds);
    configuration.context.channel = _.get(this.editorService.editorConfig, 'context.channel');
    // const deviceId = (<HTMLInputElement asdocument.getElementById('deviceId'));
    configuration.context.did = _.get(this.editorService.editorConfig, 'context.did');
    // const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    // configuration.context.pdata.ver = buildNumber && buildNumber.value ?
    // buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    configuration.context.pdata.ver = 1.0;
    if (_.isUndefined(contentDetails.courseId)) {
      configuration.context.dims = '';
      // this.userService.dims;
    } else {
      const cloneDims = [];
        // _.cloneDeep(this.userService.dims) || [];
      cloneDims.push(contentDetails.courseId);
      if (contentDetails.batchId) {
        cloneDims.push(contentDetails.batchId);
      }
      configuration.context.dims = cloneDims;
    }
    const tags = [];
    _.forEach(_.get(this.editorService.editorConfig, 'user'), (org) => {
      if (org.hashTagId) {
        tags.push(org.hashTagId);
      }
    });
    configuration.context.tags = tags;
    configuration.context.app = [_.get(this.editorService.editorConfig, 'context.channel')];
    if (contentDetails.courseId) {
      configuration.context.cdata = [{
        id: contentDetails.courseId,
        type: 'course'
      }];
      if (contentDetails.batchId) {
        configuration.context.cdata.push({ type: 'batch',
        id: contentDetails.batchId} );
      }
    }
    configuration.context.pdata.id = _.get(this.editorService.editorConfig, 'context.pdata.id');
    configuration.metadata = contentDetails.contentData;
    configuration.data = contentDetails.contentData.mimeType !== this.configService.playerConfig.MIME_TYPE.ecmlContent ?
      {} : contentDetails.contentData.body;
    configuration.config.enableTelemetryValidation = false,
    // environment.enableTelemetryValidation; // telemetry validation
    configuration.config.previewCdnUrl = undefined;
    // this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
    //  ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
    return configuration;
  }

}
