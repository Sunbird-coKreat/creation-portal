import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService, ServerResponse, ToasterService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
import { data1 } from './quml-library-data';
import { QuestionService } from '../../services';

@Component({
  selector: 'app-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentplayerPageComponent implements OnInit, OnChanges {
  QumlPlayerConfig = data1;
  @Input() questionMetaData: any;
  @Input() telemetryEventsInput: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  questionId: string;
  showPlayerPreview = false;

  constructor(public configService: ConfigService, public programTelemetryService: ProgramTelemetryService,
    private questionService: QuestionService, private toasterService: ToasterService) { }

  ngOnInit() {}

  ngOnChanges() {
    this.showPlayerPreview = false;
    this.initialize();
  }

  initialize() {
    this.questionId = _.get(this.questionMetaData, 'data.metadata.identifier');
    this.questionService.readQuestion(this.questionId).subscribe((res) => {
       const questionData = res.result.question;
       this.QumlPlayerConfig.data.children = [];
       this.QumlPlayerConfig.data.totalQuestions = 1;
       this.QumlPlayerConfig.data.maxQuestions =  1;
       this.QumlPlayerConfig.data.maxScore = 1;
       this.QumlPlayerConfig.data.children.push(questionData);
       this.showPlayerPreview = true;
    }, (err: ServerResponse) => {
      this.toasterService.error('Fetching question detailes failed. Try again later');
      console.log(err);
    });
  }

  removeQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'removeContent'}});
  }

  editQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'editContent'}});
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
