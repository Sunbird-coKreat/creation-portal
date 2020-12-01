import { Component, OnInit } from '@angular/core';
import { collectionTreeNodes, questionToolbarConfig } from '../../editor.config';
import {EditorService} from '../../services';


@Component({
  selector: 'app-question-base',
  templateUrl: './question-base.component.html',
  styleUrls: ['./question-base.component.scss']
})
export class QuestionBaseComponent implements OnInit {
  public selectedQuestionData: any = collectionTreeNodes.data.children[0];
  public selectedQuestionData1: any = collectionTreeNodes.data.children[1];
  toolbarConfig = questionToolbarConfig;
  constructor(private editorService: EditorService) { }

  ngOnInit() {
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent(event.button.type);
        break;
      default:
        break;
    }
  }

  saveContent(action) {
    this.editorService.publish(action);
  }

}
