import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProgramsService, UserService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { Router } from '@angular/router';
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
  public currentFilters: any
  public setPreferences = {};
  public activeAllProgramsMenu: any;
  public activeMyProgramsMenu: any;
  public activeUser: string;
  public nominationContributionStatus = [{ 'name': 'Open', 'value': 'open' }, { 'name': 'Closed', 'value': 'closed' }, { 'name': 'Any', 'value': 'any' }];
  constructor(public sbFormBuilder: FormBuilder, public programsService: ProgramsService,
    public resourceService: ResourceService, private userService: UserService, public router: Router) { }

  ngOnInit() {
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true);
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);
    this.createFilterForm();
    this.currentFilters = {
      'rootorg_id': '',
      'medium': [],
      'gradeLevel': [],
      'subject': [],
      'contentTypes': [],
      'nominations': this.nominationContributionStatus,
      'contributions': this.nominationContributionStatus
    }
    this.checkFilterShowCondition();
  }

  createFilterForm() {
    this.filterForm = this.sbFormBuilder.group({
      sourcingOrganisations: [],
      medium: [],
      gradeLevel: [],
      subject: [],
      content_types: [],
      nominations: [],
      contributions: []
    });
  }

  checkFilterShowCondition() {
    if (this.userService.isSourcingOrgAdmin() && this.router.url.includes('/sourcing')) {  // show filter for sourcing org admin for my projects 
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = true;
      this.showFilters['contribution_date'] = true;
      this.activeUser = 'sourcingOrgAdmin';
    } else if (this.activeAllProgramsMenu && this.programsService.checkforshowAllPrograms()) { // for all projects 
      this.showFilters['sourcingOrganisations'] = true;
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
      this.activeUser = 'contributeOrgAdminAllProject';
    } else if (this.activeMyProgramsMenu) { // for my projects for contributor user role  
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
      this.activeUser = 'contributeOrgAdminMyProject';
      this.getFiltersUnionFromList();
    } else {
      this.activeUser = 'sourcingReviwerMyProject';
      this.getFiltersUnionFromList(); // for sourcing reviewer 
    }
    this.getAppliedFiltersDetails();
  }
  getAppliedFiltersDetails() {
    let appliedFilters: any;
    switch (this.activeUser) {
      case 'sourcingOrgAdmin':
        appliedFilters = JSON.parse(localStorage.getItem('sourcingMyProgramAppliedFilters'));
        this.setAppliedFilters(appliedFilters);
        break;
      case 'contributeOrgAdminAllProject':
        appliedFilters = JSON.parse(localStorage.getItem('contributeAllProgramAppliedFilters'));
        this.setAppliedFilters(appliedFilters);
        break;
      case 'contributeOrgAdminMyProject':
        appliedFilters = JSON.parse(localStorage.getItem('contributeMyProgramAppliedFilters'));
        this.setAppliedFilters(appliedFilters);
        break;
      case 'sourcingReviwerMyProject':
        appliedFilters = JSON.parse(localStorage.getItem('sourcingMyProgramAppliedFilters'));
        this.setAppliedFilters(appliedFilters);
        break;
    }
  }
  setAppliedFilters(appliedFilters) {
    if (appliedFilters) {
      this.setPreferences['rootorg_id'] = appliedFilters['rootorg_id'] ? appliedFilters['rootorg_id'] : '';
      this.setPreferences['medium'] = appliedFilters['medium'] ? appliedFilters['medium'] : [];
      this.setPreferences['gradeLevel'] = appliedFilters['gradeLevel'] ? appliedFilters['gradeLevel'] : [];
      this.setPreferences['subject'] = appliedFilters['subject'] ? appliedFilters['subject'] : [];
      this.setPreferences['content_types'] = appliedFilters['content_types'] ? appliedFilters['content_types'] : [];
      this.setPreferences['nomination_date'] = appliedFilters['nomination_date'] ? appliedFilters['nomination_date'] : '';
      this.setPreferences['contribution_date'] = appliedFilters['contribution_date'] ? appliedFilters['contribution_date'] : '';
    }
  }
  getFiltersUnionFromList() {
    _.map(this.programs, (program) => {
      this.currentFilters['gradeLevel'] = _.compact(_.uniq(_.concat(this.currentFilters['gradeLevel'], _.get(program, 'config.gradeLevel') ? program.config.gradeLevel : JSON.parse(program.gradeLevel))));
      this.currentFilters['contentTypes'] = _.compact(_.uniq(_.concat(this.currentFilters['contentTypes'], program.content_types)));
      this.currentFilters['medium'] = _.compact(_.uniq(_.concat(this.currentFilters['medium'], _.get(program, 'config.medium') ? program.config.medium : JSON.parse(program.medium))));
      this.currentFilters['subject'] = _.compact(_.uniq(_.concat(this.currentFilters['subject'], _.get(program, 'config.subject') ? program.config.subject : JSON.parse(program.subject))));
    })
  }
  applyFilter(resetFilter?) {
    const filterLocalStorage = resetFilter ? [] : this.setPreferences;
    switch (this.activeUser) {
      case 'sourcingOrgAdmin': localStorage.setItem('sourcingMyProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
      case 'contributeOrgAdminAllProject': localStorage.setItem('contributeAllProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
      case 'contributeOrgAdminMyProject': localStorage.setItem('contributeMyProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
      case 'sourcingReviwerMyProject': localStorage.setItem('sourcingMyProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
    }
    resetFilter ? this.applyFilters.emit() : this.applyFilters.emit(this.setPreferences);
    this.dismissed();
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
