import { Component, OnInit, AfterViewInit,Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { UserService, RegistryService, ProgramsService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-org-users-list',
  templateUrl: './org-users-list.component.html',
  styleUrls: ['./org-users-list.component.scss']
})
export class OrgUsersListComponent implements OnInit {
  public contributorOrgUser: any = [];
  public tempSortOrgUser: any = [];
  public direction = 'asc';
  public sortColumn = '';
  public orgDetails: any = {};
  public showLoader = true;
  isShowCount = false;
  @Input() isShowCountFromChild: boolean;

  constructor( public resourceService: ResourceService, public userService: UserService,
    public registryService: RegistryService, public programsService: ProgramsService) { }
  ngOnInit(): void {
    this.getContributionOrgUsers();
    if (this.isShowCountFromChild) {
      this.isShowCount = this.isShowCountFromChild;
    }
  }

  sortCollection(column) {
    this.contributorOrgUser = this.programsService.sortCollection(this.tempSortOrgUser, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  getContributionOrgUsers() {
    const baseUrl = ( <HTMLInputElement> document.getElementById('portalBaseUrl')) ?
      ( <HTMLInputElement> document.getElementById('portalBaseUrl')).value : '';
    if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
      const orgUsers = this.registryService.getContributionOrgUsers(this.userService.userProfile.userRegData.User_Org.orgId);
      this.orgDetails.name = this.userService.userProfile.userRegData.Org.name;
      this.orgDetails.id = this.userService.userProfile.userRegData.Org.osid;
      this.orgDetails.orgLink = `${baseUrl}contribute/join/${this.userService.userProfile.userRegData.Org.osid}`;
      orgUsers.subscribe(response => {
        const result = _.get(response, 'result');
        if (!result || _.isEmpty(result)) {
          console.log('NO USER FOUND');
        } else {
          // get Ids of all users whose role is 'user'
          const userIds = _.map(_.filter(result[_.first(_.keys(result))], ['roles', ['user']]), 'userId');
          const getUserDetails = _.map(userIds, id => this.registryService.getUserDetails(id));
          forkJoin(...getUserDetails)
            .subscribe((res: any) => {
              if (res) {
                _.forEach(res, r => {
                  if (r.result && r.result.User) {
                    let creator = r.result.User.firstName;
                    if (r.result.User.lastName) {
                      creator = creator + ' ' + r.result.User.lastName;
                    }
                    r.result.User.fullName = creator;
                    this.contributorOrgUser.push(r.result.User);
                  }
                });
                this.tempSortOrgUser = this.contributorOrgUser;
              }
              this.showLoader = false;
            }, error => {
              console.log(error);
              this.showLoader = false;
            });
            this.showLoader = false;
        }
      }, error => {
        console.log(error);
      });
    }
  }

}