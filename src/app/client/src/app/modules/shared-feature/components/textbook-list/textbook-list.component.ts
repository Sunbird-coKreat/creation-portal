import { ResourceService, ToasterService  } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgramsService, ActionService, UserService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-textbook-list',
  templateUrl: './textbook-list.component.html',
  styleUrls: ['./textbook-list.component.scss']
})
export class TextbookListComponent implements OnInit {
  @Input() collectionsInput: Array<any> = [];
  @Input() programDetails: any = {};
  @Input() contentAggregationInput: Array<any> = [];
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
  constructor(public activatedRoute: ActivatedRoute, private router: Router,
    public programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public resourceService: ResourceService,
    public actionService: ActionService, private collectionHierarchyService: CollectionHierarchyService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.programId = this.activatedRoute.snapshot.params.programId;
    // tslint:disable-next-line:max-line-length
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    if (this.router.url.includes('sourcing/nominations/' + this.programId) && this.programDetails.program_id) {
      this.showTexbooklist(this.collectionsInput, this.contentAggregationInput);
      this.collectionsCnt = this.collectionsInput && this.collectionsInput.length;
    }
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
          this.resourceService.frmelmnts.lbl.textbookName,
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
          this.resourceService.frmelmnts.lbl.contributionPending
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
