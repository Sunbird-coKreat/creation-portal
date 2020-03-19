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
    let httpOptions: HttpOptions = {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8',
        'X-Authenticated-User-Token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiIxYjMzODhlMC0xNmQ3LTQ3YWQtOTEwZi1jNWFiNjAwOGJmOTEiLCJleHAiOjE1ODQ2MTQ0NzgsIm5iZiI6MCwiaWF0IjoxNTg0NDQxNjc4LCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJzdWIiOiJmOjVhOGEzZjJiLTM0MDktNDJlMC05MDAxLWY5MTNiYzBmZGUzMTo4NDU0Y2IyMS0zY2U5LTRlMzAtODViNS1mYWRlMDk3ODgwZDgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI5ODliNmNjYS0wNjQ3LTQ0NjUtOGNlZi0zNGRkNTI4M2NiZjgiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LmNlbnRyYWxpbmRpYS5jbG91ZGFwcC5henVyZS5jb20vIiwiaHR0cDovL2Rldi5jZW50cmFsaW5kaWEuY2xvdWRhcHAuYXp1cmUuY29tLyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwic2NvcGUiOiIiLCJuYW1lIjoiTWVudG9yIEZpcnN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJudHB0ZXN0MTA0IiwiZ2l2ZW5fbmFtZSI6Ik1lbnRvciBGaXJzdCIsImZhbWlseV9uYW1lIjoiVXNlciIsImVtYWlsIjoidXMqKioqKioqKkB0ZXN0c3MuY29tIn0.SmhJwNxNsAwdDooSdTubCJb5CdRxzcduGdaSz5Ycnn_J-B-4aoiM2jVkA-Gc76rATFKE1uz8xxyoq_Io9Lo9mB91TIRNInkTb_VMHkAtKwXl0LnSog8_ASl6rZ8wG1uojGAsOblj_jjzYbwWCF-cQpaZXkw0NhUh27LuKMAZjlIjG3sWzD5fTJLn_Vl4R1fOsCLHviuQy-fpUQ8WEtoDo8hME-w1ika00WTzMKYaOnNTSaHBz1n6c33ROB1ogdL5hHhK2UlmYg7Uv8X-zah_V7ip2WKZ8uR-DfIIsXfHsg4ESNX2BRl_tD8vTKN2E3jn4ERZ3w27PS3nebjGB6TNRw',
        'observe': 'response'
      }
    };
    const option = {
      url: 'learner/composite/v1/search',
      data: {
        request: {
          filters: {
            programId: this.programId,
            objectType: "content",
            status: ["Draft", "Live"],
            contentType: "Textbook",
            framework: this.programDetails.config.framework,
            board:	this.programDetails.config.board,
            medium:	this.programDetails.config.medium
          }
        }
      }
    };
    this.httpClient.post<any>(option.url, option.data, httpOptions).subscribe(
      (res) => {
        this.collections = res.result.content;
        this.collectionsCnt = this.collections.length;
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
