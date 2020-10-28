import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PublicDataService, UserService, ActionService, FrameworkService, ProgramsService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryService, IInteractEventEdata , IImpressionEventInput} from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { CbseProgramService } from '../../services';
import { map, catchError, first, filter } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IChapterListComponentInput, ISessionContext,
  IContentUploadComponentInput, IResourceTemplateComponentInput, IContentEditorComponentInput
} from '../../interfaces';
import { ProgramStageService } from '../../../program/services';
import { ProgramComponentsService } from '../../../program/services/program-components/program-components.service';
import { InitialState } from '../../interfaces';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { HelperService } from '../../services/helper.service';
import { HttpClient } from '@angular/common/http';
import { ProgramTelemetryService } from '../../../program/services';

interface IDynamicInput {
  contentUploadComponentInput?: IContentUploadComponentInput;
  resourceTemplateComponentInput?: IResourceTemplateComponentInput;
  practiceQuestionSetComponentInput?: any;
  contentEditorComponentInput?: IContentEditorComponentInput;
}

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() chapterListComponentInput: IChapterListComponentInput;
  @Output() selectedQuestionTypeTopic = new EventEmitter<any>();

  public sessionContext: ISessionContext;
  public roles: any;
  public textBookChapters: Array<any> = [];
  public telemetryImpression: IImpressionEventInput;
  private questionType: Array<any> = [];
  private textBookMeta: any;
  public hierarchyObj = {};
  public collectionHierarchy = [];
  public countData: Array<any> = [];
  public levelOneChapterList: Array<any> = [];
  public selectedChapterOption: any = {};
  public showResourceTemplatePopup = false;
  private myOrgId = '';
  public templateDetails;
  public unitIdentifier;
  public collection: any;
  public showStage;
  public sharedContext: Array<string>;
  public currentStage: any;
  public selectedSharedContext: any;
  public state: InitialState = {
    stages: []
  };
  public resourceTemplateComponentInput: IResourceTemplateComponentInput = {};
  prevUnitSelect: string;
  contentId: string;
  showLargeModal: boolean;
  // private labels: Array<string>;
  private actions: any;
  public dynamicInputs: IDynamicInput;
  public dynamicOutputs: any;
  public creationComponent;
  public stageSubscription: any;
  public programContext: any;
  public currentUserID: string;
  public collectionData;
  showLoader = true;
  showError = false;
  public questionPattern: Array<any> = [];
  showConfirmationModal = false;
  showRemoveConfirmationModal = false;
  contentName: string;
  public userProfile: any;
  public sampleContent = false;
  public telemetryPageId: string;
  public storedCollectionData: any;
  public sourcingOrgReviewer: boolean;
  public originalCollectionData: any;
  public textbookStatusMessage: string;
  public textbookFirstChildStatusMessage: string;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  constructor(public publicDataService: PublicDataService, public configService: ConfigService,
    private userService: UserService, public actionService: ActionService,
    public telemetryService: TelemetryService, private cbseService: CbseProgramService,
    public toasterService: ToasterService, public router: Router, public frameworkService: FrameworkService,
    public programStageService: ProgramStageService, public programComponentsService: ProgramComponentsService,
    public activeRoute: ActivatedRoute, private ref: ChangeDetectorRef, private httpClient: HttpClient,
    private collectionHierarchyService: CollectionHierarchyService, private resourceService: ResourceService,
    private navigationHelperService: NavigationHelperService, private helperService: HelperService,
    private programsService: ProgramsService, public programTelemetryService: ProgramTelemetryService) {
  }

  ngOnInit() {
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.currentStage = 'chapterListComponent';
    this.sessionContext = _.get(this.chapterListComponentInput, 'sessionContext');
    this.programContext = _.get(this.chapterListComponentInput, 'programContext');
    this.currentUserID = this.userService.userProfile.userId;
    // this.currentUserID = _.get(this.programContext, 'userDetails.userId');
    this.roles = _.get(this.chapterListComponentInput, 'roles');
    this.collection = _.get(this.chapterListComponentInput, 'collection');
    this.actions = _.get(this.chapterListComponentInput, 'programContext.config.actions');
    this.sharedContext = _.get(this.chapterListComponentInput, 'programContext.config.sharedContext');
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.myOrgId = (this.userService.userRegistryData
      && this.userService.userProfile.userRegData
      && this.userService.userProfile.userRegData.User_Org
      && this.userService.userProfile.userRegData.User_Org.orgId) ? this.userService.userProfile.userRegData.User_Org.orgId : '';
    if ( _.isUndefined(this.sessionContext.topicList)) {
        this.fetchFrameWorkDetails();
    }
    /**
     * @description : this will fetch question Category configuration based on currently active route
     */
    this.levelOneChapterList.push({
      identifier: 'all',
      name: this.resourceService.frmelmnts.lbl.allChapters
    });
    this.selectedChapterOption = 'all';
    const mvcStageData = this.programsService.getMvcStageData();
    if (!_.isEmpty(mvcStageData)) {
      this.updateAccordianView(mvcStageData.lastOpenedUnitId);
    } else {
      this.updateAccordianView();
    }

    // clearing the selected questionId when user comes back from question list
    delete this.sessionContext['questionList'];

    this.dynamicOutputs = {
      uploadedContentMeta: (contentMeta) => {
        this.uploadHandler(contentMeta);
      }
    };
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    if (this.programContext['status'] === 'Unlisted') {
      const request = {
        'key': 'mvcLibraryFeature',
        'status': 'active'
      };
      this.helperService.getProgramConfiguration(request).subscribe(res => {}, err => {});
    }

  }

  showBulkUploadOption() {
    // tslint:disable-next-line:max-line-length
    return !!(this.programsService.checkForContentSubmissionDate(this.programContext) && !this.isNominationPendingOrInitiated() && _.get(this.sessionContext, 'currentRoles', []).includes('CONTRIBUTOR'));
  }

  ngOnChanges(changed: any) {
    this.sessionContext = _.get(this.chapterListComponentInput, 'sessionContext');
    this.roles = _.get(this.chapterListComponentInput, 'roles');
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryInteractCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: this.configService.telemetryLabels.pageType.detail || _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
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
        }
      },
      (error) => {
        console.log('Getting origin data failed');
    });
  }

  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(filter(data => _.get(data, `frameworkdata.${this.sessionContext.framework}`)),
      first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        this.sessionContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
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

  public initiateInputs(action?, content?) {
    const sourcingStatus = !_.isUndefined(content) ? content.sourcingStatus : null;
    this.sessionContext.telemetryPageDetails.telemetryPageId = this.getTelemetryPageIdForContentDetailsPage();
    this.dynamicInputs = {
      contentUploadComponentInput: {
        config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.uploadComponent'}),
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        templateDetails: this.templateDetails,
        selectedSharedContext: this.selectedSharedContext,
        contentId: this.contentId,
        originCollectionData: this.originalCollectionData,
        action: action,
        programContext: _.get(this.chapterListComponentInput, 'programContext'),
        sourcingStatus: sourcingStatus,
        content: content
      },
      practiceQuestionSetComponentInput: {
        config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.practiceSetComponent'}),
        sessionContext: this.sessionContext,
        templateDetails: this.templateDetails,
        unitIdentifier: this.unitIdentifier,
        roles: this.roles,
        selectedSharedContext: this.selectedSharedContext,
        contentIdentifier: this.contentId,
        originCollectionData: this.originalCollectionData,
        action: action,
        programContext: _.get(this.chapterListComponentInput, 'programContext'),
        sourcingStatus: sourcingStatus,
        content: content
      },
      contentEditorComponentInput: {
        contentId: this.contentId,
        action: action,
        content: content,
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        programContext: _.get(this.chapterListComponentInput, 'programContext'),
        originCollectionData: this.originalCollectionData,
        sourcingStatus: sourcingStatus,
        selectedSharedContext: this.selectedSharedContext
      }
    };
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
    if (this.currentStage === 'chapterListComponent') {
      this.updateAccordianView(this.unitIdentifier);
      this.resetContentId();
    }
  }

  public resetContentId() {
    this.contentId = '';
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
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
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
        const textBookMetaData = [];
        instance.countData['total'] = 0;
        instance.countData['review'] = 0;
        instance.countData['reject'] = 0;
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

        const hierarchyUrl1 = '/action/content/v3/hierarchy/' + this.collectionData.origin + '?mode=edit';
        const originUrl = this.programsService.getContentOriginEnvironment();
        const url =  originUrl + hierarchyUrl1 ;

        if (this.router.url.includes('/sourcing') && this.collectionData && this.collectionData.visibility === 'Default') {
          this.httpClient.get(url).subscribe(async res => {
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

  setTreeLeafStatusMessage(identifier, instance) {
    this.collectionHierarchy = this.setCollectionTree(this.collectionData, identifier);
    if (this.originalCollectionData && this.originalCollectionData.status !== 'Draft' && this.sourcingOrgReviewer) {
      this.textbookStatusMessage = this.resourceService.frmelmnts.lbl.textbookStatusMessage;
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
    if (data.contentType !== 'TextBook') {
      const rootMeta = _.pick(data, this.sharedContext);
      const rootTree = this.generateNodeMeta(data, rootMeta);
      const isFolderExist = _.find(data.children, (child) => {
        return child.contentType === 'TextBookUnit';
      });
      if (isFolderExist) {
        const children = this.getUnitWithChildren(data, identifier);
        const treeChildren = children && children.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = children && children.filter(item => item.contentType !== 'TextBookUnit');
        rootTree['children'] = treeChildren || null;
        rootTree['leaf'] = this.getContentVisibility(treeLeaf) || null;
        return rootTree ? [rootTree] : [];
      } else {
        rootTree['leaf'] = _.map(data.children, (child) => {
          const meta = _.pick(child, this.sharedContext);
          const treeItem = this.generateNodeMeta(child, meta);
          treeItem['visibility'] = this.shouldContentBeVisible(child);
          treeItem['sourcingStatus'] = this.checkSourcingStatus(child);
          return treeItem;
        });
        return rootTree ? [rootTree] : [];
      }
    } else {
      return this.getUnitWithChildren(data, identifier) || [];
    }
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
      'root': data.contentType === 'TextBook' ? true : false,
      'origin': data.origin,
      'originData': data.originData
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
        const treeChildren = treeUnit && treeUnit.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = treeUnit && treeUnit.filter(item => item.contentType !== 'TextBookUnit');
        treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
        if (treeLeaf && treeLeaf.length > 0) {
          treeItem['leaf'] = this.getContentVisibility(treeLeaf);
        }
        return treeItem;
      });
      return tree;
    }
  }

  getSampleContentStatusCount(data) {
    const self = this;
    if (data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit' && data.sampleContent) {
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

  getContentStatusCount(data) {
    const self = this;
    if (['admin', 'user'].includes(this.sessionContext.currentOrgRole)  && this.sessionContext.currentRoles.includes('REVIEWER')) {
      // tslint:disable-next-line:max-line-length
      if ((data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit' && this.myOrgId === data.organisationId)  && (!data.sampleContent || data.sampleContent === undefined)) {
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
        if (data.status === 'Review') {
          this.countData['totalreview'] = this.countData['totalreview'] + 1;
        }
        if (data.createdBy !== this.currentUserID && data.status === 'Review') {
          this.countData['awaitingreview'] = this.countData['awaitingreview'] + 1;
        }
      }
    } else {
      // tslint:disable-next-line:max-line-length
      if ((data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit')  && (!data.sampleContent || data.sampleContent === undefined)) {
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

  generateNodeMeta(node, sharedMeta) {
   const nodeMeta =  {
      identifier: node.identifier,
      name: node.name,
      contentType: node.contentType,
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

  getContentVisibility(branch) {
    const leafNodes = [];
    _.forEach(branch, (leaf) => {
      const contentVisibility = this.shouldContentBeVisible(leaf);
      const sourcingStatus = this.checkSourcingStatus(leaf);
      leaf['visibility'] = contentVisibility;
      leaf['sourcingStatus'] = sourcingStatus || null;
      leafNodes.push(leaf);
    });
    return _.isEmpty(leafNodes) ? null : leafNodes;
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

  hasAccessFor(action) {
    const roles = _.get(this.actions, `${action}.roles`, []);
    return !_.isEmpty(_.intersection(roles, this.sessionContext.currentRoleIds));
  }

  shouldContentBeVisible(content) {
    const creatorViewRole = this.hasAccessFor('showCreatorView');
    const reviewerViewRole = this.hasAccessFor('showReviewerView');
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

  onSelectChapterChange() {
    this.showLoader = true;
    this.updateAccordianView(undefined, true);
  }

  handleTemplateSelection(event) {
    this.showResourceTemplatePopup = false;
    if (event.template && event.templateDetails && !(event.templateDetails.onClick === 'uploadComponent')) {
      this.templateDetails = event.templateDetails;
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
              'mimeType': this.templateDetails.mimeType[0],
              'createdBy': this.userService.userid,
              'contentType': this.templateDetails.metadata.contentType,
              'resourceType': this.templateDetails.metadata.resourceType || 'Learn',
              'creator': creator,
              'programId': this.sessionContext.programId,
              'collectionId': this.sessionContext.collection,
              ...(this.sessionContext.nominationDetails &&
                this.sessionContext.nominationDetails.organisation_id &&
                {'organisationId': this.sessionContext.nominationDetails.organisation_id || null}),
              ...(_.pickBy(reqBody, _.identity))
            }
          }
        }
      };
      if (this.sampleContent) {
        option.data.request.content.sampleContent = this.sampleContent;
      }
      if (this.templateDetails.metadata.appIcon) {
        option.data.request.content.appIcon = this.templateDetails.metadata.appIcon;
      }
      this.actionService.post(option).pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = {
          errorMsg: 'Unable to create contentId, Please Try Again',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
          request: option
        };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }))
        .subscribe(result => {
          this.contentId = result.node_id;
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, result.identifier)
            .subscribe(() => {
               // tslint:disable-next-line:max-line-length
               this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
            });
        });
    } else if (event.templateDetails) {
      this.templateDetails = event.templateDetails;
      // tslint:disable-next-line:max-line-length
      this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
    }
  }

  handlePreview(event) {
    const templateList = _.get(this.chapterListComponentInput.config, 'config.contentTypes.value')
      || _.get(this.chapterListComponentInput.config, 'config.contentTypes.defaultValue');
    this.templateDetails = _.find(templateList, (templateData) => {
      return templateData.metadata.contentType === event.content.contentType;
    });
    if (this.templateDetails) {
    this.componentLoadHandler('preview',
    this.programComponentsService.getComponentInstance(this.templateDetails.onClick), this.templateDetails.onClick, event);
    }
  }

  componentLoadHandler(action, component, componentName, event?) {
    this.initiateInputs(action, (event ? event.content : undefined));
    this.creationComponent = component;
    this.programStageService.addStage(componentName);
  }

  showResourceTemplate(event) {
    this.unitIdentifier = event.collection.identifier;
    this.selectedSharedContext = event.collection.sharedContext;
    switch (event.action) {
      case 'delete':
        this.contentId = event.content.identifier;
        this.showConfirmationModal = true;
        break;
      case 'beforeMove':
        this.showLargeModal = true;
        this.contentId = event.content.identifier;
        this.prevUnitSelect = event.collection.identifier;
        break;
        case 'remove':
          this.contentId = event.content.identifier;
          this.contentName = event.content.name;
          this.showRemoveConfirmationModal = true;
          break;
      case 'afterMove':
        this.showLargeModal = false;
        this.unitIdentifier = '';
        this.contentId = ''; // Clearing selected unit/content details
        this.updateAccordianView(event.collection.identifier);
        break;
      case 'cancelMove':
        this.showLargeModal = false;
        this.unitIdentifier = '';
        this.contentId = ''; // Clearing selected unit/content details
        break;
      case 'preview':
        this.contentId = event.content.identifier;
        this.handlePreview(event);
        break;
      default:
        this.showResourceTemplatePopup = event.showPopup;
        break;
    }
    this.resourceTemplateInputData();
  }

  removeMvcContentFromHierarchy() {
    const contentId = this.contentId;
    this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, this.contentId)
       .subscribe(() => {
         this.showRemoveConfirmationModal = false;
         this.updateAccordianView(this.unitIdentifier);
         this.resetContentId();
         this.updateTextbookmvcContentCount(this.sessionContext.collection, contentId);
         this.toasterService.success(_.replace(this.resourceService.messages.stmsg.m0147, '{CONTENT_NAME}', this.contentName));
       }, (error) => {
        const errInfo = {
          errorMsg: _.replace(this.resourceService.messages.emsg.m0078, '{CONTENT_NAME}', this.contentName),
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
        };
        this.cbseService.apiErrorHandling(error, errInfo);
       });
  }
  updateTextbookmvcContentCount(textbookId, contentId) {
     this.helperService.getTextbookDetails(textbookId).subscribe((data) => {
     const array = _.remove(data.result.content['mvcContributions'], function(content) {return content !== contentId})
      const request = {
        content: {
          'versionKey': data.result.content.versionKey,
          'mvcContentCount':  data.result.content.mvcContentCount - 1,
          'mvcContributions':_.uniq(array),
        }
      };
      this.helperService.updateContent(request, textbookId).subscribe((data) => {
      }, err => {
        const errInfo = {
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
          request: request
        };
        this.cbseService.apiErrorHandling(err, errInfo);
      });
     }, (error) => {
      const errInfo = {
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env,
      };
      this.cbseService.apiErrorHandling(error, errInfo);
     })
  }
  resourceTemplateInputData() {
    let contentTypes = _.get(this.chapterListComponentInput.config, 'config.contentTypes.value')
    || _.get(this.chapterListComponentInput.config, 'config.contentTypes.defaultValue');
    if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.content_types) {
       contentTypes = _.filter(contentTypes, (obj) => {
        return _.includes(this.sessionContext.nominationDetails.content_types, obj.metadata.contentType);
       });
    }
    this.resourceTemplateComponentInput = {
        templateList: contentTypes,
        programContext: this.programContext,
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier
    };
  }

  emitQuestionTypeTopic(type, topic, topicIdentifier, resourceIdentifier, resourceName) {
    this.selectedQuestionTypeTopic.emit({
      'questionType': type,
      'topic': topic,
      'textBookUnitIdentifier': topicIdentifier,
      'resourceIdentifier': resourceIdentifier || false,
      'resourceName': resourceName
    });
  }

  uploadHandler(event) {
    if (event.contentId) {
      this.updateAccordianView(this.unitIdentifier);
    }
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

  public addResourceToHierarchy(contentId) {
    const req = {
      url: this.configService.urlConFig.URLS.CONTENT.HIERARCHY_ADD,
      data: {
        'request': {
          'rootId': this.sessionContext.collection,
          'unitId': this.unitIdentifier,
          'children': [contentId]
        }
      }
    };
    this.actionService.patch(req).pipe(map((data: any) => data.result), catchError(err => {
      return throwError('');
    })).subscribe(res => {
      console.log('result ', res);
    });
  }

  removeResourceFromHierarchy() {
    this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, this.contentId)
       .subscribe(() => {
         this.showConfirmationModal = false;
         this.updateAccordianView(this.unitIdentifier);
         this.resetContentId();
         this.toasterService.success(this.resourceService.messages.smsg.m0064);
       });
  }

  deleteContent() {
    this.helperService.retireContent(this.contentId)
      .subscribe(
        (response) => {
          if (response && response.result && response.result.node_id) {
            this.removeResourceFromHierarchy();
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m00103);
          }
        },
        (error) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.fmsg.m00103,
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : this.telemetryInteractCdata,
            env : this.activeRoute.snapshot.data.telemetry.env,
          };
          this.cbseService.apiErrorHandling(error, errInfo);
        }
      );
  }

  handleBack() {
    this.programStageService.removeLastStage();
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  // tslint:disable-next-line:max-line-length
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
      collection.statusMessage = this.resourceService.frmelmnts.lbl.textbookNodeStatusMessage;
    }

    collection.totalLeaf = !_.isEmpty(collection.sourcingStatusDetail) ? _.sum(_.values(collection.sourcingStatusDetail)) :  collection.totalLeaf;
    return [collection.sourcingStatusDetail, collection.totalLeaf];
  }

  addTwoObjects(objValue, srcValue) {
    return objValue + srcValue;
  }

  filterContentsForCount(contents, status?, onlySample?, organisationId?, createdBy?, visibility?, prevStatus?) {
    const filter = {
      ...(onlySample && { sampleContent: true }),
      ...(!onlySample && { sampleContent: null }),
      ...(createdBy && { createdBy }),
      ...(organisationId && { organisationId }),
      ...(visibility && { visibility })
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
            ((c.createdBy === createdBy && c.visibility === true) || c.prevStatus === 'Review' || c.prevStatus === 'Live'));
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
        if (content.createdBy === this.userService.userProfile.userId && !content.sampleContent) {
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

  isNominationByOrg() {
    return !!(_.get(this.sessionContext, 'nominationDetails.organisation_id'));
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

  isSourcingOrgReviewer () {
    return this.userService.isSourcingOrgReviewer(this.programContext);
  }

  isNominationPendingOrInitiated() {
    return _.includes(['Pending', 'Initiated'], _.get(this.sessionContext, 'nominationDetails.status', ''));
  }

  isContributingOrgContributor() {
    return this.userService.isContributingOrgContributor(this.sessionContext.nominationDetails);
  }

  isContributingOrgReviewer() {
    return this.userService.isContributingOrgReviewer(this.sessionContext.nominationDetails);
  }

  isPublishOrSubmit() {
    return !!(_.get(this.programContext, 'config.defaultContributeOrgReview') === false
    && _.get(this.sessionContext, 'currentRoles').includes('CONTRIBUTOR')
    && this.sampleContent === false);
  }

  isDefaultContributingOrg() {
    return this.userService.isDefaultContributingOrg(this.programContext);
  }

  bulkApprovalSuccess(e) {
    this.updateAccordianView();
  }
}
