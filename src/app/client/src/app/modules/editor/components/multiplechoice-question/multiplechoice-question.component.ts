import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { McqForm } from '../../../cbse-program';
@Component({
  selector: 'app-multiplechoice-question',
  templateUrl: './multiplechoice-question.component.html',
  styleUrls: ['./multiplechoice-question.component.scss']
})
export class MultiplechoiceQuestionComponent implements OnInit, OnChanges {
  @Input() question: any;
  private initialized = false;
  public mcqForm: McqForm;
  public solutionValue: string;
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public mediaArr = [];
  public editorConfig: any = {
    'config': {
      'tenantName': '',
      'assetConfig': {
        'image': {
          'size': '50',
          'accepted': 'jpeg, png, jpg'
        },
        'video': {
          'size': '50',
          'accepted': 'pdf, mp4, webm, youtube'
        }
      },
      'solutionType': [
        'Video',
        'Text & image'
      ],
      'No of options': 4,
      'questionCategory': [
        'vsa',
        'sa',
        'ls',
        'mcq',
        'curiosity'
      ],
      'formConfiguration': [
        {
          'code': 'learningOutcome',
          'name': 'LearningOutcome',
          'label': 'Learning Outcome',
          'visible': true,
          'dataType': 'list',
          'editable': true,
          'required': false,
          'inputType': 'multiselect',
          'description': 'Learning Outcomes For The Content',
          'placeholder': 'Select Learning Outcomes'
        },
        {
          'code': 'attributions',
          'name': 'Attributions',
          'label': 'Attributions',
          'visible': true,
          'dataType': 'list',
          'editable': true,
          'helpText': 'If you have relied on another work to create this Content, provide the name of that creator and the source of that work.',
          'required': false,
          'inputType': 'text',
          'description': 'Enter Attributions',
          'placeholder': 'Enter Attributions'
        },
        {
          'code': 'copyright',
          'name': 'Copyright',
          'label': 'Copyright and Year',
          'visible': true,
          'dataType': 'text',
          'editable': true,
          'helpText': 'If you are an individual, creating original Content, you are the copyright holder. If you are creating Content on behalf of an organisation, the organisation may be the copyright holder. Please fill as <Name of copyright holder>, <Year of publication>',
          'required': true,
          'inputType': 'text',
          'description': 'Enter Copyright and Year',
          'placeholder': 'Enter Copyright and Year'
        },
        {
          'code': 'creator',
          'name': 'Author',
          'label': 'Author',
          'visible': true,
          'dataType': 'text',
          'editable': true,
          'helpText': 'Provide name of creator of this Content.',
          'required': true,
          'inputType': 'text',
          'description': 'Enter The Author Name',
          'placeholder': 'Enter Author Name'
        },
        {
          'code': 'license',
          'name': 'License',
          'label': 'License',
          'visible': true,
          'dataType': 'list',
          'editable': true,
          'helpText': 'Choose the most appropriate Creative Commons License for this Content',
          'required': true,
          'inputType': 'select',
          'description': 'License For The Content',
          'placeholder': 'Select License'
        },
        {
          'code': 'contentPolicyCheck',
          'name': 'Content Policy Check',
          'visible': true,
          'dataType': 'boolean',
          'editable': false,
          'required': true,
          'inputType': 'checkbox'
        }
      ],
      'resourceTitleLength': '200'
    },
    'channel': 'sunbird'
  };

  constructor() { }

  ngOnInit() {
    this.initialized = true;
    this.initialize();
  }

  ngOnChanges() {
    if (this.initialized) {
      this.initialize();
    }
  }

  initialize() {
    if (this.question && this.question.data) {
      const { responseDeclaration, templateId, editorState } = this.question.data.model;
      const numberOfOptions = _.get(this.editorConfig.config, 'No of options');
      const options = _.map(editorState.options, option => ({ body: option.value.body }));
      const question = editorState.question;
      this.mcqForm = new McqForm({
        question, options, answer: _.get(responseDeclaration, 'responseValue.correct_response.value')
      }, { templateId, numberOfOptions });
      if (!_.isEmpty(editorState.solutions)) {
        this.solutionValue = editorState.solutions[0].value;
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

}
