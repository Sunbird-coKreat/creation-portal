import { Component, OnInit, AfterViewInit } from '@angular/core';
import { questionToolbarConfig } from '../../editor.config';
import { EditorService } from '../../services';
import { QuestionService } from '../../services/question/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { questionEditorConfig } from '../../editor.config';
import { McqForm } from '../../../cbse-program';
import { ToasterService, ResourceService, ServerResponse, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { ProgramTelemetryService } from '../../../program/services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryService, IStartEventInput, IEndEventInput } from '@sunbird/telemetry';
import { data1 , data2, data3 } from '../contentplayer-page/quml-library-data';
@Component({
  selector: 'app-question-base',
  templateUrl: './question-base.component.html',
  styleUrls: ['./question-base.component.scss']
})
export class QuestionBaseComponent implements OnInit, AfterViewInit {

  QumlPlayerConfig = data3;
  toolbarConfig = questionToolbarConfig;
  public telemetryPageDetails: any = {};
  public telemetryPageId: string;
  public editorConfig: any = questionEditorConfig;
  public editorState: any = {};
  public showPreview: Boolean = false;
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
    'type': 'html',
    'value': 'Text+Image'
  },
  {
    'type': 'video',
    'value': 'video'
  }];
  questionMetaData: any;
  questionInteractionType;
  questionId;
  questionSetId;
  public setCharacterLimit = 160;
  public showLoader = true;
  telemetryImpression: any;
  public telemetryStart: IStartEventInput;
  public telemetryEnd: IEndEventInput;
  public pageStartTime;
  questionSetHierarchy: any;
  showConfirmPopup = false;
  public questionData: any = {};
  validQuestionData = false;

  constructor(private editorService: EditorService, private questionService: QuestionService,
    public activatedRoute: ActivatedRoute, public router: Router,
    public toasterService: ToasterService, public resourceService: ResourceService,
    private userService: UserService, public programTelemetryService: ProgramTelemetryService,
    private configService: ConfigService, private navigationHelperService: NavigationHelperService,
    private deviceDetectorService: DeviceDetectorService, private telemetryService: TelemetryService) {
      this.questionData = this.editorService.selectedChildren;
      this.activatedRoute.queryParams.subscribe(params => {
        this.questionInteractionType = params['type'];
        this.questionId = params['questionId'];
        this.toolbarConfig.title = this.questionData.primaryCategory;
      });
  }

  ngOnInit() {
    this.pageStartTime = Date.now();
    this.prepareTelemetryEvents();
    this.initialize();
    this.solutionUUID = UUID.UUID();
  }

  prepareTelemetryEvents() {
    this.telemetryPageDetails.telemetryPageId = this.getPageId();
    this.telemetryPageDetails.telemetryInteractCdata = [
      { id: this.userService.channel, type: 'sourcing_organization' },
      // { id: '', type: 'project' },
      // { id: '', type: 'linked_collection' } // TODO: Check
    ];
    // tslint:disable-next-line:max-line-length
    this.telemetryPageDetails.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID);
    this.telemetryPageDetails.telemetryPageId = this.telemetryPageId;
    this.telemetryPageDetails.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(
      _.get(this.activatedRoute, 'snapshot.queryParams.questionId'), 'Question', '1.0'
    );
    this.setTelemetryStartData();
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryPageDetails.telemetryInteractCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          // tslint:disable-next-line:max-line-length
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.activatedRoute.snapshot['_routerState'].url}` : this.activatedRoute.snapshot['_routerState'].url,
          duration: this.navigationHelperService.getPageLoadTime(),
        }
      };
    });
  }

  setTelemetryStartData() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    setTimeout(() => {
      this.telemetryStart = {
        object: {
          id: this.questionId || '',
          type: 'question',
        },
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryPageDetails.telemetryInteractCdata || [],
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
    this.telemetryEnd = {
      object: {
        id: this.questionId || '',
        type: 'question',
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryPageDetails.telemetryInteractCdata || [],
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

  initialize() {
    this.questionSetId = _.get(this.activatedRoute, 'snapshot.params.questionSetId');
    this.editorService.getQuestionSetHierarchy(this.questionSetId).
      subscribe((response) => {
        this.questionSetHierarchy = response;
      });
    if (!_.isUndefined(this.questionId)) {
      this.questionService.readQuestion(this.questionId)
        .subscribe((res) => {
          if (res.result) {
            this.questionMetaData = res.result.question;
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
        });
    }
    if (_.isUndefined(this.questionId)) {
      if (this.questionInteractionType === 'default') {
        this.editorState = { question: '', answer: '', solutions: '' };
        this.showLoader = false;
      }
      if (this.questionInteractionType === 'choice') {
        this.editorState = new McqForm({ question: '', options: [] }, {});
        this.showLoader = false;
      }
    }
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent();
        break;
      case 'cancelContent':
        this.generateTelemetryEndEvent('cancel');
        this.handleRedirectToQuestionset();
        break;
      case 'backContent':
        this.generateTelemetryEndEvent('back');
        this.handleRedirectToQuestionset();
        break;
      case 'previewContent':
        this.previewContent();
        break;
        case 'editContent':
          this.showPreview = false;
          this.showLoader = false;
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
    this.validQuestionData = true;
    this.saveQuestion();
  }

  redirectToQuestionset() {
    this.showConfirmPopup = false;
    setTimeout(() => {
      this.router.navigateByUrl(`create/questionSet/${this.questionSetId}`);
    }, 100);

  }

  editorDataHandler(event, type) {
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
      this.updateQuestion(this.questionId);
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
      if (videoMedia.thumbnail) {
        const thumbnailMedia: any = {};
        thumbnailMedia.src = this.videoThumbnail;
        thumbnailMedia.type = 'image';
        thumbnailMedia.id = `video_${event.identifier}`;
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

  prepareRequestBody() {
    let metadata = {
      'code': UUID.UUID(),
      'status': 'Draft',
      'mimeType': 'application/vnd.sunbird.question',
      'media': this.mediaArr,
      'editorState': {}
    };
    metadata = _.assign(metadata, this.editorState);
    metadata.editorState['question'] = metadata['question'];
    metadata['body'] = metadata['question'];

    if (this.questionInteractionType === 'choice') {
      metadata['body'] = this.getMcqQuestionHtmlBody(this.editorState.question, this.editorState.templateId);
    }

    if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
      const solutionObj = this.getSolutionObj(this.solutionUUID, this.selectedSolutionType, this.editorState.solutions);
      metadata.editorState['solutions'] = [solutionObj];
      metadata['solutions'] = [solutionObj];
    }
    if (_.isEmpty(this.editorState.solutions)) {
      metadata['solutions'] = [];
    }
    return _.omit(metadata, ['question', 'numberOfOptions', 'options']);
  }

  getMcqQuestionHtmlBody(question, templateId) {
    const mcqTemplateConfig = {
      // tslint:disable-next-line:max-line-length
      'mcqBody': '<div class=\'question-body\'><div class=\'mcq-title\'>{question}</div><div data-choice-interaction=\'response1\' class=\'{templateClass}\'></div></div>'
    };
    const { mcqBody } = mcqTemplateConfig;
    const questionBody = mcqBody.replace('{templateClass}', templateId)
      .replace('{question}', question);
    return questionBody;
  }

  createQuestion() {
    const metadata = this.prepareRequestBody();
    this.questionService.updateHierarchyQuestionCreate(this.questionSetId, metadata, this.questionSetHierarchy).
      subscribe(
        (response: ServerResponse) => {
          if (response.result) {
            const questionId = response.result.identifiers.questionId;
            this.toasterService.success(this.resourceService.messages.smsg.m0070);
            // tslint:disable-next-line:max-line-length
            this.router.navigate([`create/questionSet/${this.questionSetId}/question`], { queryParams: { type: this.questionInteractionType, questionId: questionId } });
          }
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0028);
          console.log(err);
        });
  }

  updateQuestion(questionId) {
    const metadata = this.prepareRequestBody();
    this.questionService.updateHierarchyQuestionUpdate(this.questionSetId, questionId, metadata, this.questionSetHierarchy).
      subscribe(
        (response: ServerResponse) => {
          if (response.result) {
            this.toasterService.success(this.resourceService.messages.smsg.m0070);
            // tslint:disable-next-line:max-line-length
            this.router.navigate([`create/questionSet/${this.questionSetId}/question`], { queryParams: { type: this.questionInteractionType, questionId: questionId } });
          }
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0029);
          console.log(err);
        });
  }

 async previewContent() {
   await this.saveContent();
   if (this.validQuestionData === true) {
    await this.setQumlData();
    this.showPreview = true;
   }
  }

  setQumlData() {
    this.QumlPlayerConfig.data.children = [];
    const questionMetadata = this.prepareRequestBody();
    this.QumlPlayerConfig.data.children.push(questionMetadata);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
