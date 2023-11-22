import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PublicDataService, UserService, ActionService, FrameworkService, ProgramsService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryService, IInteractEventEdata , IImpressionEventInput} from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { v4 as UUID } from 'uuid';
import { SourcingService } from '../../services';
import { map, catchError, first, filter, takeUntil } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';
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
  questionSetEditorComponentInput?: any;
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
  public getOriginCollectionHierarchy : any;
  public countData: Array<any> = [];
  public levelOneChapterList: Array<any> = [];
  public selectedChapterOption: any = {};
  public showResourceTemplatePopup = false;
  public showResourceTemplateTypePopUp = false;
  private myOrgId = '';
  public templateDetails;
  public unitIdentifier;
  public collection: any;
  public showStage;
  public sharedContext: Array<string>;
  public currentStage: any;
  public selectedSharedContext: any;
  public docxVersion = '0.5';
  public state: InitialState = {
    stages: []
  };
  public resourceTemplateComponentInput: IResourceTemplateComponentInput = {};
  prevUnitSelect: string;
  contentId: string;
  showLargeModal: boolean;
  // private labels: Array<string>;
  public dynamicInputs: IDynamicInput;
  public dynamicOutputs: any;
  public creationComponent;
  public stageSubscription: any;
  public programContext: any;
  public currentUserID: string;
  public currentRootOrgID: string;
  public collectionData;
  showLoader = true;
  showError = false;
  public questionPattern: Array<any> = [];
  public viewBlueprintFlag: boolean;
  public displayPrintPreview: boolean;
  public printPreviewResponseData: any;
  public viewBlueprintDetailsFlag: boolean;
  public blueprintTemplate: any;
  public localBlueprint: any;
  localUniqueTopicsList: string[] = [];
  localUniqueLearningOutcomesList: string[] = [];
  public topicsInsideBlueprint: boolean = true;
  public learningOutcomesInsideBlueprint: boolean = true;
  public statusOptionsList: any = [];
  public selectedStatusOptions: any = [];
  showConfirmationModal = false;
  showRemoveConfirmationModal = false;
  showQuestionModal: boolean = false;
  publishQuestionset = false;
  bulkUploadEnabled = true;
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
  public hasAccessForContributor: any;
  public hasAccessForReviewer: any;
  public hasAccessForBoth: any;
  public targetCollection: string;
  public unsubscribe = new Subject<void>();
  public firstLevelFolderLabel: string;
  public projectTargetType: string = '';
  public acceptedContentsAttribute = 'acceptedContents';
  public rejectedContentsAttribute = 'rejectedContents';
  public addFormLibraryInput = {};
  public reusedContributions = [];
  public showPublishConfirmationModal = false;
  editorConfig: any;
  searchConfig;
  collectionSourcingConfig;
  private deviceId: string;
  private buildNumber: string;
  private portalVersion: string;
  public defaultFileSize: any;
  public defaultVideoSize: any;
  dynamicHeaders = [];
  dynamicHeadersEnabled;
  configUrl;
  tags = [];
  printUrl;
  downloadCsvUrl;
  displayDownloadCsv = false;
  displayShowQuestionPreview= false;
  public reviewHelpSectionConfig: any;
  public contributeHelpSectionConfig: any;
  public questionIdentifierList: Array<string> = [];
  enableReviewEdit = false;
  public qualityParamConfig: any;
  public sendReminderModal =false;
  public sendReminderButton;

  constructor(public publicDataService: PublicDataService, public configService: ConfigService,
    private userService: UserService, public actionService: ActionService,
    public telemetryService: TelemetryService, private sourcingService: SourcingService,
    public toasterService: ToasterService, public router: Router, public frameworkService: FrameworkService,
    public programStageService: ProgramStageService, public programComponentsService: ProgramComponentsService,
    public activeRoute: ActivatedRoute, private ref: ChangeDetectorRef, private httpClient: HttpClient,
    private collectionHierarchyService: CollectionHierarchyService, private resourceService: ResourceService,
    private navigationHelperService: NavigationHelperService, private helperService: HelperService,
    private programsService: ProgramsService, public programTelemetryService: ProgramTelemetryService) {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const deviceId = (<HTMLInputElement>document.getElementById('deviceId'));
    this.deviceId = deviceId ? deviceId.value : '';
    this.buildNumber = buildNumber ? buildNumber.value : '1.0';
    this.portalVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    this.defaultFileSize = (<HTMLInputElement>document.getElementById('dockDefaultFileSize')) ?
     (<HTMLInputElement>document.getElementById('dockDefaultFileSize')).value : 150;
    this.defaultVideoSize =  (<HTMLInputElement>document.getElementById('dockDefaultVideoSize')) ?
    (<HTMLInputElement>document.getElementById('dockDefaultVideoSize')).value : 15000;
    this.configUrl =  (<HTMLInputElement>document.getElementById('portalCloudStorageUrl')) ?
    (<HTMLInputElement>document.getElementById('portalCloudStorageUrl')).value : "https://dockstorage.blob.core.windows.net/content-service/";
    this.enableReviewEdit =  (<HTMLInputElement>document.getElementById('enableReviewEdit')) ?
    (<HTMLInputElement>document.getElementById('enableReviewEdit')).value === 'true' : false;
      }

  ngOnInit() {
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.currentStage = 'chapterListComponent';
    this.sessionContext = _.get(this.chapterListComponentInput, 'sessionContext');
    this.programContext = _.get(this.chapterListComponentInput, 'programContext');
    this.programContext['enableReviewEdit'] = this.enableReviewEdit;
    this.setUserAccess();
    this.setTargetCollectionValue();
    this.currentUserID = this.userService.userid;
    this.currentRootOrgID = this.userService.rootOrgId;
    this.userService.userData$.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((user: any) => {
      if (user && !user.err) {
        this.userProfile = user.userProfile;
      }
    });
    // this.currentUserID = _.get(this.programContext, 'userDetails.userId');
    this.roles = _.get(this.chapterListComponentInput, 'roles');
    this.collection = _.get(this.chapterListComponentInput, 'collection');
    if(_.isUndefined(this.sessionContext['targetCollectionObjectType'])) {
      this.sessionContext['targetCollectionObjectType'] = _.get(this.collection, 'objectType');
    }
    this.sharedContext = _.get(this.chapterListComponentInput, 'programContext.config.sharedContext');
    this.sendReminderButton = _.get(this.chapterListComponentInput, 'programContext.config.isSendReminderEnabled');
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.projectTargetType = _.get(this.programContext, 'target_type');
    this.docxVersion = this.projectTargetType === 'questionSets'? '1.0' : '0.5';
    this.acceptedContentsAttribute = this.projectTargetType === 'questionSets' ? 'acceptedContributions' : 'acceptedContents';
    this.rejectedContentsAttribute = this.projectTargetType === 'questionSets' ? 'rejectedContributions' : 'rejectedContents';
    this.myOrgId = (this.userService.userRegistryData
      && this.userProfile.userRegData
      && this.userProfile.userRegData.User_Org
      && this.userProfile.userRegData.User_Org.orgId) ? this.userProfile.userRegData.User_Org.orgId : '';
    if ( _.isUndefined(this.sessionContext.topicList)) {
        this.fetchFrameWorkDetails();
    }
    this.setDynamicHeaders();
    this.getCollectionCategoryDefinition();
    /**
     * @description : this will fetch question Category configuration based on currently active route
     */
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

    this.statusOptionsList =
    [
      {
      "label": "Pending",
      "status": "Live"
      },
      {
        "label": "Corrections Pending",
        "status": "PendingForCorrections"
      },
      {
        "label": "Approved",
        "status": "Approved"
      },
      {
        "label": "Rejected",
        "status": "Rejected"
      }
  ]

    this.selectedStatusOptions = ["Live", "Approved"];
    this.displayPrintPreview = _.get(this.collection, 'printable', false);
    this.printUrl = this.programsService.getCollectionDocxUrl();
    this.downloadCsvUrl = this.programsService.getDownloadCsvUrl();
    this.setContextualHelpConfig();
  }
  setDynamicHeaders() {
    this.helperService.getDynamicHeaders(this.configUrl, this.projectTargetType).subscribe((state: any) => {
      if (_.has(state, 'headers')) {
        this.dynamicHeaders = state.headers;
      }
    });
  }
  setContextualHelpConfig() {
    const sunbirdContextualHelpConfig = this.helperService.getContextualHelpConfig();
    if (!_.isUndefined(sunbirdContextualHelpConfig)) {
      if (_.has(sunbirdContextualHelpConfig, 'sourcing.reviewContributions') && this.router.url.includes('/sourcing')) {
        this.reviewHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.reviewContributions');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.reviewContributions') && this.router.url.includes('/contribute')) {
        this.reviewHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'contribute.reviewContributions');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.myProjectContribute')) {
        this.contributeHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'contribute.myProjectContribute');
      }
    }
  }

  setUserAccess() {
    this.hasAccessForContributor =  this.hasAccessFor(['CONTRIBUTOR']);
    this.hasAccessForReviewer =  this.hasAccessFor(['REVIEWER']);
    this.hasAccessForBoth =  this.hasAccessFor(['CONTRIBUTOR', 'REVIEWER']);
  }

  setTargetCollectionValue() {
    if (!_.isUndefined(this.programContext)) {
      this.targetCollection = this.programsService.setTargetCollectionName(this.programContext);
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
    if (this.isSkipTwoLevelReviewEnabled() && this.isRestrictedProgram()) {
      this.sessionContext.currentOrgRole = 'individual';
    }
    else if (this.isPublishOrSubmit() && this.isContributingOrgContributor() && this.isDefaultContributingOrg()) {
      this.sessionContext.currentOrgRole = 'individual';
    }
      await this.getCollectionHierarchy(this.sessionContext.collection,
                this.selectedChapterOption === 'all' ? undefined : this.selectedChapterOption);
      // const acceptedContentsAttribute = this.projectTargetType === 'questionSets' ? 'acceptedContributions' : 'acceptedContents';
      const acceptedContents = _.get(this.storedCollectionData, this.acceptedContentsAttribute, []);
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
          _.forEach( _.get(response, 'result.Question'), (obj) => {
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

  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(filter(data => _.get(data, `frameworkdata.${this.sessionContext.framework}`)),
      first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        this.sessionContext['frameworkType'] = frameworkData.type;
        this.sessionContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
      }
    });
  }

  setLocalBlueprint(): void {
    let localBlueprintMap = _.get(this.programContext, "config.blueprintMap");
    this.localBlueprint = _.get(localBlueprintMap, `${this.collection && this.collection.code}`)
    if(this.localBlueprint) {
      this.localBlueprint.count = {
        subjective: 0,
        vsa: 0,
        sa: 0,
        la: 0,
        multipleChoice: 0,
        objective: 0,
        total: 0,
        learningOutcomes: 0,
        topics: 0,
        remember: 0,
        understand: 0,
        apply: 0
      };
      _.forEach(this.localBlueprint.questionTypes, (value, key) => {
        value = parseInt(value);
        this.localBlueprint.count.total = this.localBlueprint.count.total + value;
        if(key === "LA" || key === "SA" || key === "VSA") {
          if(key === "LA") this.localBlueprint.count.la = this.localBlueprint.count.la + value;
          if(key === "SA") this.localBlueprint.count.sa = this.localBlueprint.count.sa + value;
          if(key === "VSA") this.localBlueprint.count.vsa = this.localBlueprint.count.vsa + value;
          this.localBlueprint.count.subjective = this.localBlueprint.count.subjective + value;
        }
        else if(key === "MCQ") {
          this.localBlueprint.count.multipleChoice = this.localBlueprint.count.multipleChoice + value;
        }
        else if(key === "Objective") {
          this.localBlueprint.count.objective = this.localBlueprint.count.objective + value;
        }
      })
      _.forEach(this.localBlueprint.learningLevels, (value, key) => {
        value = parseInt(value);
        if(key === "apply") {
          this.localBlueprint.count.apply = this.localBlueprint.count.apply + value;
        }
        else if(key === "remember") {
          this.localBlueprint.count.remember = this.localBlueprint.count.remember + value;
        }
        else if(key === "understand") {
          this.localBlueprint.count.understand = this.localBlueprint.count.understand + value;
        }
      })
      this.localBlueprint.count.topics = this.localBlueprint.topics && this.localBlueprint.topics.length;
      this.localBlueprint.count.learningOutcomes = this.localBlueprint.learningOutcomes && this.localBlueprint.learningOutcomes.length;
    }
  }

  mapBlueprintData(blueprintCreate){
    let isOldBlueprintForm = false;
    blueprintCreate.properties.forEach(element => {
      if(element.fields == undefined){
        isOldBlueprintForm = true;
      }
    });
    let localBlueprintMap = _.get(this.programContext, "config.blueprintMap");
    let localBlueprintData = _.get(localBlueprintMap, `${this.collection && this.collection.code}`);

    if (isOldBlueprintForm){
      _.forEach(localBlueprintData, (prop, key) => {
          if (key === 'learningOutcomes'){
            localBlueprintData['learningoutcome'] = _.map(prop, data => {
              return data.name;
            });
          }
          if (key === 'topics'){
            localBlueprintData['topic'] = _.map(prop, data => {
              return data.name;
            });
          }
          _.forEach(prop, (element, keyValue) => {
            if (key === "questionTypes" || key === "learningLevels"){
              localBlueprintData[keyValue] = element;
            }
          });
      });
    }
    return localBlueprintData;
  }

  viewBlueprint(): void {
    this.viewBlueprintFlag = true;
  }

  viewBlueprintDetails(): void {
    this.viewBlueprintDetailsFlag = true;
  }

  getCollectionCategoryDefinition() {
    if (this.programContext.target_collection_category && this.programContext.rootorg_id) {
      let objectType = 'Collection';
      if(this.projectTargetType === 'questionSets') objectType = 'QuestionSet';
      // tslint:disable-next-line:max-line-length
      this.programsService.getCategoryDefinition(this.programContext.target_collection_category[0], this.programContext.rootorg_id,
        objectType).subscribe(res => {
        const objectCategoryDefinition = res.result.objectCategoryDefinition;
        // tslint:disable-next-line:max-line-length
        if (_.has(objectCategoryDefinition.objectMetadata.config, 'sourcingSettings.collection.hierarchy.level1.name')) {
          // tslint:disable-next-line:max-line-length
        this.firstLevelFolderLabel = objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection.hierarchy.level1.name;
        } else {
          this.firstLevelFolderLabel = _.get(this.resourceService, 'frmelmnts.lbl.deafultFirstLevelFolders');
        }

        if (_.has(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection')) {
          this.collectionSourcingConfig = _.get(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection');
          this.sessionContext['addFromLibraryEnabled'] = this.collectionSourcingConfig.addFromLibraryEnabled;
        }

        if (_.has(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.publishQuestionset')) {
          this.publishQuestionset = _.get(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.publishQuestionset');
        }

        if (_.has(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.bulkUploadEnabled')) {
          this.bulkUploadEnabled = _.get(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.bulkUploadEnabled');
        }

        if (_.has(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.downloadCsvEnabled')) {
          this.displayDownloadCsv = _.get(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.downloadCsvEnabled');
        }

        if (_.has(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.enableReviewEdit')) {
          this.programContext['enableReviewEdit'] = _.get(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.enableReviewEdit');
        }

        if (_.has(objectCategoryDefinition, 'forms.reviewerQualityCheck')) {
          this.programContext['qualityFormConfig'] = _.get(objectCategoryDefinition, 'forms.reviewerQualityCheck.properties');
        }

        if (_.has(objectCategoryDefinition.objectMetadata, 'config.isReviewerQualityCheckEnabled')) {
          this.programContext['isReviewerQualityCheckEnabled'] = _.get(objectCategoryDefinition.objectMetadata, 'config.isReviewerQualityCheckEnabled');
        }

        if (_.has(objectCategoryDefinition, "objectMetadata.config.sourcingSettings.collection.dynamicHeadersEnabled")) {
          this.dynamicHeadersEnabled = objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection.dynamicHeadersEnabled;
        }

        if (objectCategoryDefinition && objectCategoryDefinition.forms) {
          this.searchConfig = objectCategoryDefinition.forms.searchConfig;
          this.blueprintTemplate = objectCategoryDefinition.forms.blueprintCreate;
          if (this.blueprintTemplate && this.blueprintTemplate.properties) {
            _.forEach(this.blueprintTemplate.properties, (prop) => {
              prop.editable = false;
            });
          }
          this.setLocalBlueprint();
        }

        if (_.has(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.showQuestionPreview')) {
          this.displayShowQuestionPreview = _.get(objectCategoryDefinition.objectMetadata, 'config.sourcingSettings.collection.showQuestionPreview');
        }

        const contextType = this.sessionContext['frameworkType'] || _.get(this.programContext, 'config.frameworkObj.type');
        // tslint:disable-next-line:max-line-length
        this.programsService.getformConfigData(this.programContext.rootorg_id, 'framework', contextType, 'content', 'create', _.get(this.sessionContext, 'targetCollectionPrimaryCategory')).subscribe((formData) => {
          if (_.has(formData, 'result.data.properties') && this.frameworkService.orgFrameworkCategories) {
            _.forEach(this.frameworkService.orgFrameworkCategories, (orgFrameworkCategory) => {
              _.forEach(_.get(formData, 'result.data.properties'), (prop) => {
                if (prop.code === orgFrameworkCategory.code && prop.editable) {
                  this.tags.push(prop.code);
                }
              });
            });
          }
        });

        this.levelOneChapterList.push({
          identifier: 'all',
          // tslint:disable-next-line:max-line-length
          name: this.resourceService.frmelmnts.lbl.allFirstLevelFolders.replace('{FIRST_LEVEL_FOLDER}', this.firstLevelFolderLabel)
        });
      });
    }
  }

  printPreview(): void {
    this.toasterService.info(this.resourceService.messages.imsg.m0076 || 'Generating preview. Please wait...')
    let identifier = this.collectionData.identifier;
    this.programsService.generateCollectionDocx(identifier).subscribe((res) => {
      if(res.responseCode === 'OK') {
        this.printPreviewResponseData = res.result.base64string;
        let fileName = res.result.filename;
        const byteCharacters = atob(this.printPreviewResponseData);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main' });
        const a = document.createElement('a');
        document.body.appendChild(a);
        const fileURL = URL.createObjectURL(file);
        a.href = fileURL;
        a.download = fileName;
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(fileURL);
          document.body.removeChild(a);
        }, 0);
      }}, (error) => {
        this.toasterService.error(this.resourceService.messages.emsg.failedToPrint)
      });
  }

  publishQuestionToConsumption(): void {
    let identifier = this.collectionData.identifier;
    this.helperService.publishQuestionSetToConsumption(identifier, this.programContext).subscribe((res) => {
      this.showPublishConfirmationModal = false;
      if(res.responseCode === 'OK') {
        this.toasterService.success(this.resourceService.messages.smsg.questionset.publishing);
      }}, (error) => {
        this.toasterService.error(this.resourceService.messages.emsg.questionset.failedToPublish)
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
    let contentId = this.contentId;
    if (content && this.reusedContributions.indexOf(content.identifier) !== -1) {
      content.isAddedFromLibrary = true;
    }
    if(this.projectTargetType === 'questionSets') {
      if(action === 'creation') contentId = undefined;
    }
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
      },
      questionSetEditorComponentInput: {
        contentId: contentId,
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
    let objectType = 'content';
    let hierarchyUrl = `${this.configService.urlConFig.URLS.COLLECTION.HIERARCHY_GET_NEW}/${identifier}`;
    // let hierarchyUrl = 'content/v3/hierarchy/' + identifier;
    if(this.projectTargetType === 'questionSets') {
      hierarchyUrl = `${this.configService.urlConFig.URLS.QUESTIONSET.HIERARCHY_READ}/${identifier}`;
      objectType = 'questionSet';
    }


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
        _.forEach(response.result[objectType].children, (child) => {
          if (child.mimeType !== 'application/vnd.ekstep.content-collection' ||
          (child.mimeType === 'application/vnd.ekstep.content-collection' && child.openForContribution === true)) {
            children.push(child);
          }
        });

        response.result[objectType].children = children;
        this.collectionData = response.result[objectType];
        this.reusedContributions = _.get(this.collectionData, 'reusedContributions') || [];
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

        if (this.router.url.includes('/sourcing') && this.collectionData && this.collectionData.visibility === 'Default' && this.collectionData.origin) {
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
    if (_.get(this.collectionData, 'rejectedContributionComments')) {
      // tslint:disable-next-line:max-line-length
      this.sessionContext.hierarchyObj['rejectedContributionComments'] = _.isString(_.get(this.collectionData, 'rejectedContributionComments')) ? JSON.parse(_.get(this.collectionData, 'rejectedContributionComments')) : _.get(this.collectionData, 'rejectedContributionComments');
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
    if (!this.checkIfMainCollection(data, this.projectTargetType)) {
      const rootMeta = _.pick(data, this.sharedContext);
      const rootTree = this.generateNodeMeta(data, rootMeta);
      const isFolderExist = _.find(data.children, (child) => {
        return (this.checkIfCollectionFolder(child, this.projectTargetType));
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

  checkIfCollectionFolder(data, target_type?) {
    return this.helperService.checkIfCollectionFolder(data, target_type);
  }

  checkIfMainCollection (data, target_type?) {
      return this.helperService.checkIfMainCollection(data, target_type);
  }

  getTreeChildren(children) {
    if(this.projectTargetType === 'questionSets') {
      return children && children.filter(function (item) {
        return item.mimeType === 'application/vnd.sunbird.questionset' && item.visibility === "Parent";
      });
    }
    return children && children.filter(function (item) {
      return item.mimeType === 'application/vnd.ekstep.content-collection' && item.visibility === "Parent";
    });
  }

  getTreeLeaf(children) {
    if(this.projectTargetType === 'questionSets') {
      return children && children.filter(function (item) {
        return item.mimeType !== 'application/vnd.sunbird.questionset';
      });
    }
    return children && children.filter(function (item) {
      return item.mimeType !== 'application/vnd.ekstep.content-collection';
    });
  }

  checkifContent (content) {
    if(this.projectTargetType === 'questionSets') {
      if (content.mimeType !== 'application/vnd.sunbird.questionset' && content.visibility !== 'Parent') {
        return true;
      } else {
        return false;
      }
    }
    if (content.mimeType !== 'application/vnd.ekstep.content-collection' && content.visibility !== 'Parent') {
      return true;
    } else {
      return false;
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
      'root': this.checkIfMainCollection(data, this.projectTargetType) ? true : false,
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
      // Sorting leaf node based on created time
      // return _.orderBy(tree, (node) => {
      //   return new Date(node.createdOn);
      // });
    }
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

  getContentStatusCount(data) {
    const self = this;
    if (['admin', 'user'].includes(this.sessionContext.currentOrgRole)  && (this.sessionContext.currentRoles.includes('REVIEWER') || this.sessionContext.currentRoles.includes('CONTRIBUTOR') )) {
      // tslint:disable-next-line:max-line-length
      if ((this.checkifContent(data) && ( (this.myOrgId === data.organisationId)))  && (!data.sampleContent || data.sampleContent === undefined)) {
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
        !_.includes([...this.storedCollectionData[this.acceptedContentsAttribute] || [], ...this.storedCollectionData[this.rejectedContentsAttribute] || []], data.identifier)) {
          this.countData['pendingReview'] = this.countData['pendingReview'] + 1;
          this.countData['sourcing_approvalPending'] = this.countData['sourcing_approvalPending'] + 1;
          this.countData['sourcing_total'] = this.countData['sourcing_total'] + 1;
        }
        if (this.sourcingOrgReviewer && data.status === 'Draft' && data.prevStatus === 'Live' ) {
          this.countData['sourcing_correctionPending'] = this.countData['sourcing_correctionPending'] + 1;
          this.countData['sourcing_total'] = this.countData['sourcing_total'] + 1;
        }
        if (this.sourcingOrgReviewer && data.status === 'Live' && _.includes([...this.storedCollectionData[this.acceptedContentsAttribute] || []], data.identifier)) {
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
            if (data.qType) {
              this.calculateQuestionType(data.qType);
            }
            if (data.bloomsLevel) {
              this.parseBloomLevel(data.bloomsLevel);
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
        if (this.sourcingOrgReviewer && data.status === 'Live' && _.includes([...this.storedCollectionData[this.rejectedContentsAttribute] || []], data.identifier)) {
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

  calculateQuestionType(qType) {
    switch (qType) {
      case 'MCQ':
      case 'MTF':
      case 'FTB':
        this.countData['objective']++;
        break;
      case 'VSA':
        this.countData['vsa']++;
        this.countData['subjective']++;
        break;
      case 'SA':
        this.countData['sa']++;
        this.countData['subjective']++;
        break;
      case 'LA':
        this.countData['la']++;
        this.countData['subjective']++;
        break;
    }
  }

  parseBloomLevel(bloomsLevel) {
    if (_.isArray(bloomsLevel)) {
      _.forEach(bloomsLevel, (bl) => {
        this.calculateBloomLevel(bl);
      });
    } else {
      this.calculateBloomLevel(bloomsLevel);
    }
  }

  calculateBloomLevel(bloomLevel) {
    bloomLevel = bloomLevel ? bloomLevel.toLowerCase() : null;
    switch (bloomLevel) {
      case 'remember':
      case 'knowledge':
        this.countData['remember'] = this.countData['remember'] + 1;
        break;
      case 'understand':
      case 'understanding':
        this.countData['understand'] = this.countData['understand'] + 1;
        break;
      case 'apply':
      case 'application':
        this.countData['apply'] = this.countData['apply'] + 1;
        break;
    }
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
      createdOn : node.createdOn,
      sampleContent: node.sampleContent || null,
      qType: node.qType,
      sharedContext: {
        ...sharedMeta
      },
      learningOutcome: node.learningOutcome,
      bloomsLevel: node.bloomsLevel
    };
    return nodeMeta;
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

  checkSourcingStatus(content) {
    // const acceptedContentsAttribute = this.projectTargetType === 'questionSets' ? 'acceptedContributions' : 'acceptedContents';
    if (this.storedCollectionData[this.acceptedContentsAttribute]  &&
         _.includes(this.storedCollectionData[this.acceptedContentsAttribute] || [], content.identifier)) {
            return 'Approved';
      } else if (this.storedCollectionData[this.rejectedContentsAttribute]  &&
              _.includes(this.storedCollectionData[this.rejectedContentsAttribute] || [], content.identifier)) {
            return 'Rejected';
      } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
            return 'PendingForCorrections';
      } else {
        return null;
      }
  }

  hasAccessFor(roles: Array<string>) {
    return !_.isEmpty(_.intersection(roles, this.sessionContext.currentRoles || []));
  }

  ifContentFromCurrentNomination(content) {
    const nomination = this.sessionContext.nominationDetails;
    if (nomination &&
      ((nomination.organisation_id && nomination.organisation_id === content.organisationId) ||
      (!nomination.organisation_id && nomination.user_id && nomination.user_id === content.createdBy))
    ) {
      return true;
    }
    return false;
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
          (content.status === 'Live' || (content.prevStatus === 'Live' && content.status === 'Draft' )) && this.ifContentFromCurrentNomination(content)) {
              return true;
          }
          return false;
      } else if (reviewerViewRole && (content.status === 'Live'|| (content.prevStatus === 'Live' && content.status === 'Draft' ))) {
          return true;
      }
    } else {
      if ((this.sessionContext.nominationDetails?.status === 'Approved' || this.sessionContext.nominationDetails?.status === 'Rejected')
       && content.sampleContent === true) {
        return false;
      // tslint:disable-next-line:max-line-length
      } else if (creatorAndReviewerRole) {
        if (( (_.includes(['Review', 'Live'], content.status) || (content.prevStatus === 'Live' && content.status === 'Draft' ) || (content.prevStatus === 'Review' && content.status === 'Draft' )) && this.currentUserID !== content.createdBy && content.organisationId === this.myOrgId) || this.currentUserID === content.createdBy) {
          return true;
        } else if (content.status === 'Live' && content.sourceURL) {
          return true;
        }
      } else if (reviewerViewRole && (content.status === 'Review' || content.status === 'Live' || (content.prevStatus === 'Review' && content.status === 'Draft' ) || (content.prevStatus === 'Live' && content.status === 'Draft' ) || content.status === 'Processing')
      && this.currentUserID !== content.createdBy
      && content.organisationId === this.myOrgId) {
        return true;
      } else if (creatorViewRole && this.currentUserID === content.createdBy) {
        return true;
      } else if (contributingOrgAdmin && content.organisationId === this.myOrgId) {
        return true;
      } else if (content.status === 'Live' && content.sourceURL) {
        return true;
      } else if (this.reusedContributions.indexOf(content.identifier) !== -1 && this.sessionContext['addFromLibraryEnabled']) {
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
    this.showResourceTemplateTypePopUp = false;
    this.sessionContext['templateDetails'] =  event.templateDetails;
    if (event.template && event.templateDetails && !(event.templateDetails.onClick === 'uploadComponent' || this.projectTargetType === 'questionSets')) {
      const creationInput  = {
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        templateDetails: event.templateDetails,
        selectedSharedContext: this.selectedSharedContext,
        contentId: this.contentId,
        originCollectionData: this.originalCollectionData,
        action: 'creation',
        programContext: _.get(this.chapterListComponentInput, 'programContext')
      }

      const createContentReq = this.helperService.createContent(creationInput);
      createContentReq.pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = {
          errorMsg: 'Unable to create contentId, Please Try Again',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
          request: {}
        };
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      }))
        .subscribe(result => {
          this.contentId = result.identifier;
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, result.identifier)
            .subscribe(() => {
              this.programsService.emitHeaderEvent(false)
               // tslint:disable-next-line:max-line-length
               this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
            });
        });
    } else if(this.projectTargetType === 'questionSets') {
      this.programsService.emitHeaderEvent(false)
      // tslint:disable-next-line:max-line-length
      this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
    }
    else if (event.templateDetails) {
      this.templateDetails = event.templateDetails;
      this.programsService.emitHeaderEvent(false)
      // tslint:disable-next-line:max-line-length
      this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
    }
  }

  handlePreview(event) {
    this.templateDetails = {
      'name' : event.content.primaryCategory
    };
    const appEditorConfig = this.configService.contentCategoryConfig.sourcingConfig.files;
    const acceptedFile = appEditorConfig[event.content.mimeType];
    this.templateDetails['filesConfig'] = {};
    this.templateDetails.filesConfig['accepted'] = acceptedFile || '';
    this.templateDetails.filesConfig['size'] = {
      defaultfileSize:  this.defaultFileSize,
      defaultVideoSize:  this.defaultVideoSize
    }
    ;
    this.templateDetails.questionCategories = event.content.questionCategories;
    if (event.content.mimeType === 'application/vnd.ekstep.ecml-archive' && !_.isEmpty(event.content.questionCategories)) {
      this.templateDetails.onClick = 'questionSetComponent';
    } else if (event.content.mimeType === 'application/vnd.ekstep.ecml-archive' && _.isEmpty(event.content.questionCategories)) {
      this.templateDetails.onClick = 'editorComponent';
    } else if (event.content.mimeType === 'application/vnd.ekstep.quml-archive') {
      this.templateDetails.onClick = 'questionSetComponent';
    } else if (event.content.mimeType === 'application/vnd.sunbird.questionset'){
      this.templateDetails.onClick = 'questionSetEditorComponent';
    } else if(event.content.mimeType === 'application/vnd.sunbird.question'){
      this.templateDetails.onClick = 'questionSetEditorComponent';
    }
    else {
      this.templateDetails.onClick = 'uploadComponent';
    }
    this.componentLoadHandler('preview',
    this.programComponentsService.getComponentInstance(this.templateDetails.onClick), this.templateDetails.onClick, event);
    this.programsService.emitHeaderEvent(false)
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
      case 'addFromLibrary':
        this.currentStage = 'addFromLibrary';
        this.setAddLibraryInput(event);
        break;
      default:
        this.showResourceTemplatePopup = event.showPopup;
        this.showResourceTemplateTypePopUp = event.showPopup;
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
        this.sourcingService.apiErrorHandling(error, errInfo);
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
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
     }, (error) => {
      const errInfo = {
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env,
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
     })
  }

  resourceTemplateInputData() {
    /*let contentCategories = this.programContext.content_types;
    if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.content_types) {
      contentCategories = _.filter(contentCategories, (catName) => {
        if (_.includes(this.sessionContext.nominationDetails.content_types, catName)) {
          //obj.metadata = JSON.parse(obj.objectMetadata);
          return catName;
        }
      });
    }*/
    let contentCategories = this.programsService.getNominatedTargetPrimaryCategories(this.programContext, this.sessionContext.nominationDetails);
    this.resourceTemplateComponentInput = {
      templateList: contentCategories,
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

  public addResourceToHierarchy(contentId, resourceType = "default", isAddedFromLibrary = false) {
    const children: any[] = _.isArray(contentId)? contentId: [contentId];
    const req: any = {
      url: this.configService.urlConFig.URLS.COLLECTION.HIERARCHY_ADD,
      data: {
        'request': {
          'rootId': this.sessionContext.collection,
          'unitId': this.unitIdentifier,
          'children': children
        }
      }
    };
    if (resourceType === 'Question') {
      req.url = this.configService.urlConFig.URLS.QUESTIONSET.HIERARCHY_ADD;
      req.data = {
        'request': {
          'questionset': {
            'rootId': this.sessionContext.collection,
            'collectionId': this.unitIdentifier,
            'children': children
          }
        }
      };
    }
    this.actionService.patch(req).pipe(map((data: any) => data.result), catchError(err => {
      return throwError('');
    })).subscribe(res => {
      if (isAddedFromLibrary) {
        this.updateContentReusedContribution();
      } else {
        this.updateAccordianView();
      }
    });
  }

  public updateContentReusedContribution() {
    const option = {
      url: `${this.configService.urlConFig.URLS.DOCKCONTENT.GET}/${this.sessionContext.collection}`,
      param: { 'mode': 'edit', 'fields': 'versionKey' }
    };
    this.actionService.get(option).pipe(map((res: any) => res.result.content)).subscribe((data) => {
      const request = {
        content: {
          'versionKey': data.versionKey,
          reusedContributions: this.reusedContributions
        }
      };
      // tslint:disable-next-line:max-line-length
      this.helperService.updateContent(request, this.sessionContext.collection).subscribe(res => {
        this.updateAccordianView();
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.updateToc);
      });
    });
  }

  removeResourceFromHierarchy() {
    this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, this.contentId, this.projectTargetType)
       .subscribe(() => {
         this.showConfirmationModal = false;
         this.updateAccordianView(this.unitIdentifier);
         this.resetContentId();
         this.toasterService.success(this.resourceService.messages.smsg.m0064);
       });
  }

  deleteContent() {
  this.helperService.retireContent(this.contentId, this.projectTargetType)
    .subscribe(
      (response) => {
        if (this.projectTargetType === 'questionSets') {
          this.showConfirmationModal = false;
          this.updateAccordianView(this.unitIdentifier);
          this.toasterService.success(this.resourceService.messages.smsg.m0064);
        } else if (response && response.result && response.result.node_id) {
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
        this.sourcingService.apiErrorHandling(error, errInfo);
      }
    );
  }

  handleBack() {
    this.programStageService.removeLastStage();
  }

  ngOnDestroy() {
    if (this.stageSubscription) {
      this.stageSubscription.unsubscribe();
    }
    if (this.unsubscribe) {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
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
      // tslint:disable-next-line:max-line-length
      collection.statusMessage = this.resourceService.frmelmnts.lbl.textbookNodeStatusMessage.replace('{TARGET_NAME}', this.targetCollection);
    }

    // tslint:disable-next-line:max-line-length
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
      ...(visibility && { contentVisibility : true})
    };
    if (status && status.length > 0) {
      contents = _.filter(contents, leaf => {
        if (prevStatus && leaf.status === 'Draft' && (leaf.prevStatus === 'Review' || leaf.prevStatus === 'Live')) {
          return true;
        } else if (this.isContributingOrgReviewer() && leaf.status === 'Draft' && !leaf.prevStatus && leaf.createdBy != createdBy) {
          return false;
        } else {
          return _.includes(status, leaf.status);
        }
      });
    }

    if (this.isContributingOrgContributor() && this.isContributingOrgReviewer()) {
      delete filter.createdBy;
    }

    if(this.projectTargetType === 'questionSets') {
      delete filter.organisationId;
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
        if (((content.organisationId === this.myOrgId) || (_.get(content, 'sharedContext.channel') === this.currentRootOrgID)) && !content.sampleContent) {
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
        if (((content.organisationId === this.myOrgId) || (_.get(content, 'sharedContext.channel') === this.currentRootOrgID)) && !content.sourceURL && !content.sampleContent && content.createdBy === this.currentUserID) {
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

  isRestrictedProgram() {
    return _.get(this.programContext, 'type') === 'restricted';
  }

  isSkipTwoLevelReviewEnabled() {
    return !!(_.get(this.programContext, 'config.defaultContributeOrgReview') === false);
  }
  onLibraryChange(event) {
    switch (event.action) {
      case 'addBulk':
        this.reusedContributions = _.concat(this.reusedContributions, event.collectionIds);
        this.addResourceToHierarchy(event.collectionIds, event.resourceType, true);
        break;
    }
    this.currentStage = 'chapterListComponent';
  }

  setAddLibraryInput(event) {
    this.addFormLibraryInput = {
      targetPrimaryCategories: this.programContext.targetprimarycategories,
      framework: this.sessionContext.framework,
      existingContentCounts: this.countData['total'],
      collectionId: this.sessionContext.collection,
      collection: event.collection,
      editorConfig: {
        context: {
          identifier: this.sessionContext.collection,
          channel: this.programContext.rootorg_id,
          sid: this.userService.sessionId,
          did: this.deviceId,
          uid: this.userService.userid,
          pdata: {
            id: this.userService.appId,
            ver: this.portalVersion,
            pid: 'sunbird-portal'
          },
          authToken: '',
          contextRollup: this.telemetryService.getRollUpData(this.userProfile.organisationIds),
          tags: this.userService.dims,
          timeDiff: this.userService.getServerTimeDiff,
          endpoint: '/data/v3/telemetry',
          env: 'question_editor',
          user: {
            id: this.userService.userid,
            orgIds: this.userProfile.organisationIds,
            organisations: this.userService.orgIdNameMap,
            fullName : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.firstName + ' ' + this.userProfile.lastName :
              this.userProfile.firstName,
            firstName: this.userProfile.firstName,
            lastName : !_.isEmpty(this.userProfile.lastName) ? this.userProfile.lastName : '',
            isRootOrgAdmin: this.userService.userProfile.rootOrgAdmin
          }
        },
        config: {
          mode: 'edit',
          ...this.collectionSourcingConfig
        }
      },
      searchFormConfig: this.searchConfig.properties
    };
  }

  questionModalClose(){
    this.showQuestionModal = false;
  }
  sendReminderModalClose(){
    this.sendReminderModal =false;
  }
}
