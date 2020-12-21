import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-question-template',
  templateUrl: './question-template.component.html',
  styleUrls: ['./question-template.component.scss']
})
export class QuestionTemplateComponent implements OnInit, OnDestroy {

  @Input() templateList: any;
  @Input() telemetryEventsInput;
  @ViewChild('modal') private modal;
  @Output() templateSelection = new EventEmitter<any>();
  public showButton = false;
  public templateSelected;

  constructor(public configService: ConfigService, public programTelemetryService: ProgramTelemetryService) { }

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
