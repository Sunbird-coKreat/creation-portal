import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProgramTelemetryService } from '../../../program/services';
import { ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import {McqQuestionTemplate} from '../../editor.config';
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
  @Input() templateId;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output() optionMedia: EventEmitter<any> = new EventEmitter<any>();
  @Output() templateOutput: EventEmitter<any> = new EventEmitter<any>();
  public setCharacterLimit = 160;
  public mediaArr = [];
  public templateType = 'mcq-vertical';
  public mcqTemplateConfig: any = McqQuestionTemplate;
  constructor(public programTelemetryService: ProgramTelemetryService,
    private configService: ConfigService) { }

  ngOnInit() {
    if (!_.isUndefined(this.templateId)) {
      this.templateType = this.templateId;
    }
  }

  editorDataHandler(event) {
    this.editorDataOutput.emit(event);
  }

  getMedia(media) {
    this.optionMedia.emit(media);
  }

  setTemplete(template) {
    this.templateOutput.emit(template);
    this.templateType = template;
  }

}
