import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
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
  public showLoader = true;
  public roles = [{ name: 'User', value: 'user'}, { name: 'Admin', value: 'admin'}];

  constructor( public resourceService: ResourceService, public userService: UserService,
    public registryService: RegistryService, public programsService: ProgramsService, public toasterService: ToasterService) { }
  ngOnInit(): void {
    this.getContributionOrgUsers();
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
    const userRegData = this.userService.userProfile.userRegData;
    if (userRegData && userRegData.User_Org) {
      const orgUsers = this.registryService.getContributionOrgUsers(userRegData.User_Org.orgId);
      orgUsers.subscribe(response => {
        const result = _.get(response, 'result');
        if (!result || _.isEmpty(result)) {
          this.showLoader = false;
          console.log('NO USER FOUND');
          return;
        }
        _.map(result.User_Org, userOrg => {
          this.registryService.getUserDetails(userOrg.userId)
            .subscribe((res: any) => {
              if (res.result && res.result.User) {
                const user = res.result.User;
                if (user.userId === userRegData.User.userId) {
                  return;
                }
                user.fullName = user.firstName;
                if (user.lastName) {
                  user.fullName += ' ' + user.lastName;
                }
                user.selectedRole = _.first(userOrg.roles);
                user.userOrg = userOrg;
                this.contributorOrgUser.push(user);
                this.tempSortOrgUser.push(user);
              }
            }, error => {
              console.log(error);
            });
        });
        this.showLoader = false;
      }, error => {
        console.log(error);
      });
    }
  }

  onRoleChange(user) {
    const osid = user.userOrg.osid;

    this.programsService.updateUserRole(osid, [user.selectedRole]).subscribe(
      (res) => {
      this.toasterService.success(this.resourceService.messages.smsg.m0065);
      },
      (error) => {
        console.log(error);
        this.toasterService.error(this.resourceService.messages.emsg.m0077);
      }
    );
  }
}
