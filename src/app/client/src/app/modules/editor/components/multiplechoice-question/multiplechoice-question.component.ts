import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { McqForm } from '../../../cbse-program';
import {questionEditorConfig} from '../../editor.config';
@Component({
  selector: 'app-multiplechoice-question',
  templateUrl: './multiplechoice-question.component.html',
  styleUrls: ['./multiplechoice-question.component.scss']
})
export class MultiplechoiceQuestionComponent implements OnInit, OnChanges {
  @Input() question: any;
  private initialized = false;
  public mcqForm: McqForm;
  public solutionValue: string;
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public mediaArr = [];
  public editorConfig: any = questionEditorConfig;

  constructor() { }

  ngOnInit() {
    this.initialized = true;
    this.initialize();
  }

  ngOnChanges() {
    if (this.initialized) {
      this.initialize();
    }
  }

  initialize() {
    if (this.question) {
      const { responseDeclaration, templateId, editorState } = this.question;
      const numberOfOptions = _.get(this.editorConfig.config, 'No of options');
      const options = _.map(editorState.options, option => ({ body: option.value.body }));
      const question = editorState.question;
      this.mcqForm = new McqForm({
        question, options, answer: _.get(responseDeclaration, 'responseValue.correct_response.value')
      }, { templateId, numberOfOptions });
      if (!_.isEmpty(editorState.solutions)) {
        this.solutionValue = editorState.solutions[0].value;
      }
    } else {
      this.mcqForm = new McqForm({ question: '', options: [] }, {});
    }
  }

  getMedia(media) {
    if (media) {
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(media);
      }
    }
  }

  handleEditorError(event: any) {

  }

}
