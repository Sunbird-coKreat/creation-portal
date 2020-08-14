import { Injectable } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse, ResourceService, BrowserCacheTtlService } from '@sunbird/shared';
import { ContentService, ActionService, PublicDataService, ProgramsService, UserService } from '@sunbird/core';
import { throwError, Observable, of, Subject, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';

@Injectable({
  providedIn: 'root'
})
export class BulkJobService {

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private programsService: ProgramsService, private configService: ConfigService, private contentService: ContentService) { }

  getBulkOperationStatus(reqData): Observable<ServerResponse> {
    const req = {
      url: `program/v1/content/process/search`,
      data: {
        request: reqData
      }
    };
    return this.programsService.post(req).pipe(tap((res: any) => {
      if (res.result && res.result.process && res.result.process.length) {
        _.forEach(res.result.process, process => {
          const cachedProcess = this.cacheService.get(process.type + '_' + process.collection_id);
          if (cachedProcess && new Date(process.updatedon) > new Date(cachedProcess.updatedon)) {
            this.setProcess(process);
          } else if (!cachedProcess) {
            this.setProcess(process);
          }
        });
      }
    }));
  }

  setProcess(process) {
    this.cacheService.set(process.type + '_' + process.collection_id, process,
    { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }

  searchContentWithProcessId(processId, type) {
    const reqData = {
      request: {
        filters: {
          objectType: 'content',
          processId: processId
        },
        facets: [
           'status'
      ],
      limit: 0
      }
    };
    if (type === 'bulk_approval') {
      const originUrl = this.programsService.getContentOriginEnvironment();
      const url =  originUrl + '/action/composite/v3/search';
      return this.programsService.http.post(url, reqData);
    } else if (type === 'bulk_upload') {
      const req = {
        url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
        data: reqData
      };
      return this.contentService.post(req);
    }
  }

  createBulkJob() {

  }

  updateBulkJob() {

  }
}
