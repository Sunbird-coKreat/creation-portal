import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ProgramsService, UserService, FrameworkService, LearnerService } from '@sunbird/core';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { EventEmitter } from '@angular/core';
import { first, filter, map, tap } from 'rxjs/operators';
import * as alphaNumSort from 'alphanum-sort';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { of, Observable } from 'rxjs';
@Component({
  selector: 'app-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss']
})
export class ProjectFilterComponent implements OnInit {
  @ViewChild('modal') modal;
  @Input() programs;
  @Input() telemetryPageId;
  @Input() filtersAppliedCount;
  @Input() forTargetType;
  @Output() dismiss = new EventEmitter<any>();
  @Output() applyFilters = new EventEmitter<any>();
  public initialProgramDetails = [];
  public filterForm: UntypedFormGroup;
  public showFilters = {};
  public currentFilters: any;
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
  public showLoader: any;
  // tslint:disable-next-line: max-line-length
  public nominationContributionStatus = [{ 'name': 'Open', 'value': 'open' }, { 'name': 'Closed', 'value': 'closed' }, { 'name': 'Any', 'value': 'any' }];
  constructor(public sbFormBuilder: UntypedFormBuilder, public programsService: ProgramsService, public frameworkService: FrameworkService,
    public resourceService: ResourceService, public userService: UserService, public router: Router, public configService: ConfigService,
    public cacheService: CacheService, public learnerService: LearnerService, private browserCacheTtlService: BrowserCacheTtlService) { }

