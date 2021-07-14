import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'lib-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {

  @Input() templateList: any;
  @ViewChild('modal') private modal;
  @Output() templateSelection = new EventEmitter<any>();
  public showButton = false;
  public templateSelected;

  constructor(public telemetryService: EditorTelemetryService,  public configService: ConfigService) { }

  ngOnInit() { }

  next() {
    this.templateSelection.emit(this.templateSelected);
  }

  onClosePopup() {
    this.modal.deny();
    this.templateSelection.emit({ type: 'close' });
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
