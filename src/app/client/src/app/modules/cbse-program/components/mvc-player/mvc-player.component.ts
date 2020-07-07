import { Component, ChangeDetectorRef, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { PlayerService, ActionService } from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { CbseProgramService } from '../../services/cbse-program/cbse-program.service';

@Component({
  selector: 'app-mvc-player',
  templateUrl: './mvc-player.component.html',
  styleUrls: ['./mvc-player.component.scss']
})
export class MvcPlayerComponent implements OnInit, OnChanges {

  @Input() contentDetails: any;
  @Output() moveEvent = new EventEmitter<any>();
  instance: string;
  public playerConfig: any;
  public contentData: any = {};
  public contentId;
  constructor(
    private playerService: PlayerService, private configService: ConfigService, private actionService: ActionService,
    private cbseService: CbseProgramService, private cd: ChangeDetectorRef, public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  ngOnChanges() {
    if (this.contentDetails.identifier && this.contentId !== this.contentDetails.identifier) {
       this.getUploadedContentMeta(this.contentDetails.identifier);
       this.contentId = this.contentDetails.identifier;
    }
  }

  getUploadedContentMeta(contentId: string) {
    const option = {
      url: 'content/v3/read/' + contentId
    };
    this.actionService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
      const contentDetails = {
        contentId: contentId,
        contentData: res
      };
      this.contentData = res;
      this.playerConfig = this.playerService.getConfig(contentDetails);
      this.playerConfig.context.pdata.pid = `${this.configService.appConfig.TELEMETRY.PID}`;
      this.cd.detectChanges();
    });
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'beforeMove'
    });
  }

}
