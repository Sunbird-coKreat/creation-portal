import { Component, OnInit } from '@angular/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { UserService, RegistryService, ProgramsService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-org-users-list',
  templateUrl: './org-users-list.component.html',
  styleUrls: ['./org-users-list.component.scss']
})
export class OrgUsersListComponent implements OnInit {
  public contributorOrgUser: any = [];
  public tempSortOrgUser: any = [];
  public userIds: any = [];
  public direction = 'asc';
  public sortColumn = '';
  public orgDetails: any = {};
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
        const getUserDetails = _.map(result.User_Org, userOrg => {
          return this.registryService.getUserDetails(userOrg.userId)
          .pipe(
            tap((res: any) => {
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
                this.userIds.push(user.userId);
              }
            })
          );
        });
        forkJoin(getUserDetails)
        .subscribe((res: any) => {
          this.getUsersDetails();
        }, error => {
          console.log(error);
        });
      }, error => {
        console.log(error);
      });
    }
  }

  getUsersDetails() {
    const req = {
      'identifier': _.compact(this.userIds)
    };
    this.programsService.getOrgUsersDetails(req).subscribe((response) => {
      const users = _.get(response, 'result.response.content');
      if (_.isEmpty(users)) {
        this.showLoader = false;
        console.log('NO USER FOUND');
        return;
      }
      _.forEach(users, (user, index) => {
        const contribUser = _.find(this.contributorOrgUser, (u) => {
          return u.userId === user.identifier;
        });
        if (contribUser) {
          if (!_.isEmpty(user.maskedEmail)) {
            contribUser.contact = user.maskedEmail;
          }
          if (!_.isEmpty(user.maskedPhone)) {
            contribUser.contact = user.maskedPhone;
          }
        }
        if (index === users.length - 1) {
          this.showLoader = false;
        }
      });
    });
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
