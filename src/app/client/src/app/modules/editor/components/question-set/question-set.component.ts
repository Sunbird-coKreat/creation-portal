import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import {questionEditorConfig} from '../../editor.config';
@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html',
  styleUrls: ['./question-set.component.scss']
})
export class QuestionSetComponent implements OnInit {
  public editorConfig: any = questionEditorConfig;
  public instructions: any = '';
  public mediaArr: any = [];
  public videoShow = false;
  constructor() { }

  ngOnInit() {
  }

  editorDataHandler(event) {
    this.instructions = event.body;
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
