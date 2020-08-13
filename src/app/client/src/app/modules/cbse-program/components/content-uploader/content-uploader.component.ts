import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef,
  AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FineUploader } from 'fine-uploader';
import { ToasterService, ConfigService, ResourceService, NavigationHelperService, BrowserCacheTtlService } from '@sunbird/shared';
import { PublicDataService, UserService, ActionService, PlayerService, FrameworkService, NotificationService,
  ProgramsService, ContentService} from '@sunbird/core';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import * as _ from 'lodash-es';
import { catchError, map, first } from 'rxjs/operators';
import { throwError, Observable, Subscription } from 'rxjs';
import { IContentUploadComponentInput} from '../../interfaces';
import { FormGroup, FormArray, FormBuilder, Validators, NgForm } from '@angular/forms';
import { CbseProgramService } from '../../services/cbse-program/cbse-program.service';
import { AzureFileUploaderService } from '../../services';
import { HelperService } from '../../services/helper.service';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-content-uploader',
  templateUrl: './content-uploader.component.html',
  styleUrls: ['./content-uploader.component.scss']
})
export class ContentUploaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modal;
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  @ViewChild('qq-upload-actions') actionButtons: ElementRef;
  @ViewChild('titleTextArea') titleTextAreaa: ElementRef;
  @ViewChild('FormControl') FormControl: NgForm;
  // @ViewChild('contentTitle') contentTitle: ElementRef;
  @Input() contentUploadComponentInput: IContentUploadComponentInput;

  public sessionContext: any;
  public sharedContext: any;
  public selectedSharedContext: any;
  public programContext: any;
  public templateDetails: any;
  public unitIdentifier: any;
  public formConfiguration: any;
  public actions: any;
  public textFields: Array<any>;
  @Output() uploadedContentMeta = new EventEmitter<any>();
  public playerConfig;
  public showPreview = false;
  public resourceStatus;
  public resourceStatusText = '';
  public notify;
  public config: any;
  public resourceStatusClass = '';
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
  disableFormField: boolean;
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
  public telemetryPageId = 'content-uploader';
  public sourcingOrgReviewer: boolean;
  public sourcingReviewStatus: string;
  public contentType: string;
  public rejectBySourcingOrg: boolean;
  public sourcingOrgReviewComments: string;
  originPreviewUrl = '';
  originPreviewReady = false;
  public azurFileUploaderSubscrition: Subscription;
  public fileUplaoderProgress = {
           progress: 0
         };
  public videoFileFormat: boolean;
  public uploadInprogress: boolean;
  public docExtns: string;
  public vidEtns: string;
  public allAvailableVidExtns = ['mp4', 'webm'];
  public allAvailableDocExtns = ['pdf', 'epub', 'h5p'];
  public videoSizeLimit: string;
  public originCollectionData: any;
  selectedOriginUnitStatus: any;

  constructor(public toasterService: ToasterService, private userService: UserService,
    private publicDataService: PublicDataService, public actionService: ActionService,
    public playerService: PlayerService, public configService: ConfigService, private formBuilder: FormBuilder,
    private cbseService: CbseProgramService, public frameworkService: FrameworkService,
    public programStageService: ProgramStageService, private helperService: HelperService,
    private collectionHierarchyService: CollectionHierarchyService, private cd: ChangeDetectorRef,
    private resourceService: ResourceService, public programTelemetryService: ProgramTelemetryService,
    private notificationService: NotificationService,
    public activeRoute: ActivatedRoute, public router: Router, private navigationHelperService: NavigationHelperService,
    private programsService: ProgramsService, private azureUploadFileService: AzureFileUploaderService,
    private contentService: ContentService, private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService) { }

  ngOnInit() {
    this.config = _.get(this.contentUploadComponentInput, 'config');
    this.originCollectionData = _.get(this.contentUploadComponentInput, 'originCollectionData');
    this.selectedOriginUnitStatus = _.get(this.contentUploadComponentInput, 'content.originUnitStatus');
    this.sessionContext  = _.get(this.contentUploadComponentInput, 'sessionContext');
    this.templateDetails  = _.get(this.contentUploadComponentInput, 'templateDetails');
    this.unitIdentifier  = _.get(this.contentUploadComponentInput, 'unitIdentifier');
    this.programContext = _.get(this.contentUploadComponentInput, 'programContext');
    this.titleCharacterLimit = _.get(this.config, 'config.resourceTitleLength');
    this.actions = _.get(this.contentUploadComponentInput, 'programContext.config.actions');
    this.selectedSharedContext = _.get(this.contentUploadComponentInput, 'selectedSharedContext');
    this.sharedContext = _.get(this.contentUploadComponentInput, 'programContext.config.sharedContext');
    this.sourcingReviewStatus = _.get(this.contentUploadComponentInput, 'sourcingStatus') || '';
    if (_.get(this.contentUploadComponentInput, 'action') === 'preview') {
      this.showUploadModal = false;
      this.showPreview = true;
      this.cd.detectChanges();
      this.getUploadedContentMeta(_.get(this.contentUploadComponentInput, 'contentId'));
    }
    this.segregateFileTypes();
    this.notify = this.helperService.getNotification().subscribe((action) => {
      this.contentStatusNotify(action);
    });

    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.contentUploadComponentInput.programContext.program_id, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.contentUploadComponentInput.contentId, 'Content', '1.0', { l1: this.sessionContext.collection, l2: this.unitIdentifier});
  }

  ngAfterViewInit() {
    if (_.get(this.contentUploadComponentInput, 'action') !== 'preview') {
      this.fetchFileSizeLimit();
    }
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

  handleActionButtons() {
    this.visibility = {};
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);

    // tslint:disable-next-line:max-line-length
    this.visibility['showChangeFile'] = submissionDateFlag && (_.includes(this.actions.showChangeFile.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
    // tslint:disable-next-line:max-line-length
    this.visibility['showRequestChanges'] = this.router.url.includes('/contribute') && submissionDateFlag && !this.contentMetaData.sampleContent === true &&
     (_.includes(this.actions.showRequestChanges.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review');

    // tslint:disable-next-line:max-line-length
    this.visibility['showPublish'] = submissionDateFlag && this.router.url.includes('/contribute') && !this.contentMetaData.sampleContent === true &&
    (_.includes(this.actions.showPublish.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review');
    // tslint:disable-next-line:max-line-length
    this.visibility['showSubmit'] = submissionDateFlag && (_.includes(this.actions.showSubmit.roles, this.sessionContext.currentRoleId)  && this.resourceStatus === 'Draft');
    // tslint:disable-next-line:max-line-length
    this.visibility['showSave'] = submissionDateFlag && !this.contentMetaData.sampleContent === true && (_.includes(this.actions.showSave.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
    // tslint:disable-next-line:max-line-length
    this.visibility['showEdit'] = submissionDateFlag && (_.includes(this.actions.showEdit.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Draft');
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
      this.helperService.checkFileSizeLimit(request).subscribe(res => {
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
      const reqBody = this.sharedContext.reduce((obj, context) => {
        return { ...obj, [context]: this.selectedSharedContext[context] || this.sessionContext[context] };
      }, {});
      const option = {
        url: `content/v3/create`,
        data: {
          request: {
            content: {
              'name': 'Untitled',
              'code': UUID.UUID(),
              'mimeType': this.detectMimeType(this.uploader.getName(0)),
              'createdBy': this.userService.userid,
              'contentType': this.templateDetails.metadata.contentType,
              'resourceType': this.templateDetails.metadata.resourceType || 'Learn',
              'creator': creator,
              'collectionId': this.sessionContext.collection,
              ...(this.sessionContext.nominationDetails &&
                this.sessionContext.nominationDetails.organisation_id &&
                {'organisationId': this.sessionContext.nominationDetails.organisation_id || null}),
              'programId': this.sessionContext.programId,
              'unitIdentifiers': [this.unitIdentifier],
              ...(_.pickBy(reqBody, _.identity))
              // 'framework': this.sessionContext.framework,
              // 'organisation': this.sessionContext.onBoardSchool ? [this.sessionContext.onBoardSchool] : [],
            }
          }
        }
      };
      if (this.sessionContext.sampleContent) {
        option.data.request.content.sampleContent = this.sessionContext.sampleContent;
      }
      if (this.templateDetails.metadata.appIcon) {
        option.data.request.content.appIcon = this.templateDetails.metadata.appIcon;
      }
      this.actionService.post(option).pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = { errorMsg: 'Unable to create contentId, Please Try Again' };
        this.programStageService.removeLastStage();
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
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
      const errInfo = { errorMsg: 'Unable to get pre_signed_url and Content Creation Failed, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      const signedURL = res.result.pre_signed_url;
      this.uploadInprogress = true;
      if (this.videoFileFormat) {
        // tslint:disable-next-line:max-line-length
        this.azurFileUploaderSubscrition = this.azureUploadFileService.uploadToBlob(signedURL, this.uploader.getFile(0)).subscribe((event: any) => {
          this.fileUplaoderProgress.progress = event.percentComplete;
          this.fileUplaoderProgress['remainingTime'] = event.remainingTime;
        }, (error) => {
          const errInfo = { errorMsg: 'Unable to upload to Blob, Please Try Again' };
          this.cbseService.apiErrorHandling(error, errInfo);
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
      const errInfo = { errorMsg: 'Unable to upload to Blob, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
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
      const errInfo = { errorMsg: 'Unable to update pre_signed_url with Content Id and Content Creation Failed, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
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

  getUploadedContentMeta(contentId) {
    const option = {
      url: 'content/v3/read/' + contentId
    };
    this.actionService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
  })).subscribe(res => {
      const contentDetails = {
        contentId: contentId,
        contentData: res
      };
      this.contentMetaData = res;
      const contentTypeValue = [this.contentMetaData.contentType];
      this.contentType = this.programsService.getContentTypesName(contentTypeValue);
      this.editTitle = (this.contentMetaData.name !== 'Untitled') ? this.contentMetaData.name : '' ;
      this.resourceStatus = this.contentMetaData.status;
      if (this.resourceStatus === 'Review') {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
        this.resourceStatusClass = 'sb-color-warning';
      } else if (this.resourceStatus === 'Draft' && this.contentMetaData.prevStatus === 'Review') {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
        this.resourceStatusClass = 'sb-color-gray';
      } else if (this.resourceStatus === 'Live' && _.isEmpty(this.sourcingReviewStatus)) {
        this.resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
        this.resourceStatusClass = 'sb-color-success';
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
        this.resourceStatusClass = 'sb-color-primary';
      }

      this.playerConfig = this.playerService.getConfig(contentDetails);
      this.playerConfig.context.pdata.pid = `${this.configService.appConfig.TELEMETRY.PID}`;
      this.showPreview = this.contentMetaData.artifactUrl ? true : false;
      this.showUploadModal = false;
      if (!this.contentMetaData.artifactUrl) {
        this.fetchFileSizeLimit();
      }
      this.loading = false;
      this.handleActionButtons();

      if (this.visibility && this.visibility.showEdit && !this.editTitle) {
        this.editContentTitle();
      }

      // At the end of execution
      if ( _.isUndefined(this.sessionContext.topicList)) {
        this.fetchFrameWorkDetails();
      }
      this.manageFormConfiguration();
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
    switch (extn) {
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
      case 'h5p':
        return 'application/vnd.ekstep.h5p-archive';
      case 'zip':
        return 'application/vnd.ekstep.html-archive';
      case 'epub':
        return 'application/epub';
      case 'webm':
        return 'video/webm';
      default:
        // return this.validateUploadURL(fileName);
    }
  }

  manageFormConfiguration() {
    const controller = {};
    this.showForm = true;
    // tslint:disable-next-line:max-line-length
    const compConfiguration = _.find(_.get(this.contentUploadComponentInput, 'programContext.config.components'), {compId: 'uploadContentComponent'});
    this.formConfiguration = compConfiguration.config.formConfiguration;
    this.textFields = _.filter(this.formConfiguration, {'inputType': 'text', 'visible': true});
    this.allFormFields = _.filter(this.formConfiguration, {'visible': true});

    this.disableFormField = (this.sessionContext.currentRole === 'CONTRIBUTOR' && this.resourceStatus === 'Draft') ? false : true ;
    _.forEach(this.formConfiguration, (formData) => {
      this.selectOutcomeOption[formData.code] = formData.defaultValue;
    });

    this.helperService.getLicences().subscribe((res) => {
      this.selectOutcomeOption['license'] = _.map(res.license, (license) => {
        return license.name;
      });
    });
    if ( _.isArray(this.sessionContext.topic)) {
      this.sessionContext.topic = _.first(this.sessionContext.topic);
    }
    this.sessionContext.topic = _.first(this.selectedSharedContext.topic) || this.sessionContext.topic ;
    this.sessionContext.topic = _.isArray(this.sessionContext.topic) ? this.sessionContext.topic : _.split(this.sessionContext.topic, ',');
    const topicTerm = _.find(this.sessionContext.topicList, { name: this.sessionContext.topic });
    if (topicTerm && topicTerm.associations) {
       this.selectOutcomeOption['learningOutcome'] = _.map(topicTerm.associations, (learningOutcome) => {
        return learningOutcome.name;
      });
    }

     _.map(this.allFormFields, (obj) => {
      const code = obj.code;
      const preSavedValues = {};
      if (this.contentMetaData) {
        if (obj.inputType === 'select') {
          // tslint:disable-next-line:max-line-length
          preSavedValues[code] = (this.contentMetaData[code]) ? (_.isArray(this.contentMetaData[code]) ? this.contentMetaData[code][0] : this.contentMetaData[code]) : '';
          // tslint:disable-next-line:max-line-length
          obj.required ? controller[obj.code] = [preSavedValues[code], [Validators.required]] : controller[obj.code] = preSavedValues[code];
        } else if (obj.inputType === 'multiselect') {
          // tslint:disable-next-line:max-line-length
          preSavedValues[code] = (this.contentMetaData[code] && this.contentMetaData[code].length) ? this.contentMetaData[code] : [];
          // tslint:disable-next-line:max-line-length
          obj.required ? controller[obj.code] = [preSavedValues[code], [Validators.required]] : controller[obj.code] = [preSavedValues[code]];
        } else if (obj.inputType === 'text') {
          if (obj.dataType === 'list') {
            const listValue = (this.contentMetaData[code]) ? this.contentMetaData[code] : '';
            preSavedValues[code] = _.isArray(listValue) ? listValue.toString() : '';
          } else {
            preSavedValues[code] = (this.contentMetaData[code]) ? this.contentMetaData[code] : '';
          }
          // tslint:disable-next-line:max-line-length
          obj.required ? controller[obj.code] = [{value: preSavedValues[code], disabled: this.disableFormField}, [Validators.required]] : controller[obj.code] = preSavedValues[code];
        } else if (obj.inputType === 'checkbox') {
          // tslint:disable-next-line:max-line-length
          preSavedValues[code] = (this.contentMetaData[code]) ? this.contentMetaData[code] : false;
          // tslint:disable-next-line:max-line-length
          obj.required ? controller[obj.code] = [{value: preSavedValues[code], disabled: this.contentMetaData[code]}, [Validators.requiredTrue]] : controller[obj.code] = preSavedValues[code];
        }
      }
    });

    this.contentDetailsForm = this.formBuilder.group(controller);
  }

  fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        this.sessionContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }

  editContentTitle() {
    this.showTextArea = true;
    this.cd.detectChanges();
    this.titleTextAreaa.nativeElement.focus();
  }

  saveTitle() {
   this.editTitle = (_.trim(this.editTitle) !== 'Untitled') ? _.trim(this.editTitle) : '' ;

   if (this.editTitle === '' || (this.editTitle.length > this.titleCharacterLimit)) {
    this.editContentTitle();
   } else {
    if (_.trim(this.editTitle) === _.trim(this.contentMetaData.name)) {
      this.showTextArea = true;
      return;
    } else {
   this.editTitle = _.trim(this.editTitle);
   const contentObj = {
     'versionKey': this.contentMetaData.versionKey,
     'name': this.editTitle
    };
    const request = {
    'content': contentObj
    };
   this.helperService.updateContent(request, this.contentMetaData.identifier).subscribe((res) => {
   this.contentMetaData.versionKey = res.result.versionKey;
   this.contentMetaData.name = this.editTitle;
   const contentDetails = {
    contentId: this.contentMetaData.identifier,
    contentData: this.contentMetaData
    };
   this.playerConfig = this.playerService.getConfig(contentDetails);
   // tslint:disable-next-line:max-line-length
   this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
   .subscribe((data) => {
       this.toasterService.success(this.resourceService.messages.smsg.m0060);
     }, (err) => {
       this.toasterService.error(this.resourceService.messages.fmsg.m0098);
     });
    }, (err) => {
    this.editTitle = this.contentMetaData.name;
    this.toasterService.error(this.resourceService.messages.fmsg.m0098);
   });
  }
   }
  }

  changePolicyCheckValue (event) {
    if ( event.target.checked ) {
      this.contentDetailsForm.controls.contentPolicyCheck.setValue(true);
    } else {
      this.contentDetailsForm.controls.contentPolicyCheck.setValue(false);
    }
  }

  saveContent(action?) {
    const requiredTextFields = _.filter(this.textFields, {required: true});
    const validText = _.map(requiredTextFields, (obj) => {
       return _.trim(this.contentDetailsForm.value[obj.code]).length !== 0;
    });
    // tslint:disable-next-line:max-line-length
    if (this.contentDetailsForm.valid && this.editTitle && this.editTitle !== '' && !_.includes(validText, false)) {
      this.showTextArea = false;
      this.formValues = {};
      let contentObj = {
          'versionKey': this.contentMetaData.versionKey,
          'name': this.editTitle
      };
      const trimmedValue = _.mapValues(this.contentDetailsForm.value, (value) => {
         if (_.isString(value)) {
           return _.trim(value);
         } else {
           return value;
         }
      });

      _.forEach(this.textFields, field => {
        if (field.dataType === 'list') {
          trimmedValue[field.code] = trimmedValue[field.code] ? trimmedValue[field.code].split(', ') : [];
        }
      });
      contentObj = _.pickBy(_.assign(contentObj, trimmedValue), _.identity);
      const request = {
        'content': contentObj
      };
      this.helperService.updateContent(request, this.contentMetaData.identifier).subscribe((res) => {
        this.contentMetaData.versionKey = res.result.versionKey;
        if (action === 'review' && this.isIndividualAndNotSample()) {
          this.publishContent();
        } else if (action === 'review') {
          this.sendForReview();
        } else if (this.sessionContext.collection && this.unitIdentifier && action !== 'review') {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0060);
          }, (err) => {
            this.toasterService.error(this.resourceService.messages.fmsg.m0098);
          });
        } else {
          this.toasterService.success(this.resourceService.messages.smsg.m0060);
        }
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0098);
      });
    } else {
      this.markFormGroupTouched(this.contentDetailsForm);
      this.toasterService.error(this.resourceService.messages.fmsg.m0076);
    }
  }

  sendForReview() {
    this.helperService.reviewContent(this.contentMetaData.identifier)
       .subscribe((res) => {
        if (this.sessionContext.collection && this.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0061);
            this.programStageService.removeLastStage();
            this.uploadedContentMeta.emit({
              contentId: res.result.content_id
            });
          }, (err) => {
            this.toasterService.error(this.resourceService.messages.fmsg.m0099);
          });
        }
       }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0099);
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
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
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
            this.toasterService.success(this.resourceService.messages.smsg.contentAcceptMessage.m0001);
            this.programStageService.removeLastStage();
            this.uploadedContentMeta.emit({
              contentId: res.result.identifier
            });
          });
        }
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m00102);
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
      if (!_.isUndefined(this.sessionContext.nominationDetails.user_id) && status !== 'Request') {
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
    this.programStageService.removeLastStage();
  }

  changeFile() {
    this.changeFile_instance = true;
    this.uploadButton = false;
    this.fetchFileSizeLimit();
  }

  attachContentToTextbook(action) {
    const hierarchyObj  = _.get(this.sessionContext.hierarchyObj, 'hierarchy');
    if (hierarchyObj) {
      const rootOriginInfo = _.get(_.get(hierarchyObj, this.sessionContext.collection), 'originData');
      let channel =  rootOriginInfo && rootOriginInfo.channel;
      if (_.isUndefined(channel)) {
        const originInfo = _.get(_.get(hierarchyObj, this.unitIdentifier), 'originData');
        channel = originInfo && originInfo.channel;
      }
      const originData = {
        textbookOriginId: _.get(_.get(hierarchyObj, this.sessionContext.collection), 'origin'),
        unitOriginId: _.get(_.get(hierarchyObj, this.unitIdentifier), 'origin'),
        channel: channel
      };
      if (originData.textbookOriginId && originData.unitOriginId && originData.channel) {
        if (action === 'accept') {
          // tslint:disable-next-line:max-line-length
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.contentMetaData.identifier, originData);
        } else if (action === 'reject' && this.FormControl.value.rejectComment.length) {
          // tslint:disable-next-line:max-line-length
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.contentMetaData.identifier, originData, this.FormControl.value.rejectComment);
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

  ngOnDestroy() {
    this.notify.unsubscribe();
    if (this.azurFileUploaderSubscrition) {
      this.azurFileUploaderSubscrition.unsubscribe();
    }
  }

  showSourcingOrgRejectComments() {
    if (this.resourceStatus === 'Live' && _.get(this.sessionContext.hierarchyObj, 'sourcingRejectedComments') &&
    _.get(this.sessionContext.hierarchyObj.sourcingRejectedComments, this.contentMetaData.identifier)) {
      this.sourcingOrgReviewComments = _.get(this.sessionContext.hierarchyObj.sourcingRejectedComments, this.contentMetaData.identifier);
     return true;
    } else {
      return false;
    }
  }

  showContributorOrgReviewComments() {
    if (this.contentMetaData && this.contentMetaData.rejectComment && this.sessionContext.currentRoleId === 1 &&
        this.resourceStatus === 'Draft' && this.contentMetaData.prevStatus === 'Review') {
      return true;
    } else {
      return false;
    }
  }
}
