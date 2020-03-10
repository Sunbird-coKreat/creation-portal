import { Component, OnInit } from '@angular/core';
import { ProgramsService } from '@sunbird/core';
import { tap } from 'rxjs/operators';
import { ResourceService, ToasterService } from '@sunbird/shared';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit {

  public programs;
  private isContributor: boolean;
  private activeAllProgramsMenu: boolean;
  private activeMyProgramsMenu: boolean;

  constructor(private programsService: ProgramsService, public resourceService: ResourceService, private activatedRoute: ActivatedRoute,
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
          this.getProgramsForContributors();
        } else {
          this.getMyProgramsForOrg();
        }

        console.log("Am I contributor : ", this.isContributor);
        console.log("activeMyProgramsMenu : ", this.activeMyProgramsMenu);
        console.log("activeAllProgramsMenu : ", this.activeAllProgramsMenu);
      })
    ).subscribe();
  }

  /**
   * fetch the list of programs.
   */
  private getProgramsForContributors() {
    return this.programsService.getProgramsForContributors().subscribe(
      programs => {
        this.programs = programs;
      }
    );
  }

  /**
   * fetch the list of programs.
   */
  private getMyProgramsForOrg() {
    return this.programsService.getMyProgramsForOrg().subscribe(
      programs => {
        this.programs = programs;
      }
    );
  }

  private getProgramTextbooks(program) {
    return _.join(_.map(program.textbooks, 'name'), ', ');
  }

  private getProgramGrades(program) {
    let grades = program.grades;

    if (!grades) return '-';

    return _.join(_.map(grades, 'name'), ', ');
  }

  private getProgramSubjects(program) {
    let subjects = program.subjects;

    if (!subjects) return '-';

    return _.join(_.map(subjects, 'name'), ', ');
  }

  private getProgramMediums(program) {
    let mediums = program.mediums;

    if (!mediums) return '-';

    return _.join(_.map(mediums, 'name'), ', ');
  }

  private getProgramBoard(program) {
    return program.board;
  }

  private getProgramStatus(program) {
    return program.nomination_status;
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
