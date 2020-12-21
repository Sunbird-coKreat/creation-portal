import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {
  @Input() editorConfig;
  @Input() editorState;
  @Input() showFormError;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  editorDataHandler(event) {
    this.editorDataOutput.emit(event);
  }
}
