import { Component, Input, OnInit, Output, SimpleChange, EventEmitter } from '@angular/core';
import { IPagination } from '../../../sourcing/interfaces';
import { ToasterService, ResourceService, NavigationHelperService, ConfigService, PaginationService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { UserService, RegistryService, ProgramsService } from '@sunbird/core';
import { SearchService } from '@sunbird/core';

import * as _ from 'lodash-es';


@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {

  @Input() data: any;
  list: any;
  result: any;
  showLoader = true;
  pager: IPagination;
  pageNumber = 1;
  pageLimit = 200;
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;
  searchService: SearchService;

  constructor(private paginationService: PaginationService,
    public userService: UserService,
    public configService: ConfigService,
    searchService: SearchService,
    private telemetryService: TelemetryService) {
    this.searchService = searchService;
  }

  ngOnInit(): void {
    this.telemetryInteractCdata = [{ id: this.userService.channel, type: 'content_list' }];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.getContents(0);
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.pager = this.paginationService.getPager(this.data.count, this.pageNumber, this.pageLimit);
    this.getContents(this.pageLimit * (this.pageNumber - 1));
  }

  getContents(offset) {
    this.showLoader = true;
    const req = {
      "filters": {
        "status": [
          "Live"
        ],
        // @Todo - add created by to show only creator published content
        // "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
        "objectType": "Content",
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
      "query": "",
      "sort_by": {
        "lastUpdatedOn": "desc"
      }
    };

    this.searchService.compositeSearch(req).subscribe(res => {
      if (res.responseCode === "OK") {
        this.list = _.get(res, 'result.content');
        this.result = _.get(res, 'result');
        this.pager = this.paginationService.getPager(this.data.count, this.pageNumber, this.pageLimit);
        this.showLoader = false;
      }
    }, error => {
      console.log(error);
    });
  }
}
