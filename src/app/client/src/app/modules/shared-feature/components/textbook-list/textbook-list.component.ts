import { ResourceService, ToasterService, ConfigService  } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProgramsService, ActionService, UserService, ContentHelperService} from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, UntypedFormBuilder, Validators, UntypedFormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash-es';
import { isEmpty } from 'rxjs/operators';
import {ProgramTelemetryService} from '../../../program/services';
import { HelperService } from '../../../sourcing/services/helper.service';

@Component({
  selector: 'app-textbook-list',
  templateUrl: './textbook-list.component.html',
  styleUrls: ['./textbook-list.component.scss']
})
export class TextbookListComponent implements OnInit {
  @Input() collectionsInput: Array<any> = [];
  @Input() programDetails: any = {};
  @Input() contentAggregationInput: Array<any> = [];
  @Input() userPreferences: any = {};
  @Input() frameworkCategories: any = {};
  @Input() telemetryPageId;
  public programId: string;
  public config: any;
  public collections: Array<any> = [];
  public collectionsCnt = 0;
  public sharedContext: any = {};
  public collectionComponentConfig: any;
  public filters;
  public apiUrl;
  public chapterCount = 0;
  public pendingReview = 0;
  public direction = 'asc';
  public sortColumn = 'name';
  public tempSortCollections: Array<any> = [];
  public showLoader = true;
  public contentStatusCounts: any = {};
  public sourcingOrgReviewer: boolean;
  public collectionData: any;
  @Output() selectedCollection = new EventEmitter<any>();
  @Output() applyTextbookPreference = new EventEmitter<any>();
  @ViewChild('prefModal') prefModal;
  prefernceForm: UntypedFormGroup;
  sbFormBuilder: UntypedFormBuilder;
  showTextbookFiltersModal = false;
  setPreferences = {};
  textbookFiltersApplied = false;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public targetCollection: string;
  public targetCollections: string;
  public firstLevelFolderLabel: string;
  public prefernceFormOptions = {};
  public reviewContributionHelpConfig: any;
  constructor(public activatedRoute: ActivatedRoute, private router: Router,
    public programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public resourceService: ResourceService,
    public actionService: ActionService, private collectionHierarchyService: CollectionHierarchyService,
    private userService: UserService, private formBuilder: UntypedFormBuilder, public configService: ConfigService,
    public programTelemetryService: ProgramTelemetryService, public helperService: HelperService,
    public contentHelperService: ContentHelperService
  )  {
    this.sbFormBuilder = formBuilder;
  }

  ngOnInit(): void {
    this.initialize();
    this.telemetryInteractCdata = [
      {id: this.activatedRoute.snapshot.params.programId, type: 'project'},
      {id: this.userService.channel, type: 'sourcing_organization'}
    ];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.setContextualHelpConfig();
  }

  setContextualHelpConfig() {
    const sunbirdContextualHelpConfig = this.helperService.getContextualHelpConfig();
    if (!_.isUndefined(sunbirdContextualHelpConfig) && _.has(sunbirdContextualHelpConfig, 'sourcing.reviewContributions')
    && this.router.url.includes('/sourcing')) {
      this.reviewContributionHelpConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.reviewContributions');
    }
    if (!_.isUndefined(sunbirdContextualHelpConfig) && _.has(sunbirdContextualHelpConfig, 'contribute.reviewContributions')
    && this.router.url.includes('/contribute')) {
      this.reviewContributionHelpConfig = _.get(sunbirdContextualHelpConfig, 'contribute.reviewContributions');
      }
  }

