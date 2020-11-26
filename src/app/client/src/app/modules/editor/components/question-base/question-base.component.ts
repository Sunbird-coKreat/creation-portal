import { Component, OnInit } from '@angular/core';
import { collectionTreeNodes } from '../../editor.config';

@Component({
  selector: 'app-question-base',
  templateUrl: './question-base.component.html',
  styleUrls: ['./question-base.component.scss']
})
export class QuestionBaseComponent implements OnInit {
  public selectedQuestionData: any = collectionTreeNodes.data.children[0];
  constructor() { }

  ngOnInit() {
  }

}
