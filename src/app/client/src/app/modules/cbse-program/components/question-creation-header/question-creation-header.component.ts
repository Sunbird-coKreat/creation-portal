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
  @Input() sessionContext: any;
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

  getTelemetryInteractObject(id: string, type: string) {
    return this.programTelemetryService.getTelemetryInteractObject(id, type, '1.0',
    { l1: this.sessionContext.collection, l2: this.sessionContext.textBookUnitIdentifier, l3: this.sessionContext.resourceIdentifier});
  }

}
