import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-mvc-filter',
  templateUrl: './mvc-filter.component.html',
  styleUrls: ['./mvc-filter.component.scss']
})
export class MvcFilterComponent implements OnInit, OnChanges {
  @Input() sessionContext: any;
  @Input() filters: any;
  @Input() activeFilterData: any;
  @Input() filterOpenStatus: Boolean;
  @Output() filterChangeEvent: EventEmitter<any> = new EventEmitter();
  searchFilterForm: UntypedFormGroup;
  public isFilterShow: Boolean = false;
  public telemetryPageId: string;

  constructor( private sbFormBuilder: UntypedFormBuilder, public resourceService: ResourceService,
    public programTelemetryService: ProgramTelemetryService, public configService: ConfigService) { }

  ngOnInit() {
    this.telemetryPageId = this.sessionContext.telemetryPageId;
    this.initializeForm();
  }

  ngOnChanges() {
    this.isFilterShow = this.filterOpenStatus;
  }

  initializeForm() {
    this.searchFilterForm = this.sbFormBuilder.group({
      contentType: [this.activeFilterData.contentType],
      subject: [this.activeFilterData.subject],
      gradeLevel: [this.activeFilterData.gradeLevel],
      chapter: [this.activeFilterData.chapter ? this.activeFilterData.chapter : []],
    });
  }

  showfilter() {
    this.isFilterShow = !this.isFilterShow;
    this.filterChangeEvent.emit({
      action: 'filterStatusChange',
      filterStatus: this.isFilterShow
    });
  }

  resetFilter() {
    this.searchFilterForm.reset();
    this.applyFilter();
  }

  applyFilter() {
    this.filterChangeEvent.emit({
      action: 'filterDataChange',
      filters: this.searchFilterForm.value
    });
  }

  getTelemetryInteractCdata(type, id) {
    return [ ...this.sessionContext.telemetryInteractCdata, { type: type, id: _.toString(id)} ];
  }
}
