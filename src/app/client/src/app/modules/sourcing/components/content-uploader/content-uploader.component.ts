import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef,
  AfterViewInit, ChangeDetectorRef, OnDestroy , ViewRef } from '@angular/core';
import { FineUploader } from 'fine-uploader';
import { ToasterService, ConfigService, ResourceService, NavigationHelperService,
  BrowserCacheTtlService, HttpOptions } from '@sunbird/shared';
import { UserService, ActionService, PlayerService, FrameworkService, NotificationService,
  ProgramsService, ContentService} from '@sunbird/core';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import * as _ from 'lodash-es';
import { catchError, map, filter, take, takeUntil, tap, mergeMap } from 'rxjs/operators';
import { throwError, Observable, Subject, forkJoin, iif, of } from 'rxjs';
import { IContentUploadComponentInput} from '../../interfaces';
import { UntypedFormGroup, UntypedFormArray, Validators, NgForm } from '@angular/forms';
import { SourcingService } from '../../services';
import { AzureFileUploaderService } from '../../services';
import { HelperService } from '../../services/helper.service';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IStartEventInput, IEndEventInput, TelemetryService } from '@sunbird/telemetry';
import { v4 as UUID } from 'uuid';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ProgramComponentsService } from '../../../program/services/program-components/program-components.service';
import { InitialState } from '../../interfaces';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
interface IDynamicInput {
  questionSetEditorComponentInput?: any;
}

