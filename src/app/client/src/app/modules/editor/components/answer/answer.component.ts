import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
// import { editorConfig } from '../../editor.config';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {
  @Input() editorConfig;
  @Input() editorState;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  editorDataHandler(event) {
    this.editorDataOutput.emit(event);
  }
}
