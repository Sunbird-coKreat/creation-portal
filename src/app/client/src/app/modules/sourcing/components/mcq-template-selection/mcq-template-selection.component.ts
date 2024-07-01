import { ConfigService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { mcqTemplateConfig } from './mcq-template-data';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-mcq-template-selection',
  templateUrl: './mcq-template-selection.component.html',
  styleUrls: ['./mcq-template-selection.component.scss']
})
export class McqTemplateSelectionComponent implements OnInit, OnDestroy {

  showButton = false;
  templateSelected;
  @Input() questionMetaData: any;
  @Input() sessionContext: any;
  @Input() telemetryEventsInput: any;
  @ViewChild('modal') private modal;
  @Output() templateSelection = new EventEmitter<any>();
  mcqTemplateConfig = mcqTemplateConfig.templateConfig;
  constructor(public configService: ConfigService, public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {
  }
  handleSubmit() {
    this.templateSelection.emit({ type: 'submit', template: this.templateSelected });
  }
  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

  getTelemetryInteractObject(id: string, type: string) {
    return this.programTelemetryService.getTelemetryInteractObject(id, type, '1.0',
    { l1: this.sessionContext.collection, l2: this.sessionContext.textBookUnitIdentifier, l3: this.sessionContext.resourceIdentifier});
  }

}
