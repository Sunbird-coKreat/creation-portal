import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash-es';
import { TreeService } from '../../services';
import { ConfigService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
import { formConfig} from './formConfig';

@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html',
  styleUrls: ['./question-set.component.scss']
})
export class QuestionSetComponent implements OnInit {
  @Input() questionSetMetadata: any;
  @Input() telemetryEventsInput: any;
  @Output() toolbarEmitter = new EventEmitter<any>();
  config = formConfig;
  constructor(private treeService: TreeService, public configService: ConfigService,
    public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {
    this.prepareFormConfiguration();
  }

  prepareFormConfiguration() {
    const metadata = this.questionSetMetadata.data.metadata;
    _.forEach(this.config, field => {
      if (metadata && metadata[field.code]) {
        field['default'] = metadata[field.code];
      }
    });
    console.log(this.config);
  }

  addQuestion() {
    this.toolbarEmitter.emit({ 'button': { 'type': 'showQuestionTemplate' } });
  }

  output(event) {
    console.log(event);
    this.treeService.updateNode(event);
  }

}
