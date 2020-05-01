import { Injectable } from '@angular/core';
import { of, throwError, forkJoin } from 'rxjs';
import { ResourceService, ToasterService, ServerResponse } from '@sunbird/shared';
import { mergeMap, tap } from 'rxjs/operators';
import { LearnerService } from '../learner/learner.service';
import { ProgramsService } from '../programs/programs.service';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private resourceService: ResourceService,
    private toasterService: ToasterService,
    private learnerService: LearnerService,
    private programsService: ProgramsService) { }

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
        // if (!_.isEmpty(user.phone)) {
        //   requests.push(this.sendSmsNotification(nomination));
        // }
        forkJoin(requests).subscribe((response: any) => {
          return of(response);
        }, error => {
          return throwError(error);
        });
      }, error => {
        return throwError(error);
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
    return this.sendNotification(request);
  }

  getEmailSubject(nomination: any) {
    let status = '';
    let subject = 'VidyaDaan: Your nomination for {PROJECT_NAME} VidyaDaan project is {NOMINATION_STATUS}';
    subject = _.replace(subject, /{PROJECT_NAME}/g, nomination.programData.name);
    if (nomination.status === 'Approved' || nomination.status === 'Pending') {
      status = 'accepted';
    }
    if (nomination.status === 'Rejected') {
      status = 'not accepted';
    }
    subject = _.replace(subject, /{NOMINATION_STATUS}/g, status);
    return subject;
  }

  sendSmsNotification(nomination) {
    const mode = 'sms';
    const request = {
      mode: 'sms',
      recipientUserIds: [nomination.user_id],
      emailTemplateType: this.getTemplate(nomination.status, mode),
      orgName: nomination.programData.name,
      body: 'VidyaDaan'
    };
    return this.sendNotification(request);
  }

  getTemplate(status, type) {
    let template = '';
    if (type === 'email') {
      if (status === 'Approved') {
        template = 'emailNominationAccept';
      }
      if (status === 'Rejected') {
        template = 'emailNominationReject';
      }
    }
    return template;
  }
}
