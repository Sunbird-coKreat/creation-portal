import { Component, OnInit } from '@angular/core';
import { collectionTreeNodes, questionToolbarConfig } from '../../editor.config';
import {EditorService} from '../../services';
import {QuestionService} from '../../services/question/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { questionEditorConfig } from '../../editor.config';
import { McqForm } from '../../../cbse-program';
import { forkJoin, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ToasterService, ResourceService, ServerResponse } from '@sunbird/shared';
@Component({
  selector: 'app-question-base',
  templateUrl: './question-base.component.html',
  styleUrls: ['./question-base.component.scss']
})
export class QuestionBaseComponent implements OnInit {

  toolbarConfig = questionToolbarConfig;
  public editorConfig: any = questionEditorConfig;
  public editorState: any = {};
  private initialized = false;
  public showPreview: Boolean = false;
  public mediaArr: any = [];
  public videoShow = false;
  public showFormError: Boolean = false;
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
  public showLoader: Boolean = true;
  constructor(private editorService: EditorService, private questionService: QuestionService,
    public activatedRoute:ActivatedRoute, public router: Router, private http: HttpClient,
    public toasterService: ToasterService, public resourceService: ResourceService) { }

  ngOnInit() {
    this.initialize();
    this.initialized = true;
    this.solutionUUID = UUID.UUID();
  }

  ngOnChanges() {
    if (this.initialized) {
      this.initialize();
    }
  }

