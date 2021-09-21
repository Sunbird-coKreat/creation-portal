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
import { IContentUploadComponentInput,IResourceTemplateComponentInput,IContentEditorComponentInput} from '../../interfaces';
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
import { PlayerConfig } from './playerInterfaces';
/*****************************/
import { ProgramComponentsService } from '../../../program/services/program-components/program-components.service';
import { InitialState } from '../../interfaces';
/******************************/
/******************************/
interface IDynamicInput {
  contentUploadComponentInput?: IContentUploadComponentInput;
  resourceTemplateComponentInput?: IResourceTemplateComponentInput;
  practiceQuestionSetComponentInput?: any;
  contentEditorComponentInput?: IContentEditorComponentInput;
  questionSetEditorComponentInput?: any;
}
/******************************/
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
  /****************/
  isReadOnly :boolean;
  interceptionTime:any = '00:00';
  public templateSelected;
  public selectedtemplateDetails;
  public showModeofCreationModal = false;
  public showQuestionTypeModal = false;
  public dynamicInputs: IDynamicInput;
  public userProfile: any;
  public collection: any;
  public sampleContent = false;
  contentId: string;
  public creationComponent;
  public originalCollectionData: any;
  showquestionCreationUploadModal:boolean;
  showQuestionSetCreationComponent = false;
  public unsubscribe = new Subject<void>();
  public dynamicOutputs: any;
  public selectedChapterOption: any = {};
  public storedCollectionData: any;
  public collectionHierarchy = [];
  showLoader:boolean;
  public collectionData;
  public countData: Array<any> = [];
  public textbookStatusMessage: string;
  public targetCollection: string;
  showError:boolean;
  public levelOneChapterList: Array<any> = [];
  public currentUserID: string;
  public hierarchyObj = {};
  public hasAccessForContributor: any;
  public hasAccessForReviewer: any;
  private myOrgId = '';
  public localBlueprint: any;
  localUniqueTopicsList: string[] = [];
  public topicsInsideBlueprint: boolean = true;
  localUniqueLearningOutcomesList: string[] = [];
  public learningOutcomesInsideBlueprint: boolean = true;
  public currentStage: any;
  public state: InitialState = {
    stages: []
  };
  public stageSubscription: any;
  otherTypes: boolean = false;
  videoDoId:any;
  interceptionData:any;
  interceptionMetaData:any;
  /****************/

   videoMetaDataconfig: any = JSON.parse(localStorage.getItem('config')) || {};
   configSunbird = {
    ...{
      traceId: 'afhjgh',
      sideMenu: {
        showShare: true,
        showDownload: true,
        showReplay: true,
        showExit: true
      }
    }, ...this.videoMetaDataconfig
  };
  playerConfigSunbird: PlayerConfig;
  // playerConfigSunbird: PlayerConfig = {
  //   context: {
  //     mode: 'play',
  //     authToken: '',
  //     sid: '7283cf2e-d215-9944-b0c5-269489c6fa56',
  //     did: '3c0a3724311fe944dec5df559cc4e006',
  //     uid: 'anonymous',
  //     channel: '505c7c48ac6dc1edc9b08f21db5a571d',
  //     pdata: { id: 'prod.diksha.portal', ver: '3.2.12', pid: 'sunbird-portal.contentplayer' },
  //     contextRollup: { l1: '505c7c48ac6dc1edc9b08f21db5a571d' },
  //     tags: [
  //       ''
  //     ],
  //     cdata: [],
  //     timeDiff: 0,
  //     objectRollup: {},
  //     host: '',
  //     endpoint: '',
  //     userData: {
  //       firstName: 'Harish Kumar',
  //       lastName: 'Gangula'
  //     }
  //   },
  //   config: this.configSunbird,
  //   // tslint:disable-next-line:max-line-length
  //   metadata: { "interceptionPoints": 
  //                 { "items": 
  //                   [ 
  //                     { 
  //                       "type": "QuestionSet", 
  //                       "interceptionPoint": 50, 
  //                       "identifier": "do_1133684681106227201168" 
  //                     }, 
  //                     { 
  //                       "type": "QuestionSet", 
  //                       "interceptionPoint": 90, 
  //                       "identifier": "do_1133702669042892801173" 
  //                     }, 
  //                     { 
  //                       "type": "QuestionSet", 
  //                       "interceptionPoint": 120, 
  //                       "identifier": "do_1133702687093719041176" 
  //                     } 
  //                   ] 
  //                 }, 
  //                 "interceptionType": "Timestamp", 
  //                 "compatibilityLevel": 2, "copyright": "NCERT", "subject": [ "CPD" ], "channel": "0125196274181898243", "language": [ "English" ], "mimeType": "video/mp4", "objectType": "Content", "gradeLevel": [ "Others" ], "appIcon": "https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31309320735055872011111/artifact/nishtha_icon.thumb.jpg", "primaryCategory": "Explanation Content", "artifactUrl": "https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31309320735055872011111/engagement-with-language-.mp4", "contentType": "ExplanationResource", "identifier": "do_21310353608830976014671", "audience": [ "Student" ], "visibility": "Default", "mediaType": "content", "osId": "org.ekstep.quiz.app", "languageCode": [ "en" ], "license": "CC BY-SA 4.0", "name": "Engagement with Language", "status": "Live", "code": "1c5bd8da-ad50-44ad-8b07-9c18ec06ce29", "streamingUrl": "https://ntppreprodmedia-inct.streaming.media.azure.net/409780ae-3fc2-4879-85f7-f1affcce55fa/mp4_14.ism/manifest(format=m3u8-aapl-v3)", "medium": [ "English" ], "createdOn": "2020-08-24T17:58:32.911+0000", "copyrightYear": 2020, "lastUpdatedOn": "2020-08-25T04:36:47.587+0000", "creator": "NCERT COURSE CREATOR 6", "pkgVersion": 1, "versionKey": "1598330207587", "framework": "ncert_k-12", "createdBy": "68dc1f8e-922b-4fcd-b663-593573c75f22", "resourceType": "Learn", "orgDetails": { "email": "director.ncert@nic.in", "orgName": "NCERT" }, "licenseDetails": { "name": "CC BY-SA 4.0", "url": "https://creativecommons.org/licenses/by-sa/4.0/legalcode", "description": "For details see below:" } },
  //   data: {}
  // };

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
    private deviceDetectorService: DeviceDetectorService, private telemetryService: TelemetryService,public programComponentsService?: ProgramComponentsService) { }

  ngOnInit() {
    this.config = _.get(this.contentUploadComponentInput, 'config');
    this.originCollectionData = _.get(this.contentUploadComponentInput, 'originCollectionData');
    this.selectedOriginUnitStatus = _.get(this.contentUploadComponentInput, 'content.originUnitStatus');
    this.sessionContext  = _.get(this.contentUploadComponentInput, 'sessionContext');
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    this.templateDetails  = _.get(this.contentUploadComponentInput, 'templateDetails');
    this.unitIdentifier  = _.get(this.contentUploadComponentInput, 'unitIdentifier');
    this.programContext = _.get(this.contentUploadComponentInput, 'programContext');
    this.titleCharacterLimit = _.get(this.config, 'config.resourceTitleLength') || 200;
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
    /**********************************/
    this.collection = _.get(this.contentUploadComponentInput, 'collection');
    this.currentStage = 'contentUploaderComponent';
    this.userService.userData$.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((user: any) => {
      if (user && !user.err) {
        this.userProfile = user.userProfile;
      }
    });
    this.dynamicOutputs = {
      uploadedContentMeta: (contentMeta) => {
        this.uploadHandler(contentMeta);
      }
    };
     this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.myOrgId = (this.userService.userRegistryData
      && this.userProfile.userRegData
      && this.userProfile.userRegData.User_Org
      && this.userProfile.userRegData.User_Org.orgId) ? this.userProfile.userRegData.User_Org.orgId : '';
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
        this.programsService.emitHeaderEvent(true);
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      }))
        .subscribe(result => {
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, result.identifier)
            .subscribe(() => {
              this.videoDoId =  result.node_id;
              this.uploadFile(mimeType, result.node_id);
            }, (err) => {
              this.programStageService.removeLastStage();
              this.programsService.emitHeaderEvent(true);
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
      console.log("harry",res)
      this.interceptionMetaData = res.interceptionPoints
      const contentDetails = {
        contentId: contentId,
        contentData: res
      };
      this.videoDoId = res.identifier;
      this.contentMetaData = res;
      if (_.includes(this.contentMetaData.mimeType.toString(), 'video')) {
        this.videoFileFormat = true;
      }else{
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

      this.playerConfigSunbird = this.playerService.getConfig(contentDetails);
      this.playerConfigSunbird.context.pdata.pid = `${this.configService.appConfig.TELEMETRY.PID}`;
      this.playerConfigSunbird.context.cdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
      this.showPreview = this.contentMetaData.artifactUrl ? true : false;
      console.log("harry",this.playerConfigSunbird)
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
      this.programsService.emitHeaderEvent(true);
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

  saveMetadataForm(cb?, emitHeaderEvent?) {
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
    if (this.stageSubscription) {
      this.stageSubscription.unsubscribe();
    }
    if (this.unsubscribe) {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
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
/***********************************************************************************/
  telemetryEvent(event) {
     //console.log('in app: ', JSON.stringify(event));
  }
  eventHandler(event) {
    if(event.type && event.type == "pause"){
      this.interceptionTime =  Math.floor(Math.round(event.target.player.player_.cache_.currentTime* 10) / 10)
    }
  }
  addInterception(){
    this.isReadOnly = true;
    if(this.interceptionTime !== ''){
      this.interceptionTime = this.format(this.interceptionTime);
    }
    this.showquestionCreationUploadModal = true;
  }
  public closeQuestionCreationUploadModal() {
    this.showquestionCreationUploadModal = false;
  }
  createQuestionSet(){
    
    this.templateSelected = { name: "Demo Practice Question Set", identifier: "obj-cat:demo-practice-question-set_questionset_all", targetObjectType: "QuestionSet" }
    this.handleCreateQuestionSetSubmit()
    
    this.showquestionCreationUploadModal = false;
    this.currentStage = '';
  }
  format(time) {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + String(mins).padStart(2, '0') + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }
  handleCreateQuestionSetSubmit(){
    let rootorgId = _.get(this.programContext, 'rootorg_id')
    this.programsService.getCategoryDefinition(this.templateSelected.name,rootorgId , this.templateSelected.targetObjectType).subscribe((res) => {
      this.selectedtemplateDetails = res.result.objectCategoryDefinition;
      const catMetaData = this.selectedtemplateDetails.objectMetadata;
      if (_.isEmpty(_.get(catMetaData, 'schema.properties.mimeType.enum'))) {
          this.toasterService.error(this.resourceService.messages.emsg.m0026);
      } else {
        const supportedMimeTypes = catMetaData.schema.properties.mimeType.enum;
        let catEditorConfig = !_.isEmpty(_.get(catMetaData, 'config.sourcingConfig.editor')) ? catMetaData.config.sourcingConfig.editor : [];
        let appEditorConfig = this.configService.contentCategoryConfig.sourcingConfig.editor;
        const editorTypes = [];
        let tempEditors = _.map(supportedMimeTypes, (mimetype) => {
          const editorObj = _.filter(catEditorConfig, {"mimetype": mimetype});
          if (!_.isEmpty(editorObj)) {
              editorTypes.push(...editorObj);
          } else {
            const editorObj = _.filter(appEditorConfig, {"mimetype": mimetype});
            if (!_.isEmpty(editorObj)) {
              editorTypes.push(...editorObj);
            }
          }
        });
        let modeOfCreation = _.map(editorTypes, 'type');
        modeOfCreation = _.uniq(modeOfCreation);
        this.selectedtemplateDetails["editors"] = editorTypes;
        this.selectedtemplateDetails["editorTypes"] = _.uniq(modeOfCreation);
        if (modeOfCreation.length > 1) {
          this.showModeofCreationModal = true;
          this.showQuestionTypeModal = false;
        } else {
          this.selectedtemplateDetails["modeOfCreation"] = modeOfCreation[0];
          //handle Submit functionality
          this.showModeofCreationModal = false;
          this.showQuestionTypeModal = false;
          this.selectedtemplateDetails.onClick = 'questionSetEditorComponent';
          this.selectedtemplateDetails.mimeType = ['application/vnd.sunbird.questionset'];
          const appEditorConfig = this.configService.contentCategoryConfig.sourcingConfig.files;
          const filesConfig =  _.map(this.selectedtemplateDetails.mimeType, (mimetype) => {
              return appEditorConfig[mimetype];
          });

          this.selectedtemplateDetails['filesConfig'] = {};
          this.selectedtemplateDetails.filesConfig['accepted'] = (!_.isEmpty(filesConfig)) ? _.join(_.compact(filesConfig), ', ') : '';
          this.selectedtemplateDetails.filesConfig['size'] = this.configService.contentCategoryConfig.sourcingConfig.defaultfileSize;
          this.handleTemplateSelection({ type: 'next', template: this.templateSelected, templateDetails: this.selectedtemplateDetails })
        }
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0027);
      return false;
    });
  }
  handleTemplateSelection(event) {
    this.sessionContext['templateDetails'] = { name: "Demo Practice Question Set", identifier: "obj-cat:demo-practice-question-set_questionset_all", targetObjectType: "QuestionSet" };
    if (event.template && event.templateDetails && !(event.templateDetails.onClick === 'uploadComponent')) {
      this.templateDetails = { name: "Demo Practice Question Set", identifier: "obj-cat:demo-practice-question-set_questionset_all", targetObjectType: "QuestionSet" };
      let creator = this.userProfile.firstName;
      if (!_.isEmpty(this.userProfile.lastName)) {
        creator = this.userProfile.firstName + ' ' + this.userProfile.lastName;
      }

      let targetCollectionFrameworksData = {};
      targetCollectionFrameworksData = this.helperService.setFrameworkCategories(this.collection);
      const sharedMetaData = this.helperService.fetchRootMetaData(this.sharedContext, this.selectedSharedContext);
      _.merge(sharedMetaData, targetCollectionFrameworksData);
      const option = {
        url: `questionset/v1/create`,
        header: {
          'X-Channel-Id': this.programContext.rootorg_id
        },
        data: {
          request: {
            questionset: {
              'name': 'Untitled',
              'code': UUID.UUID(),
              'mimeType': "application/vnd.sunbird.questionset",
              'createdBy': this.userService.userid,
              'primaryCategory': "Demo Practice Question Set",
              'creator': creator,
              'author': creator,
              'programId': this.sessionContext.programId,
              'collectionId': this.sessionContext.collection,
              'unitIdentifiers': [this.unitIdentifier],
              ...(this.sessionContext.nominationDetails &&
                this.sessionContext.nominationDetails.organisation_id &&
                {'organisationId': this.sessionContext.nominationDetails.organisation_id || null}),
              ...(_.pickBy(sharedMetaData, _.identity))
            }
          }
        }
      };
      if (this.sampleContent) {
        option.data.request.questionset.sampleContent = this.sampleContent;
      }
      if (_.get(this.templateDetails, 'modeOfCreation') === 'question') {
        option.data.request.questionset.questionCategories =  [this.templateDetails.questionCategory];
      }
      if (_.get(this.templateDetails, 'appIcon')) {
        option.data.request.questionset.appIcon = _.get(this.templateDetails, 'appIcon');
      }

      let timeStamp = this.interceptionTime.replace(":",".").split(".")
      let getTimeStamp = parseFloat(timeStamp[0])* 60 + parseFloat(timeStamp[1]);

      let createRes;
      if (_.get(this.templateDetails, 'modeOfCreation') === 'questionset') {
        option.url = 'questionset/v1/create';
        option.data.request['questionset'] = {};
        option.data.request['questionset'] = option.data.request.questionset;
        delete option.data.request.questionset;
        createRes = this.actionService.post(option);
      } else {
        createRes = this.actionService.post(option);
      }

      createRes.pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = {
          errorMsg: 'Unable to create contentId, Please Try Again',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
          request: option
        };
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      }))
        .subscribe(result => {
          this.contentId = result.identifier;
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, result.identifier)
            .subscribe(() => {
              this.showQuestionSetCreationComponent = true
              this.programsService.emitHeaderEvent(false)
               // tslint:disable-next-line:max-line-length
               this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);

                if(this.interceptionMetaData && Object.keys(this.interceptionMetaData).length === 0)
                {
                  this.interceptionData = {
                    url: `content/v3/update/${this.videoDoId}`,
                    data: {
                      request : {
                        content : {
                          versionKey : this.contentMetaData.versionKey,
                          interceptionPoints : {
                            items : [
                              {
                                "type" : "QuestionSet",
                                "interceptionPoint" : getTimeStamp ,
                                "identifier": result.identifier
                              }
                            ]
                          },
                          interceptionType: "Timestamp"
                        }
                      }
                    }
                  }
                }else{
                  let existingItems = this.interceptionMetaData.items
                  existingItems.push({
                    "type" : "QuestionSet",
                    "interceptionPoint" : getTimeStamp ,
                    "identifier": result.identifier
                  })
                  this.interceptionData = {
                    url: `content/v3/update/${this.videoDoId}`,
                    data: {
                      request : {
                        content : {
                          versionKey : this.contentMetaData.versionKey,
                          interceptionPoints : {
                            items : existingItems
                          },
                          interceptionType: "Timestamp"
                        }
                      }
                    }
                  }
                }

                  
              this.actionService.patch(this.interceptionData).pipe(map((res: any) => res.result), catchError(err => {
                  const errInfo = {
                    errorMsg: 'Unable to create contentId, Please Try Again',
                    telemetryPageId: this.telemetryPageId,
                    telemetryCdata : this.telemetryInteractCdata,
                    env : this.activeRoute.snapshot.data.telemetry.env,
                    request: option
                  };
                  return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
              }))
              .subscribe(result => {
                console.log("harry",result);
              })
            });
        });
    } 
    else if (event.templateDetails) {
      this.templateDetails = event.templateDetails;
      this.programsService.emitHeaderEvent(false)
      this.showQuestionSetCreationComponent = true
      // tslint:disable-next-line:max-line-length
      this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);

    }
  }
  componentLoadHandler(action, component, componentName, event?) {
    this.initiateInputs(action, (event ? event.content : undefined));
    this.creationComponent = component;
    this.programStageService.addStage(componentName);
  }
  public initiateInputs(action?, content?) {
    const sourcingStatus = !_.isUndefined(content) ? content.sourcingStatus : null;
    this.sessionContext.telemetryPageDetails.telemetryPageId = this.getTelemetryPageIdForContentDetailsPage();
    this.dynamicInputs = {
      questionSetEditorComponentInput: {
        contentId: this.contentId,
        action: action,
        content: content,
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        programContext: this.programContext,
        originCollectionData: this.originalCollectionData,
        sourcingStatus: sourcingStatus,
        selectedSharedContext: this.selectedSharedContext
      }
    }
  }
  getTelemetryPageIdForContentDetailsPage() {
    if (this.telemetryPageId === this.configService.telemetryLabels.pageId.sourcing.projectNominationTargetCollection) {
      return this.configService.telemetryLabels.pageId.sourcing.projectNominationContributionDetails;
    } else if (this.telemetryPageId === this.configService.telemetryLabels.pageId.sourcing.projectTargetCollection) {
      return this.configService.telemetryLabels.pageId.sourcing.projectContributionDetails;
    } else if (this.telemetryPageId === this.configService.telemetryLabels.pageId.contribute.projectTargetCollection) {
      return this.configService.telemetryLabels.pageId.contribute.projectContributionDetails;
    } else if (this.telemetryPageId === this.configService.telemetryLabels.pageId.contribute.submitNominationTargetCollection) {
      return this.configService.telemetryLabels.pageId.contribute.submitNominationSampleDetails;
    }
  }
  uploadHandler(event) {
    console.log("inside uploadhanlder",event);
    if (event.contentId) {
      this.updateAccordianView(this.unitIdentifier);
    }
  }
   async updateAccordianView(unitId?, onSelectChapterChange?) {
    if (this.isPublishOrSubmit() && this.isContributingOrgContributor() && this.isDefaultContributingOrg()) {
      this.sessionContext.currentOrgRole = 'individual';
    }
      await this.getCollectionHierarchy(this.sessionContext.collection,
                this.selectedChapterOption === 'all' ? undefined : this.selectedChapterOption);
      const acceptedContents = _.get(this.storedCollectionData, 'acceptedContents', []);
      if (!_.isEmpty(acceptedContents)) {
        await this.getOriginForApprovedContents(acceptedContents);
      }
    if (unitId) {
      this.lastOpenedUnit(unitId);
    } else if (onSelectChapterChange === true && this.selectedChapterOption !== 'all') {
      this.lastOpenedUnit(this.selectedChapterOption);
    } else {
      if (!_.isEmpty(this.collectionHierarchy)) { this.lastOpenedUnit(this.collectionHierarchy[0].identifier)}
    }
  }
  public getCollectionHierarchy(identifier: string, unitIdentifier: string) {
    const instance = this;
    let hierarchy;
    let hierarchyUrl = 'content/v3/hierarchy/' + identifier;
    if (unitIdentifier) {
      hierarchyUrl = hierarchyUrl + '/' + unitIdentifier;
    }
    const req = {
      url: hierarchyUrl,
      param: { 'mode': 'edit' }
    };
     return new Promise((resolve) => {
    this.actionService.get(req).pipe(catchError(err => {
      const errInfo = {
        errorMsg: 'Fetching TextBook details failed',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env,
        request: req
      };
      this.showLoader = false;
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((response) => {
        const children = [];
        _.forEach(response.result.content.children, (child) => {
          if (child.mimeType !== 'application/vnd.ekstep.content-collection' ||
          (child.mimeType === 'application/vnd.ekstep.content-collection' && child.openForContribution === true)) {
            children.push(child);
          }
        });

        response.result.content.children = children;
        this.collectionData = response.result.content;
        this.storedCollectionData = unitIdentifier ?  this.storedCollectionData : _.cloneDeep(this.collectionData);
        if (this.storedCollectionData['channel'] !== this.programContext.rootorg_id) {
          this.storedCollectionData['channel'] = this.programContext.rootorg_id;
        }
        this.helperService.selectedCollectionMetaData = _.omit(this.storedCollectionData, ['children', 'childNodes']);
        const textBookMetaData = [];
        instance.countData['total'] = 0;
        instance.countData['review'] = 0;
        instance.countData['reject'] = 0;
        instance.countData['live'] = 0;
        instance.countData['draft'] = 0;
        instance.countData['mycontribution'] = 0;
        instance.countData['totalreview'] = 0;
        instance.countData['awaitingreview'] = 0;
        instance.countData['sampleContenttotal'] = 0;
        instance.countData['sampleMycontribution'] = 0;
        instance.countData['pendingReview'] = 0;
        instance.countData['nominatedUserSample'] = 0;
        instance.countData['sourcing_total'] = 0;
        instance.countData['sourcing_approvalPending'] = 0;
        instance.countData['sourcing_correctionPending'] = 0;
        instance.countData['sourcing_approved'] = 0;
        instance.countData['sourcing_rejected'] = 0;
        instance.countData['objective'] = 0;
        instance.countData['vsa'] = 0;
        instance.countData['sa'] = 0;
        instance.countData['la'] = 0;
        instance.countData['subjective'] = 0;
        instance.countData['multipleChoice'] = 0;
        instance.countData['remember'] = 0;
        instance.countData['understand'] = 0;
        instance.countData['apply'] = 0;
        instance.countData['topics'] = 0;
        instance.countData['learningOutcomes'] = 0;

        if (this.router.url.includes('/sourcing') && this.collectionData && this.collectionData.visibility === 'Default') {
          this.programsService.getHierarchyFromOrigin(this.collectionData.origin).subscribe(async res => {
            const content = _.get(res, 'result.content');
            this.originalCollectionData = content;
            this.setTreeLeafStatusMessage(identifier, instance);
            resolve('Done');
          }, error => resolve('Done')
          );
        } else {
          this.setTreeLeafStatusMessage(identifier, instance);
          resolve('Done');
        }
      });
    });
  }
  isPublishOrSubmit() {
    return !!(_.get(this.programContext, 'config.defaultContributeOrgReview') === false
    && _.get(this.sessionContext, 'currentRoles').includes('CONTRIBUTOR')
    && this.sampleContent === false);
  }
    isContributingOrgContributor() {
    return this.userService.isContributingOrgContributor(this.sessionContext.nominationDetails);
  }
  isDefaultContributingOrg() {
    return this.userService.isDefaultContributingOrg(this.programContext);
  }
  getOriginForApprovedContents (acceptedContents) {
    this.collectionHierarchyService.getOriginForApprovedContents(acceptedContents).subscribe(
      (response) => {
        if (_.get(response, 'result.count') && _.get(response, 'result.count') > 0) {
          this.sessionContext['contentOrigins'] = {};
          _.forEach( _.get(response, 'result.content'), (obj) => {
            if (obj.status == 'Live') {
              this.sessionContext['contentOrigins'][obj.origin] = obj;
            }
          });
          _.forEach( _.get(response, 'result.QuestionSet'), (obj) => {
            if (obj.status == 'Live') {
              this.sessionContext['contentOrigins'][obj.origin] = obj;
            }
          });
        }
      },
      (error) => {
        console.log('Getting origin data failed');
    });
  }
  lastOpenedUnit(unitId) {
    this.collectionHierarchy.forEach((parentunit) => {
        if (parentunit.identifier === unitId) {
          this.sessionContext.lastOpenedUnitChild = unitId;
          this.sessionContext.lastOpenedUnitParent = parentunit.identifier;
          return;
        } else if (parentunit.children) {
          _.forEach(parentunit.children, (childUnit) => {
            if (childUnit.identifier === unitId) {
             this.sessionContext.lastOpenedUnitChild = childUnit.identifier;
             this.sessionContext.lastOpenedUnitParent = parentunit.identifier;
             return;
            }
          });
        }
    });
  }
  setTreeLeafStatusMessage(identifier, instance) {
    this.collectionHierarchy = this.setCollectionTree(this.collectionData, identifier);
    if (this.originalCollectionData && this.originalCollectionData.status !== 'Draft' && this.sourcingOrgReviewer) {
      // tslint:disable-next-line:max-line-length
      this.textbookStatusMessage = this.resourceService.frmelmnts.lbl.textbookStatusMessage.replaceAll('{TARGET_NAME}', this.targetCollection);

    }
    this.getFolderLevelCount(this.collectionHierarchy);
    const hierarchy = instance.hierarchyObj;
    this.sessionContext.hierarchyObj = { hierarchy };
    if (_.get(this.collectionData, 'sourcingRejectedComments')) {
    // tslint:disable-next-line:max-line-length
    this.sessionContext.hierarchyObj['sourcingRejectedComments'] = _.isString(_.get(this.collectionData, 'sourcingRejectedComments')) ? JSON.parse(_.get(this.collectionData, 'sourcingRejectedComments')) : _.get(this.collectionData, 'sourcingRejectedComments');
    }
    this.showLoader = false;
    this.showError = false;
    this.levelOneChapterList = _.uniqBy(this.levelOneChapterList, 'identifier');
  }
  getFolderLevelCount(collections) {
    let status = this.sampleContent ? ['Review', 'Draft'] : [];
    let prevStatus;
    let createdBy, visibility;
    if (this.sampleContent === false && this.isSourcingOrgReviewer()) {
      if (this.sourcingOrgReviewer) {
        status = ['Live', 'Draft'];
        prevStatus = 'Live';
      }
      visibility = true;
    }
    if (this.isContributingOrgContributor()) {
      createdBy = this.currentUserID;
    }
    if (this.isContributingOrgReviewer()) {
      status = ['Review', 'Live', 'Draft'];
      prevStatus = 'Review';
    }
    if (this.isNominationByOrg()) {
      _.forEach(collections, collection => {
        // tslint:disable-next-line:max-line-length
        this.getContentCountPerFolder(collection , status , this.sampleContent, this.getNominationId('org'), createdBy, visibility, prevStatus);
      });
    } else {
      _.forEach(collections, collection => {
        createdBy = this.getNominationId('individual');
        this.getContentCountPerFolder(collection , status , this.sampleContent, undefined, createdBy, visibility, prevStatus);
      });
    }
  }
   setCollectionTree(data, identifier) {
    // tslint:disable-next-line:max-line-length
    if (this.sessionContext.currentOrgRole !== 'user' && this.sessionContext.nominationDetails && !_.includes(['Approved', 'Rejected'], this.sessionContext.nominationDetails.status)) {
      this.sampleContent = true;
      this.sessionContext['sampleContent'] = true;
      this.getSampleContentStatusCount(data);
    } else {
      this.sampleContent = false;
      this.sessionContext['sampleContent'] = false;
      this.getContentStatusCount(data);
    }
    if (!this.checkIfMainCollection(data)) {
      const rootMeta = _.pick(data, this.sharedContext);
      const rootTree = this.generateNodeMeta(data, rootMeta);
      const isFolderExist = _.find(data.children, (child) => {
        return (this.checkIfCollectionFolder(child));
      });
      if (isFolderExist) {
        const children = this.getUnitWithChildren(data, identifier);
        const treeChildren = this.getTreeChildren(children);
        const treeLeaf = this.getTreeLeaf(children);
        rootTree['children'] = treeChildren || null;
        rootTree['leaf'] = this.getContentVisibility(treeLeaf) || null;
        return rootTree ? [rootTree] : [];
      } else {
        rootTree['leaf'] = _.map(data.children, (child) => {
          const meta = _.pick(child, this.sharedContext);
          const treeItem = this.generateNodeMeta(child, meta);
          treeItem['contentVisibility'] = this.shouldContentBeVisible(child);
          treeItem['sourcingStatus'] = this.checkSourcingStatus(child);
          return treeItem;
        });
        return rootTree ? [rootTree] : [];
      }
    } else {
      return this.getUnitWithChildren(data, identifier) || [];
    }
  }
  isSourcingOrgReviewer () {
    return this.userService.isSourcingOrgReviewer(this.programContext);
  }
  isContributingOrgReviewer() {
    return this.userService.isContributingOrgReviewer(this.sessionContext.nominationDetails);
  }
  isNominationByOrg() {
    return !!(_.get(this.sessionContext, 'nominationDetails.organisation_id'));
  }
  getContentCountPerFolder(collection, contentStatus?: string[], onlySample?: boolean, organisationId?: string, createdBy?: string, visibility?: boolean, prevStatus?: string) {
    const self = this;
    collection.totalLeaf = 0;
    collection.sourcingStatusDetail = {};
    _.each(collection.children, child => {
      // tslint:disable-next-line:max-line-length
      const [restOfTheStatus, totalLeaf] = self.getContentCountPerFolder(child, contentStatus, onlySample, organisationId, createdBy, visibility, prevStatus);
      // collection.totalLeaf += totalLeaf;
      if (!_.isEmpty(restOfTheStatus)) {
        // tslint:disable-next-line:max-line-length
        collection.sourcingStatusDetail  =  _.mergeWith(_.cloneDeep(restOfTheStatus), _.cloneDeep(collection.sourcingStatusDetail), this.addTwoObjects);
      }
      collection.totalLeaf = collection.totalLeaf + totalLeaf;
    });

    if (collection.leaf) {
      // tslint:disable-next-line:max-line-length
      const filteredContents = this.filterContentsForCount(collection.leaf, contentStatus, onlySample, organisationId, createdBy, visibility, prevStatus);
      collection.totalLeaf = collection.totalLeaf + filteredContents.length;
      const unitContentStatusCount =  this.setUnitContentsStatusCount(filteredContents);
      if (!_.isEmpty(unitContentStatusCount)) {
        // tslint:disable-next-line:max-line-length
        collection.sourcingStatusDetail = _.mergeWith(unitContentStatusCount, _.cloneDeep(collection.sourcingStatusDetail), this.addTwoObjects);
      }
    }
    // tslint:disable-next-line:max-line-length
    if (this.originalCollectionData && (_.indexOf(this.originalCollectionData.childNodes, collection.origin) < 0 || this.originalCollectionData.status !== 'Draft')) {
      // tslint:disable-next-line:max-line-length
      collection.statusMessage = this.resourceService.frmelmnts.lbl.textbookNodeStatusMessage.replace('{TARGET_NAME}', this.targetCollection);
    }

    // tslint:disable-next-line:max-line-length
    collection.totalLeaf = !_.isEmpty(collection.sourcingStatusDetail) ? _.sum(_.values(collection.sourcingStatusDetail)) :  collection.totalLeaf;
    return [collection.sourcingStatusDetail, collection.totalLeaf];
  }
   getNominationId(type) {
    if (type === 'individual') {
      return this.getNominatedUserId();
    } else if (type === 'org') {
      return this.getNominatedOrgId();
    }
  }

  getNominatedUserId() {
    return _.get(this.sessionContext, 'nominationDetails.user_id');
  }
  getNominatedOrgId() {
    return _.get(this.sessionContext, 'nominationDetails.organisation_id');
  }

  addTwoObjects(objValue, srcValue) {
    return objValue + srcValue;
  }
  getSampleContentStatusCount(data) {
    const self = this;
    if (this.checkifContent(data) && data.sampleContent) {
      this.countData['sampleContenttotal'] = this.countData['sampleContenttotal'] + 1;
      if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.user_id === data.createdBy) {
        this.countData['nominatedUserSample'] += 1;
      }
      if (data.createdBy === this.currentUserID) {
        this.countData['sampleMycontribution'] = this.countData['sampleMycontribution'] + 1;
      }
    }
    const childData = data.children;
    if (childData) {
      childData.map(child => {
        self.getSampleContentStatusCount(child);
      });
    }
  }
  checkIfMainCollection (data) {
      return this.helperService.checkIfMainCollection(data);
  }
  generateNodeMeta(node, sharedMeta) {
   const nodeMeta =  {
      identifier: node.identifier,
      name: node.name,
      visibility: node.visibility,
      contentType: node.contentType,
      primaryCategory: node.primaryCategory,
      mimeType: node.mimeType,
      itemSets: _.has(node, 'itemSets') ? node.itemSets : null,
      questionCategories: _.has(node, 'questionCategories') ? node.questionCategories : null,
      topic: node.topic,
      origin: node.origin,
      status: node.status,
      creator: node.creator,
      createdBy: node.createdBy || null,
      parentId: node.parent || null,
      organisationId: _.has(node, 'organisationId') ? node.organisationId : null,
      prevStatus: node.prevStatus || null,
      sourceURL : node.sourceURL,
      sampleContent: node.sampleContent || null,
      sharedContext: {
        ...sharedMeta
      }
    };
    return nodeMeta;
  }
  checkIfCollectionFolder(data) {
    return this.helperService.checkIfCollectionFolder(data);
  }
  getUnitWithChildren(data, collectionId) {
    const self = this;
    this.hierarchyObj[data.identifier] = {
      'name': data.name,
      'mimeType': data.mimeType,
      'contentType': data.contentType,
      'children': _.map(data.children, (child) => {
        return child.identifier;
      }),
      'root': this.checkIfMainCollection(data) ? true : false,
      'origin': data.origin,
      'originData': data.originData,
      'parent': data.parent || ''
    };
    const childData = data.children;
    if (childData) {
      const tree = childData.map(child => {
        const meta = _.pick(child, this.sharedContext);
        if (child.parent && child.parent === collectionId && child.openForContribution === true) {
          self.levelOneChapterList.push({
            identifier: child.identifier,
            name: child.name
          });
        }
        const treeItem = this.generateNodeMeta(child, meta);
        const treeUnit = self.getUnitWithChildren(child, collectionId);
        const treeChildren = this.getTreeChildren(treeUnit);
        const treeLeaf = this.getTreeLeaf(treeUnit);
        treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
        if (treeLeaf && treeLeaf.length > 0) {
          treeItem['leaf'] = this.getContentVisibility(treeLeaf);
        }
        return treeItem;
      });
      return tree;
    }
  }
  getTreeChildren(children) {
    return children && children.filter(function (item) {
      return item.mimeType === 'application/vnd.ekstep.content-collection' && item.visibility === "Parent";
    });
  }
  getTreeLeaf(children) {
    return children && children.filter(function (item) {
      return item.mimeType !== 'application/vnd.ekstep.content-collection';
    });
  }
  getContentVisibility(branch) {
    const leafNodes = [];
    _.forEach(branch, (leaf) => {
      const contentVisibility = this.shouldContentBeVisible(leaf);
      const sourcingStatus = this.checkSourcingStatus(leaf);
      leaf['contentVisibility'] = contentVisibility;
      leaf['sourcingStatus'] = sourcingStatus || null;
      leafNodes.push(leaf);
    });
    return _.isEmpty(leafNodes) ? null : leafNodes;
  }
  shouldContentBeVisible(content) {
    const creatorViewRole = this.hasAccessForContributor;
    const reviewerViewRole = this.hasAccessForReviewer;
    const creatorAndReviewerRole = creatorViewRole && reviewerViewRole;
    const contributingOrgAdmin = this.userService.isContributingOrgAdmin();
    if (this.isSourcingOrgReviewer() && this.sourcingOrgReviewer) {
      if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.status === 'Pending') {
        if ( reviewerViewRole && content.sampleContent === true
          && this.getNominatedUserId() === content.createdBy) {
            return true;
          }
          return false;
      } else if (this.sessionContext.nominationDetails
        && (this.sessionContext.nominationDetails.status === 'Approved' || this.sessionContext.nominationDetails.status === 'Rejected')) {
          if ( reviewerViewRole && content.sampleContent !== true &&
          (content.status === 'Live' || (content.prevStatus === 'Live' && content.status === 'Draft' ))) {
              return true;
          }
          return false;
      } else if (reviewerViewRole && (content.status === 'Live'|| (content.prevStatus === 'Live' && content.status === 'Draft' ))) {
          return true;
      }
    } else {
      if ((this.sessionContext.nominationDetails.status === 'Approved' || this.sessionContext.nominationDetails.status === 'Rejected')
       && content.sampleContent === true) {
        return false;
      // tslint:disable-next-line:max-line-length
      } else if (creatorAndReviewerRole) {
        if (( (_.includes(['Review', 'Live'], content.status) || (content.prevStatus === 'Live' && content.status === 'Draft' ) || (content.prevStatus === 'Review' && content.status === 'Draft' )) && this.currentUserID !== content.createdBy && content.organisationId === this.myOrgId) || this.currentUserID === content.createdBy) {
          return true;
        } else if (content.status === 'Live' && content.sourceURL) {
          return true;
        }
      } else if (reviewerViewRole && (content.status === 'Review' || content.status === 'Live' || (content.prevStatus === 'Review' && content.status === 'Draft' ) || (content.prevStatus === 'Live' && content.status === 'Draft' ))
      && this.currentUserID !== content.createdBy
      && content.organisationId === this.myOrgId) {
        return true;
      } else if (creatorViewRole && this.currentUserID === content.createdBy) {
        return true;
      } else if (contributingOrgAdmin && content.organisationId === this.myOrgId) {
        return true;
      } else if (content.status === 'Live' && content.sourceURL) {
        return true;
      }
    }
    return false;
  }
  checkSourcingStatus(content) {
    if (this.storedCollectionData.acceptedContents  &&
         _.includes(this.storedCollectionData.acceptedContents || [], content.identifier)) {
            return 'Approved';
      } else if (this.storedCollectionData.rejectedContents  &&
              _.includes(this.storedCollectionData.rejectedContents || [], content.identifier)) {
            return 'Rejected';
      } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
            return 'PendingForCorrections';
      } else {
        return null;
      }
  }
   filterContentsForCount(contents, status?, onlySample?, organisationId?, createdBy?, visibility?, prevStatus?) {
    const filter = {
      ...(onlySample && { sampleContent: true }),
      ...(!onlySample && { sampleContent: null }),
      ...(createdBy && { createdBy }),
      ...(organisationId && { organisationId }),
      ...(visibility && { contentVisibility : true})
    };
    if (status && status.length > 0) {
      contents = _.filter(contents, leaf => {
        if (prevStatus && leaf.status === 'Draft' && (leaf.prevStatus === 'Review' || leaf.prevStatus === 'Live')) {
          return true;
        } else {
          return _.includes(status, leaf.status);
        }
      });
    }

    if (this.isContributingOrgContributor() && this.isContributingOrgReviewer()) {
      delete filter.createdBy;
    }

    let leaves;
    if (this.router.url.includes('/sourcing')) {
      leaves = _.concat(_.filter(contents, filter));
    } else {
      leaves = _.concat(_.filter(contents, filter), _.filter(contents, 'sourceURL'));

      // If user is having contributor and reviewer both roles
      if (this.isContributingOrgContributor() && this.isContributingOrgReviewer()) {
        leaves = _.concat(leaves, _.filter(contents, (c) => {
          const result = (c.organisationId === organisationId && c.status === 'Draft' &&
            ((c.createdBy === createdBy && c.contentVisibility === true) || c.prevStatus === 'Review' || c.prevStatus === 'Live'));
          return result;
        }));

        leaves = _.uniqBy(leaves, 'identifier');
      }
    }
    return leaves;
  }
   setUnitContentsStatusCount(contents) {
    const contentStatusCount = {};
    if (this.isSourcingOrgReviewer() && this.router.url.includes('/sourcing')) {
      contentStatusCount['approved'] = 0;
      contentStatusCount['rejected'] = 0;
      contentStatusCount['approvalPending'] = 0;
      contentStatusCount['correctionsPending'] = 0;
      _.forEach(contents, (content) => {
        if (!content.sampleContent) {
          if (content.sourcingStatus === 'Approved') {
            contentStatusCount['approved'] += 1;
          } else if (content.sourcingStatus === 'Rejected') {
            contentStatusCount['rejected'] += 1;
          } else if (content.status === 'Live' && content.sourceURL) {
            contentStatusCount['approvalPending'] += 1;
          } else if (content.status === 'Live') {
            contentStatusCount['approvalPending'] += 1;
          } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
            contentStatusCount['correctionsPending'] += 1;
          }
        }
      });
    } else if (this.isContributingOrgContributor() && this.isContributingOrgReviewer()) {
      contentStatusCount['notAccepted'] = 0;
      contentStatusCount['approvalPending'] = 0;
      contentStatusCount['reviewPending'] = 0;
      contentStatusCount['draft'] = 0;
      contentStatusCount['rejected'] = 0;
      contentStatusCount['approved'] = 0;
      contentStatusCount['correctionsPending'] = 0;
      _.forEach(contents, (content) => {
        if (content.organisationId === this.myOrgId && !content.sampleContent) {
          if (content.status === 'Draft' && content.prevStatus === 'Review') {
            contentStatusCount['notAccepted'] += 1;
          } else if (content.status === 'Live' && !content.sourcingStatus) {
            contentStatusCount['approvalPending'] += 1;
          } else if (content.status === 'Review') {
            contentStatusCount['reviewPending'] += 1;
          } else if (content.status === 'Draft' && !content.prevStatus && content.createdBy === this.currentUserID) {
            contentStatusCount['draft'] += 1;
          } else if (content.sourcingStatus === 'Approved' && content.status === 'Live') {
            contentStatusCount['approved'] += 1;
          } else if (content.sourcingStatus === 'Rejected' && content.status === 'Live') {
            contentStatusCount['rejected'] += 1;
          } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
            contentStatusCount['correctionsPending'] += 1;
          }
        }
      });
    } else if (this.userService.isContributingOrgAdmin() || this.isContributingOrgReviewer()) {
      contentStatusCount['notAccepted'] = 0;
      contentStatusCount['approvalPending'] = 0;
      contentStatusCount['reviewPending'] = 0;
      contentStatusCount['draft'] = 0;
      contentStatusCount['rejected'] = 0;
      contentStatusCount['approved'] = 0;
      contentStatusCount['correctionsPending'] = 0;
      _.forEach(contents, (content) => {
        if (content.organisationId === this.myOrgId && !content.sampleContent) {
          if (content.status === 'Draft' && content.prevStatus === 'Review') {
            contentStatusCount['notAccepted'] += 1;
          } else if (content.status === 'Live' && !content.sourcingStatus && content.sourceURL) {
            contentStatusCount['approvalPending'] += 1;
          } else if (content.status === 'Live' && !content.sourcingStatus) {
            contentStatusCount['approvalPending'] += 1;
          } else if (content.status === 'Review') {
            contentStatusCount['reviewPending'] += 1;
          } else if (content.status === 'Draft' && !content.prevStatus && this.userService.isContributingOrgAdmin()) {
            contentStatusCount['draft'] += 1;
          } else if (content.sourcingStatus === 'Approved' && content.status === 'Live') {
            contentStatusCount['approved'] += 1;
          } else if (content.sourcingStatus === 'Rejected' && content.status === 'Live') {
            contentStatusCount['rejected'] += 1;
          } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
            contentStatusCount['correctionsPending'] += 1;
          }
        }
      });
    } else if (this.isContributingOrgContributor()) {
      contentStatusCount['notAccepted'] = 0;
      contentStatusCount['approvalPending'] = 0;
      contentStatusCount['reviewPending'] = 0;
      contentStatusCount['rejected'] = 0;
      contentStatusCount['approved'] = 0;
      contentStatusCount['draft'] = 0;
      contentStatusCount['correctionsPending'] = 0;
      _.forEach(contents, (content) => {
        // tslint:disable-next-line:max-line-length
        if (content.organisationId === this.myOrgId && !content.sourceURL && !content.sampleContent && content.createdBy === this.currentUserID) {
          if (content.status === 'Draft' && content.prevStatus === 'Review') {
            contentStatusCount['notAccepted'] += 1;
          } else if (content.status === 'Live' && !content.sourcingStatus) {
            contentStatusCount['approvalPending'] += 1;
          } else if (content.status === 'Review') {
            contentStatusCount['reviewPending'] += 1;
          } else if (content.sourcingStatus === 'Approved' && content.status === 'Live') {
            contentStatusCount['approved'] += 1;
          } else if (content.sourcingStatus === 'Rejected' && content.status === 'Live') {
            contentStatusCount['rejected'] += 1;
          } else if (content.status === 'Draft' && !content.prevStatus) {
            contentStatusCount['draft'] += 1;
          } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
            contentStatusCount['correctionsPending'] += 1;
          }
        }
      });
    } else if (this.sessionContext.currentOrgRole === 'individual') {
      contentStatusCount['approvalPending'] = 0;
      contentStatusCount['draft'] = 0;
      contentStatusCount['rejected'] = 0;
      contentStatusCount['approved'] = 0;
      contentStatusCount['correctionsPending'] = 0;
      _.forEach(contents, (content) => {
        if (content.createdBy === this.userService.userid && !content.sampleContent) {
          if (content.status === 'Draft' && !content.prevStatus) {
            contentStatusCount['draft'] += 1;
          } else if (content.status === 'Live' && !content.sourcingStatus) {
            contentStatusCount['approvalPending'] += 1;
          } else if (content.sourcingStatus === 'Approved' && content.status === 'Live') {
            contentStatusCount['approved'] += 1;
          } else if (content.sourcingStatus === 'Rejected' && content.status === 'Live') {
            contentStatusCount['rejected'] += 1;
          } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
            contentStatusCount['correctionsPending'] += 1;
          }
        }
      });
    }
    if (_.mean(_.valuesIn(contentStatusCount)) > 0) {
      return contentStatusCount;
    }
  }
   getContentStatusCount(data) {
    const self = this;
    if (['admin', 'user'].includes(this.sessionContext.currentOrgRole)  && (this.sessionContext.currentRoles.includes('REVIEWER') || this.sessionContext.currentRoles.includes('CONTRIBUTOR') )) {
      // tslint:disable-next-line:max-line-length
      if ((this.checkifContent(data) && this.myOrgId === data.organisationId)  && (!data.sampleContent || data.sampleContent === undefined)) {
        this.countData['total'] = this.countData['total'] + 1;
        if (data.createdBy === this.currentUserID && data.status === 'Review') {
          this.countData['review'] = this.countData['review'] + 1;
        }
        if (data.createdBy === this.currentUserID && data.status === 'Draft' && data.prevStatus === 'Review') {
          this.countData['reject'] = this.countData['reject'] + 1;
        }
        if (data.createdBy === this.currentUserID) {
          this.countData['mycontribution'] = this.countData['mycontribution'] + 1;
        }
        if(this.sessionContext.currentRoles.includes('REVIEWER')) {
          if (data.status === 'Review') {
            this.countData['totalreview'] = this.countData['totalreview'] + 1;
          }
          if (data.createdBy !== this.currentUserID && data.status === 'Review') {
            this.countData['awaitingreview'] = this.countData['awaitingreview'] + 1;
          }
        }
      }
    }
     else if(['individual'].includes(this.sessionContext.currentOrgRole)  && this.sessionContext.currentRoles.includes('CONTRIBUTOR')) {
      if ((data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit' )  && (!data.sampleContent || data.sampleContent === undefined)) {

        if (data.createdBy === this.currentUserID) {
          this.countData['total'] = this.countData['total'] + 1;
        }
      }
    }
    else {
      // tslint:disable-next-line:max-line-length
      if (this.checkifContent(data) && (!data.sampleContent || data.sampleContent === undefined)) {
        this.countData['total'] = this.countData['total'] + 1;
        if (data.createdBy === this.currentUserID && data.status === 'Review') {
          this.countData['review'] = this.countData['review'] + 1;
        }
        if (data.createdBy === this.currentUserID && data.status === 'Draft') {
          this.countData['draft'] = this.countData['draft'] + 1;
        }
        if (data.createdBy === this.currentUserID && data.status === 'Live') {
          this.countData['live'] = this.countData['live'] + 1;
        }
        if (data.createdBy === this.currentUserID && data.status === 'Draft' && data.prevStatus === 'Review') {
          this.countData['reject'] = this.countData['reject'] + 1;
        }
        if (data.createdBy === this.currentUserID) {
          this.countData['mycontribution'] = this.countData['mycontribution'] + 1;
        }
        if (data.status === 'Review') {
          this.countData['totalreview'] = this.countData['totalreview'] + 1;
        }
        if (data.createdBy !== this.currentUserID && data.status === 'Review') {
          this.countData['awaitingreview'] = this.countData['awaitingreview'] + 1;
        }
        if (this.sourcingOrgReviewer && data.status === 'Live' &&
        // tslint:disable-next-line:max-line-length
        !_.includes([...this.storedCollectionData.acceptedContents || [], ...this.storedCollectionData.rejectedContents || []], data.identifier)) {
          this.countData['pendingReview'] = this.countData['pendingReview'] + 1;
          this.countData['sourcing_approvalPending'] = this.countData['sourcing_approvalPending'] + 1;
          this.countData['sourcing_total'] = this.countData['sourcing_total'] + 1;
        }
        if (this.sourcingOrgReviewer && data.status === 'Draft' && data.prevStatus === 'Live' ) {
          this.countData['sourcing_correctionPending'] = this.countData['sourcing_correctionPending'] + 1;
          this.countData['sourcing_total'] = this.countData['sourcing_total'] + 1;
        }
        if (this.sourcingOrgReviewer && data.status === 'Live' && _.includes([...this.storedCollectionData.acceptedContents || []], data.identifier)) {
          this.countData['sourcing_approved'] = this.countData['sourcing_approved'] + 1;
          this.countData['sourcing_total'] = this.countData['sourcing_total'] + 1;
           // Add blueprint metrics count
            if(data.questionCategories && data.questionCategories.length) {
              _.forEach(data.questionCategories, (cat)=> {
                if(cat === "MTF" || cat === "FTB" || cat === "MCQ") {
                  this.countData['objective'] = this.countData['objective'] + 1;
                }
                else if(cat === "VSA" || cat === "SA" || cat === "LA") {
                  if(cat === "VSA") this.countData['vsa'] = this.countData['vsa'] + 1;
                  if(cat === "SA") this.countData['sa'] = this.countData['sa'] + 1;
                  if(cat === "LA") this.countData['la'] = this.countData['la'] + 1;
                  this.countData['subjective'] = this.countData['subjective'] + 1;
                }
              })
            }
            if(data.bloomsLevel && data.bloomsLevel.length) {
              _.forEach(data.bloomsLevel, (bl)=> {
                bl = bl.toLowerCase();
                if(bl === "remember") {
                this.countData['remember'] = this.countData['remember'] + 1;
                }
                else if(bl === "understand") {
                  this.countData['understand'] = this.countData['understand'] + 1;
                }
                else if(bl === "apply") {
                  this.countData['apply'] = this.countData['apply'] + 1;
                }
              })
            }
            if(this.localBlueprint) {
              if(data.topic && data.topic.length) {
                _.forEach(data.topic, (topic)=> {
                  if(_.includes(this.localUniqueTopicsList, topic)) return;
                  else {
                    this.localUniqueTopicsList.push(topic);
                    this.countData['topics'] = this.countData['topics'] + 1;
                    this.topicsInsideBlueprint = this.topicsInsideBlueprint && _.some(this.localBlueprint.topics, {name: topic})
                  }
                })
              }
              if(data.learningOutcome && data.learningOutcome.length) {
                _.forEach(data.learningOutcome, (lo)=> {
                  if(_.includes(this.localUniqueLearningOutcomesList, lo)) return;
                  else {
                    this.localUniqueLearningOutcomesList.push(lo);
                    this.countData['learningOutcomes'] = this.countData['learningOutcomes'] + 1;
                    this.learningOutcomesInsideBlueprint = this.learningOutcomesInsideBlueprint && _.some(this.localBlueprint.learningOutcomes, {name: lo})
                  }
                })
              }
            }
        }
        if (this.sourcingOrgReviewer && data.status === 'Live' && _.includes([...this.storedCollectionData.rejectedContents || []], data.identifier)) {
          this.countData['sourcing_rejected'] = this.countData['sourcing_rejected'] + 1;
          this.countData['sourcing_total'] = this.countData['sourcing_total'] + 1;
        }
      }
    }

    const childData = data.children;
    if (childData) {
      childData.map(child => {
        self.getContentStatusCount(child);
      });
    }
  }
  checkifContent (content) {
    if (content.mimeType !== 'application/vnd.ekstep.content-collection' && content.visibility !== 'Parent') {
      return true;
    } else {
      return false;
    }
  }
  changeView() {
    // if (!_.isEmpty(this.state.stages)) {
    //   this.currentStage = _.last(this.state.stages).stage;
    // }
    if (this.currentStage == 'contentUploaderComponent') {
      this.updateAccordianView(this.unitIdentifier);
      this.resetContentId();
    }else{
      this.currentStage = ''
    }
  }
  public resetContentId() {
    this.contentId = '';
  }

}