  ngOnInit() {
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true); // checking the router path
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.createFilterForm(); // creating the filter form
    this.currentFilters = { // setting up initial values
      'rootorg_id': [],
      'medium': [],
      'gradeLevel': [],
      'subject': [],
      'contentTypes': [],
      'target_collection_category': [],
      'nominations': this.nominationContributionStatus, // adding default values for open, close and any
      'contributions': this.nominationContributionStatus // adding default values for open, close and any
    };
    this.checkFilterShowCondition();
     // getting content types as the content categories againts the project
    this.getContentCategories();
  }

  getContentCategories() {
    const collectionPrimaryCategories = _.get(this.cacheService.get(this.userService.hashTagId), 'collectionPrimaryCategories');
    const programs = this.programs;

    _.map(programs, (program) => {
      const programContentTypes = program.targetprimarycategories ? _.map(program.targetprimarycategories, 'name') : program.content_types;
      this.currentFilters['contentTypes'] = _.flattenDeep(_.compact(_.uniq(_.concat(this.currentFilters['contentTypes'],
      programContentTypes ))));
    });
    // tslint:disable-next-line:max-line-length
    this.currentFilters['target_collection_category'] = this.sortFilters(collectionPrimaryCategories);
    this.currentFilters['contentTypes'] = this.sortFilters(this.currentFilters['contentTypes']);
  }
  createFilterForm() {
    this.filterForm = this.sbFormBuilder.group({
      sourcingOrganisations: [],
      medium: [],
      gradeLevel: [],
      subject: [],
      content_types: [],
      nominations: [],
      contributions: [],
      target_collection_category: []
    });
    this.filterForm.valueChanges.subscribe(val => {
      this.enableApplyBtn = this.programsService.getFiltersAppliedCount(val); // getting applied filters count
    });
  }
  // check the filters to dispaly to user with respect to roles and tab's
  checkFilterShowCondition() {
      // show filter for sourcing org admin for my projects
    if (this.userService.isSourcingOrgAdmin() && this.router.url.includes('/sourcing')) {
      this.fetchFrameWorkDetails(this.userService.hashTagId);
      this.showFilters['sourcingOrganisations'] = false;
      this.showFilters['nomination_date'] = true;
      this.showFilters['contribution_date'] = true;
      this.activeUser = 'sourcingOrgAdmin'; // this is purpose of storing and getting the filters values
      this.isOnChangeFilterEnable = true;
      // for all projects and need to add one more condition for generic and common access
    } else if (this.activeAllProgramsMenu && this.programsService.checkforshowAllPrograms()) {
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
      const orgId = this.programsService.organisationDetails[this.userService.slug];
      this.fetchFrameWorkDetails(orgId);
    } else {
      this.getAllTenantList();
      this.showFilters['sourcingOrganisations'] = true;
      this.activeUser = 'contributeOrgAdminAllProject';
    }
  }
  // get all frame work details
  getAllTenantList() {
    this.programsService.getAllTenantList().subscribe((response: any) => {
      const list =  _.map(_.get(response, 'result.content'), (org) => {
       return  ({name: _.lowerCase(org['orgName']), id: org.id, orgName: org.orgName});
      });
      this.currentFilters['rootorg_id'] = _.sortBy(list, ['name']);
    });
  }
  onChangeSourcingOrg() { // this method will call only when any change in sourcing org drop down
    this.fetchFrameWorkDetails(this.filterForm.controls.sourcingOrganisations.value);
    this.filterForm.controls['medium'].setValue('');
  }
  getDefaultFrameWork(hashTagId): Observable<any> {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.CHANNEL.READ + '/' + hashTagId
    };
    if (this.cacheService.get(hashTagId)) {
      return of(this.cacheService.get(hashTagId));
    } else {
      return this.learnerService.get(channelOptions).pipe(tap(data => this.setChannelData(hashTagId, _.get(data, 'result.channel'))),
        map(data => _.get(data, 'result.channel')));
    }
  }
  setChannelData(hashTagId, channelData) {
    this.cacheService.set(hashTagId ? hashTagId : this.userService.hashTagId, channelData,
      { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }
  fetchFrameWorkDetails(orgId) {// get framework details here
    this.showLoader = true; // show loader
    this.getDefaultFrameWork(orgId).subscribe(channelData => {
      const frameworkName = _.get(channelData, 'defaultFramework');
      this.programsService.frameworkInitialize(frameworkName); // initialize framework details here
      this.frameworkService.frameworkData$.pipe(filter(data =>
        _.get(data, `frameworkdata.${frameworkName}`)),
        first()).subscribe((frameworkInfo: any) => {
          if (frameworkInfo && !frameworkInfo.err) {
            this.frameworkCategories = _.get(frameworkInfo, `frameworkdata.${frameworkName}.categories`);
            this.setFrameworkDataToProgram(); // set frame work details
           this.showLoader = false; // hide loader
          }
        });
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
      // just keek the origional filter data used when not find values from the form
      this.originalFiltersScope[element['code']] = sortedTermsArray;
    });

    const Kindergarten = _.remove(this.currentFilters['gradeLevel'], (item) => {
      return item.name === 'Kindergarten';
    });
    this.currentFilters['gradeLevel'] = [...Kindergarten, ...this.currentFilters['gradeLevel']];
  }
  onMediumChange() {
    // should enable for sourcing org admin(my projects tab) and for contributor org all projects and induvidual contributor all projects
    if (this.isOnChangeFilterEnable) {
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
    // should enable for sourcing org admin(my projects tab) and for contributor org all projects and induvidual contributor all projects
    if (this.isOnChangeFilterEnable) {
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
        if (this.forTargetType === 'searchCriteria') {
          appliedFilters = this.cacheService.get('sourcingMyProgramAppliedFiltersSearchCriteria');
        } else {
          appliedFilters = this.cacheService.get('sourcingMyProgramAppliedFilters');
        }
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
      this.setPreferences['target_collection_category'] = appliedFilters['target_collection_category'] ?
      appliedFilters['target_collection_category'] : [];
      this.setPreferences['nomination_date'] = appliedFilters['nomination_date'] ? appliedFilters['nomination_date'] : '';
      this.setPreferences['contribution_date'] = appliedFilters['contribution_date'] ? appliedFilters['contribution_date'] : '';
      this.filterForm.controls['sourcingOrganisations'].setValue(this.setPreferences['rootorg_id']);
      this.filterForm.controls['medium'].setValue(this.setPreferences['medium']);
      this.filterForm.controls['gradeLevel'].setValue(this.setPreferences['gradeLevel']);
      this.filterForm.controls['subject'].setValue(this.setPreferences['subject']);
      this.filterForm.controls['content_types'].setValue(this.setPreferences['content_types']);
      this.filterForm.controls['target_collection_category'].setValue(this.setPreferences['target_collection_category']);
      this.filterForm.controls['nominations'].setValue(this.setPreferences['nomination_date']);
      this.filterForm.controls['contributions'].setValue(this.setPreferences['contribution_date']);
    }

    if (this.activeUser === 'contributeOrgAdminAllProject') {
        // tslint:disable-next-line: max-line-length
      _.get(this.setPreferences, 'rootorg_id') ? this.fetchFrameWorkDetails(this.setPreferences['rootorg_id']) : this.fetchFrameWorkDetails(this.userService.hashTagId);
    }

  }
  // this method is for getting union of filters for my projects tab other than sourcing org admin my project tab
  getFiltersUnionFromList(origionalPrograms?) {
    this.showLoader = true;
    let programs = this.programs;
    if (origionalPrograms && origionalPrograms['length']) { // taking origional Programs list display the all filter values
      programs = origionalPrograms;
    }
    _.map(programs, (program) => {
      this.currentFilters['gradeLevel'] = _.concat(this.currentFilters['gradeLevel'],
        _.get(program, 'config.gradeLevel') ? program.config.gradeLevel : JSON.parse(program.gradeLevel));
      this.currentFilters['medium'] = _.concat(this.currentFilters['medium'],
        _.get(program, 'config.medium') ? program.config.medium : JSON.parse(program.medium));
      this.currentFilters['subject'] = _.concat(this.currentFilters['subject'],
        _.get(program, 'config.subject') ? program.config.subject : JSON.parse(program.subject));
    });
    this.currentFilters['gradeLevel'] = this.sortFilters(_.uniq(_.compact(_.flattenDeep(this.currentFilters['gradeLevel']))));
    this.currentFilters['medium'] = this.sortFilters(_.uniq(_.compact(_.flattenDeep(this.currentFilters['medium']))));
    this.currentFilters['subject'] = this.sortFilters(_.uniq(_.compact(_.flattenDeep(this.currentFilters['subject']))));
    this.showLoader = false;
  }
  sortFilters(unSortedArray) {
    const sortArray = alphaNumSort(_.reduce(unSortedArray, (result, value) => {
      result.push(value);
      return result;
    }, []));
    const mapArray = _.map(sortArray, (value) =>
    ({ name: value, code: value }));  // this is map name and code for form , have label and value field in form
    return mapArray;
  }
  applyFilter(resetFilter?) { // when user clicks on apply filter and storing selected filter data in cache service
    const filterLocalStorage = resetFilter ? [] : this.setPreferences; // this is to check set or reset condition
    switch (this.activeUser) {
      case 'sourcingOrgAdmin':
        if (this.forTargetType === 'searchCriteria') {
         this.setPreferences['target_collection_category'] = [];
          this.cacheService.set('sourcingMyProgramAppliedFiltersSearchCriteria', filterLocalStorage);
        } else {
          this.cacheService.set('sourcingMyProgramAppliedFilters', filterLocalStorage);
        }
        break;
      case 'contributeOrgAdminAllProject':
        this.cacheService.set('contributeAllProgramAppliedFilters', filterLocalStorage); break;
      case 'contributeOrgAdminMyProject':
        this.cacheService.set('contributeMyProgramAppliedFilters', filterLocalStorage);
        // this is to set the origional filters values when we are taking filters from union of this.programs
        if (!this.filtersAppliedCount) {
          this.cacheService.set('genericOrigionalMyPrograms', this.programs);
        }
        break;
      case 'sourcingReviwerMyProject':
        this.cacheService.set('sourcingMyProgramAppliedFilters', filterLocalStorage);
        if (this.filtersAppliedCount) {
          this.cacheService.set('genericOrigionalMyPrograms', this.programs);
        }
        break;
      case 'contributeOrgAdminMyProjectTenantAccess':
        this.cacheService.set('contributeMyProgramAppliedFiltersTenantAccess', filterLocalStorage);
        // this is to set the origional filters values when we are taking filters from union of this.programs
        if (!this.filtersAppliedCount) {
          this.cacheService.set('tenantOrigionalMyPrograms', this.programs);
        }
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
  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }
}
