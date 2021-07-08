import { Component, OnInit, AfterViewInit, NgZone, Renderer2, OnDestroy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import * as iziModal from 'izimodal/js/iziModal';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, IUserProfile } from '@sunbird/shared';
import { UserService, TenantService, FrameworkService, PlayerService, NotificationService, ProgramsService,
  ActionService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@sunbird/environment';
import { TelemetryService } from '@sunbird/telemetry';
import { of, Subject } from 'rxjs';
import { tap, delay, first, filter, takeUntil, take } from 'rxjs/operators';
import { IContentEditorComponentInput } from '../../interfaces';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { HelperService } from '../../services/helper.service';
import { NgForm } from '@angular/forms';
jQuery.fn.iziModal = iziModal;

@Component({
  selector: 'app-content-editor',
  templateUrl: './content-editor.component.html',
  styleUrls: ['./content-editor.component.scss']
})
export class ContentEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() contentEditorComponentInput: IContentEditorComponentInput;
  @ViewChild('FormControl') FormControl: NgForm;
  @Output() uploadedContentMeta = new EventEmitter<any>();
  private userProfile: IUserProfile;
  private routeParams: any;
  private buildNumber: string;
  private deviceId: string;
  private portalVersion: string;
  public logo: string;
  public showLoader = true;
  public contentDetails: any;
  public contentEditorComponentInputs : any;
  public ownershipType: any;
  public queryParams: object;
  public videoMaxSize: any;
  public showPreview = false;
  public playerConfig: any;
  public sessionContext: any;
  public showRequestChangesPopup: boolean;
  public visibility: any;
  public resourceStatus: string;
  public contentData: any;
  public resourceStatusText: string;
  public telemetryImpression: any;
  public telemetryPageId = 'content-editor';
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public popupAction: string;
  public unitIdentifier: string;
  public programContext: any;
  public sourcingOrgReviewer: boolean;
  public originCollectionData: any;
  public sourcingReviewStatus: string;
  public selectedOriginUnitStatus: string;
  public showEditMetaForm = false;
  public requiredAction: string;
  public formFieldProperties: Array<any>;
  public selectedSharedContext: any;
  public editableFields = [];
  public contentEditRole: string;
  public categoryMasterList: Array<any>;
  public resourceStatusClass = '';
  public originPreviewUrl: string;
  public originPreviewReady: boolean;
  public contentComment: string;
  public showReviewModal: boolean;
  private onComponentDestroy$ = new Subject<any>();
  public formstatus: any;
  public formInputData: any;

  constructor(
    private resourceService: ResourceService,
    private toasterService: ToasterService,
    private configService: ConfigService,
    private userService: UserService,
    private _zone: NgZone,
    private tenantService: TenantService,
    private telemetryService: TelemetryService,
    private router: Router,
    private navigationHelperService: NavigationHelperService,
    public programStageService: ProgramStageService,
    private frameworkService: FrameworkService,
    private playerService: PlayerService,
    public collectionHierarchyService: CollectionHierarchyService,
    public helperService: HelperService,
    public activeRoute: ActivatedRoute,
    public programTelemetryService: ProgramTelemetryService,
    private notificationService: NotificationService,
    private programsService: ProgramsService,
    public actionService: ActionService
  ) {
    const buildNumber = <HTMLInputElement>(
      document.getElementById('buildNumber')
    );
    this.buildNumber = buildNumber ? buildNumber.value : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    this.deviceId = deviceId ? deviceId.value : '';
    this.portalVersion =
      buildNumber && buildNumber.value
        ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.'))
        : '1.0';
    this.videoMaxSize = <HTMLInputElement>(
      document.getElementById('videoMaxSize')
    )
      ? (<HTMLInputElement>document.getElementById('videoMaxSize')).value
      : '100';
  }

  ngOnInit() {
    this.userProfile = this.userService.userProfile;
    this.sessionContext = this.contentEditorComponentInput.sessionContext;
    this.unitIdentifier  = _.get(this.contentEditorComponentInput, 'unitIdentifier');
    this.programContext = _.get(this.contentEditorComponentInput, 'programContext');
    this.originCollectionData = _.get(this.contentEditorComponentInput, 'originCollectionData');
    this.selectedOriginUnitStatus = _.get(this.contentEditorComponentInput, 'content.originUnitStatus');
    this.selectedSharedContext = _.get(this.contentEditorComponentInput, 'selectedSharedContext');
    this.sourcingReviewStatus = _.get(this.contentEditorComponentInput, 'sourcingStatus') || '';
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.contentEditorComponentInput.programContext.program_id, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.contentEditorComponentInput.contentId, 'Content', '1.0', { l1: this.sessionContext.collection, l2: this.contentEditorComponentInput.unitIdentifier});
    this.getContentMetadata();
    this.helperService.getNotification().pipe(takeUntil(this.onComponentDestroy$)).subscribe((action) => {
      this.contentStatusNotify(action);
    });
    this.helperService.initialize(this.programContext);
    if (_.has(this.sessionContext.collectionTargetFrameworkData, 'targetFWIds')) {
      const targetFWIds = this.sessionContext.collectionTargetFrameworkData.targetFWIds;
      if (!_.isUndefined(targetFWIds)) {
        this.helperService.setTargetFrameWorkData(targetFWIds);
      }
    }
  }
  loadContentEditor() {
    if (!document.getElementById('contentEditor')) {
      const editorElement = document.createElement('div');
      const editorComponent = document.getElementsByTagName('app-content-editor');
      editorElement.id = 'contentEditor';
      if (_.first(editorComponent)) {
        editorComponent[0].append(editorElement);
      } else {
        return;
      }
    }
    setTimeout(() => {
      this.getDetails()
      .pipe(
        first(),
        tap(data => {
          this.logo = data.tenantDetails.logo;
          this.ownershipType = data.ownershipType;
          this.showLoader = false;
          this.initEditor();
          this.setWindowContext();
          this.setWindowConfig();
        }),
        delay(10)
      ) // wait for iziModal to load
      .subscribe(
        data => {
          jQuery('#contentEditor').iziModal('open');
        },
        error => {
            this.toasterService.error(this.resourceService.messages.emsg.m0004);
          this.closeModal();
        }
      );
    }, 0);
  }
  ngAfterViewInit() {
    const telemetryCdata = [{ 'type': 'Program', 'id': this.contentEditorComponentInput.programContext.program_id }];
    setTimeout(() => {
    this.telemetryImpression = {
      context: {
        env: this.activeRoute.snapshot.data.telemetry.env,
        cdata: telemetryCdata || [],
        pdata: {
          id: this.userService.appId,
          ver: this.portalVersion,
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

  hasAccessFor(roles: Array<string>) {
    return !_.isEmpty(_.intersection(roles, this.sessionContext.currentRoles || []));
  }

  handleActionButtons() {
    this.visibility = {};
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);
    this.visibility['showRequestChanges'] = submissionDateFlag && this.canReviewContent();
    this.visibility['showPublish'] = submissionDateFlag && this.canPublishContent();
    this.visibility['showSubmit'] = submissionDateFlag && this.canSubmit();
    this.visibility['showEditMetadata'] = submissionDateFlag && this.canEditMetadata();
    this.visibility['showEdit'] = submissionDateFlag && this.canEdit();
    this.visibility['showSourcingActionButtons'] = this.canSourcingReviewerPerformActions();
    this.visibility['showSendForCorrections'] = this.visibility['showSourcingActionButtons'] && this.canSendForCorrections();
  }

  canSendForCorrections() {
    return !this.contentData.sourceURL;
  }

  canEdit() {
    // tslint:disable-next-line:max-line-length
    return !!(this.resourceStatus === 'Draft' && this.userService.userid === this.contentData.createdBy);
  }

  canSave() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && !this.contentData.sampleContent === true && this.resourceStatus === 'Draft' && (this.userService.userid === this.contentData.createdBy));
  }

  canEditMetadata() {
    // tslint:disable-next-line:max-line-length
    return !!(_.find(this.formFieldProperties, field => field.editable === true));
  }

  canSubmit() {
    // tslint:disable-next-line:max-line-length
    return !!(this.hasAccessFor(['CONTRIBUTOR']) && this.resourceStatus === 'Draft' && this.userService.userid === this.contentData.createdBy);
  }

  canViewContentPreview() {
    // tslint:disable-next-line:max-line-length
    return !!(this.sourcingOrgReviewer || (this.sessionContext.currentRoles.includes('REVIEWER') && this.userService.userid !== this.contentData.createdBy) || (this.resourceStatus !== 'Draft' && this.userService.userid === this.contentData.createdBy));
  }

  canPublishContent() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/contribute') && !this.contentData.sampleContent === true &&
    // tslint:disable-next-line:max-line-length
    this.hasAccessFor(['REVIEWER']) && this.resourceStatus === 'Review' && this.userService.userid !== this.contentData.createdBy);
  }

  canReviewContent() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/contribute') && !this.contentData.sampleContent === true && this.hasAccessFor(['REVIEWER']) && this.resourceStatus === 'Review' && this.userService.userid !== this.contentData.createdBy);
  }

  canSourcingReviewerPerformActions() {
    // tslint:disable-next-line:max-line-length
    return !!(this.router.url.includes('/sourcing')
    && !this.contentData.sampleContent === true && this.resourceStatus === 'Live'
    && this.userService.userid !== this.contentData.createdBy
    && this.resourceStatus === 'Live' && !this.sourcingReviewStatus &&
    (this.originCollectionData.status === 'Draft' && this.selectedOriginUnitStatus === 'Draft')
    && this.programsService.isProjectLive(this.programContext));
  }

  getContentMetadata() {
    const option = {
      url: 'content/v3/read/' + this.contentEditorComponentInput.contentId
    };
    this.actionService.get(option).subscribe(
      response => {
        if (response.result.content) {
          const contentDetails = {
            contentId: this.contentEditorComponentInput.contentId,
            contentData: response.result.content
          };
          this.playerConfig = this.playerService.getConfig(contentDetails);
          this.playerConfig.data = this.playerService.updateContentBodyForReviewer(
            this.playerConfig.data
          );
         this.contentData = response.result.content;
         this.contentEditorComponentInput.content = this.contentData;
         this.resourceStatus = this.contentData.status;
      if (this.resourceStatus === 'Review') {
        this.resourceStatusText = 'Review in Progress';
      } else if (this.resourceStatus === 'Draft' && this.contentData.prevStatus === 'Review') {
        this.resourceStatusText = 'Rejected';
      } else if (this.resourceStatus === 'Live') {
        this.resourceStatusText = 'Published';
      } else {
        this.resourceStatusText = this.resourceStatus;
      }
      this.handleActionButtons();
      this.handleContentStatusText();
      this.handlePreview();
      if ( _.isUndefined(this.sessionContext.topicList) || _.isUndefined(this.sessionContext.frameworkData)) {
        this.fetchFrameWorkDetails();
      }
      this.fetchCategoryDetails();
        } else {
          this.toasterService.warning(this.resourceService.messages.imsg.m0027);
        }
      },
      err => {
        this.toasterService.warning(this.resourceService.messages.imsg.m0027);
        this.programStageService.removeLastStage();
      }
    );
  }

  handlePreview() {
    // tslint:disable-next-line:max-line-length
    if (this.showPreview || this.canViewContentPreview()) {
      this.showPreview = true;
      this.showLoader = false;
    } else {
      this.loadContentEditor();
   }
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
      primaryCategory: this.contentData.primaryCategory,
      channelId: _.get(this.programContext, 'rootorg_id'),
      objectType: this.contentData.objectType
    };

    this.helperService.getCollectionOrContentCategoryDefinition(targetCollectionMeta, assetMeta);
  }

  handleContentStatusText() {
    if (this.resourceStatus === 'Review') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
      this.resourceStatusClass = 'sb-color-primary';
    } else if (this.resourceStatus === 'Draft' && this.contentData.prevStatus === 'Review') {
      this.resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
      this.resourceStatusClass = 'sb-color-error';
    } else if (this.resourceStatus === 'Draft' && this.contentData.prevStatus === 'Live') {
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
      if (!_.isEmpty(this.sessionContext.contentOrigins) && !_.isEmpty(this.sessionContext.contentOrigins[this.contentData.identifier])) {
        // tslint:disable-next-line:max-line-length
        this.originPreviewUrl =  this.helperService.getContentOriginUrl(this.sessionContext.contentOrigins[this.contentData.identifier].identifier);
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
    this.formFieldProperties = this.helperService.initializeFormFields(this.sessionContext, this.formFieldProperties, this.contentData);
    this.showEditMetaForm = true;
  }

  getEditableFields() {
    if (this.hasRole('CONTRIBUTOR') && this.hasRole('REVIEWER')) {
      if (this.userService.userid === this.contentData.createdBy && this.resourceStatus === 'Draft') {
        this.editableFields = this.helperService.getEditableFields('CONTRIBUTOR', this.formFieldProperties, this.contentData);
        this.contentEditRole = 'CONTRIBUTOR';
      } else if (this.canPublishContent()) {
        this.editableFields = this.helperService.getEditableFields('REVIEWER', this.formFieldProperties, this.contentData);
        this.contentEditRole = 'REVIEWER';
      }
    } else if (this.hasRole('CONTRIBUTOR') && this.resourceStatus === 'Draft') {
      this.editableFields = this.helperService.getEditableFields('CONTRIBUTOR', this.formFieldProperties, this.contentData);
      this.contentEditRole = 'CONTRIBUTOR';
    } else if ((this.sourcingOrgReviewer || (this.visibility && this.visibility.showPublish))
      && (this.resourceStatus === 'Live' || this.resourceStatus === 'Review')
      && !this.sourcingReviewStatus
      && (this.selectedOriginUnitStatus === 'Draft')) {
      this.editableFields = this.helperService.getEditableFields('REVIEWER', this.formFieldProperties, this.contentData);
      this.contentEditRole = 'REVIEWER';
    }
  }

  hasRole(role) {
    return this.sessionContext.currentRoles.includes(role);
  }

  getOwnershipType() {
    return of(['createdBy']);
  }

  getDetails() {
      return of({'tenantDetails': {'logo': '/tenant/ntp/logo.png' }, 'ownershipType': ['createdBy']});
  }

  showCommentAddedAgainstContent() {
    const id = _.get(this.contentData, 'identifier');
    const sourcingRejectedComments = _.get(this.sessionContext, 'hierarchyObj.sourcingRejectedComments');
    if (id && this.contentData.status === 'Draft' && this.contentData.prevStatus  === 'Review') {
      // if the contributing org reviewer has requested for changes
      this.contentComment = _.get(this.contentData, 'rejectComment');
      return true;
    } else if (id && !_.isEmpty(_.get(this.contentData, 'requestChanges')) &&
    ((this.contentData.status === 'Draft' && this.contentData.prevStatus === 'Live') ||
    this.contentData.status === 'Live')) {
      // if the souring org reviewer has requested for changes
      this.contentComment = _.get(this.contentData, 'requestChanges');
      return true;
    } else  if (id && this.contentData.status === 'Live' && !_.isEmpty(_.get(sourcingRejectedComments, id))) {
        this.contentComment = _.get(sourcingRejectedComments, id);
        return true;
    }
    return false;
  }

  private initEditor() {
    jQuery('#contentEditor').iziModal({
      title: '',
      iframe: true,
      iframeURL:
        '/thirdparty/editors/content-editor/index.html?' + this.buildNumber,
      navigateArrows: false,
      fullscreen: true,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosing: () => {
        this._zone.run(() => {
          this.closeModal();
        });
      }
    });
  }
  private setWindowContext() {
    window.context = {
      user: {
        id: this.userService.userid,
        name: !_.isEmpty(this.userProfile.lastName)
          ? this.userProfile.firstName + ' ' + this.userProfile.lastName
          : this.userProfile.firstName,
        orgIds: this.userProfile.organisationIds,
        organisations: this.userService.orgIdNameMap
      },
      did: this.deviceId,
      sid: this.userService.sessionId,
      contentId: this.contentEditorComponentInput.contentId,
      pdata: {
        id: this.userService.appId,
        ver: this.portalVersion,
        pid: `${this.configService.appConfig.TELEMETRY.PID}`
      },
      contextRollUp: this.telemetryService.getRollUpData(
        this.userProfile.organisationIds
      ),
      tags: this.userService.dims,
      channel: this.userService.channel,
      defaultLicense: this.frameworkService.getDefaultLicense(),
      framework: this.sessionContext.framework,
      ownershipType: this.ownershipType,
      timeDiff: this.userService.getServerTimeDiff
    };
  }
  private setWindowConfig() {
    window.config = _.cloneDeep(
      this.configService.editorConfig.CONTENT_EDITOR.WINDOW_CONFIG
    ); // cloneDeep to preserve default config
    window.config.build_number = this.buildNumber;
    window.config.headerLogo = this.logo;
    window.config.aws_s3_urls = this.userService.cloudStorageUrls || [];
    window.config.enableTelemetryValidation =
      environment.enableTelemetryValidation; // telemetry validation
    // window.config.lock = {};
    window.config.videoMaxSize = this.videoMaxSize;
    window.config.headerConfig = {
      'managecollaborator': false, 'sendforreview': false, 'limitedsharing': false, 'showEditDetails': false
    };
  }
  /**
   * Re directed to the preview mode
   */
  closeModal() {
    this.showLoader = true;
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
    this.showPreview = true;
    // tslint:disable-next-line:max-line-length
    this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection,
       this.contentEditorComponentInput.unitIdentifier, this.contentEditorComponentInput.contentId)
    .subscribe((res) => {
      this.getContentMetadata();
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0098);
      this.getDetails();
    });
  }

  saveMetadataForm(cb?) {
    if (this.helperService.validateForm(this.formstatus)) {
      console.log(this.formInputData);
      // tslint:disable-next-line:max-line-length
      const formattedData = this.helperService.getFormattedData(_.pick(this.formInputData, this.editableFields), this.formFieldProperties);
      const request = {
        'content': {
          'versionKey': this.contentData.versionKey,
          ...formattedData
        }
      };

      this.helperService.contentMetadataUpdate(this.contentEditRole, request, this.contentData.identifier).subscribe((res) => {
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, res.result.node_id || res.result.identifier)
        .subscribe((data) => {
          this.showEditMetaForm = false;
          if (cb) {
            cb.call(this);
          } else {
            this.getContentMetadata();
            this.toasterService.success(this.resourceService.messages.smsg.m0060);
          }
        }, (err) => {
          this.toasterService.error(this.resourceService.messages.fmsg.m0098);
        });
      }, err => {
        this.toasterService.error(this.resourceService.messages.fmsg.m0098);
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
    this.helperService.reviewContent(this.contentData.identifier)
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
      this.helperService.submitRequestChanges(this.contentEditorComponentInput.contentId, this.FormControl.value.rejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        if (this.sessionContext.collection && this.contentEditorComponentInput.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.contentEditorComponentInput.unitIdentifier, res.result.node_id || this.contentEditorComponentInput.contentId)
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0062);
            this.programStageService.removeLastStage();
          });
        }
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
      });
    }
  }

  publishContent() {
    this.helperService.publishContent(this.contentEditorComponentInput.contentId, this.userService.userProfile.userId)
       .subscribe(res => {
        if (this.sessionContext.collection && this.contentEditorComponentInput.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.contentEditorComponentInput.unitIdentifier, res.result.node_id)
          .subscribe((data) => {
            this.toasterService.success(this.resourceService.messages.smsg.m0063);
            this.programStageService.removeLastStage();
          });
        }
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m00101);
      });
  }

  handleBack() {
    this.programStageService.removeLastStage();
  }

  attachContentToTextbook (action) {
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
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.contentData.identifier, originData, this.contentData);
        } else if (action === 'reject' && this.FormControl.value.rejectComment.length) {
          // tslint:disable-next-line:max-line-length
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.contentData.identifier, originData, this.contentData, this.FormControl.value.rejectComment);
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

  contentStatusNotify(status) {
    if (!this.sessionContext.nominationDetails && this.contentData.organisationId && status !== 'Request') {
      const programDetails = { name: this.programContext.name};
      this.helperService.prepareNotificationData(status, this.contentData, programDetails);
    } else {
      const notificationForContributor = {
        user_id: this.contentData.createdBy,
        content: { name: this.contentData.name },
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
          content: { name: this.contentData.name },
          org: { name:  this.sessionContext.nominationDetails.orgData.name},
          program: { name: this.contentData.name },
          status: status
        };
        this.notificationService.onAfterContentStatusChange(notificationForPublisher)
        .subscribe((res) => {  });
      }
    }
  }

  requestCorrectionsBySourcing() {
    if (this.FormControl.value.rejectComment) {
      this.helperService.updateContentStatus(this.contentData.identifier, 'Draft', this.FormControl.value.rejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        this.contentStatusNotify('Reject');
        this.toasterService.success(this.resourceService.messages.smsg.m0069);
        this.programStageService.removeLastStage();
        this.uploadedContentMeta.emit({
          contentId: res.result.node_id
        });
      }, (err) => {
        this.toasterService.error(this.resourceService.messages.fmsg.m00106);
      });
    }
  }

  isIndividualAndNotSample() {
    return !!(this.sessionContext.currentOrgRole === 'individual' && this.sessionContext.sampleContent !== true);
  }

  ngOnDestroy() {
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
    const removeIzi = document.querySelector('.iziModal-isAttached');
    if (removeIzi) {
      removeIzi.classList.remove('iziModal-isAttached');
    }
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }

  formStatusEventListener(event) {
    this.formstatus = event;
  }

  getFormData(event) {
    this.formInputData = event;
  }
}
