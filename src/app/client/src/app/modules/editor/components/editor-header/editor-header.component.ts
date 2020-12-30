import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
@Component({
  selector: 'app-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss']
})
export class EditorHeaderComponent implements OnInit {

  @Input() toolbarConfig: any;
  @Input() telemetryEventsInput: any;
  @Output() toolbarEmitter = new EventEmitter<any>();
  public preview: Boolean = false;

  constructor(public configService: ConfigService, public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {}

  buttonEmitter(event, button) {
    this.toolbarEmitter.emit({event, button});
  }

}