  initialize() {
    this.setTargetCollectionValue();
    this.programId = this.activatedRoute.snapshot.params.programId;
    // tslint:disable-next-line:max-line-length
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    if (this.router.url.includes('sourcing/nominations/' + this.programId) && this.programDetails.program_id) {
      this.showTexbooklist(this.collectionsInput, this.contentAggregationInput);
      this.collectionsCnt = this.collectionsInput && this.collectionsInput.length;
      if (this.programDetails.target_type === 'searchCriteria') {
        this.getContentsVisibilityStatusText();
      }

      if (!_.isEmpty(this.userPreferences.sourcing_preference)) {
        this.textbookFiltersApplied = true;
        // tslint:disable-next-line: max-line-length
        this.setPreferences['medium'] = (this.userPreferences.sourcing_preference.medium) ? this.userPreferences.sourcing_preference.medium : [];
        // tslint:disable-next-line: max-line-length
        this.setPreferences['subject'] = (this.userPreferences.sourcing_preference.subject) ? this.userPreferences.sourcing_preference.subject : [];
        // tslint:disable-next-line: max-line-length
        this.setPreferences['gradeLevel'] = (this.userPreferences.sourcing_preference.gradeLevel) ? this.userPreferences.sourcing_preference.gradeLevel : [];
      }
    }
    
    this.prefernceFormOptions['medium'] = this.programDetails.config.medium;
    this.prefernceFormOptions['gradeLevel'] = this.programDetails.config.gradeLevel;
    this.prefernceFormOptions['subject'] = this.programDetails.config.subject;
    if (this.programDetails.target_type === 'searchCriteria'  && !_.isEmpty(this.frameworkCategories)) {
      this.frameworkCategories.forEach((element) => {
        if (_.includes(['medium', 'subject', 'gradeLevel'], element.code)) {
          this.prefernceFormOptions[element['code']] = _.map(element.terms, 'name');
        }
      });
    }
    this.prefernceForm = this.sbFormBuilder.group({
      medium: [],
      subject: [],
      gradeLevel: [],
    });
  }

  setTargetCollectionValue() {
    if (!_.isUndefined(this.programDetails)) {
      this.getCollectionCategoryDefinition();
      this.targetCollection = this.programsService.setTargetCollectionName(this.programDetails);
      this.targetCollections = this.programsService.setTargetCollectionName(this.programDetails, 'plural');
    }
  }

  getCollectionCategoryDefinition() {
    if (this.programDetails.target_collection_category && this.userService.userProfile.rootOrgId && (!this.programDetails.target_type || this.programDetails.target_type === 'collections')) {
      // tslint:disable-next-line:max-line-length
    this.programsService.getCategoryDefinition(this.programDetails.target_collection_category[0],
      this.userService.userProfile.rootOrgId, 'Collection').subscribe(res => {
      const objectCategoryDefinition = res.result.objectCategoryDefinition;
      if (_.has(objectCategoryDefinition.objectMetadata.config, 'sourcingSettings.collection.hierarchy.level1.name')) {
        // tslint:disable-next-line:max-line-length
      this.firstLevelFolderLabel = objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection.hierarchy.level1.name;
      } else {
        this.firstLevelFolderLabel = _.get(this.resourceService, 'frmelmnts.lbl.deafultFirstLevelFolders');
      }
    });
    }
  }

  getTelemetryInteractCdata(id, type) {
    return [...this.telemetryInteractCdata, {id: _.toString(id), type: type, } ];
  }

