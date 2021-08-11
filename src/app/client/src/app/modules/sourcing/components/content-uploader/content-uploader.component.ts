import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef,
  AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FineUploader } from 'fine-uploader';
import { ToasterService, ConfigService, ResourceService, NavigationHelperService, BrowserCacheTtlService } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService, PlayerService, FrameworkService, NotificationService,
  ProgramsService, ContentService} from '@sunbird/core';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import * as _ from 'lodash-es';
import { catchError, map, filter, take, takeUntil } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';
import { IContentUploadComponentInput} from '../../interfaces';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm } from '@angular/forms';
import { SourcingService } from '../../services';
import { AzureFileUploaderService } from '../../services';
import { HelperService } from '../../services/helper.service';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IStartEventInput, IEndEventInput, TelemetryService } from '@sunbird/telemetry';
import { UUID } from 'angular2-uuid';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  contentDetailsForm: FormGroup;
  textInputArr: FormArray;
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
  titleCharacterLimit: number;
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

  constructor(public toasterService: ToasterService, private userService: UserService,
    private publicDataService: PublicDataService, public actionService: ActionService,
    public playerService: PlayerService, public configService: ConfigService, private formBuilder: FormBuilder,
    private sourcingService: SourcingService, public frameworkService: FrameworkService,
    public programStageService: ProgramStageService, private helperService: HelperService,
    private collectionHierarchyService: CollectionHierarchyService, private cd: ChangeDetectorRef,
    public resourceService: ResourceService, public programTelemetryService: ProgramTelemetryService,
    private notificationService: NotificationService,
    public activeRoute: ActivatedRoute, public router: Router, private navigationHelperService: NavigationHelperService,
    private programsService: ProgramsService, private azureUploadFileService: AzureFileUploaderService,
    private contentService: ContentService, private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private deviceDetectorService: DeviceDetectorService, private telemetryService: TelemetryService) { }

  ngOnInit() {
    this.config = _.get(this.contentUploadComponentInput, 'config');
    this.originCollectionData = _.get(this.contentUploadComponentInput, 'originCollectionData');
    this.selectedOriginUnitStatus = _.get(this.contentUploadComponentInput, 'content.originUnitStatus');
    this.sessionContext  = _.get(this.contentUploadComponentInput, 'sessionContext');
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    this.templateDetails  = _.get(this.contentUploadComponentInput, 'templateDetails');
    this.unitIdentifier  = _.get(this.contentUploadComponentInput, 'unitIdentifier');
    this.programContext = _.get(this.contentUploadComponentInput, 'programContext');
    this.titleCharacterLimit = _.get(this.config, 'config.resourceTitleLength');
    this.selectedSharedContext = _.get(this.contentUploadComponentInput, 'selectedSharedContext');
    this.sharedContext = _.get(this.contentUploadComponentInput, 'programContext.config.sharedContext');
    this.sourcingReviewStatus = _.get(this.contentUploadComponentInput, 'sourcingStatus') || '';
    this.bulkApprove = this.cacheService.get('bulk_approval_' + this.sessionContext.collection);
    if (_.get(this.contentUploadComponentInput, 'action') === 'preview') {
      this.showUploadModal = false;
      this.showPreview = true;
      this.cd.detectChanges();
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
      this.fetchFileSizeLimit();
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
    this.visibility['showSourcingActionButtons'] = this.canSourcingReviewerPerformActions();
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

  canSourcingReviewerPerformActions() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/sourcing')
    && !this.contentMetaData.sampleContent === true && this.resourceStatus === 'Live'
    && this.userService.userid !== this.contentMetaData.createdBy
    && this.resourceStatus === 'Live' && !this.sourcingReviewStatus &&
    (this.originCollectionData.status === 'Draft' && this.selectedOriginUnitStatus === 'Draft')
    && this.programsService.isProjectLive(this.programContext));
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

  fetchFileSizeLimit() {
    if (!this.cacheService.get('contentVideoSize')) {
      const request = {
        key: 'contentVideoSize',
        status: 'active'
      };
      this.helperService.getProgramConfiguration(request).subscribe(res => {
        this.showUploadModal = true;
        this.initiateUploadModal();
        if (_.get(res, 'result.configuration.value')) {
          this.videoSizeLimit = this.formatBytes(_.toNumber(_.get(res, 'result.configuration.value')) * 1024 * 1024);
          this.cacheService.set(request.key  , res.result.configuration.value,
            { maxAge: this.browserCacheTtlService.browserCacheTtl });
        }
      }, err => {
        this.showUploadModal = true;
        this.initiateUploadModal();
        this.toasterService.error('Unable to fetch size Limit...Please try later!');
      });
    } else {
      this.showUploadModal = true;
      this.initiateUploadModal();
      this.videoSizeLimit = this.formatBytes(_.toNumber(this.cacheService.get('contentVideoSize')) * 1024 * 1024);
    }
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
      if (this.cacheService.get('contentVideoSize')) {
        const val = _.toNumber(this.cacheService.get('contentVideoSize')) * 1024 * 1024;
        if (this.uploader.getSize(0) < val) {
          this.uploadByURL(fileUpload, mimeType);
        } else {
          this.handleSizeLimitError(this.formatBytes(val));
        }
      } else {
        this.handleSizeLimitError('');
      }
    } else if (this.uploader.getSize(0) < (_.toNumber(this.templateDetails.filesConfig.size) * 1024 * 1024)) {
      this.uploadByURL(fileUpload, mimeType);
    } else {
      this.handleSizeLimitError(`${this.templateDetails.filesConfig.size} MB`);
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
      let creator = this.userService.userProfile.firstName;
      if (!_.isEmpty(this.userService.userProfile.lastName)) {
        creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
      }

      const sharedMetaData = this.helperService.fetchRootMetaData(this.sharedContext, this.selectedSharedContext);
      _.merge(sharedMetaData, this.sessionContext.targetCollectionFrameworksData);
      const option = {
        url: `content/v3/create`,
        data: {
          request: {
            content: {
              'name': 'Untitled',
              'code': UUID.UUID(),
              'mimeType': this.detectMimeType(this.uploader.getName(0)),
              'createdBy': this.userService.userid,
              'primaryCategory': this.templateDetails.name,
              'creator': creator,
              'collectionId': this.sessionContext.collection,
              ...(this.sessionContext.nominationDetails &&
                this.sessionContext.nominationDetails.organisation_id &&
                {'organisationId': this.sessionContext.nominationDetails.organisation_id || null}),
              'programId': this.sessionContext.programId,
              'unitIdentifiers': [this.unitIdentifier],
              ...(_.pickBy(sharedMetaData, _.identity))
            }
          }
        }
      };
      if (this.sessionContext.sampleContent) {
        option.data.request.content.sampleContent = this.sessionContext.sampleContent;
      }
      if (_.get(this.templateDetails, 'appIcon')) {
        option.data.request.content.appIcon = _.get(this.templateDetails, 'appIcon');
      }
      this.actionService.post(option).pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = {
          errorMsg: 'Unable to create contentId, Please Try Again',
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env, request: option
         };
        this.programStageService.removeLastStage();
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      }))
        .subscribe(result => {
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, result.identifier)
            .subscribe(() => {
              this.uploadFile(mimeType, result.node_id);
            }, (err) => {
              this.programStageService.removeLastStage();
            });
        });
    } else if (!this.uploadInprogress) {
      this.uploadFile(mimeType, this.contentMetaData ? this.contentMetaData.identifier : this.contentUploadComponentInput.contentId);
    }
  }

  uploadFile(mimeType, contentId) {
    const contentType = mimeType;
    // document.getElementById('qq-upload-actions').style.display = 'none';
    const option = {
      url: 'content/v3/upload/url/' + contentId,
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
        const config = {
          processData: false,
          contentType: contentType,
          headers: {
            'x-ms-blob-type': 'BlockBlob'
          }
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
      url: 'content/v3/upload/' + contentId,
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
      this.getUploadedContentMeta(contentId);
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

  getUploadedContentMeta(contentId) {
    const option = {
      url: 'content/v3/read/' + contentId
    };
    this.actionService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to read the Content, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
        env : this.activeRoute.snapshot.data.telemetry.env, request: option
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
      const contentDetails = {
        contentId: contentId,
        contentData: res
      };
      this.contentMetaData = res;
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
      this.showUploadModal = false;
      if (!this.contentMetaData.artifactUrl) {
        this.fetchFileSizeLimit();
      }
      this.loading = false;
      this.handleActionButtons();

      // At the end of execution
      if ( _.isUndefined(this.sessionContext.topicList) || _.isUndefined(this.sessionContext.frameworkData)) {
        this.fetchFrameWorkDetails();
      }
      this.fetchCategoryDetails();
      this.getTelemetryData();
      this.cd.detectChanges();
    });
  }

  public closeUploadModal() {
    if (this.modal && this.modal.deny && this.changeFile_instance) {
      this.showPreview = true;
      this.showUploadModal = false;
      this.changeFile_instance = false;
    } else if (this.modal && this.modal.deny && this.showUploadModal) {
      this.modal.deny();
      this.programStageService.removeLastStage();
    }
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

  fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.sessionContext.framework}`)), take(1)).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        // this.categoryMasterList = _.cloneDeep(frameworkDetails.frameworkdata[this.sessionContext.framework].categories);
        this.sessionContext.frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
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
      primaryCategory: this.contentMetaData.primaryCategory,
      channelId: _.get(this.programContext, 'rootorg_id'),
      objectType: this.contentMetaData.objectType
    };

    this.helperService.getCollectionOrContentCategoryDefinition(targetCollectionMeta, assetMeta);
  }

  changePolicyCheckValue (event) {
    if ( event.target.checked ) {
      this.contentDetailsForm.controls.contentPolicyCheck.setValue(true);
    } else {
      this.contentDetailsForm.controls.contentPolicyCheck.setValue(false);
    }
  }

  saveMetadataForm(cb?) {
    if (this.helperService.validateForm(this.formstatus)) {
      console.log(this.formInputData);
      // tslint:disable-next-line:max-line-length
      const formattedData = this.helperService.getFormattedData(_.pick(this.formInputData, this.editableFields), this.formFieldProperties);
      const request = {
        'content': {
          'versionKey': this.contentMetaData.versionKey,
          ...formattedData
        }
      };

      this.helperService.contentMetadataUpdate(this.contentEditRole, request, this.contentMetaData.identifier).subscribe((res) => {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
        .subscribe((data) => {
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

  sendForReview() {
    this.helperService.reviewContent(this.contentMetaData.identifier)
       .subscribe((res) => {
        if (this.sessionContext.collection && this.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
          .subscribe((data) => {
            this.generateTelemetryEndEvent('submit');
            this.toasterService.success(this.resourceService.messages.smsg.m0061);
            this.programStageService.removeLastStage();
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
            this.uploadedContentMeta.emit({
              contentId: res.result.node_id
            });
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
      this.helperService.updateContentStatus(this.contentMetaData.identifier, "Draft", this.FormControl.value.rejectComment)
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
          telemetryPageId: this.telemetryPageId, telemetryCdata : _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata'),
          env : this.activeRoute.snapshot.data.telemetry.env
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }
  }

  publishContent() {
    this.helperService.publishContent(this.contentMetaData.identifier, this.userService.userProfile.userId)
       .subscribe(res => {
        if (this.sessionContext.collection && this.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier || res.result.content_id)
          .subscribe((data) => {
            this.generateTelemetryEndEvent('publish');
            this.toasterService.success(this.resourceService.messages.smsg.contentAcceptMessage.m0001);
            this.programStageService.removeLastStage();
            this.uploadedContentMeta.emit({
              contentId: res.result.identifier
            });
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
          org: { name:  this.sessionContext.nominationDetails.orgData.name},
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

  markFormGroupTouched(formGroup: FormGroup) {
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
    this.changeFile_instance = true;
    this.uploadButton = false;
    this.fetchFileSizeLimit();
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
    this.helperService.manageSourcingActions(action, this.sessionContext, this.unitIdentifier, this.contentMetaData, rejectComment, this.isMetadataOverridden);
  }

  ngOnDestroy() {
    this.showEditMetaForm = false;
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }

  showCommentAddedAgainstContent() {
    this.contentComment = this.helperService.getContentCorrectionComments(this.contentMetaData, this.sessionContext);
    const retVal = (this.contentComment) ? true : false;
    return retVal;
  }

  getEditableFields() {
    if (this.hasRole('CONTRIBUTOR') && this.hasRole('REVIEWER')) {
      if (this.userService.userid === this.contentMetaData.createdBy && this.resourceStatus === 'Draft') {
        this.editableFields = this.helperService.getEditableFields('CONTRIBUTOR', this.formFieldProperties, this.contentMetaData);
        this.contentEditRole = 'CONTRIBUTOR';
      } else if (this.canPublishContent()) {
        this.editableFields = this.helperService.getEditableFields('REVIEWER', this.formFieldProperties, this.contentMetaData);
        this.contentEditRole = 'REVIEWER';
      }
    } else if (this.hasRole('CONTRIBUTOR') && this.resourceStatus === 'Draft') {
      this.editableFields = this.helperService.getEditableFields('CONTRIBUTOR', this.formFieldProperties, this.contentMetaData);
      this.contentEditRole = 'CONTRIBUTOR';
    } else if ((this.sourcingOrgReviewer || (this.visibility && this.visibility.showPublish))
      && (this.resourceStatus === 'Live' || this.resourceStatus === 'Review')
      && !this.sourcingReviewStatus
      && (this.selectedOriginUnitStatus === 'Draft')) {
      this.editableFields = this.helperService.getEditableFields('REVIEWER', this.formFieldProperties, this.contentMetaData);
      this.contentEditRole = 'REVIEWER';
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
}
