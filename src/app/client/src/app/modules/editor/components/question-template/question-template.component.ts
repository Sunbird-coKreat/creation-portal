import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-question-template',
  templateUrl: './question-template.component.html',
  styleUrls: ['./question-template.component.scss']
})
export class QuestionTemplateComponent implements OnInit, OnDestroy {

  @Input() templateList: any;
  @ViewChild('modal') private modal;
  @Output() templateSelection = new EventEmitter<any>();
  public showButton = false;
  public templateSelected;

  constructor() { }

  ngOnInit() {}

  next() {
    this.templateSelection.emit(this.templateSelected);
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
