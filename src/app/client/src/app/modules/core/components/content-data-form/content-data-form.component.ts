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
  @Output() formStatus = new EventEmitter<any>();

  /**
   * formInputData is to take input data's from form
   */
  public formInputData = {};

  constructor() {
  }

  setFormConfig() {
    _.forEach(this.formFieldProperties, (field) => {
      if (field.default) {
        this.formInputData[field.code] = field.default;
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
    });
    this.setFormConfig();
  }

  outputData(event) {
  }

  valueChanges(event) {
    _.forEach(this.formFieldProperties, (field) => {
      _.forEach(event, (eventValue, eventKey) => {
          if (field['code'] === eventKey) {
            if (eventValue !== '') {
              this.formInputData[field.code] = eventValue;
            }
          }
      });
    });
    console.log('formInputData', this.formInputData);
  }

  onStatusChanges(event) {
    this.formStatus.emit(event);
  }
}
