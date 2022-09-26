import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ResourceService, ToasterService} from '@sunbird/shared';
import * as _ from 'lodash-es';
import {Router} from '@angular/router';
import {ActionService} from '@sunbird/core';


@Component({
  selector: 'app-modal-preview',
  templateUrl: './modal-preview.component.html',
  styleUrls: ['./modal-preview.component.scss']
})
export class ModalPreviewComponent implements OnInit {
  @Input() showQuestionModal = false;
  @Output() showQuestionOutput = new EventEmitter();
  @Input() collectionHierarchy: Array<any> = [];
  @Input() sessionContext;
  @Input() programContext;
  @Input() selectedStatus;
  public sourcingOrgReviewer: boolean;
  readonly identifierList = [];
  displayQuestionList = [];
  questionList = [];
  questionStatusMap = {};
  pageNumber = 1;

  constructor(
    public resourceService: ResourceService,
    public actionService: ActionService,
    public router: Router,
    public toasterService: ToasterService) {
  }

  ngOnInit(): void {
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing');
    this.collectionHierarchy.forEach(section => {
      if (section.leaf) {
        section.leaf.forEach(question => {
          // tslint:disable-next-line:max-line-length
          if (question.contentVisibility === true && this.includes(this.sourcingOrgReviewer, this.selectedStatus, question.sourcingStatus || question.status)) {
            this.identifierList.push(question.identifier);
            this.questionStatusMap[question.identifier] = 'Draft';
            if (question.status === 'Live' && !question.sourcingStatus) {
              this.questionStatusMap[question.identifier] = {
                status: this.resourceService.frmelmnts.lbl.approvalPending,
                styleClass: 'sb-color-warning'
              };
            } else if (question.sourcingStatus === 'Approved' && question.status === 'Live') {
              this.questionStatusMap[question.identifier] = {
                status: this.resourceService.frmelmnts.lbl.approved,
                styleClass: 'sb-color-success'
              };
            }
          }
        });
      }
    });

    this.getLimitedQuestions();
  }

  getLimitedQuestions() {
    const identifierList = this.getIdentifiersList();
    if (identifierList.length) {
      const req = {
        url: 'question/v1/list',
        data: {
          request: {
            search: {
              identifier: identifierList
            }
          }
        }
      };

      this.actionService.post(req).subscribe(resp => {
        if (resp.responseCode.toLowerCase() === 'ok') {
          this.questionList = [...this.questionList, ...resp.result.questions];
          this.questionList.concat(...resp.result.questions);
        }
      });
    } else if (this.questionList.length === 0) {
      this.showQuestionModal = false;
      this.onModalClose();
      this.toasterService.error(this.resourceService.messages?.emsg?.questionPreview?.getQuestion);
    }
  }

  includes(sourcingOrgReviewer: Boolean, selectedStatus: Array<string>, currentStatus: string) {
    if (!sourcingOrgReviewer) {
      return true;
    } else if (this.sessionContext.sampleContent) {
      return true;
    } else {
      return (!selectedStatus.length) || _.includes(selectedStatus, currentStatus);
    }
  }

  onModalClose() {
    this.showQuestionOutput.emit();
  }

  getLimitedQuestionList() {
    const currentDisplayCount = this.displayQuestionList.length;
    const remainQuestionCount = this.questionList.length - currentDisplayCount;
    const initialLimit = 10;
    const limitCount = currentDisplayCount + (
      remainQuestionCount > initialLimit ? initialLimit : remainQuestionCount
    );
    this.displayQuestionList = _.take(this.questionList, limitCount);
  }

  getIdentifiersList(): Array<string> {
    const identifierCount = this.identifierList.length;
    const limitCountByPageNo = this.pageNumber * 10;
    if (identifierCount < limitCountByPageNo - 10) {
      return [];
    }
    const limitCount: number = identifierCount >= limitCountByPageNo
      ? limitCountByPageNo : identifierCount;
    const startingIndex: number = this.pageNumber > 1 ? limitCountByPageNo - 10 : 0;
    const identifierList = this.identifierList.slice(startingIndex, limitCount);
    this.pageNumber++;
    return identifierList || [];
  }

  onScrollDown() {
    this.getLimitedQuestions();
  }
}
