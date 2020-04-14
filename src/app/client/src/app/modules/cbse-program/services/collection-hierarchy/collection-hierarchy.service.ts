import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ActionService, UserService } from '@sunbird/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';

@Injectable()

export class CollectionHierarchyService {
  public chapterCount = 0;
  public sampleDataCount = 0;
  public currentUserID;

  constructor(private actionService: ActionService, private configService: ConfigService,
    public toasterService: ToasterService, public userService: UserService,
    public telemetryService: TelemetryService, private httpClient: HttpClient) {
      this.currentUserID = this.userService.userProfile.userId;
     }


  removeResourceToHierarchy(collection, unitIdentifier, contentId): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.CONTENT.HIERARCHY_REMOVE,
      data: {
        'request': {
          'rootId': collection,
          'unitId': unitIdentifier,
          'children': [contentId]
        }
      }
    };
    return this.actionService.delete(req).pipe(map((data: any) => {
      return data.result;
    }), catchError(err => {
      const errInfo = { errorMsg: 'Removing Resource From Selected-Unit Failed' };
      return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }

  getSampleContentStatusCount(data, userId?) {
    const self = this;
    if (data.contentType !== 'TextBook') {
      if (userId && data.createdBy === userId && data.contentType !== 'TextBookUnit' && data.sampleContent) {
        self.sampleDataCount = self.sampleDataCount + 1;
      } else if (data.contentType === 'TextBookUnit') {
        self.chapterCount = self.chapterCount + 1;
      }
    }
    const childData = data.children;
    if (childData) {
      childData.map(child => {
        self.getSampleContentStatusCount(child, userId);
      });
    }
    return {sampleDataCount: self.sampleDataCount, chapterCount: self.chapterCount};
  }

  addResourceToHierarchy(collection, unitIdentifier, contentId): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.CONTENT.HIERARCHY_ADD,
      data: {
        'request': {
          'rootId': collection,
          'unitId': unitIdentifier,
          'children': [contentId]
        }
      }
    };
    return this.actionService.patch(req).pipe(map((data) => {
      return data.result;
    }), catchError(err => {
        const errInfo = { errorMsg: 'Adding Resource To Selected-Unit Failed, Please Try Again' };
        return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }

  getCollectionHierarchy(collectionIds) {
    const hierarchyRequest =  _.map(collectionIds, id => {
      const req = {
        url: 'content/v3/hierarchy/' + id,
        param: { 'mode': 'edit' }
      };
      return this.actionService.get(req);
    });
    return forkJoin(hierarchyRequest);
  }

  getContentCounts(contents, orgId) {
    const totalOrgContents = _.filter(contents, content => {
      return content.organisationId === orgId && content.sampleContent !== true;
    });
    console.log(totalOrgContents);
    const orgLevelDataWithoutReject = _.groupBy(totalOrgContents, 'status');
    const orgLevelDataWithReject = _.cloneDeep(orgLevelDataWithoutReject);

    orgLevelDataWithReject['Draft'] = _.has(orgLevelDataWithoutReject, 'Draft') ?
      this.getRejectOrDraft(orgLevelDataWithoutReject['Draft'], 'Draft') : [];

    orgLevelDataWithReject['Reject'] = _.has(orgLevelDataWithoutReject, 'Draft') ?
      this.getRejectOrDraft(orgLevelDataWithoutReject['Draft'], 'Reject') : [];

    const groupedByCollectionId = _.groupBy(totalOrgContents, 'collectionId');
    const collectionsByStatus = this.groupStatusForCollections(groupedByCollectionId);
    return {
      total: totalOrgContents && totalOrgContents.length,
      review: _.has(orgLevelDataWithReject, 'Review') ? orgLevelDataWithReject.Review.length : 0,
      draft: _.has(orgLevelDataWithReject, 'Draft') ? orgLevelDataWithReject.Draft.length : 0,
      rejected: _.has(orgLevelDataWithReject, 'Reject') ? orgLevelDataWithReject.Reject.length : 0,
      live: _.has(orgLevelDataWithReject, 'Live') ? orgLevelDataWithReject.Live.length : 0,
      individualStatus: collectionsByStatus
    };
  }

  getRejectOrDraft(contents, status) {
    let splitter = [];
    if (status === 'Draft') {
      splitter = _.reject(contents, data =>  data.status === 'Draft' && data.prevStatus === 'Review');
    } else if (status === 'Reject') {
      splitter = _.filter(contents, data =>  data.status === 'Draft' && data.prevStatus === 'Review');
    }
    return splitter;
  }

  groupStatusForCollections(collections) {
    const collectionIds = _.keys(collections);
    const collectionWithoutReject = {};
    const collectionWithReject = {};
    _.forEach(collectionIds,  id => {
      collectionWithoutReject[id] = _.groupBy(collections[id], 'status');
      collectionWithReject[id] = _.cloneDeep(collectionWithoutReject[id]);

      collectionWithReject[id]['Draft'] = _.has(collectionWithoutReject[id], 'Draft') ?
        this.getRejectOrDraft(collectionWithoutReject[id]['Draft'], 'Draft') : [];

        collectionWithReject[id]['Reject'] = _.has(collectionWithoutReject[id], 'Draft') ?
        this.getRejectOrDraft(collectionWithoutReject[id]['Draft'], 'Reject') : [];
    });
    return collectionWithReject;
  }

  getContentAggregation(programId) {
    const option = {
      url: 'content/composite/v1/search',
      data: {
        request: {
          filters: {
            objectType: 'content',
            programId: programId,
            status: [],
            mimeType: {'!=': 'application/vnd.ekstep.content-collection'}
          }
        }
      }
    };

    return this.httpClient.post<any>(option.url, option.data);
  }


  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
    const telemetryErrorData = {
      context: {
        env: 'cbse_program'
      },
      edata: {
        err: err.status.toString(),
        errtype: 'SYSTEM',
        stacktrace: _.get(err, 'error.params.errmsg') || errorInfo.errorMsg
      }
    };
    this.telemetryService.error(telemetryErrorData);
  }
}


