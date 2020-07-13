import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-mvc-filter',
  templateUrl: './mvc-filter.component.html',
  styleUrls: ['./mvc-filter.component.scss']
})
export class MvcFilterComponent implements OnInit, OnChanges {
  @Input() filters: any;
  @Input() activeFilterData: any;
  @Input() filterOpenStatus: Boolean;
  @Output() filterChangeEvent: EventEmitter<any> = new EventEmitter();
  searchFilterForm: FormGroup;
  public showAddedContent: Boolean = false;
  public isFilterShow: Boolean = false;
  private searchFilterLookup$: Subject<void> = new Subject();

  constructor(private sbFormBuilder: FormBuilder, public resourceService: ResourceService) { }

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
    this.searchFilterForm.valueChanges.subscribe(() => {
      this.searchFilterLookup$.next();
    });
    this.searchFilterLookup$.pipe(
      // debounceTime(500),
      // distinctUntilChanged(_.isEqual)
    ).subscribe(() => {
      this.filterChangeEvent.emit({
        action: 'filterDataChange',
        filters: this.searchFilterForm.value
      });
    });
  }

  showfilter() {
    this.isFilterShow = !this.isFilterShow;
    this.filterChangeEvent.emit({
      action: 'filterStatusChange',
      filterStatus: this.isFilterShow
    });
  }

  onShowAddedContentChange() {
    this.filterChangeEvent.emit({
      action: 'showAddedContent',
      status: this.showAddedContent
    });
  }

}
