import { Component, OnInit, AfterViewInit, NgZone, Renderer2, OnDestroy, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import * as iziModal from 'izimodal/js/iziModal';
import { NavigationHelperService, ResourceService, ConfigService, ToasterService, IUserProfile } from '@sunbird/shared';
import { UserService, TenantService, FrameworkService, PlayerService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@sunbird/environment';
import { TelemetryService, IInteractEventEdata } from '@sunbird/telemetry';
import { combineLatest, of, throwError } from 'rxjs';
import { map, mergeMap, tap, delay, first } from 'rxjs/operators';
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
  private userProfile: IUserProfile;
  private routeParams: any;
  private buildNumber: string;
  private deviceId: string;
  private portalVersion: string;
  public logo: string;
  public showLoader = true;
  public contentDetails: any;
  public ownershipType: any;
  public queryParams: object;
  public videoMaxSize: any;
  public showPreview = false;
  public playerConfig: any;
  public sessionContext: any;
  public popupAction: string;
  public commentCharLimit = 1000;
  public showRequestChangesPopup: boolean;
  public visibility: any;
  public actions: any;
  public resourceStatus: string;
  public contentData: any;
  public resourceStatusText: string;
  public telemetryImpression: any;
  public telemetryPageId = 'content-editor';
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;

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
    public programTelemetryService: ProgramTelemetryService
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
    this.actions = _.get(this.contentEditorComponentInput, 'programContext.config.actions');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.contentEditorComponentInput.programContext.program_id, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.contentEditorComponentInput.contentId, 'Content', '1.0', { l1: this.sessionContext.collection, l2: this.contentEditorComponentInput.unitIdentifier});
    if (this.contentEditorComponentInput.action === 'preview' && this.contentEditorComponentInput.content.status === 'Live') {
      this.handlePreview();
    } else {
      this.loadContentEditor();
    }
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

  loadContentEditor() {
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

  handleActionButtons() {
    this.visibility = {};
    // tslint:disable-next-line:max-line-length
    this.visibility['showRequestChanges'] = (_.includes(this.actions.showRequestChanges.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review');
    // tslint:disable-next-line:max-line-length
    this.visibility['showPublish'] = ((_.includes(this.actions.showPublish.roles, this.sessionContext.currentRoleId) && this.resourceStatus === 'Review') ||
      (this.sessionContext.currentOrgRole === 'individual') && this.resourceStatus === 'Draft');
    // tslint:disable-next-line: max-line-length
    this.visibility['showEdit'] = (_.includes(this.actions.showEdit.roles, this.sessionContext.currentRoleIds[0]) && this.resourceStatus === 'Draft');
    this.visibility['showSourcingActionButtons'] = this.canSourcingReviewerPerformActions();
  }

  handlePreview() {
    this.showPreview = true;
    const option = {
      params: { mode: 'edit' }
    };
    this.playerService.getContent(this.contentEditorComponentInput.contentId, option).subscribe(
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
      this.showLoader = false;
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

  getOwnershipType() {
    return of(['createdBy']);
  }

  getDetails() {
      return combineLatest(this.tenantService.tenantData$, this.getOwnershipType())
      .pipe(map((data: any) => ({ tenantDetails: data[0].tenantData, ownershipType: data[1] })));
      // return of({'tenantDetails': {'logo': 'xyz.png'}, 'ownershipType': ['createdBy']});
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
  }
  /**
   * Re directed to the TOC of Text-book
   */
  closeModal() {
    this.showLoader = true;
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
    // tslint:disable-next-line:max-line-length
    this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection,
       this.contentEditorComponentInput.unitIdentifier, this.contentEditorComponentInput.contentId)
    .subscribe((res) => {
      this.handlePreview();
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.fmsg.m0098);
      this.getDetails();
    });
  }

  requestChanges() {
    if (this.FormControl.value.rejectComment) {
      this.helperService.submitRequestChanges(this.contentEditorComponentInput.contentId, this.FormControl.value.rejectComment)
      .subscribe(res => {
        this.showRequestChangesPopup = false;
        if (this.sessionContext.collection && this.contentEditorComponentInput.unitIdentifier) {
          // tslint:disable-next-line:max-line-length
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.contentEditorComponentInput.unitIdentifier, res.result.identifier)
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

  publichContent() {
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

  ngOnDestroy() {
    if (document.getElementById('contentEditor')) {
      document.getElementById('contentEditor').remove();
    }
    const removeIzi = document.querySelector('.iziModal-isAttached');
    if (removeIzi) {
      removeIzi.classList.remove('iziModal-isAttached');
    }
  }

  canSourcingReviewerPerformActions() {
    return !!(this.router.url.includes('/sourcing') && this.resourceStatus === 'Live');
  }

  updateContentBeforeApproving(action) {
    this.attachContentToTextbook(action);
  }

  attachContentToTextbook(action) {
    const hierarchyObj  = _.get(this.sessionContext.hierarchyObj, 'hierarchy');
    if (hierarchyObj) {
      const rootOriginInfo = _.get(_.get(hierarchyObj, this.sessionContext.collection), 'originData');
      let channel =  rootOriginInfo && rootOriginInfo.channel;
      if (_.isUndefined(channel)) {
        const originInfo = _.get(_.get(hierarchyObj, this.contentEditorComponentInput.unitIdentifier), 'originData');
        channel = originInfo && originInfo.channel;
      }
      const originData = {
        textbookOriginId: _.get(_.get(hierarchyObj, this.sessionContext.collection), 'origin'),
        unitOriginId: _.get(_.get(hierarchyObj, this.contentEditorComponentInput.unitIdentifier), 'origin'),
        channel: channel
      };
      if (originData.textbookOriginId && originData.unitOriginId && originData.channel) {
        if (action === 'accept') {
          // tslint:disable-next-line: max-line-length
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.contentEditorComponentInput.unitIdentifier, originData);
        } else if (action === 'reject' && this.FormControl.value.rejectComment.length) {
          // tslint:disable-next-line:max-line-length
          this.helperService.publishContentToDiksha(action, this.sessionContext.collection, this.contentEditorComponentInput.unitIdentifier, originData, this.FormControl.value.rejectComment);
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
}
