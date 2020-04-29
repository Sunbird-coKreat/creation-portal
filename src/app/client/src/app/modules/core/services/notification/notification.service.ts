import { Injectable } from '@angular/core';
import { of, throwError, forkJoin } from 'rxjs';
import { ResourceService, ToasterService, ServerResponse, ConfigService } from '@sunbird/shared';
import { mergeMap } from 'rxjs/operators';
import { RegistryService } from '../registry/registry.service';
import { ContentService } from '../content/content.service';
import { LearnerService } from '../learner/learner.service';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private config: ConfigService,
    private registryService: RegistryService,
    private resourceService: ResourceService,
    private toasterService: ToasterService,
    private learnerService: LearnerService,
    private contentService: ContentService) { }

  getUserDetails(userId) {
    const req = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: {
            identifier : userId
          }
        }
      }
    };
    return this.learnerService.post(req);
  }

  sendNotification(reqData) {
    const option = {
      url: 'user/v1/notification/email',
      data: {
        request: reqData
      }
    };

    console.log('option', option);
    return this.learnerService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        console.log('response ', data);
        if (data.params.status !== 'SUCCESSFUL') {
          return throwError(data);
        }
        return of(data);
      }));
  }

  onAfterNominationUpdate(nomination) {
    // console.log('nomination', nomination);
    this.getUserDetails(nomination.user_id)
    .subscribe((res: any) => {
      const user = _.get(res, 'result.response.content[0]');
      if (_.isEmpty(user)) {
        this.toasterService.warning(this.resourceService.messages.emsg.profile.m0002);
        return;
      }
      // console.log('user', user);
      const requests = [];
      if (!_.isEmpty(user.email)) {
        requests.push(this.sendEmailNotification(nomination));
      }
      if (!_.isEmpty(user.phone)) {
        requests.push(this.sendSmsNotification(nomination));
      }

      forkJoin(requests).subscribe((response: any) => {
        console.log('success ', response);
      }, error => {
        this.toasterService.error(this.resourceService.messages.emsg.profile.m0002);
        console.log(error);
      });
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.profile.m0002);
      console.log(error);
    });
  }

  sendEmailNotification(nomination) {
    const mode = 'email';
    const request = {
      mode: mode,
      subject: '',
      recipientUserIds: [nomination.user_id],
      emailTemplateType: this.getTemplate(nomination.status, mode)
    };
    return this.sendNotification(request);
  }

  sendSmsNotification(nomination) {
    const mode = 'sms';
    const request = {
      mode: 'sms',
      recipientUserIds: [nomination.user_id],
      emailTemplateType: this.getTemplate(nomination.status, mode)
    };
    return this.sendNotification(request);
  }

  getTemplate(status, type) {
    let template = '';
    if (status === 'Approved') {
      template = 'approved_' + type + '_template';
    }
    if (status === 'Rejected') {
      template = 'rejected_' + type + '_template';
    }
    if (status === 'Pending') {
      template = 'pending_' + type + '_template';
    }
    return template;
  }
}
