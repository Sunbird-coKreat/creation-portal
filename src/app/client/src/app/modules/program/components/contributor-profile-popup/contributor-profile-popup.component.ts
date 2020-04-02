import { UserService, ProgramsService } from '@sunbird/core';
import { ResourceService, ToasterService  } from '@sunbird/shared';
import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-contributor-profile-popup',
  templateUrl: './contributor-profile-popup.component.html',
  styleUrls: ['./contributor-profile-popup.component.scss']
})
export class ContributorProfilePopupComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<any>();
  @ViewChild('modal') private modal;
  @Input() userId: string;
  @Input() showProfile: boolean;
  private contributor: any;

  constructor(
    public userService: UserService,
    public toasterService: ToasterService,
    public programsService: ProgramsService,
    public resourceService: ResourceService
  ) { }

  ngOnInit() {
    if (!this.userId) {
      this.toasterService.error('Please provide either of userId or orgId');
      return;
    }
    this.getUserProfile();
  }

  getUserProfile() {
    const userSearchReq = {
      entityType: ['User'],
      filters: {
        userId: { eq : this.userId }
      }
    };
    this.programsService.searchRegistry(userSearchReq).subscribe(
      (response) => {
        if (_.isEmpty(response.result.User)) {
          this.toasterService.warning(this.resourceService.messages.emsg.profile.m0001);
          return false;
        }

        this.contributor = response.result.User[0];
      },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || this.resourceService.messages.emsg.profile.m0002);
        return false;
      }
    );
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

  closePopup() {
    this.showProfile = false;
    this.modal.deny();
    this.close.emit();
  }
}
