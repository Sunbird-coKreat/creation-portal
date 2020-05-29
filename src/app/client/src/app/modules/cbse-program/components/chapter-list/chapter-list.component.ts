import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PublicDataService, UserService, ActionService, FrameworkService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryService, IInteractEventEdata , IImpressionEventInput} from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { CbseProgramService } from '../../services';
import { map, catchError, first } from 'rxjs/operators';
import { throwError } from 'rxjs';
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
  public role: any;
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
  public userProfile: any;
  public sampleContent = false;
  public telemetryPageId = 'chapter-list';
  public storedCollectionData: any;
  public sourcingOrgReviewer: boolean;
  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    private userService: UserService, public actionService: ActionService,
    public telemetryService: TelemetryService, private cbseService: CbseProgramService,
    public toasterService: ToasterService, public router: Router, public frameworkService: FrameworkService,
    public programStageService: ProgramStageService, public programComponentsService: ProgramComponentsService,
    public activeRoute: ActivatedRoute, private ref: ChangeDetectorRef,
    private collectionHierarchyService: CollectionHierarchyService, private resourceService: ResourceService,
    private navigationHelperService: NavigationHelperService, private helperService: HelperService) {
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
    this.role = _.get(this.chapterListComponentInput, 'role');
    this.collection = _.get(this.chapterListComponentInput, 'collection');
    this.actions = _.get(this.chapterListComponentInput, 'programContext.config.actions');
    this.sharedContext = _.get(this.chapterListComponentInput, 'programContext.config.sharedContext');
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
      name: 'All Chapters'
    });
    this.selectedChapterOption = 'all';
    this.updateAccordianView();
    // clearing the selected questionId when user comes back from question list
    delete this.sessionContext['questionList'];

    this.dynamicOutputs = {
      uploadedContentMeta: (contentMeta) => {
        this.uploadHandler(contentMeta);
      }
    };
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
  }

  ngOnChanges(changed: any) {
    this.sessionContext = _.get(this.chapterListComponentInput, 'sessionContext');
    this.role = _.get(this.chapterListComponentInput, 'role');
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
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  async updateAccordianView(unitId?, onSelectChapterChange?) {
      await this.getCollectionHierarchy(this.sessionContext.collection,
                this.selectedChapterOption === 'all' ? undefined : this.selectedChapterOption);
    if (unitId) {
      this.lastOpenedUnit(unitId);
    } else if (onSelectChapterChange === true && this.selectedChapterOption !== 'all') {
      this.lastOpenedUnit(this.selectedChapterOption);
    } else {
      if (!_.isEmpty(this.collectionHierarchy)) { this.lastOpenedUnit(this.collectionHierarchy[0].identifier)}
    }
  }

  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        this.sessionContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }

  public initiateInputs(action?, content?) {
    const sourcingStatus = !_.isUndefined(content) ? content.sourcingStatus : null;
    this.dynamicInputs = {
      contentUploadComponentInput: {
        config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.uploadComponent'}),
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        templateDetails: this.templateDetails,
        selectedSharedContext: this.selectedSharedContext,
        contentId: this.contentId,
        action: action,
        programContext: _.get(this.chapterListComponentInput, 'programContext'),
        sourcingStatus: sourcingStatus
      },
      practiceQuestionSetComponentInput: {
        config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.practiceSetComponent'}),
        sessionContext: this.sessionContext,
        templateDetails: this.templateDetails,
        unitIdentifier: this.unitIdentifier,
        role: this.role,
        selectedSharedContext: this.selectedSharedContext,
        contentIdentifier: this.contentId,
        action: action,
        programContext: _.get(this.chapterListComponentInput, 'programContext'),
        sourcingStatus: sourcingStatus
      },
      contentEditorComponentInput: {
        contentId: this.contentId,
        action: action,
        content: content,
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        programContext: _.get(this.chapterListComponentInput, 'programContext')
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
      const errInfo = { errorMsg: 'Fetching TextBook details failed' }; this.showLoader = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((response) => {
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
        this.collectionHierarchy = this.setCollectionTree(this.collectionData, identifier);
        this.getFolderLevelCount(this.collectionHierarchy);
        hierarchy = instance.hierarchyObj;
        this.sessionContext.hierarchyObj = { hierarchy };
        this.showLoader = false;
        this.showError = false;
        this.levelOneChapterList = _.uniqBy(this.levelOneChapterList, 'identifier');
         resolve('Done');
      });
    });
  }

  getFolderLevelCount(collections) {
    let status = this.sampleContent ? ['Review', 'Draft'] : [];
    let createdBy, visibility;
    if (this.sampleContent === false && this.isSourcingOrgReviewer()) {
      if (this.sourcingOrgReviewer) {
        status = ['Live'];
      }
      visibility = true;
    }
    if (this.isContributingOrgContributor()) {
      createdBy = this.currentUserID;
    }
    if (this.isContributingOrgReviewer()) {
      status = ['Review'];
    }
    if (this.isNominationByOrg()) {
      _.forEach(collections, collection => {
        this.getContentCountPerFolder(collection , status , this.sampleContent, this.getNominationId('org'), createdBy, visibility);
      });
    } else {
      _.forEach(collections, collection => {
        createdBy = this.getNominationId('individual');
        this.getContentCountPerFolder(collection , status , this.sampleContent, undefined, createdBy, visibility);
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
        rootTree['leaf'] = this.checkContentAcceptedOrRejected(treeLeaf) || null;
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
      'contentType': data.contentType,
      'children': _.map(data.children, (child) => {
        return child.identifier;
      }),
      'root': data.contentType === 'TextBook' ? true : false,
    };
    const childData = data.children;
    if (childData) {
      const tree = childData.map(child => {
        const meta = _.pick(child, this.sharedContext);
        if (child.parent && child.parent === collectionId) {
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
          treeItem['leaf'] = this.checkContentAcceptedOrRejected(treeLeaf) || null;
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
    if (this.sessionContext.currentOrgRole === 'admin' ||
    (this.sessionContext.currentOrgRole === 'user' && this.sessionContext.currentRole === 'REVIEWER')) {
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
      status: node.status,
      creator: node.creator,
      createdBy: node.createdBy || null,
      parentId: node.parent || null,
      organisationId: _.has(node, 'organisationId') ? node.organisationId : null,
      prevStatus: node.prevStatus || null,
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
      leaf['visibility'] = contentVisibility;
      leafNodes.push(leaf);
    });
    return _.isEmpty(leafNodes) ? null : leafNodes;
  }

  checkContentAcceptedOrRejected(branch) {
    const leafNodes = [];
    _.forEach(branch, (leaf) => {
      const sourcingStatus = this.checkSourcingStatus(leaf);
      leaf['sourcingStatus'] = sourcingStatus;
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
      } else {
        return null;
      }
  }

  shouldContentBeVisible(content) {
    const creatorViewRole = this.actions.showCreatorView.roles.includes(this.sessionContext.currentRoleId);
    const reviewerViewRole = this.actions.showReviewerView.roles.includes(this.sessionContext.currentRoleId);
    const contributingOrgAdmin = this.isContributingOrgAdmin();
    if (this.isSourcingOrgReviewer() && this.sourcingOrgReviewer) {
      if (reviewerViewRole && content.sampleContent === true
        && this.getNominatedUserId() === content.createdBy) {
          return true;
        } else if (reviewerViewRole && content.status === 'Live') {
          if (content.contentType !== 'TextBook' && content.contentType !== 'TextBookUnit' &&
               (this.storedCollectionData.acceptedContents || this.storedCollectionData.rejectedContents) &&
                 // tslint:disable-next-line:max-line-length
                 _.includes([...this.storedCollectionData.acceptedContents || [], ...this.storedCollectionData.rejectedContents || []], content.identifier)) {
            return false;
          }
          return true;
        }
    } else {
      if ((this.sessionContext.nominationDetails.status === 'Approved' || this.sessionContext.nominationDetails.status === 'Rejected')
       && content.sampleContent === true) {
        return false;
      } else if (reviewerViewRole && content.status === 'Review'
      && this.currentUserID !== content.createdBy
      && content.organisationId === this.myOrgId) {
        return true;
      } else if (creatorViewRole && this.currentUserID === content.createdBy) {
        return true;
      } else if (contributingOrgAdmin && content.organisationId === this.myOrgId) {
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
        const errInfo = { errorMsg: 'Unable to create contentId, Please Try Again' };
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
          this.toasterService.error(this.resourceService.messages.fmsg.m00103);
        }
      );
  }

  handleBack() {
    this.programStageService.removeLastStage();
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }

  // tslint:disable-next-line:max-line-length
  getContentCountPerFolder(collection, contentStatus?: string[], onlySample?: boolean, organisationId?: string, createdBy?: string, visibility?: boolean) {
    const self = this;
    collection.totalLeaf = 0;
    _.each(collection.children, child => {
      collection.totalLeaf += self.getContentCountPerFolder(child, contentStatus, onlySample, organisationId, createdBy, visibility);
    });

    // tslint:disable-next-line:max-line-length
    collection.totalLeaf += collection.leaf ? this.filterContentsForCount(collection.leaf, contentStatus, onlySample, organisationId, createdBy, visibility) : 0;
    return collection.totalLeaf;
  }


  filterContentsForCount (contents, status?, onlySample?, organisationId?, createdBy?, visibility?) {
    const filter = {
      ...(onlySample && {sampleContent: true}),
      ...(!onlySample && {sampleContent: null}),
      ...(createdBy && {createdBy}),
      ...(organisationId && {organisationId}),
      ...(visibility && {visibility}),
    };
    if (status && status.length > 0) {
      contents = _.filter(contents, leaf => _.includes(status, leaf.status));
    }
    const leaves = _.filter(contents, filter);
    return leaves.length;
  }

  isNominationByOrg() {
    return !!(this.sessionContext.nominationDetails &&
      this.sessionContext.nominationDetails.organisation_id);
  }

  getNominationId(type) {
    if (type === 'individual') {
      return this.getNominatedUserId();
    } else if (type === 'org') {
      return this.getNominatedOrgId();
    }
  }

  getNominatedUserId() {
   return this.sessionContext && this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.user_id;
  }

  getNominatedOrgId() {
    return this.sessionContext && this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.organisation_id;
  }

  isSourcingOrgReviewer () {
    return !!(this.userService.userProfile.userRoles.includes('ORG_ADMIN') ||
    this.userService.userProfile.userRoles.includes('CONTENT_REVIEWER'));
  }

  isNominationPendingOrInitiated() {
    return !!(this.sessionContext &&
      this.sessionContext.nominationDetails &&
      _.includes(['Pending', 'Initiated'], this.sessionContext.nominationDetails.status));
  }

  isContributingOrgAdmin() {
    const roles = _.get(this.userService, 'userProfile.userRegData.User_Org.roles');
    return !_.isEmpty(roles) && _.includes(roles, 'admin');
  }

  isContributingOrgContributor() {
    const contributors = _.get(this.sessionContext, 'nominationDetails.rolemapping.CONTRIBUTOR');
    return !_.isEmpty(contributors) && _.includes(contributors, _.get(this.userService, 'userProfile.userId'));
  }

  isContributingOrgReviewer() {
    const reviewers = _.get(this.sessionContext, 'nominationDetails.rolemapping.REVIEWER');
    return !_.isEmpty(reviewers) && _.includes(reviewers, _.get(this.userService, 'userProfile.userId'));
  }
}
