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
import { of, Observable, forkJoin } from 'rxjs';
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';
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
  public formFieldProperties_api: any = []
  public appliedFiltersList: any [];
  public framework_identifier: any;

  

  // tslint:disable-next-line: max-line-length
  public nominationContributionStatus = [{ 'name': 'Open', 'value': 'open' }, { 'name': 'Closed', 'value': 'closed' }, { 'name': 'Any', 'value': 'any' }];
  constructor(public sbFormBuilder: UntypedFormBuilder, public programsService: ProgramsService, public frameworkService: FrameworkService,
    public resourceService: ResourceService, public userService: UserService, public router: Router, public configService: ConfigService,
    public cacheService: CacheService, public learnerService: LearnerService, private browserCacheTtlService: BrowserCacheTtlService,
    public cslFrameworkService: CslFrameworkService) {}

  ngOnInit() {
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true); // checking the router path
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.createFilterForm(); // creating the filter form
    this.currentFilters = { // setting up initial values
      'rootorg_id': [],
      'contentTypes': [],
      'target_collection_category': [],
      'nominations': this.nominationContributionStatus, // adding default values for open, close and any
      'contributions': this.nominationContributionStatus // adding default values for open, close and any
    };
    console.log(this.currentFilters);
    this.checkFilterShowCondition();
     // getting content types as the content categories againts the project
    this.getContentCategories();
    this.getFilters();
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
    console.log(this.currentFilters);
  }
  createFilterForm() {
    this.filterForm = this.sbFormBuilder.group({
      sourcingOrganisations: [],
      content_types: [],
      nominations: [],
      contributions: [],
      target_collection_category: [],

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
      this.framework_identifier = frameworkName;
      this.programsService.frameworkInitialize(frameworkName); // initialize framework details here
      this.frameworkService.frameworkData$.pipe(filter(data =>
        _.get(data, `frameworkdata.${frameworkName}`)),
        first()).subscribe((frameworkInfo: any) => {
          if (frameworkInfo && !frameworkInfo.err) {
            this.frameworkCategories = _.get(frameworkInfo, `frameworkdata.${frameworkName}.categories`);
            // this.setFrameworkDataToProgram(); // set frame work details
           this.showLoader = false; // hide loader
          }
        });
    });
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
      this.appliedFiltersList = appliedFilters;
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

  getFormData(event){
    console.log(event)
    this.setPreferences = {...this.setPreferences, ...event};
    console.log(this.setPreferences);
  }

  formStatusEventListener(event){
    console.log(event)
  }

  getFilters(){
    // const framework = this.framework;
      const request = [ 
        this.programsService.getformConfigData(this.userService.hashTagId, 'framework', '*', null, 'read', ""),
        this.frameworkService.readFramworkCategories(this.framework_identifier),
        this.programsService.getformConfigData(this.userService.hashTagId, 'framework', 'filters', null, 'create', ""),
      ];

      forkJoin(request).subscribe(res => {
        let formData = _.get(_.first(res), 'result.data.properties');
        let categories:any = []
        categories = this.cslFrameworkService?.getFrameworkCategoriesObject();
        let formDataCategories = formData.map(t1 => ({...t1, ...categories.find(t2 => t2.code === t1.code)})).filter(t3 => t3.name);
        let filterFields = [];
        filterFields = _.get(_.nth(res, 2), 'result.data.properties')
        const frameworkDetails = res[1];
        let formFieldProperties_api = this.programsService.initializeFrameworkFormFields(frameworkDetails['categories'], formDataCategories, "");
        if(filterFields){
          formFieldProperties_api = [...formFieldProperties_api, ...filterFields];
        }else {
          formFieldProperties_api = formFieldProperties_api;
        }
        if(this.appliedFiltersList){
          formFieldProperties_api.forEach((val: any)=>{
            val.default = this.appliedFiltersList[val['code']];
          })
          this.appliedFiltersList = [];
        }
        this.formFieldProperties_api = formFieldProperties_api;
      });
  }
}
