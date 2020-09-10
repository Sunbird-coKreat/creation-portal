import { Component, OnInit } from '@angular/core';
import { ProgramsService, RegistryService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IProgram } from '../../../core/interfaces';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss'],
  providers: [DatePipe]
})
export class ProgramListComponent implements OnInit {

  public programs: IProgram[];
  public program: any;
  public programIndex: number;
  public count = 0;
  public activeDates = <any>[];
  public isContributor: boolean;
  public activeAllProgramsMenu: boolean;
  public activeMyProgramsMenu: boolean;
  public contributorOrgUser = [];
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
  public issourcingOrgAdmin = false;
  public selectedProgramToModify: any;
  public showModifyConfirmation: boolean;

  showDeleteModal = false;
  constructor(public programsService: ProgramsService, private toasterService: ToasterService, private registryService: RegistryService,
    public resourceService: ResourceService, private userService: UserService, private activatedRoute: ActivatedRoute,
    public router: Router, private datePipe: DatePipe, public configService: ConfigService) { }

  ngOnInit() {
    this.checkIfUserIsContributor();
    this.issourcingOrgAdmin = this.userService.isSourcingOrgAdmin();
    this.telemetryInteractCdata = [];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
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
    if (this.router.url.includes('/join/' + orgId)) {
      this.programsService.addUsertoContributorOrg(orgId);
    }
    if (this.userService.isContributingOrgUser()
      && !this.router.url.includes('/sourcing')
      && !this.router.isActive('/contribute/myenrollprograms', true)) {
      return this.router.navigateByUrl('/contribute/myenrollprograms');
    }

    this.isContributor = this.router.url.includes('/contribute');
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true);
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);

    if (this.isContributor) {
      if (this.activeMyProgramsMenu) {
        this.getMyProgramsForContrib(['Live', 'Unlisted']);
      } else if (this.activeAllProgramsMenu) {
        this.getAllProgramsForContrib('public', ['Live', 'Unlisted']);
      } else {
        this.showLoader = false;
      }
    } else {
      this.getMyProgramsForOrg();
    }
  }

  setDelete(program, index) {
    if (!this.issourcingOrgAdmin) {
      this.toasterService.error(this.resourceService.messages.imsg.m0035);
      return this.router.navigate(['home']);
    }

    this.program = program;
    this.programIndex = index;

    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.program.program_id,
            status: ['Pending', 'Approved']
          },
          fields: ['organisation_id', 'status'],
          limit: 0
        }
      }
    };

    this.programsService.getNominationList(req.data.request.filters)
      .subscribe((nominationsResponse) => {
        const nominations = _.get(nominationsResponse, 'result');

        if (nominations.length > 1) {
          this.toasterService.error(this.resourceService.frmelmnts.lbl.projectCannotBeDeleted);
          this.showDeleteModal = false;

          return false;
        }

        this.showDeleteModal = true;
      },
        error => {
          console.log(error);
        });

  }

  deleteProject($event: MouseEvent) {
    if (!this.issourcingOrgAdmin) {
      this.toasterService.error(this.resourceService.messages.imsg.m0035);
      return this.router.navigate(['home']);
    }

    const programData = {
      'program_id': this.program.program_id,
      'status': 'Retired'
    };

    this.programsService.updateProgram(programData).subscribe(
      (res) => {
        this.toasterService.success(this.resourceService.frmelmnts.lbl.successTheProjectHasBeenDeleted);
        ($event.target as HTMLButtonElement).disabled = false;
        this.programs.splice(this.programIndex, 1);
        this.showDeleteModal = false;
      },
      (err) => {
        console.log(err, err)
        this.toasterService.error(this.resourceService.frmelmnts.lbl.errorMessageTheProjectHasBeenDeleted);
        ($event.target as HTMLButtonElement).disabled = false;
      }
    );
  }

  /**programContext
   * fetch the list of programs.
   */
  private getAllProgramsForContrib(type, status) {
    this.programsService.getAllProgramsByType(type, status).subscribe(
      response => {
        const allPrograms = _.get(response, 'result.programs');
        if (allPrograms.length) {
          if (this.userService.isContributingOrgAdmin()) {
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
      if (nominationEndDate >= dates) {
        filteredProgram.push(program);
      }
    });
    return filteredProgram;
  }

  sortCollection(column) {
    this.programs = this.programsService.sortCollection(this.tempSortPrograms, column, this.direction);
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
            return nomination.program;
          }

          nomination = _.merge({}, nomination, {
            contributionDate: nomination.createdon,
            nomination_status: nomination.status,
            nominated_collection_ids: nomination.collection_ids
          });
          return nomination;
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
    // If user is an individual user
    if (!this.userService.isUserBelongsToOrg()) {
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
      return;
    }

    // If user is an org admin
    if (this.userService.isContributingOrgAdmin()) {
      this.iscontributeOrgAdmin = true;
      this.getNominationsByMyOrg().subscribe(
        (nominationsResponse) => {
          const nominations = _.get(nominationsResponse, 'result');
          if (_.isEmpty(nominations)) {
            this.showLoader = false;
            return;
          }

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
                program = _.merge(program, {
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
        }, (error) => {
          this.showLoader = false;
          console.log(error);
          this.toasterService.error(this.resourceService.messages.emsg.projects.m0002);
        });
      return;
    }

    // If user is contributor org contributor and/or reviewer
    this.iscontributeOrgAdmin = false;
    this.getNominationsByMyOrg().subscribe(
      (data) => {
        let nominations = _.get(data, 'result');
        if (_.isEmpty(nominations)) {
          this.showLoader = false;
          return;
        }

        this.nominationList = this.getProgramsAssignedToMe(nominations);
        if (_.isEmpty(this.nominationList)) {
          this.showLoader = false;
          return;
        }

        const req = {
          request: {
            filters: {
              program_id: this.nominationList,
              status: status
            }
          }
        };
        this.getContributionProgramList(req);
      },
      (error) => {
        console.log(error);
        this.toasterService.error(this.resourceService.messages.emsg.projects.m0002);
      });
  }

  getProgramsAssignedToMe(nominations) {
    const nominationsAssignedToMe = _.filter(nominations, (nomination) => {
      const myRoles = this.userService.getMyRoleForProgram(nomination);

      if (myRoles.includes('CONTRIBUTOR') || myRoles.includes('REVIEWER') && nomination.status === 'Approved') {
        this.roleMapping.push(nomination);
        return true;
      }
    });

    return _.uniq(_.map(nominationsAssignedToMe, 'program_id'));
  }

  getNominationsByMyOrg() {
    const filters = {
      organisation_id: this.userService.userProfile.userRegData.User_Org.orgId
    };
    return this.programsService.getNominationList(filters);
  }

  getMyProgramRole(program) {
    const nomination = _.find(this.roleMapping, { program_id: program.program_id });
    const roles = this.userService.getMyRoleForProgram(nomination);
    if (_.isEmpty(roles)) {
      return '-';
    }
    return _.map(roles, role => _.upperFirst(_.toLower(role))).join(", ");
  }

  /**
   * fetch the list of programs.
   */
  private getMyProgramsForOrg() {
    const filters = {};

    if (this.userService.isSourcingOrgAdmin()) {
      filters['rootorg_id'] = _.get(this.userService, 'userProfile.rootOrgId');
      filters['status'] = ['Live', 'Unlisted', 'Draft']
    } else {
      filters['status'] = ['Live', 'Unlisted']
      filters['role'] = ['REVIEWER'];
      filters['user_id'] = this.userService.userProfile.userId;
    }
    // tslint:disable-next-line:max-line-length
    /*if (!_.includes(this.userService.userProfile.userRoles, 'ORG_ADMIN') && _.includes(this.userService.userProfile.userRoles, 'CONTENT_REVIEWER')) {

    }*/
    return this.programsService.getMyProgramsForOrg(filters).subscribe((response) => {
      this.programs = _.get(response, 'result.programs');
      this.count = _.get(response, 'result.count');
      this.tempSortPrograms = this.programs;
      this.showLoader = false;
      this.fetchProjectFeedDays();
    }, error => {
      this.showLoader = false;
      console.log(error);
      // TODO: Add error toaster
    });
  }

  getProgramTextbooksCount(program) {
    let count = 0;

    // tslint:disable-next-line:max-line-length
    if (program.nominated_collection_ids && program.nominated_collection_ids.length && _.get(program, 'nomination_status') !== 'Initiated') {
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
    if (program && program.config) {
      return type === 'board' ? program.config[type] : _.join(_.compact(_.uniq(program.config[type])), ', ');
    } else {
      return type === 'board' ? program[type] : _.join(_.compact(_.uniq(JSON.parse(program[type]))), ', ');
    }
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
      return this.router.navigateByUrl('/contribute/program/' + program.program_id);
    } else {
      return this.router.navigateByUrl('/sourcing/nominations/' + program.program_id);
    }
  }

  editOnClick(program) {
    return this.router.navigateByUrl('/sourcing/edit/' + program.program_id);
  }

  isActive(program, name, index) {
    const date = moment(program[name]);
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

    if (!this.activeDates[index]['nomination_enddate'] && !this.activeDates[index]['shortlisting_enddate']
      && name === 'content_submission_enddate' && isFutureDate) {
      this.activeDates[index]['content_submission_enddate'] = true;
      return true;
    }

    if (!this.activeDates[index]['nomination_enddate'] && !this.activeDates[index]['shortlisting_enddate'] &&
      !this.activeDates[index]['content_submission_enddate'] && name === 'content_submission_enddate' && isFutureDate) {
      this.activeDates[index]['enddate'] = true;
      return true;
    }
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }

  canNominate(program) {
    const today = moment();
    return moment(program.nomination_enddate).isSameOrAfter(today, 'day');
  }

  getProjectToModify(program) {
    this.selectedProgramToModify = program;
    this.showModifyConfirmation = true;
  }

  modifyNomination() {
    if (this.selectedProgramToModify) {
      // Update nomination back to Initiated stage
      const req = {
        program_id: this.selectedProgramToModify.program_id,
        status: 'Initiated',
        updatedby: this.userService.userProfile.userId
      };

      this.programsService.addorUpdateNomination(req).subscribe((data) => {
        if (data === 'Approved' || data === 'Rejected') {
          this.toasterService.error(`${this.resourceService.messages.emsg.modifyNomination.error} ${data}`);
          this.ngOnInit();
        } else {
          this.router.navigateByUrl('/contribute/program/' + this.selectedProgramToModify.program_id);
        }
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
      });
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
    }
  }

  getNotificationData() {
    const reqData = {
        nomination: {
            programId: _.map(this.getProgramsForNotification('nomination'), 'program_id'),
            status: [
                'Pending'
            ]
        },
        contribution: {
            programId: _.map(this.getProgramsForNotification('contribution'), 'program_id'),
            status: [
                'Live'
            ]
        },
        channel: _.get(this.userService, 'userProfile.rootOrgId')
    };
    if (!_.isEmpty(reqData.nomination.programId) || !_.isEmpty(reqData.contribution.programId) ) {
      this.programsService.getProgramsNotificationData(reqData).subscribe(data => {
        if (!_.isEmpty(data.result)) {
          const countData = data.result;
          _.forEach(this.programs, prg => {
            if (_.get(_.get(countData, prg.program_id), 'nominationCount') ||
                  _.get(_.get(countData, prg.program_id), 'contributionCount')) {
              prg['notificationData'] = _.get(countData, prg.program_id);
            }
          });
          this.programsService.sendprogramsNotificationData(this.programs);
        }
      });
    }
  }

  getProgramsForNotification(query) {
    let programsForNotification;
    if (query === 'nomination') {
      programsForNotification = _.filter(this.programs, program => {
        if (program.status === 'Live' && program.nomination_enddate &&
            // tslint:disable-next-line:max-line-length
            ((new Date().getTime() - new Date(program.nomination_enddate).getTime()) / (1000 * 60 * 60 * 24) <= _.toNumber(this.programsService.projectFeedDays))) {
              return program;
        }
      });
      return programsForNotification;
    } else if (query === 'contribution') {
      programsForNotification = _.filter(this.programs, program => {
        if (program.status === 'Live' && program.content_submission_enddate &&
            // tslint:disable-next-line:max-line-length
            ((new Date().getTime() - new Date(program.content_submission_enddate).getTime()) / (1000 * 60 * 60 * 24) <= _.toNumber(this.programsService.projectFeedDays))) {
              return program;
        }
      });
      return programsForNotification;
    }
  }

  fetchProjectFeedDays() {
    if (!this.programsService.projectFeedDays) {
      this.programsService.fetchProjectFeedDays().subscribe(data => data && this.getNotificationData());
    } else {
      this.getNotificationData();
    }
  }
}
