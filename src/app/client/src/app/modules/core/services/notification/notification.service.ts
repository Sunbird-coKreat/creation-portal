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
    let subject = 'VidyaDaan: Your nomination for {PROJECT_NAME} project is {NOMINATION_STATUS}';
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
        const url = `${window.location.protocol}//${window.location.host}/`;
        let body = configuration.value;
        body = _.replace(body, '$url', url);
        body = _.replace(body, '$projectName', nomination.programData.name);

        const request = {
          mode: 'sms',
          subject: 'VidyaDaan',
          body: body,
          emailTemplateType: template,
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
}
