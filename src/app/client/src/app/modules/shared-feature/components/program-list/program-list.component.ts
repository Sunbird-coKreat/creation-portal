import { Component, OnInit } from '@angular/core';
import { ProgramsService, RegistryService, UserService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IProgram } from '../../../core/interfaces';
import * as _ from 'lodash-es';
import { tap, filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { programContext } from '../../../contribute/components/list-nominated-textbooks/data';
@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
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
  constructor(private programsService: ProgramsService, private registryService: RegistryService,
    public resourceService: ResourceService, private userService: UserService, private activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.checkIfUserIsContributor();
    this.roles = _.get(programContext, 'config.roles');
  }

  /**
   * Check if logged in user is contributor or sourcing org
   */
  private checkIfUserIsContributor() {
    this.programsService.allowToContribute$.pipe(
      tap((isContributor: boolean) => {
        // TODO implement based on api and remove url checks
        // this.isContributor = !isContributor;

        this.isContributor = this.router.url.includes('/contribute');
        this.activeAllProgramsMenu = this.router.isActive('/contribute', true);
        this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);

        if (this.isContributor) {
          if (this.activeAllProgramsMenu) {
            this.getAllProgramsForContrib('public');
          }

          if (this.activeMyProgramsMenu) {
            this.getMyProgramsForContrib();
          }
        } else {
          this.getMyProgramsForOrg();
        }
      })
    ).subscribe();
  }

  /**
   * fetch the list of programs.
   */
  private getAllProgramsForContrib(type) {
    return this.programsService.getAllProgramsForContrib(type).subscribe(
      response => {
        this.programs = _.get(response, 'result.programs');
        this.count = _.get(response, 'result.count');
      }
    );
  }

  /**
   * fetch the list of programs.
   */
  private getMyProgramsForContrib() {
    return this.programsService.getMyProgramsForContrib().subscribe((response) => {
      const programs  = [];
      _.map(_.get(response, 'result.programs'), (nomination) => {
        nomination.program.contributionDate = nomination.createdon;
        nomination.program.nomination_status = nomination.status;
        nomination.program.nominated_collection_ids = nomination.collection_ids;
        programs.push(nomination.program);
      });
      this.programs = programs;
      this.count = _.get(response, 'result.count');
    }, error => {
      console.log(error);
      // TODO: Add error toaster
    });
  }

  private getContributionOrgUsers(selectedProgram) {
    this.selectedProgramToAssignRoles = selectedProgram.program_id;
    this.showAssignRoleModal = true;
      const orgUsers = this.registryService.getContributionOrgUsers('1-27ea8585-d081-49f9-94ca-54c57b348689');
      orgUsers.subscribe(response => {
        const result = _.get(response, 'result');
        if (!result || _.isEmpty(result)) {
          console.log('NO USER FOUND');
        } else {
          const userIds = _.map(result[_.first(_.keys(result))], 'userId');
          const getUserDetails = _.map(userIds, id => this.registryService.getUserDetails(id));
          forkJoin(...getUserDetails)
            .subscribe((res: any) => {
              this.contributorOrgUser = _.map(res, 'result.User');
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
  private getMyProgramsForOrg() {
    return this.programsService.getMyProgramsForOrg().subscribe((response) => {
      this.programs = _.get(response, 'result.programs');
      this.count = _.get(response, 'result.count');
    }, error => {
      console.log(error);
      // TODO: Add error toaster
    });
  }

  private getProgramTextbooksCount(program) {
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

  private getProgramNominationStatus(program) {
    return program.nomination_status;
  }

  getSourcingOrgName(program) {
    return program.sourcing_org_name ? program.sourcing_org_name : '-';
  }

  getProgramContentTypes(program) {
    return _.join(program.content_types, ', ');
  }

  private viewDetailsBtnClicked(program) {
    if (this.isContributor) {
      if (this.activeMyProgramsMenu) {
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
      console.log(response);
    }, error => {
      console.log(error);
    });
  }
}
