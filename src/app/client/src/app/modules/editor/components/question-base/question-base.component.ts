import { Component, OnInit } from '@angular/core';
import { collectionTreeNodes, questionToolbarConfig } from '../../editor.config';
import {EditorService} from '../../services';
import {QuestionService} from '../../services/question/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { questionEditorConfig } from '../../editor.config';
import { McqForm } from '../../../cbse-program';
import { forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ToasterService, ResourceService, ServerResponse, ConfigService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { ProgramTelemetryService } from '../../../program/services';
@Component({
  selector: 'app-question-base',
  templateUrl: './question-base.component.html',
  styleUrls: ['./question-base.component.scss']
})
export class QuestionBaseComponent implements OnInit {

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
  constructor(private editorService: EditorService, private questionService: QuestionService,
    public activatedRoute: ActivatedRoute, public router: Router, private http: HttpClient,
    public toasterService: ToasterService, public resourceService: ResourceService,
    private userService: UserService, public programTelemetryService: ProgramTelemetryService,
    private configService: ConfigService) { }

  ngOnInit() {
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
    console.log(this.telemetryPageDetails);
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  initialize() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.questionInteractionType = params['type'];
      this.questionId = params['questionId'];
    });

    this.questionSetId = _.get(this.activatedRoute, 'snapshot.params.questionSetId');

   if (!_.isUndefined(this.questionId)) {
      this.questionService.readQuestion(this.questionId)
      .subscribe((res) => {
        if (res.result) {
          this.questionMetaData = res.result.question;

          if (this.questionInteractionType === 'default') {
            if ( this.questionMetaData.editorState) {
              this.editorState = this.questionMetaData.editorState;
            } else {
              this.editorState = this.questionMetaData;
              this.editorState.question = this.questionMetaData.body;
            }
          }
          if (this.questionInteractionType === 'choice') {
            const { responseDeclaration, templateId } = this.questionMetaData;
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
        this.redirectToQuestionset();
        break;
      case 'backContent':
        this.redirectToQuestionset();
        break;
      default:
        break;
    }
  }

  saveContent() {
    // to handle when question type is subjective
    if (this.questionInteractionType === 'default') {
      if (this.editorState.question !== '' && this.editorState.answer !== '') {
        this.showFormError = false;
        const metadata = this.getSubjectiveMetadata(this.editorState);
        this.saveQuestion(metadata);
      } else {
        this.showFormError = true;
        return;
      }
    }
    // to handle when question type is mcq
    if (this.questionInteractionType === 'choice') {
      const optionValid = _.find(this.editorState.options, option =>
        (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
      if (optionValid || !this.editorState.answer || [undefined, ''].includes(this.editorState.question)) {
        this.showFormError = true;
        return;
      } else {
        const metadata = this.getMcqMetadata(this.editorState);
        this.saveQuestion(metadata);
      }
    }
  }

  redirectToQuestionset() {
    this.router.navigateByUrl(`create/questionSet/${this.questionSetId}`);
  }

  editorDataHandler(event, type) {
    if (type === 'question') {
      this.editorState.question = event.body;
    } else if (type === 'answer') {
      this.editorState.answer = event.body;
    } else if (type === 'solution') {
      this.editorState.solutions = event.body;
    }

    if (event.mediaobj) {
      const media = event.mediaobj;
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(event.mediaobj);
      }
    }
  }

  getMedia(media) {
    if (media) {
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(media);
      }
    }
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

  saveQuestion(metadata) {
    if (_.isUndefined(this.questionId)) {
      // tslint:disable-next-line:max-line-length
      metadata = _.omit(metadata, ['templateId', 'responseDeclaration', 'interactionTypes', 'weightage', 'maxScore', 'media', 'interactions', 'editorState', 'qType']);
      console.log('create metadata', metadata);
      this.createQuestion(metadata);
    }
    if (!_.isUndefined(this.questionId)) {
      // tslint:disable-next-line:max-line-length
      metadata = _.omit(metadata, ['templateId', 'responseDeclaration', 'interactionTypes', 'weightage', 'maxScore', 'status', 'media', 'interactions', 'editorState', 'qType', 'visibility', 'code', 'status', 'mimeType']);
      console.log('update metadata', metadata);
      this.updateQuestion(metadata, this.questionId);
    }
  }

  getSubjectiveMetadata(editorState: any) {
    let metadata: any;
    forkJoin([this.getConvertedLatex(editorState.question), this.getConvertedLatex(editorState.answer)])
    .subscribe((res) => {
      const rendererBody = res[0];
      const rendererAnswer = res[1];
      metadata = {
        'code': UUID.UUID(),
        'body': rendererBody,
        'answer': rendererAnswer,
        'templateId': '',
        'responseDeclaration': {},
        'interactionTypes': [],
        'interactions': [],
        'editorState': {
          'question': editorState.question,
          'answer': editorState.answer
        },
        'status': 'Draft',
        'name': 'SA',
        'qType': 'SA',
        'media': this.mediaArr,
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'primaryCategory': 'Practice Question Set'
      };

      if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
        const solutionObj = this.getSolutionObj(this.solutionUUID, this.selectedSolutionType, editorState.solutions);
        metadata.editorState['solutions'] = [solutionObj];
        metadata['solutions'] = [solutionObj];
      }
      if (_.isEmpty(editorState.solutions)) {
        metadata['solutions'] = [];
      }
    });
    return metadata;
  }

  getMcqMetadata(editorState) {
    let metadata: any;
    // tslint:disable-next-line:max-line-length
    forkJoin([this.getConvertedLatex(editorState.question), ...editorState.options.map(option => this.getConvertedLatex(option.body))])
      .subscribe((res) => {
        const body = res[0]; // question with latex
        const questionData = this.getQuestionHtml(body, editorState);
        const correct_answer = editorState.answer;
        let resindex;
        const options = _.map(editorState.options, (opt, key) => {
          resindex = Number(key);
          if (Number(correct_answer) === key) {
            return { 'answer': true, value: {'body': opt.body, 'value': resindex} };
          } else {
            return { 'answer': false, value: {'body': opt.body, 'value': resindex} };
          }
        });
        metadata = {
          'code': UUID.UUID(),
          'templateId': ' mcq-vertical',
          'name': 'MCQ', // hardcoded value need to change it later
          'body': questionData.body,
          'responseDeclaration': questionData.responseDeclaration,
          'interactionTypes': ['choice'],
          'interactions' : this.getInteractions(editorState.options),
          'editorState' : {
            'question': editorState.question,
            'options': options
          },
          'status': 'Draft',
          'media': this.mediaArr,
          'qType': 'MCQ',
          'mimeType': 'application/vnd.ekstep.qml-archive',
          'primaryCategory': 'Practice Question Set'
        };
        if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
          const solutionObj = this.getSolutionObj(this.solutionUUID, this.selectedSolutionType, editorState.solutions);
          metadata.editorState['solutions'] = [solutionObj];
          metadata['solutions'] = [solutionObj];
        }
        if (_.isEmpty(editorState.solutions)) {
          metadata['solutions'] = [];
        }
      });
      return metadata;
  }

  getSolutionObj(solutionUUID, selectedSolutionType, editorStateSolutions: any) {
    let solutionObj: any;
    solutionObj = {};
    solutionObj.id = solutionUUID;
    solutionObj.type = selectedSolutionType;
    solutionObj.value = editorStateSolutions;
    return solutionObj;
  }

  getConvertedLatex(body) {
    const getLatex = (encodedMath) => {
      return this.http.get('https://www.wiris.net/demo/editor/mathml2latex?mml=' + encodedMath, {
        responseType: 'text'
      });
    };
    let latexBody;
    const isMathML = body.match(/((<math("[^"]*"|[^\/">])*)(.*?)<\/math>)/gi);
    if (isMathML && isMathML.length > 0) {
      latexBody = isMathML.map(math => {
        const encodedMath = encodeURIComponent(math);
        return getLatex(encodedMath);
      });
    }
    if (latexBody) {
      return forkJoin(latexBody).pipe(
        map((res) => {
          _.forEach(res, (latex, i) => {
            body = latex.includes('Error') ? body : body.replace(isMathML[i], '<span class="mathText">' + latex + '</span>');
          });
          return body;
        })
      );
    } else {
      return of(body);
    }
  }

  getQuestionHtml(question, editorState: any) {
    const mcqTemplateConfig = {
      // tslint:disable-next-line:max-line-length
      'mcqBody': '<div class=\"question-body\"><div class=\"mcq-title\">{question}</div><div data-choice-interaction=\"response1\" class=\"mcq-vertical\"></div></div>'
    };
    const { mcqBody } = mcqTemplateConfig;
    const questionBody = mcqBody.replace('{templateClass}', editorState.templateId)
      .replace('{question}', question);
    const responseDeclaration = {
      maxScore: 1,
      response1: {
        cardinality: 'single',
        type: 'integer',
        'correctResponse': {
          value: editorState.answer,
          outcomes: {'SCORE': 1}
        }
      }
    };
    return {
      body: questionBody,
      responseDeclaration: responseDeclaration,
    };
  }

  getInteractions(options) {
    let index;
    const interactOptions = _.map(options, (opt, key) => {
      index = Number(key);
        return { value: {'label': opt.body, 'value': index} };
    });
    const interactions = {
      'response1': {
        'type': 'choice',
        'options': interactOptions
      }
    };
    return interactions;
  }

  createQuestion(metadata) {
    this.questionService.createQuestion(metadata)
    .subscribe(
      (response: ServerResponse) => {
      if (response.result) {
        this.toasterService.success(this.resourceService.messages.smsg.m0070);
       const questionId = response.result.identifier;
       // tslint:disable-next-line:max-line-length
       this.router.navigate([`create/questionSet/${this.questionSetId}/question`], { queryParams: { type: this.questionInteractionType, questionId: questionId } });
       this.addQuestionToQuestionSet(this.questionSetId, questionId);
      }
    },
    (err: ServerResponse) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0028);
      console.log(err);
    }
    );
  }

  updateQuestion(metadata, questionId) {
    this.questionService.updateQuestion(metadata, questionId)
    .subscribe(
      (response: ServerResponse) => {
      if (response.result) {
        this.toasterService.success(this.resourceService.messages.smsg.m0071);
        // tslint:disable-next-line:max-line-length
        this.router.navigate([`create/questionSet/${this.questionSetId}/question`], { queryParams: { type: this.questionInteractionType, questionId: questionId } });
        this.addQuestionToQuestionSet(this.questionSetId, questionId);
      }
    },
    (err: ServerResponse) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0029);
      console.log(err);
    });
  }

  addQuestionToQuestionSet(questionSetId, questionId) {
    this.questionService.addQuestionToQuestionSet(questionSetId, questionId).
    subscribe(
      (res: ServerResponse) => {
      if (res.result) {
        // this.router.navigateByUrl(`create/questionSet/${questionSetId}`);
        this.toasterService.success(this.resourceService.messages.smsg.m0072);
      }
    },
    (err: ServerResponse) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0030);
      console.log(err);
    }
    );
  }
}
