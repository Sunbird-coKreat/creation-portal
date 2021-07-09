import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
@Component({
  selector: 'lib-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {
  @Input() editorState;
  @Input() showFormError;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  constructor(public configService: ConfigService) { }

  ngOnInit() {
    this.editorDataHandler({body: this.editorState.answer});
  }

  editorDataHandler(event) {
    const body = this.prepareAnwserData(event);
    this.editorDataOutput.emit({body, mediaobj: event.mediaobj});
  }

  prepareAnwserData(event) {
    return {
      answer: event.body,
      editorState: {
        answer: event.body
      },
      name: 'Subjective Question',
      qType: 'SA',
      primaryCategory: 'Subjective Question'
    };
  }
}
