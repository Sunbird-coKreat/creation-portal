import {
  Component, HostListener, Input, OnDestroy, OnInit, ChangeDetectorRef,
  EventEmitter, Output, ViewEncapsulation, AfterViewInit, ViewChild
} from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { TreeService } from '../../services/tree/tree.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { HelperService } from '../../services/helper/helper.service';
import { IEditorConfig } from '../../interfaces/editor';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError, forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
import { DialcodeService } from '../../services/dialcode/dialcode.service';
@Component({
  selector: 'lib-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() editorConfig: IEditorConfig | undefined;
  @Output() editorEmitter = new EventEmitter<any>();
  @Output() saveButtonEmitter = new EventEmitter<any>();
  @ViewChild('modal') private modal;
  public questionComponentInput: any = {};
  public collectionTreeNodes: any;
  public selectedNodeData: any = {};
  public templateList: any;
  public showConfirmPopup = false;
  public terms = false;
  public pageId = 'collection_editor';
  public pageStartTime;
  public rootFormConfig: any;
  public unitFormConfig: any;
  public leafFormConfig: any;
  public showLibraryPage = false;
  public libraryComponentInput: any = {};
  public editorMode;
  public collectionId;
  public isCurrentNodeFolder: boolean;
  public isCurrentNodeRoot: boolean;
  public isQumlPlayer: boolean;
  public showQuestionTemplatePopup = false;
  public showDeleteConfirmationPopUp = false;
  public showPreview = false;
  public actionType: string;
  private formStatusMapper: { [key: string]: boolean } = {};
  public targetFramework;
  public organisationFramework;
  toolbarConfig: any;
  public buttonLoaders = {
    saveAsDraftButtonLoader: false,
    addFromLibraryButtonLoader: false,
    previewButtonLoader: false,
    showReviewComment: false
  };
  public contentComment: string;
  public showComment: boolean;
  public showReviewModal: boolean;
  public addCollaborator: boolean;
  constructor(private editorService: EditorService, public treeService: TreeService, private frameworkService: FrameworkService,
              private helperService: HelperService, public telemetryService: EditorTelemetryService, private router: Router,
              private toasterService: ToasterService, private dialcodeService: DialcodeService,
              public configService: ConfigService, private changeDetectionRef: ChangeDetectorRef) {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.generateTelemetryEndEvent();
  }

  ngOnInit() {
    this.editorService.initialize(this.editorConfig);
    this.editorMode = this.editorService.editorMode;
    this.treeService.initialize(this.editorConfig);
    this.collectionId = _.get(this.editorConfig, 'context.identifier');
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.mergeCollectionExternalProperties().subscribe(
      (response) => {
        const hierarchyResponse = _.first(response);
        const collection = _.get(hierarchyResponse, `result.${this.configService.categoryConfig[this.editorConfig.config.objectType]}`);
        this.toolbarConfig.title = collection.name;
        this.organisationFramework = _.get(collection, 'framework') || _.get(this.editorConfig, 'context.framework') || this.editorConfig.context.framework;
        this.targetFramework = _.get(collection, 'targetFWIds') ||  _.get(this.editorConfig, 'context.targetFWIds');
        if (this.organisationFramework) {
          this.frameworkService.initialize(this.organisationFramework);
        }
        if (!_.isEmpty(this.targetFramework)) {
          this.frameworkService.getTargetFrameworkCategories(this.targetFramework);
        }
        const channel = _.get(collection, 'channel') || _.get(this.editorConfig, 'context.channel');
        this.helperService.initialize(channel);
      });
    this.editorService.getCategoryDefinition(this.editorConfig.config.primaryCategory,
      this.editorConfig.context.channel, this.editorConfig.config.objectType)
      .subscribe(
        (response) => {
          // tslint:disable-next-line:max-line-length
          const dialcode = _.get(response, 'result.objectCategoryDefinition.objectMetadata.schema.properties.generateDIALCodes.default');
          this.toolbarConfig.showDialcode = dialcode ? dialcode.toLowerCase() : 'no';
          this.helperService.channelData$.subscribe(
            (channelResponse) => {
              this.getFrameworkDetails(response);
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    this.pageStartTime = Date.now();
    this.telemetryService.initializeTelemetry(this.editorConfig);
    this.telemetryService.telemetryPageId = this.pageId;
    this.telemetryService.start({ type: 'editor', pageid: this.telemetryService.telemetryPageId });
    this.editorService.getshowLibraryPageEmitter()
      .subscribe(item => this.showLibraryComponentPage());
  }

  getFrameworkDetails(categoryDefinitionData) {
    let orgFWIdentifiers: any;
    let targetFWIdentifiers: any;
    let orgFWType: any;
    let targetFWType: any;
    orgFWIdentifiers = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.framework.enum') ||
    _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.framework.default');
    if (_.isEmpty(this.targetFramework || _.get(this.editorConfig, 'context.targetFWIds'))) {
      // tslint:disable-next-line:max-line-length
      targetFWIdentifiers = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.targetFWIds.default');
      if (_.isEmpty(targetFWIdentifiers) ) {
        // tslint:disable-next-line:max-line-length
        targetFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.targetFWType');
        const channelFrameworks = _.get(this.helperService.channelInfo, 'frameworks');
        const channelFrameworksType = _.map(channelFrameworks, 'type');
        const channelFrameworksIdentifiers = _.map(_.get(this.helperService.channelInfo, 'frameworks'), 'identifier');
        const difference =  _.difference(targetFWType, _.uniq(channelFrameworksType));

        if (targetFWType && channelFrameworksType && _.isEmpty(difference)) {
          this.targetFramework =  _.get(_.first(_.filter(channelFrameworks, framework => {
            return framework.type === _.first(targetFWType);
          })), 'identifier');
          this.treeService.updateMetaDataProperty('targetFWIds', _.castArray(this.targetFramework));
          this.frameworkService.getTargetFrameworkCategories(_.castArray(this.targetFramework));
        } else if ((targetFWType && channelFrameworksType && !_.isEmpty(difference))  || _.isEmpty(channelFrameworksType)) {
          this.frameworkService.getFrameworkData(undefined, difference, undefined, 'Yes').subscribe(
            (targetResponse) => {
              this.targetFramework = _.get(_.first(_.get(targetResponse, 'result.Framework')), 'identifier');
              if (!_.isEmpty(this.targetFramework)) {
                this.treeService.updateMetaDataProperty('targetFWIds', _.castArray(this.targetFramework));
                this.frameworkService.getTargetFrameworkCategories(_.castArray(this.targetFramework));
              }
            }
          );
        }
      } else {
        this.frameworkService.getFrameworkData(undefined, undefined, targetFWIdentifiers).subscribe(
          (targetResponse) => {
            this.targetFramework = _.get(_.first(_.get(targetResponse, 'result.Framework')), 'identifier');
            if (!_.isEmpty(this.targetFramework)) {
              this.treeService.updateMetaDataProperty('targetFWIds', _.castArray(this.targetFramework));
              this.frameworkService.getTargetFrameworkCategories(_.castArray(this.targetFramework));
            }
          }
        );
      }
    }

    if (_.isEmpty(orgFWIdentifiers)) {
      let orgFrameworkList = [];
      orgFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
      const channelFrameworksType = _.map(_.get(this.helperService.channelInfo, 'frameworks'), 'type');
      const difference =  _.difference(orgFWType, _.uniq(channelFrameworksType));
      if (channelFrameworksType) {
        orgFrameworkList = _.map(_.get(this.helperService.channelInfo, 'frameworks'), (framework) => {
          return { label: framework.name, identifier: framework.identifier };
        });
      }

      if (orgFWType && channelFrameworksType && _.isEmpty(difference)) {
        this.frameworkService.frameworkValues = orgFrameworkList;
        this.setEditorForms(categoryDefinitionData);
      } else if (orgFWType && channelFrameworksType && !_.isEmpty(difference) || _.isEmpty(channelFrameworksType)) {
        this.frameworkService.getFrameworkData(undefined, difference, undefined, 'Yes').subscribe(
          (response) => {
            this.frameworkService.frameworkValues = _.concat(_.map(_.get(response, 'result.Framework'), framework => {
              return {label: framework.name, identifier: framework.identifier};
            }), orgFrameworkList);
            this.setEditorForms(categoryDefinitionData);
          }, error => {
            console.log('error', error);
          }
        );
      } else if (this.organisationFramework) {
        this.setEditorForms(categoryDefinitionData);
      }
    } else {
      this.frameworkService.getFrameworkData(undefined, undefined, orgFWIdentifiers).subscribe(
        (response) => {
          this.frameworkService.frameworkValues = _.concat(_.map(_.get(response, 'result.Framework'), framework => {
            return { label: framework.name, identifier: framework.identifier };
          }));
          this.setEditorForms(categoryDefinitionData);
        }, error => {
          console.log('error', error);
        }
      );
    }
  }

  setEditorForms(categoryDefinitionData) {
    this.unitFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.unitMetadata.properties');
    // tslint:disable-next-line:max-line-length
    this.rootFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.create.properties');
    // tslint:disable-next-line:max-line-length
    this.libraryComponentInput.searchFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.search.properties');
    this.leafFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.childMetadata.properties');
  }

  ngAfterViewInit() {
    this.telemetryService.impression({
      type: 'edit', pageid: this.telemetryService.telemetryPageId, uri: this.router.url,
      duration: (Date.now() - this.pageStartTime) / 1000
    });
  }

  mergeCollectionExternalProperties(): Observable<any> {
  const requests = [];
  const objectType = this.configService.categoryConfig[this.editorConfig.config.objectType];
  requests.push(this.editorService.fetchCollectionHierarchy(this.collectionId));
  if (objectType === 'questionSet') {
    requests.push(this.editorService.readQuestionSet(this.collectionId));
   }
  return forkJoin(requests).pipe(tap(responseList => {
      const hierarchyResponse = _.first(responseList);
      this.collectionTreeNodes = {
        data: _.get(hierarchyResponse, `result.${objectType}`)
      };
      const tempHierarchy = _.get(hierarchyResponse, `result.${objectType}`) || {};
      this.editorConfig.config.hierarchy = {
        ...tempHierarchy,
        ...this.editorConfig.config.hierarchy
      };
      this.buttonLoaders.showReviewComment = this.showCommentAddedAgainstContent();
      if (_.isEmpty(this.collectionTreeNodes.data.children)) {
        this.toolbarConfig.hasChildren = false;
      } else {
        this.toolbarConfig.hasChildren = true;
      }

      if (objectType === 'questionSet') {
        const questionSetResponse = _.last(responseList);
        const data = _.get(questionSetResponse, _.toLower(`result.${objectType}`));
        this.collectionTreeNodes.data.instructions = data.instructions ? data.instructions : '';
      }
    }
  ));
  }

  toggleCollaboratorModalPoup() {
    if (this.addCollaborator) {
      this.addCollaborator = false;
    } else if (!this.addCollaborator) {
      this.addCollaborator = true;
    } else {
    }
  }

  toolbarEventListener(event) {
    this.actionType = event.button;
    switch (event.button) {
      case 'saveContent':
        this.buttonLoaders.saveAsDraftButtonLoader = true;
        this.saveContent().then((response: any) => {
          this.buttonLoaders.saveAsDraftButtonLoader = false;
          this.toasterService.success(response.message);
          this.redirectToCreateProgramPage(response.collection);
        }).catch(((error: string) => {
          this.buttonLoaders.saveAsDraftButtonLoader = false;
          this.toasterService.error(error);
        }));
        break;
        case 'saveCollection':
          this.buttonLoaders.saveAsDraftButtonLoader = true;
          this.saveContent().then((response:any) => {
            this.buttonLoaders.saveAsDraftButtonLoader = false;
            this.toasterService.success(response.message);
            this.redirectToCreateProgramPage(response.collection);
          }).catch(((error: string) => {
            this.buttonLoaders.saveAsDraftButtonLoader = false;
            this.toasterService.error(error);
          }));
          break;
      case 'previewContent':
        this.previewContent();
        break;
      case 'addFromLibrary':
        this.showLibraryComponentPage();
        break;
      case 'submitContent':
        this.submitHandler();
        break;
      case 'removeContent':
        this.showDeleteConfirmationPopUp = true;
        break;
      case 'editContent':
        this.redirectToQuestionTab('edit');
        break;
      case 'rejectContent':
        this.rejectContent(event.comment);
        break;
      case 'publishContent':
        this.publishContent();
        break;
      case 'onFormStatusChange':
        const selectedNode = this.treeService.getActiveNode();
        if (selectedNode && selectedNode.data.id) {
          this.formStatusMapper[selectedNode.data.id] = event.event.isValid;
        }
        break;
      case 'onFormValueChange':
        this.updateToolbarTitle(event);
        break;
      case 'backContent':
        this.redirectToCreateProgramPage();
        break;
        case 'backCollection':
          this.redirectToCreateProgramPage();
          break;
      case 'sendForCorrections':
        this.redirectToChapterListTab({ comment: event.comment });
        break;
      case 'sourcingApprove':
        this.redirectToChapterListTab();
        break;
      case 'sourcingReject':
        this.redirectToChapterListTab({ comment: event.comment });
        break;
      case 'addCollaborator':
        this.toggleCollaboratorModalPoup();
        break;
      case 'showReviewcomments':
        this.showReviewModal = ! this.showReviewModal;
        break;
      case 'showCorrectioncomments':
        this.contentComment = _.get(this.editorConfig, 'context.correctionComments')
        this.showReviewModal = ! this.showReviewModal;
        break;
      default:
        break;
    }
  }

  redirectToChapterListTab(data?: any) {
    this.editorEmitter.emit({
      close: true, library: 'collection_editor', action: this.actionType, identifier: this.collectionId,
      ...data
    });
  }

  redirectToCreateProgramPage(data?: any) {
    this.editorEmitter.emit({
      close: true, action: this.actionType, identifier: this.collectionId, collection: data
    })
  }

  updateToolbarTitle(data: any) {
    const selectedNode = this.treeService.getActiveNode();
    if (!_.isEmpty(data.event.name) && selectedNode.data.root) {
      this.toolbarConfig.title = data.event.name;
    } else if (_.isEmpty(data.event.name) && selectedNode.data.root) {
      this.toolbarConfig.title = 'Untitled';
    } else { }
  }

  showLibraryComponentPage() {
    if (this.editorService.checkIfContentsCanbeAdded()) {
    this.buttonLoaders.addFromLibraryButtonLoader = true;
    this.saveContent().then(res => {
      this.libraryComponentInput.collectionId = this.collectionId;
      this.buttonLoaders.addFromLibraryButtonLoader = false;
      this.pageId = 'library';
    }).catch(err => {
      this.toasterService.error(err);
      this.buttonLoaders.addFromLibraryButtonLoader = false;
    });
  }
  }

  libraryEventListener(event: any) {
    this.mergeCollectionExternalProperties().subscribe((res: any) => {
      this.pageId = 'collection_editor';
      this.telemetryService.telemetryPageId = this.pageId;
    });
  }

  saveContent() {
    return new Promise(async (resolve, reject) => {
      if (!this.validateFormStatus()) {
        return reject(_.get(this.configService, 'labelConfig.messages.error.029'));
      }
      const nodesModified =  _.get(this.editorService.getCollectionHierarchy(), 'nodesModified');      
      const objectType = this.configService.categoryConfig[this.editorConfig.config.objectType];
      if (objectType === 'questionSet') {
        const maxScore = await this.editorService.getMaxScore();
        this.treeService.updateMetaDataProperty('maxScore', maxScore);
      }
      this.editorService.updateHierarchy()
        .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
          if (this.toolbarConfig.showDialcode === 'yes') {
            this.dialcodeService.highlightNodeForInvalidDialCode(response, nodesModified, this.collectionId);
          }
          if (!_.isEmpty(response.identifiers)) {
            this.treeService.replaceNodeId(response.identifiers);
          }
          this.treeService.clearTreeCache();
          this.treeService.nextTreeStatus('saved');

          const tempCollection = _.mapValues(nodesModified[this.collectionId]?.metadata, (value, key) => {
            if(Array.isArray(value) && value.length === 1) return value[0];            
            else return value;
          });
          tempCollection.identifier = this.collectionId;
          tempCollection.editable = true;
          tempCollection.total = Object.keys(response.identifiers).length;

          resolve({collection: tempCollection, message: _.get(this.configService, 'labelConfig.messages.success.001')});
        }, err => {
          reject(_.get(this.configService, 'labelConfig.messages.error.001'));
        });
    });
  }

  submitHandler() {
    if (!this.validateFormStatus()) {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.005'));
      return;
    } else if (this.toolbarConfig.showDialcode === 'yes') {
      if (this.dialcodeService.validateUnitsDialcodes()) {
        this.showConfirmPopup = true;
      } else {
        this.toasterService.warning(_.get(this.configService, 'labelConfig.messages.warning.001'));
      }
    } else {
      this.showConfirmPopup = true;
    }
  }

  validateFormStatus() {
    const isValid = _.every(this.formStatusMapper, Boolean);
    if (isValid) { return true; }
    _.forIn(this.formStatusMapper, (value, key) => {
        if (value) {
          this.treeService.highlightNode(key, 'remove');
        } else {
          this.treeService.highlightNode(key, 'add');
        }
    });
    return false;
  }

  previewContent() {
    this.buttonLoaders.previewButtonLoader = true;
    this.saveContent().then(res => {
      this.updateTreeNodeData();
      this.buttonLoaders.previewButtonLoader = false;
      this.showPreview = true;
    }).catch(err => {
      this.toasterService.error(err);
      this.buttonLoaders.previewButtonLoader = false;
    });
  }

  sendForReview() {
    this.saveContent().then(messg => {
      this.editorService.reviewContent(this.collectionId).subscribe(data => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.002'));
        this.redirectToChapterListTab();
      }, err => {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.002'));
      });
    }).catch(err => this.toasterService.error(err));
  }

  rejectContent(comment) {
    this.editorService.submitRequestChanges(this.collectionId, comment).subscribe(res => {
      this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.003'));
      this.redirectToChapterListTab();
    }, err => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.003'));
    });
  }

  publishContent() {
    this.editorService.publishContent(this.collectionId).subscribe(res => {
      this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.004'));
      this.redirectToChapterListTab();
    }, err => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.004'));
    });
  }
  updateTreeNodeData() {
      const treeNodeData =  _.get(this.treeService.getFirstChild(), 'data.metadata');
      if (!treeNodeData.timeLimits) {
        treeNodeData.timeLimits = {};
      }
      if (treeNodeData.maxTime) {
        treeNodeData.timeLimits.maxTime = this.helperService.hmsToSeconds(treeNodeData.maxTime);
      }
      if (treeNodeData.warningTime) {
        treeNodeData.timeLimits.warningTime = this.helperService.hmsToSeconds(treeNodeData.warningTime);
      }
      this.collectionTreeNodes.data =  _.merge(this.collectionTreeNodes.data, _.omit(treeNodeData, ['childNodes']) );
  }
  treeEventListener(event: any) {
    this.actionType = event.type;
    this.updateTreeNodeData();
    switch (event.type) {
      case 'nodeSelect':
        this.updateSubmitBtnVisibility();
        this.selectedNodeData = _.cloneDeep(event.data);
        this.isCurrentNodeFolder = _.get(this.selectedNodeData, 'folder');
        this.isCurrentNodeRoot = _.get(this.selectedNodeData, 'data.root');
        // TODO: rethink below line code
        this.isQumlPlayer = _.get(this.selectedNodeData, 'data.metadata.mimeType') === 'application/vnd.sunbird.question';
        this.setTemplateList();
        this.changeDetectionRef.detectChanges();
        break;
      case 'deleteNode':
        this.showDeleteConfirmationPopUp = true;
        break;
      case 'createNewContent':
        if (this.editorService.checkIfContentsCanbeAdded()) {
        this.buttonLoaders.addFromLibraryButtonLoader = true;
        this.saveContent().then((message: string) => {
          this.buttonLoaders.addFromLibraryButtonLoader = false;
          this.showQuestionTemplatePopup = true;
        }).catch(((error: string) => {
          this.toasterService.error(error);
          this.buttonLoaders.addFromLibraryButtonLoader = false;
        }));
      }
        break;
      default:
        break;
    }
  }

  setTemplateList() {
    if (this.isCurrentNodeRoot) {
      this.templateList = _.flatMap(_.get(this.editorConfig, 'config.children'));
    } else {
      this.templateList = _.flatMap(
        _.get(this.editorService.editorConfig.config, `hierarchy.level${this.selectedNodeData.getLevel() - 1}.children`)
      );
    }
  }

  deleteNode() {
    const activeNode = this.treeService.getActiveNode();
    delete this.formStatusMapper[activeNode.data.id];
    const children = this.treeService.getChildren();
    _.forEach(children, (node) => {
      if (_.has(this.formStatusMapper, node.data.id)) {
        delete this.formStatusMapper[node.data.id];
      }
    });
    this.treeService.removeNode();
    this.updateSubmitBtnVisibility();
    this.showDeleteConfirmationPopUp = false;
    this.collectionTreeNodes.data.childNodes = _.filter(this.collectionTreeNodes.data.childNodes, (key) => {
      return key !== activeNode.data.id;
    });
  }

  updateSubmitBtnVisibility() {
    const rootFirstChildNode = this.treeService.getFirstChild();
    if (rootFirstChildNode && !rootFirstChildNode.children) {
      this.toolbarConfig.hasChildren = false;
    } else {
      this.toolbarConfig.hasChildren = true;
    }
  }

  generateTelemetryEndEvent() {
    const telemetryEnd = {
      type: 'editor',
      pageid: this.telemetryService.telemetryPageId,
      mode: this.editorMode,
      duration: _.toString((Date.now() - this.pageStartTime) / 1000)
    };
    this.telemetryService.end(telemetryEnd);
  }

  handleTemplateSelection($event) {
    const selectedQuestionType = $event;
    this.showQuestionTemplatePopup = false;
    if (selectedQuestionType && selectedQuestionType.type === 'close') {
      return false;
    }
    // tslint:disable-next-line:max-line-length
    this.editorService.getCategoryDefinition(selectedQuestionType, null, 'Question').pipe(catchError(error => {
      const errInfo = {
        errorMsg: _.get(this.configService, 'labelConfig.messages.error.006'),
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    })).subscribe((res) => {
      const selectedtemplateDetails = res.result.objectCategoryDefinition;
      const catMetaData = selectedtemplateDetails.objectMetadata;
      if (_.isEmpty(_.get(catMetaData, 'schema.properties.interactionTypes.items.enum'))) {
        // this.toasterService.error(this.resourceService.messages.emsg.m0026);
        this.editorService.selectedChildren = {
          primaryCategory: selectedQuestionType,
          mimeType: catMetaData.schema.properties.mimeType.enum[0],
          interactionType: null
        };
        this.redirectToQuestionTab(undefined, 'default');
      } else {
        const interactionTypes = catMetaData.schema.properties.interactionTypes.items.enum;
        this.editorService.selectedChildren = {
          primaryCategory: selectedQuestionType,
          mimeType: catMetaData.schema.properties.mimeType.enum[0],
          interactionType: interactionTypes[0]
        };
        this.redirectToQuestionTab(undefined, interactionTypes[0]);
      }
    });
  }

  redirectToQuestionTab(mode, interactionType?) {
    this.questionComponentInput = {
      questionSetId: this.collectionId,
      questionId: mode === 'edit' ? this.selectedNodeData.data.metadata.identifier : undefined,
      type: interactionType
    };
    this.pageId = 'question';
  }

  questionEventListener(event: any) {
    this.selectedNodeData = undefined;
    this.mergeCollectionExternalProperties().subscribe((res: any) => {
      this.pageId = 'collection_editor';
      this.telemetryService.telemetryPageId = this.pageId;
    });
  }

  get contentPolicyUrl() {
    return this.editorService.contentPolicyUrl;
  }

  showCommentAddedAgainstContent() {
    if (this.collectionTreeNodes.data.status === 'Draft' && _.has(this.collectionTreeNodes.data, 'rejectComment')) {
      this.contentComment = _.get(this.collectionTreeNodes.data, 'rejectComment');
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    if (this.telemetryService) {
      this.generateTelemetryEndEvent();
    }
    if (this.treeService) {
      this.treeService.clearTreeCache();
    }
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
