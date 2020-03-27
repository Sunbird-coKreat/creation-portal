import { HttpOptions, ConfigService, ResourceService, ToasterService, RouterNavigationService,
  ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgramsService, DataService, FrameworkService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, filter, map } from 'rxjs/operators';

import * as _ from 'lodash-es';

@Component({
  selector: 'app-textbook-list',
  templateUrl: './textbook-list.component.html',
  styleUrls: ['./textbook-list.component.scss']
})
export class TextbookListComponent implements OnInit {

  public programId: string;
  public programDetails: any = {};
  public config: any;
  public collections: any;
  public collectionsCnt = 0;
  public programContext: any;
  public sharedContext: any = {};
  public collectionComponentConfig: any;
  public filters;
  public apiUrl;

  constructor(public activatedRoute: ActivatedRoute, private router: Router,
    public programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public resource: ResourceService
  ) {

  }

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
        if (res && res.result && res.result.content) {
          this.collections = res.result.content;
          this.collectionsCnt = this.collections.length;
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
}
