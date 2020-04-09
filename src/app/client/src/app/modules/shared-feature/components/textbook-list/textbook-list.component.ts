import { HttpOptions, ConfigService, ResourceService, ToasterService, RouterNavigationService,
  ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgramsService, DataService, FrameworkService, ActionService } from '@sunbird/core';
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
export class TextbookListComponent implements OnInit {

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
  public direction = 'asc';
  public sortColumn = '';
  public tempSortcollections: Array<any> = [];

  constructor(public activatedRoute: ActivatedRoute, private router: Router,
    public programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public resource: ResourceService,
    public actionService: ActionService
  ) { }

  ngOnInit(): void {
    this.programId = this.activatedRoute.snapshot.params.programId;

    if (this.router.url.includes('sourcing/nominations/' + this.programId)) {

      this.fetchProgramDetails().subscribe((programDetails) => {
        this.getProgramCollection();
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

  getProgramCollection () {
    const httpOptions: HttpOptions = {
      headers: {
        'content-type': 'application/json',
      }
    };
    const option = {
      url: 'content/composite/v1/search',
      data: {
        request: {
          filters: {
            programId: this.programId,
            objectType: 'content',
            status: ['Draft'],
            contentType: 'Textbook'
          }
        }
      }
    };
    this.httpClient.post<any>(option.url, option.data, httpOptions).subscribe(
      (res: any) => {
        if (res && res.result && res.result.content && res.result.content.length) {
          this.showTexbooklist(res.result.content);
          this.collectionsCnt = res.result.content.length;
        }
      },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );

  }

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
      this.getCollectionHierarchy(collectionIds)
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
            const {chapterCount} = this.getSampleContentStatusCount(hierarchy);
              hierarchy.chapterCount = chapterCount;
            return hierarchy;
          });
          this.collections = _.map(data, content => {
            const contentWithHierarchy =  _.find(hierarchyContent, {identifier: content.identifier});
            content.chapterCount = contentWithHierarchy.chapterCount;
            return content;
          });
          this.tempSortcollections = this.collections;
        });
    }
  }
  getSampleContentStatusCount(data) {
    const self = this;
    if (data.contentType === 'TextBookUnit') {
      self.chapterCount = self.chapterCount + 1;
    }
    const childData = data.children;
    if (childData) {
      childData.map(child => {
        self.getSampleContentStatusCount(child);
      });
    }
    return {chapterCount: self.chapterCount};
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
}
