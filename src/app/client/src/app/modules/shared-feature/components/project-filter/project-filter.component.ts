import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProgramsService, UserService, FrameworkService } from '@sunbird/core';
import { ResourceService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';
import * as alphaNumSort from 'alphanum-sort';
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
  public isOnChangeFilterEnable: Boolean;
  public originalFiltersScope: any = {};
  public frameworkCategories;
  public nominationContributionStatus = [{ 'name': 'Open', 'value': 'open' }, { 'name': 'Closed', 'value': 'closed' }, { 'name': 'Any', 'value': 'any' }];
  constructor(public sbFormBuilder: FormBuilder, public programsService: ProgramsService, public frameworkService: FrameworkService,
    public resourceService: ResourceService, private userService: UserService, public router: Router, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true);
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);
    this.createFilterForm();
    this.currentFilters = {
      'rootorg_id': [],
      'medium': [],
      'gradeLevel': [],
      'subject': [],
      'contentTypes': [],
      'nominations': this.nominationContributionStatus,
      'contributions': this.nominationContributionStatus
    }
    this.checkFilterShowCondition();
    this.currentFilters['contentTypes'] = this.programsService.contentTypes; // getting global content types all the time 
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
      this.fetchFrameWorkDetails(undefined, undefined);
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = true;
      this.showFilters['contribution_date'] = true;
      this.activeUser = 'sourcingOrgAdmin';
      this.isOnChangeFilterEnable = true;
    } else if (this.activeAllProgramsMenu && this.programsService.checkforshowAllPrograms()) { // for all projects and need to add one more condition for generic and common access
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
      this.isOnChangeFilterEnable = true;
      this.checkTenantAccessSpecification();

    } else if (this.activeMyProgramsMenu) { // for my projects for contributor user role  
      this.getFiltersUnionFromList();
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
      this.isOnChangeFilterEnable = false;
      this.userService.slug ? this.activeUser = 'contributeOrgAdminMyProjectTenantAccess' : this.activeUser = 'contributeOrgAdminMyProject'
    } else {
      this.getFiltersUnionFromList(); // for sourcing reviewer 
      this.activeUser = 'sourcingReviwerMyProject';
      this.isOnChangeFilterEnable = false;
    }
    this.getAppliedFiltersDetails();
  }
  checkTenantAccessSpecification() {
    if (this.userService.slug) { // checking In case the contributor accesses tenant specific contribution page
      this.showFilters['sourcingOrganisations'] = false;
      this.activeUser = 'contributeOrgAdminAllProjectTenantAccess';
      this.fetchFrameWorkDetails(undefined, this.programs[0]['rootorg_id']);
    } else {
      this.getAllSourcingFrameworkDetails();
      this.fetchFrameWorkDetails(undefined, undefined);
      this.showFilters['sourcingOrganisations'] = true;
      this.activeUser = 'contributeOrgAdminAllProject';
    }
  }
  getAllSourcingFrameworkDetails() {
    this.programsService.getAllSourcingFrameworkDetails().subscribe((frameworkInfo: any) => {
      this.currentFilters['rootorg_id'] = _.get(frameworkInfo, 'result.content');
    });
  }
  onChangeSourcingOrg() {
    this.fetchFrameWorkDetails(undefined, this.filterForm.controls.sourcingOrganisations.value);
    this.filterForm.controls['medium'].setValue('');
  }
  fetchFrameWorkDetails(undefined, orgId) {
    this.frameworkService.initialize(undefined, orgId);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkInfo: any) => {
      if (frameworkInfo && !frameworkInfo.err) {
        this.frameworkCategories = frameworkInfo.frameworkdata.defaultFramework.categories;
        this.setFrameworkDataToProgram();
      }
    });
  }
  setFrameworkDataToProgram() {
    const board = _.find(this.frameworkCategories, (element) => {
      return element.code === 'board';
    });
    if (board) {
      const mediumOption = this.programsService.getAssociationData(board.terms, 'medium', this.frameworkCategories);
      if (mediumOption.length) {
        this.currentFilters['medium'] = mediumOption;
      }
    }

    this.frameworkCategories.forEach((element) => {
      const sortedArray = alphaNumSort(_.reduce(element['terms'], (result, value) => {
        result.push(value['name']);
        return result;
      }, []));
      const sortedTermsArray = _.map(sortedArray, (name) => {
        return _.find(element['terms'], { name: name });
      });
      this.currentFilters[element['code']] = sortedTermsArray;
      this.originalFiltersScope[element['code']] = sortedTermsArray;
    });

    const Kindergarten = _.remove(this.currentFilters['gradeLevel'], (item) => {
      return item.name === 'Kindergarten';
    });
    this.currentFilters['gradeLevel'] = [...Kindergarten, ...this.currentFilters['gradeLevel']];
  }
  onMediumChange() {
    if (this.isOnChangeFilterEnable) { // should enable for sourcing org admin(my projects tab) and for contributor org all projects and induvidual contributor all projects
      this.filterForm.controls['gradeLevel'].setValue('');
      this.filterForm.controls['subject'].setValue('');
      if (!_.isEmpty(this.filterForm.value.medium)) {
        // tslint:disable-next-line: max-line-length
        const data =  this.getOnChangeAssociationValues(this.filterForm.value.medium, 'Medium');
        const classOption = this.programsService.getAssociationData(data, 'gradeLevel', this.frameworkCategories);

        if (classOption.length) {
          this.currentFilters['gradeLevel'] = classOption;
        }

        this.onClassChange();
      } else {
        this.currentFilters['gradeLevel'] = this.originalFiltersScope['gradeLevel'];
      }
    }
  }
