import { Component, OnInit } from '@angular/core';
import { ProgramsService, RegistryService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IProgram } from '../../../core/interfaces';
import * as _ from 'lodash-es';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit {

  public programs: IProgram[];
  public count = 0;
  public isContributor: boolean;
  public activeAllProgramsMenu: boolean;
  public activeMyProgramsMenu: boolean;

  constructor(private programsService: ProgramsService, private registryService: RegistryService,
    public resourceService: ResourceService, private activatedRoute: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {
    this.checkIfUserIsContributor();
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
             // this.getMyProgramsForContrib(); // TODO remove after my programs api ready
             this.getAllProgramsForContrib('public');
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
      this.programs = _.get(response, 'result.programs');
      this.count = _.get(response, 'result.count');
    }, error => {
      console.log(error);
      // TODO: Add error toaster
    });
  }

  private getContributionOrgUsers() {
      const orgUsers = this.registryService.getContributionOrgUsers('1-27ea8585-d081-49f9-94ca-54c57b348689');

      orgUsers.subscribe(response => {
        console.log(response);
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
    const count = program.collection_ids ? program.collection_ids.length : 0 ;

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
    return program.nomination_status || 'Pending';
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
}
