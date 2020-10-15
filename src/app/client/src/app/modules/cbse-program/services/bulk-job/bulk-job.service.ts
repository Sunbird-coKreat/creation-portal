import { Injectable } from '@angular/core';
import { ConfigService, ServerResponse, BrowserCacheTtlService } from '@sunbird/shared';
import { ContentService, ProgramsService, PublicDataService, ActionService, LearnerService } from '@sunbird/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';

@Injectable({
  providedIn: 'root'
})
export class BulkJobService {

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private programsService: ProgramsService, private configService: ConfigService,
    private contentService: ContentService, private publicDataService: PublicDataService,
    public actionService: ActionService, public learnerService: LearnerService) { }

  getBulkOperationStatus(reqData): Observable<ServerResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.SEARCH}`,
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
      url: 'composite/v1/search',
      data: {
        request: {
          filters: {
            objectType: 'content',
            processId: processId,
            status: []
          },
          fields: [
                  'identifier',
                  'status',
                  'collectionId',
                  'prevStatus',
                  'contentType',
                  'origin',
                  'name'
          ],
          limit: 10000
        }
      }
    };

    if (type === 'bulk_approval') {
      return this.learnerService.post(reqData);
    } else if (type === 'bulk_upload') {
      // Get the extra fields that are needed in bulk upload download report
      // tslint:disable-next-line:max-line-length
      const extraFields =  ['copyright', 'keywords', 'mimeType', 'source', 'appIcon', 'gradeLevel', 'artifactUrl', 'audience', 'license', 'attributions', 'description', 'creator', 'importError', 'publishError'];
      reqData.data.request.fields = _.concat(reqData.data.request.fields, extraFields);
      const req = {
        url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
        data: reqData.data
      };
      return this.contentService.post(req);
    }
  }

  createBulkJob(reqData): Observable<ServerResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.CREATE}`,
      data: {
        request: reqData
      }
    };
    return this.programsService.post(req);
  }

  updateBulkJob(reqData): Observable<ServerResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.UPDATE}`,
      data: {
        request: reqData
      }
    };
    return this.programsService.patch(req);
  }

  createBulkImport(reqData): Observable<ServerResponse> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.DOCK_IMPORT}`,
      data: {
        request: reqData
      }
    };
    return this.actionService.post(req);
  }
}
