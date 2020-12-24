import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentplayerPageComponent implements OnInit {
  @Input() questionMetaData: any;
  @Input() telemetryEventsInput: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  constructor(public configService: ConfigService, public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {
  }

  removeQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'removeContent'}});
  }

  editQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'editContent'}});
  }

}
