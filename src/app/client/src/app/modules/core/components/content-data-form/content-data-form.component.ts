import { Component, EventEmitter, Input, OnInit, Output, OnChanges, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-data-form',
  templateUrl: './content-data-form.component.html',
  styleUrls: ['./content-data-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentDataFormComponent implements OnInit {
  @Input() formFieldProperties: any;
  @Input() categoryMasterList: any;
  @Output() formStatus = new EventEmitter<any>();

  /**
   * formInputData is to take input data's from form
   */
  public formInputData = {};
  /**
   * categoryList is category list of dropdown values
   */
  public categoryList: {};

  constructor() {
    this.categoryList = {};
  }

  setFormConfig() {
    _.forEach(this.formFieldProperties, (field) => {
      if (field.defaultValue) {
        field['default'] = field.defaultValue;
        this.formInputData[field.code] = field.defaultValue;
      }
    });
  }

  ngOnInit() {
    this.formFieldProperties.forEach(formProperty => {
      if (formProperty.code === 'name') {
        formProperty.validations = [
          { type: 'maxLength', value: '50', message: 'Input is Exceeded'},
          {
            type: 'required', message: 'Name is required'
          }
      ];
      }
      if (formProperty.code === 'additionalCategories') {
        formProperty.inputType = 'nestedselect';
      }
      if (formProperty.code === 'contentPolicyCheck') {
        formProperty.dataType = 'boolean';
      }
    });
    this.setFormConfig();
  }

  valueChanges(event) {
    _.forEach(this.formFieldProperties, (field) => {
      _.forEach(event, (eventValue, eventKey) => {
          if (field['code'] === eventKey) {
            field['defaultValue'] = eventValue;
            this.formInputData[field.code] = field.defaultValue;
          }
      });
    });
    // todo : remove this console log later
    console.log('formInputData', this.formInputData);
  }

  outputData($event) {
  }

  onStatusChanges(event) {
    this.formStatus.emit(event);
  }
}