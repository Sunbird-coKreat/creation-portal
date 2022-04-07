import { Component, OnInit } from '@angular/core';
import { SearchService } from '@sunbird/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  tab = 'mycontent';
  searchService: SearchService;

  constructor(
    searchService: SearchService
  ) {
    this.searchService = searchService;
  }

  ngOnInit(): void {
  }

  selectTab(tabname) {
    this.tab = tabname;
  }
}
