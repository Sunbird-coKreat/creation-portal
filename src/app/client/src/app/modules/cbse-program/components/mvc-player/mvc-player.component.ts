import { Component, ChangeDetectorRef, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { PlayerService, ActionService } from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { CbseProgramService } from '../../services/cbse-program/cbse-program.service';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-mvc-player',
  templateUrl: './mvc-player.component.html',
  styleUrls: ['./mvc-player.component.scss']
})
export class MvcPlayerComponent implements OnInit, OnChanges {

  @Input() sessionContext: any;
  @Input() contentDetails: any;
  @Output() moveEvent = new EventEmitter<any>();
  instance: string;
  public playerConfig: any;
  public contentData: any = {};
  public contentId;
  constructor(
    private playerService: PlayerService, public configService: ConfigService, private actionService: ActionService,
    private cbseService: CbseProgramService, private cd: ChangeDetectorRef, public resourceService: ResourceService,
    public programTelemetryService: ProgramTelemetryService
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  ngOnChanges() {
    if (this.contentDetails.identifier && this.contentId !== this.contentDetails.identifier) {
      this.contentId = this.contentDetails.identifier;
      this.getConfigByContent(this.contentId);
    }
  }

  getConfigByContent(contentId: string) {
    this.playerService.getConfigByContent(contentId).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  })).subscribe(config => {
      this.contentData = config.metadata;
      this.playerConfig = config;
      this.playerConfig.context.pdata.pid = `${this.configService.appConfig.TELEMETRY.PID}`;
      this.playerConfig.context.cdata = this.sessionContext.telemetryInteractCdata;
      this.cd.detectChanges();
    });
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'beforeMove'
    });
  }

}
