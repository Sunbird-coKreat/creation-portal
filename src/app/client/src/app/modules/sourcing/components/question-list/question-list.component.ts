// tslint:disable-next-line:max-line-length
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { UserService, ActionService, ContentService, NotificationService, ProgramsService, FrameworkService } from '@sunbird/core';
import { TelemetryService, IStartEventInput, IEndEventInput} from '@sunbird/telemetry';
import { tap, map, catchError, mergeMap, first, filter, takeUntil, take } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { of, forkJoin, throwError, Subject } from 'rxjs';
import { SourcingService } from '../../services';
import { ItemsetService } from '../../services/itemset/itemset.service';
import { HelperService } from '../../services/helper.service';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ProgramStageService } from '../../../program/services';
import { ProgramTelemetryService } from '../../../program/services';
import { DeviceDetectorService } from 'ngx-device-detector';


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
  public roles: any;
  public showResourceTitleEditor : any;
  public saveResourceName : any;
  public templateDetails: any;
  public questionList: Array<any> = [];
  public selectedQuestionId: any;
  public questionReadApiDetails: any = {};
  public resourceDetails: any = {};
  public resourceStatus: string;
  public resourceStatusText = '';
  public resourceStatusClass = '';
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
  public popupAction: string;
  public contentComment: string;
  originPreviewUrl = '';
  originPreviewReady = false;
  public originCollectionData: any;
  selectedOriginUnitStatus: any;
  public overrideMetaData: any;
  public isMetadataOverridden = false;
  public formFieldProperties: Array<any>;
  public editableFields = [];
  public showEditMetaForm: boolean;
  public categoryMasterList: Array<any>;
  public requiredAction: string;
  public contentEditRole: string;
  public telemetryStart: IStartEventInput;
  public telemetryEnd: IEndEventInput;
  public pageStartTime;
  private onComponentDestroy$ = new Subject<any>();
  public formstatus: any;
  public formInputData: any;

  constructor(
    public configService: ConfigService, private userService: UserService,
    public actionService: ActionService, private deviceDetectorService: DeviceDetectorService,
    private cdr: ChangeDetectorRef, public toasterService: ToasterService,
    public telemetryService: TelemetryService, private fb: FormBuilder,
    private notificationService: NotificationService, private sourcingService: SourcingService, public contentService: ContentService,
    private itemsetService: ItemsetService, private helperService: HelperService,
    private resourceService: ResourceService, private collectionHierarchyService: CollectionHierarchyService,
    public programStageService: ProgramStageService, public activeRoute: ActivatedRoute,
    public router: Router, private navigationHelperService: NavigationHelperService,
    public programTelemetryService: ProgramTelemetryService, private programsService: ProgramsService,
    public frameworkService: FrameworkService) { }

  ngOnInit() {
    this.overrideMetaData = this.programsService.overrideMetaData;
    this.sessionContext = _.get(this.practiceQuestionSetComponentInput, 'sessionContext');
    this.originCollectionData = _.get(this.practiceQuestionSetComponentInput, 'originCollectionData');
    this.selectedOriginUnitStatus = _.get(this.practiceQuestionSetComponentInput, 'content.originUnitStatus');
    this.selectedSharedContext = _.get(this.practiceQuestionSetComponentInput, 'selectedSharedContext');
    this.roles = _.get(this.practiceQuestionSetComponentInput, 'roles');
    this.templateDetails = _.get(this.practiceQuestionSetComponentInput, 'templateDetails');
    this.programContext = _.get(this.practiceQuestionSetComponentInput, 'programContext');
    this.sessionContext.programContext = this.programContext;
    this.sharedContext = _.get(this.programContext, 'config.sharedContext');
    this.sessionContext.resourceIdentifier = _.get(this.practiceQuestionSetComponentInput, 'contentIdentifier');
    //this.sessionContext.questionType = _.lowerCase(_.nth(this.templateDetails.questionCategories, 0));
    this.sessionContext.textBookUnitIdentifier = _.get(this.practiceQuestionSetComponentInput, 'unitIdentifier');
    this.practiceSetConfig = _.get(this.practiceQuestionSetComponentInput, 'config');
    this.sourcingReviewStatus = _.get(this.practiceQuestionSetComponentInput, 'sourcingStatus') || '';
    this.resourceTitleLimit = this.practiceSetConfig.config.resourceTitleLength;
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    this.sessionContext.telemetryPageId = this.telemetryPageId;
    this.sessionContext.practiceSetConfig = this.practiceSetConfig;
    this.sessionContext.topic = _.isEmpty(this.selectedSharedContext.topic) ? this.sessionContext.topic : this.selectedSharedContext.topic;
    this.getContentMetadata(this.sessionContext.resourceIdentifier);
    this.getLicences();
    this.preprareTelemetryEvents();
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    this.helperService.getNotification().pipe(takeUntil(this.onComponentDestroy$)).subscribe((action) => {
      this.contentStatusNotify(action);
    });

    if ( _.isUndefined(this.sessionContext.topicList) || _.isUndefined(this.sessionContext.frameworkData)) {
      this.fetchFrameWorkDetails();
    }
    this.pageStartTime = Date.now();
    this.setTelemetryStartData();
    this.helperService.initialize(this.programContext);
    if (_.has(this.sessionContext.collectionTargetFrameworkData, 'targetFWIds')) {
      const targetFWIds = this.sessionContext.collectionTargetFrameworkData.targetFWIds;
      if (!_.isUndefined(targetFWIds)) {
        this.helperService.setTargetFrameWorkData(targetFWIds);
      }
    }
  }

  setTelemetryStartData() {
    const telemetryCdata = [{id: this.userService.channel, type: 'sourcing_organization'},
    {id: this.programContext.program_id, type: 'project'}, {id: this.sessionContext.collection, type: 'linked_collection'}];
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    setTimeout(() => {
        this.telemetryStart = {
          context: {
            env: this.activeRoute.snapshot.data.telemetry.env,
            cdata: telemetryCdata || []
          },
          edata: {
            type: this.configService.telemetryLabels.pageType.editor || '',
            pageid: this.telemetryPageId,
            uaspec: {
              agent: deviceInfo.browser,
              ver: deviceInfo.browser_version,
              system: deviceInfo.os_version,
              platform: deviceInfo.os,
              raw: deviceInfo.userAgent
            }
          }
        };
    });
  }

  generateTelemetryEndEvent(eventMode) {
    const telemetryCdata = [{id: this.userService.channel, type: 'sourcing_organization'},
    {id: this.programContext.program_id, type: 'project'}, {id: this.sessionContext.collection, type: 'linked_collection'}];
    this.telemetryEnd = {
      object: {
        id: this.sessionContext.resourceIdentifier || '',
        type: 'content',
      },
      context: {
        env: this.activeRoute.snapshot.data.telemetry.env,
        cdata: telemetryCdata || []
      },
      edata: {
        type: this.configService.telemetryLabels.pageType.editor || '',
        pageid: this.telemetryPageId,
        mode: eventMode || '',
        duration: _.toString((Date.now() - this.pageStartTime) / 1000)
      }
    };
    this.telemetryService.end(this.telemetryEnd);
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryEventsInput.telemetryInteractCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: this.getTelemetryPageType(),
          pageid: this.telemetryPageId,
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  getTelemetryPageType() {
    if (this.router.url.includes('/contribute')) {
      return this.configService.telemetryLabels.pageType.edit;
    } else if (this.router.url.includes('/sourcing')) {
      return this.configService.telemetryLabels.pageType.view;
    } else {
      return _.get(this.activeRoute, 'snapshot.data.telemetry.type');
    }
  }

  fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(takeUntil(this.onComponentDestroy$),
    filter(data => _.get(data, `frameworkdata.${this.sessionContext.framework}`)), take(1)).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        this.sessionContext.frameworkData = frameworkData;
        this.sessionContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }

  fetchCategoryDetails() {
    this.helperService.categoryMetaData$.pipe(take(1), takeUntil(this.onComponentDestroy$)).subscribe(data => {
      this.fetchFormconfiguration();
      this.handleActionButtons();
    });
    const targetCollectionMeta = {
      primaryCategory: (this.sessionContext.targetCollectionPrimaryCategory ) || 'Question paper',
      channelId: _.get(this.programContext, 'rootorg_id'),
      objectType: 'Collection'
    };

    const assetMeta = {
      primaryCategory: this.resourceDetails.primaryCategory,
      channelId: _.get(this.programContext, 'rootorg_id'),
      objectType: this.resourceDetails.objectType
    };

    this.helperService.getCollectionOrContentCategoryDefinition(targetCollectionMeta, assetMeta);
  }

  public preprareTelemetryEvents() {
    // tslint:disable-next-line:max-line-length
    this.telemetryEventsInput.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.sessionContext.resourceIdentifier, 'Content', '1.0', { l1: this.sessionContext.collection, l2: this.sessionContext.textBookUnitIdentifier});
    this.telemetryEventsInput.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    // tslint:disable-next-line:max-line-length
    this.telemetryEventsInput.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
  }

  getTelemetryInteractObject(id: string, type: string) {
    return this.programTelemetryService.getTelemetryInteractObject(id, type, '1.0',
    { l1: this.sessionContext.collection, l2: this.sessionContext.textBookUnitIdentifier, l3: this.sessionContext.resourceIdentifier});
  }

  getContentMetadata(contentId: string) {
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
    };
    this.contentService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to read the Content, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env, request: option
       };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      this.resourceDetails = res;
      /*const contentTypeValue = [this.resourceDetails.contentType];
      const contentType = this.resourceDetails.contentType;
      this.resourceDetails.contentTypeName = contentType;*/
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
      this.resourceName = this.resourceDetails.name || '';
      this.contentRejectComment = this.resourceDetails.rejectComment || '';
      if (!this.resourceDetails.itemSets) {
        this.createDefaultQuestionAndItemset();
      } else {
        const itemSet = this.resourceDetails.itemSets;
        if (itemSet[0].identifier) {
          this.itemSetIdentifier = itemSet[0].identifier;
        }
        this.fetchQuestionList();
      }
      this.handleActionButtons();
      this.fetchCategoryDetails();
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
        if (!_.isEmpty(this.sessionContext.nominationDetails) && !_.isEmpty(this.sessionContext.nominationDetails.user_id) && status !== 'Request') {
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
      this.resourceStatusClass = 'sb-color-warning';
    } else if (this.resourceStatus === 'Draft' && this.resourceDetails.rejectComment && this.resourceDetails.rejectComment !== '') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
      this.resourceStatusClass = 'sb-color-error';
    } else if (this.resourceStatus === 'Draft' && this.resourceDetails.prevStatus === 'Live') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.correctionsPending;
      this.resourceStatusClass = 'sb-color-error';
    } else if (this.resourceStatus === 'Live' && _.isEmpty(this.sourcingReviewStatus)) {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
      this.resourceStatusClass = 'sb-color-success';
    } else if (this.sourcingReviewStatus === 'Rejected') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.rejected;
      this.resourceStatusClass = 'sb-color-error';
    } else if (this.sourcingReviewStatus === 'Approved') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.approved;
      this.resourceStatusClass = 'sb-color-success';
      // tslint:disable-next-line:max-line-length
      if (!_.isEmpty(this.sessionContext.contentOrigins) && !_.isEmpty(this.sessionContext.contentOrigins[this.sessionContext.resourceIdentifier])) {
        // tslint:disable-next-line:max-line-length
        this.originPreviewUrl =  this.helperService.getContentOriginUrl(this.sessionContext.contentOrigins[this.sessionContext.resourceIdentifier].identifier);
      }
      this.originPreviewReady = true;
    } else if (this.resourceStatus === 'Failed') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.failed;
      this.resourceStatusClass = 'sb-color-error';
    } else if (this.resourceStatus === 'Processing') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.processing;
      this.resourceStatusClass = '';
    } else {
      this.resourceStatusText = this.resourceStatus;
      this.resourceStatusClass = 'sb-color-primary';
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

  fetchFormconfiguration() {
    this.formFieldProperties = _.cloneDeep(this.helperService.getFormConfiguration());
    this.getEditableFields();
    _.forEach(this.formFieldProperties, field => {
      if (field.editable && !_.includes(this.editableFields, field.code)) {
        field['editable'] = false;
      }
    });
  }

  showEditform(action) {
    this.fetchFormconfiguration();
    this.requiredAction = action;
    if (_.get(this.selectedSharedContext, 'topic')) {
      // tslint:disable-next-line:max-line-length
      this.sessionContext.topic = _.isArray(this.sessionContext.topic) ? this.selectedSharedContext.topic : _.split(this.selectedSharedContext.topic, ',');
    }

    if (this.requiredAction === 'editForm') {
      this.formFieldProperties = _.filter(this.formFieldProperties, val => val.code !== 'contentPolicyCheck');
    }
    this.validateFormConfiguration();
  }

  validateFormConfiguration() {
    // tslint:disable-next-line:max-line-length
    const errorCondition = this.helperService.validateFormConfiguration(this.sessionContext.targetCollectionFrameworksData, this.formFieldProperties);
    if (errorCondition === true) {
      this.toasterService.error(this.resourceService.messages.emsg.formConfigError);
      this.showEditMetaForm = false;
    } else {
      this.showEditDetailsForm();
    }
  }

  showEditDetailsForm() {
     // tslint:disable-next-line:max-line-length
    this.formFieldProperties = this.helperService.initializeFormFields(this.sessionContext, this.formFieldProperties, this.resourceDetails);
    this.showEditMetaForm = true;
  }

  getEditableFields() {
    if (this.hasRole('CONTRIBUTOR') && this.hasRole('REVIEWER')) {
      if (this.userService.userid === this.resourceDetails.createdBy && this.resourceStatus === 'Draft') {
        this.editableFields = this.helperService.getEditableFields('CONTRIBUTOR', this.formFieldProperties, this.resourceDetails);
        this.contentEditRole = 'CONTRIBUTOR';
      } else if (this.canPublishContent()) {
        this.editableFields = this.helperService.getEditableFields('REVIEWER', this.formFieldProperties, this.resourceDetails);
        this.contentEditRole = 'REVIEWER';
      }
    } else if (this.hasRole('CONTRIBUTOR') && this.resourceStatus === 'Draft') {
      this.editableFields = this.helperService.getEditableFields('CONTRIBUTOR', this.formFieldProperties, this.resourceDetails);
      this.contentEditRole = 'CONTRIBUTOR';
    } else if ((this.sourcingOrgReviewer || (this.visibility && this.visibility.showPublish))
      && (this.resourceStatus === 'Live' || this.resourceStatus === 'Review')
      && !this.sourcingReviewStatus
      && (this.selectedOriginUnitStatus === 'Draft')) {
      this.editableFields = this.helperService.getEditableFields('REVIEWER', this.formFieldProperties, this.resourceDetails);
      this.contentEditRole = 'REVIEWER';
    }
  }

  handleCallback() {
    switch (this.requiredAction) {
      case 'review':
        this.saveMetadataForm(this.sendForReview);
        break;
      case 'publish':
        this.saveMetadataForm(this.publishContent);
        break;
      default:
        this.saveMetadataForm();
        break;
    }
  }

  saveMetadataForm(cb?) {
    if (this.helperService.validateForm(this.formstatus)) {
      console.log(this.formInputData);
      // tslint:disable-next-line:max-line-length
      const formattedData = this.helperService.getFormattedData(_.pick(this.formInputData, this.editableFields), this.formFieldProperties);
      const request = {
        'content': {
          'versionKey': this.existingContentVersionKey,
          ...formattedData
        }
      };

      this.helperService.contentMetadataUpdate(this.contentEditRole, request, this.resourceDetails.identifier).subscribe((res) => {
        this.existingContentVersionKey = _.get(res, 'result.versionKey');
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, res.result.node_id || res.result.identifier)
        .subscribe((data) => {
          this.showEditMetaForm = false;
          if (cb) {
            cb.call(this);
          } else {
            this.getContentMetadata(this.resourceDetails.identifier);
            this.toasterService.success(this.resourceService.messages.smsg.m0060);
          }
        }, (err) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.fmsg.m0098,
            telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
            env : this.activeRoute.snapshot.data.telemetry.env
           };
            this.sourcingService.apiErrorHandling(err, errInfo);
        });
      }, err => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m0098,
          telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env, request: request
         };
          this.sourcingService.apiErrorHandling(err, errInfo);
      });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0101);
    }
  }

  hasAccessFor(roles: Array<string>) {
    return !_.isEmpty(_.intersection(roles, this.sessionContext.currentRoles || []));
  }

  handleActionButtons() {
    this.visibility = {};
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);
    // tslint:disable-next-line:max-line-length
    this.visibility['showCreateQuestion'] = submissionDateFlag && this.canCreateQuestion();
    // tslint:disable-next-line:max-line-length
    this.visibility['showDeleteQuestion'] = submissionDateFlag && this.canDeleteQuestion();
    // tslint:disable-next-line:max-line-length
    this.visibility['showRequestChanges'] = submissionDateFlag && this.canReviewContent();
    // tslint:disable-next-line:max-line-length
    this.visibility['showPublish'] = submissionDateFlag && this.canPublishContent();
    // tslint:disable-next-line:max-line-length
    this.visibility['showSubmit'] = submissionDateFlag && this.canSubmit();
    this.visibility['showSave'] = submissionDateFlag && this.canSave();
    // tslint:disable-next-line:max-line-length
    this.visibility['showEditMetadata'] = submissionDateFlag && this.canEditMetadata();
     // tslint:disable-next-line:max-line-length
    this.visibility['showEdit'] = submissionDateFlag && this.canEdit();
    // tslint:disable-next-line:max-line-length
    this.visibility['showSourcingActionButtons'] = this.canSourcingReviewerPerformActions();
  }

  canDeleteQuestion() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.questionList.length > 1 && this.userService.userid === this.resourceDetails.createdBy);
  }

  questionLimitReached() {
    let limit = _.get(this.sessionContext, 'contentMetadata.maxQuestions', undefined);
    if(limit) return (limit === 1 ? true : this.questionList.length >= limit);
    return false;
  }

  canCreateQuestion() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && !(this.questionLimitReached()) && this.userService.userid === this.resourceDetails.createdBy);
  }

  canEdit() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.userService.userid === this.resourceDetails.createdBy);
  }

  canSubmit() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.userService.userid === this.resourceDetails.createdBy);
  }

  canSave() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && (this.userService.userid === this.resourceDetails.createdBy));
  }

  canEditMetadata() {
    // tslint:disable-next-line:max-line-length
    return !!(_.find(this.formFieldProperties, field => field.editable === true));
  }

  canPublishContent() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/contribute') && !this.resourceDetails.sampleContent === true && this.hasAccessFor(['REVIEWER']) && this.resourceStatus === 'Review' && this.userService.userid !== this.resourceDetails.createdBy);
  }

  canReviewContent() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/contribute') && !this.resourceDetails.sampleContent === true && this.hasAccessFor(['REVIEWER']) && this.resourceStatus === 'Review' && this.userService.userid !== this.resourceDetails.createdBy);
  }

  canSourcingReviewerPerformActions() {
    return !!(this.router.url.includes('/sourcing')
    && !this.resourceDetails.sampleContent === true && this.resourceStatus === 'Live'
    && this.userService.userid !== this.resourceDetails.createdBy
    && this.resourceStatus === 'Live' && !this.sourcingReviewStatus &&
    (this.originCollectionData.status === 'Draft' && this.selectedOriginUnitStatus === 'Draft')
    && this.programsService.isProjectLive(this.programContext));
  }

  canEditContentTitle() {
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);
    // tslint:disable-next-line:max-line-length
    if (submissionDateFlag && this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.userService.userid === this.resourceDetails.createdBy) {
      return true;
    } else if (this.getEditableFieldsACL() === 'REVIEWER') {
      const nameFieldConfig = _.find(this.overrideMetaData, (item) => item.code === 'name');
      if (nameFieldConfig.editable === true) {
        return true;
      }
    }
    return false;
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
            'sort_by': { 'createdOn': 'asc' },
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
    if (!this.checkCurrentQuestionStatus() && !this.questionCreationChild.validateCurrentQuestion()) { return ; }
    this.sessionContext.questionList = [];
    this.sessionContext.questionList.push(questionId);
    this.selectedQuestionId = questionId;
    this.showLoader = true;
    this.getQuestionDetails(questionId).pipe(tap(data => this.showLoader = false))
      .subscribe((assessment_item) => {
        const contentMetadataCreatedBy = _.get(this.practiceQuestionSetComponentInput, 'sessionContext.contentMetadata.createdBy');
        assessment_item.createdBy = contentMetadataCreatedBy ?contentMetadataCreatedBy : _.get(this.practiceQuestionSetComponentInput, 'content.createdBy');
        this.questionMetaData = {
          mode: 'edit',
          data: assessment_item
        };
        if (this.resourceStatus === 'Draft' && this.userService.userid === this.resourceDetails.createdBy) {
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
        const errInfo = {
          errorMsg: 'Fetching Question details failed',
          telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env, request: req
        };
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      }));
  }

  public createNewQuestion(): void {
    if (!this.checkCurrentQuestionStatus() || !this.questionCreationChild.validateCurrentQuestion()) { return ; }
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

    const updateBody = this.sourcingService.getECMLJSON(selectedQuestionsData.ids);
    const versionKey = this.getContentVersion(this.sessionContext.resourceIdentifier);
    const topic = _.isEmpty(this.selectedSharedContext.topic) ? this.sessionContext.topic : this.selectedSharedContext.topic;

    forkJoin([updateBody, versionKey]).subscribe((response: any) => {
      const existingContentVersionKey = _.get(response[1], 'content.versionKey');
      const requestBody = {
        'content': {
          // questions: questions,
          body: JSON.stringify(response[0]),
          versionKey: existingContentVersionKey,
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
            this.toasterService.success(this.resourceService.messages.smsg.m0068);
            if (actionStatus === 'review' && this.isIndividualAndNotSample()) {
              this.showEditform('publish');
            } else if (actionStatus === 'review') {
              this.showEditform('review');
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
          this.generateTelemetryEndEvent('submit');
          this.toasterService.success(this.resourceService.messages.smsg.m0061);
          this.programStageService.removeLastStage();
          this.uploadedContentMeta.emit({
            contentId: contentId
          });
        }, (err) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.fmsg.m0099,
            telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
            env : this.activeRoute.snapshot.data.telemetry.env
           };
            this.sourcingService.apiErrorHandling(err, errInfo);
        });
      }
    }, (err) => {
      const errInfo = {
        errorMsg: this.resourceService.messages.fmsg.m0099,
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env
       };
        this.sourcingService.apiErrorHandling(err, errInfo);
     });
  }

  publishContent() {
    this.helperService.publishContent(this.sessionContext.resourceIdentifier, this.userService.userid)
      .subscribe(res => {
        const contentId = res.result.node_id || res.result.identifier || res.result.content_id;
      this.showPublishModal = false;
      if (this.sessionContext.collection && this.sessionContext.textBookUnitIdentifier) {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.sessionContext.textBookUnitIdentifier, contentId )
        .subscribe((data) => {
          this.generateTelemetryEndEvent('publish');
          this.toasterService.success(this.resourceService.messages.smsg.contentAcceptMessage.m0001);
          this.programStageService.removeLastStage();
          this.uploadedContentMeta.emit({
            contentId: contentId
          });
        });
      }
    }, (err) => {
      const errInfo = {
        errorMsg: this.resourceService.messages.fmsg.m00102,
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env
       };
        this.sourcingService.apiErrorHandling(err, errInfo);
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
            const errInfo = {
              errorMsg: this.resourceService.messages.fmsg.m00100,
              telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
              env : this.activeRoute.snapshot.data.telemetry.env
             };
              this.sourcingService.apiErrorHandling(err, errInfo);
          });
        }
      }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m00100,
          telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env
         };
          this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }
  }

  requestCorrectionsBySourcing() {
    if (this.FormControl.value.contentRejectComment) {
      this.helperService.updateContentStatus(this.resourceDetails.identifier, "Draft", this.FormControl.value.contentRejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        this.contentStatusNotify('Reject');
        this.toasterService.success(this.resourceService.messages.smsg.m0069);
        this.programStageService.removeLastStage();
        this.uploadedContentMeta.emit({
          contentId: res.result.node_id
        });
      }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m00106,
          telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env
         };
          this.sourcingService.apiErrorHandling(err, errInfo);
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

  getContentStatus(contentId) {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}?mode=edit&fields=status,createdBy`
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
      const errInfo = {
        errorMsg: 'Question deletion failed',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env, request: request
       };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
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
      const errInfo = {
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env
       };
        this.sourcingService.apiErrorHandling(error, errInfo);
    });
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


  public createDefaultAssessmentItem() {
    const request = {
      url: `${this.configService.urlConFig.URLS.ASSESSMENT.CREATE}`,
      header: {
        'X-Channel-Id': this.programContext.rootorg_id
      },
      data: this.prepareQuestionReqBody()
    };

    return this.actionService.post(request).pipe(map((response) => {
      this.questionList.push(_.assign(request.data.request.assessment_item.metadata, {'identifier': _.get(response, 'result.node_id')}));
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = {
         errorMsg: 'Default question creation failed',
         telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
         env : this.activeRoute.snapshot.data.telemetry.env, request: request};
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
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
    _.merge(finalBody.request.assessment_item.metadata, this.sessionContext.targetCollectionFrameworksData);
    return finalBody;
  }

  prepareSharedContext() {
    let data = {};
    const sharedContext = this.sharedContext.reduce((obj, context) => {
      return { ...obj, [context]: this.selectedSharedContext[context] || this.sessionContext[context] };
    }, {});
    const sharedMetaData = this.helperService.fetchRootMetaData(this.sharedContext, this.sessionContext);
    data = _.assign(data, _.pickBy(sharedMetaData, _.identity));
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
      const errInfo = {
        errorMsg: 'Itemsets creation failed',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env, request: reqBody };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));

  }

  public updateItemset(requestBody, identifier) {
    const reqBody = requestBody;
    return this.itemsetService.updateItemset(reqBody, identifier).pipe(map((response) => {
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = {
        errorMsg: 'Content updation failed',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env, request: reqBody };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  public updateContent(reqBody, contentId) {
    return this.helperService.updateContent(reqBody, contentId).pipe(map((response) => {
      this.existingContentVersionKey = _.get(response, 'result.versionKey');
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = {
        errorMsg: this.resourceService.messages.fmsg.m0098,
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env, request: reqBody };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  getUserName() {
    let creator = this.userService.getUserProfileDataByKey('firstName');
    if (!_.isEmpty(this.userService.getUserProfileDataByKey('lastName'))) {
      creator = this.userService.getUserProfileDataByKey('firstName') + ' ' + this.userService.getUserProfileDataByKey('lastName');
    }
    return creator;
  }

  handleQuestionFormChangeStatus(event: any) {
    this.goToNextQuestionStatus = event.status;
    console.log(this.goToNextQuestionStatus);
  }

  ngOnDestroy(): void {
    if (this.sessionContext && _.has(this.sessionContext, 'questionList')) {
      this.sessionContext.questionList = [];
    }
    if (this.onComponentDestroy$) {
      this.onComponentDestroy$.next();
      this.onComponentDestroy$.complete();
    }
  }

  handleBack() {
    if(!this.questionCreationChild.validateCurrentQuestion() || !this.checkCurrentQuestionStatus()) {
      return;
    } else {
      this.generateTelemetryEndEvent('back');
      this.programStageService.removeLastStage();
    }
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
          action = this.isMetadataOverridden ? 'acceptWithChanges' : 'accept';
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.resourceDetails.identifier, originData, this.resourceDetails);
        } else if (action === 'reject' && this.FormControl.value.contentRejectComment.length) {
          // tslint:disable-next-line:max-line-length
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.resourceDetails.identifier, originData, this.resourceDetails, this.FormControl.value.contentRejectComment);
        }
      } else {
        action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00102) :
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
        console.error('origin data missing');
      }
    } else {
      action === 'accept' ? this.toasterService.error(this.resourceService.messages.emsg.approvingFailed) :
      this.toasterService.error(this.resourceService.messages.fmsg.m00100);
      console.error('origin data missing');
    }
  }

  showCommentAddedAgainstContent() {
    const id = _.get(this.resourceDetails, 'identifier');
    const sourcingRejectedComments = _.get(this.sessionContext, 'hierarchyObj.sourcingRejectedComments')
    if (id && this.resourceDetails.status === "Draft" && this.resourceDetails.prevStatus  === "Review") {
      // if the contributing org reviewer has requested for changes
      this.contentComment = _.get(this.resourceDetails, 'rejectComment');
      return true;
    } else if (id && !_.isEmpty(_.get(this.resourceDetails, 'requestChanges')) &&
    ((this.resourceDetails.status === "Draft" && this.resourceDetails.prevStatus === "Live") ||
    this.resourceDetails.status === "Live")) {
      // if the souring org reviewer has requested for changes
      this.contentComment = _.get(this.resourceDetails, 'requestChanges');
      return true;
    } else  if (id && this.resourceDetails.status === 'Live' && !_.isEmpty(_.get(sourcingRejectedComments, id))) {
        this.contentComment = _.get(sourcingRejectedComments, id);
        return true;
    }
    return false;
  }


  /*showSourcingOrgRejectComments() {
    const id = _.get(this.resourceDetails, 'identifier');
    const sourcingRejectedComments = _.get(this.sessionContext, 'hierarchyObj.sourcingRejectedComments')
    if (this.resourceStatus === 'Live' && !_.isEmpty(sourcingRejectedComments) && id) {
      this.sourcingOrgReviewComments = sourcingRejectedComments[id];
     return true;
    } else {
      return false;
    }
  }

  showContributorOrgReviewComments() {
    const rejectComment = _.get(this.resourceDetails, 'rejectComment');
    const roles = _.get(this.sessionContext, 'currentRoles');
    return !!(rejectComment && roles.includes('CONTRIBUTOR') && this.resourceStatus === 'Draft' && this.resourceDetails.prevStatus === 'Review');
  }*/

  getEditableFieldsACL() {
    if (this.hasRole('CONTRIBUTOR') && this.hasRole('REVIEWER')) {
      if (this.userService.userid === this.resourceDetails.createdBy && this.resourceStatus === 'Draft') {
        return 'CONTRIBUTOR';
      } else if (this.canPublishContent()) {
        return 'REVIEWER';
      }
    } else if (this.hasRole('CONTRIBUTOR') && this.resourceStatus === 'Draft') {
      return 'CONTRIBUTOR';
    } else if ((this.sourcingOrgReviewer || (this.visibility && this.visibility.showPublish))
      && (this.resourceStatus === 'Live' || this.resourceStatus === 'Review')
      && !this.sourcingReviewStatus
      && (this.selectedOriginUnitStatus === 'Draft')) {
        return 'REVIEWER';
    }
  }

  hasRole(role) {
    return this.sessionContext.currentRoles.includes(role);
  }

  updateContentMetaData(cb = (err, res) => {}) {
    this.getContentVersion(this.sessionContext.resourceIdentifier).subscribe((response: any) => {
      const existingContentVersionKey = _.get(response, 'content.versionKey');
      let requestBody = {
          'versionKey': existingContentVersionKey,
          'name': _.trim(this.resourceName),
          'itemSets': _.map(this.resourceDetails.itemSets, (obj) =>{
            return {'identifier': obj.identifier};
          })
      };
      requestBody = Object.assign({}, requestBody, this.questionCreationChild.getMetaData());
      this.updateContent({'content': requestBody}, this.sessionContext.resourceIdentifier)
      .subscribe((res) => {
          cb(null, res);
        }, (err) => {
          cb(err, null);
        });
    },
    (err) =>{
      cb(err, null);
    });
  }

  isMetaDataModified() {
    const beforeUpdateMetaData = _.clone(this.questionMetaData.data);
    beforeUpdateMetaData['name'] = this.resourceDetails.name;
    const afterUpdateMetaData = this.questionCreationChild.getMetaData();
    afterUpdateMetaData['name'] = _.trim(this.resourceName);
    return this.isMetadataOverridden = this.helperService.isMetaDataModified(beforeUpdateMetaData, afterUpdateMetaData);
  }

  formStatusEventListener(event) {
    this.formstatus = event;
  }

  getFormData(event) {
    this.formInputData = event;
  }
}
