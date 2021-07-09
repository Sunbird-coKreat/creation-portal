import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ViewEncapsulation, OnChanges, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { McqForm } from '../../interfaces/McqForm';
import { ServerResponse } from '../../interfaces/serverResponse';
import { QuestionService } from '../../services/question/question.service';
import { PlayerService } from '../../services/player/player.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { TreeService } from '../../services/tree/tree.service';
import { EditorCursor } from '../../collection-editor-cursor.service';
import { filter, finalize, take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'lib-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit, AfterViewInit, OnDestroy {
  QumlPlayerConfig: any = {};
  @Input() questionInput: any;
  @Input() leafFormConfig: any;
  public initialLeafFormConfig: any;
  public childFormData: any;
  @Output() questionEmitter = new EventEmitter<any>();
  private onComponentDestroy$ = new Subject<any>();
  toolbarConfig: any = {};
  public editorState: any = {};
  public showPreview = false;
  public mediaArr: any = [];
  public videoShow = false;
  public showFormError = false;
  selectedSolutionType: string;
  selectedSolutionTypeIndex: string;
  showSolutionDropDown = true;
  showSolution = false;
  videoSolutionName: string;
  videoSolutionData: any;
  videoThumbnail: string;
  solutionUUID: string;
  solutionValue: string;
  solutionTypes: any = [{
    type: 'html',
    value: 'Text+Image'
  },
  {
    type: 'video',
    value: 'video'
  }];
  questionMetaData: any;
  questionInteractionType;
  questionId;
  tempQuestionId;
  questionSetId;
  public setCharacterLimit = 160;
  public showLoader = true;
  questionSetHierarchy: any;
  showConfirmPopup = false;
  validQuestionData = false;
  questionPrimaryCategory: string;
  pageId = 'question';
  pageStartTime: any;
  public framework;
  public frameworkDetails: any = {};
  public buttonLoaders = {
    saveButtonLoader: false
  };
  constructor(
    private questionService: QuestionService, private editorService: EditorService, public telemetryService: EditorTelemetryService,
    public playerService: PlayerService, private toasterService: ToasterService, private treeService: TreeService,
    private frameworkService: FrameworkService, private router: Router, public configService: ConfigService, 
    private editorCursor: EditorCursor) {
    const { primaryCategory } = this.editorService.selectedChildren;
    this.questionPrimaryCategory = primaryCategory;
    this.pageStartTime = Date.now();
  }

  ngOnInit() {
    const { questionSetId, questionId, type } = this.questionInput;
    this.questionInteractionType = type;
    this.questionId = questionId;
    this.questionSetId = questionSetId;
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.showPreview = false;
    this.solutionUUID = UUID.UUID();
    this.telemetryService.telemetryPageId = this.pageId;
    this.initialLeafFormConfig = _.cloneDeep(this.leafFormConfig);
    this.initialize();
    this.framework = _.get(this.editorService.editorConfig, 'context.framework');
    this.fetchFrameWorkDetails().subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.framework].categories;
        this.frameworkDetails.frameworkData = frameworkData;
        this.frameworkDetails.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
        this.populateFrameworkData();
      }
    });
  }
  fetchFrameWorkDetails() {
    return this.frameworkService.frameworkData$.pipe(takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.framework}`)), take(1));
  }
  populateFrameworkData() {
    const categoryMasterList = this.frameworkDetails.frameworkData;
    _.forEach(categoryMasterList, (category) => {
      _.forEach(this.leafFormConfig, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.terms = category.terms;
        }
      });
    });
  }
  ngAfterViewInit() {
    this.telemetryService.impression({
      type: 'edit', pageid: this.telemetryService.telemetryPageId, uri: this.router.url,
      duration: (Date.now() - this.pageStartTime) / 1000
    });
  }

  initialize() {
    this.editorService.fetchCollectionHierarchy(this.questionSetId).subscribe((response) => {
      this.questionSetHierarchy = _.get(response, 'result.questionSet');
      const leafFormConfigfields = _.join(_.map(this.leafFormConfig, value => (value.code)), ',');
      if (!_.isUndefined(this.questionId)) {
        this.questionService.readQuestion(this.questionId, leafFormConfigfields)
          .subscribe((res) => {
            if (res.result) {
              this.questionMetaData = res.result.question;
              this.populateFormData();
              if (_.isUndefined(this.questionPrimaryCategory)) {
                this.questionPrimaryCategory = this.questionMetaData.primaryCategory;
              }
              // tslint:disable-next-line:max-line-length
              this.questionInteractionType = this.questionMetaData.interactionTypes ? this.questionMetaData.interactionTypes[0] : 'default';
              if (this.questionInteractionType === 'default') {
                if (this.questionMetaData.editorState) {
                  this.editorState = this.questionMetaData.editorState;
                }
              }

              if (this.questionInteractionType === 'choice') {
                const responseDeclaration = this.questionMetaData.responseDeclaration;
                const templateId = this.questionMetaData.templateId;
                this.questionMetaData.editorState = this.questionMetaData.editorState;
                const numberOfOptions = this.questionMetaData.editorState.options.length;
                const options = _.map(this.questionMetaData.editorState.options, option => ({ body: option.value.body }));
                const question = this.questionMetaData.editorState.question;
                this.editorState = new McqForm({
                  question, options, answer: _.get(responseDeclaration, 'response1.correctResponse.value')
                }, { templateId, numberOfOptions });
                this.editorState.solutions = this.questionMetaData.editorState.solutions;
              }
              const hierarchyChildren = this.questionSetHierarchy.children ? this.questionSetHierarchy.children : [];
              this.setQuestionTitle(hierarchyChildren, this.questionId);
              if (!_.isEmpty(this.editorState.solutions)) {
                this.selectedSolutionType = this.editorState.solutions[0].type;
                this.solutionUUID = this.editorState.solutions[0].id;
                this.showSolutionDropDown = false;
                this.showSolution = true;
                if (this.selectedSolutionType === 'video') {
                  const index = _.findIndex(this.questionMetaData.media, (o) => {
                    return o.type === 'video' && o.id === this.editorState.solutions[0].value;
                  });
                  this.videoSolutionName = this.questionMetaData.media[index].name;
                  this.videoThumbnail = this.questionMetaData.media[index].thumbnail;
                }
                if (this.selectedSolutionType === 'html') {
                  this.editorState.solutions = this.editorState.solutions[0].value;
                }
              }
              if (this.questionMetaData.media) {
                this.mediaArr = this.questionMetaData.media;
              }
              this.showLoader = false;
            }
          }, (err: ServerResponse) => {
            const errInfo = {
              errorMsg: 'Fetching question details failed. Please try again...',
            };
            return throwError(this.editorService.apiErrorHandling(err, errInfo));
          });
      }
      if (_.isUndefined(this.questionId)) {
        this.tempQuestionId = UUID.UUID();
        this.populateFormData();
        const hierarchyChildren = this.questionSetHierarchy.children ? this.questionSetHierarchy.children : [];
        this.setQuestionTitle(hierarchyChildren);
        if (this.questionInteractionType === 'default') {
          this.editorState = { question: '', answer: '', solutions: '' };
        }
        if (this.questionInteractionType === 'choice') {
          this.editorState = new McqForm({ question: '', options: [] }, {});
        }
        this.showLoader = false;
      }
    }, (err: ServerResponse) => {
      const errInfo = {
        errorMsg: 'Fetching question set details failed. Please try again...',
      };
      this.editorService.apiErrorHandling(err, errInfo);
    });
  }

  toolbarEventListener(event) {
    switch (event.button) {
      case 'saveContent':
        this.saveContent();
        break;
      case 'cancelContent':
        this.handleRedirectToQuestionset();
        break;
      case 'backContent':
        this.handleRedirectToQuestionset();
        break;
      case 'previewContent':
        this.previewContent();
        break;
      case 'editContent':
        this.previewFormData(true);
        this.showPreview = false;
        this.toolbarConfig.showPreview = false;
        break;
      default:
        break;
    }
  }

  handleRedirectToQuestionset() {
    if (_.isUndefined(this.questionId)) {
      this.showConfirmPopup = true;
    } else {
      this.redirectToQuestionset();
    }
  }

  saveContent() {
    this.validateQuestionData();
    this.validateFormFields();
    if (this.showFormError === false) {
      this.saveQuestion();
    }
  }

  validateQuestionData() {

    if ([undefined, ''].includes(this.editorState.question)) {
      this.showFormError = true;
      return;
    }

    // to handle when question type is subjective
    if (this.questionInteractionType === 'default') {
      if (this.editorState.answer !== '') {
        this.showFormError = false;
      } else {
        this.showFormError = true;
        return;
      }
    }

    // to handle when question type is mcq
    if (this.questionInteractionType === 'choice') {
      const optionValid = _.find(this.editorState.options, option =>
        (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
      if (optionValid || !this.editorState.answer) {
        this.showFormError = true;
        return;
      } else {
        this.showFormError = false;
      }
    }
  }

  redirectToQuestionset() {
    this.showConfirmPopup = false;
    setTimeout(() => {
      this.questionEmitter.emit({ status: false });
    }, 100);
  }

  editorDataHandler(event, type?) {
    if (type === 'question') {
      this.editorState.question = event.body;
    } else if (type === 'solution') {
      this.editorState.solutions = event.body;
    } else {
      this.editorState = _.assign(this.editorState, event.body);
    }

    if (event.mediaobj) {
      const media = event.mediaobj;
      this.setMedia(media);
    }
  }

  setMedia(media) {
    if (media) {
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(media);
      }
    }
  }

  saveQuestion() {
    if (_.isUndefined(this.questionId)) {
      this.createQuestion();
    }
    if (!_.isUndefined(this.questionId)) {
      this.updateQuestion();
    }
  }

  videoDataOutput(event) {
    if (event) {
      this.videoSolutionData = event;
      this.videoSolutionName = event.name;
      this.editorState.solutions = event.identifier;
      this.videoThumbnail = event.thumbnail;
      const videoMedia: any = {};
      videoMedia.id = event.identifier;
      videoMedia.src = event.src;
      videoMedia.type = 'video';
      videoMedia.assetId = event.identifier;
      videoMedia.name = event.name;
      videoMedia.thumbnail = this.videoThumbnail;
      videoMedia.baseUrl = _.get(this.editorService.editorConfig, 'context.host') || document.location.origin;
      if (videoMedia.thumbnail) {
        const thumbnailMedia: any = {};
        thumbnailMedia.src = this.videoThumbnail;
        thumbnailMedia.type = 'image';
        thumbnailMedia.id = `video_${event.identifier}`;
        thumbnailMedia.baseUrl = _.get(this.editorService.editorConfig, 'context.host') || document.location.origin;
        this.mediaArr.push(thumbnailMedia);
      }
      this.mediaArr.push(videoMedia);
      this.showSolutionDropDown = false;
      this.showSolution = true;
    } else {
      this.deleteSolution();
    }
    this.videoShow = false;
  }

  selectSolutionType(data: any) {
    const index = _.findIndex(this.solutionTypes, (sol: any) => {
      return sol.value === data;
    });
    this.selectedSolutionType = this.solutionTypes[index].type;
    if (this.selectedSolutionType === 'video') {
      const showVideo = true;
      this.videoShow = showVideo;
    } else {
      this.showSolutionDropDown = false;
    }
  }

  deleteSolution() {
    if (this.selectedSolutionType === 'video') {
      this.mediaArr = _.filter(this.mediaArr, (item: any) => item.id !== this.editorState.solutions);
    }
    this.showSolutionDropDown = true;
    this.selectedSolutionType = '';
    this.videoSolutionName = '';
    this.editorState.solutions = '';
    this.videoThumbnail = '';
    this.showSolution = false;
  }

  getSolutionObj(solutionUUID, selectedSolutionType, editorStateSolutions: any) {
    let solutionObj: any;
    solutionObj = {};
    solutionObj.id = solutionUUID;
    solutionObj.type = selectedSolutionType;
    if (_.isString(editorStateSolutions)) {
      solutionObj.value = editorStateSolutions;
    }
    if (_.isArray(editorStateSolutions)) {
      if (_.has(editorStateSolutions[0], 'value')) {
        solutionObj.value = editorStateSolutions[0].value;
      }
    }
    return solutionObj;
  }

  getQuestionMetadata() {
    let metadata: any = {
      mimeType: 'application/vnd.sunbird.question',
      media: this.mediaArr,
      editorState: {}
    };
    metadata = _.assign(metadata, this.editorState);
    metadata.editorState.question = metadata.question;
    metadata.body = metadata.question;

    if (this.questionInteractionType === 'choice') {
      metadata.body = this.getMcqQuestionHtmlBody(this.editorState.question, this.editorState.templateId);
    }

    if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
      const solutionObj = this.getSolutionObj(this.solutionUUID, this.selectedSolutionType, this.editorState.solutions);
      metadata.editorState.solutions = [solutionObj];
      metadata.solutions = [solutionObj];
    }
    if (_.isEmpty(this.editorState.solutions)) {
      metadata.solutions = [];
    }
    metadata = _.merge(metadata, this.getDefaultSessionContext());
    metadata = _.merge(metadata, _.pickBy(this.childFormData, _.identity));
    return _.omit(metadata, ['question', 'numberOfOptions', 'options']);
  }

  getMcqQuestionHtmlBody(question, templateId) {
    const mcqTemplateConfig = {
      // tslint:disable-next-line:max-line-length
      mcqBody: '<div class=\'question-body\'><div class=\'mcq-title\'>{question}</div><div data-choice-interaction=\'response1\' class=\'{templateClass}\'></div></div>'
    };
    const { mcqBody } = mcqTemplateConfig;
    const questionBody = mcqBody.replace('{templateClass}', templateId)
      .replace('{question}', question);
    return questionBody;
  }

  getDefaultSessionContext() {
    return _.omitBy(_.merge(
      {
        author: _.get(this.editorService.editorConfig, 'context.user.fullName'),
        createdBy: _.get(this.editorService.editorConfig, 'context.user.id'),
        ..._.pick(_.get(this.editorService.editorConfig, 'context'), ['board', 'medium', 'gradeLevel', 'subject', 'topic'])
      },
      {
        ..._.pick(this.questionSetHierarchy, this.configService.sessionContext)
      }
    ), key => _.isEmpty(key));
  }

  prepareRequestBody() {
    const questionId = this.questionId ? this.questionId : UUID.UUID();
    const data = this.treeService.getFirstChild();
    const activeNode = this.treeService.getActiveNode();
    const selectedUnitId = _.get(activeNode, 'data.id');
    this.editorService.data = {};
    return {
      nodesModified: {
        [questionId]: {
          metadata: this.getQuestionMetadata(),
          objectType: 'Question',
          root: false,
          isNew: this.questionId ? false : true
        }
      },
      hierarchy: this.editorService._toFlatObj(data, questionId, selectedUnitId)
    };
  }

  createQuestion() {
    const requestBody = this.prepareRequestBody();
    this.showHideSpinnerLoader(true);
    this.questionService.updateHierarchyQuestionCreate(requestBody).pipe(
      finalize(() => {
        this.showHideSpinnerLoader(false);
      })).subscribe((response: ServerResponse) => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.007'));
        this.redirectToQuestionset();
      }, (err: ServerResponse) => {
          const errInfo = {
            errorMsg: 'Question creating failed. Please try again...',
          };
          this.editorService.apiErrorHandling(err, errInfo);
        });
  }

  updateQuestion() {
    const requestBody = this.prepareRequestBody();
    this.showHideSpinnerLoader(true);
    this.questionService.updateHierarchyQuestionUpdate(requestBody).pipe(
      finalize(() => {
        this.showHideSpinnerLoader(false);
      })).subscribe((response: ServerResponse) => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.008'));
        this.redirectToQuestionset();
      }, (err: ServerResponse) => {
        const errInfo = {
          errorMsg: 'Question updating failed. Please try again...',
        };
        this.editorService.apiErrorHandling(err, errInfo);
      });
  }

  showHideSpinnerLoader(status: boolean) {
    this.buttonLoaders.saveButtonLoader = status;
  }

  previewContent() {
    this.validateQuestionData();
    this.validateFormFields();
    if (this.showFormError === false) {
      this.previewFormData(false);
      const questionId = _.isUndefined(this.questionId) ? this.tempQuestionId : this.questionId;
      this.questionSetHierarchy.childNodes = [questionId];
      this.setQumlPlayerData(questionId);
      this.showPreview = true;
      this.toolbarConfig.showPreview = true;
    }
  }

  setQumlPlayerData(questionId: string) {
    const questionMetadata: any = this.getQuestionMetadata();
    questionMetadata.identifier = questionId;
    this.questionSetHierarchy.children = [questionMetadata];
    this.editorCursor.setQuestionMap(questionId, questionMetadata);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

  setQuestionTitle(hierarchyChildren, questionId?) {
    let index;
    let questionTitle = '';
    if (!_.isUndefined(questionId)) {
      index =  _.findIndex(hierarchyChildren, { 'identifier': questionId });
      const question  = hierarchyChildren[index];
      questionTitle = `Q${(index + 1).toString()} | ` + question.primaryCategory;
    } else {
      index = hierarchyChildren.length;
      questionTitle = `Q${(index + 1).toString()} | `;
      if (!_.isUndefined(this.questionPrimaryCategory)) {
        questionTitle = questionTitle + this.questionPrimaryCategory;
      }
    }
    this.toolbarConfig.title = questionTitle;
  }
  output(event) { }

  onStatusChanges(event) {
  }

  valueChanges(event) {
    this.childFormData = event;
  }
  validateFormFields() {
    _.forEach(this.leafFormConfig, (formFieldCategory) => {
      if (formFieldCategory.required && !this.childFormData[formFieldCategory.code]) {
        this.showFormError = true;
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.008'));
        return false;
      }
    });
    return true;
  }
  previewFormData(status) {
    const formvalue = _.cloneDeep(this.leafFormConfig);
    this.leafFormConfig = null;
    _.forEach(formvalue, (formFieldCategory) => {
      if (_.has(formFieldCategory, 'editable')) {
        formFieldCategory.editable = status ? _.find(this.initialLeafFormConfig, { code: formFieldCategory.code }).editable : status;
        formFieldCategory.default = this.childFormData[formFieldCategory.code];
      }
    });
    this.leafFormConfig = formvalue;
  }
  populateFormData() {
    this.childFormData = {};
    _.forEach(this.leafFormConfig, (formFieldCategory) => {
      if (!_.isUndefined(this.questionId)) {
        if (this.questionMetaData && _.has(this.questionMetaData, formFieldCategory.code)) {
          formFieldCategory.default = this.questionMetaData[formFieldCategory.code];
          this.childFormData[formFieldCategory.code] = this.questionMetaData[formFieldCategory.code];
        }
      } else {
        // tslint:disable-next-line:max-line-length
        const questionSetDefaultValue = _.get(this.questionSetHierarchy, formFieldCategory.code) ? _.get(this.questionSetHierarchy, formFieldCategory.code) : '';
        const defaultEditStatus = _.find(this.initialLeafFormConfig, { code: formFieldCategory.code }).editable === true ? true : false;
        formFieldCategory.default = defaultEditStatus ? '' : questionSetDefaultValue;
        this.childFormData[formFieldCategory.code] = formFieldCategory.default;
      }
    });
  }
  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
    this.editorCursor.clearQuestionMap();
  }
}

