import { ResourceService, ToasterService, ConfigService  } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProgramsService, ActionService, UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import * as _ from 'lodash-es';
import { isEmpty } from 'rxjs/operators';
import {ProgramTelemetryService} from '../../../program/services';

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
  prefernceForm: FormGroup;
  sbFormBuilder: FormBuilder;
  showTextbookFiltersModal = false;
  setPreferences = {};
  /*mediums:any[];
  classes:any[];
  subjects:any[];
  buttonLabel = this.resourceService.frmelmnts.lbl.addFilters;*/
  textbookFiltersApplied = false;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public targetCollection: string;
  public targetCollections: string;
  public firstLevelFolderLabel: string;

  constructor(public activatedRoute: ActivatedRoute, private router: Router,
    public programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public resourceService: ResourceService,
    public actionService: ActionService, private collectionHierarchyService: CollectionHierarchyService,
    private userService: UserService, private formBuilder: FormBuilder, public configService: ConfigService,
    public programTelemetryService: ProgramTelemetryService
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
  }

  initialize() {
    this.setTargetCollectionValue();
    this.programId = this.activatedRoute.snapshot.params.programId;
    // tslint:disable-next-line:max-line-length
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    if (this.router.url.includes('sourcing/nominations/' + this.programId) && this.programDetails.program_id) {
      this.showTexbooklist(this.collectionsInput, this.contentAggregationInput);
      this.collectionsCnt = this.collectionsInput && this.collectionsInput.length;

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
    /*this.mediums =  _.compact(this.programDetails.config.medium);
    this.classes = _.compact(this.programDetails.config.gradeLevel);
    this.subjects = _.compact(this.programDetails.config.subject);*/
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
    if (this.programDetails.target_collection_category && this.userService.userProfile.rootOrgId) {
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
    return this.programsService.post(req).subscribe((res) => {
      if (res.result && res.result.tableData && res.result.tableData.length) {
        try {
        const headers = [
          this.resourceService.frmelmnts.lbl.projectName,
          // tslint:disable-next-line:max-line-length
          this.programDetails.target_collection_category ? this.resourceService.frmelmnts.lbl.textbookName.replace('{TARGET_NAME}', this.programDetails.target_collection_category[0]) : 'Textbook Name',
          this.resourceService.frmelmnts.lbl.profile.Medium,
          this.resourceService.frmelmnts.lbl.profile.Classes,
          this.resourceService.frmelmnts.lbl.profile.Subjects,
          this.resourceService.frmelmnts.lbl.chapterCount,
          this.resourceService.frmelmnts.lbl.nominationReceived,
          this.resourceService.frmelmnts.lbl.samplesRecieved,
          this.resourceService.frmelmnts.lbl.nominationAccepted,
          this.resourceService.frmelmnts.lbl.contributionReceived,
          this.resourceService.frmelmnts.lbl.contributionApproved,
          this.resourceService.frmelmnts.lbl.contributionRejected,
          this.resourceService.frmelmnts.lbl.contributionPending,
          this.resourceService.frmelmnts.lbl.contributioncorrectionsPending
        ];
        const resObj = _.get(_.find(res.result.tableData, {program_id: this.programId}), 'values');
        const tableData = [];
        if (_.isArray(resObj) && resObj.length) {
          _.forEach(resObj, (obj) => {
            tableData.push(_.assign({'Project Name': this.programDetails.name.trim()}, obj));
          });
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
}
