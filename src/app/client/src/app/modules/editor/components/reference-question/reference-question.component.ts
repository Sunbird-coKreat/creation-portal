import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-reference-question',
  templateUrl: './reference-question.component.html',
  styleUrls: ['./reference-question.component.scss']
})
export class ReferenceQuestionComponent implements OnInit, OnChanges {
  @Input() question: any;
  public editorState: any = {};
  public mediaArr: any = [];
  public videoShow = false;
  private initialized = false;
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
    this.editorState = {
      question : '',
      answer: '',
      solutions: ''
    };
    if (this.question && this.question.data) {
      this.editorState.question = this.question.data.model.editorState.question;
      this.editorState.answer = this.question.data.model.editorState.answer;
      if (!_.isEmpty(this.question.data.model.editorState.solutions)) {
        const editor_state = this.question.data.model.editorState;
        this.editorState.solutions = editor_state.solutions[0].value;
      } else {
        this.editorState.solutions = '';
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

}
