import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { TreeService } from '../../services/tree/tree.service';
import { EditorService } from '../../services/editor/editor.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
  selector: 'lib-library-filter',
  templateUrl: './library-filter.component.html',
  styleUrls: ['./library-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LibraryFilterComponent implements OnInit, OnChanges {
  @Input() sessionContext: any;
  @Input() filterValues: any;
  @Input() filterOpenStatus: boolean;
  @Input() searchFormConfig: any;
  @Input() targetFrameworkId: any;
  @Output() filterChangeEvent: EventEmitter<any> = new EventEmitter();
  public filterConfig: any;
  public isFilterShow = false;
  public filterFields: any;
  public telemetryPageId: string;
  private onComponentDestroy$ = new Subject<any>();
  public frameworkDetails: any = {};
  public currentFilters: any;
  public searchQuery: string;

  constructor(private frameworkService: FrameworkService,
              public editorService: EditorService,
              public telemetryService: EditorTelemetryService,
              public treeService: TreeService,
              public configService: ConfigService,
              private helperService: HelperService) { }

  ngOnInit() {
    this.filterFields = this.searchFormConfig;
    const selectedNode = this.treeService.getActiveNode();
    let contentTypes = _.flatten(
      _.map(_.get(this.editorService.editorConfig.config, `hierarchy.level${selectedNode.getLevel() - 1}.children`), (val) => {
      return val;
    }));

    if (_.isEmpty(contentTypes)) {
      contentTypes = this.helperService.contentPrimaryCategories;
    }

    this.currentFilters = {
      primaryCategory: contentTypes,
      board: [],
      medium: [],
      gradeLevel: [],
      subject: [],
    };
    this.setFilterDefaultValues();
    this.fetchFrameWorkDetails();
  }

  setFilterDefaultValues() {
    _.forEach(this.filterFields, (field) => {
      if (this.filterValues[field.code]) {
        field.default = this.filterValues[field.code];
      }
    });
  }

  ngOnChanges() {
    this.isFilterShow = this.filterOpenStatus;
  }

  fetchFrameWorkDetails() {
    this.frameworkService.frameworkData$.pipe(
      takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.targetFrameworkId}`)),
      take(1)
    ).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.targetFrameworkId].categories;
        this.frameworkDetails.frameworkData = frameworkData;
        this.frameworkDetails.topicList = _.get(_.find(frameworkData, {
          code: 'topic'
        }), 'terms');
        this.frameworkDetails.targetFrameworks = _.filter(frameworkDetails.frameworkdata, (value, key) => {
          return _.includes(this.frameworkService.targetFrameworkIds, key);
        });
        this.populateFilters();
      }
    });
  }
  /**
   * Get the association data for B M G S
   */
  getAssociationData(selectedData: Array<any>, category: string, frameworkCategories) {
    // Getting data for selected parent, eg: If board is selected it will get the medium data from board array
    let selectedCategoryData = [];
    _.forEach(selectedData, (data) => {
      const categoryData = _.filter(data.associations, (o) => {
        return o.category === category;
      });
      if (categoryData) {
        selectedCategoryData = _.concat(selectedCategoryData, categoryData);
      }
    });

    // Getting associated data from next category, eg: If board is selected it will get the association data for medium
    let associationData;
    _.forEach(frameworkCategories, (data) => {
      if (data.code === category) {
        associationData = data.terms;
      }
    });

    // Mapping the final data for next drop down
    let resultArray = [];
    _.forEach(selectedCategoryData, (data) => {
      const codeData = _.find(associationData, (element) => {
        return element.code === data.code;
      });
      if (codeData) {
        resultArray = _.concat(resultArray, codeData);
      }
    });

    return _.sortBy(_.unionBy(resultArray, 'identifier'), 'index');
  }

  populateFilters() {
    const categoryMasterList = this.frameworkDetails.frameworkData;
    _.forEach(categoryMasterList, (category) => {
      _.forEach(this.filterFields, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.terms = category.terms;
        }
      });
    });

    const index = this.filterFields.findIndex(e => _.get(e, 'code') === 'primaryCategory');
    if (index !== -1) {
      this.filterFields[index].range = this.currentFilters.primaryCategory;
    }

    this.filterConfig = [{
      name: 'searchForm',
      fields: this.filterFields
    }];
  }

  // should get applied association data from framework details
  getOnChangeAssociationValues(selectedFilter, caterory) {
    const mediumData = _.find(this.frameworkDetails.frameworkData, (element) => {
      return element.name === caterory;
    });
    let getAssociationsData = [];
    _.forEach(selectedFilter, (value) => {
      const getAssociationData = _.map(_.get(mediumData, 'terms'), (framework) => {
        if (framework.name === value) {
          return framework;
        }
      });
      getAssociationsData = _.compact(_.concat(getAssociationsData, getAssociationData));
    });
    return getAssociationsData;
  }

  onQueryEnter(event) {
    this.emitApplyFilter();
    return false;
  }

  showfilter() {
    this.isFilterShow = !this.isFilterShow;
    this.filterChangeEvent.emit({
      action: 'filterStatusChange',
      filterStatus: this.isFilterShow
    });
  }

  resetFilter() {
    this.filterValues = {
      primaryCategory: this.helperService.contentPrimaryCategories
    };
    this.searchQuery = '';
    _.forEach(this.filterFields, (field) => {
      field.default = '';
    });

    this.filterConfig = null;
    this.filterConfig = [{
      name: 'searchForm',
      fields: _.cloneDeep(this.filterFields)
    }];

    this.emitApplyFilter();
  }

  applyFilter() {
    this.emitApplyFilter();
  }

  emitApplyFilter() {
    this.filterChangeEvent.emit({
      action: 'filterDataChange',
      filters: this.filterValues,
      query: this.searchQuery
    });
  }
  outputData($event) {
  }
  onStatusChanges($event) {
  }
  valueChanges($event) {
    this.filterValues = $event;
  }
}
