import { HttpOptions, ConfigService, ResourceService, ToasterService, RouterNavigationService,
  ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ProgramsService, DataService, FrameworkService, ActionService, UserService } from '@sunbird/core';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, filter, map } from 'rxjs/operators';

import * as _ from 'lodash-es';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-textbook-list',
  templateUrl: './textbook-list.component.html',
  styleUrls: ['./textbook-list.component.scss']
})
export class TextbookListComponent implements OnInit, OnChanges {

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
  public tempSortcollections: Array<any> = [];
  @Output() selectedCollection = new EventEmitter<any>();
  public contentStatusCounts = {
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0
  };
  public sourcingOrgReviewer: boolean;
  public collectionData: any;

  constructor(public activatedRoute: ActivatedRoute, private router: Router,
    public programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public resourceService: ResourceService,
    public actionService: ActionService, private collectionHierarchyService: CollectionHierarchyService, private userService: UserService
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

  ngOnChanges() {
    // this.initialize();
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

  // getProgramCollection () {
  //   this.collectionHierarchyService.getCollectionWithProgramId(this.programId).subscribe(
  //     (res: any) => {
  //       if (res && res.result && res.result.content && res.result.content.length) {
  //         this.showTexbooklist(res.result.content);
  //         this.collectionsCnt = res.result.content.length;
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //       // TODO: navigate to program list page
  //       const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
  //       this.toasterService.warning(errorMes || 'Fetching textbooks failed');
  //     }
  //   );

  // }

  sortCollection(column) {
    this.collections =  this.programsService.sortCollection(this.tempSortcollections, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  showTexbooklist (data) {
    if (!_.isEmpty(data)) {
      const collectionIds = _.map(data, 'identifier');
      this.collectionHierarchyService.getCollectionHierarchy(collectionIds)
        .subscribe(response => {
          const hierarchies = _.map(response, r => {
            if (r.result && r.result.content) {
              return r.result.content;
            } else {
              return r.result;
            }
          });
          const hierarchyContent = _.map(hierarchies, hierarchy => {
            this.chapterCount = 0;
            this.pendingReview = 0;
            const {chapterCount, pendingReview} = this.getSampleContentStatusCount(hierarchy);
              hierarchy.chapterCount = chapterCount;
              hierarchy.pendingReview = pendingReview;
            return hierarchy;
          });
          this.collections = _.map(data, content => {
            const contentWithHierarchy =  _.find(hierarchyContent, {identifier: content.identifier});
            content.chapterCount = contentWithHierarchy.chapterCount;
            content.pendingReview = contentWithHierarchy.pendingReview;
            return content;
          });
          this.tempSortcollections = this.collections;
          this.getContentAggregation().subscribe((responseData) => {
              if (responseData && responseData.result && responseData.result.content) {
                  const contents = _.get(responseData.result, 'content');
                  _.forEach(contents,  content => {
                    const index = _.findIndex(this.collections, collection => {
                      return collection.identifier === content.collectionId;
                    });
                    if (index > -1) {
                      this.contentStatusCounts.total = this.contentStatusCounts.total + 1;
                      const collectionData = this.collections[index];
                      if ( _.indexOf(collectionData.acceptedContents, content.identifier) > -1) {
                        this.contentStatusCounts.accepted = this.contentStatusCounts.accepted + 1;
                      } else if ( _.indexOf(collectionData.rejectedContents, content.identifier) > -1) {
                        this.contentStatusCounts.rejected = this.contentStatusCounts.rejected + 1;
                      } else {
                        this.contentStatusCounts.pending = this.contentStatusCounts.pending + 1;
                      }
                    }
                  });
              }
            },
              (err) => console.log(err)
          );
        });
    }
  }
  getSampleContentStatusCount(data) {
    const self = this;
    if (data.contentType === 'TextBook') {
      self.collectionData = data;
    }
    if (data.contentType === 'TextBookUnit') {
      self.chapterCount = self.chapterCount + 1;
    } else if (data.contentType !== 'TextBook' && data.status === 'Live' &&
    // tslint:disable-next-line:max-line-length
    _.includes([...self.collectionData.acceptedContents, ...self.collectionData.rejectedContents], data.identifier)) {
      self.pendingReview = self.pendingReview + 1;
    }
    const childData = data.children;
    if (childData) {
      childData.map(child => {
        self.getSampleContentStatusCount(child);
      });
    }
    return {chapterCount: self.chapterCount, pendingReview: self.pendingReview};
  }

  getCollectionHierarchy(collectionIds) {
    const hierarchyRequest =  _.map(collectionIds, id => {
       const req = {
         url: 'content/v3/hierarchy/' + id,
         param: { 'mode': 'edit' }
       };
       return this.actionService.get(req);
     });
     return forkJoin(hierarchyRequest);
   }

   viewContribution(collection) {
     this.selectedCollection.emit(collection);
   }
   getContentAggregation() {
    const option = {
      url: 'content/composite/v1/search',
      data: {
        request: {
          filters: {
            objectType: 'content',
            programId: this.programId,
            status: ['Live'],
            mimeType: {'!=': 'application/vnd.ekstep.content-collection'}
          }
        }
      }
    };

    return this.httpClient.post<any>(option.url, option.data);
  }
}
