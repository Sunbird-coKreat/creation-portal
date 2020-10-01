import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProgramsService, UserService, FrameworkService } from '@sunbird/core';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';
import * as alphaNumSort from 'alphanum-sort';
import { CacheService } from 'ng2-cache-service';
@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss']
})
export class ProjectFilterComponent implements OnInit {
  @ViewChild('modal') modal;
  @Input() programs;
  @Input() filtersAppliedCount;
  @Output() dismiss = new EventEmitter<any>();
  @Output() applyFilters = new EventEmitter<any>();
  public initialProgramDetails = [];
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
  public enableApplyBtn = 0;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public nominationContributionStatus = [{ 'name': 'Open', 'value': 'open' }, { 'name': 'Closed', 'value': 'closed' }, { 'name': 'Any', 'value': 'any' }];
  constructor(public sbFormBuilder: FormBuilder, public programsService: ProgramsService, public frameworkService: FrameworkService,
    public resourceService: ResourceService, public userService: UserService, public router: Router, public configService: ConfigService,
    public cacheService: CacheService) { }

  ngOnInit() {
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true); // checking the router path 
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);
    this.telemetryInteractCdata = [];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.createFilterForm(); // creating the filter form
    this.currentFilters = { // setting up initial values
      'rootorg_id': [],
      'medium': [],
      'gradeLevel': [],
      'subject': [],
      'contentTypes': [],
      'nominations': this.nominationContributionStatus, // adding default values for open, close and any
      'contributions': this.nominationContributionStatus // adding default values for open, close and any
    }
    this.checkFilterShowCondition();
    this.currentFilters['contentTypes'] =  _.sortBy(this.programsService.contentTypes,['name']); // getting global content types all the time 
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
    this.filterForm.valueChanges.subscribe(val => {
      this.enableApplyBtn =  this.programsService.getFiltersAppliedCount(val); // getting applied filters count
    });
  }
  // check the filters to dispaly to user with respect to roles and tab's
  checkFilterShowCondition() {
    if (this.userService.isSourcingOrgAdmin() && this.router.url.includes('/sourcing')) {  // show filter for sourcing org admin for my projects 
      this.fetchFrameWorkDetails(undefined, undefined);
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = true;
      this.showFilters['contribution_date'] = true;
      this.activeUser = 'sourcingOrgAdmin'; // this is purpose of storing and getting the filters values
      this.isOnChangeFilterEnable = true;
    } else if (this.activeAllProgramsMenu && this.programsService.checkforshowAllPrograms()) { // for all projects and need to add one more condition for generic and common access
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
      this.isOnChangeFilterEnable = true;
      this.checkTenantAccessSpecification(); // check the access specefication weather tenant access or generic access
    } else if (this.activeMyProgramsMenu) { // for my projects for contributor user role  
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = false;
      this.showFilters['contribution_date'] = false;
      this.isOnChangeFilterEnable = false;
      // this is purpose of storing and getting the filters values
      if (this.userService.slug) {
        this.activeUser = 'contributeOrgAdminMyProjectTenantAccess';
        // this is to get the origional filters values when we are taking filters from union of this.programs
        const tenantOrigionalMyPrograms = this.filtersAppliedCount ? this.cacheService.get('tenantOrigionalMyPrograms') : [];
        this.getFiltersUnionFromList(tenantOrigionalMyPrograms);
      } else {
        this.activeUser = 'contributeOrgAdminMyProject';
        // this is to get the origional filters values when we are taking filters from union of this.programs
        const genericOrigionalMyPrograms = this.filtersAppliedCount ? this.cacheService.get('genericOrigionalMyPrograms') : [];
        this.getFiltersUnionFromList(genericOrigionalMyPrograms);
      }
    } else {
      const genericOrigionalMyPrograms = this.filtersAppliedCount ? this.cacheService.get('genericOrigionalMyPrograms') : [];
      this.getFiltersUnionFromList(genericOrigionalMyPrograms); // for sourcing reviewer 
      this.activeUser = 'sourcingReviwerMyProject';
      this.isOnChangeFilterEnable = false;
    }
    this.getAppliedFiltersDetails();
  }
  checkTenantAccessSpecification() { // check the access specefication weather tenant access or generic access
    if (this.userService.slug) { // checking In case the contributor accesses tenant specific contribution page
      this.showFilters['sourcingOrganisations'] = false;
      this.activeUser = 'contributeOrgAdminAllProjectTenantAccess';
      const orgId = _.get(this.programs[0], 'rootorg_id') || this.userService.slug;
      this.fetchFrameWorkDetails(undefined, orgId);
    } else {
      this.getAllSourcingFrameworkDetails();
      this.fetchFrameWorkDetails(undefined, undefined); //  Union of all Medium, Class, Subjects across all frameworks 
      this.showFilters['sourcingOrganisations'] = true;
      this.activeUser = 'contributeOrgAdminAllProject';
    }
  }
  // get all frame work details 
  getAllSourcingFrameworkDetails() {
    this.programsService.getAllSourcingFrameworkDetails().subscribe((frameworkInfo: any) => {
      this.currentFilters['rootorg_id'] = _.sortBy(_.get(frameworkInfo, 'result.content'),['orgName']);
    });
  }
  onChangeSourcingOrg() { // this method will call only when any change in sourcing org drop down 
    this.fetchFrameWorkDetails(undefined, this.filterForm.controls.sourcingOrganisations.value);
    this.filterForm.controls['medium'].setValue('');
  }
  fetchFrameWorkDetails(undefined, orgId) {// get framework details here
    this.frameworkService.initialize(undefined, orgId);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkInfo: any) => {
      if (frameworkInfo && !frameworkInfo.err) {
        this.frameworkCategories = frameworkInfo.frameworkdata.defaultFramework.categories;
        this.setFrameworkDataToProgram(); // set frame work details
      }
    });
  }
  setFrameworkDataToProgram() { // set frame work details
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
      this.originalFiltersScope[element['code']] = sortedTermsArray; // just keek the origional filter data used when not find values from the form
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
        const data = this.getOnChangeAssociationValues(this.filterForm.value.medium, 'Medium'); // should get applied association data from framework details
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
  // should get applied association data from framework details
  getOnChangeAssociationValues(selectedFilter, caterory) {
    const mediumData = _.find(this.frameworkCategories, (element) => {
      return element.name === caterory;
    });
    let getAssociationsData = [];

    _.forEach(selectedFilter, (value) => {
      const getAssociationData = _.map(_.get(mediumData, 'terms'), (framework) => {
        if (framework['name'] === value) {
          return framework;
        }
      });
      getAssociationsData = _.compact(_.concat(getAssociationsData, getAssociationData));
    });
    return getAssociationsData;
  }
  onClassChange() {
    if (this.isOnChangeFilterEnable) { // should enable for sourcing org admin(my projects tab) and for contributor org all projects and induvidual contributor all projects
      this.filterForm.controls['subject'].setValue('');

      if (!_.isEmpty(this.filterForm.value.gradeLevel)) {

        // tslint:disable-next-line: max-line-length
        const data = this.getOnChangeAssociationValues(this.filterForm.value.gradeLevel, 'Subject'); // should get applied association data from framework details

        const subjectOption = this.programsService.getAssociationData(data, 'subject', this.frameworkCategories);

        if (subjectOption.length) {
          this.currentFilters['subject'] = subjectOption;
        }
      } else {
        this.currentFilters['subject'] = this.originalFiltersScope['subject'];
      }
    }
  }
  getAppliedFiltersDetails() { // get applied filters and populate them on filter(auto pupolate) which are stored in cache service 
    let appliedFilters: any;
    switch (this.activeUser) {
      case 'sourcingOrgAdmin':
        appliedFilters = this.cacheService.get('sourcingMyProgramAppliedFilters');
        this.setAppliedFilters(appliedFilters);
        break;
      case 'contributeOrgAdminAllProject':
        appliedFilters = this.cacheService.get('contributeAllProgramAppliedFilters');
        this.setAppliedFilters(appliedFilters);
        break;
      case 'contributeOrgAdminMyProject':
        appliedFilters = this.cacheService.get('contributeMyProgramAppliedFilters');
        this.setAppliedFilters(appliedFilters);
        break;
      case 'sourcingReviwerMyProject':
        appliedFilters = this.cacheService.get('sourcingMyProgramAppliedFilters');
        this.setAppliedFilters(appliedFilters);
        break;
      case 'contributeOrgAdminMyProjectTenantAccess':
        appliedFilters = this.cacheService.get('contributeMyProgramAppliedFiltersTenantAccess');
        this.setAppliedFilters(appliedFilters);
        break;
      case 'contributeOrgAdminAllProjectTenantAccess':
        appliedFilters = this.cacheService.get('contributeAllProgramAppliedFiltersTenantAccess');
        this.setAppliedFilters(appliedFilters);
        break;
    }
  }
  setAppliedFilters(appliedFilters) { // for auto populate of applied filters
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
  // this method is for getting union of filters for my projects tab other than sourcing org admin my project tab
  getFiltersUnionFromList(origionalPrograms?) { 
    let programs  = this.programs;
    if (origionalPrograms && origionalPrograms['length']) { // taking origional Programs list display the all filter values 
      programs = origionalPrograms;
    } 
    _.map( programs , (program) => {
      this.currentFilters['gradeLevel'] = _.flattenDeep(_.compact(_.uniq(_.concat(this.currentFilters['gradeLevel'], _.get(program, 'config.gradeLevel') ? program.config.gradeLevel : JSON.parse(program.gradeLevel)))));
      this.currentFilters['medium'] = _.flattenDeep(_.compact(_.uniq(_.concat(this.currentFilters['medium'], _.get(program, 'config.medium') ? program.config.medium : JSON.parse(program.medium)))));
      this.currentFilters['subject'] = _.flattenDeep(_.compact(_.uniq(_.concat(this.currentFilters['subject'], _.get(program, 'config.subject') ? program.config.subject : JSON.parse(program.subject)))));
    });
    // this is map name and code for form , have label and value field in form
    this.currentFilters['gradeLevel'] = _.sortBy(_.map(this.currentFilters['gradeLevel'], (filter) => { return { name: filter, code: filter } }),['name']);
    this.currentFilters['medium'] = _.sortBy(_.map(this.currentFilters['medium'], (filter) => { return { name: filter, code: filter } }),['name']);
    this.currentFilters['subject'] =_.sortBy( _.map(this.currentFilters['subject'], (filter) => { return { name: filter, code: filter } }),['name']);
  }
  applyFilter(resetFilter?) { // when user clicks on apply filter and storing selected filter data in cache service
    const filterLocalStorage = resetFilter ? [] : this.setPreferences; // this is to check set or reset condition
    switch (this.activeUser) {
      case 'sourcingOrgAdmin':
        this.cacheService.set('sourcingMyProgramAppliedFilters', filterLocalStorage); break;
      case 'contributeOrgAdminAllProject':
        this.cacheService.set('contributeAllProgramAppliedFilters', filterLocalStorage); break;
      case 'contributeOrgAdminMyProject':
        this.cacheService.set('contributeMyProgramAppliedFilters', filterLocalStorage);
        !this.filtersAppliedCount ? this.cacheService.set('genericOrigionalMyPrograms', this.programs) : ''; // this is to set the origional filters values when we are taking filters from union of this.programs 
        break;
      case 'sourcingReviwerMyProject':
        this.cacheService.set('sourcingMyProgramAppliedFilters', filterLocalStorage);
        !this.filtersAppliedCount ? this.cacheService.set('genericOrigionalMyPrograms', this.programs) : '';
        break;
      case 'contributeOrgAdminMyProjectTenantAccess':
        this.cacheService.set('contributeMyProgramAppliedFiltersTenantAccess', filterLocalStorage);
        !this.filtersAppliedCount ? this.cacheService.set('tenantOrigionalMyPrograms', this.programs) : ''; // this is to set the origional filters values when we are taking filters from union of this.programs
        break;
      case 'contributeOrgAdminAllProjectTenantAccess':
        this.cacheService.set('contributeAllProgramAppliedFiltersTenantAccess', filterLocalStorage); break;
    }
    resetFilter ? this.applyFilters.emit() : this.applyFilters.emit(this.setPreferences); // emiting the filters data to parent component
    this.dismissed();
  }

  dismissed() { // denying the modal 
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
