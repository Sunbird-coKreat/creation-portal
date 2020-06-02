import { Component, OnInit } from '@angular/core';
import { ProgramsService, RegistryService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IProgram } from '../../../core/interfaces';
import * as _ from 'lodash-es';
import { tap, filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { programContext } from '../../../contribute/components/list-nominated-textbooks/data';
import { IInteractEventEdata } from '@sunbird/telemetry';
@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss'],
  providers: [DatePipe]
})
export class ProgramListComponent implements OnInit {

  public programs: IProgram[];
  public count = 0;
  public activeDates = <any>[];
  public isContributor: boolean;
  public activeAllProgramsMenu: boolean;
  public activeMyProgramsMenu: boolean;
  public showAssignRoleModal = false;
  public contributorOrgUser = [];
  public programContext;
  public roles;
  public selectedRole;
  public selectedProgramToAssignRoles;
  public tempSortPrograms: any;
  public direction = 'asc';
  public enrollPrograms: IProgram[];
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public nominationList;
  public sortColumn = '';
  public showLoader = true;
  public roleMapping = [];
  public iscontributeOrgAdmin = true;
  constructor(public programsService: ProgramsService, private toasterService: ToasterService, private registryService: RegistryService,
    public resourceService: ResourceService, private userService: UserService, private activatedRoute: ActivatedRoute,
    public router: Router, private datePipe: DatePipe, public configService: ConfigService ) { }

  ngOnInit() {
    this.checkIfUserIsContributor();
    this.roles = _.get(programContext, 'config.roles');
    this.telemetryInteractCdata = [];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
  }

  /**
   * Check if logged in user is contributor or sourcing org
   */
  private checkIfUserIsContributor() {
      // TODO implement based on api and remove url checks
      // this.isContributor = !isContributor;
      const orgId = this.activatedRoute.snapshot.params.orgId;

      // Check if user part of that organisation
      if (this.router.url.includes('/contribute/join/' + orgId)) {
          this.programsService.addUsertoContributorOrg(orgId);
      }
      if (this.isContributorOrgUser()
      && !this.router.url.includes('/sourcing')
      &&  !this.router.isActive('/contribute/myenrollprograms', true)) {
        return this.router.navigateByUrl('/contribute/myenrollprograms');
      }

      this.isContributor = this.router.url.includes('/contribute');
      this.activeAllProgramsMenu =  this.router.isActive('/contribute', true);
      this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);

