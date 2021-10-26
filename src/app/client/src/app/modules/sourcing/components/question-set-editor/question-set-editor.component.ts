import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, FrameworkService, ProgramsService, ContentService, NotificationService } from '@sunbird/core';
import { IUserProfile, ConfigService, ToasterService, ResourceService,} from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { IContentEditorComponentInput } from '../../interfaces';
import { ProgramStageService } from '../../../program/services';
import { HelperService } from '../../services/helper.service';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { SourcingService } from '../../services';
import { Subject} from 'rxjs';
import * as _ from 'lodash-es';
import { map} from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-question-set-editor',
  templateUrl: './question-set-editor.component.html',
  styleUrls: ['./question-set-editor.component.scss']
})
export class QuestionSetEditorComponent implements OnInit, OnDestroy {
  @Input() questionSetEditorComponentInput: IContentEditorComponentInput;
  @Output() collectionEditorEventEmitter = new EventEmitter<any>();
  questionSetEditorInput: any;
  editorConfig: any;
  editorParams: any;
  private userProfile: IUserProfile;
  private deviceId: string;
  private buildNumber: string;
  private portalVersion: string;
  showLoader = true;
  public hierarchyConfig: any;
  public collectionDetails: any;
  public showQuestionEditor = false;
  public sessionContext: any;
  public programContext: any;
  public unitIdentifier: string;
  public telemetryPageId: string;
  private onComponentDestroy$ = new Subject<any>();
  public hideSubmitForReviewBtn = false;
  public enableQuestionCreation = true;
  public setDefaultCopyright = false;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private telemetryService: TelemetryService, private configService: ConfigService,
    private frameworkService: FrameworkService, private programsService: ProgramsService,
    private contentService: ContentService, public toasterService: ToasterService,
    private resourceService: ResourceService, private programStageService: ProgramStageService,
    private helperService: HelperService, private collectionHierarchyService: CollectionHierarchyService,
    private sourcingService: SourcingService, public router: Router, private notificationService: NotificationService,
    ) {
      const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
      const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
      this.deviceId = deviceId ? deviceId.value : '';
      this.buildNumber = buildNumber ? buildNumber.value : '1.0';
      this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
     }

  ngOnInit() {
    this.questionSetEditorInput = this.questionSetEditorComponentInput;
    this.sessionContext  = _.get(this.questionSetEditorComponentInput, 'sessionContext');
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    this.programContext = _.get(this.questionSetEditorComponentInput, 'programContext');
    this.unitIdentifier  = _.get(this.questionSetEditorComponentInput, 'unitIdentifier');
    this.hideSubmitForReviewBtn = _.get(this.questionSetEditorComponentInput, 'hideSubmitForReviewBtn') || false;
    this.setDefaultCopyright = _.get(this.questionSetEditorComponentInput, 'setDefaultCopyright') || false;
    this.enableQuestionCreation = _.isUndefined(_.get(this.questionSetEditorComponentInput, 'enableQuestionCreation')) ? true : 
      _.get(this.questionSetEditorComponentInput, 'enableQuestionCreation');

    this.editorParams = {
      questionSetId: _.get(this.questionSetEditorComponentInput, 'contentId'),
    };
    if(_.get(this.programContext, 'target_type') === 'questionSets') {
      this.editorParams.questionSetId = _.get(this.sessionContext, 'collection');
      this.editorParams.questionId = _.get(this.questionSetEditorComponentInput, 'contentId');      
      this.editorParams.unitIdentifier = this.unitIdentifier;
    }
    this.userProfile = this.userService.userProfile;
    this.getCollectionDetails().subscribe(data => {
      this.collectionDetails = data.result.questionset;   
      this.showQuestionEditor = this.collectionDetails.mimeType === 'application/vnd.sunbird.questionset' ? true : false;
      // this.getFrameWorkDetails();
      if(_.get(this.programContext, 'target_type') === 'questionSets' && _.get(this.questionSetEditorComponentInput, 'action') !== 'creation') {
        this.getQuestionDetails().subscribe(data => {
          this.collectionDetails = data.result.question;
          this.setEditorConfig();
          this.showLoader = false;
        })
      } 
      else {
        this.setEditorConfig();
        this.showLoader = false;
      }
    });
  }

  private getCollectionDetails() {
    const req = {
      url: `${this.configService.urlConFig.URLS.QUESTIONSET.GET}/${this.editorParams.questionSetId}?mode=edit`
    };
    return this.contentService.get(req).pipe(map((response: any) => response));
  }

  private getQuestionDetails() {
    const req = {
      url: `${this.configService.urlConFig.URLS.QUESTION.READ}/${this.editorParams.questionId}`
    };
    return this.contentService.get(req).pipe(map((response: any) => response));
  }

  setEditorConfig() {
    // tslint:disable-next-line:max-line-length
    this.editorConfig = {
      context: {
        identifier: this.editorParams.questionSetId,
        channel: this.programContext.rootorg_id,
        authToken: '',
        sid: this.userService.sessionId,
        did: this.deviceId,
        uid: this.userService.userid,
        pdata: {
          id: this.userService.appId,
          ver: this.portalVersion,
          pid: 'sunbird-portal'
        },
        actor: {
          id: this.userService.userid || 'anonymous',
          type: 'User'
        },
        contextRollup: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
        tags: this.userService.dims,
        timeDiff: this.userService.getServerTimeDiff,
        defaultLicense: this.frameworkService.getDefaultLicense(),
        endpoint: '/data/v3/telemetry',
        env: this.showQuestionEditor ? 'question_editor' : 'collection_editor',
        user: {
          id: this.userService.userid,
          orgIds: this.userProfile.organisationIds,
          organisations: this.userService.orgIdNameMap,
          fullName : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.firstName + ' ' + this.userProfile.lastName :
          this.userProfile.firstName,
          firstName: this.userProfile.firstName,
          lastName : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.lastName : '',
          isRootOrgAdmin: this.userService.userProfile.rootOrgAdmin
        },
        channelData: this.frameworkService['_channelData'],
        cloudStorageUrls : this.userService.cloudStorageUrls,
        labels: {
          // tslint:disable-next-line:max-line-length
          submit_collection_btn_label: this.sessionContext.sampleContent ? this.resourceService.frmelmnts.btn.submit : this.resourceService.frmelmnts.btn.submitForReview,
          publish_collection_btn_label: this.resourceService.frmelmnts.btn.submitForApproval,
          sourcing_approve_collection_btn_label: this.resourceService.frmelmnts.btn.publishToConsume,
          reject_collection_btn_label: this.resourceService.frmelmnts.btn.requestChanges,
        }
      },
      config: {
        primaryCategory: this.collectionDetails.primaryCategory,
        objectType: this.getObjectType(),
        mode: this.getEditorMode(),
        setDefaultCopyRight: this.setDefaultCopyright,
        showOriginPreviewUrl: false,
        showSourcingStatus: false,
        showCorrectionComments: false,
        enableQuestionCreation: this.enableQuestionCreation, 
        hideSubmitForReviewBtn: this.hideSubmitForReviewBtn
      }
    };
    if (this.showQuestionEditor || this.enableQuestionCreation) {
      this.editorConfig.context.framework = this.collectionDetails.framework || this.frameworkService['_channelData'].defaultFramework;      
    }   
    this.getEditableFields();
    this.getCorrectionComments();
    this.getDikshaPreviewUrl();    
    this.getStatustoShow();
    if (_.get(this.programContext, 'target_type') === 'questionSets') {
      this.setQuestionModeConfig() 
    }
  }

  private getObjectType() {
      return _.get(this.collectionDetails, 'objectType') || 'QuestionSet'
  }

  private setQuestionModeConfig() {
    this.editorConfig.context.identifier = this.editorParams.questionId;
    this.editorConfig.context.collectionIdentifier = this.editorParams.questionSetId;
    this.editorConfig.context.unitIdentifier = this.editorParams.unitIdentifier;
    this.editorConfig.context.collectionObjectType = _.get(this.sessionContext, 'targetCollectionObjectType');
    this.editorConfig.context.collectionPrimaryCategory = _.get(this.sessionContext, 'targetCollectionPrimaryCategory');
    this.editorConfig.context.framework = _.get(this.sessionContext, 'framework');    
 
    this.editorConfig.config.mimeType = _.get(this.collectionDetails, 'mimeType');
    this.editorConfig.config.isReadOnlyMode = this.editorConfig.config.mode === 'edit' ? false : true;
    this.editorConfig.config.showSourcingStatus = this.editorConfig.config.mode === 'edit' ? false : true;
    this.editorConfig.config.interactionType = _.get(this.collectionDetails, 'interactionTypes[0]');    

    if(_.isUndefined(this.editorParams.questionId)) {
      this.setQuestionCreationModeConfigOverrides();    
    }
  }

  private setQuestionCreationModeConfigOverrides() {
    this.editorConfig.config.mimeType = _.get(this.sessionContext, 'templateDetails.mimeType[0]');
    this.editorConfig.config.primaryCategory = _.get(this.sessionContext, 'templateDetails.name');
    this.editorConfig.config.interactionType = _.get(this.sessionContext, 'templateDetails.interactionTypes[0]');
    this.editorConfig.config.objectType = 'Question';
    this.editorConfig.config.mode = 'edit';
    this.editorConfig.config.isReadOnlyMode = false;
    this.editorConfig.config.showSourcingStatus = false;
    delete this.editorConfig.config.enableQuestionCreation;
  }

  private getEditorMode() {
    const contentStatus = this.collectionDetails.status.toLowerCase();
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);

    // If loggedin user is an orgAdmin and project status is draft
    if(this.canModifyProjects()) {
      return 'edit';
    }

    // If loggedin user is a contentCreator and content status is draft
    if (submissionDateFlag && this.canSubmit()) {
      return 'edit';
    }

    if (submissionDateFlag && this.canReviewContent()) {
      return 'orgReview';
    }

    if (this.canSourcingReviewerPerformActions()) {
      return 'sourcingReview';
    }

    return 'read';
  }

  getCorrectionComments() {
      const contentComment = this.helperService.getContentCorrectionComments(this.collectionDetails, this.sessionContext);
      this.editorConfig.config.showCorrectionComments = (contentComment) ? true : false;
      this.editorConfig.context.correctionComments = contentComment;
  }

  getDikshaPreviewUrl() {
    const sourcingReviewStatus = _.get(this.questionSetEditorComponentInput, 'sourcingStatus') || '';
    if (sourcingReviewStatus === 'Approved') {
      this.editorConfig.config.showOriginPreviewUrl = true;
      // tslint:disable-next-line:max-line-length
      if (!_.isEmpty(this.sessionContext.contentOrigins) && !_.isEmpty(this.sessionContext.contentOrigins[this.editorParams.questionSetId])) {
        // tslint:disable-next-line:max-line-length
        this.editorConfig.context.originPreviewUrl =  this.helperService.getQuestionSetOriginUrl(this.sessionContext.contentOrigins[this.editorParams.questionSetId].identifier);
      }
    }
  }

  getStatustoShow() {
      const resourceStatus = this.collectionDetails.status;
      const sourcingReviewStatus = _.get(this.questionSetEditorComponentInput, 'sourcingStatus') || '';

      let resourceStatusText = '';
      let resourceStatusClass = '';
      if (resourceStatus === 'Review') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
        resourceStatusClass = 'sb-color-primary';
      } else if (resourceStatus === 'Draft' && this.collectionDetails.prevStatus === 'Review') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
        resourceStatusClass = 'sb-color-error';
      } else if (resourceStatus === 'Draft' && this.collectionDetails.prevStatus === 'Live') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.correctionsPending;
        resourceStatusClass = 'sb-color-error';
      } else if (resourceStatus === 'Live' && _.isEmpty(sourcingReviewStatus)) {
        resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
        resourceStatusClass = 'sb-color-warning';
      } else if (sourcingReviewStatus === 'Rejected') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.rejected;
        resourceStatusClass = 'sb-color-error';
      } else if (sourcingReviewStatus === 'Approved') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.approved;
        resourceStatusClass = 'sb-color-success';
      } else if (resourceStatus === 'Failed') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.failed;
        resourceStatusClass = 'sb-color-error';
      } else if (resourceStatus === 'Processing') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.processing;
        resourceStatusClass = '';
      } else {
        resourceStatusText = resourceStatus;
        resourceStatusClass = 'sb-color-gray-300';
      }

      this.editorConfig.config.showSourcingStatus = true;
      this.editorConfig.context.sourcingResourceStatus= resourceStatusText;
      this.editorConfig.context.sourcingResourceStatusClass = resourceStatusClass;
  }

  canSourcingReviewerPerformActions() {
    const resourceStatus = this.collectionDetails.status.toLowerCase();
    const sourcingReviewStatus = _.get(this.questionSetEditorInput, 'sourcingStatus') || '';
    const originCollectionData = _.get(this.questionSetEditorInput, 'originCollectionData');
    const selectedOriginUnitStatus = _.get(this.questionSetEditorInput, 'content.originUnitStatus');
    return this.helperService.canSourcingReviewerPerformActions(this.collectionDetails, sourcingReviewStatus, this.programContext, originCollectionData, selectedOriginUnitStatus);
  }

  getEditableFields() {
    this.editorConfig.config['editableFields'] = {};
    const fields = _.map(_.filter(this.programsService.overrideMetaData, {editable: true}), 'code');
    this.editorConfig.config.editableFields.orgreview = fields;
    this.editorConfig.config.editableFields.sourcingreview = fields;
  }

  hasRole(role) {
    return this.sessionContext.currentRoles.includes(role);
  }
  canReviewContent() {
    const resourceStatus = this.collectionDetails.status.toLowerCase();

    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/contribute') && !this.collectionDetails.sampleContent === true && this.hasAccessFor(['REVIEWER']) && resourceStatus === 'review' && this.userService.userid !== this.collectionDetails.createdBy);
  }

  canSubmit() {
    const resourceStatus = this.collectionDetails.status.toLowerCase();
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && resourceStatus === 'draft' && this.userService.userid === this.collectionDetails.createdBy);
  }

  canModifyProjects() {
    const programStatus = this.programContext.status.toLowerCase();
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['ORG_ADMIN']) && programStatus === 'draft' && this.userService.userid === this.programContext.createdby);
  }

  hasAccessFor(roles: Array<string>) {
    return !_.isEmpty(_.intersection(roles, this.sessionContext.currentRoles || []));
  }

  editorEventListener(event) {
   console.log(event);
   switch (event.action) {
    case 'submitContent' :
      // collection is sent for review. If individual contributor or contributor of default org and review is disabled publish the content
      if (this.helperService.isIndividualAndNotSample(this.sessionContext.currentOrgRole, this.sessionContext.sampleContent)) {
        this.publishQuestionSet(event.identifier);
      } else {
       this.programStageService.removeLastStage();
       this.programsService.emitHeaderEvent(true);
      }
      break;
    case 'sendForCorrections':
      this.requestCorrectionsBySourcing(event.identifier, event.comment)
      break;
    case 'sourcingApprove':
      // tslint:disable-next-line:max-line-length
      this.helperService.manageSourcingActions('accept', this.sessionContext, this.programContext, this.unitIdentifier, this.collectionDetails);
      break;
    case 'sourcingReject':
      // tslint:disable-next-line:max-line-length
      this.helperService.manageSourcingActions('reject', this.sessionContext, this.programContext, this.unitIdentifier, this.collectionDetails, event.comment);
      break;
    case 'backContent':
      this.programsService.emitHeaderEvent(true);
      this.programStageService.removeLastStage();
      if(this.enableQuestionCreation === false) this.collectionEditorEventEmitter.emit(event)
      break;
    case 'saveContent':
      this.programsService.emitHeaderEvent(true);
      if(this.enableQuestionCreation === false) this.collectionEditorEventEmitter.emit(event)
      else if(_.get(this.programContext, 'target_type') === 'questionSets') {
        this.collectionEditorEventEmitter.emit(event)
        this.programStageService.removeLastStage();
      }
      break;
    case 'saveCollection': // saving as draft
    default:
      this.programStageService.removeLastStage();
      this.programsService.emitHeaderEvent(true);
      break;
   }
  }

  publishQuestionSet(identifier) {
    this.helperService.publishQuestionSet(identifier, this.userService.userProfile.userId)
       .subscribe(res => {
        if (this.sessionContext.collection && this.questionSetEditorInput.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.questionSetEditorInput.unitIdentifier, res.result.node_id || res.result.identifier || res.result.content_id)
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.contentAcceptMessage.m0001);
            this.programStageService.removeLastStage();
            this.programsService.emitHeaderEvent(true);
          });
        }
      }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m00102,
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activatedRoute.snapshot.data.telemetry.env
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
  }

  requestCorrectionsBySourcing(questionsetId, rejectComment) {
    if (rejectComment) {
      this.helperService.updateQuestionSetStatus(questionsetId, 'Draft', rejectComment)
      .subscribe(res => {
        this.contentStatusNotify('Reject');
        this.toasterService.success(this.resourceService.messages.smsg.m0069);
        this.programStageService.removeLastStage();
        this.programsService.emitHeaderEvent(true);
      }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m00106,
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activatedRoute.snapshot.data.telemetry.env
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }
  }

  contentStatusNotify(status) {
    if (!this.sessionContext.nominationDetails && this.collectionDetails.organisationId && status !== 'Request') {
      const programDetails = { name: this.programContext.name};
      this.helperService.prepareNotificationData(status, this.collectionDetails, programDetails);
    } else {
      const notificationForContributor = {
        user_id: this.collectionDetails.createdBy,
        content: { name: this.collectionDetails.name },
        org: { name:  _.get(this.sessionContext, 'nominationDetails.orgData.name') || '--'},
        program: { name: this.programContext.name },
        status: status
      };
      this.notificationService.onAfterContentStatusChange(notificationForContributor)
      .subscribe((res) => {  });
      // tslint:disable-next-line:max-line-length
      if (!_.isEmpty(this.sessionContext.nominationDetails) && !_.isEmpty(this.sessionContext.nominationDetails.user_id) && status !== 'Request') {
        const notificationForPublisher = {
          user_id: this.sessionContext.nominationDetails.user_id,
          content: { name: this.collectionDetails.name },
          org: { name:  this.sessionContext.nominationDetails.orgData.name},
          program: { name: this.programContext.name },
          status: status
        };
        this.notificationService.onAfterContentStatusChange(notificationForPublisher)
        .subscribe((res) => {  });
      }
    }
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
