import { Component, OnInit, Output, Input, EventEmitter, OnChanges, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { McqForm } from './../../class/McqForm';
import { ConfigService, IUserProfile, ToasterService, NavigationHelperService, ResourceService } from '@sunbird/shared';
import { UserService, ActionService, ProgramsService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { v4 as UUID } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SourcingService } from '../../services';
import { Validators, UntypedFormGroup, FormArray, UntypedFormBuilder, NgForm } from '@angular/forms';
import { mcqTemplateConfig } from '../mcq-template-selection/mcq-template-data';
import { ProgramTelemetryService } from '../../../program/services';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-mcq-creation',
  templateUrl: './mcq-creation.component.html',
  styleUrls: ['./mcq-creation.component.scss']
})
export class McqCreationComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sessionContext: any;
  @Input() telemetryEventsInput: any;
  @Input() questionMetaData: any;
  @Input() roles: any;
  @Output() questionStatus = new EventEmitter<any>();
  @Output() questionFormChangeStatus = new EventEmitter<any>();
  @ViewChild('author_names') authorName;
  @ViewChild('reuestChangeForm') ReuestChangeForm: NgForm;
  public userProfile: IUserProfile;
  public showPreview = false;
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public refresh = true;
  public mediaArr = [];
  public rejectComment: string;
  public userName: any;
  public formConfiguration: any;
  public textFields: Array<any>;
  public selectionFields: Array<any>;
  public multiSelectionFields: Array<any>;
  editorConfig: any;
  showTemplatePopup = false;
  showForm = false;
  templateDetails: any = {};
  initEditor = false;
  mcqForm: McqForm;
  body: any;
  optionBody: any = [];
  isEditorThrowingError: boolean;
  showFormError = false;
  isReadOnlyMode = false;
  learningOutcomeOptions = [];
  updateStatus = 'update';
  questionRejected = false;
  allFormFields: Array<any>;
  questionMetaForm: UntypedFormGroup;
  selectOutcomeOption = {};
  disableFormField: boolean;
  showRequestChangesPopup = false;
  commentCharLimit = 1000;
  componentConfiguration: any;
  videoShow: boolean;
  selectedSolutionType: string;
  selectedSolutionTypeIndex: string;
  showSolutionDropDown = true;
  showSolution = false;
  videoSolutionName: string;
  videoSolutionData: any;
  solutionUUID: string;
  videoThumbnail: string;
  solutionTypes: any = [{
    'type': 'html',
    'value': 'Text+Image'
  },
  {
    'type': 'video',
    'value': 'video'
  }];
  solutionValue: string;
  telemetryImpression: any;
  public telemetryPageId = 'mcq-creation';
  public editableFields = [];
  @Input() editableFieldsACL: any;

  constructor(public configService: ConfigService, private http: HttpClient,
    private userService: UserService, public actionService: ActionService,
    public toasterService: ToasterService, private cdr: ChangeDetectorRef, private sourcingService: SourcingService,
    private formBuilder: UntypedFormBuilder, public telemetryService: TelemetryService,
    public activeRoute: ActivatedRoute, public programTelemetryService: ProgramTelemetryService,
    public router: Router, private navigationHelperService: NavigationHelperService, private resourceService: ResourceService,
    private programsService: ProgramsService, private helperService: HelperService) {
  }

  initForm() {
    if (this.questionMetaData && this.questionMetaData.data) {
      const { responseDeclaration, templateId } = this.questionMetaData.data;
      const numberOfOptions = _.get(this.sessionContext.practiceSetConfig.config, 'No of options');
      const options = _.map(this.questionMetaData.data.editorState.options, option => ({ body: option.value.body }));
      const question = this.questionMetaData.data.editorState.question;
      this.mcqForm = new McqForm({
        question, options, answer: _.get(responseDeclaration, 'responseValue.correct_response.value')
      }, { templateId, numberOfOptions });

      if (!_.isEmpty(this.questionMetaData.data.editorState.solutions)) {
        this.solutionValue = this.questionMetaData.data.editorState.solutions[0].value;
        this.selectedSolutionType = this.questionMetaData.data.editorState.solutions[0].type;
        this.solutionUUID = this.questionMetaData.data.editorState.solutions[0].id;
        this.showSolutionDropDown = false;
        this.showSolution = true;

        if (this.selectedSolutionType === 'video') {
          const index = _.findIndex(this.questionMetaData.data.media, (o) => {
            return o.type === 'video' && o.id === this.questionMetaData.data.editorState.solutions[0].value;
          });
          this.videoSolutionName = this.questionMetaData.data.media[index].name;
          this.videoThumbnail = this.questionMetaData.data.media[index].thumbnail;
        }

      }
      if (this.questionMetaData.data.media) {
        this.mediaArr = this.questionMetaData.data.media;
      }

    } else {
      this.mcqForm = new McqForm({ question: '', options: [] }, {});
    }
    this.showForm = true;
  }

  ngOnInit() {
    const config: any = _.get(this.sessionContext.practiceSetConfig, 'config');
    this.telemetryPageId = this.sessionContext.telemetryPageId;
    this.telemetryEventsInput.telemetryPageId = this.telemetryPageId;
    this.editorConfig = {
      config,
      channel: this.sessionContext.channel
    };
    this.userName = this.setUserName();
    this.solutionUUID = UUID();
    this.isReadOnlyMode = this.sessionContext.isReadOnlyMode;
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = this.telemetryEventsInput.telemetryInteractCdata;
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
          type: this.configService.telemetryLabels.pageType.view || _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  ngOnChanges() {
    this.componentConfiguration = _.get(this.sessionContext, 'practiceSetConfig');
    this.rejectComment = '';
    if (this.questionMetaData && this.questionMetaData.data && this.questionMetaData.data.rejectComment) {
      this.rejectComment = this.questionMetaData.data.rejectComment;
    }
    if (this.questionMetaData && this.questionMetaData.data.templateId === 'NA') {
      this.showTemplatePopup = true;
    } else {
      this.initForm();
      this.manageFormConfiguration();
    }
  }

  canViewContentType() {
    return !!(this.sessionContext.currentRoles.includes('REVIEWER') && this.userService.userid !== _.get(this.questionMetaData, 'data.createdBy'));
  }

  handleTemplateSelection(event) {
    this.showTemplatePopup = false;
    if (event.type === 'submit') {
      this.questionMetaData.data.templateId = event.template.templateClass;
      this.initForm();
      this.manageFormConfiguration();
    } else {
      this.questionStatus.emit({ type: 'close' });
    }
  }

  setUserName() {
    let userName = '';
    if (this.userService.getUserProfileDataByKey('firstName')) {
      userName = this.userService.getUserProfileDataByKey('firstName');
    }
    if (this.userService.getUserProfileDataByKey('lastName')) {
      userName += (' ' + this.userService.getUserProfileDataByKey('firstName'));
    }
    return userName;
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
      this.mediaArr = _.filter(this.mediaArr, (item: any) => item.id !== this.solutionValue);
      console.log(this.mediaArr);
    }
    this.showSolutionDropDown = true;
    this.selectedSolutionType = '';
    this.solutionValue = '';
    this.videoThumbnail = '';
    this.showSolution = false;
  }

  handleReviewrStatus(event) {
    this.updateQuestion([{ key: 'status', value: event.status }, { key: 'rejectComment', value: event.rejectComment }]);
  }
  handleSubmit(formControl) {
    const optionValid = _.find(this.mcqForm.options, option =>
      (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
    if (optionValid || !this.mcqForm.answer || [undefined, ''].includes(this.mcqForm.question)) {
      this.showFormError = true;
      this.showPreview = false;
      // this.markFormGroupTouched(this.questionMetaForm);
      return;
    } else {
      if (this.questionMetaData.mode !== 'create') {
        this.updateQuestion();
      }
    }
  }
  handleEditorError(event) {
    this.isEditorThrowingError = event;
  }
  buttonTypeHandler(event) {
    this.updateStatus = event;
    if (event === 'preview') {
      if (this.sessionContext.resourceStatus === 'Draft') {
        this.handleSubmit(this.questionMetaForm);
      } else {
        this.showPreview = true;
      }
    } else if (event === 'edit') {
      this.refreshEditor();
      this.showPreview = false;
    } else {
      this.handleSubmit(this.questionMetaForm);
    }
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
  // getConvertedSVG(body) {
  //   const getLatex = (encodedMath) => {
  //     return this.http.get('https://www.wiris.net/demo/editor/render?mml=' + encodedMath + '&backgroundColor=%23fff&format=svg', {
  //       responseType: 'text'
  //     });
  //   };
  //   let latexBody;
  //   const isMathML = body.match(/((<math("[^"]*"|[^\/">])*)(.*?)<\/math>)/gi);
  //   if (isMathML && isMathML.length > 0) {
  //     latexBody = isMathML.map(math => {
  //       const encodedMath = encodeURIComponent(math);
  //       return getLatex(encodedMath);
  //     });
  //   }
  //   if (latexBody) {
  //     return forkJoin(latexBody).pipe(
  //       map((res) => {
  //         _.forEach(res, (latex, i) => {
  //           body = latex.includes('Error') ? body : body.replace(isMathML[i], latex);
  //         });
  //         return body;
  //       })
  //     );
  //   } else {
  //     return of(body);
  //   }
  // }

  /**
   * @param optionalParams  {Array of Objects }  -Key and Value to add in metadata
   */
  updateQuestion(optionalParams?: Array<{}>) {
    forkJoin([this.getConvertedLatex(this.mcqForm.question), ...this.mcqForm.options.map(option => this.getConvertedLatex(option.body))])
      .subscribe((res) => {
        this.body = res[0]; // question with latex
        this.optionBody = res.slice(1).map((option, i) => { // options with latex
          return { body: res[i + 1] };
        });
        const questionData = this.getHtml(this.body, this.optionBody);
        const correct_answer = this.mcqForm.answer;
        let resindex;
        const options = _.map(this.mcqForm.options, (opt, key) => {
          resindex = Number(key);
          if (Number(correct_answer) === key) {
            return { 'answer': true, value: { 'type': 'text', 'body': opt.body, 'resvalue': resindex, 'resindex': resindex } };
          } else {
            return { 'answer': false, value: { 'type': 'text', 'body': opt.body, 'resvalue': resindex, 'resindex': resindex  } };
          }
        });

        let metadata = {
          'code': UUID(),
          'category': this.sessionContext.questionType.toUpperCase(),
          'templateId': this.mcqForm.templateId,
          'name': this.sessionContext.questionType + '_' + this.sessionContext.framework,
          'body': questionData.body,
          'editorState' : {
            'question': this.mcqForm.question,
            'options': options
          },
          'options': options,
          'responseDeclaration': questionData.responseDeclaration,
          // 'qlevel': this.mcqForm.difficultyLevel,
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

        metadata = _.pickBy(_.assign(metadata, this.questionMetaForm.value), _.identity);
        const req = {
          url: this.configService.urlConFig.URLS.ASSESSMENT.UPDATE + '/' + this.questionMetaData.data.identifier,
          data: {
            'request': {
              'assessment_item': {
                'objectType': 'AssessmentItem',
                'metadata': metadata
              }
            }
          }
        };

        if (optionalParams) {
          _.forEach(optionalParams, (param) => {
            req.data.request.assessment_item.metadata[param.key] = param.value;
            if (param.key === 'status') {
              this.updateStatus = param.value;
            }
            if (param.key === 'rejectComment' && param.value !== '') {
              this.questionRejected = true;
            }
          });
        } else {
          req.data.request.assessment_item.metadata['rejectComment'] = '';
        }

        if (_.isUndefined(this.solutionValue) || _.isEmpty(this.solutionValue)) {
          req.data.request.assessment_item.metadata['solutions'] = '';
        }

        this.actionService.patch(req).pipe(catchError(err => {
          const errInfo = {
            errorMsg: 'MCQ Question updation failed',
            telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryEventsInput.telemetryInteractCdata,
            env : this.activeRoute.snapshot.data.telemetry.env, request: req };
          return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
        })).subscribe((apiRes) => {
          if (this.updateStatus === 'Live') {
            this.toasterService.success('Question Accepted');
          } else if (this.updateStatus === 'Draft' && this.questionRejected) {
            this.toasterService.success('Question Rejected');
            this.showRequestChangesPopup = false;
            this.questionMetaData.data.rejectComment = this.rejectComment;
          } else if (this.updateStatus === 'preview') {
            this.showPreview = true;
          }
          // tslint:disable-next-line:max-line-length
          this.questionStatus.emit({ 'status': 'success', 'type': this.updateStatus, 'identifier': apiRes.result.node_id, 'isRejectedQuestion' : this.questionRejected });
        });
      });
  }

  getHtml(question, options) {
    const { mcqBody, optionTemplate } = mcqTemplateConfig;
    const optionsBody = _.map(options, data => optionTemplate.replace('{option}', data.body)) // passion option which has latex
      .map((data, index) => data.replace('{value}', index)).join('');
    const questionBody = mcqBody.replace('{templateClass}', this.mcqForm.templateId)
      .replace('{question}', question).replace('{optionList}', optionsBody); // passion question which has latex
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
  private refreshEditor() {
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  manageFormConfiguration() {
    const controller = {};
    this.questionMetaForm = this.formBuilder.group(controller);
    if (this.questionMetaData) {
      this.formConfiguration = this.componentConfiguration.config.formConfiguration;
      this.allFormFields = _.filter(this.formConfiguration, {'visible': true});
      this.textFields = _.filter(this.formConfiguration, {'inputType': 'text', 'visible': true});
      // tslint:disable-next-line:max-line-length
      this.disableFormField = (this.sessionContext.currentRoles.includes('CONTRIBUTOR') && this.sessionContext.resourceStatus === 'Draft') ? false : true ;
      const formFields = _.map(this.formConfiguration, (formData) => {
        if (!formData.defaultValue) {
          return formData.code;
        }
        this.selectOutcomeOption[formData.code] = formData.defaultValue;
      });

      this.selectOutcomeOption['license'] = this.sessionContext.licencesOptions;
      if ( _.isArray(this.sessionContext.topic)) {
        this.sessionContext.topic = _.first(this.sessionContext.topic);
      }
      if (this.sessionContext.topic) {
        // tslint:disable-next-line:max-line-length
        this.sessionContext.topic = _.isArray(this.sessionContext.topic) ? this.sessionContext.topic : _.split(this.sessionContext.topic, ',');
      }
      if (_.isUndefined(this.sessionContext.topicList)) {
        this.sessionContext.topicList = _.get(_.find(this.sessionContext.frameworkData, { code: 'topic' }), 'terms');
      }
      const topicTerm = _.find(this.sessionContext.topicList, { name: _.first(this.sessionContext.topic) });
      if (topicTerm && topicTerm.associations) {
        this.selectOutcomeOption['learningOutcome'] = _.map(topicTerm.associations, (learningOutcome) => {
          return learningOutcome.name;
        });
      }
      _.map(this.allFormFields, (obj) => {
        const code = obj.code;
        const preSavedValues = {};
        if (this.questionMetaData) {
          if (obj.inputType === 'select') {
            // tslint:disable-next-line:max-line-length
            preSavedValues[code] = (this.questionMetaData.data[code]) ? (_.isArray(this.questionMetaData.data[code]) ? this.questionMetaData.data[code][0] : this.questionMetaData.data[code]) : '';
            // tslint:disable-next-line:max-line-length
            obj.required ? controller[obj.code] = [preSavedValues[code], [Validators.required]] : controller[obj.code] = preSavedValues[code];
          } else if (obj.inputType === 'multiselect') {
            // tslint:disable-next-line:max-line-length
            preSavedValues[code] = (this.questionMetaData.data[code] && this.questionMetaData.data[code].length) ? this.questionMetaData.data[code] : [];
            // tslint:disable-next-line:max-line-length
            obj.required ? controller[obj.code] = [preSavedValues[code], [Validators.required]] : controller[obj.code] = [preSavedValues[code]];
          } else if (obj.inputType === 'text') {
            if (obj.dataType === 'list') {
              const listValue = (this.questionMetaData.data[code]) ? this.questionMetaData.data[code] : '';
              preSavedValues[code] = _.isArray(listValue) ? listValue.toString() : '';
            } else {
              preSavedValues[code] = (this.questionMetaData.data[code]) ? this.questionMetaData.data[code] : '';
            }
            // tslint:disable-next-line:max-line-length
            obj.required ? controller[obj.code] = [{value: preSavedValues[code], disabled: this.disableFormField}, Validators.required] : controller[obj.code] = preSavedValues[code];
          } else if (obj.inputType === 'checkbox') {
            // tslint:disable-next-line:max-line-length
            preSavedValues[code] = (this.questionMetaData.data[code]) ? this.questionMetaData.data[code] : false;
            // tslint:disable-next-line:max-line-length
            obj.required ? controller[obj.code] = [{value:preSavedValues[code], disabled: this.questionMetaData.data[code]}, [Validators.requiredTrue]] : controller[obj.code] = preSavedValues[code];
          }
        }
      });
      this.editableFields = this.helperService.getEditableFields(this.editableFieldsACL, this.allFormFields, this.questionMetaData);
      this.questionMetaForm = this.formBuilder.group(controller);
      this.onFormValueChange();
    }
  }

  changePolicyCheckValue (event) {
    if ( event.target.checked ) {
      this.questionMetaForm.controls.contentPolicyCheck.setValue(true);
    }
    else {
      this.questionMetaForm.controls.contentPolicyCheck.setValue(false);
    }
  }

  markFormGroupTouched(formGroup: UntypedFormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  requestChanges() {
    if (this.ReuestChangeForm.value.rejectComment) {
      this.handleReviewrStatus({ 'status' : 'Draft', 'rejectComment':  this.ReuestChangeForm.value.rejectComment});
    }
  }

  closeRequestChangeModal() {
    this.showRequestChangesPopup = false;
    this.rejectComment = this.questionMetaData.data.rejectComment ? this.questionMetaData.data.rejectComment : '';
  }

  onFormValueChange(isQuestionChanged?: boolean) {
    if (isQuestionChanged) {
      this.questionFormChangeStatus.emit({'status': false});
      return false;
    }

    this.questionMetaForm.valueChanges.subscribe(() => {
      this.questionFormChangeStatus.emit({'status': false});
    });
  }

  canReviewContent() {
    return !!(this.sessionContext.currentRoles.includes('REVIEWER')
            && this.sessionContext.resourceStatus === 'Review'
            && this.router.url.includes('/contribute')
            && this.programsService.checkForContentSubmissionDate(this.sessionContext.programContext)
            && this.userService.userid !== _.get(this.sessionContext, 'contentMetadata.createdBy'));
  }

  getMetaData() {
    return this.helperService.getFormattedData(this.questionMetaForm.value, this.textFields);
  }

  getTelemetryInteractObject(id: string, type: string) {
    return this.programTelemetryService.getTelemetryInteractObject(id, type, '1.0',
    { l1: this.sessionContext.collection, l2: this.sessionContext.textBookUnitIdentifier, l3: this.sessionContext.resourceIdentifier});
  }

  validateCurrentQuestion() {
    const optionInvalid = _.find(this.mcqForm.options, option =>
      (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
    if (optionInvalid || !this.mcqForm.answer || [undefined, ''].includes(this.mcqForm.question)) {
      this.showFormError = true;
      this.showPreview = false;
      return false;
    } else {
      return true;
    }
  }
}
