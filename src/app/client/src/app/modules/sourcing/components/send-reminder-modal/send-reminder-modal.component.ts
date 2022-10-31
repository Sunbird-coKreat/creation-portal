import { Component, EventEmitter, Input, Output} from "@angular/core";
import { combineLatest, of } from "rxjs";
import { ProgramsService, UserService, NotificationService } from '@sunbird/core';
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
    selector: 'app-send-reminder-modal',
    templateUrl: './send-reminder-modal.component.html',
    styleUrls: ['./send-reminder-modal.component.scss']
  })

  export class SendReminderModalComponent {
    
    @Input() sendReminderModal;
    @Output() showSendReminderModal = new EventEmitter();
    public userContributor = false;
    public userReviewer = false;

    constructor(
      public programsService: ProgramsService, public userService: UserService,
      public activatedRoute: ActivatedRoute, private notificationService: NotificationService){}

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
    // const review$ = this.userReviewer ? this.programsService.getNominationList({}) : of([]);
    // const contributor$ = this.userContributor ? this.programsService.getOrgUsersDetails({}) : of([]);
    // combineLatest([review$, contributor$]).pipe().subscribe((resp)=> {
    //     const nomination = {
    //         contributorIds: resp[0],
    //         reviewIds: resp[1]
    //     }
    //     this.notificationService.sendNotificationToContributorOrg(nomination);
    // })
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
        const reviewers = this.userReviewer ? data.REVIEWER : [];
        const contributors = this.userContributor ? data.CONTRIBUTOR : [];

        if(reviewers.length > 0){
          this.notificationService.sendNotificationToContributorOrg(reviewers, "Send Back to Reveiwer").subscribe((resp)=>{
            console.log(resp);
          });
        }
        if(contributors.length > 0){
          this.notificationService.sendNotificationToContributorOrg(contributors, "Send Back to Contributor").subscribe((resp)=>{
            console.log(resp);
          });
        }
        // nomination = { reviwerUserId: reviewers, contributorsUserId: contributors, body1: "hello R", body2: "hello C"}
        // this.notificationService.
    })
  }
}