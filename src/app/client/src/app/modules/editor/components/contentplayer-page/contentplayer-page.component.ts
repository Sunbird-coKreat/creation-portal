import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
import { data1 , data2, data3 } from './quml-library-data';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentplayerPageComponent implements OnInit {
  QumlPlayerConfig = data3;
  @Input() questionMetaData: any;
  @Input() telemetryEventsInput: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  constructor(public configService: ConfigService, public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {}

  removeQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'removeContent'}});
  }

  editQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'editContent'}});
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
