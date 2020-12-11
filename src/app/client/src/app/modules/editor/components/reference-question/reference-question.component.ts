import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { questionEditorConfig } from '../../editor.config';
import {EditorService} from '../../services';
import { forkJoin, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService} from '@sunbird/shared';
@Component({
  selector: 'app-reference-question',
  templateUrl: './reference-question.component.html',
  styleUrls: ['./reference-question.component.scss']
})
export class ReferenceQuestionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() questionMetaData: any;
  public editorConfig: any = questionEditorConfig;
  public editorState: any = {};
  public showPreview: Boolean = false;
  private initialized = false;
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
  solutionTypes: any = [{
    'type': 'html',
    'value': 'Text+Image'
  },
  {
    'type': 'video',
    'value': 'video'
  }];
  private subscription: Subscription;


  constructor(private editorService: EditorService, private http: HttpClient, private configService: ConfigService) { }

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
    this.editorState = { question: '', answer: '', solutions: '' };
    if (this.questionMetaData) {
      this.editorState.question = this.questionMetaData.editorState.question;
      this.editorState.answer = this.questionMetaData.editorState.answer;
      this.mediaArr = this.questionMetaData.media || [];
      if (!_.isEmpty(this.questionMetaData.editorState.solutions)) {
        const editor_state = this.questionMetaData.editorState;
        this.editorState.solutions = editor_state.solutions[0].value;
        this.solutionUUID = editor_state.solutions[0].id;
        this.selectedSolutionType = editor_state.solutions[0].type;
        this.showSolutionDropDown = false;
        this.showSolution = true;
        if (this.selectedSolutionType === 'video') {
          const index = _.findIndex(this.questionMetaData.media, (o) => {
            return o.type === 'video' && o.id === editor_state.solutions[0].value;
          });
          this.videoSolutionName = this.questionMetaData.media[index].name;
          this.videoThumbnail = this.questionMetaData.media[index].thumbnail;
        }
      } else {
        this.editorState.solutions = '';
        this.selectedSolutionType = '';
      }
    }
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

  buttonTypeHandler(event) {
    if (event === 'preview') {
      this.showPreview = true;
    } else if (event === 'edit') {
      this.showPreview = false;
    } else {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    if (this.editorState.question !== ''
      && this.editorState.answer !== '') {
      this.showFormError = false;
      this.saveContent();
    } else {
      this.showFormError = true;
    }
  }

  saveContent(optionalParams?: Array<{}>) {
    forkJoin([this.getConvertedLatex(this.editorState.question), this.getConvertedLatex(this.editorState.answer)])
      .subscribe((res) => {
        const rendererBody = res[0];
        const rendererAnswer = res[1];
        const option = {
          url: '',
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': {
                  'editorState': {
                    'question': this.editorState.question,
                    'answer': this.editorState.answer
                  },
                  'body': rendererBody,
                  'responseDeclaration': {
                    'responseValue': {
                      'cardinality': 'single',
                      'type': 'string',
                      'correct_response': {
                        'value': rendererAnswer
                      }
                    }
                  },
                  'status': 'Draft',
                  'name': '',
                  'type': 'reference',
                  'code': UUID.UUID(),
                  'template_id': 'NA',
                  'media': this.mediaArr
                }
              }
            }
          }
        };

        let solutionObj: any;
        if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
          solutionObj = {};
          solutionObj.id = this.solutionUUID;
          solutionObj.type = this.selectedSolutionType;
          solutionObj.value = this.editorState.solutions;
          option.data.request.assessment_item.metadata.editorState['solutions'] = [solutionObj];
          option.data.request.assessment_item.metadata['solutions'] = [solutionObj];
        }

        if (_.isEmpty(this.editorState.solutions)) {
          option.data.request.assessment_item.metadata['solutions'] = '';
        }

        // TODO: Call Question save API
        console.log(option);
      });
  }

  getConvertedLatex(body) {
    const getLatex = (encodedMath) => {
      return this.http.get('https://www.wiris.net/demo/editor/mathml2latex?mml=' + encodedMath, {
        responseType: 'text'
      });
    };
    let latexBody;
    const isMathML = body && body.match(/((<math("[^"]*"|[^\/">])*)(.*?)<\/math>)/gi);
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

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

}
