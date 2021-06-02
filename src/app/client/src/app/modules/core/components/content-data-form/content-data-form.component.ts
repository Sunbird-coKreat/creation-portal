import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-content-data-form',
  templateUrl: './content-data-form.component.html',
  styleUrls: ['./content-data-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentDataFormComponent {
  @Input() formFieldProperties: any;
  @Output() formStatus = new EventEmitter<any>();
  @Output() formInputData = new EventEmitter<any>();

  valueChanges(event) {
    this.formInputData.emit(event);
  }

  onStatusChanges(event) {
    this.formStatus.emit(event);
  }
}
