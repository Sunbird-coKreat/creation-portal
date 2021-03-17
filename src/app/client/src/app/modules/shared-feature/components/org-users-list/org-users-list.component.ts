import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  public contributorOrgUsers: any = [];
  public tempSortOrgUser: any = [];
  public direction = 'asc';
  public sortColumn = '';
  public orgDetails: any = {};
  public userIds: any = [];
  public showLoader = true;
  public roles = [{ name: 'User', value: 'user'}, { name: 'Admin', value: 'admin'}];

  constructor( public resourceService: ResourceService, public userService: UserService,
    public registryService: RegistryService, public programsService: ProgramsService, public toasterService: ToasterService) { }
  ngOnInit(): void {
    this.getContributionOrgUsers();
  }

  sortCollection(column) {
    this.contributorOrgUsers = this.programsService.sortCollection(this.tempSortOrgUser, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  checkIfUserBelongsToOrg() {
    return !!(this.userService.userRegistryData && this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org);
  }

  getContributionOrgUsers() {
    this.registryService.getcontributingOrgUsersDetails().then((orgUsers) => {
      this.contributorOrgUsers = orgUsers;
      this.tempSortOrgUser = orgUsers;
      this.showLoader = false;
    });
  }

  onRoleChange(user) {
    const selectedRole = _.get(user, 'selectedRole');
    const osid = _.get(user, 'User_Org.osid');

    this.programsService.updateUserRole(osid, [selectedRole]).subscribe(
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