  initialize() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.questionInteractionType = params['type'];
      this.questionId = params['questionId'];
    });

    this.questionSetId = _.get(this.activatedRoute, 'snapshot.params.questionSetId');

   if(!_.isUndefined(this.questionId)) {
      this.questionService.readQuestion(this.questionId)
      .subscribe((res)=> {
        if(res.result) {
          this.questionMetaData = res.result.question;

          if (this.questionInteractionType == 'default') {
            if( this.questionMetaData.editorState){
              this.editorState = this.questionMetaData.editorState;
            }
            else {
              this.editorState = this.questionMetaData;
              this.editorState.question = this.questionMetaData.body;
            }
          }
          if (this.questionInteractionType == 'choice') {
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
            if(this.selectedSolutionType === 'html') {
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
    if(_.isUndefined(this.questionId)) {
      if(this.questionInteractionType === 'default') {
        this.editorState = { question: '', answer: '', solutions: '' };
        this.showLoader = false;
      }
      if(this.questionInteractionType === 'choice') {
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
      if (this.editorState.question !== '') {
        this.showFormError = false;
        this.saveSubjectiveQuestion();
      } else {
        this.showFormError = true;
      }
    }
    // to handle when question type is mcq
    if (this.questionInteractionType === 'choice') {
      if (this.editorState.question !== '' && this.editorState.answer !== '') {
        this.showFormError = false;
        this.saveMcqQuestion();
      } else {
        this.showFormError = true;
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

  saveSubjectiveQuestion() {
    forkJoin([this.getConvertedLatex(this.editorState.question), this.getConvertedLatex(this.editorState.answer)])
    .subscribe((res) => {
      const rendererBody = res[0];
      const rendererAnswer = res[1];
      let metadata = {
        'code': UUID.UUID(),
        'body': rendererBody,
        'answer': rendererAnswer,
        'templateId': '',
        'responseDeclaration': {},
        'interactionTypes': [],
        'interactions': [],
        'editorState': {
          'question': this.editorState.question,
          'answer': this.editorState.answer
        },
        'status': 'Draft',
        'name': 'untitled SA',
        'qType': 'SA',
        'media': this.mediaArr,
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'primaryCategory': 'Practice Question Set'
      };

      let solutionObj: any;
      if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
        solutionObj = {};
        solutionObj.id = this.solutionUUID;
        solutionObj.type = this.selectedSolutionType;
        solutionObj.value = this.editorState.solutions;
        metadata.editorState['solutions'] = [solutionObj];
        metadata['solutions'] = [solutionObj];
      }
      if (_.isEmpty(this.editorState.solutions)) {
        metadata['solutions'] = [];
      }
      if(_.isUndefined(this.questionId)) {
        metadata = _.omit(metadata,['templateId', 'responseDeclaration', 'interactionTypes', 'weightage', 'maxScore', 'media', 'interactions', 'editorState', 'qType'])
        console.log("subjective create metadata", metadata);
        this.createQustion(metadata);
      }
      if(!_.isUndefined(this.questionId)) {
        metadata = _.omit(metadata,['templateId', 'responseDeclaration', 'interactionTypes', 'weightage', 'maxScore', 'status', 'media', 'interactions', 'editorState', 'qType', 'visibility', 'code', 'status', 'mimeType'])
        console.log("subjective update metadata", metadata);
        this.updateQuestion(metadata, this.questionId)
      }
    });
  }

  saveMcqQuestion() {
    forkJoin([this.getConvertedLatex(this.editorState.question), ...this.editorState.options.map(option => this.getConvertedLatex(option.body))])
      .subscribe((res) => {
        const body = res[0]; // question with latex
        const questionData = this.getQuestionHtml(body);
        const correct_answer = this.editorState.answer;
        let resindex;
        const options = _.map(this.editorState.options, (opt, key) => {
          resindex = Number(key);
          if (Number(correct_answer) === key) {
            return { 'answer': true, value: {'body': opt.body, 'value': resindex} };
          } else {
            return { 'answer': false, value: {'body': opt.body, 'value': resindex} };
          }
        });
        let metadata = {
          'code': UUID.UUID(),
          'templateId': ' mcq-vertical',
          'name': 'untitled mcq', //hardcoded value need to change it later
          'body': questionData.body,
          'responseDeclaration': questionData.responseDeclaration,
          'interactionTypes': ['choice'],
          'interactions' : this.getInteractions(this.editorState.options),
          'editorState' : {
            'question': this.editorState.question,
            'options': options
          },
          'status': 'Draft',
          'media': this.mediaArr,
          'qType': 'MCQ',
          'mimeType': 'application/vnd.ekstep.qml-archive',
          'primaryCategory': 'Practice Question Set'
        };
        let solutionObj: any;
        if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
          solutionObj = {};
          solutionObj.id = this.solutionUUID;
          solutionObj.type = this.selectedSolutionType;
          solutionObj.value = this.editorState.solutions;
          metadata.editorState['solutions'] = [solutionObj];
          metadata['solutions'] = [solutionObj];
        }
        if (_.isEmpty(this.editorState.solutions)) {
          metadata['solutions'] = [];
        }
        if(_.isUndefined(this.questionId)) {
          // metadata = _.omit(metadata,['templateId', 'interactionTypes', 'weightage', 'maxScore', 'media', 'interactions', 'editorState', 'qType'])
          console.log("mcq create metadata", metadata);
          // this.createQustion(metadata);
        }
        if(!_.isUndefined(this.questionId)) {
          // metadata = _.omit(metadata,['templateId', 'interactionTypes', 'weightage', 'maxScore', 'status', 'media', 'interactions', 'editorState', 'qType'])
          console.log("mcq update metadata", metadata);
          // this.updateQuestion(metadata, this.questionId)
        }
      });
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

  getQuestionHtml(question) {
    const mcqTemplateConfig = {
      'mcqBody': '<div class=\'question-body\'><div class=\'mcq-title\'>{question}</div><div data-choice-interaction=\'response1\' class=\'mcq-vertical\'></div></div>'
    };
    const { mcqBody } = mcqTemplateConfig;
    const questionBody = mcqBody.replace('{templateClass}', this.editorState.templateId)
      .replace('{question}', question);
    const responseDeclaration = {
      maxScore: 1,
      response1: {
        cardinality: 'single',
        type: 'integer',
        'correctResponse': {
          value: this.editorState.answer,
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
    }
    return interactions;
  }

  createQustion(metadata) {
    this.questionService.createQuestion(metadata)
    .subscribe(
      (response: ServerResponse) => {
      if (response.result) {
        this.toasterService.success(this.resourceService.messages.smsg.m0070);
        /*const questionId = response.result.identifier;
        this.questionService.addQuestionToQuestionSet(this.questionSetId, questionId).
        subscribe(
          (res: ServerResponse) => {
          if(res.result) {
            this.router.navigateByUrl(`create/questionSet/${this.questionSetId}`);
            this.toasterService.success(this.resourceService.messages.smsg.m0072);
          }
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0030);
          console.log(err);
        });
        */
       const questionId = response.result.identifier;
       this.router.navigate([`create/questionSet/${this.questionSetId}/question`], { queryParams: { type: this.questionInteractionType, questionId: questionId } });
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
        /*
        const questionId = response.result.identifier;
        this.questionService.addQuestionToQuestionSet(this.questionSetId, questionId).
        subscribe(
          (res: ServerResponse) => {
          if(res.result) {
            this.router.navigateByUrl(`create/questionSet/${this.questionSetId}`);
            this.toasterService.success(this.resourceService.messages.smsg.m0072);
          }
        },
        (err: ServerResponse) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0030);
          console.log(err);
        }
        )
        */
       const questionId = response.result.identifier;
       this.router.navigate([`create/questionSet/${this.questionSetId}/question`], { queryParams: { type: this.questionInteractionType, questionId: questionId } });
      }
    },
    (err: ServerResponse) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0029);
      console.log(err);
    });
  }
}