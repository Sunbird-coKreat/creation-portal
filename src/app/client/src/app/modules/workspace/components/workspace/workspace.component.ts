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
  public facets: any;

  constructor(
    searchService: SearchService
  ) {
    this.searchService = searchService;
  }

  ngOnInit(): void {
    this.getContentCountByStatus();
  }

  selectTab(tabname) {
    this.tab = tabname;
  }

  getContentCountByStatus() {
    const req = {
        "filters": {
          "objectType": [
            "Content"
          ],
          "status": []
        },
        "limit": 0,
        "facets": ["status"]
    };

    this.searchService.compositeSearch(req).subscribe(res => {
      if (res.responseCode === "OK") {
        this.facets = _.get(res, 'result');
      }
    }, error => {
      console.log(error);
    });
  }
}
