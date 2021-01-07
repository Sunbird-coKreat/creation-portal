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
  @Input() editorState: any;
  @Input() showFormError;
  @Input() telemetryPageDetails;
  @Input() questionMetaData;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  public setCharacterLimit = 160;
  public templateType = 'mcq-vertical';
  public mcqTemplateConfig: any = McqQuestionTemplate;
  constructor(public programTelemetryService: ProgramTelemetryService,
    public configService: ConfigService) { }

  ngOnInit() {
    if (!_.isUndefined(this.editorState.templateId)) {
      this.templateType = this.editorState.templateId;
    }
    this.editorDataHandler();
  }

  editorDataHandler(event?) {
    const body = this.prepareMcqBody(this.editorState);
    this.editorDataOutput.emit({ body, mediaobj: event ? event.mediaobj : undefined });
  }

  prepareMcqBody(editorState) {
    let metadata: any;
    const correct_answer = editorState.answer;
    let resindex;
    const options = _.map(editorState.options, (opt, key) => {
      resindex = Number(key);
      if (Number(correct_answer) === key) {
        return { 'answer': true, value: { 'body': opt.body, 'value': resindex } };
      } else {
        return { 'answer': false, value: { 'body': opt.body, 'value': resindex } };
      }
    });
    metadata = {
      'templateId': this.templateType,
      'name': 'Multiple Choice',
      'responseDeclaration': this.getResponseDeclaration(editorState),
      'interactionTypes': ['choice'],
      'interactions': this.getInteractions(editorState.options),
      'editorState': {
        'options': options
      },
      'qType': 'MCQ',
      'primaryCategory': 'Multiple Choice Question'
    };
    return metadata;
  }

  getResponseDeclaration(editorState) {
    const responseDeclaration = {
      response1: {
        maxScore: 1,
        cardinality: 'single',
        type: 'integer',
        'correctResponse': {
          value: editorState.answer,
          outcomes: { 'SCORE': 1 }
        }
      }
    };
    return responseDeclaration;
  }

  getInteractions(options) {
    let index;
    const interactOptions = _.map(options, (opt, key) => {
      index = Number(key);
      return { 'label': opt.body, 'value': index };
    });
    const interactions = {
      'response1': {
        'type': 'choice',
        'options': interactOptions
      }
    };
    return interactions;
  }

  setTemplete(template) {
    this.templateType = template;
    this.editorDataHandler();
  }

}
