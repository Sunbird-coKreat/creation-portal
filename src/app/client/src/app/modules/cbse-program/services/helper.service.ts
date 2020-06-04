import { Injectable } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse, ResourceService } from '@sunbird/shared';
import { ContentService, ActionService, PublicDataService, ProgramsService} from '@sunbird/core';
import { throwError, Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
    public programStageService: ProgramStageService, private programsService: ProgramsService) { }

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
      }), catchError( err => {
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

  reviewContent(contentId): Observable<ServerResponse>  {
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

  retireContent(contentId): Observable<ServerResponse>  {
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

  attachContentToTextbook(action, collectionId, contentId, originData) {
    const req = {
      url: `program/v1/content/publish`,
      data: {
        'request': {
          'content_id': contentId,
          'textbook_id': _.get(originData, 'textbookOriginId'),
          'units': [_.get(originData, 'unitOriginId')]
        }
      }
    };
    return this.programsService.post(req).subscribe((response) => {
      // read textbook data
    const option = {
      url: 'content/v3/read/' + collectionId,
      param: { 'mode': 'edit' }
    };
    this.actionService.get(option).pipe(map((res: any) => res.result.content)).subscribe((data) => {
      const request = {
        content: {
        'versionKey': data.versionKey
        }
      };
      // tslint:disable-next-line:max-line-length
      action === 'accept' ? request.content['acceptedContents'] = [...data.acceptedContents || [], contentId] : request.content['rejectedContents'] = [...data.rejectedContents || [], contentId];
      this.updateContent(request, collectionId).subscribe(() => {
        action === 'accept' ? this.toasterService.success(this.resourceService.messages.smsg.m0066) :
                              this.toasterService.success(this.resourceService.messages.smsg.m0067);
       this.programStageService.removeLastStage();
       this.sendNotification.next(_.capitalize(action));
      }, (err) => {
        this.acceptContent_errMsg(action);
      });
    }, (err) => {
      this.acceptContent_errMsg(action);
    });
    }, err => {
      this.acceptContent_errMsg(action);
    });
  }

  acceptContent_errMsg(action) {
    action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00102) :
    this.toasterService.error(this.resourceService.messages.fmsg.m00100);
  }

  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
  }
}
