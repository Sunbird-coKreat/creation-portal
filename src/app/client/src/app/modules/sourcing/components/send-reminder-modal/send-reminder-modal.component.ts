import { Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { combineLatest, of } from "rxjs";
import { ProgramsService, UserService, NotificationService } from '@sunbird/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { ResourceService, ToasterService} from '@sunbird/shared';
import * as _ from 'lodash-es';
import { DatePipe } from '@angular/common';

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
      private resourceService: ResourceService, public toasterService: ToasterService,
      private datePipe: DatePipe){}
  ngOnInit(): void {
    const filters = {
      program_id: this.activatedRoute.snapshot.params.programId
    }
    if (this.userService.isUserBelongsToOrg()) {
      filters['organisation_id'] = this.userService.getUserOrgId();
    } else {
      filters['user_id'] = this.userService.userid;
    }
    this.programsService.getNominationList(filters).subscribe((data) => {
      if(data.result && data.result.length> 0 ){
      const userRolemapping = data.result[0].rolemapping;
      this.contributors = userRolemapping?.CONTRIBUTOR ? userRolemapping.CONTRIBUTOR : [];
      this.reviewers = userRolemapping?.REVIEWER ? userRolemapping.REVIEWER : [];     
      }
  })
  }

    onUserCheck(event, userType){
        switch (userType) {
            case 'Contributor':
                this.userContributor = event.target.checked;
            break;
            case 'Reviewer':
                this.userReviewer = event.target.checked;
            break;
    }
  }
  onModalClose() {
    this.showSendReminderModal.emit();
  }

  sendReminderSMS(){
    const programDetail={
      name: this.programDetail.name,
      submissionDate : this.datePipe.transform(this.programDetail.content_submission_enddate,'dd MMMM yyyy')
    }
    if(this.userContributor && this.contributors && this.contributors.length > 0){ 
      this.notificationService.sendNotificationToContributorOrg(this.contributors, programDetail).subscribe((resp)=>{
        if(resp.result.response==='SUCCESS'){
          this.toasterService.success(this.resourceService.messages.smsg.reminderSentContributor);
        }
        (error) => {
          this.toasterService.error(this.resourceService.messages.emsg.failedToSendReminderToContributor)
        }
      });
    }
    if(this.userReviewer && this.reviewers && this.reviewers.length > 0){
      this.notificationService.sendNotificationToContributorOrg(this.reviewers, programDetail).subscribe((resp)=>{
        if(resp.result.response==='SUCCESS'){
          this.toasterService.success(this.resourceService.messages.smsg.reminderSentReviewer);
        }
      (error) => {
        this.toasterService.error(this.resourceService.messages.emsg.failedToSendReminderToReviwer)
      }});
    }
    this.userContributor = false;
    this.userReviewer = false;
  }
}