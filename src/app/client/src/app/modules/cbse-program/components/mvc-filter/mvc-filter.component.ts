import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ResourceService } from '@sunbird/shared';
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
  searchFilterForm: FormGroup;
  public isFilterShow: Boolean = false;

  constructor( private sbFormBuilder: FormBuilder, public resourceService: ResourceService,
    public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {
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
}