  sortCollection(column) {
    this.collections =  this.programsService.sortCollection(this.tempSortCollections, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  applyTextbookFilters() {
    this.prefModal.deny();
    const prefData = {
        ...this.prefernceForm.value
    };
    this.applyTextbookPreference.emit(prefData);
  }

  resetTextbookFilters() {
    this.prefModal.deny();
    this.applyTextbookPreference.emit();
    this.textbookFiltersApplied = false;
  }

  showTexbooklist (data, contentAggregationData) {
    if (!_.isEmpty(data)) {
        this.collectionHierarchyService.setProgram(this.programDetails);
        if (contentAggregationData) {
          this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForAll(contentAggregationData, data);
        } else {
          this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForAll([], data);
        }
        this.collections = this.collectionHierarchyService.getIndividualCollectionStatus(this.contentStatusCounts, data);
        this.tempSortCollections = this.collections;
        this.sortCollection(this.sortColumn);
        this.showLoader = false;
    } else {
      this.showLoader = false;
    }
  }
 
  viewContribution(collection) {
    this.selectedCollection.emit(collection);
  }

  downloadCSV() {
    const req = {
      url: `program/v1/list/download`,
      data: {
          'request': {
              'filters': {
                  program_id: [this.programId]
          }
        }
      }
    };
    if (_.get(this.programDetails, 'target_type') && this.programDetails.target_type === 'searchCriteria') {
      req.data.request.filters['targetType'] = 'searchCriteria';
    }
    return this.programsService.post(req).subscribe((res) => {
      if (res.result && res.result.tableData && res.result.tableData.length) {
        try {
        let headers;
        if (!this.programDetails.target_type || this.programDetails.target_type === 'collections') {
          headers = [
            this.resourceService.frmelmnts.lbl.projectName,
            // tslint:disable-next-line:max-line-length
            this.programDetails.target_collection_category ? this.resourceService.frmelmnts.lbl.textbookName.replace('{TARGET_NAME}', this.programDetails.target_collection_category[0]) : 'Textbook Name',
            this.resourceService.frmelmnts.lbl.profile.Medium,
            this.resourceService.frmelmnts.lbl.profile.Classes,
            this.resourceService.frmelmnts.lbl.profile.Subjects,
            this.firstLevelFolderLabel ? this.firstLevelFolderLabel : this.resourceService.frmelmnts.lbl.deafultFirstLevelFolders,
            this.resourceService.frmelmnts.lbl.nominationReceived,
            this.resourceService.frmelmnts.lbl.samplesRecieved,
            this.resourceService.frmelmnts.lbl.nominationAccepted,
            this.resourceService.frmelmnts.lbl.contributionReceived,
            this.resourceService.frmelmnts.lbl.contributionApproved,
            this.resourceService.frmelmnts.lbl.contributionRejected,
            this.resourceService.frmelmnts.lbl.contributionPending,
            this.resourceService.frmelmnts.lbl.contributioncorrectionsPending
          ];
        } else {
          headers = [
            this.resourceService.frmelmnts.lbl.projectName,
            this.resourceService.frmelmnts.lbl.contentname,
            this.resourceService.frmelmnts.lbl.framework,
            this.resourceService.frmelmnts.lbl.board,
            this.resourceService.frmelmnts.lbl.medium,
            this.resourceService.frmelmnts.lbl.Class,
            this.resourceService.frmelmnts.lbl.subject,
            this.resourceService.frmelmnts.lbl.creator,
            this.resourceService.frmelmnts.lbl.status,
          ];
        }
        const resObj = _.get(_.find(res.result.tableData, {program_id: this.programId}), 'values');
        const tableData = [];
        if (_.isArray(resObj) && resObj.length) {
          _.forEach(resObj, (obj) => {
            tableData.push(_.assign({'Project Name': this.programDetails.name.trim()}, obj));
          });
        } else {
          tableData.push(_.assign({'Project Name': this.programDetails.name.trim()}, {}));
        }
        const csvDownloadConfig = {
          filename: this.programDetails.name.trim(),
          tableData: tableData,
          headers: headers,
          showTitle: false
        };
          this.programsService.generateCSV(csvDownloadConfig);
        } catch (err) {
          this.toasterService.error(this.resourceService.messages.emsg.projects.m0004);
        }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.projects.m0004);
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.emsg.projects.m0004);
    });
  }

  getContentsVisibilityStatusText () {
    this.collectionsCnt = 0;
    _.map(this.collectionsInput, (content) => {
      content['contentVisibility'] = this.contentHelperService.shouldContentBeVisible(content, this.programDetails);
      content['sourcingStatus'] = this.contentHelperService.checkSourcingStatus(content, this.programDetails);
      const temp = this.contentHelperService.getContentDisplayStatus(content)
      content['resourceStatusText'] = temp[0];
      content['resourceStatusClass'] = temp[1];
      if (content.contentVisibility) {
        this.collectionsCnt++;
      }
    });
  }
}
