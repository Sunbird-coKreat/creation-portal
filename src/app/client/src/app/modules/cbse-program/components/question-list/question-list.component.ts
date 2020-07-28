// tslint:disable-next-line:max-line-length
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { UserService, ActionService, ContentService, NotificationService, ProgramsService } from '@sunbird/core';
import { TelemetryService} from '@sunbird/telemetry';
import { tap, map, catchError, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { of, forkJoin, throwError } from 'rxjs';
import { CbseProgramService } from '../../services';
import { ItemsetService } from '../../services/itemset/itemset.service';
import { HelperService } from '../../services/helper.service';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ProgramStageService } from '../../../program/services';
import { ProgramTelemetryService } from '../../../program/services';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})

export class QuestionListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('questionCreationChild') questionCreationChild;
  @Output() changeStage = new EventEmitter<any>();
  @Input() practiceQuestionSetComponentInput: any;
  @ViewChild('FormControl') FormControl: NgForm;
  @Output() uploadedContentMeta = new EventEmitter<any>();
  @ViewChild('resourceTtlTextarea') resourceTtlTextarea: ElementRef;

  public sessionContext: any;
  public programContext: any;
  public sharedContext: any;
  public selectedSharedContext: any;
  public role: any;
  public templateDetails: any;
  public actions: any;
  public notify;
  public questionList: Array<any> = [];
  public selectedQuestionId: any;
  public questionReadApiDetails: any = {};
  public resourceDetails: any = {};
  public resourceStatus: string;
  public resourceStatusText: string;
  public questionMetaData: any;
  public refresh = true;
  public showLoader = true;
  public showSuccessModal = false;
  public showReviewModal = false;
  public showRequestChangesPopup = false;
  public showDeleteQuestionModal = false;
  public showPublishModal = false;
  public existingContentVersionKey = '';
  public resourceTitleLimit = 100;
  public itemSetIdentifier: string;
  public deleteAssessmentItemIdentifier: string;
  public showTextArea = false;
  public resourceName = '';
  public licencesOptions = [];
  public commentCharLimit = 1000;
  public contentRejectComment: string;
  public practiceSetConfig: any;
  public goToNextQuestionStatus = true;
  public telemetryEventsInput: any = {};
  previewBtnVisibility = true;
  visibility: any;
  telemetryImpression: any;
  public telemetryPageId = 'question-list';
  public sourcingOrgReviewer: boolean;
  public sourcingReviewStatus: string;
  public sourcingOrgReviewComments: string;
  public originPreviewUrl = '';
  public originPreviewReady = false;

  constructor(
    private configService: ConfigService, private userService: UserService,
    public actionService: ActionService,
    private cdr: ChangeDetectorRef, public toasterService: ToasterService,
    public telemetryService: TelemetryService, private fb: FormBuilder,
    private notificationService: NotificationService, private cbseService: CbseProgramService, public contentService: ContentService,
    private itemsetService: ItemsetService, private helperService: HelperService,
    private resourceService: ResourceService, private collectionHierarchyService: CollectionHierarchyService,
    public programStageService: ProgramStageService, public activeRoute: ActivatedRoute,
    public router: Router, private navigationHelperService: NavigationHelperService,
    public programTelemetryService: ProgramTelemetryService, private programsService: ProgramsService) { }

  ngOnInit() {
    this.sessionContext = _.get(this.practiceQuestionSetComponentInput, 'sessionContext');
    this.selectedSharedContext = _.get(this.practiceQuestionSetComponentInput, 'selectedSharedContext');
    this.role = _.get(this.practiceQuestionSetComponentInput, 'role');
    this.templateDetails = _.get(this.practiceQuestionSetComponentInput, 'templateDetails');
    this.programContext = _.get(this.practiceQuestionSetComponentInput, 'programContext');
    this.sessionContext.programContext = this.programContext;
    this.actions = _.get(this.programContext, 'config.actions');
    this.sharedContext = _.get(this.programContext, 'config.sharedContext');
    this.sessionContext.resourceIdentifier = _.get(this.practiceQuestionSetComponentInput, 'contentIdentifier');
    this.sessionContext.questionType = this.templateDetails.questionCategories[0];
    this.sessionContext.textBookUnitIdentifier = _.get(this.practiceQuestionSetComponentInput, 'unitIdentifier');
    this.practiceSetConfig = _.get(this.practiceQuestionSetComponentInput, 'config');
    this.sourcingReviewStatus = _.get(this.practiceQuestionSetComponentInput, 'sourcingStatus') || '';
    this.resourceTitleLimit = this.practiceSetConfig.config.resourceTitleLength;
    this.sessionContext.practiceSetConfig = this.practiceSetConfig;
    this.sessionContext.topic = _.isEmpty(this.selectedSharedContext.topic) ? this.sessionContext.topic : this.selectedSharedContext.topic;
    this.getContentMetadata(this.sessionContext.resourceIdentifier);
    this.getLicences();
    this.preprareTelemetryEvents();
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;

    this.notify = this.helperService.getNotification().subscribe((action) => {
      this.contentStatusNotify(action);
    });
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{ 'type': 'Program', 'id': this.programContext.program_id }];
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  public preprareTelemetryEvents() {
    // tslint:disable-next-line:max-line-length
    this.telemetryEventsInput.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.sessionContext.collection, 'Content', '1.0');
    // tslint:disable-next-line:max-line-length
    this.telemetryEventsInput.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.sessionContext.programId, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryEventsInput.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
  }

  getContentMetadata(contentId: string) {
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
    };
    this.contentService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      this.resourceDetails = res;
      const contentTypeValue = [this.resourceDetails.contentType];
      const contentType = this.programsService.getContentTypesName(contentTypeValue);
      this.resourceDetails.contentTypeName = contentType;
      this.sessionContext.contentMetadata = this.resourceDetails;
      this.existingContentVersionKey = res.versionKey;
      this.resourceStatus =  _.get(this.resourceDetails, 'status');
      this.setResourceStatus();
      if (this.resourceDetails.questionCategories) {
        let questionCategories = _.nth(this.resourceDetails.questionCategories, 0);
        if (questionCategories === 'CuriosityQuestion') {
          questionCategories = 'curiosity';
        }
        this.sessionContext.questionType = _.lowerCase(questionCategories);
      }
      this.sessionContext.resourceStatus = this.resourceStatus;
      this.resourceName = this.resourceDetails.name || this.templateDetails.metadata.name;
      this.contentRejectComment = this.resourceDetails.rejectComment || '';
      if (!this.resourceDetails.itemSets) {
        this.createDefaultQuestionAndItemset();
      } else {
        const itemSet = this.resourceDetails.itemSets;
        if (itemSet[0].identifier) {
          this.itemSetIdentifier = itemSet[0].identifier;
        }
        this.fetchQuestionList();
        this.resourceName = (this.resourceName !== 'Untitled') ? this.resourceName : '' ;
        if (this.visibility && this.visibility.showSave && !this.resourceName) {
          this.showResourceTitleEditor();
        }
      }
      this.handleActionButtons();
    });
  }

  contentStatusNotify(status) {
      if (!this.sessionContext.nominationDetails && this.resourceDetails.organisationId && status !== 'Request') {
        const programDetails = { name: this.programContext.name};
        this.helperService.prepareNotificationData(status, this.resourceDetails, programDetails);
      } else {
        const notificationForContributor = {
          user_id: this.resourceDetails.createdBy,
          content: { name: this.resourceDetails.name },
          org: { name:  _.get(this.sessionContext, 'nominationDetails.orgData.name') || '--'},
          program: { name: this.programContext.name },
          status: status
        };
        this.notificationService.onAfterContentStatusChange(notificationForContributor)
        .subscribe((res) => {  });
        if (!_.isUndefined(this.sessionContext.nominationDetails.user_id) && status !== 'Request') {
          const notificationForPublisher = {
            user_id: this.sessionContext.nominationDetails.user_id,
            content: { name: this.resourceDetails.name },
            org: { name:  this.sessionContext.nominationDetails.orgData.name},
            program: { name: this.programContext.name },
            status: status
          };
          this.notificationService.onAfterContentStatusChange(notificationForPublisher)
          .subscribe((res) => {  });
        }
      }
    }

  setResourceStatus() {
    if (this.resourceStatus === 'Review') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
    } else if (this.resourceStatus === 'Draft' && this.resourceDetails.rejectComment && this.resourceDetails.rejectComment !== '') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
    } else if (this.resourceStatus === 'Live' && _.isEmpty(this.sourcingReviewStatus)) {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
    } else if (this.sourcingReviewStatus === 'Rejected') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.rejected;
    } else if (this.sourcingReviewStatus === 'Approved') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.approved;
      if (!_.isEmpty(this.sessionContext.contentOrigins) &&
      !_.isEmpty(this.sessionContext.contentOrigins[this.sessionContext.resourceIdentifier])) {
        this.originPreviewUrl =  this.helperService
        .getContentOriginUrl(this.sessionContext.contentOrigins[this.sessionContext.resourceIdentifier].identifier);
      }
      this.originPreviewReady = true;
    } else {
      this.resourceStatusText = this.resourceStatus;
    }
  }

  public getLicences() {
    this.helperService.getLicences().subscribe((res: any) => {
      this.licencesOptions = _.map(res.license, (license) => {
        return license.name;
      });
      this.sessionContext['licencesOptions'] = this.licencesOptions;
    });
  }

  handleActionButtons() {
    this.visibility = {};
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);

    // tslint:disable-next-line:max-line-length
    this.visibility['showCreateQuestion'] = submissionDateFlag && (_.includes(this.actions.showCreateQuestion.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
    // tslint:disable-next-line:max-line-length
    this.visibility['showDeleteQuestion'] = (_.includes(this.actions.showDeleteQuestion.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft' && this.questionList.length > 1);
    // tslint:disable-next-line:max-line-length
    this.visibility['showRequestChanges'] = this.router.url.includes('/contribute') && submissionDateFlag && !this.resourceDetails.sampleContent === true &&
    (_.includes(this.actions.showRequestChanges.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review');
    // tslint:disable-next-line:max-line-length
    this.visibility['showPublish'] = this.router.url.includes('/contribute') && submissionDateFlag && !this.resourceDetails.sampleContent === true &&
    (_.includes(this.actions.showPublish.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review');
    // tslint:disable-next-line:max-line-length
    this.visibility['showSubmit'] = submissionDateFlag && (_.includes(this.actions.showSubmit.roles, this.sessionContext.currentRoleId)  && this.resourceStatus === 'Draft');
    // tslint:disable-next-line:max-line-length
    this.visibility['showSave'] = submissionDateFlag && (_.includes(this.actions.showSave.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
     // tslint:disable-next-line:max-line-length
    this.visibility['showEdit'] = submissionDateFlag && (_.includes(this.actions.showEdit.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
  }

  get isPublishBtnDisable(): boolean {
    return _.find(this.questionList, (question) => question.rejectComment && question.rejectComment !== '');
  }

  public createDefaultQuestionAndItemset() {
    this.createDefaultAssessmentItem().pipe(
      map(data => {
        this.selectedQuestionId = _.get(data, 'result.node_id');
        return this.selectedQuestionId;
    }),
    mergeMap(questionId => this.createItemSet(questionId).pipe(
      map(res => {
        this.itemSetIdentifier = _.get(res, 'result.identifier');
        return this.itemSetIdentifier;
    }),
    mergeMap(() => {
      const reqBody = {
        'content': {
          'versionKey': this.existingContentVersionKey,
          'itemSets': [
           {
             'identifier': this.itemSetIdentifier
           }
         ]
       }
      };
      return this.updateContent(reqBody, this.sessionContext.resourceIdentifier);
    }))))
    .subscribe(() => {
      this.handleQuestionTabChange(this.selectedQuestionId);
      this.goToNextQuestionStatus = false;
      this.resourceName = (this.resourceName !== 'Untitled') ? this.resourceName : '' ;
      if (this.visibility && this.visibility.showSave && !this.resourceName) {
        this.showResourceTitleEditor();
      }
    });
  }

  private fetchQuestionList() {
    this.itemsetService.readItemset(this.itemSetIdentifier).pipe(
      map(response => {
        const questionList = _.get(response, 'result.itemset.items');
        const questionIds = _.map(questionList, (question => _.get(question, 'identifier')));
        return questionIds;
    }),
    mergeMap(questionIds => {
      const req = {
        url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
        data: {
          'request': {
            'filters': {
              'identifier': questionIds,
              'status': ['Live', 'Review', 'Draft']
            },
            'sort_by': { 'createdOn': 'desc' },
            'limit': 20
          }
        }
      };
      return this.contentService.post(req).pipe(map(data => {
          this.questionList = _.get(data, 'result.items');
          return this.questionList;
      }));
    }))
    .subscribe((questionList) => {
          this.selectedQuestionId = questionList[0].identifier;
          this.handleQuestionTabChange(this.selectedQuestionId);
          this.handleActionButtons();
    });
  }

  handleQuestionTabChange(questionId, actionStatus?: string) {

    if (_.includes(this.sessionContext.questionList, questionId) && !actionStatus) { return; }
    if (!this.checkCurrentQuestionStatus()) { return ; }
    this.sessionContext.questionList = [];
    this.sessionContext.questionList.push(questionId);
    this.selectedQuestionId = questionId;
    this.showLoader = true;
    this.getQuestionDetails(questionId).pipe(tap(data => this.showLoader = false))
      .subscribe((assessment_item) => {
        this.questionMetaData = {
          mode: 'edit',
          data: assessment_item
        };
        if (this.resourceStatus === 'Draft') {
          this.sessionContext.isReadOnlyMode = false;
        } else {
          this.sessionContext.isReadOnlyMode = true;
        }

        if (assessment_item) {
          const index = _.findIndex(this.questionList, {identifier: questionId});
          this.questionList[index].rejectComment = assessment_item.rejectComment;
          this.questionList[index].status = assessment_item.status;
        }
         // for preview of resource
         const questionsIds: any = _.map(this.questionList, (question) =>  _.get(question, 'identifier'));
         this.sessionContext.questionsIds = questionsIds;
        // tslint:disable-next-line:max-line-length
        this.refreshEditor();
        if (actionStatus && actionStatus !== 'requestChange') {  this.saveContent(actionStatus); }
        this.previewBtnVisibility = true;
      });
  }

  public checkCurrentQuestionStatus() {
    if (this.goToNextQuestionStatus) {
      return true;
    } else {
      this.toasterService.error('Save a question and its answer before you navigate');
      return false;
    }
  }

  public getQuestionDetails(questionId) {
    if (this.questionReadApiDetails[questionId]) {
      return of(this.questionReadApiDetails[questionId]);
    }
    const req = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.READ}/${questionId}`
    };
    return this.actionService.get(req).pipe(map((res: any) => {
      this.questionReadApiDetails[questionId] = res.result.assessment_item;
      return res.result.assessment_item;
    }),
      catchError(err => {
        const errInfo = { errorMsg: 'Fetching Question details failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }));
  }

  public createNewQuestion(): void {

    if (!this.checkCurrentQuestionStatus()) { return ; }
    this.createDefaultAssessmentItem().pipe(
      map((data: any) => {
        const questionId = data.result.node_id;
        const questionsIds: any = _.map(this.questionList, (question) => ({ 'identifier': _.get(question, 'identifier') }));
        questionsIds.push({'identifier': questionId});
        const requestParams = {
          'name': this.resourceName,
          'items': questionsIds
        };
        this.selectedQuestionId = questionId;
        return requestParams;
    }),
    mergeMap(requestParams => this.updateItemset(requestParams, this.itemSetIdentifier)))
    .subscribe((contentRes: any) => {
      this.handleQuestionTabChange(this.selectedQuestionId);
      this.handleActionButtons();
      this.goToNextQuestionStatus = false;
    });
  }

  public handlerContentPreview() {
    this.questionCreationChild.buttonTypeHandler('preview');
    if (this.resourceStatus !== 'Draft') {
      this.previewBtnVisibility = false;
    }
  }

  public questionStatusHandler(event) {

    if (this.isPublishBtnDisable && event.type === 'review') {
      this.toasterService.error('Please resolve rejected questions or delete');
      return;
    } else if (event.type === 'close') {
      return;
    } else if (event.type === 'preview') {
      delete this.questionReadApiDetails[event.identifier];
      this.saveContent(event.type);
      this.previewBtnVisibility = false;
      this.goToNextQuestionStatus = true;
      return;
    } else if (event.type === 'Draft' && event.isRejectedQuestion) {
      event.type = 'requestChange';
    }

    this.goToNextQuestionStatus = true;
    delete this.questionReadApiDetails[event.identifier];
    this.handleQuestionTabChange(this.selectedQuestionId, event.type);
  }

  handleRefresEvent() {
    this.refreshEditor();
  }

  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  saveContent(actionStatus: string) {
    const selectedQuestionsData = _.reduce(this.questionList, (final, question) => {
      final.ids.push(_.get(question, 'identifier'));
      final.author.push(_.get(question, 'author'));
      final.category.push(_.get(question, 'category'));
      final.attributions = _.union(final.attributions, _.get(question, 'organisation'));
      return final;
    }, { ids: [], author: [], category: [], attributions: [] });
    if (selectedQuestionsData.ids.length === 0)  { return false; }
    const questions = [];
    _.forEach(_.get(selectedQuestionsData, 'ids'), (value) => {
      questions.push({ 'identifier': value });
    });

    const updateBody = this.cbseService.getECMLJSON(selectedQuestionsData.ids);
    const versionKey = this.getContentVersion(this.sessionContext.resourceIdentifier);
    const topic = _.isEmpty(this.selectedSharedContext.topic) ? this.sessionContext.topic : this.selectedSharedContext.topic;

    forkJoin([updateBody, versionKey]).subscribe((response: any) => {
      const existingContentVersionKey = _.get(response[1], 'content.versionKey');
      const requestBody = {
        'content': {
          // questions: questions,
          body: JSON.stringify(response[0]),
          versionKey: existingContentVersionKey,
          'author': _.join(_.uniq(_.compact(_.get(selectedQuestionsData, 'author'))), ', '),
          'attributions': _.uniq(_.compact(_.get(selectedQuestionsData, 'attributions'))),
          // tslint:disable-next-line:max-line-length
          name: this.resourceName,
          'programId': this.sessionContext.programId,
          'program': this.sessionContext.program,
          'plugins': [{
            identifier: 'org.sunbird.questionunit.quml',
            semanticVersion: '1.1'
          }],
          'questionCategories': _.uniq(_.compact(_.get(selectedQuestionsData, 'category'))),
          'editorVersion': 3,
          'unitIdentifiers': [this.sessionContext.textBookUnitIdentifier],
          'rejectComment' : ''
        }
      };

      if (!_.isEmpty(topic)) {
        requestBody.content['topic'] = topic;
      }

      this.updateContent(requestBody, this.sessionContext.resourceIdentifier)
      .subscribe((res) => {
          if (res.responseCode === 'OK' && (res.result.content_id || res.result.node_id)) {
            if (actionStatus === 'review' && this.isIndividualAndNotSample()) {
              this.publishContent();
            } else if (actionStatus === 'review') {
              this.sendForReview();
            }
          }
        });
    });

  }

  isIndividualAndNotSample() {
    return !!(this.sessionContext.currentOrgRole === 'individual' && this.sessionContext.sampleContent !== true);
  }

  sendForReview() {
    const reviewItemSet = this.itemsetService.reviewItemset(this.itemSetIdentifier);
    const reviewContent = this.helperService.reviewContent(this.sessionContext.resourceIdentifier);
    forkJoin([reviewItemSet, reviewContent]).subscribe((res: any) => {
      const contentId = res[1].result.node_id || res[1].result.identifier;
      if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId )
        .subscribe((data) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0061);
          this.programStageService.removeLastStage();
          this.uploadedContentMeta.emit({
            contentId: contentId
          });
        }, (err) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0099);
        });
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0099);
     });
  }

  publishContent() {
    this.helperService.publishContent(this.sessionContext.resourceIdentifier, this.userService.userProfile.userId)
      .subscribe(res => {
        const contentId = res.result.node_id || res.result.identifier || res.result.content_id;
      this.showPublishModal = false;
      if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId )
        .subscribe((data) => {
          this.toasterService.success(this.resourceService.messages.smsg.m0063);
          this.programStageService.removeLastStage();
          this.uploadedContentMeta.emit({
            contentId: contentId
          });
        });
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m00101);
    });
  }

  requestChanges() {
    if (this.FormControl.value.contentRejectComment) {
      this.helperService.submitRequestChanges(this.sessionContext.resourceIdentifier, this.FormControl.value.contentRejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        this.contentStatusNotify('Request');
        const contentId = res.result.node_id || res.result.identifier;
        if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
          this.collectionHierarchyService.addResourceToHierarchy(
            this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId
          )
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0062);
            this.programStageService.removeLastStage();
            this.uploadedContentMeta.emit({
              contentId: contentId
            });
          }, (err) => {
            this.toasterService.error(this.resourceService.messages.fmsg.m00100);
          });
        }
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
      });
    }
  }

  getContentVersion(contentId) {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}?mode=edit&fields=versionKey,createdBy`
    };
    return this.contentService.get(req).pipe(
      map(res => {
        return _.get(res, 'result');
      }, err => {
        console.log(err);
        this.toasterService.error(_.get(err, 'error.params.errmsg') || 'content update failed');
      })
    );
  }

  public dismissPublishModal() {
    setTimeout(() => this.changeStage.emit('prev'), 0);
  }

  openDeleteQuestionModal(event, identifier: string) {
    event.stopPropagation();

    if (identifier !== this.selectedQuestionId) {
      if (!this.checkCurrentQuestionStatus()) { return ; }
    }

    this.deleteAssessmentItemIdentifier = identifier;
    console.log(this.deleteAssessmentItemIdentifier);
    this.showDeleteQuestionModal = true;
  }

  deleteQuestion() {
    const request = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.RETIRE}/${this.deleteAssessmentItemIdentifier}`
    };

    this.actionService.delete(request).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Question deletion failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
    .subscribe((res) => {
      if (res.responseCode === 'OK') {
        this.showDeleteQuestionModal = false;
        this.toasterService.success('Question deleted successfully');
        this.goToNextQuestionStatus = true;
        this.fetchQuestionList();
      }
    }, error => {
      console.log(error);
    });
  }

  public showResourceTitleEditor() {
    this.showTextArea = true;
    setTimeout(() => {
      this.resourceTtlTextarea.nativeElement.focus();
    }, 500);
  }

  public onResourceNameChange(event: any) {
    const remainChar = this.resourceTitleLimit - this.resourceName.length;
    if (remainChar <= 0 && event.keyCode !== 8) {
      event.preventDefault();
      return;
    }
    this.resourceName = this.removeSpecialChars(event.target.value);
  }

  private removeSpecialChars(text: any) {
    if (text) {
      const iChars = '!`~@#$^*+=[]\\\'{}|\"<>%';
      for (let i = 0; i < text.length; i++) {
        if (iChars.indexOf(text.charAt(i)) !== -1) {
          this.toasterService.error(`Special character ${text.charAt(i)} is not allowed`);
        }
      }
       // tslint:disable-next-line:max-line-length
      text = text.replace(/[^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\uFB50-\uFDFF\u0980-\u09FF\u0900-\u097F\u0D00-\u0D7F\u0A80-\u0AFF\u0C80-\u0CFF\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F\w:&_\-.(\),\/\s]/g, '');
      return text;
    }
  }

  public saveResourceName() {
    this.resourceName = (_.trim(this.resourceName) !== 'Untitled') ? _.trim(this.resourceName) : '' ;
    if (this.resourceName.length > 0 && this.resourceName.length <= this.resourceTitleLimit) {
      this.showTextArea = false;
      const reqBody = {
        'content': {
            'versionKey': this.existingContentVersionKey,
            'name' : this.resourceName
        }
      };
      this.updateContent(reqBody, this.sessionContext.resourceIdentifier)
      .subscribe((res) => {
        const contentId = res.result.node_id || res.result.identifier;
        if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
          this.collectionHierarchyService.addResourceToHierarchy(
            this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId
          )
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0060);
            this.sessionContext.contentMetadata.name = this.resourceName;
          }, (err) => {
            this.toasterService.error(this.resourceService.messages.fmsg.m0098);
          });
        }
      });
    }
  }

  public createDefaultAssessmentItem() {
    const request = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.CREATE}`,
      data: this.prepareQuestionReqBody()
    };

    return this.actionService.post(request).pipe(map((response) => {
      this.questionList.push(_.assign(request.data.request.assessment_item.metadata, {'identifier': _.get(response, 'result.node_id')}));
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Default question creation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  prepareQuestionReqBody() {

   // tslint:disable-next-line:prefer-const
    let finalBody = {
      'request': {
        'assessment_item': {
          'objectType': 'AssessmentItem',
          'metadata': {
            'itemType': 'UNIT',
            'code': UUID.UUID(),
            'qumlVersion': 1.0,
            'qlevel': 'MEDIUM',
            'organisation': this.sessionContext.onBoardSchool ? [this.sessionContext.onBoardSchool] : [],
            'language': [
              'English'
            ],
            'program': this.sessionContext.program,
            'templateId': 'NA',
            'type': 'reference',
            'creator': this.getUserName(),
            'version': 3,
            'name': this.sessionContext.questionType + '_' + this.sessionContext.framework,
             // tslint:disable-next-line:max-line-length
            'category': this.sessionContext.questionType === 'curiosity' ? 'CuriosityQuestion' : this.sessionContext.questionType.toUpperCase(),
            'programId': this.sessionContext.programId,
            'body': '',
            'media': [],
            'author' : this.getUserName(),
            'status' : 'Draft'
          }
        }
      }
    };

    finalBody.request.assessment_item.metadata =  _.assign(finalBody.request.assessment_item.metadata, this.prepareSharedContext());

    if (_.isEqual(this.sessionContext.questionType, 'mcq')) {
      finalBody.request.assessment_item.metadata = _.assign(finalBody.request.assessment_item.metadata, this.getMcqQuestionBody());
    } else {
      finalBody.request.assessment_item.metadata = _.assign(finalBody.request.assessment_item.metadata, this.getReferenceQuestionBody());
    }
    return finalBody;
  }

  prepareSharedContext() {
    let data = {};
    const sharedContext = this.sharedContext.reduce((obj, context) => {
      return { ...obj, [context]: this.selectedSharedContext[context] || this.sessionContext[context] };
    }, {});

    data = _.assign(data, ...(_.pickBy(sharedContext, _.identity)));
    if (!_.isEmpty(data['subject'])) {
      data['subject'] = data['subject'][0];
    }
    if (!_.isEmpty(data['medium'])) {
      data['medium'] = data['medium'][0];
    }
    return data;
  }

  getMcqQuestionBody() {
    return {
      'editorState': {
        'question': '',
        'options' : []
      },
      'responseDeclaration': {
        'responseValue': {
          'cardinality': 'single',
          'type': 'integer',
          'correct_response': {
            'value': ''
          }
        }
      }
    };
  }

  getReferenceQuestionBody() {
    return {
      'editorState': {
        'question': '',
        'answer' : ''
      }
    };
  }

  public createItemSet(questionId) {
    const reqBody = {
      'code': UUID.UUID(),
      'name': this.resourceName,
      'description': this.resourceName,
      'language': [
          'English'
      ],
      'owner': this.getUserName(),
      'items': [
        {
          'identifier': questionId
        }
      ]
    };

    return this.itemsetService.createItemset(reqBody).pipe(map((response) => {
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Itemsets creation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));

  }

  public updateItemset(requestBody, identifier) {
    const reqBody = requestBody;
    return this.itemsetService.updateItemset(reqBody, identifier).pipe(map((response) => {
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Content updation failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  public updateContent(reqBody, contentId) {
    return this.helperService.updateContent(reqBody, contentId).pipe(map((response) => {
      this.existingContentVersionKey = _.get(response, 'result.versionKey');
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: this.resourceService.messages.fmsg.m0098 };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  getUserName() {
    let creator = this.userService.userProfile.firstName;
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    }
    return creator;
  }

  handleQuestionFormChangeStatus(event: any) {
    this.goToNextQuestionStatus = event.status;
    console.log(this.goToNextQuestionStatus);
  }

  ngOnDestroy(): void {
    this.sessionContext.questionList = [];
    this.notify.unsubscribe();
  }

  handleBack() {
    this.programStageService.removeLastStage();
  }

  attachContentToTextbook(action) {
    const hierarchyObj  = _.get(this.sessionContext.hierarchyObj, 'hierarchy');
    if (hierarchyObj) {
      const rootOriginInfo = _.get(_.get(hierarchyObj, this.sessionContext.collection), 'originData');
      let channel =  rootOriginInfo && rootOriginInfo.channel;
      if (_.isUndefined(channel)) {
        const originInfo = _.get(_.get(hierarchyObj, this.sessionContext.textBookUnitIdentifier), 'originData');
        channel = originInfo && originInfo.channel;
      }
      const originData = {
        textbookOriginId: _.get(_.get(hierarchyObj, this.sessionContext.collection), 'origin'),
        unitOriginId: _.get(_.get(hierarchyObj, this.sessionContext.textBookUnitIdentifier), 'origin'),
        channel: channel
      };
      if (originData.textbookOriginId && originData.unitOriginId && originData.channel) {
        if (action === 'accept') {
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.resourceDetails.identifier, originData);
        } else if (action === 'reject' && this.FormControl.value.contentRejectComment.length) {
          // tslint:disable-next-line:max-line-length
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.resourceDetails.identifier, originData, this.FormControl.value.contentRejectComment);
        }
      } else {
        action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00102) :
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
        console.error('origin data missing');
      }
    } else {
      action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00102) :
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
      console.error('origin data missing');
    }
  }

  showSourcingOrgRejectComments() {
    if (this.resourceStatus === 'Live' && _.get(this.sessionContext.hierarchyObj, 'sourcingRejectedComments') &&
    _.get(this.sessionContext.hierarchyObj.sourcingRejectedComments, this.resourceDetails.identifier)) {
      this.sourcingOrgReviewComments = _.get(this.sessionContext.hierarchyObj.sourcingRejectedComments, this.resourceDetails.identifier);
     return true;
    } else {
      return false;
    }
  }

  showContributorOrgReviewComments() {
    if (this.resourceDetails && this.resourceDetails.rejectComment && this.sessionContext.currentRoleId === 1 &&
        this.resourceStatus === 'Draft' && this.resourceDetails.prevStatus === 'Review') {
      return true;
    } else {
      return false;
    }
  }
}
