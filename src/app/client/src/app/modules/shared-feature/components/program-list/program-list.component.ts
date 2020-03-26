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
  public sortPrograms: any;
  public filterProgramsByType: any;
  public direction = 'asc';
  public enrollPrograms: IProgram[];
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public nominationList;
  constructor(private programsService: ProgramsService, private toasterService: ToasterService, private registryService: RegistryService,
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
    this.programsService.allowToContribute$.pipe(
      tap((isContributor: boolean) => {
        // TODO implement based on api and remove url checks
        // this.isContributor = !isContributor;
        const orgId = this.activatedRoute.snapshot.params.orgId;

        // Check if user part of that organisation
        if (this.router.url.includes('/contribute/join/' + orgId)) {
            this.programsService.addUsertoContributorOrg(orgId);
        }

        this.isContributor = this.router.url.includes('/contribute');
        this.activeAllProgramsMenu = this.router.isActive('/contribute', true);
        this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);

        if (this.isContributor) {
          if (this.activeAllProgramsMenu) {
            this.getAllProgramsForContrib('public', 'Live');
          }

          if (this.activeMyProgramsMenu) {
            this.getMyProgramsForContrib('Live');
          }
        } else {
          this.getMyProgramsForOrg('Live');
        }
      })
    ).subscribe();
  }

  /**
   * fetch the list of programs.
   */
  private getAllProgramsForContrib(type, status) {
    return this.programsService.getAllProgramsByType(type, status).subscribe(
      response => {
        this.programs = _.get(response, 'result.programs');
        if (this.programs.length) {
           const program = this.filterProgramByDate(this.programs);
           const nominatedPrograms  = [];
           this.programsService.getMyProgramsForContrib('Live').subscribe((response) => {
            _.map(_.get(response, 'result.programs'), (nomination) => {
              nomination.program.contributionDate = nomination.createdon;
              nomination.program.nomination_status = nomination.status;
              nomination.program.nominated_collection_ids = nomination.collection_ids;
              nominatedPrograms.push(nomination.program);
            });

            this.mergeAllAndNominatedPrograms(program,nominatedPrograms)
          }, error => {
            console.log(error);
            // TODO: Add error toaster
          });
          
          
        }
      }
    );

    
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

  sort(colName) {
    if (this.direction === 'asc'){
      this.programs =  this.sortPrograms.sort((a,b) => a[colName].localeCompare(b[colName]));
      this.direction = 'dsc';
    } else {
      this.programs =  this.sortPrograms.sort((a,b) => b[colName].localeCompare(a[colName]));
      this.direction = 'asc';
    }
  }
  public getContributionProgramList(req) {
    this.programsService.getMyProgramsForContrib(req)
        .subscribe((response) => {

        this.programs = _.map(_.get(response, 'result.programs'), (nomination: any) => {
          if(nomination.program) {
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
        this.enrollPrograms = this.programs;
        this.count = _.get(response, 'result.count');
      }, error => {
        console.log(error);
        // TODO: Add error toaster
      });
  }

  mergeAllAndNominatedPrograms(allPrograms,enrolledPrograms)
  {
    _.map(allPrograms, (allProgram) => {
      _.map(enrolledPrograms, (enrolledProgram) => {
        if(allProgram.program_id == enrolledProgram.program_id)
        {
          Object.assign(allProgram,enrolledProgram);
        }
      }); 
    });
    this.filterProgramsByType = allPrograms;
    this.sortPrograms = allPrograms
    this.programs = allPrograms;
    this.count = this.programs.length;

   }

   filterProgramByType(type)
   {
    if(type == 'nominated_programs')
    {
          this.programs = this.filterProgramsByType.filter(
                nominatedPrograms => 
                nominatedPrograms.nomination_status == "Pending" || nominatedPrograms.nomination_status == "Initiated" || nominatedPrograms.nomination_status == "Approved" || nominatedPrograms.nomination_status == "Rejected" );  
          this.sortPrograms = this.programs;
          this.count = this.programs.length;       
    }
    else if(type == 'all_programs')
    {
      this.programs = this.filterProgramsByType;
      this.sortPrograms = this.programs;
      this.count = this.programs.length; 
    }
   }
  /**
   * fetch the list of programs.
   */
  private getMyProgramsForContrib(status) {
    if (!_.isEmpty(this.userService.userProfile.userRegData)
    && this.userService.userProfile.userRegData.User_Org.roles.indexOf('admin') === -1) {
      const filters = {
        organisation_id: this.userService.userProfile.userRegData.User_Org.orgId
      };
      this.programsService.getNominationList(filters)
        .subscribe(
          (data) => {
          if (data.result && data.result.length > 0) {
            this.nominationList = _.map(_.filter(data.result, obj => {
             return obj.status === 'Approved';
            }), 'program_id');
            const req = {
              request: {
                filters: {
                  program_id: this.nominationList,
                  status: status
                }
              }
            };
            this.getContributionProgramList(req);
          }
        }, (error) => {
          console.log(error);
          this.toasterService.error('Fetching nominated program failed');
        });
    } else {
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
    return this.programsService.getMyProgramsForOrg(status).subscribe((response) => {
      this.programs = _.get(response, 'result.programs');
      this.count = _.get(response, 'result.count');
    }, error => {
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
    return type  === 'board' ? config[type] : _.join(config[type], ', ');
  }

  getProgramNominationStatus(program) {
    return program.nomination_status ? program.nomination_status : '' ;
  }

  getSourcingOrgName(program) {
    return program.sourcing_org_name ? program.sourcing_org_name : '-';
  }

  getProgramContentTypes(program) {
    return _.join(program.content_types, ', ');
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
