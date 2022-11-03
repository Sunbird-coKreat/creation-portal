import { Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { combineLatest, of } from "rxjs";
import { ProgramsService, UserService, NotificationService } from '@sunbird/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { ResourceService, ToasterService} from '@sunbird/shared';
import * as _ from 'lodash-es';

@Component({
    selector: 'app-send-reminder-modal',
    templateUrl: './send-reminder-modal.component.html',
    styleUrls: ['./send-reminder-modal.component.scss']
  })

  export class SendReminderModalComponent implements OnInit {
    @Input() programDetail;
    @Input() sendReminderModal;
    @Output() showSendReminderModal = new EventEmitter();
    public userContributor = false;
    public userReviewer = false;
    public contributors;
    public reviewers;

    constructor(
      public programsService: ProgramsService, public userService: UserService,
      public activatedRoute: ActivatedRoute, private notificationService: NotificationService,
      private resourceService: ResourceService, public toasterService: ToasterService,){}
  ngOnInit(): void {
    const filters = {
      program_id: this.activatedRoute.snapshot.params.programId
    }
    if (this.userService.isUserBelongsToOrg()) {
      filters['organisation_id'] = this.userService.getUserOrgId();
    } else {
      filters['user_id'] = this.userService.userid;
    }
    this.programsService.getNominationList(filters).pipe(
      map((data:any)=> data.result[0].rolemapping)
    ).subscribe((data) => {
      console.log('resp', data);
      this.contributors = data.CONTRIBUTOR ? data.CONTRIBUTOR : [];
      this.reviewers = data.REVIEWER ? data.REVIEWER : [];
  })
  }

    onUserCheck(event, userType){
        switch (userType) {
            case 'Contributor':
                this.userContributor = event.target.checked;
            break;
            case 'Reviewer':
                this.userReviewer = event.target.checked
            break;
    }
  }
  onModalClose() {
    this.showSendReminderModal.emit();
  }

  sendReminderSMS(){
    let successMsg = this.resourceService.messages.smsg.reminderSent;

    if(this.contributors && this.contributors.length > 0){ 
      let contriMsgBody = this.resourceService.messages.reminder.contributor.msg.body;
      contriMsgBody = _.replace(contriMsgBody, '{CURRENT_PROJECT_NAME}', this.programDetail.name);
      contriMsgBody = _.replace(contriMsgBody, '{CONTENT_SUBMISSION_ENDDATE}', this.programDetail.content_submission_enddate);
      console.log('contri msg', contriMsgBody);      
      this.notificationService.sendNotificationToContributorOrg(this.contributors, contriMsgBody).subscribe((resp)=>{
        if(resp.result.response==='SUCCESS'){
          successMsg = _.replace(successMsg, '{ORG_USER}', 'contributors')
          this.toasterService.success(successMsg);
        }
      });
    }
    if(this.reviewers && this.reviewers.length > 0){
      let revMsgBody = this.resourceService.messages.reminder.reviewer.msg.body;
      revMsgBody = _.replace(revMsgBody, '{CURRENT_PROJECT_NAME}', this.programDetail.name);
      revMsgBody = _.replace(revMsgBody, '{CONTENT_SUBMISSION_ENDDATE}', this.programDetail.content_submission_enddate);
      console.log('revi msg', revMsgBody);
      this.notificationService.sendNotificationToContributorOrg(this.reviewers, revMsgBody).subscribe((resp)=>{
        if(resp.result.response==='SUCCESS'){
          successMsg = _.replace(successMsg, '{ORG_USER}', 'reviewers')
          this.toasterService.success(successMsg);
        }
      console.log("hello", resp);
      });
    }

  }
}