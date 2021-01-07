import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
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
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.editorDataHandler({body: this.editorState.answer});
  }

  editorDataHandler(event) {
    const body = this.prepareAnwserData(event);
    this.editorDataOutput.emit({body, mediaobj: event.mediaobj});
  }

  prepareAnwserData(event) {
    return {
      'answer': event.body,
      'editorState': {
        'answer': event.body
      },
      'name': 'Subjective',
      'qType': 'SA',
      'primaryCategory': 'Subjective Question'
    };
  }

}
