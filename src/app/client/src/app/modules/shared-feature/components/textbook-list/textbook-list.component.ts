import { ResourceService, ToasterService  } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgramsService, ActionService } from '@sunbird/core';
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
  public programId: string;
  public programDetails: any = {};
  public config: any;
  public collections: Array<any> = [];
  public collectionsCnt = 0;
  public programContext: any;
  public sharedContext: any = {};
  public collectionComponentConfig: any;
  public filters;
  public apiUrl;
  public chapterCount = 0;
  public pendingReview = 0;
  public direction = 'asc';
  public sortColumn = '';
  public tempSortCollections: Array<any> = [];
  public showLoader = true;
  public contentStatusCounts: any = {};
  public sourcingOrgReviewer: boolean;
  public collectionData: any;
  @Output() selectedCollection = new EventEmitter<any>();
  constructor(public activatedRoute: ActivatedRoute, private router: Router,
    public programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public resourceService: ResourceService,
    public actionService: ActionService, private collectionHierarchyService: CollectionHierarchyService
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.programId = this.activatedRoute.snapshot.params.programId;
    // tslint:disable-next-line:max-line-length
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    if (this.router.url.includes('sourcing/nominations/' + this.programId)) {
      this.fetchProgramDetails().subscribe((programDetails) => {
        // this.getProgramCollection();
        this.showTexbooklist(this.collectionsInput);
        this.collectionsCnt = this.collectionsInput && this.collectionsInput.length;
      }, error => {
        // TODO: navigate to program list page
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      });
    }
  }

  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
    }));
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

  showTexbooklist (data) {
    if (!_.isEmpty(data)) {
      this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId)
        .subscribe(
          (response) => {
            if (response && response.result && response.result.content) {
              const contents = _.get(response.result, 'content');
              this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForAll(contents, data);
            } else {
              this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForAll([], data);
            }
            this.collections = this.collectionHierarchyService.getIndividualCollectionStatus(this.contentStatusCounts, data);
            this.tempSortCollections = this.collections;
            this.showLoader = false;
          },
          (error) => {
            console.log(error);
            this.showLoader = false;
            const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
            this.toasterService.error(errorMes || 'Fetching textbooks failed. Please try again...');
          }
        );
    } else {
      this.showLoader = false;
    }
  }

  viewContribution(collection) {
    this.selectedCollection.emit(collection);
  }
}
