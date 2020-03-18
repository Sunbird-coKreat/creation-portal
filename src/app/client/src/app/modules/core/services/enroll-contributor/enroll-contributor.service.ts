import { Injectable } from '@angular/core';
import { mergeMap, catchError, tap, retry, map, skipWhile } from 'rxjs/operators';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService,  ToasterService, ResourceService } from '@sunbird/shared';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, BehaviorSubject, throwError, merge } from 'rxjs';
import * as _ from 'lodash-es';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import { ServerResponse, RequestParam, HttpOptions } from '@sunbird/shared';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { ContentService } from '../content/content.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollContributorService {

  // constructor() { }
  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;

  constructor(config: ConfigService, http: HttpClient, private publicDataService: PublicDataService,
    private userService: UserService, private extFrameworkService: ExtPluginService, private contentService: ContentService,
    private router: Router, private toasterService: ToasterService, private resourceService: ResourceService) {
    }
    saveData(option) {
    return this.contentService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
     }
}
