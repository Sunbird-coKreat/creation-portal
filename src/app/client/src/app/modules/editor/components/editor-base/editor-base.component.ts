import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-editor-base',
  templateUrl: './editor-base.component.html',
  styleUrls: ['./editor-base.component.scss']
})
export class EditorBaseComponent implements OnInit {

  showLoader = true;
  questionSetdata: any;
  questionSetId;

  constructor(private activatedRoute: ActivatedRoute) {
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
