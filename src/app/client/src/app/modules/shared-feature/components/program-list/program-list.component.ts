import { Component, OnInit } from '@angular/core';
import { ProgramsService } from '@sunbird/core';
import { map, catchError, retry } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent implements OnInit {

  public programs;

  constructor(private programsService: ProgramsService) { }

  ngOnInit() {
    this.getProgramsList();
  }

  /**
   * fetch the list of programs.
   */
  private getProgramsList() {
    return this.programsService.getProgramsForOrg().subscribe(
      programs => this.programs = programs
    );
  }
}
