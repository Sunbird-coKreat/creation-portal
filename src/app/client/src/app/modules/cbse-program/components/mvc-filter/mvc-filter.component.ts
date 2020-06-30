import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-mvc-filter',
  templateUrl: './mvc-filter.component.html',
  styleUrls: ['./mvc-filter.component.scss']
})
export class MvcFilterComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() filters: any;
  @Input() activeFilterData: any;
  @Input() filterOpenStatus: Boolean;
  @Output() filterChangeEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('contentTypes') contentTypes: ElementRef;

  searchFilterForm: FormGroup;
  public isFilterShow: Boolean = false;
  private searchFilterLookup$: Subject<void> = new Subject();

  constructor(private sbFormBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    this.isFilterShow = this.filterOpenStatus;
  }

  ngAfterViewInit() {
    // if (this.filterOpenStatus) {
    //   // this.contentTypes.nativeElement.click(); // TODO
    // }
  }

  initializeForm() {
    this.searchFilterForm = this.sbFormBuilder.group({
      contentTypes: [this.activeFilterData.contentTypes],
      subjects: [this.activeFilterData.subjects],
      gradeLevels: [this.activeFilterData.gradeLevels],
      chapters: [this.activeFilterData.chapters ? this.activeFilterData.chapters : []],
      showAddedContent: this.activeFilterData.showAddedContent ? true : false
    });

    this.searchFilterForm.valueChanges.subscribe(() => {
      this.searchFilterLookup$.next();
    });

    this.searchFilterLookup$.pipe(
      debounceTime(1000),
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

}
