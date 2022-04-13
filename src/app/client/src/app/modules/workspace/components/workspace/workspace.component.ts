import { UserService } from './../../../core/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '@sunbird/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  tab: string;
  searchService: SearchService;
  public userRoles: any;
  creator: boolean = false;
  reviewer: boolean = false;
  bothCreatorAndReviewer: boolean = false;
  orgAdmin: boolean = false;

  constructor(
    private userService: UserService,
    searchService: SearchService
  ) {
    this.searchService = searchService;
  }

  ngOnInit(): void {
    this.userService.userData$.subscribe((user: any) => {
      if (user && !user.err) {
        this.userRoles = user?.userProfile?.userRoles;
        this.creator = this.userRoles?.some(e => e === 'CONTENT_CREATOR' || e === 'BOOK_CREATOR');
        this.reviewer = this.userRoles?.some(e => e === 'CONTENT_REVIEWER' || e === 'BOOK_REVIEWER' || e === 'REPORT_REVIEWER');
        this.bothCreatorAndReviewer = this.creator && this.reviewer;
        this.orgAdmin = this.userRoles?.includes('ORG_ADMIN');
        this.decideActiveTab();
      }
    });
  }

  selectTab(tabname) {
    this.tab = tabname;
  }

  decideActiveTab() {
    if (this.creator) {
      this.tab = 'mycontent';
    } else if (this.reviewer) {
      this.tab = 'review';
    } else if (this.orgAdmin) {
      this.tab = 'published';
    }
  }
}
