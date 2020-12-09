import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { McqForm } from '../../../cbse-program';
import { questionEditorConfig } from '../../editor.config';
import {EditorService} from '../../services';
import { QuestionService } from '../../services/question/question.service';
import { Subscription } from 'rxjs';
import { forkJoin, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-multiplechoice-question',
  templateUrl: './multiplechoice-question.component.html',
  styleUrls: ['./multiplechoice-question.component.scss']
})
export class MultiplechoiceQuestionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() questionMetaData: any;
  public editorConfig: any = questionEditorConfig;
  private initialized = false;
  public mcqForm: McqForm;
  public solutionValue: string;
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public mediaArr = [];
  public showFormError: Boolean = false;
  public videoShow = false;
  selectedSolutionType: string;
  selectedSolutionTypeIndex: string;
  showSolutionDropDown = true;
  showSolution = false;
  videoSolutionName: string;
  videoSolutionData: any;
  videoThumbnail: string;
  solutionUUID: string;
  solutionTypes: any = [{
    'type': 'html',
    'value': 'Text+Image'
  },
  {
    'type': 'video',
    'value': 'video'
  }];
  private subscription: Subscription;
  body: any;
  optionBody: any = [];

  constructor(private editorService: EditorService, private http: HttpClient,
    private questionService: QuestionService, public route:ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.initialized = true;
    this.solutionUUID = UUID.UUID();
    this.initialize();
    this.subscription = this.editorService.getQuestionStream$()
    .subscribe((value: any) => {
        this.buttonTypeHandler(value);
    });
  }

  ngOnChanges() {
    if (this.initialized) {
      this.initialize();
    }
  }

  initialize() {
    if (this.questionMetaData) {
      const { responseDeclaration, templateId, editorState } = this.questionMetaData;
      const numberOfOptions = _.get(this.editorConfig.config, 'No of options');
      const options = _.map(editorState.options, option => ({ body: option.value.body }));
      const question = editorState.question;
      this.mediaArr = this.questionMetaData.media || [];
      this.mcqForm = new McqForm({
        question, options, answer: _.get(responseDeclaration, 'responseValue.correct_response.value')
      }, { templateId, numberOfOptions });
      if (!_.isEmpty(editorState.solutions)) {
        this.solutionValue = editorState.solutions[0].value;
        this.selectedSolutionType = editorState.solutions[0].type;
        this.solutionUUID = editorState.solutions[0].id;
        this.showSolutionDropDown = false;
        this.showSolution = true;
        if (this.selectedSolutionType === 'video') {
          const index = _.findIndex(this.questionMetaData.media, (o) => {
            return o.type === 'video' && o.id === editorState.solutions[0].value;
          });
          this.videoSolutionName = this.questionMetaData.media[index].name;
          this.videoThumbnail = this.questionMetaData.media[index].thumbnail;
        }

      }
    } else {
      this.mcqForm = new McqForm({ question: '', options: [] }, {});
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

  handleEditorError(event: any) { }

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
      this.solutionValue = event.identifier;
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
      this.mediaArr = _.filter(this.mediaArr, (item: any) => item.id !== this.solutionValue);
      console.log(this.mediaArr);
    }
    this.showSolutionDropDown = true;
    this.selectedSolutionType = '';
    this.solutionValue = '';
    this.videoThumbnail = '';
    this.showSolution = false;
  }

  buttonTypeHandler(action) {
    if (action === 'preview') {
      // if (this.sessionContext.resourceStatus === 'Draft') {
      //   this.handleSubmit(this.questionMetaForm);
      // } else {
      //   this.showPreview = true;
      // }
    } else if (action === 'edit') {
      // this.refreshEditor();
      // this.showPreview = false;
    } else {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    const optionValid = _.find(this.mcqForm.options, option =>
      (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
    if (optionValid || !this.mcqForm.answer || [undefined, ''].includes(this.mcqForm.question)) {
      this.showFormError = true;
      return;
    } else {
      // TODO: Save question
      console.log(this.mcqForm);
      this.updateQuestion();
    }
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  updateQuestion(optionalParams?: Array<{}>) {
    forkJoin([this.getConvertedLatex(this.mcqForm.question), ...this.mcqForm.options.map(option => this.getConvertedLatex(option.body))])
      .subscribe((res) => {
        this.body = res[0]; // question with latex
        const questionData = this.getQuestionHtml(this.body);
        const correct_answer = this.mcqForm.answer;
        let resindex;
        const options = _.map(this.mcqForm.options, (opt, key) => {
          resindex = Number(key);
          if (Number(correct_answer) === key) {
            return { 'answer': true, value: {'body': opt.body, 'value': resindex} };
          } else {
            return { 'answer': false, value: {'body': opt.body, 'value': resindex} };
          }
        });
        let metadata = {
          'code': UUID.UUID(),
          'category': 'MCQ', // hardcoded value need to change it later
          'templateId': this.mcqForm.templateId,
          'name': 'question1', //hardcoded value need to change it later
          'body': questionData.body,
          'editorState' : {
            'question': this.mcqForm.question,
            'options': options
          },
          'interactions' : {
            'response1': {
              'type': 'choice',
              'options': [options]
            }
          },
          'responseDeclaration': questionData.responseDeclaration,
          // 'qlevel': this.mcqForm.difficultyLevel,
          'weightage': 1,
          'maxScore': 1, // Number(this.mcqForm.maxScore),
          'status': 'Draft',
          'media': this.mediaArr,
          'type': 'mcq',
        };
        let solutionObj: any;
        if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
          solutionObj = {};
          solutionObj.id = this.solutionUUID;
          solutionObj.type = this.selectedSolutionType;
          solutionObj.value = this.solutionValue;
          metadata.editorState['solutions'] = [solutionObj];
          metadata['solutions'] = [solutionObj];
        }
        this.questionService.createQuestion(metadata)
        .subscribe((response) => {
          console.log("response",response);
          if (response) {
            return this.router.navigate(['/create/questionSet/do_21212']); // hardcoded value need to change it later
          }
        });
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
      'mcqBody': '<div class=\'{templateClass} question-body\'><div class=\'mcq-title\'>{question}</div><div data-choice-interaction=\'response1\' class=\'mcq-vertical\'></div></div>'
    };
    const { mcqBody } = mcqTemplateConfig;
    const questionBody = mcqBody.replace('{templateClass}', this.mcqForm.templateId)
      .replace('{question}', question);
    const responseDeclaration = {
      responseValue: {
        cardinality: 'single',
        type: 'integer',
        'correct_response': {
          value: this.mcqForm.answer
        }
      }
    };
    return {
      body: questionBody,
      responseDeclaration: responseDeclaration,
    };
  }
}
