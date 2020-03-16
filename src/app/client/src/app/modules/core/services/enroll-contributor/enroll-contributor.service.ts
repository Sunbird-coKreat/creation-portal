import { Injectable } from '@angular/core';
import { mergeMap, catchError, tap, retry, map, skipWhile } from 'rxjs/operators';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError, merge } from 'rxjs';
import * as _ from 'lodash-es';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnrollContributorService extends DataService {

  // constructor() { }
  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;

  constructor(config: ConfigService, http: HttpClient, private publicDataService: PublicDataService,
    private userService: UserService, private extFrameworkService: ExtPluginService,
    private router: Router, private toasterService: ToasterService, private resourceService: ResourceService) {
      super(http);
      this.config = config;
      this.baseUrl = this.config.urlConFig.URLS.PUBLIC_PREFIX;
    }

    enrollContributor(request): Observable<ServerResponse> {
      const req = {
        url: request.url,
        headers: {
          'content-type' : 'application/json'
        },
        data: {
          request
        }
      };
  
      return this.post(req);
    }

}
