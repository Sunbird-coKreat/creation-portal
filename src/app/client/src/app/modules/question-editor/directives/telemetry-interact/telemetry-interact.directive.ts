import { Directive, Input, HostListener } from '@angular/core';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import * as _ from 'lodash-es';
export interface IInteractEventInput {
  'edata': IInteractEventEdata;
}
export interface IInteractEventEdata {
  'id': string;
  'type': string;
  'subtype'?: string;
  'pageid'?: string;
  'extra'?: {};
  'target'?: string;
  'plugin'?: string;
}

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[libTelemetryInteract]'
})
export class TelemetryInteractDirective {

  appTelemetryInteractData: IInteractEventInput;
  public telemetryService: EditorTelemetryService;
  @Input() telemetryInteractEdata: any;

  @HostListener('click', ['$event'])

  public onClick(e) {
    if (this.telemetryInteractEdata) {
      this.appTelemetryInteractData = {
        edata: this.telemetryInteractEdata
      };
      this.telemetryService.interact(this.appTelemetryInteractData);
    }
  }

  constructor(telemetryService: EditorTelemetryService) {
    this.telemetryService = telemetryService;
  }
}
