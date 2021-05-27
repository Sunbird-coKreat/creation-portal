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
    this.setFormConfig();
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
  }

  onStatusChanges(event) {
    this.formStatus.emit(event);
  }
}
