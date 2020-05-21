import { Injectable } from '@angular/core';
import { of, throwError, forkJoin } from 'rxjs';
import { ResourceService, ServerResponse, ConfigService } from '@sunbird/shared';
import { mergeMap, tap } from 'rxjs/operators';
import { LearnerService } from '../learner/learner.service';
import { ProgramsService } from '../programs/programs.service';
import * as _ from 'lodash-es';
import { ContentService } from '../content/content.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private resourceService: ResourceService,
    private learnerService: LearnerService,
    private programsService: ProgramsService,
    private config: ConfigService,
    private contentService: ContentService) { }

  sendNotification(reqData) {
    const option = {
      url: 'user/v1/notification/email',
      data: {
        request: reqData
      }
    };
    return this.learnerService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        const response = _.get(data, 'result.response');
        if (response !== 'SUCCESS') {
          return throwError(data);
        }
        return of(data);
      }));
  }

  onAfterNominationUpdate(nomination) {
    const requestFilter = { identifier : nomination.user_id };
    return this.programsService.getOrgUsersDetails(requestFilter)
    .pipe(
      tap((res: any) => {
        const user = _.get(res, 'result.response.content[0]');
        if (_.isEmpty(user)) {
          return throwError(new Error(this.resourceService.messages.emsg.profile.m0002));
        }
        const requests = [];
        if (!_.isEmpty(user.email)) {
          requests.push(this.sendEmailNotification(nomination));
        }
        if (!_.isEmpty(user.phone)) {
          requests.push(this.sendSmsNotification(nomination));
        }
        forkJoin(requests).subscribe(
          (response) => of(response),
          (error) => throwError(error));
      })
    );
  }

  sendEmailNotification(nomination) {
    const mode = 'email';
    const request = {
      mode: mode,
      subject: this.getEmailSubject(nomination),
      recipientUserIds: [nomination.user_id],
      emailTemplateType: this.getTemplate(nomination.status, mode),
      orgName: nomination.programData.name,
      body: 'VidyaDaan'
    };
    return this.sendNotification(request).subscribe();
  }

  getEmailSubject(nomination: any) {
    let status = '';
    let subject = this.resourceService.messages.stmsg.notification.subject;
    subject = _.replace(subject, '{PROJECT_NAME}', nomination.programData.name);
    if (nomination.status === 'Approved' || nomination.status === 'Pending') {
      status = 'accepted';
    }
    if (nomination.status === 'Rejected') {
      status = 'not accepted';
    }
    subject = _.replace(subject, '{NOMINATION_STATUS}', status);
    return subject;
  }

  getTemplate(status, type) {
    let template = '';
    if (status === 'Approved') {
      template = type + 'NominationAccept';
    }
    if (status === 'Rejected') {
      template = type + 'NominationReject';
    }
    return template;
  }

  sendSmsNotification(nomination) {
    const mode = 'sms';
    const template = this.getTemplate(nomination.status, mode);
    const templateRequest = {
      key: template,
      status: 'active'
    };
    return this.getSmsTemplate(templateRequest).subscribe(
      (response) => {
        const configuration = _.get(response, 'result.configuration');
        if (_.isEmpty(configuration)) {
          return throwError('Failed to get the sms template');
        }
        const url = window.location.origin;
        let body = configuration.value;
        body = _.replace(body, '$url', url);
        body = _.replace(body, '$projectName', nomination.programData.name);

        const request = {
          mode: 'sms',
          subject: 'VidyaDaan',
          body: body,
          recipientUserIds: [nomination.user_id]
        };
        return this.sendNotification(request).subscribe();
      },
      (error) => {
        return throwError(error);
      }
    );
  }

  getSmsTemplate(reqData) {
    const option = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CONFIGURATION_SEARCH}`,
      data: {
        request: reqData
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

  onAfterContentStatusChange(notificationData) {
    const requestFilter = { identifier : notificationData.user_id };
    return this.programsService.getOrgUsersDetails(requestFilter)
    .pipe(
      tap((res: any) => {
        const user = _.get(res, 'result.response.content[0]');
        if (_.isEmpty(user)) {
          return throwError(new Error(this.resourceService.messages.emsg.profile.m0002));
        }
        const requests = [];
        if (!_.isEmpty(user.email)) {
          requests.push(this.sendEmailNotificationForContent(notificationData));
        }
        if (!_.isEmpty(user.phone)) {
          requests.push(this.sendSmsNotificationForContent(notificationData));
        }
        forkJoin(requests).subscribe(
          (response) => of(response),
          (error) => throwError(error));
      })
    );
  }

  sendEmailNotificationForContent(notificationData) {
    const mode = 'email';
    const request = {
      mode: mode,
      subject: this.getEmailSubjectForContent(notificationData),
      recipientUserIds: [notificationData.user_id],
      emailTemplateType: this.getTemplateForContent(notificationData.status, mode),
      orgName: notificationData.org.name,
      body: 'VidyaDaan'
    };
    return this.sendNotification(request).subscribe();
  }

  getEmailSubjectForContent(notificationData: any) {
    let status = '';
    let subject = this.resourceService.messages.stmsg.content.notification.status.subject;
    subject = _.replace(subject, '{PROJECT_NAME}', notificationData.program.name);
    subject = _.replace(subject, '{CONTENT_NAME}', notificationData.content.name);
    if (notificationData.status === 'Published') {
      status = 'published';
    }
    if (notificationData.status === 'Request') {
      status = 'requested changes';
    }
    if (notificationData.status === 'Accept') {
      status = 'accepted';
    }
    if (notificationData.status === 'Reject') {
      status = 'rejected';
    }
    subject = _.replace(subject, '{CONTENT_STATUS}', status);
    return subject;
  }

  getTemplateForContent(status, type) {
    let template = '';
    if (status === 'Published') {
      template = type + 'ContentPublished';
    }
    if (status === 'Request') {
      template = type + 'ContentRequestedChanges';
    }
    if (status === 'Accept') {
      template = type + 'ContentAccept';
    }
    if (status === 'Reject') {
      template = type + 'ContentReject';
    }
    return template;
  }

  sendSmsNotificationForContent(notificationData) {
    const mode = 'sms';
    const template = this.getTemplateForContent(notificationData.status, mode);
    const templateRequest = {
      key: template,
      status: 'active'
    };
    return this.getSmsTemplate(templateRequest).subscribe(
      (response) => {
        const configuration = _.get(response, 'result.configuration');
        if (_.isEmpty(configuration)) {
          return throwError('Failed to get the sms template');
        }
        const url = window.location.origin;
        let body = configuration.value;
        body = _.replace(body, '$url', url);
        body = _.replace(body, '$contentName', notificationData.content.name);
        body = _.replace(body, '$projectName', notificationData.program.name);

        const request = {
          mode: 'sms',
          subject: 'VidyaDaan',
          body: body,
          recipientUserIds: [notificationData.user_id]
        };
        return this.sendNotification(request).subscribe();
      },
      (error) => {
        return throwError(error);
      }
    );
  }
}
