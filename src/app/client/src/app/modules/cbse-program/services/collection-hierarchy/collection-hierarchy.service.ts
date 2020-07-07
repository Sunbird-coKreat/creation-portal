import { Injectable } from '@angular/core';
import { map, catchError, isEmpty } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ActionService, UserService } from '@sunbird/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions, ConfigService, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
import { isUndefined } from 'util';
//import { envHelper } from '../../../../../../../helpers/environmentVariablesHelper.js';

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

  getCollectionWithProgramId(programId, preferencefilters?) {
    const httpOptions: HttpOptions = {
      headers: {
        'content-type': 'application/json',
      }
    };
    const option = {
      url: 'composite/v3/search',
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
    if (!isUndefined(preferencefilters)) {
        if (!_.isEmpty(_.get(preferencefilters, 'medium'))) {
          option.data.request.filters['medium'] = _.get(preferencefilters, 'medium');
        }
        if (!_.isEmpty(_.get(preferencefilters, 'gradeLevel'))) {
          option.data.request.filters['gradeLevel'] = _.get(preferencefilters, 'gradeLevel');
        }
        if (!_.isEmpty(_.get(preferencefilters, 'subject'))) {
          option.data.request.filters['subject'] = _.get(preferencefilters, 'subject');
        }
    }
    const req = {
      url: option.url,
      data: option.data,
    };
    return this.actionService.post(req);
  }

  getContentCounts(contents, orgId, collections?) {
    const totalOrgContents = this.getContentsByType(contents, orgId, 'org', 'content');
    const totalOrgSampleContents = this.getContentsByType(contents, orgId, 'org', 'sample');
    return this.getStats(totalOrgContents, totalOrgSampleContents, collections);
  }

  getContentCountsForAll(contents, collections?) {
    const totalContents = this.getContentsByTypeForAll(contents, 'content');
    const totalSampleContents = this.getContentsByTypeForAll(contents, 'sample');
    return this.getStats(totalContents, totalSampleContents, collections);
  }

  getStats(totalContents, totalSampleContent, collections?) {
    let sourcingOrgStatus = {};
    const orgLevelDataWithoutReject = _.groupBy(totalContents, 'status');
    const orgLevelDataWithReject = _.cloneDeep(orgLevelDataWithoutReject);
    orgLevelDataWithReject['Draft'] = _.has(orgLevelDataWithoutReject, 'Draft') ?
      this.getRejectOrDraft(orgLevelDataWithoutReject['Draft'], 'Draft') : [];
    orgLevelDataWithReject['Reject'] = _.has(orgLevelDataWithoutReject, 'Draft') ?
      this.getRejectOrDraft(orgLevelDataWithoutReject['Draft'], 'Reject') : [];
    const groupedByCollectionId = _.groupBy(totalContents, 'collectionId');
    const groupedByCollectionIdForSample = _.groupBy(totalSampleContent, 'collectionId');
    const collectionsByStatus = this.groupStatusForCollections(groupedByCollectionId);
    const collectionsByStatusForSample = this.groupStatusForCollections(groupedByCollectionIdForSample);
    if (!_.isUndefined(collections)) {
      sourcingOrgStatus = this.getSourcingOrgStatus(collections, orgLevelDataWithReject);
    }
    return {
      total: totalContents && totalContents.length,
      sample: totalSampleContent && totalSampleContent.length,
      review: _.has(orgLevelDataWithReject, 'Review') ? orgLevelDataWithReject.Review.length : 0,
      draft: _.has(orgLevelDataWithReject, 'Draft') ? orgLevelDataWithReject.Draft.length : 0,
      rejected: _.has(orgLevelDataWithReject, 'Reject') ? orgLevelDataWithReject.Reject.length : 0,
      live: this.getAllPendingForApprovalCount(orgLevelDataWithReject, collections).length,
      individualStatus: collectionsByStatus,
      individualStatusForSample: collectionsByStatusForSample,
      ...(!_.isUndefined(collections) && {sourcingOrgStatus : sourcingOrgStatus})
    };
  }

  getSourcingOrgStatus(collections, orgContents) {
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
      const meta = {
        accepted: acceptedOrgContents ? acceptedOrgContents.length : 0, // converting to string to enable table sorting
        rejected: rejectedOrgContents ? rejectedOrgContents.length : 0,
        pending: pendingOrgContents ? pendingOrgContents.length : 0,
      };
      meta['total'] = _.sumBy(_.values(meta), _.toNumber);
      meta['acceptedContents'] = acceptedOrgContents || [];
      meta['rejectedOrgContents'] = rejectedOrgContents || [];
      meta['pendingOrgContents'] = pendingOrgContents || [];
      return meta;
  }

  getContentCountsForIndividual(contents, userId, collections?) {
    const totalUserContents = this.getContentsByType(contents, userId, 'individual', 'content');
    const totalUserSampleContents = this.getContentsByType(contents, userId, 'individual', 'sample');
    let sourcingOrgStatus = {};
    const groupedByCollectionIdForSample = _.groupBy(totalUserSampleContents, 'collectionId');
    const contentGroupByStatus = _.groupBy(totalUserContents, 'status');
    const contentGroupByStatusForSample = this.groupStatusForCollections(groupedByCollectionIdForSample);
    if (!_.isUndefined(collections)) {
      sourcingOrgStatus = this.getSourcingOrgStatus(collections, contentGroupByStatus);
    }
    return  {
      total: totalUserContents && totalUserContents.length,
      sample: totalUserSampleContents && totalUserSampleContents.length,
      draft: _.has(contentGroupByStatus, 'Draft') ? contentGroupByStatus.Draft.length : 0,
      review: 0,
      rejected: 0,
      live: _.has(contentGroupByStatus, 'Live') ? contentGroupByStatus.Live.length : 0,
      individualStatusForSample: contentGroupByStatusForSample,
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

  getContentAggregation(programId, sampleContentCheck?, organisationId?, userId?, onlyCount?) {
    const option = {
      url: 'composite/v3/search',
      data: {
        request: {
          filters: {
            objectType: 'content',
            programId: programId,
            status: [],
            mimeType: {'!=': 'application/vnd.ekstep.content-collection'},
            contentType: {'!=': 'Asset'}
          },
          fields: [
                  'name',
                  'identifier',
                  'programId',
                  'mimeType',
                  'status',
                  'sampleContent',
                  'createdBy',
                  'organisationId',
                  'collectionId',
                  'prevStatus',
                  'contentType'
                ],
        }
      }
    };

    if (!_.isUndefined(organisationId)) {
      option.data.request.filters['organisationId'] = organisationId;
    } else if (!_.isUndefined(userId)) {
      option.data.request.filters['createdBy'] = userId;
    }

    if (!_.isUndefined(sampleContentCheck)) {
      option.data.request.filters['sampleContent'] = sampleContentCheck;
      option.data.request.filters['status'] = ['Draft', 'Review'];
    } else {
      option.data.request['not_exists'] = ['sampleContent'];
      option.data.request['limit'] = 10000;
    }


    if (!_.isUndefined(onlyCount)) {
      option.data.request['limit'] = 0;
    }
    return this.actionService.post(option);
  }

  getContentsByType (contents, id, userType, contentType) {
    let extractedContents = [];
    if (userType === 'individual') {
      extractedContents = _.filter(contents, content => {
        if (contentType === 'sample') {
          return content.createdBy === id && content.sampleContent === true;
        } else {
          return content.createdBy === id && content.sampleContent !== true;
        }
      });
    } else if (userType === 'org') {
      extractedContents = _.filter(contents, content => {
        if (contentType === 'sample') {
          return content.organisationId === id && content.sampleContent === true;
        } else {
          return content.organisationId === id && content.sampleContent !== true;
        }
      });
    }
    return extractedContents;
  }

  getContentsByTypeForAll(contents, contentType) {
    let extractedContents = [];
    extractedContents = _.filter(contents, content => {
      if (contentType === 'sample') {
        return content.sampleContent === true;
      } else {
        return !content.sampleContent;
      }
    });
    return extractedContents;
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

  getAllPendingForApprovalCount(textbookMeta, collections?) {
    let liveContents = _.has(textbookMeta, 'Live') ? _.map(textbookMeta.Live, 'identifier') : [];
    if (_.isUndefined(collections)) {
      return liveContents.length;
    }
    // Merge the accepted and rejected contents
    const reviewedContents = _.union(_.flatten(_.map(collections, 'acceptedContents')), _.flatten(_.map(collections, 'rejectedContents')));
    // Get contents that are neither accepted nor rejected
    return _.difference(liveContents, reviewedContents);
  }

  getIndividualCollectionStatus(contentStatusCounts, collections) {
    return _.map(collections, textbook => {
      const textbookMeta = _.get(contentStatusCounts.individualStatus, textbook.identifier);
      const textbookMetaForSample = _.get(contentStatusCounts.individualStatusForSample, textbook.identifier);
      const liveContents = _.has(textbookMeta, 'Live') ? _.map(textbookMeta.Live, 'identifier') : [];
      const sourcingOrgMeta = _.get(contentStatusCounts, 'sourcingOrgStatus');
      textbook.draftCount = textbookMeta && _.has(textbookMeta, 'Draft') ? textbookMeta.Draft.length : 0;
      textbook.reviewCount = textbookMeta && _.has(textbookMeta, 'Review') ? textbookMeta.Review.length : 0;
      textbook.rejectedCount = textbookMeta && _.has(textbookMeta, 'Reject') ? textbookMeta.Reject.length : 0;
      const reviewedContents = _.union(_.get(textbook, 'acceptedContents', []), _.get(textbook, 'rejectedContents', []));
      textbook.liveCount = textbookMeta && _.difference(liveContents, reviewedContents).length;
      // tslint:disable-next-line:max-line-length
      textbook.sampleContentInReview = textbookMetaForSample && _.has(textbookMetaForSample, 'Review') ? textbookMetaForSample.Review.length : 0;
      // tslint:disable-next-line:max-line-length
      textbook.sampleContentInDraft = textbookMetaForSample && _.has(textbookMetaForSample, 'Draft') ? textbookMetaForSample.Draft.length : 0;
      // tslint:disable-next-line:max-line-length
      textbook.totalSampleContent = textbookMetaForSample ? textbook.sampleContentInDraft + textbook.sampleContentInReview : 0;
      const individualCollectionLiveContent = sourcingOrgMeta && textbookMeta && liveContents
      // tslint:disable-next-line:max-line-length
      const intersection = textbookMeta && sourcingOrgMeta && sourcingOrgMeta.acceptedContents ? _.intersection(sourcingOrgMeta.acceptedContents, individualCollectionLiveContent) : [];
      // tslint:disable-next-line:max-line-length
      const rejectedContentsIntersection = textbookMeta && sourcingOrgMeta && sourcingOrgMeta.rejectedOrgContents ? _.intersection(sourcingOrgMeta.rejectedOrgContents, individualCollectionLiveContent) : [];
      textbook.pendingBySourceOrg = _.difference(individualCollectionLiveContent, _.union(intersection, rejectedContentsIntersection));
      return textbook;
    });
  }

  getContentIdsForApprovedContents(contentIds) {
    const url =  this.getBaseUrlForPreview() + '/action/composite/v3/search';
    const data = {
      request: {
        filters: {
          objectType: 'content',
          origin: contentIds
        },
        exists: ["originData"],
        fields: ["status", "origin"],
        limit: 100
      }
    };
    return this.httpClient.post(url, data);
  }

  getLivePreviewUrl(contentId) {
    return this.getBaseUrlForPreview() + '/resources/play/content/'+ contentId;
  }

  getBaseUrlForPreview() {
    // return envHelper.LEARNER_URL.replace('/api/', '');
    return 'https://dev.sunbirded.org';
  }
}


