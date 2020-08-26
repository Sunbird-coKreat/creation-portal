import { Injectable } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse, ResourceService } from '@sunbird/shared';
import { ContentService, ActionService, PublicDataService, ProgramsService, NotificationService, UserService } from '@sunbird/core';
import { throwError, Observable, of, Subject, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap, mergeMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ProgramStageService } from '../../program/services';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private sendNotification = new Subject<string>();

  constructor(private configService: ConfigService, private contentService: ContentService,
    private toasterService: ToasterService, private publicDataService: PublicDataService,
    private actionService: ActionService, private resourceService: ResourceService,
    public programStageService: ProgramStageService, private programsService: ProgramsService,
    private notificationService: NotificationService, private userService: UserService) { }

  getLicences(): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'license',
            'status': ['Live']
          }
        }
      }
    };
    return this.contentService.post(req).pipe(map((res) => {
      return res.result;
    }), catchError(err => {
      const errInfo = { errorMsg: 'search failed' };
      return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }
  getNotification(): Observable<any> {
    return this.sendNotification.asObservable();
  }

  updateContent(req, contentId): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.CONTENT.UPDATE + '/' + contentId,
      data: {
        'request': req
      }
    };
    return this.actionService.patch(option);
  }

  reviewContent(contentId): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.CONTENT.REVIEW + '/' + contentId,
      data: {
        'request': {
          'content': {}
        }
      }
    };
    return this.actionService.post(option);
  }

  retireContent(contentId): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.DOCKCONTENT.RETIRE + '/' + contentId
    };
    return this.actionService.delete(option);
  }

  publishContent(contentId, userId) {
    const requestBody = {
      request: {
        content: {
          lastPublishedBy: userId
        }
      }
    };
    const option = {
      url: `content/v3/publish/${contentId}`,
      data: requestBody
    };
    return this.actionService.post(option);
  }

  submitRequestChanges(contentId, comment) {
    const requestBody = {
      request: {
        content: {
          rejectComment: _.trim(comment)
        }
      }
    };
    const option = {
      url: `content/v3/reject/${contentId}`,
      data: requestBody
    };
    return this.actionService.post(option);
  }

  checkIfContentPublishedOrRejected(data, action, contentId) {
    if ((action === 'accept' && _.includes(data.acceptedContents, contentId))
      || (action === 'reject' && _.includes(data.rejectedContents, contentId))) {
      action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00104) :
        this.toasterService.error(this.resourceService.messages.fmsg.m00105);
      this.programStageService.removeLastStage();
      return true;
    } else {
      return false;
    }
  }


  publishContentToDiksha(action, collectionId, contentId, originData, rejectedComments?) {
    const option = {
      url: 'content/v3/read/' + collectionId,
      param: { 'mode': 'edit', 'fields': 'acceptedContents,rejectedContents,versionKey,sourcingRejectedComments' }
    };
    this.actionService.get(option).pipe(map((res: any) => res.result.content)).subscribe((data) => {
      if (this.checkIfContentPublishedOrRejected(data, action, contentId)) { return; }
      if (action === 'accept') {
        const req = {
          url: `program/v1/content/publish`,
          data: {
            'request': {
              'content_id': contentId,
              'origin': {
                'channel': _.get(originData, 'channel'),
                'textbook_id': _.get(originData, 'textbookOriginId'),
                'units': [_.get(originData, 'unitOriginId')],
                'lastPublishedBy': this.userService.userProfile.userId
              }
            }
          }
        };
        this.programsService.post(req).subscribe((response) => {
          this.attachContentToTextbook(action, collectionId, contentId, data);
        }, err => {
          this.acceptContent_errMsg(action);
        });
      } else {
        this.attachContentToTextbook(action, collectionId, contentId, data, rejectedComments);
      }

    }, (err) => {
      this.acceptContent_errMsg(action);
    });

  }

  attachContentToTextbook(action, collectionId, contentId, data, rejectedComments?) {
    const request = {
      content: {
        'versionKey': data.versionKey
      }
    };
    // tslint:disable-next-line:max-line-length
    action === 'accept' ? request.content['acceptedContents'] = _.uniq([...data.acceptedContents || [], contentId]) : request.content['rejectedContents'] = _.uniq([...data.rejectedContents || [], contentId]);
    if (action === 'reject' && rejectedComments) {
      // tslint:disable-next-line:max-line-length
      request.content['sourcingRejectedComments'] = data.sourcingRejectedComments && _.isString(data.sourcingRejectedComments) ? JSON.parse(data.sourcingRejectedComments) : data.sourcingRejectedComments || {};
      request.content['sourcingRejectedComments'][contentId] = rejectedComments;
    }
    this.updateContent(request, collectionId).subscribe(() => {
      action === 'accept' ? this.toasterService.success(this.resourceService.messages.smsg.m0066) :
        this.toasterService.success(this.resourceService.messages.smsg.m0067);
      this.programStageService.removeLastStage();
      this.sendNotification.next(_.capitalize(action));
    }, (err) => {
      this.acceptContent_errMsg(action);
    });
  }

  acceptContent_errMsg(action) {
    action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.approvingFailed) :
    this.toasterService.error(this.resourceService.messages.fmsg.m00100);
  }

  fetchOrgAdminDetails(orgId): Observable<any> {
    const finalResult = {};
    const orgSearch = {
      entityType: ['Org'],
      filters: {
        osid: { eq: orgId }
      }
    };
    return this.programsService.searchRegistry(orgSearch).pipe(switchMap((res: any) => {
      if (res && res.result.Org.length) {
        const userSearch = {
          entityType: ['User'],
          filters: {
            osid: { eq: res.result.Org[0].createdBy }
          }
        };
        finalResult['Org'] = res.result.Org[0];
        return this.programsService.searchRegistry(userSearch);
      }
    }), map((res2: any) => {
      finalResult['User'] = res2.result.User[0];
      return finalResult;
    }),
      catchError(err => throwError(err)));
  }

  prepareNotificationData(status, contentMetaData, programDetails) {
    this.fetchOrgAdminDetails(contentMetaData.organisationId).subscribe(result => {
      if (result && result.Org && result.User && result.User.userId) {
        const notificationForContributor = {
          user_id: contentMetaData.createdBy,
          content: { name: contentMetaData.name },
          org: { name: result.Org.name },
          program: { name: programDetails.name },
          status: status
        };
        const notificationForPublisher = {
          user_id: result.User.userId,
          content: { name: contentMetaData.name },
          org: { name: result.Org.name },
          program: { name: programDetails.name },
          status: status
        };
        const notify = [notificationForContributor, notificationForPublisher];
        forkJoin(..._.map(notify, role => this.notificationService.onAfterContentStatusChange(role))).subscribe();
      }
    }, err => {
      console.error('error in triggering notification');
    });
  }



  getProgramConfiguration(reqData) {
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CONFIGURATION_SEARCH}`,
      data: {
        request: {
          key: reqData.key,
          status: reqData.status
        }
      }
    };
    return this.contentService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        const response = _.get(data, 'params.status');
        if (response !== 'successful') {
          return throwError(data);
        }
        return of(data);
      }));
  }
  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
  }

  getContentOriginUrl(contentId) {
    return this.programsService.getContentOriginEnvironment() + '/resources/play/content/' + contentId;
  }

  getTextbookDetails(textbookId) {
    const option = {
      url: 'content/v3/read/' + textbookId,
      param: { 'mode': 'edit', 'fields': 'versionKey,mvcContentCount,mvcContributions' }
    };
    return  this.actionService.get(option);
  }

  /*getContentMetadata(componentInput: any) {
    const contentId = sessionContext.resourceIdentifier;
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
    };
    this.contentService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(resourceDetails => {
      //this.resourceDetails = res;
      //this.sessionContext.contentMetadata = resourceDetails;
      const contentTypeValue = [resourceDetails.contentType];
      const contentType = this.programsService.getContentTypesName(contentTypeValue);
      resourceDetails.contentTypeName = contentType;
      this.sessionContext.contentMetadata = resourceDetails;
      this.sessionContext.resourceStatus = _.get(this.resourceDetails, 'status');;

      //this.existingContentVersionKey = resourceDetails.versionKey;
      //this.resourceStatus =  _.get(this.resourceDetails, 'status');
      this.setResourceStatus(resourceDetails);
      if (this.resourceDetails.questionCategories) {
        this.sessionContext.questionType = _.lowerCase(_.nth(this.resourceDetails.questionCategories, 0));
      }
      this.sessionContext.resourceStatus = this.resourceStatus;
      this.resourceName = this.resourceDetails.name || this.templateDetails.metadata.name;
      this.contentRejectComment = this.resourceDetails.rejectComment || '';
      if (!this.resourceDetails.itemSets) {
        this.createDefaultQuestionAndItemset();
      } else {
        const itemSet = this.resourceDetails.itemSets;
        if (itemSet[0].identifier) {
          this.itemSetIdentifier = itemSet[0].identifier;
        }
        this.fetchQuestionList();
        this.resourceName = (this.resourceName !== 'Untitled') ? this.resourceName : '' ;
        if (this.visibility && this.visibility.showSave && !this.resourceName) {
          this.showResourceTitleEditor();
        }
      }
      this.handleActionButtons();
    });
  }

  setResourceStatus(resourceDetails) {
    const resourceStatus = this.sessionContext.resourceStatus

    if (resourceStatus === 'Review') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
    } else if (resourceStatus === 'Draft' && resourceDetails.rejectComment && resourceDetails.rejectComment !== '') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
    } else if (resourceStatus === 'Live' && _.isEmpty(this.sourcingReviewStatus)) {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
    } else if (this.sourcingReviewStatus === 'Rejected') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.rejected;
    } else if (this.sourcingReviewStatus === 'Approved') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.approved;
    } else {
      this.sessionContext.resourceStatusText = resourceStatus;
    }
  }*/
}