      if (this.isContributor) {
        if (this.activeMyProgramsMenu) {
          this.getMyProgramsForContrib('Live');
        } else if (this.activeAllProgramsMenu) {
          this.getAllProgramsForContrib('public', 'Live');
        } else {
          this.showLoader = false;
        }
      } else {
        this.getMyProgramsForOrg('Live');
      }
  }

  isUserOrgAdmin() {
    return !!(this.userService.userRegistryData && this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org &&
      this.userService.userProfile.userRegData.User_Org.roles.includes('admin'));
  }

  isContributorOrgUser() {
    return !!(this.userService.userRegistryData && this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org &&
      this.userService.userProfile.userRegData.User_Org.roles.includes('user'));
  }

  checkIfUserBelongsToOrg() {
    return !!(this.userService.userRegistryData && this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org);
  }

  /**
   * fetch the list of programs.
   */
  private getAllProgramsForContrib(type, status) {
    this.programsService.getAllProgramsByType(type, status).subscribe(
      response => {
        const allPrograms = _.get(response, 'result.programs');
        if (allPrograms.length) {
          if (this.isUserOrgAdmin()) {
            this.iscontributeOrgAdmin = true;
            const filters = {
              organisation_id: _.get(this.userService, 'userProfile.userRegData.User_Org.orgId')
            };
            this.programsService.getNominationList(filters)
              .subscribe(
                (nominationsResponse) => {
                const nominations = _.get(nominationsResponse, 'result');
                let enrolledPrograms = [];
                if (!_.isEmpty(nominations)) {
                  enrolledPrograms = _.uniq(_.map(nominations, 'program_id'));
                }
                this.filterOutEnrolledPrograms(allPrograms, enrolledPrograms);
              }, (error) => {
                console.log(error);
                this.toasterService.error(this.resourceService.messages.emsg.projects.m0002);
              });
          } else {
            this.iscontributeOrgAdmin = false;
            const req = {
              request: {
                filters: {
                  enrolled_id: {
                    user_id: _.get(this.userService, 'userProfile.userId'),
                  },
                  status: status
                }
              }
            };
            this.programsService.getMyProgramsForContrib(req)
            .subscribe((myProgramsResponse) => {
                const enrolledPrograms = _.map(_.get(myProgramsResponse, 'result.programs'), (nomination: any) => {
                  return nomination.program_id;
                });
                this.filterOutEnrolledPrograms(allPrograms, enrolledPrograms);
              }, error => {
                this.showLoader = false;
                this.toasterService.error(_.get(error, 'error.params.errmsg') || this.resourceService.messages.emsg.projects.m0001);
              }
            );
          }
        } else {
          this.showLoader = false;
        }
      }, error => {
        this.showLoader = false;
        this.toasterService.error(_.get(error, 'error.params.errmsg') || this.resourceService.messages.emsg.projects.m0001);
      }
    );
  }

  filterOutEnrolledPrograms(allPrograms, enrolledPrograms) {
    if (!_.isEmpty(enrolledPrograms)) {
      const temp = _.filter(allPrograms, program => {
        return !enrolledPrograms.includes(program.program_id);
      });
      this.programs = this.filterProgramByDate(temp);
    } else {
      this.programs = this.filterProgramByDate(allPrograms);
    }
    this.count = this.programs.length;
    this.tempSortPrograms = this.programs;
    this.showLoader = false;
  }

  filterProgramByDate(programs) {
    const todayDate = new Date();
    const dates = this.datePipe.transform(todayDate, 'yyyy-MM-dd');
    const filteredProgram = [];
    _.forEach(programs, (program) => {
      const nominationEndDate = this.datePipe.transform(program.nomination_enddate, 'yyyy-MM-dd');
      if (nominationEndDate >= dates ) {
        filteredProgram.push(program);
      }
    });
    return filteredProgram;
  }

  sortCollection(column) {
    this.programs =  this.programsService.sortCollection(this.tempSortPrograms, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  resetSorting() {
    this.sortColumn = 'name';
    this.direction = 'asc';
  }

  public getContributionProgramList(req) {
    this.programsService.getMyProgramsForContrib(req)
        .subscribe((response) => {
        this.programs = _.map(_.get(response, 'result.programs'), (nomination: any) => {
          if (nomination.program) {
            nomination.program = _.merge({}, nomination.program, {
              contributionDate: nomination.createdon,
              nomination_status: nomination.status,
              nominated_collection_ids: nomination.collection_ids
            });
            return  nomination.program;
          } else {
            nomination = _.merge({}, nomination, {
              contributionDate: nomination.createdon,
              nomination_status: nomination.status,
              nominated_collection_ids: nomination.collection_ids
            });
            return  nomination;
          }

        });
        this.showLoader = false;
        this.enrollPrograms = this.programs;
        this.tempSortPrograms = this.programs;
        this.count = _.get(response, 'result.count');
      }, error => {
        console.log(error);
        // TODO: Add error toaster
      });
  }

  /**
   * fetch the list of programs.
   */
  private getMyProgramsForContrib(status) {
    // If user is an org
    if (this.checkIfUserBelongsToOrg()) {
      // If user is not an org admin
      if (!this.isUserOrgAdmin()) {
        const filters = {
          organisation_id: this.userService.userProfile.userRegData.User_Org.orgId
        };
        this.iscontributeOrgAdmin = false;
        this.programsService.getNominationList(filters)
        .subscribe(
          (data) => {
            // Get only those programs for which user has been added contributor or reviewer and the nomination is in "Approved" state
            if (data.result && data.result.length > 0) {
              this.nominationList = _.uniq(_.map(_.filter(data.result, obj => {
                if (obj.rolemapping
                  && ((obj.rolemapping.CONTRIBUTOR && obj.rolemapping.CONTRIBUTOR.includes(_.get(this.userService, 'userProfile.userId' )))
                  || ( obj.rolemapping.REVIEWER && obj.rolemapping.REVIEWER.includes(_.get(this.userService, 'userProfile.userId' ))))
                  && obj.status === 'Approved') {
                    this.roleMapping.push(obj);
                    return obj;
                  }
              }), 'program_id'));
              if (!_.isUndefined(this.nominationList) && this.nominationList.length > 0) {
                const req = {
                  request: {
                    filters: {
                      program_id: this.nominationList,
                      status: status
                    }
                  }
                };
                this.getContributionProgramList(req);
              } else {
                this.showLoader = false;
              }
            } else {
              this.showLoader = false;
            }
          }, (error) => {
            console.log(error);
            this.toasterService.error(this.resourceService.messages.emsg.projects.m0002);
          });
        } else {
          // If user is an org admin
          const filters = {
            organisation_id: this.userService.userProfile.userRegData.User_Org.orgId
          };
          this.iscontributeOrgAdmin = true;
          this.programsService.getNominationList(filters)
            .subscribe(
              (nominationsResponse) => {
              const nominations = _.get(nominationsResponse, 'result');
              if (!_.isEmpty(nominations)) {
                this.nominationList = _.uniq(_.map(nominations, 'program_id'));
                const req = {
                  request: {
                    filters: {
                      program_id: this.nominationList,
                      status: status
                    }
                  }
                };
                this.programsService.getMyProgramsForContrib(req).subscribe((programsResponse) => {
                  // Get only those programs for which the nominations are added
                  const programs = _.get(programsResponse, 'result.programs');
                  this.programs = _.map(programs, (program) => {
                    const nomination = _.find(nominations, (n) => {
                      return n.program_id === program.program_id;
                    });
                    if (nomination) {
                      program = _.merge(program , {
                        contributionDate: nomination.createdon,
                        nomination_status: nomination.status,
                        nominated_collection_ids: nomination.collection_ids
                      });
                      return program;
                    }
                  });
                  this.enrollPrograms = this.programs;
                  this.tempSortPrograms = this.programs;
                  this.count = this.programs.length;
                  this.sortColumn = 'createdon';
                  this.direction = 'desc';
                  this.sortCollection(this.sortColumn);
                  this.showLoader = false;
              });
            } else {
              this.showLoader = false;
            }
          }, (error) => {
            this.showLoader = false;
            console.log(error);
            this.toasterService.error(this.resourceService.messages.emsg.projects.m0002);
          });
      }
    } else {
      // If user is an individual user
      const req = {
        request: {
          filters: {
            enrolled_id: {
              user_id: _.get(this.userService, 'userProfile.userId'),
            },
            status: status
          }
        }
      };
      this.getContributionProgramList(req);
    }
  }

  getMyProgramRole(program) {
    let programId = program.program_id;
    let roles = '';
     _.map(_.find(this.roleMapping, obj => {
      if (obj.rolemapping
        && (( obj.rolemapping.REVIEWER && obj.rolemapping.REVIEWER.includes(_.get(this.userService, 'userProfile.userId' ))))
        && obj.status === 'Approved' && obj.program_id === programId ) {
          roles = 'Reviewer';
        } else if  (obj.rolemapping
        && (( obj.rolemapping.CONTRIBUTOR && obj.rolemapping.CONTRIBUTOR.includes(_.get(this.userService, 'userProfile.userId' ))))
        && obj.status === 'Approved' && obj.program_id === programId ) {
          roles = 'Contributor';
        }
    }));
    return roles;
  }

  getContributionOrgUsers(selectedProgram) {
    this.selectedProgramToAssignRoles = selectedProgram.program_id;
    this.showAssignRoleModal = true;
    const orgUsers = this.registryService.getContributionOrgUsers(this.userService.userProfile.userRegData.User_Org.orgId);
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
                   this.contributorOrgUser.push(r.result.User);
                  }
                });
              }

            }, error => {
              console.log(error);
            });
        }
      }, error => {
        console.log(error);
      });
  }

  /**
   * fetch the list of programs.
   */
  private getMyProgramsForOrg(status) {
    const filters = {
      rootorg_id: _.get(this.userService, 'userProfile.rootOrgId'),
      status: status
    };
    // tslint:disable-next-line:max-line-length
    if (!_.includes(this.userService.userProfile.userRoles, 'ORG_ADMIN') && _.includes(this.userService.userProfile.userRoles, 'CONTENT_REVIEWER')) {
       filters['role'] = ['REVIEWER'];
       filters['user_id'] = this.userService.userProfile.userId;
    }
    return this.programsService.getMyProgramsForOrg(filters).subscribe((response) => {
      this.programs = _.get(response, 'result.programs');
      this.count = _.get(response, 'result.count');
      this.tempSortPrograms = this.programs;
      this.showLoader = false;
    }, error => {
      this.showLoader = false;
      console.log(error);
      // TODO: Add error toaster
    });
  }

  getProgramTextbooksCount(program) {
    let count = 0;

    if (program.nominated_collection_ids && program.nominated_collection_ids.length) {
      count = program.nominated_collection_ids.length;
    } else if (program.collection_ids && program.collection_ids.length) {
      count = program.collection_ids.length;
    }

    if (count < 2) {
      return count + ' ' + this.resourceService.frmelmnts.lbl.textbook;
    }

    return count + ' ' + this.resourceService.frmelmnts.lbl.textbooks;
  }

  getProgramInfo(program, type) {
    const config = JSON.parse(program.config);
    return type  === 'board' ? config[type] : _.join(_.compact(config[type]), ', ');
  }

  getProgramNominationStatus(program) {
    return program.nomination_status;
  }

  getSourcingOrgName(program) {
    return program.sourcing_org_name ? program.sourcing_org_name : '-';
  }

  getProgramContentTypes(program) {
    if (_.isEmpty(program) || _.isEmpty(program.program_id)) {
      return false;
    }

    return this.programsService.getContentTypesName(program.content_types);
  }

  viewDetailsBtnClicked(program) {
    if (this.isContributor) {
      if (this.activeMyProgramsMenu) {
        if (program.nomination_status === 'Initiated') {
          return this.router.navigateByUrl('/contribute/program/' + program.program_id);
        }
        return this.router.navigateByUrl('/contribute/nominatedtextbooks/' + program.program_id);
      }

      if (this.activeAllProgramsMenu) {
        return this.router.navigateByUrl('/contribute/program/' + program.program_id);
      }
    } else {
      return this.router.navigateByUrl('/sourcing/nominations/' + program.program_id);
    }
  }

  isActive(program, name, index) {
    const date  = moment(program[name]);
    const today = moment();
    const isFutureDate = date.isAfter(today);

    if (!this.activeDates[index]) {
      this.activeDates[index] = {};
    }

    if (name === 'nomination_enddate' && isFutureDate) {
      this.activeDates[index]['nomination_enddate'] = true;
      return true;
    }

    if (!this.activeDates[index]['nomination_enddate'] && name === 'shortlisting_enddate' && isFutureDate) {
      this.activeDates[index]['shortlisting_enddate'] = true;
      return true;
    }

    if (!this.activeDates[index]['nomination_enddate']  && !this.activeDates[index]['shortlisting_enddate']
     && name === 'content_submission_enddate' && isFutureDate) {
      this.activeDates[index]['content_submission_enddate'] = true;
      return true;
    }

    if (!this.activeDates[index]['nomination_enddate']  && !this.activeDates[index]['shortlisting_enddate']  &&
    !this.activeDates[index]['content_submission_enddate'] && name === 'content_submission_enddate' && isFutureDate) {
      this.activeDates[index]['enddate'] = true;
      return true;
    }
  }

  assignRolesToOrgUsers() {
    const roleMap = {};
    _.forEach(this.roles, role => {
      roleMap[role.name] = _.filter(this.contributorOrgUser, user => {
        if (user.selectedRole === role.name) {  return user.userId; }
      }).map(({userId}) => userId);
    });

    const req = {
      'request': {
          'program_id': this.selectedProgramToAssignRoles,
          'user_id': this.userService.userid,
          'rolemapping': roleMap
      }
    };
    const updateNomination = this.programsService.updateNomination(req);
    updateNomination.subscribe(response => {
      this.showAssignRoleModal = false;
      this.toasterService.success('Roles updated');
    }, error => {
      console.log(error);
    });
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }
}