@Component({
  selector: 'app-content-uploader',
  templateUrl: './content-uploader.component.html',
  styleUrls: ['./content-uploader.component.scss']
})
export class ContentUploaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modal;
  // @ViewChild('editmodal') editmodal;
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  @ViewChild('qq-upload-actions') actionButtons: ElementRef;
  @ViewChild('titleTextArea') titleTextAreaa: ElementRef;
  @ViewChild('FormControl') FormControl: NgForm;
  // @ViewChild('contentTitle', {static: false}) contentTitle: ElementRef;
  @Input() contentUploadComponentInput: IContentUploadComponentInput;
  public sessionContext: any;
  public sharedContext: any;
  public selectedSharedContext: any;
  public programContext: any;
  public templateDetails: any;
  public unitIdentifier: any;
  public formConfiguration: any;
  public textFields: Array<any>;
  @Output() uploadedContentMeta = new EventEmitter<any>();
  public playerConfig;
  public showPreview = false;
  public resourceStatus;
  public resourceStatusText = '';
  public config: any;
  public resourceStatusClass = '';
  public telemetryStart: IStartEventInput;
  public telemetryEnd: IEndEventInput;
  showForm;
  uploader;
  loading;
  contentURL;
  selectOutcomeOption = {};
  contentDetailsForm: UntypedFormGroup;
  textInputArr: UntypedFormArray;
  formValues: any;
  contentMetaData;
  visibility: any;
  editTitle: string;
  showTextArea: boolean;
  changeFile_instance: boolean;
  showRequestChangesPopup = false;
  showReviewModal = false;
  showUploadModal: boolean;
  submitButton: boolean;
  uploadButton: boolean;
  allFormFields: Array<any>;
  telemetryImpression: any;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;
  public sourcingOrgReviewer: boolean;
  public sourcingReviewStatus: string;
  public contentType: string;
  public popupAction: string;
  // public sourcingOrgReviewComments: string;
  public contentComment: string;
  originPreviewUrl = '';
  originPreviewReady = false;
  public fileUplaoderProgress = {
           progress: 0
         };
  public videoFileFormat: boolean;
  public uploadInprogress: boolean;
  public docExtns: string;
  public vidEtns: string;
  public audioExtns: string;
  public allAvailableVidExtns = ['mp4', 'webm'];
  public videoMimeType = ['video/webm', 'video/mp4'];
  // public allAvailableAudioExtns = ['mp3', 'wav', 'mpeg', 'ogg', 'x-wav'];
  public allAvailableDocExtns = ['pdf', 'epub', 'h5p', 'zip', 'mp3', 'wav', 'mpeg', 'ogg', 'x-wav'];
  public videoSizeLimit: string;
  public originCollectionData: any;
  selectedOriginUnitStatus: any;
  public bulkApprove: any;
  public editableFields = [];
  public isMetadataOverridden = false;
  public formFieldProperties: any;
  public validForm = false;
  public fromSubmited = false;
  public categoryMasterList: any;
  public showEditMetaForm = false;
  public requiredAction: string;
  public contentEditRole: string;
  public pageStartTime;
  private onComponentDestroy$ = new Subject<any>();
  public formstatus: any;
  public formInputData: any;
  public existingContentVersionKey = '';

  // interactive video
  action = { name : 'play' };
  public unFormatedinterceptionTime;
  public interceptionTime: any = '00:00';
  public originalInterceptionTime: any = '00:00';
  public interceptionMetaData: any;
  public showquestionCreationUploadModal: boolean;
  public creationComponent;
  public dynamicInputs: IDynamicInput;
  public questionSetId: any;
  public contentId: any;
  public interceptionData: any;
  public currentLastStageInService: any;
  public currentStage: any;
  public stageSubscription: any;
  public state: InitialState = {
    stages: []
  };
  public interactiveQuestionSets = {};
  public showConfirmationModal = false;
  public selectedQuestionSet: any;
  public showQuestionSetEditModal = false;
  public totalDuration: any;
  public selectedQuestionSetEdit: any;
  public baseUrl: string;
  public showQuestionSetPreview = false;
  public qumlPlayerConfig;
  public enableInteractivity = false;
  public showTranscriptPopup = false;
  public showDownloadTranscriptPopup = false;
  public showDownloadTranscriptButton = false;
  public optionalAddTranscript = false;
  public showAddTrascriptButton = false;
  public transcriptRequired;
  public showAccessibilityPopup = false;
  public accessibilityFormFields: any;
  public captureAccessibilityInfo = false;
  public modifyAccessibilityInfoByReviewer = false;
  public accessibilityInput: any;
  public publicStorageAccount: any;
  public enableContentActions =  false;
  public ischeckBulkUploadStatus = true;

  constructor(public toasterService: ToasterService, private userService: UserService,
    public actionService: ActionService, public playerService: PlayerService,
    public configService: ConfigService, private sourcingService: SourcingService, public frameworkService: FrameworkService,
    public programStageService: ProgramStageService, private helperService: HelperService,
    private collectionHierarchyService: CollectionHierarchyService, private cd: ChangeDetectorRef,
    public resourceService: ResourceService, public programTelemetryService: ProgramTelemetryService,
    private notificationService: NotificationService,
    public activeRoute: ActivatedRoute, public router: Router, private navigationHelperService: NavigationHelperService,
    private programsService: ProgramsService, private azureUploadFileService: AzureFileUploaderService,
    private contentService: ContentService, private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private deviceDetectorService: DeviceDetectorService, private telemetryService: TelemetryService,
    public bulkJobService: BulkJobService,
    public programComponentsService: ProgramComponentsService) {
      this.baseUrl = (<HTMLInputElement>document.getElementById('baseUrl'))
      ? (<HTMLInputElement>document.getElementById('baseUrl')).value : document.location.origin;
      this.transcriptRequired = (<HTMLInputElement>document.getElementById('sunbirdTranscriptRequired')) ?
      (<HTMLInputElement>document.getElementById('sunbirdTranscriptRequired')).value : 'false';
      this.publicStorageAccount = (<HTMLInputElement>document.getElementById('portalCloudStorageUrl')) ?
      (<HTMLInputElement>document.getElementById('portalCloudStorageUrl')).value : 'https://dockstorage.blob.core.windows.net/content-service/';
    }

  ngOnInit() {
    this.config = _.get(this.contentUploadComponentInput, 'config');
    this.originCollectionData = _.get(this.contentUploadComponentInput, 'originCollectionData');
    this.selectedOriginUnitStatus = _.get(this.contentUploadComponentInput, 'content.originUnitStatus');
    this.sessionContext  = _.get(this.contentUploadComponentInput, 'sessionContext');
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    this.templateDetails  = _.get(this.contentUploadComponentInput, 'templateDetails');
    this.unitIdentifier  = _.get(this.contentUploadComponentInput, 'unitIdentifier');
    this.programContext = _.get(this.contentUploadComponentInput, 'programContext');
    this.selectedSharedContext = _.get(this.contentUploadComponentInput, 'selectedSharedContext');
    this.sharedContext = _.get(this.contentUploadComponentInput, 'programContext.config.sharedContext');
    this.sourcingReviewStatus = _.get(this.contentUploadComponentInput, 'sourcingStatus') || '';
    this.bulkApprove = this.cacheService.get('bulk_approval_' + this.sessionContext.collection);
    if (_.get(this.contentUploadComponentInput, 'action') === 'preview') {
      this.showUploadModal = false;
      this.showPreview = true;
      if (!(this.cd as ViewRef).destroyed) {
        this.cd.detectChanges();
      }
      this.getUploadedContentMeta(_.get(this.contentUploadComponentInput, 'contentId'));
    }
    this.segregateFileTypes();
    this.helperService.getNotification().pipe(takeUntil(this.onComponentDestroy$)).subscribe((action) => {
      this.contentStatusNotify(action);
    });
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    this.pageStartTime = Date.now();
    this.setTelemetryStartData();
    this.helperService.initialize(this.programContext);
    const targetFWIds = _.get(this.sessionContext.targetCollectionFrameworksData, 'targetFWIds');
    if (!_.isUndefined(targetFWIds)) {
      this.helperService.setTargetFrameWorkData(targetFWIds);
    }
    this.videoSizeLimit = this.formatBytes(_.toNumber(this.templateDetails.filesConfig.size.defaultVideoSize) * 1024 * 1024);
    // interactive video
    this.currentStage = 'contentUploaderComponent';
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    if (_.has(this.templateDetails, 'objectMetadata.config.enableInteractivity')) {
      this.enableInteractivity = _.get(this.templateDetails, 'objectMetadata.config.enableInteractivity');
    } else {
      this.programsService.getCategoryDefinition(_.get(this.templateDetails, 'name'),
        this.programContext.rootorg_id, 'Content').subscribe((res) => {
          this.enableInteractivity = _.get(res.result.objectCategoryDefinition, 'objectMetadata.config.enableInteractivity');
      });
    }
    this.initAccessibilityDetails();
   }

   setTelemetryStartData() {
    const telemetryCdata = [{id: this.userService.channel, type: 'sourcing_organization'},
    {id: this.programContext.program_id, type: 'project'}, {id: this.sessionContext.collection, type: 'linked_collection'}];
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    setTimeout(() => {
        this.telemetryStart = {
          context: {
            env: this.activeRoute.snapshot.data.telemetry.env,
            cdata: telemetryCdata
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
        id: this.contentMetaData.identifier || '',
        type: 'content',
      },
      context: {
        env: this.activeRoute.snapshot.data.telemetry.env,
        cdata: telemetryCdata
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
    if (_.get(this.contentUploadComponentInput, 'action') !== 'preview') {
      this.showUploadModal = true;
      this.initiateUploadModal();
    }
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata,
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

  fetchFormconfiguration() {
    const formFieldProperties = _.cloneDeep(this.helperService.getFormConfiguration());
    const formContextConfig = _.cloneDeep(this.helperService.getFormConfigurationforContext());
    this.formFieldProperties = _.unionBy(formFieldProperties, formContextConfig, 'code')
    const contentPolicyCheckIndex = _.findIndex(this.formFieldProperties, field => field.code === "contentPolicyCheck");
    if (contentPolicyCheckIndex !== -1) {
      this.formFieldProperties.splice(this.formFieldProperties.length, 0, this.formFieldProperties.splice(contentPolicyCheckIndex, 1)[0]);
    }

    this.getEditableFields();
    _.forEach(this.formFieldProperties, field => {
      if (field.editable && !_.includes(this.editableFields, field.code)) {
        field['editable'] = false;
      }
    });
  }

  initAccessibilityDetails() {
    const primaryCategory = _.get(this.templateDetails, 'name');
    this.programsService.getCategoryDefinition(primaryCategory, this.programContext.rootorg_id, 'Content').pipe(
      map((res: any) => {
        this.captureAccessibilityInfo = _.get(res.result.objectCategoryDefinition, 'objectMetadata.config.captureAccessibilityInfo', false);
        // tslint:disable-next-line:max-line-length
        this.modifyAccessibilityInfoByReviewer = _.get(res.result.objectCategoryDefinition, 'objectMetadata.config.modifyAccessibilityInfoByReviewer', false);
        this.accessibilityFormFields = _.get(res.result.objectCategoryDefinition, 'objectMetadata.config.accessibility', '');
        return this.accessibilityFormFields;
    }),
    mergeMap(accessibilityFormFields => iif(() => _.isEmpty(accessibilityFormFields),
      this.getSystemLevelConfig().pipe(map((res: any) => {
        this.accessibilityFormFields = _.get(res, 'accessibility', '');
        this.captureAccessibilityInfo = _.get(res, 'captureAccessibilityInfo', false);
        this.modifyAccessibilityInfoByReviewer = _.get(res, 'modifyAccessibilityInfoByReviewer', false);
        return this.accessibilityFormFields;
      })), of(accessibilityFormFields))
    )).subscribe((response: any) => {
      // console.log(response);
    }, (err: any) => {
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.formConfigError,
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env,
        request: {}
      };
    });
  }

  handleAccessibilityPopup() {
    if (_.isEmpty(this.accessibilityFormFields)) {
      this.toasterService.error(this.resourceService.messages.emsg.formConfigError);
      return;
    }

    const contentAccessibility = _.get(this.contentMetaData, 'accessibility', []);
    const role = this.getRole();
    _.forEach(this.accessibilityFormFields, field => {
      if (_.findIndex(contentAccessibility, _.pick(field, ['need', 'feature'])) !== -1 ) {
        field['isSelected'] = true;
      } else {
        field['isSelected'] = false;
      }
      if (role === 'CONTRIBUTOR') {
        field['editable'] = true;
      } else if (role === 'REVIEWER') {
        field['editable'] = this.modifyAccessibilityInfoByReviewer ? true : false;
      } else {
        field['editable'] = false;
      }

    });
    this.accessibilityInput = {
      accessibilityFormFields: this.accessibilityFormFields,
      role,
      contentMetaData: {...this.contentMetaData, versionKey: this.existingContentVersionKey},
      selectedAccessibility: contentAccessibility,
      contentId: this.contentId,
      telemetryPageId: this.telemetryPageId,
      telemetryInteractCdata: this.telemetryInteractCdata,
      telemetryInteractObject: this.telemetryInteractObject,
      telemetryInteractPdata: this.telemetryInteractPdata
    };
    this.showAccessibilityPopup = true;
  }

  getSystemLevelConfig(): Observable<any> {
    const req = {
      url: `${this.publicStorageAccount}schemas/content/1.0/config.json`,
    };
    return this.actionService.http.get(req.url).pipe(map((response: any) => {
      return response;
    }));
  }

  accessibilityListener(event: any) {
    if (event && event.type === 'submit') {
        this.showAccessibilityPopup = false;
        this.getUploadedContentMeta(this.contentMetaData.identifier);
    } else if (event && event.type === 'close') {
        this.showAccessibilityPopup = false;
    }
  }

  showEditform(action) {
    if (action === 'review') {
      if (this.transcriptRequired === 'true'
        && _.isEmpty(this.contentMetaData.transcripts)
        && _.includes(this.videoMimeType, this.contentMetaData.mimeType)) {
          this.toasterService.error(this.resourceService?.messages?.emsg?.addTranscript);
          return false;
      }
    }

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
    this.formFieldProperties = this.helperService.initializeFormFields(this.sessionContext, this.formFieldProperties, this.contentMetaData);
    this.showEditMetaForm = true;
  }

  hasAccessFor(roles: Array<string>) {
    return !_.isEmpty(_.intersection(roles, this.sessionContext.currentRoles || []));
  }

  handleActionButtons() {
    this.visibility = {};
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);
    // tslint:disable-next-line:max-line-length
    this.visibility['showChangeFile'] = submissionDateFlag && this.canChangeFile();
    // tslint:disable-next-line:max-line-length
    this.visibility['showRequestChanges'] = submissionDateFlag && this.canReviewContent();
    // tslint:disable-next-line:max-line-length
    this.visibility['showPublish'] = submissionDateFlag && this.canPublishContent();
    // tslint:disable-next-line:max-line-length
    this.visibility['showSubmit'] = submissionDateFlag && this.canSubmit();
    // tslint:disable-next-line:max-line-length
    this.visibility['showEditMetadata'] = submissionDateFlag && this.canEditMetadata();
    // tslint:disable-next-line:max-line-length
    this.visibility['showEdit'] = submissionDateFlag && this.canEdit();
    // tslint:disable-next-line:max-line-length
    this.visibility['showSourcingActionButtons'] = this.helperService.canSourcingReviewerPerformActions(this.contentMetaData, this.sourcingReviewStatus, this.programContext, this.originCollectionData, this.selectedOriginUnitStatus);
    this.visibility['showSendForCorrections'] = this.visibility['showSourcingActionButtons'] && this.canSendForCorrections();
  }

  canSendForCorrections() {
    return !this.contentMetaData.sourceURL;
  }

  canEdit() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.userService.userid === this.contentMetaData.createdBy);
  }

  canSave() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && !this.contentMetaData.sampleContent === true && this.resourceStatus === 'Draft' && (this.userService.userid === this.contentMetaData.createdBy));
  }

  canEditMetadata() {
    // tslint:disable-next-line:max-line-length
    return !!(_.find(this.formFieldProperties, field => field.editable === true));
  }

  canSubmit() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.userService.userid === this.contentMetaData.createdBy);
  }

  canChangeFile() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.userService.userid === this.contentMetaData.createdBy);
  }

  canViewContentType() {
    // tslint:disable-next-line:max-line-length
    return !!(this.sourcingOrgReviewer || (this.sessionContext.currentRoles.includes('REVIEWER') && this.userService.userid !== this.contentMetaData.createdBy));
  }

  canPublishContent() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/contribute') && !this.contentMetaData.sampleContent === true &&
    // tslint:disable-next-line:max-line-length
    this.hasAccessFor(['REVIEWER']) && this.resourceStatus === 'Review' && this.userService.userid !== this.contentMetaData.createdBy);
  }

  canReviewContent() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/contribute') && !this.contentMetaData.sampleContent === true && this.hasAccessFor(['REVIEWER']) && this.resourceStatus === 'Review' && this.userService.userid !== this.contentMetaData.createdBy);
  }

  initiateUploadModal() {
    setTimeout(() => {
      this.uploader = new FineUploader({
        element: document.getElementById('upload-content-div'),
        template: 'qq-template-validation',
        multiple: false,
        autoUpload: false,
        request: {
          endpoint: '/assets/uploads'
        },
        validation: {
          allowedExtensions: (!_.includes(this.templateDetails.filesConfig.accepted, ',')) ?
            this.templateDetails.filesConfig.accepted.split(' ') : this.templateDetails.filesConfig.accepted.split(', '),
          acceptFiles: this.getAcceptedFiles(),
          itemLimit: 1
          // sizeLimit: 20 * 1024 * 1024  // 52428800  = 50 MB = 50 * 1024 * 1024 bytes
        },
        messages: {
          // sizeError: `{file} is too large, maximum file size is ${this.templateDetails.filesConfig.size} MB.`,
          typeError: `Invalid content type (supported type: ${this.templateDetails.filesConfig.accepted})`
        },
        callbacks: {
          onStatusChange: () => {
          },
          onSubmit: () => {
            this.uploadContent();
          },
          onError: () => {
            this.uploader.reset();
          }
        }
      });
      this.fineUploaderUI.nativeElement.remove();
    }, 0);
  }

  getAcceptedFiles() {
    let acceptedFiles = '';
    if (this.contentMetaData && this.contentMetaData.mimeType) {
      acceptedFiles = this.contentMetaData.mimeType;
    } else {
      acceptedFiles = this.templateDetails.mimeType ? _.map(this.templateDetails.mimeType, (mimeType) => {
        if (mimeType === 'application/epub') {
          return '.epub';
        } else if (mimeType === 'application/vnd.ekstep.h5p-archive') {
          return '.h5p';
        } else if (mimeType === 'application/vnd.ekstep.html-archive') {
          return '.zip';
        } else if (mimeType === 'audio/mp3') {
          return '.mp3';
        } else {
          return mimeType;
        }
      }) : '';
    }
    return acceptedFiles.toString();
  }


  segregateFileTypes() {
    const extns = (!_.includes(this.templateDetails.filesConfig.accepted, ',')) ?
    this.templateDetails.filesConfig.accepted.split(' ') : this.templateDetails.filesConfig.accepted.split(', ');
    this.vidEtns =  _.join(_.intersection(extns, this.allAvailableVidExtns), ', ');
    this.docExtns = _.join(_.intersection(extns, this.allAvailableDocExtns), ', ');
    this.docExtns = _.replace(this.docExtns, 'zip', 'html zip');
    // this.audioExtns = _.join(_.intersection(extns, this.allAvailableAudioExtns), ', ');
  }

  checkFileSizeLimit(fileUpload, mimeType) {
    if (this.videoFileFormat) {
        const val = _.toNumber(this.templateDetails.filesConfig.size.defaultVideoSize) * 1024 * 1024;
        if (this.uploader.getSize(0) < val) {
          this.uploadByURL(fileUpload, mimeType);
        } else {
          this.handleSizeLimitError(this.formatBytes(val));
        }
    } else if (this.uploader.getSize(0) < (_.toNumber(this.templateDetails.filesConfig.size.defaultfileSize) * 1024 * 1024)) {
      this.uploadByURL(fileUpload, mimeType);
    } else {
      this.handleSizeLimitError(`${this.templateDetails.filesConfig.size.defaultfileSize} MB`);
    }
  }

  handleSizeLimitError(val) {
    val ? alert(`File is too large. Maximum File Size is ${val}`) :
          alert('something went wrong, Please try later!');
    this.uploader.reset();
    this.uploadButton = false;
  }

  uploadContent() {
    if (this.uploader.getFile(0) == null && !this.contentURL) {
      this.toasterService.error('File is required to upload');
      this.uploader.reset();
      return;
    }
    let fileUpload = false;
    if (this.uploader.getFile(0) != null) {
      this.uploadButton = true;
      fileUpload = true;
    }
    this.fileUplaoderProgress['size'] = this.formatBytes(this.uploader.getSize(0));
    const mimeType = fileUpload ? this.detectMimeType(this.uploader.getName(0)) : this.detectMimeType(this.contentURL);
    if (!mimeType) {
      this.toasterService.error(`Invalid content type (supported type: ${this.templateDetails.filesConfig.accepted})`);
      this.uploader.reset();
      return;
    } else {
      if (_.includes(mimeType.toString(), 'video')) {
        this.videoFileFormat = true;
      }
      this.checkFileSizeLimit(fileUpload, mimeType);
    }
    this.action = { name : 'play' };
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  uploadByURL(fileUpload, mimeType) {
    this.loading = true;
    if (fileUpload && !this.uploadInprogress && !this.contentMetaData && !this.contentUploadComponentInput.contentId) {
      const createContentReq = this.helperService.createContent(this.contentUploadComponentInput, mimeType);

      createContentReq.pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = {
          errorMsg: 'Unable to create contentId, Please Try Again',
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env, request: {}
         };
        this.programStageService.removeLastStage();
        this.programsService.emitHeaderEvent(true);
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      })).subscribe(result => {
        this.contentId = result.identifier;
        if (!_.get(this.programContext, 'target_type') || _.get(this.programContext, 'target_type') === 'collections') {
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, result.identifier)
            .subscribe(() => {
              this.uploadFile(mimeType, result.node_id);
            }, (err) => {
              this.programStageService.removeLastStage();
            });
        } else {
          this.uploadFile(mimeType, result.identifier);
        }
      });
    } else if (!this.uploadInprogress) {
      this.uploadFile(mimeType, this.contentMetaData ? this.contentMetaData.identifier : this.contentUploadComponentInput.contentId);
    }
  }

  uploadFile(mimeType, contentId) {
    const contentType = mimeType;
    // document.getElementById('qq-upload-actions').style.display = 'none';
    const option = {
      url: `${this.configService.urlConFig.URLS.DOCKCONTENT.PRE_SIGNED_UPLOAD_URL}/${contentId}`,
      data: {
        request: {
          content: {
            fileName: this.uploader.getName(0)
          }
        }
      }
    };
    this.actionService.post(option).pipe(catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to get pre_signed_url and Content Creation Failed, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
        env : this.activeRoute.snapshot.data.telemetry.env, request: option
       };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      const signedURL = res.result.pre_signed_url;
      this.uploadInprogress = true;
      if (this.videoFileFormat) {
        // tslint:disable-next-line:max-line-length
        this.azureUploadFileService.uploadToBlob(signedURL, this.uploader.getFile(0)).pipe(takeUntil(this.onComponentDestroy$)).subscribe((event: any) => {
          this.fileUplaoderProgress.progress = event.percentComplete;
          this.fileUplaoderProgress['remainingTime'] = event.remainingTime;
        }, (error) => {
          const errInfo = {
            errorMsg: 'Unable to upload to Blob, Please Try Again',
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
            env : this.activeRoute.snapshot.data.telemetry.env, request: signedURL
           };
          this.sourcingService.apiErrorHandling(error, errInfo);
          console.error(error);
          this.uploadInprogress = false;
        }, () => {
          const fileURL = signedURL.split('?')[0];
          this.updateContentWithURL(fileURL, mimeType, contentId);
        });
      } else {
        const headers = this.helperService.addCloudStorageProviderHeaders();
        const config = {
          processData: false,
          contentType: contentType,
          headers: headers
        };
        this.uploadToBlob(signedURL, config).subscribe(() => {
          const fileURL = signedURL.split('?')[0];
          this.updateContentWithURL(fileURL, mimeType, contentId);
        }, err => {
          console.error(err);
          this.uploadInprogress = false;
        });
      }
    });
  }

  uploadToBlob(signedURL, config): Observable<any> {
    return this.actionService.http.put(signedURL, this.uploader.getFile(0), config).pipe(catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to upload to Blob, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
        env : this.activeRoute.snapshot.data.telemetry.env, request: signedURL };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
  }), map(data => data));
  }

  updateContentWithURL(fileURL, mimeType, contentId) {
    const data = new FormData();
    data.append('fileUrl', fileURL);
    data.append('mimeType', mimeType);
    const config = {
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      cache: false
    };
    const option = {
      url: `${this.configService.urlConFig.URLS.DOCKCONTENT.UPLOAD}/${contentId}`,
      data: data,
      param: config
    };
    this.actionService.post(option).pipe(catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to update pre_signed_url with Content Id and Content Creation Failed, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
        env : this.activeRoute.snapshot.data.telemetry.env, request: option
       };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
     this.uploadInprogress = false;
      this.toasterService.success('Content Successfully Uploaded...');
      this.getUploadedContentMeta(contentId, false);
      this.uploadedContentMeta.emit({
        contentId: contentId
      });
    }, err => {
      this.uploadInprogress = false;
    });
  }

