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
  public roles = [{ name: 'Select role', value: ''}, { name: 'Admin', value: 'admin'}];
  public contributorOrgUser: any = [];
  public tempSortOrgUser: any = [];
  public direction = 'asc';
  public sortColumn = '';
  public orgDetails: any = {};
  public showLoader = true;

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
          _.map(result.User_Org, userOrg => {
            this.registryService.getUserDetails(userOrg.userId)
              .subscribe((res: any) => {
                  if (res.result && res.result.User) {
                    const user = res.result.User;
                    let creator = user.firstName;
                    if (user.lastName) {
                      creator = creator + ' ' + user.lastName;
                    }
                    user.fullName = creator;
                    if (_.includes(userOrg.roles, 'admin')) {
                      user.selectedRole = _.find(this.roles, (role) => role.value === 'admin' );
                    } else {
                      user.selectedRole = _.find(this.roles, (role) => role.value === '' );
                    }
                    this.contributorOrgUser.push(user);
                  }
                }, error => {
                  console.log(error);
                });
          });
          this.showLoader = false;
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onRoleChange() {
    const roleMap = {};
    _.forEach(this.roles, role => {
      roleMap[role.name] = _.filter(this.contributorOrgUser, user => {
        if (user.selectedRole === role.value) {  return user.userId; }
      }).map(({userId}) => userId);
    });
    console.log(roleMap);
    // const req = {
    //   'request': {
    //       'user_id': this.userService.userid,
    //       'rolemapping': roleMap
    //   }
    // };
    // const updateNomination = this.programsService.updateNomination(req);
    // updateNomination.subscribe(response => {
    //   this.toasterService.success('Roles updated');
    // }, error => {
    //   console.log(error);
    // });
  }
}
