import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProgramsService, RegistryService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss']
})
export class ProjectFilterComponent implements OnInit {
  @ViewChild('modal') modal;
  @Input() programs;
  @Output() dismiss = new EventEmitter<any>();
  @Output() applyFilters = new EventEmitter<any>();
  public filterForm: FormGroup;
  public showFilters = {};
  public filtersAppliedCount: any;
  public currentFilters: any
  public setPreferences = {};
  public activeAllProgramsMenu: any;
  public activeMyProgramsMenu: any;
  constructor(public sbFormBuilder: FormBuilder, public programsService: ProgramsService,
    public resourceService: ResourceService, private userService: UserService, public router: Router) { }

  ngOnInit() {
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true);
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);
    this.createFilterForm();
    this.currentFilters = {
      'gradeLevel': [],
      'subject': [],
      'contentTypes': [],
      'medium': [],
      'nominations': ['Open', 'Closed', 'Any'],
      'contributions': ['Open', 'Closed', 'Any']

    }
    this.checkFilterShowCondition();
  }

  createFilterForm() {
    this.filterForm = this.sbFormBuilder.group({
      sourcingOrganisations: [],
      medium: [],
      subject: [],
      gradeLevel: [],
      content_types: [],
      nominations: [],
      contributions: []
    });
  }

  checkFilterShowCondition() {
    this.filtersAppliedCount = 0;
    if (this.userService.isSourcingOrgAdmin() && this.router.url.includes('/sourcing')) {  // show filter for sourcing org admin for my projects 
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = true;
      this.showFilters['contribution_date'] = true;
    } else if (this.activeAllProgramsMenu && this.programsService.checkforshowAllPrograms()) { // for all projects 
      this.showFilters['sourcingOrganisations'] = true;
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
    } else if (this.activeMyProgramsMenu) { // for my projects for contributor user role  

      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
      this.getFiltersUnionFromList();
    } else {
      this.getFiltersUnionFromList(); // for sourcing reviewer 
    }
  }
  getFiltersUnionFromList() {
    _.map(this.programs, (program) => {
      this.currentFilters['gradeLevel'] = _.uniq(_.concat(this.currentFilters['gradeLevel'], _.get(program, 'config.gradeLevel') ? program.config.gradeLevel : JSON.parse(program.gradeLevel)));
      this.currentFilters['contentTypes'] = _.uniq(_.concat(this.currentFilters['contentTypes'], program.content_types));
      this.currentFilters['medium'] = _.uniq(_.concat(this.currentFilters['medium'], _.get(program, 'config.medium') ? program.config.medium : JSON.parse(program.medium)));
      this.currentFilters['subject'] = _.uniq(_.concat(this.currentFilters['subject'], _.get(program, 'config.subject') ? program.config.subject : JSON.parse(program.subject)));
    })
  }
  applyFilter(resetFilter?) {
    resetFilter ? this.applyFilters.emit(): this.applyFilters.emit(this.setPreferences);
    this.dismissed()
  }

  dismissed() {
    this.modal.deny();
    this.dismiss.emit();
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