//   }
    getTelemetryData() {
      // tslint:disable-next-line:max-line-length
      this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
      // tslint:disable-next-line:max-line-length
      this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
      // tslint:disable-next-line:max-line-length
      this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.contentMetaData.identifier, 'Content', '1.0', { l1: this.sessionContext.collection, l2: this.unitIdentifier});
    }

  getUploadedContentMeta(contentId, uploadModalClose = true) {
    this.showPreview = false;
    const option = {
      url: `${this.configService.urlConFig.URLS.DOCKCONTENT.GET}/${contentId}`
    };
    this.actionService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      this.showPreview = true;
      const errInfo = {
        errorMsg: 'Unable to read the Content, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
        env : this.activeRoute.snapshot.data.telemetry.env, request: option
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
    this.showPreview = true;
      this.interceptionMetaData = _.get(res, 'interceptionPoints');
      if (!_.isEmpty(this.interceptionMetaData)) {
        this.getInteractiveQuestionSet().subscribe(
          (response) => {
            const questionSets = _.get(response, 'result.QuestionSet');
            if (!_.isEmpty(questionSets)) {
              _.forEach(questionSets, questionSet => {
                this.interactiveQuestionSets[questionSet.identifier] = [questionSet.name];
              });
            }
          }
        );
      }
      this.contentId = res.identifier;
      const contentDetails = {
        contentId: contentId,
        contentData: res
      };
      this.contentMetaData = res;
      if (this.ischeckBulkUploadStatus && _.get(this.contentMetaData, 'processId') &&
       (this.userService.isContributingOrgReviewer(this.sessionContext.nominationDetails) ||
      this.userService.isSourcingOrgReviewer(this.programContext) || this.userService.isContributingOrgAdmin())) {
        this.checkBulkUploadStatus();
      } else {
        this.enableContentActions = true;
      }
      this.existingContentVersionKey = res.versionKey;
      if (_.includes(this.contentMetaData.mimeType.toString(), 'video')) {
        this.videoFileFormat = true;
      } else {
        this.videoFileFormat = false;
      }
      this.editTitle = this.contentMetaData.name || '' ;
      this.resourceStatus = this.contentMetaData.status;
      if (this.resourceStatus === 'Review') {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
        this.resourceStatusClass = 'sb-color-primary';
      } else if (this.resourceStatus === 'Draft' && this.contentMetaData.prevStatus === 'Review') {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
        this.resourceStatusClass = 'sb-color-error';
      } else if (this.resourceStatus === 'Draft' && this.contentMetaData.prevStatus === 'Live') {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.correctionsPending;
        this.resourceStatusClass = 'sb-color-error';
      } else if (this.resourceStatus === 'Live' && _.isEmpty(this.sourcingReviewStatus)) {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
        this.resourceStatusClass = 'sb-color-warning';
      } else if (this.sourcingReviewStatus === 'Rejected') {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.rejected;
        this.resourceStatusClass = 'sb-color-error';
      } else if (this.sourcingReviewStatus === 'Approved') {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.approved;
        this.resourceStatusClass = 'sb-color-success';
        // get the origin preview url
        if (!_.isEmpty(this.sessionContext.contentOrigins) && !_.isEmpty(this.sessionContext.contentOrigins[contentId])) {
          this.originPreviewUrl =  this.helperService.getContentOriginUrl(this.sessionContext.contentOrigins[contentId].identifier);
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
        this.resourceStatusClass = 'sb-color-gray-300';
      }

      this.playerConfig = this.playerService.getConfig(contentDetails);
      this.playerConfig.context.pdata.pid = `${this.configService.appConfig.TELEMETRY.PID}`;
      this.playerConfig.context.cdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
      this.showPreview = this.contentMetaData.artifactUrl ? true : false;

      if (uploadModalClose) {
        this.showUploadModal = false;
      } else if (!_.includes(this.videoMimeType, this.contentMetaData.mimeType)) {
        this.showUploadModal = false;
      }

      if (!this.contentMetaData.artifactUrl) {
        this.showUploadModal = true;
        this.initiateUploadModal();
      }

      this.loading = false;
      this.handleActionButtons();
      this.showCommentAddedAgainstContent();
      if (!uploadModalClose) {
        this.enableOptionalAddTranscript(this.contentMetaData);
      }

      this.showDownloadTranscript(this.contentMetaData);
      this.allowAddTranscript(this.contentMetaData);

      // At the end of execution
      if ( _.isUndefined(this.sessionContext.topicList) || _.isUndefined(this.sessionContext.frameworkData)) {
        this.helperService.fetchProgramFramework(this.sessionContext);
      }
      this.fetchCategoryDetails();
      this.getTelemetryData();
      if (!(this.cd as ViewRef).destroyed) {
        this.cd.detectChanges();
      }
    });
  }
  checkBulkUploadStatus() {
    const processId = _.get(this.contentMetaData, 'processId');
    if (processId) {
      this.bulkJobService.bulkJobProcessRead(processId).subscribe(response => {
        if (_.get(response, 'result.status') === 'completed') {
          this.enableContentActions = true;
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.bulkUploadInProgress);
        }
      }, (err: any) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m0051,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata: this.telemetryInteractCdata,
          env: this.activeRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }
    this.ischeckBulkUploadStatus = false;
  }
  public closeUploadModal() {
    this.action = { name : 'play' };
    this.optionalAddTranscript = false;
    this.loading = false;
    if (this.modal && this.modal.deny && this.changeFile_instance) {
      this.showPreview = true;
      this.showUploadModal = false;
      this.changeFile_instance = false;
      this.showquestionCreationUploadModal = false;
      this.showConfirmationModal = false;
      this.showQuestionSetEditModal = false;
    } else if (this.modal && this.modal.deny && this.showUploadModal) {
      this.modal.deny();
      this.programStageService.removeLastStage();
      this.programsService.emitHeaderEvent(true);
    }
    this.showquestionCreationUploadModal = false;
    this.showConfirmationModal = false;
    this.showQuestionSetEditModal = false;
    this.showQuestionSetPreview = false;
    if (this.videoFileFormat) {
      this.azureUploadFileService.abortUpload();
    }
  }

  detectMimeType(fileName) {
    const extn = fileName.split('.').pop();
    const appFilesConfig = this.configService.contentCategoryConfig.sourcingConfig.files;
    let thisFileMimetype = '';

    _.forEach(appFilesConfig, (item, key) => {
      if (item === extn) {
        thisFileMimetype = key;
      }
    });

    return thisFileMimetype;
  }


  fetchCategoryDetails() {
    let reqs = [] ;
    reqs.push(this.helperService.categoryMetaData$.pipe(take(1), takeUntil(this.onComponentDestroy$)));
    reqs.push(this.helperService.formConfigForContext$.pipe(take(1), takeUntil(this.onComponentDestroy$)));
    forkJoin(reqs).subscribe(data => {
      this.fetchFormconfiguration();
      this.handleActionButtons();
    });

    const targetCollectionMeta = {
      primaryCategory: (this.sessionContext.targetCollectionPrimaryCategory ) || 'Question paper',
      channelId: _.get(this.programContext, 'rootorg_id'),
      objectType: 'Collection'
    };

    const assetMeta = {
      primaryCategory: this.contentMetaData.primaryCategory,
      channelId: _.get(this.programContext, 'rootorg_id'),
      objectType: this.contentMetaData.objectType
    };

    this.helperService.getCollectionOrContentCategoryDefinition(targetCollectionMeta, assetMeta, this.programContext.target_type);
    const contextType = this.sessionContext.frameworkType || _.get(this.programContext, 'config.frameworkObj.type');
    this.helperService.getformConfigforContext(this.programContext.rootorg_id, 'framework', contextType, 'content', 'create', _.get(this.sessionContext, 'targetCollectionPrimaryCategory'));
  }

  changePolicyCheckValue (event) {
    if ( event.target.checked ) {
      this.contentDetailsForm.controls.contentPolicyCheck.setValue(true);
    } else {
      this.contentDetailsForm.controls.contentPolicyCheck.setValue(false);
    }
  }

  saveMetadataForm(cb?, emitHeaderEvent?) {
    if (this.helperService.validateForm(this.formstatus)) {
      // tslint:disable-next-line:max-line-length
      const formattedData = this.helperService.getFormattedData(_.pick(this.formInputData, this.editableFields), this.formFieldProperties);
      const request = {
        'content': {
          'versionKey': this.contentMetaData.versionKey,
          ...formattedData
        }
      };

      this.helperService.contentMetadataUpdate(this.contentEditRole, request, this.contentMetaData.identifier).subscribe((res) => {
        this.existingContentVersionKey = _.get(res, 'result.versionKey');
        if (this.sessionContext.collection && this.unitIdentifier) {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
        .subscribe((data) => {
          if (emitHeaderEvent) {
            this.programsService.emitHeaderEvent(true);
          }
          this.showEditMetaForm = false;
            if (cb) {
              cb.call(this);
            } else {
              this.getUploadedContentMeta(this.contentMetaData.identifier);
              this.toasterService.success(this.resourceService.messages.smsg.m0060);
            }
          }, (err) => {
            const errInfo = {
              errorMsg: this.resourceService.messages.fmsg.m0098,
              telemetryPageId: this.telemetryPageId,
              telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
              env : this.activeRoute.snapshot.data.telemetry.env
            };
            this.sourcingService.apiErrorHandling(err, errInfo);
          });
        } else {
          this.showEditMetaForm = false;
          if (cb) {
            cb.call(this);
          } else {
            this.getUploadedContentMeta(this.contentMetaData.identifier);
            this.toasterService.success(this.resourceService.messages.smsg.m0060);
          }
        }
      }, err => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m0098,
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env, request: request
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    } else {
      this.toasterService.error(this.resourceService.messages.fmsg.m0101);
    }
  }

  handleCallback() {
    switch (this.requiredAction) {
      case 'review':
        this.saveMetadataForm(this.sendForReview, true);
        break;
      case 'publish':
        this.saveMetadataForm(this.publishContent, true);
        break;
      default:
        this.saveMetadataForm();
        break;
    }
  }

  sendForReview() {
    if (this.contentMetaData.interceptionPoints) {
      const interceptionPoints = _.get(this.contentMetaData.interceptionPoints, 'items');
      if (interceptionPoints) {
        const questionSetPublishReq = interceptionPoints.map(interceptionData => {
          return this.helperService.reviewQuestionSet(interceptionData.identifier);
        });
        forkJoin(questionSetPublishReq).subscribe(data => {
          this.reviewAndAddResourceToHierarchy();
        }, (err) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.fmsg.m0099,
            // tslint:disable-next-line:max-line-length
            // telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
            env : this.activeRoute.snapshot.data.telemetry.env
          };
          this.sourcingService.apiErrorHandling(err, errInfo);
          this.getUploadedContentMeta(this.contentMetaData.identifier);
        });
      } else {
        this.reviewAndAddResourceToHierarchy();
      }
    } else {
      this.reviewAndAddResourceToHierarchy();
    }
  }

  reviewAndAddResourceToHierarchy() {
    this.helperService.reviewContent(this.contentMetaData.identifier)
       .subscribe((res) => {
        if (this.sessionContext.collection && this.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
          .subscribe((data) => {
            this.generateTelemetryEndEvent('submit');
            this.toasterService.success(this.resourceService.messages.smsg.m0061);
            this.programStageService.removeLastStage();
            this.programsService.emitHeaderEvent(true);
            this.uploadedContentMeta.emit({
              contentId: res.result.content_id
            });
          }, (err) => {
            const errInfo = {
              errorMsg: this.resourceService.messages.fmsg.m0099,
              telemetryPageId: this.telemetryPageId,
              telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
              env : this.activeRoute.snapshot.data.telemetry.env
            };
            this.sourcingService.apiErrorHandling(err, errInfo);
          });
        } else {
          this.generateTelemetryEndEvent('submit');
          this.toasterService.success(this.resourceService.messages.smsg.m0061);
          this.programsService.emitHeaderEvent(true);
          this.programStageService.removeLastStage();
          this.uploadedContentMeta.emit({
            contentId: res.result.content_id
          });
        }
       }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m0099,
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
       });
  }

  requestChanges() {
    if (this.FormControl.value.rejectComment) {
      this.helperService.submitRequestChanges(this.contentMetaData.identifier, this.FormControl.value.rejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        this.contentStatusNotify('Request');
        if (this.sessionContext.collection && this.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0062);
            this.programStageService.removeLastStage();
            this.programsService.emitHeaderEvent(true);
            this.uploadedContentMeta.emit({
              contentId: res.result.node_id
            });
          });
        } else {
          this.toasterService.success(this.resourceService.messages.smsg.m0062);
          this.programStageService.removeLastStage();
          this.programsService.emitHeaderEvent(true);
          this.uploadedContentMeta.emit({
            contentId: res.result.content_id
          });
        }
      }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m00100,
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }
  }

  requestCorrectionsBySourcing() {
    if (this.FormControl.value.rejectComment) {
      this.helperService.updateContentStatus(this.contentMetaData.identifier, 'Draft', this.FormControl.value.rejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        this.contentStatusNotify('Reject');
        this.toasterService.success(this.resourceService.messages.smsg.m0069);
        this.programStageService.removeLastStage();
        this.programsService.emitHeaderEvent(true);
        this.uploadedContentMeta.emit({
          contentId: res.result.node_id
        });
      }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m00106,
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }
  }

  publishContent() {
    if (this.contentMetaData.interceptionPoints) {
      const interceptionPoints = _.get(this.contentMetaData.interceptionPoints, 'items');
      if (interceptionPoints) {
        const questionSetPublishReq = interceptionPoints.map(interceptionData => {
          return this.helperService.publishQuestionSet(interceptionData.identifier, this.userService.userProfile.userId);
        });
        forkJoin(questionSetPublishReq).subscribe(data => {
          this.publishAndAddResourceToHierarchy();
        }, (err) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.fmsg.m00102,
            // tslint:disable-next-line:max-line-length
            // telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
            env : this.activeRoute.snapshot.data.telemetry.env
          };
          this.sourcingService.apiErrorHandling(err, errInfo);
          this.getUploadedContentMeta(this.contentMetaData.identifier);
        });
      } else {
        this.publishAndAddResourceToHierarchy();
      }
    } else {
      this.publishAndAddResourceToHierarchy();
    }
  }

  publishAndAddResourceToHierarchy() {
    this.helperService.publishContent(this.contentMetaData.identifier, this.userService.userProfile.userId)
       .subscribe(res => {
        if (this.sessionContext.collection && this.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier || res.result.content_id)
          .subscribe((data) => {
            this.generateTelemetryEndEvent('publish');
            this.toasterService.success(this.resourceService.messages.smsg.contentAcceptMessage.m0001);
            this.programStageService.removeLastStage();
            this.programsService.emitHeaderEvent(true);
            this.uploadedContentMeta.emit({
              contentId: res.result.identifier
            });
          });
        } else {
          this.generateTelemetryEndEvent('publish');
          this.toasterService.success(this.resourceService.messages.smsg.contentAcceptMessage.m0001);
          this.programStageService.removeLastStage();
          this.programsService.emitHeaderEvent(true);
          this.uploadedContentMeta.emit({
            contentId: res.result.identifier
          });
        }
      }, (err) => {
        const errInfo = {
          errorMsg: this.resourceService.messages.fmsg.m00102,
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
  }

  contentStatusNotify(status) {
    if (!this.sessionContext.nominationDetails && this.contentMetaData.organisationId && status !== 'Request') {
      const programDetails = { name: this.programContext.name};
      this.helperService.prepareNotificationData(status, this.contentMetaData, programDetails);
    } else {
      const notificationForContributor = {
        user_id: this.contentMetaData.createdBy,
        content: { name: this.contentMetaData.name },
        org: { name:  _.get(this.sessionContext, 'nominationDetails.orgData.name') || '--'},
        program: { name: this.programContext.name },
        status: status
      };
      this.notificationService.onAfterContentStatusChange(notificationForContributor)
      .subscribe((res) => {  });
      if (!_.isEmpty(this.sessionContext.nominationDetails) && !_.isEmpty(this.sessionContext.nominationDetails.user_id) && status !== 'Request') {
        const notificationForPublisher = {
          user_id: this.sessionContext.nominationDetails.user_id,
          content: { name: this.contentMetaData.name },
          org: { name: _.get(this.sessionContext, 'nominationDetails.orgData.name') || '--'},
          program: { name: this.programContext.name },
          status: status
        };
        this.notificationService.onAfterContentStatusChange(notificationForPublisher)
        .subscribe((res) => {  });
      }
    }
  }

  isIndividualAndNotSample() {
    return !!(this.sessionContext.currentOrgRole === 'individual' && this.sessionContext.sampleContent !== true);
  }

  markFormGroupTouched(formGroup: UntypedFormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  handleBack() {
    this.generateTelemetryEndEvent('back');
    this.programStageService.removeLastStage();
    this.programsService.emitHeaderEvent(true);
  }

  changeFile() {
    this.action = { name : 'pause' };
    this.changeFile_instance = true;
    this.uploadButton = false;
    this.showUploadModal = true;
    this.optionalAddTranscript = false;
    this.initiateUploadModal();
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

  attachContentToTextbook (action) {
    let rejectComment = '';
    if (action === 'reject' && this.FormControl.value.rejectComment.length) {
      rejectComment = this.FormControl.value.rejectComment;
    }
    if (this.contentMetaData.interceptionPoints) {
      const interceptionPoints = _.get(this.contentMetaData.interceptionPoints, 'items');
      if (interceptionPoints) {
        const questionSetPublishReq = interceptionPoints.map(interceptionData => {
          return this.helperService.publishQuestionSetToConsumption(interceptionData.identifier, this.programContext);
        });
        forkJoin(questionSetPublishReq).subscribe(data => {
          // tslint:disable-next-line:max-line-length
          this.helperService.manageSourcingActions(action, this.sessionContext, this.programContext, this.unitIdentifier, this.contentMetaData, rejectComment, this.isMetadataOverridden);
        }, (err) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.fmsg.m00102,
            // tslint:disable-next-line:max-line-length
            // telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
            env : this.activeRoute.snapshot.data.telemetry.env
          };
          this.sourcingService.apiErrorHandling(err, errInfo);
        });
      } else {
        // tslint:disable-next-line:max-line-length
        this.helperService.manageSourcingActions(action, this.sessionContext, this.programContext, this.unitIdentifier, this.contentMetaData, rejectComment, this.isMetadataOverridden);
      }
    } else {
      // tslint:disable-next-line:max-line-length
      this.helperService.manageSourcingActions(action, this.sessionContext, this.programContext, this.unitIdentifier, this.contentMetaData, rejectComment, this.isMetadataOverridden);
    }
  }

  ngOnDestroy() {
    this.showEditMetaForm = false;
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }

  showCommentAddedAgainstContent() {
    this.contentComment = this.helperService.getContentCorrectionComments(this.contentMetaData, this.sessionContext, this.programContext);
  }

  getEditableFields() {
    const role = this.getRole();
    if (role === 'CONTRIBUTOR') {
      this.editableFields = this.helperService.getEditableFields('CONTRIBUTOR', this.formFieldProperties, this.contentMetaData);
      this.contentEditRole = 'CONTRIBUTOR';
    } else if (role === 'REVIEWER') {
      this.editableFields = this.helperService.getEditableFields('REVIEWER', this.formFieldProperties, this.contentMetaData);
      this.contentEditRole = 'REVIEWER';
    }
  }

  getRole() {
    if (this.hasRole('CONTRIBUTOR') && this.hasRole('REVIEWER')) {
      if (this.userService.userid === this.contentMetaData.createdBy && this.resourceStatus === 'Draft') {
        return 'CONTRIBUTOR';
      } else if (this.canPublishContent()) {
        return 'REVIEWER';
      }
    } else if (this.hasRole('CONTRIBUTOR') && this.resourceStatus === 'Draft') {
      return 'CONTRIBUTOR';
    } else if ((this.sourcingOrgReviewer || (this.visibility && this.visibility.showPublish))
      && (this.resourceStatus === 'Live' || this.resourceStatus === 'Review')
      && !this.sourcingReviewStatus
      && (this.programContext.target_type === 'searchCriteria' || ((!this.programContext.target_type || this.programContext.target_type === 'collections') && this.selectedOriginUnitStatus === 'Draft'))) {
      return 'REVIEWER';
    }
  }

  hasRole(role) {
    return this.sessionContext.currentRoles.includes(role);
  }

  formStatusEventListener(event) {
    this.formstatus = event;
  }

  getFormData(event) {
    this.formInputData = event;
  }

  // interactive video Change start
  format(time) {
    // tslint:disable-next-line:no-bitwise
    const hrs = ~~(time / 3600);
    // tslint:disable-next-line:no-bitwise
    const mins = ~~((time % 3600) / 60);
    // tslint:disable-next-line:no-bitwise
    const secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';
    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    ret += '' + String(mins).padStart(2, '0') + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }

  addInterception() {
    this.action = { name : 'pause' };
    this.showquestionCreationUploadModal = true;
    if (this.unFormatedinterceptionTime !== '') {
      this.interceptionTime = this.format(this.unFormatedinterceptionTime);
    }
  }

  telemetryEvent(event) {
    // console.log('in app: ', JSON.stringify(event));
  }

  eventHandler(event) {
    if (event.type === 'durationchange' && event.duration && !this.totalDuration) {
      this.totalDuration = event.duration;
    }
    if (event.type && event.type === 'timeupdate') {
      this.unFormatedinterceptionTime =  Math.floor(Math.round(event.target.player.player_.cache_.currentTime * 10) / 10);
    } else if (event.type && event.type === 'ended') {
      this.interceptionTime = '00:00';
    }
  }

  createQuestionSet() {
      const timeStamp = this.interceptionTime.replace(':', '.').split('.');
      const getTimeStamp = parseFloat(timeStamp[0]) * 60 + parseFloat(timeStamp[1]);
      const isTimeValid = this.validateEnteredTime(timeStamp);
      if (isTimeValid) {
        this.action = { name : 'play' };
        this.showquestionCreationUploadModal = false;
        let creator = this.userService.userProfile.firstName;
        if (!_.isEmpty(this.userService.userProfile.lastName)) {
          creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
        }
        const rootorgId = _.get(this.programContext, 'rootorg_id');
        const primaryCategoryInteractiveVideoQSet = (<HTMLInputElement>document.getElementById('interactiveVideoQsetCategory'))
        ? (<HTMLInputElement>document.getElementById('interactiveVideoQsetCategory')).value : '';
        this.frameworkService.readChannel(rootorgId).subscribe(channelData => {
          const channelCats = _.get(channelData, 'primaryCategories');
          const channeltargetObjectTypeGroup = _.groupBy(channelCats, 'targetObjectType');
          const questionSetCategories = _.get(channeltargetObjectTypeGroup, 'QuestionSet');
          const primaryCategories  = _.map(questionSetCategories, 'name');
          const sharedMetaData = this.helperService.fetchRootMetaData(this.sharedContext, this.selectedSharedContext, this.programContext.target_type);
          _.merge(sharedMetaData, this.sessionContext.targetCollectionFrameworksData);
          const option = {
            url: `questionset/v1/create`,
            header: {
              'X-Channel-Id': this.programContext.rootorg_id
            },
            data: {
              request: {
                questionset: {
                  'name': 'Untitled',
                  'code': UUID(),
                  'mimeType': 'application/vnd.sunbird.questionset',
                  'createdBy': this.userService.userid,
                  'primaryCategory': primaryCategoryInteractiveVideoQSet, // primaryCategories[0],
                  'creator': creator,
                  'author': creator,
                  'programId': this.sessionContext.programId,
                  'collectionId': this.sessionContext.collection,
                  ...(this.unitIdentifier && { 'unitIdentifiers': [this.unitIdentifier] }),
                  ...(this.sessionContext.nominationDetails &&
                    this.sessionContext.nominationDetails.organisation_id &&
                    {'organisationId': this.sessionContext.nominationDetails.organisation_id || null}),
                  ...(_.pickBy(sharedMetaData, _.identity))
                }
              }
            }
          };
          if (this.sessionContext.sampleContent) {
            option.data.request.questionset.sampleContent = this.sessionContext.sampleConten;
          }
          this.actionService.post(option).pipe(map((res: any) => res.result), catchError(err => {
            const errInfo = {
              errorMsg: this.resourceService.messages.emsg.interactive.video.create,
              telemetryPageId: this.telemetryPageId,
              telemetryCdata : this.telemetryInteractCdata,
              env : this.activeRoute.snapshot.data.telemetry.env,
              request: option
            };
            return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
          })).subscribe(result => {
              this.questionSetId = result.identifier;
              this.programsService.emitHeaderEvent(false);
              // tslint:disable-next-line:max-line-length
              this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance('questionSetEditorComponent'), 'questionSetEditorComponent');
              let interceptionPoints = [];
              if (this.interceptionMetaData && Object.keys(this.interceptionMetaData).length === 0) {
                interceptionPoints.push({
                  'type': 'QuestionSet',
                  'interceptionPoint': getTimeStamp,
                  'identifier': this.questionSetId
                });
              } else {
                interceptionPoints = this.interceptionMetaData.items;
                interceptionPoints.push({
                  'type': 'QuestionSet',
                  'interceptionPoint': getTimeStamp,
                  'identifier': this.questionSetId
                });
              }
              this.interceptionData = {
                url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.contentId}`,
                data: {
                  request : {
                    content : {
                      versionKey : this.contentMetaData.versionKey,
                      interceptionPoints : {
                        items : interceptionPoints
                      },
                      interceptionType: 'Timestamp'
                    }
                  }
                }
              };
              this.actionService.patch(this.interceptionData).pipe(map((res: any) => {
                this.existingContentVersionKey = _.get(res, 'result.versionKey');
                return res.result;
              }), catchError(err => {
                  const errInfo = {
                    errorMsg: this.resourceService.messages.emsg.interactive.video.updateInterception,
                    telemetryPageId: this.telemetryPageId,
                    telemetryCdata : this.telemetryInteractCdata,
                    env : this.activeRoute.snapshot.data.telemetry.env,
                    request: option
                  };
                  return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
              })).subscribe();

          });
        }, (err) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.emsg.interactive.video.primaryCategory,
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : this.telemetryInteractCdata,
            env : this.activeRoute.snapshot.data.telemetry.env
          };
          return throwError(this.sourcingService.apiErrorHandling({}, errInfo));
        });
      }
  }

  componentLoadHandler(action, component, componentName, event?) {
    this.initiateInputs(action, (event ? event.content : undefined));
    this.creationComponent = component;
    this.programStageService.addStage(componentName);
  }

  public initiateInputs(action?, content?) {
    const sourcingStatus = !_.isUndefined(content) ? content.sourcingStatus : null;
    this.dynamicInputs = {
      questionSetEditorComponentInput: {
        contentId: action === 'preview' ? content.identifier : this.questionSetId,
        action: action,
        content: content,
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        programContext: this.programContext,
        originCollectionData: this.originCollectionData,
        sourcingStatus: sourcingStatus,
        selectedSharedContext: this.selectedSharedContext,
        hideSubmitForReviewBtn: true
      }
    };
  }

  changeView() {
    this.currentLastStageInService = this.programStageService.getLastStage();
    if (!_.isEmpty(this.state.stages)) {
      const lastStage = _.last(this.state.stages).stage;
      if (lastStage === 'uploadComponent') {
        this.currentStage = 'contentUploaderComponent';
      }
    }
    if (this.currentStage === 'contentUploaderComponent') {
      this.getUploadedContentMeta(this.contentMetaData.identifier);
    } else if (this.currentLastStageInService === 'questionSetEditorComponent') {
      this.currentStage = 'questionSetEditorComponent';
    } else {
      this.currentStage = '';
    }
  }

  handleQuestionSetPreview(e) {
    if (this.contentMetaData && this.contentMetaData.status && this.contentMetaData.status.toLowerCase() !== 'draft') {
      return;
    }
    const event = {
      action: 'preview',
      content: {
        identifier: e.identifier
      }
    };
    this.componentLoadHandler('preview',
    this.programComponentsService.getComponentInstance('questionSetEditorComponent'), 'questionSetEditorComponent', event);
  }

  public getInteractiveQuestionSet() {
    const httpOptions: HttpOptions = {
      headers: {
        'content-type': 'application/json',
      }
    };
    const option = {
      url: 'composite/v3/search',
      data: {
        request: {
          filters: {
            status: [],
            identifier: _.map(this.interceptionMetaData.items, 'identifier')
          },
          fields: ['name']
        }
      }
    };
    const req = {
      url: option.url,
      data: option.data,
    };
    return this.actionService.post(req);
  }

  public closeQuestionCreationUploadModal() {
    this.action = { name : 'play' };
    this.showquestionCreationUploadModal = false;
  }

  public handleQuestionSetDelete(data, event) {
    this.action = { name : 'pause' };
    event.stopPropagation();
    this.selectedQuestionSet = {} ;
    this.showConfirmationModal = true;
    this.selectedQuestionSet = data;
  }

  public closeConfirmationModal() {
    this.action = { name : 'play' };
    this.selectedQuestionSet  = {};
    this.showConfirmationModal = false;
  }

  public deleteQuestionSet() {
    this.action = { name : 'play' };
    const option = {
      url : `questionset/v1/retire/${this.selectedQuestionSet.identifier}`,
      header: {
        'X-Channel-Id': this.programContext.rootorg_id
      }
    };
    this.actionService.delete(option).pipe(map((res: any) => res.result), catchError(err => {
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.interactive.video.delete,
        telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
        env : this.activeRoute.snapshot.data.telemetry.env, request: option
       };
      this.showConfirmationModal = false;
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe(result => {
      const currentInterceptionPoint = [];
      this.interceptionMetaData.items.map(item => {
        if (item.identifier !== this.selectedQuestionSet.identifier) {
          currentInterceptionPoint.push(item);
        }
      });
      this.interceptionData = {
        url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.contentId}`,
        data: {
          request : {
            content : {
              versionKey : this.contentMetaData.versionKey,
              interceptionPoints : {
                items : currentInterceptionPoint
              },
              interceptionType: 'Timestamp'
            }
          }
        }
      };
      this.actionService.patch(this.interceptionData).pipe(map((res: any) => res.result), catchError(err => {
          const errInfo = {
            errorMsg: this.resourceService.messages.emsg.interactive.video.delete,
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : this.telemetryInteractCdata,
            env : this.activeRoute.snapshot.data.telemetry.env,
            request: option
          };
          this.showConfirmationModal = false;
          return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      })).subscribe(( response: any) => {
        this.existingContentVersionKey = _.get(response, 'versionKey');
        this.showConfirmationModal = false;
        this.toasterService.success(this.resourceService.messages.smsg.interactive.video.delete);
        this.getUploadedContentMeta(this.contentMetaData.identifier);
      });
    });
  }

  public openQuestionSetEditModal(data, event) {
    this.action = { name : 'pause' };
    event.stopPropagation();
    this.selectedQuestionSetEdit = data;
    this.originalInterceptionTime = this.format(data.interceptionPoint);
    this.interceptionTime = this.format(data.interceptionPoint);
    this.showQuestionSetEditModal = true;
  }

  public  editInterceptionDetails() {
    const timeStamp = this.interceptionTime.replace(':', '.').split('.');
    let isTimeValid = false;
    if (this.interceptionTime === this.originalInterceptionTime) {
        isTimeValid = true;
    } else {
        isTimeValid = this.validateEnteredTime(timeStamp);
    }
    if (isTimeValid) {
      this.action = { name : 'play' };
      const updatedInterceptionData = [];
      const getTimeStamp = parseFloat(timeStamp[0]) * 60 + parseFloat(timeStamp[1]);
      this.interceptionMetaData.items.map(item => {
        if (item.identifier === this.selectedQuestionSetEdit.identifier) {
          updatedInterceptionData.push({
            'type': 'QuestionSet',
            'interceptionPoint': getTimeStamp,
            'identifier': this.selectedQuestionSetEdit.identifier
          });
        } else {
          updatedInterceptionData.push(item);
        }
      });
      this.interceptionData = {
        url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.contentId}`,
        data: {
          request : {
            content : {
              versionKey : this.contentMetaData.versionKey,
              interceptionPoints : {
                items : updatedInterceptionData
              },
              interceptionType: 'Timestamp'
            }
          }
        }
      };
      this.actionService.patch(this.interceptionData).pipe(map((res: any) => res.result), catchError(err => {
          const errInfo = {
            errorMsg: this.resourceService.messages.emsg.interactive.video.update,
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : this.telemetryInteractCdata,
            env : this.activeRoute.snapshot.data.telemetry.env,
          };
          return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      }))
      .subscribe(result => {
        this.existingContentVersionKey = _.get(result, 'versionKey');
        // console.log(result);
        this.showQuestionSetEditModal = false;
        this.handleQuestionSetPreview(this.selectedQuestionSetEdit);
      });
    }
  }

  public closeQuestionSetEditModal() {
    this.action = { name : 'play' };
    this.showQuestionSetEditModal = false;
  }

  public previewQuestionSet(data) {
    const option = {
      params: {
        mode: 'edit'
      }
    };
    // tslint:disable-next-line:max-line-length
    forkJoin([this.playerService.getQuestionSetHierarchy(data.identifier, option), this.playerService.getQuestionSetRead(data.identifier, option)])
      .subscribe(([hierarchyRes, questionSetData]: any) => {
        this.showQuestionSetPreview = true;
        const questionSet = _.get(hierarchyRes, 'result.questionSet');
        questionSet.instructions = _.get(questionSetData, 'result.questionset.instructions');
        const contentDetails = {
            contentId: data.identifier,
            contentData: questionSet
        };
        this.qumlPlayerConfig = this.playerService.getConfig(contentDetails);
        this.qumlPlayerConfig.context.pdata.pid = `${this.configService.appConfig.TELEMETRY.PID}`;
        this.qumlPlayerConfig.context = {
          ...this.qumlPlayerConfig.context,
          cdata: this.telemetryInteractCdata,
          userData: {
            firstName: this.userService.userProfile.firstName,
            lastName : !_.isEmpty(this.userService.userProfile.lastName) ? this.userService.userProfile.lastName : '',
          },
          endpoint: '/data/v3/telemetry',
          mode: 'play',
          env: 'question_editor',
          threshold: 3,
          host: this.baseUrl
        };
    });
  }

  public validateEnteredTime(timeStamp) {
    const getTimeStamp = parseFloat(timeStamp[0]) * 60 + parseFloat(timeStamp[1]);
    // tslint:disable-next-line:max-line-length
    const enteredTimeStamp = this.interceptionMetaData.items && this.interceptionMetaData.items.find( obj => obj.interceptionPoint === getTimeStamp);
    if (getTimeStamp > this.totalDuration) {
      this.toasterService.error(this.resourceService.messages.emsg.interactive.video.invalid);
      return false;
    } else if (this.interceptionTime === '00:00') {
      this.toasterService.error(this.resourceService.messages.emsg.interactive.video.selectTimestamp);
      return false;
    } else if (this.interceptionTime === '') {
      this.toasterService.error(this.resourceService.messages.emsg.interactive.video.selectTimestamp);
      return false;
    } else if (this.interceptionTime === undefined) {
      this.toasterService.error(this.resourceService.messages.emsg.interactive.video.selectTimestamp);
      return false;
    } else if (enteredTimeStamp !== undefined) {
      this.toasterService.warning(this.resourceService.messages.emsg.interactive.video.diffTimestamp);
      return false;
    } else {
      return true;
    }
  }
  // interactive video Change END

  public addEditTranscript() {
    this.action = { name : 'pause' };
    this.loading = false;
    this.showTranscriptPopup = true;
    this.showUploadModal = false;
    this.optionalAddTranscript = false;
  }

  public closeTranscriptPopup(): void {
    this.action = { name : 'play' };
    this.readContent(this.contentMetaData.identifier).subscribe(res => {
      this.contentMetaData = res;
      this.existingContentVersionKey = res.versionKey;
      this.showTranscriptPopup = false;
    });
  }

  readContent(identifier): Observable<any> {
    const option = {
      url: `${this.configService.urlConFig.URLS.DOCKCONTENT.GET}/${identifier}`
    };
    return this.actionService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to read the Content, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
        env : this.activeRoute.snapshot.data.telemetry.env, request: option
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  showDownloadBtnToSourcingReviewer(contentMetaData, sourcingReviewStatus, programContext, originCollectionData, selectedOriginUnitStatus) {
    const resourceStatus = contentMetaData.status;
    // tslint:disable-next-line:max-line-length
    const flag = !!(this.router.url.includes('/sourcing') && ((resourceStatus === 'Live' && !this.contentMetaData.sampleContent === true) || ((resourceStatus === 'Review' || resourceStatus === 'Draft') && this.contentMetaData.sampleContent === true)) && !sourcingReviewStatus && this.userService.userid !== contentMetaData.createdBy
    && this.programsService.isProjectLive(programContext));

    if (!programContext.target_type || programContext.target_type === 'collections') {
      return flag && !!(originCollectionData.status === 'Draft' && selectedOriginUnitStatus === 'Draft');
    }

    return flag;
  }

  showDownloadTranscript(content) {
    if (_.has(content, 'transcripts')) {
      if (!_.isEmpty(content.transcripts)) {
        // tslint:disable-next-line:max-line-length
        const showDownloadBtnToSourcingReviewer = this.showDownloadBtnToSourcingReviewer(this.contentMetaData, this.sourcingReviewStatus, this.programContext, this.originCollectionData, this.selectedOriginUnitStatus);

        if ((this.canReviewContent()
            || this.canPublishContent()
            || showDownloadBtnToSourcingReviewer)
          && _.includes(this.videoMimeType, content.mimeType)) {
            this.showDownloadTranscriptButton = true;
            }
          } else {
            this.showDownloadTranscriptButton = false;
          }
        } else {
          this.showDownloadTranscriptButton = false;
        }
  }

  enableOptionalAddTranscript(content) {
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);
    if ((_.includes(this.videoMimeType, content.mimeType))
       && submissionDateFlag
       && this.canEdit()) {
        this.optionalAddTranscript = true;
        this.changeFile_instance = true;
      }
  }

  allowAddTranscript(content) {
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);
    if ((_.includes(this.videoMimeType, content.mimeType))
       && submissionDateFlag
       && this.canEdit()) {
        this.showAddTrascriptButton = true;
      }
  }
}
