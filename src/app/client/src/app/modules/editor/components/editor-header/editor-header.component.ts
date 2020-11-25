import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss']
})
export class EditorHeaderComponent implements OnInit {

  @Input() toolbarConfig: any;
  @Output() toolbarEmitter = new EventEmitter<any>();

  formFieldProperties = [
    {
        'code': 'name',
        'editable': true,
        'displayProperty': 'Editable',
        'dataType': 'text',
        'renderingHints': {
            'semanticColumnWidth': 'twelve'
        },
        'description': 'Name',
        'index': 1,
        'label': 'Name',
        'required': true,
        'name': 'Name',
        'inputType': 'text',
        'placeholder': 'Name'
    },
    {
        'code': 'learningOutcome',
        'dataType': 'list',
        'description': '',
        'editable': true,
        'index': 2,
        'inputType': 'select',
        'label': 'Learning Outcome :',
        'name': 'Learning Outcome :',
        'placeholder': 'Select Learning Outcome',
        'depends': [
            'topic'
        ],
        'renderingHints': {},
        'required': false
    },
    {
        'code': 'attributions',
        'dataType': 'list',
        'description': 'Attributions',
        'editable': true,
        'index': 3,
        'inputType': 'text',
        'label': 'Attributions',
        'name': 'attribution',
        'placeholder': '',
        'tooltip': 'If you have relied on another work to create this content, provide the name of that creator and the source of that work.',
        'renderingHints': {},
        'required': false
    },
    {
        'code': 'author',
        'dataType': 'text',
        'description': 'Author',
        'editable': true,
        'index': 4,
        'inputType': 'text',
        'label': 'Author',
        'name': 'Author',
        'placeholder': 'Author',
        'tooltip': 'Provide name of creator of this content.',
        'renderingHints': {},
        'required': false
    },
    {
        'code': 'copyright',
        'dataType': 'text',
        'description': 'Copyright',
        'editable': true,
        'index': 5,
        'inputType': 'text',
        'label': 'Copyright and Year',
        'name': 'Copyright',
        'placeholder': 'Copyright',
        'tooltip': 'If you are an individual, creating original content, you are the copyright holder. If you are creating this course content on behalf of an organisation, the organisation may be the copyright holder. ',
        'renderingHints': {},
        'required': true
    },
    {
        'code': 'license',
        'visible': true,
        'editable': true,
        'displayProperty': 'Editable',
        'dataType': 'text',
        'renderingHints': {
            'semanticColumnWidth': 'six'
        },
        'description': 'Subject of the Content to use to teach',
        'index': 6,
        'label': 'License:',
        'required': true,
        'name': 'license',
        'inputType': 'select',
        'placeholder': 'license',
        'tooltip': 'Choose the more appropriate Creative commons license for this Content. '
        }, {
          'code': 'additionalCategories',
          'visible': true,
          'editable': true,
          'displayProperty': 'Editable',
          'dataType': 'list',
          'renderingHints': {
            'semanticColumnWidth': 'six'
          },
          'description': 'Subject of the Content to use to teach',
          'index': 7,
          'label': 'Content Additional Categories',
          'required': false,
          'name': 'additionalCategories',
          'inputType': 'multiSelect',
          'placeholder': 'Content Additional Categories'
        }
        ];
  constructor() { }

  ngOnInit() {

  }

  buttonEmitter(event, button) {
    this.toolbarEmitter.emit({event, button});
  }

}
