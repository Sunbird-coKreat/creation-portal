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
  @Output() formInputData = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  valueChanges(event) {
    this.formInputData.emit(event);
  }

  onStatusChanges(event) {
    this.formStatus.emit(event);
  }
}
