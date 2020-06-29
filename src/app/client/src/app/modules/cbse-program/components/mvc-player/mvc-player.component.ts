import { Component, ChangeDetectorRef, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PlayerService, ActionService } from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { CbseProgramService } from '../../services/cbse-program/cbse-program.service';

@Component({
  selector: 'app-mvc-player',
  templateUrl: './mvc-player.component.html',
  styleUrls: ['./mvc-player.component.scss']
})
export class MvcPlayerComponent implements OnChanges {

  @Input() contentId: string;
  @Output() moveEvent = new EventEmitter<any>();
  public playerConfig: any;
  public contentData: any = {};
  constructor(
    private playerService: PlayerService, private configService: ConfigService, private actionService: ActionService,
    private cbseService: CbseProgramService, private cd: ChangeDetectorRef, public resourceService: ResourceService
  ) { }

  ngOnChanges() {
    console.log('ngOnChanges :: MvcPlayerComponent ::' , this.contentId);
    if (this.contentId) { this.getUploadedContentMeta(this.contentId); }
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
