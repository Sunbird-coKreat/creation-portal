import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import {questionEditorConfig} from '../../editor.config';
@Component({
  selector: 'app-reference-question',
  templateUrl: './reference-question.component.html',
  styleUrls: ['./reference-question.component.scss']
})
export class ReferenceQuestionComponent implements OnInit, OnChanges {
  @Input() question: any;
  public editorState: any = {};
  public mediaArr: any = [];
  public videoShow = false;
  private initialized = false;
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
    this.editorState = {
      question : '',
      answer: '',
      solutions: ''
    };
    if (this.question) {
      this.editorState.question = this.question.editorState.question;
      this.editorState.answer = this.question.editorState.answer;
      if (!_.isEmpty(this.question.editorState.solutions)) {
        const editor_state = this.question.editorState;
        this.editorState.solutions = editor_state.solutions[0].value;
      } else {
        this.editorState.solutions = '';
      }
    }
  }

  editorDataHandler(event, type) {
    if (type === 'question') {
      this.editorState.question = event.body;
    } else if (type === 'answer') {
      this.editorState.answer = event.body;
    } else if (type === 'solution') {
      this.editorState.solutions = event.body;
    }

    if (event.mediaobj) {
      const media = event.mediaobj;
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(event.mediaobj);
      }
    }
  }

}
