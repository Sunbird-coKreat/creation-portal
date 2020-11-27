import { Component, OnInit } from '@angular/core';
import { collectionTreeNodes, questionToolbarConfig } from '../../editor.config';


@Component({
  selector: 'app-question-base',
  templateUrl: './question-base.component.html',
  styleUrls: ['./question-base.component.scss']
})
export class QuestionBaseComponent implements OnInit {
  public selectedQuestionData: any = collectionTreeNodes.data.children[0];
  public selectedQuestionData1: any = collectionTreeNodes.data.children[1];
  toolbarConfig = questionToolbarConfig;
  constructor() { }

  ngOnInit() {
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent();
        break;
      default:
        break;
    }
  }

  saveContent() {
  }

}
