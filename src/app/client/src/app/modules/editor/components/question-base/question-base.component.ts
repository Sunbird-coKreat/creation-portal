import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-question-base',
  templateUrl: './question-base.component.html',
  styleUrls: ['./question-base.component.scss']
})
export class QuestionBaseComponent implements OnInit {

  showLoader = true;
  questionSetdata: any;
  questionSetId;

  constructor(public activatedRoute: ActivatedRoute) {
    this.questionSetId = _.get(this.activatedRoute, 'snapshot.params.questionSetId');
  }

  ngOnInit() {
    this.setQuestionSetData();
  }

  setQuestionSetData() {
    this.questionSetdata = {
      identifier: this.questionSetId
    };
    this.showLoader = false;
  }
}
