import { ActivatedRoute } from '@angular/router';
import { isEmpty, first, filter } from 'rxjs/operators';
import { Component, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { IPagination } from '../../../sourcing/interfaces';
import { ConfigService, PaginationService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { UserService, ProgramsService, SearchService } from '@sunbird/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {
  @ViewChild('createPopUpMat') createPopUpMat: TemplateRef<any>;
  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;
  @Input() selectedTab: string;
  protected facets: [] = [];
  dialogRef: any;
  filters: any = {};
  showFiltersModal = false;
  query: string = '';
  list: any;
  result: any;
  showLoader = true;
  public pager: IPagination;
  pageNumber = 1;
  pageLimit = 200;
  maxLimit = 1000;
  countByStatus: any = { review: 0, draft: 0, live: 0 };

  public filterForm: FormGroup;
  public direction = 'desc';
  public sortColumn = 'lastUpdatedOn';
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;
  public filtersAppliedCount: number = 0;
  public totalContentCount: number = 0;
  public liveContentCount: number = 0;
  public draftContentCount: number = 0;
  public reviewContentCount: number = 0;
  public filtersToShow = {
    published: [
      "board",
      "medium",
      "gradeLevel",
      "subject",
      "contentType"
    ],
    mycontent: [
      "board",
      "medium",
      "gradeLevel",
      "subject",
      "status",
      "contentType"
    ],
    review: [],
    collaboration: [
      "board",
      "medium",
      "gradeLevel",
      "subject",
      "status",
      "contentType"
    ]
  };
  searchService: SearchService;

  constructor(private paginationService: PaginationService,
    public userService: UserService,
    public configService: ConfigService,
    searchService: SearchService,
    public programsService: ProgramsService,
    public dialog: MatDialog,
    public sbFormBuilder: FormBuilder,
    public cacheService: CacheService,
    private telemetryService: TelemetryService,
    private route: ActivatedRoute) {
    this.searchService = searchService;
  }

  ngOnInit(): void {
    this.telemetryInteractCdata = [{ id: this.userService.channel, type: 'content_list' }];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.facets =  _.get(this.route.snapshot.data.facets, 'result');
    this.totalContentCount = _.get(this.facets, 'count');
    this.countByStatus = _.get(_.first(_.get(this.facets, 'facets')), 'values').reduce((prev, curr) => {
      prev[curr.name] = curr.count;
      return prev;
    }, {});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedTab) {
      this.getContents(0);
    }
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.pager = this.paginationService.getPager(this.result.count > 1000 ? 1000 : this.result.count, this.pageNumber, this.pageLimit);
    this.getContents(this.pageLimit * (this.pageNumber - 1));
  }

  getPublishedContentsFilter() {
    return {
      "status": ["Live"],
      "createdBy": this.userService.userid,
      "objectType": "Content",
    };
  }

  getReviewContentsFilter() {
    return {
      "status": ["Review", "FlagReview"],
      "createdBy": this.userService.userid,
      "objectType": "Content",
    };
  }

  getCollaborationFilter() {
    return {
      "status": ["Draft", "FlagDraft", "Review", "Processing", "Live", "Unlisted", "FlagReview"],
      "collaborators": [this.userService.userid],
      "objectType": "Content"
    }
  }

  getMyContentsFilter() {
    return {
      status: ["Draft", "FlagDraft", "Review", "Processing", "Live", "Unlisted", "FlagReview"],
      createdBy: this.userService.userid,
      "objectType": "Content"
    }
  }

  getContents(offset) {
    this.showLoader = true;
    const req = {
      "filters": {
        // @Todo add filter for category
        "primaryCategory": [
          "Course Assessment",
          "eTextbook",
          "Explanation Content",
          "Learning Resource",
          "Practice Question Set",
          "Teacher Resource",
          "Exam Question",
          "Content Playlist",
          "Course",
          "Digital Textbook",
          "Question paper"
        ]
      },
      "offset": offset,
      "limit": 200,
      "query": this.query,
      "sort_by": {
        "lastUpdatedOn": "desc"
      }
    };

    switch (this.selectedTab) {
      case "published":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getPublishedContentsFilter() }, _.identity);
        break;

      case "mycontent":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getMyContentsFilter() }, _.identity);
        break;

      case "review":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getReviewContentsFilter() }, _.identity);
        break;

      case "collaboration":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getCollaborationFilter() }, _.identity);
        break;
    }

    this.searchService.compositeSearch(req).subscribe(res => {
      if (res.responseCode === "OK") {
        this.list = _.get(res, 'result.content');
        this.sortColumn = 'lastUpdatedOn';
        this.direction = 'desc';
        this.result = _.get(res, 'result');
        this.pager = this.paginationService.getPager(this.result.count > 1000 ? 1000 : this.result.count, this.pageNumber, this.pageLimit);
        this.showLoader = false;
      }
    }, error => {
      console.log(error);
    });
  }

  search(clearSearch?) {
    if (clearSearch) {
      this.query = '';
    }

    let offset = this.pageLimit * (this.pageNumber - 1);
    this.getContents(offset);
  }

  applyFilters(filters) {
    let offset = this.pageLimit * (this.pageNumber - 1);
    this.getContents(offset)
  }

  // finding the applied filters count and putting them into request body other wise put origional req body to api call
  getFilterDetails(setfilters?) {
    const appliedfilters = this.cacheService.get('workspaceAdminAppliedFilters');  // getting the strored data from cache service
    const applyFilters = setfilters ? setfilters : appliedfilters;
    this.filtersAppliedCount = this.programsService.getFiltersAppliedCount(applyFilters); // getting applied filters count
    return applyFilters;
  }

  sortList(column) {
    this.list = this.programsService.sortCollection(this.list, this.sortColumn, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  openCreatePopUpMat() {
    if (this.createPopUpMat) {
      this.dialogRef = this.dialog.open(this.createPopUpMat);
    }
  }

  openFilterPopUpMat() {
    this.showFiltersModal = true;
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

  tab = 'collection';

  selectTab(tabname) {
    this.tab = tabname;
  }

}
