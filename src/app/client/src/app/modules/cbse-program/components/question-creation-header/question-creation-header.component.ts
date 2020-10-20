import { Component, OnInit, Output, Input, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { ProgramTelemetryService } from '../../../program/services';
import { ConfigService} from '@sunbird/shared';

@Component({
  selector: 'app-question-creation-header',
  templateUrl: './question-creation-header.component.html',
  styleUrls: ['./question-creation-header.component.scss']
})
export class QuestionCreationHeaderComponent implements OnInit {
  public reviewerCommentModal = false;
  @Input() roles: any;
  @Input() questionMetaData: any;
  @Input() resourceStatus: any;
  @Input() telemetryEventsInput: any;
  constructor(
    public programTelemetryService: ProgramTelemetryService,
    public configService: ConfigService
  ) { }

  ngOnInit() {}

  openReviewerCommentModal() {
    this.reviewerCommentModal = true;
  }

  closeReviewerCommentModal() {
    this.reviewerCommentModal = false;
  }

}
