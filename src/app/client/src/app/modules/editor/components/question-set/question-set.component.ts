import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash-es';
import { TreeService, HelperService } from '../../services';
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
    public programTelemetryService: ProgramTelemetryService, public helperService: HelperService) { }

  ngOnInit() {
    this.prepareFormConfiguration();
  }

  prepareFormConfiguration() {
    const questionSetObj = this.questionSetMetadata.data.metadata;
    // tslint:disable-next-line:max-line-length
    const metadata = (_.isUndefined(this.treeService.treeCache.nodesModified[questionSetObj.identifier])) ? questionSetObj : _.assign(questionSetObj, this.treeService.treeCache.nodesModified[questionSetObj.identifier].metadata);
    _.forEach(this.config, field => {
      if (metadata && metadata[field.code]) {
        field['default'] = metadata[field.code];
      }

      switch (field.code) {
        case 'appIcon':

          break;
        case 'title':

          break;
        case 'description':

          break;
        case 'keywords':

          break;
        case 'primaryCategory':

          break;
        case 'additionalCategories':

          break;
        case 'board':

          break;
        case 'medium':

          break;
        case 'gradeLevel':

          break;
        case 'subject':

          break;
        case 'topic':

          break;
        case 'author':

          break;
        case 'attributions':

          break;
        case 'license':
          const licenses = this.helperService.getAvailableLicenses();
          if (licenses && licenses.length) {
            field.range = _.map(licenses, 'name');
          }
          break;
        case 'showFeedback':

          break;
        default:
          break;
      }
    });
  }

  addQuestion() {
    this.toolbarEmitter.emit({ 'button': { 'type': 'showQuestionTemplate' } });
  }

  output(event) {
  }

  onStatusChanges(event) {
    this.toolbarEmitter.emit({ 'button': { 'type': 'onFormChange'}, 'event': event });
  }

  onValueChanges(event) {
    this.treeService.updateNode(event);

    console.log(event);
  }
}
