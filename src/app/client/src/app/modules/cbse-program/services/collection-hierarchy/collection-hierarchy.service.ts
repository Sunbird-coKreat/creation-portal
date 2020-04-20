import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ActionService, UserService } from '@sunbird/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions, ConfigService, ToasterService } from '@sunbird/shared';
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
    return this.actionService.patch(req).pipe(map((data: any) => {
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

  getCollectionWithProgramId(programId) {
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
            programId: programId,
            objectType: 'content',
            status: ['Draft'],
            contentType: 'Textbook'
          }
        }
      }
    };
    return this.httpClient.post<any>(option.url, option.data, httpOptions);
  }

  getContentCounts(contents, orgId, collections?) {
    const totalOrgContents = _.filter(contents, content => {
      return content.organisationId === orgId && content.sampleContent !== true;
    });
    let sourcingOrgStatus = {};
    const orgLevelDataWithoutReject = _.groupBy(totalOrgContents, 'status');
    const orgLevelDataWithReject = _.cloneDeep(orgLevelDataWithoutReject);

    orgLevelDataWithReject['Draft'] = _.has(orgLevelDataWithoutReject, 'Draft') ?
      this.getRejectOrDraft(orgLevelDataWithoutReject['Draft'], 'Draft') : [];

    orgLevelDataWithReject['Reject'] = _.has(orgLevelDataWithoutReject, 'Draft') ?
      this.getRejectOrDraft(orgLevelDataWithoutReject['Draft'], 'Reject') : [];

    const groupedByCollectionId = _.groupBy(totalOrgContents, 'collectionId');
    const collectionsByStatus = this.groupStatusForCollections(groupedByCollectionId);
    if (!_.isUndefined(collections)) {
      sourcingOrgStatus = this.getSourcingOrgStatus(collections, orgLevelDataWithReject, orgId);
    }
    return {
      total: totalOrgContents && totalOrgContents.length,
      review: _.has(orgLevelDataWithReject, 'Review') ? _.toString(orgLevelDataWithReject.Review.length) : '0',
      draft: _.has(orgLevelDataWithReject, 'Draft') ? _.toString(orgLevelDataWithReject.Draft.length) : '0',
      rejected: _.has(orgLevelDataWithReject, 'Reject') ? _.toString(orgLevelDataWithReject.Reject.length) : '0',
      live: _.has(orgLevelDataWithReject, 'Live') ? _.toString(orgLevelDataWithReject.Live.length) : '0',
      individualStatus: collectionsByStatus,
      ...(!_.isUndefined(collections) && {sourcingOrgStatus : sourcingOrgStatus})
    };
  }

  getSourcingOrgStatus(collections, orgContents, orgId) {
    const liveContents = _.has(orgContents, 'Live') ? orgContents.Live : [];
    let acceptedOrgContents, rejectedOrgContents , pendingOrgContents = [];
    if (liveContents.length) {
      const liveContentIds = _.map(liveContents, 'identifier');
      const allAcceptedContentIds = _.flatten(_.map(collections, 'acceptedContents'));
      const allRejectedContentIds = _.flatten(_.map(collections, 'rejectedContents'));

      acceptedOrgContents = _.intersection(liveContentIds, allAcceptedContentIds);
      rejectedOrgContents = _.intersection(liveContentIds, allRejectedContentIds);
      pendingOrgContents = _.difference(liveContentIds, _.concat(acceptedOrgContents, rejectedOrgContents));
      }
      return  {
        accepted: acceptedOrgContents ? _.toString(acceptedOrgContents.length) : '0', // converting to string to enable table sorting
        rejected: rejectedOrgContents ? _.toString(rejectedOrgContents.length) : '0',
        pending: pendingOrgContents ? _.toString(pendingOrgContents.length) : '0'
      };
  }

  getContentCountsForIndividual(contents, userId, collections?) {
    const totalUserContents = _.filter(contents, content => {
      return content.createdBy === userId && content.sampleContent !== true;
    });
    let sourcingOrgStatus = {};
    const contentGroupByStatus = _.groupBy(totalUserContents, 'status');
    if (!_.isUndefined(collections)) {
      sourcingOrgStatus = this.getSourcingOrgStatus(collections, contentGroupByStatus, userId);
    }
    return  {
      total: totalUserContents && totalUserContents.length,
      draft: _.has(contentGroupByStatus, 'Draft') ? _.toString(contentGroupByStatus.Draft.length) : '0',
      review: '0', // forcefully setting to enable table sorting
      rejected: '0', // forcefully setting to enable table sorting
      live: _.has(contentGroupByStatus, 'Live') ? _.toString(contentGroupByStatus.Live.length) : '0',
      ...(!_.isUndefined(collections) && {sourcingOrgStatus : sourcingOrgStatus})
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


