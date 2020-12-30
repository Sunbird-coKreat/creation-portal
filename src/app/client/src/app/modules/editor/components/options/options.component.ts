import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProgramTelemetryService } from '../../../program/services';
import { ConfigService } from '@sunbird/shared';
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  @Input() editorConfig;
  @Input() editorState;
  @Input() showFormError;
  @Input() telemetryPageDetails;
  @Input() questionMetaData;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output() optionMedia: EventEmitter<any> = new EventEmitter<any>();
  public setCharacterLimit = 160;
  public mediaArr = [];
  constructor(public programTelemetryService: ProgramTelemetryService,
    private configService: ConfigService) { }

  ngOnInit() {
  }

  editorDataHandler(event) {
    this.editorDataOutput.emit(event);
  }

  getMedia(media) {
    this.optionMedia.emit(media);
  }

}