getOnChangeAssociationValues(selectedFilter, caterory) {
  const mediumData = _.find(this.frameworkCategories, (element) => {
    return element.name === caterory;
  });
  let getAssociationsData = [];
  
  _.forEach(selectedFilter, (value)=> {
    const  getAssociationData =  _.map(_.get(mediumData, 'terms'), (framework) => {
     if(framework['name'] === value) {
      return framework;
     }
    });
    getAssociationsData = _.compact( _.concat(getAssociationsData, getAssociationData));
  });
  return getAssociationsData;
}
  onClassChange() {
    if (this.isOnChangeFilterEnable) { // should enable for sourcing org admin(my projects tab) and for contributor org all projects and induvidual contributor all projects
      this.filterForm.controls['subject'].setValue('');

      if (!_.isEmpty(this.filterForm.value.gradeLevel)) {

        // tslint:disable-next-line: max-line-length
        const data =  this.getOnChangeAssociationValues(this.filterForm.value.gradeLevel, 'Subject');

        const subjectOption = this.programsService.getAssociationData(data, 'subject', this.frameworkCategories);

        if (subjectOption.length) {
          this.currentFilters['subject'] = subjectOption;
        }
      } else {
        this.currentFilters['subject'] = this.originalFiltersScope['subject'];
      }
    }
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
      case 'contributeOrgAdminMyProjectTenantAccess':
        appliedFilters = JSON.parse(localStorage.getItem('contributeMyProgramAppliedFiltersTenantAccess'));
        this.setAppliedFilters(appliedFilters);
        break;
      case 'contributeOrgAdminAllProjectTenantAccess':
        appliedFilters = JSON.parse(localStorage.getItem('contributeAllProgramAppliedFiltersTenantAccess'));
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
      this.filterForm.controls['sourcingOrganisations'].setValue(this.setPreferences['rootorg_id']);
      this.filterForm.controls['medium'].setValue(this.setPreferences['medium']);
      this.filterForm.controls['gradeLevel'].setValue(this.setPreferences['gradeLevel']);
      this.filterForm.controls['subject'].setValue(this.setPreferences['subject']);
      this.filterForm.controls['content_types'].setValue(this.setPreferences['content_types']);
      this.filterForm.controls['nominations'].setValue(this.setPreferences['nomination_date']);
      this.filterForm.controls['contributions'].setValue(this.setPreferences['contribution_date']);
    }
  }
  getFiltersUnionFromList() {
    _.map(this.programs, (program) => {
      this.currentFilters['gradeLevel'] = _.compact(_.uniq(_.concat(this.currentFilters['gradeLevel'], _.get(program, 'config.gradeLevel') ? program.config.gradeLevel : JSON.parse(program.gradeLevel))));
      this.currentFilters['medium'] = _.compact(_.uniq(_.concat(this.currentFilters['medium'], _.get(program, 'config.medium') ? program.config.medium : JSON.parse(program.medium))));
      this.currentFilters['subject'] = _.compact(_.uniq(_.concat(this.currentFilters['subject'], _.get(program, 'config.subject') ? program.config.subject : JSON.parse(program.subject))));
    });
    this.currentFilters['gradeLevel'] = _.map(this.currentFilters['gradeLevel'], (filter) => { return { name: filter, code: filter } });
    this.currentFilters['medium'] = _.map(this.currentFilters['medium'], (filter) => { return { name: filter, code: filter } });
    this.currentFilters['subject'] = _.map(this.currentFilters['subject'], (filter) => { return { name: filter, code: filter } });
  }
  applyFilter(resetFilter?) {
    const filterLocalStorage = resetFilter ? [] : this.setPreferences;
    switch (this.activeUser) {
      case 'sourcingOrgAdmin': localStorage.setItem('sourcingMyProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
      case 'contributeOrgAdminAllProject': localStorage.setItem('contributeAllProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
      case 'contributeOrgAdminMyProject': localStorage.setItem('contributeMyProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
      case 'sourcingReviwerMyProject': localStorage.setItem('sourcingMyProgramAppliedFilters', JSON.stringify(filterLocalStorage)); break;
      case 'contributeOrgAdminMyProjectTenantAccess': localStorage.setItem('contributeMyProgramAppliedFiltersTenantAccess', JSON.stringify(filterLocalStorage)); break;
      case 'contributeOrgAdminAllProjectTenantAccess': localStorage.setItem('contributeAllProgramAppliedFiltersTenantAccess', JSON.stringify(filterLocalStorage)); break;
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
