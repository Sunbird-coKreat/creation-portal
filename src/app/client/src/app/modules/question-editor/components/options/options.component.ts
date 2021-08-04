import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';
@Component({
  selector: 'lib-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OptionsComponent implements OnInit {
  @Input() editorState: any;
  @Input() showFormError;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public templateType = 'mcq-vertical';
  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService) { }

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
    const correctAnswer = editorState.answer;
    let resindex;
    const options = _.map(editorState.options, (opt, key) => {
      resindex = Number(key);
      if (Number(correctAnswer) === key) {
        return { answer: true, value: { body: opt.body, value: resindex } };
      } else {
        return { answer: false, value: { body: opt.body, value: resindex } };
      }
    });
    metadata = {
      templateId: this.templateType,
      name: 'Multiple Choice Question',
      responseDeclaration: this.getResponseDeclaration(editorState),
      interactionTypes: ['choice'],
      interactions: this.getInteractions(editorState.options),
      editorState: {
        options
      },
      qType: 'MCQ',
      primaryCategory: 'Multiple Choice Question'
    };
    return metadata;
  }

  getResponseDeclaration(editorState) {
    const responseDeclaration = {
      response1: {
        maxScore: 1,
        cardinality: 'single',
        type: 'integer',
        correctResponse: {
          value: editorState.answer,
          outcomes: { SCORE: 1 }
        }
      }
    };
    return responseDeclaration;
  }

  getInteractions(options) {
    let index;
    const interactOptions = _.map(options, (opt, key) => {
      index = Number(key);
      return { label: opt.body, value: index };
    });
    const interactions = {
      response1: {
        type: 'choice',
        options: interactOptions
      }
    };
    return interactions;
  }

  setTemplete(template) {
    this.templateType = template;
    this.editorDataHandler();
  }

}

