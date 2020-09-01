import { ExtPluginService, UserService, FrameworkService, ProgramsService, RegistryService, ActionService} from '@sunbird/core';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService, PaginationService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { tap, first } from 'rxjs/operators';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { ICollectionComponentInput, IDashboardComponentInput,
  IPagination, IChapterListComponentInput} from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService } from '../../../program/services/program-stage/program-stage.service';
import { ProgramComponentsService } from '../../services/program-components/program-components.service';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { isUndefined, isNullOrUndefined } from 'util';
import * as moment from 'moment';

interface IDynamicInput {
  collectionComponentInput?: ICollectionComponentInput;
  dashboardComponentInput?: IDashboardComponentInput;
}
@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit, OnDestroy, AfterViewInit {
  public programId: string;
  public programDetails: any;
  public userProfile: any;
  public showLoader = true;
  public showTabs = true;
  public programSelected = false;
  public associatedPrograms: any;
  public headerComponentInput: any;
  public stageSubscription: any;
  public tabs;
  public showStage;
  public defaultView;
  public dynamicInputs;
  public component: any;
  public sessionContext: ISessionContext = {};
  public state: InitialState = {
    stages: []
  };
  public currentStage: any;
  public telemetryImpression: IImpressionEventInput;
  outputs = {
    isCollectionSelected: (check) => {
      this.showTabs = false;
    }
  };
  public chapterListComponentInput: IChapterListComponentInput = {};
  public showChapterList = false;
  public contributorTextbooks: any = [];
  public tempSortTextbooks = [];
  public direction = 'asc';
  public sortColumn = '';
  public contentStatusCounts: any = {};
  public activeDate = '';
  public programContentTypes: string;
  public roles;
  public roleNames;
  public currentNominationStatus: any;
  public nominationDetails: any = {};
  public nominated = false;
  showTextbookFiltersModal = false;
  textbookFiltersApplied = false;
  userPreferences: any = {};
  setPreferences = {};
  prefernceForm: FormGroup;
  @ViewChild('prefModal') prefModal;
  public paginatedContributorOrgUsers: any = [];
  public allContributorOrgUsers: any = [];
  public contributorOrgUser: any = [];
  public directionOrgUsers = 'asc';
  public sortColumnOrgUsers = '';
  collection;
  showUsersLoader = true;
  OrgUsersCnt = 0;
  pager: IPagination;
  pageNumber = 1;
  pageLimit = 10;
  sharedContext;
  showSkipReview = false;
  searchInput: any;
  initialSourcingOrgUser = [];
  public telemetryPageId = 'collection';
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  constructor(public frameworkService: FrameworkService, public resourceService: ResourceService,
    public configService: ConfigService, public activatedRoute: ActivatedRoute, private router: Router,
    public extPluginService: ExtPluginService, public userService: UserService,
    public toasterService: ToasterService, public programStageService: ProgramStageService,
    public programComponentsService: ProgramComponentsService, public programsService: ProgramsService,
    private navigationHelperService: NavigationHelperService, public registryService: RegistryService,
    private paginationService: PaginationService, public actionService: ActionService,
    private collectionHierarchyService: CollectionHierarchyService,
    private sbFormBuilder: FormBuilder) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    localStorage.setItem('programId', this.programId);
  }
  ngOnInit() {

    if (['null', null, undefined, 'undefined'].includes(this.programId)) {
      this.toasterService.error(this.resourceService.messages.emsg.project.m0001);
    }
    this.getProgramDetails();
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('programComponent');
    this.currentStage = 'programComponent';
    this.telemetryInteractCdata = [{
      id: this.activatedRoute.snapshot.params.programId,
      type: 'Program'
    }];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{ 'type': 'Program', 'id': this.programId }];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}.programs`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  getProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    this.programsService.get(req).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.programDetails.config.medium = _.compact(this.programDetails.config.medium);
      this.programDetails.config.subject = _.compact(this.programDetails.config.subject);
      this.programDetails.config.gradeLevel = _.compact(this.programDetails.config.gradeLevel);
      this.programContentTypes = this.programsService.getContentTypesName(this.programDetails.content_types);
      this.roles = _.get(this.programDetails, 'config.roles');
      this.roleNames = _.map(this.roles, 'name');
      this.fetchFrameWorkDetails();
      this.getNominationStatus();
      this.setActiveDate();
      this.showSkipReview = !!(_.get(this.userService, 'userProfile.rootOrgId') === _.get(this.programDetails, 'rootorg_id') &&
      this.programDetails.config.defaultContributeOrgReview === false) ;
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || this.resourceService.messages.emsg.project.m0001);
    });
  }

  public fetchFrameWorkDetails() {
    this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
    if (this.sessionContext.framework) {
      this.frameworkService.initialize(this.sessionContext.framework);
      this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
        if (frameworkDetails && !frameworkDetails.err) {
          this.sessionContext.frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
        }
      }, error => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.error(errorMes || 'Fetching framework details failed');
      });
    }
  }

  initiateInputs() {
    this.showLoader = false;
    this.sessionContext.programId = this.programDetails.program_id;
    this.dynamicInputs = {
      collectionComponentInput: {
        sessionContext: this.sessionContext,
        userProfile: this.userService.userProfile,
        config: _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.collection' }),
        programContext: this.programDetails
      },
      dashboardComponentInput: {
        sessionContext: this.sessionContext,
        programContext: this.programDetails
      }
    };
  }

  getNominationStatus() {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId
          }
        }
      }
    };

    if (this.checkIfUserBelongsToOrg()) {
      req.data.request.filters['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
    } else {
      req.data.request.filters['user_id'] = this.userService.userProfile.userId;
    }
    this.programsService.post(req).subscribe((data) => {
      if (data.result && !_.isEmpty(data.result)) {
        this.nominationDetails = _.first(data.result);
      }
      if (!_.isEmpty(this.nominationDetails) && this.nominationDetails.status !== 'Initiated') {
        this.nominated = true;
        this.sessionContext.nominationDetails = _.first(data.result);
        this.currentNominationStatus = _.get(_.first(data.result), 'status');
        if (this.checkIfUserBelongsToOrg()) {
          this.sessionContext.currentOrgRole = this.userService.userProfile.userRegData.User_Org.roles[0];
          if (this.userService.userProfile.userRegData.User_Org.roles[0] === 'admin') {
            // tslint:disable-next-line:max-line-length
            this.sessionContext.currentRole = (this.currentNominationStatus === 'Approved' || this.currentNominationStatus === 'Rejected') ? 'REVIEWER' : 'CONTRIBUTOR';
          } else if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.rolemapping) {
            _.find(this.sessionContext.nominationDetails.rolemapping, (users, role) => {
              if (_.includes(users, this.userService.userProfile.userRegData.User.userId)) {
                this.sessionContext.currentRole = role;
              }
            });
          } else {
            this.sessionContext.currentRole = 'CONTRIBUTOR';
          }
        } else {
          this.sessionContext.currentRole = 'CONTRIBUTOR';
          this.sessionContext.currentOrgRole = 'individual';
        }
        if (this.programDetails.config) {
          const getCurrentRoleId = _.find(this.programDetails.config.roles, { 'name': this.sessionContext.currentRole });
          this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
        }

        if (this.isUserOrgAdmin()) {
          this.registryService.getcontributingOrgUsersDetails().then((orgUsers) => {
            this.setOrgUsers(orgUsers);
          });
        }
      } else {
        this.component = this.programComponentsService.getComponentInstance('collectionComponent');
        this.tabs = _.get(this.programDetails.config, 'header.config.tabs');
        this.initiateInputs();
      }

      if (this.nominated) {
        if (this.isUserOrgAdmin() || this.sessionContext.currentRole === 'REVIEWER') {
          this.prefernceForm = this.sbFormBuilder.group({
            medium: [],
            subject: [],
            gradeLevel: [],
          });
          this.programsService.getUserPreferencesforProgram(this.userService.userProfile.identifier, this.programId).subscribe(
            (prefres) => {
              let preffilter = {};
              if (!isNullOrUndefined(prefres.result)) {
                this.userPreferences = prefres.result;
                preffilter = _.get(this.userPreferences, 'contributor_preference');
              }
              if (!_.isEmpty(this.userPreferences.contributor_preference)) {
                this.textbookFiltersApplied = true;
                // tslint:disable-next-line: max-line-length
                this.setPreferences['medium'] = (this.userPreferences.contributor_preference.medium) ? this.userPreferences.contributor_preference.medium : [];
                // tslint:disable-next-line: max-line-length
                this.setPreferences['subject'] = (this.userPreferences.contributor_preference.subject) ? this.userPreferences.contributor_preference.subject : [];
                // tslint:disable-next-line: max-line-length
                this.setPreferences['gradeLevel'] = (this.userPreferences.contributor_preference.gradeLevel) ? this.userPreferences.contributor_preference.gradeLevel : [];
              }
              this.getProgramTextbooks(preffilter);
          }, (err) => { // TODO: navigate to program list page
            this.getProgramTextbooks();
            const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
            this.toasterService.warning(errorMes || 'Fetching Preferences  failed');
          });
        } else {
          this.getProgramTextbooks();
        }
      }
    }, error => {
      this.toasterService.error('Failed fetching current nomination status');
    });
  }

  setActiveDate() {
    const dates = ['nomination_enddate', 'shortlisting_enddate', 'content_submission_enddate', 'enddate'];

    dates.forEach(key => {
      const date = moment(moment(this.programDetails[key]).format('YYYY-MM-DD'));
      const today = moment(moment().format('YYYY-MM-DD'));
      const isFutureDate = !date.isSame(today) && date.isAfter(today);

      if (key === 'nomination_enddate' && isFutureDate) {
        this.activeDate = key;
      }

      if (this.activeDate === '' && isFutureDate) {
        this.activeDate = key;
      }
    });
  }
  getUserDetailsBySearch(clearInput?) {
    clearInput ? this.searchInput = '': this.searchInput;
    if (this.searchInput) {
      let filteredUser = this.registryService.getSearchedUserList(this.initialSourcingOrgUser, this.searchInput);
      this.sortUsersList(filteredUser);
    } else {
      this.sortUsersList(this.initialSourcingOrgUser);
    }
  }
  sortUsersList(usersList) {
     this.OrgUsersCnt = usersList.length;
     this.paginatedContributorOrgUsers = this.programsService.sortCollection(usersList, 'projectselectedRole', 'asc');
     usersList = _.chunk(this.paginatedContributorOrgUsers, this.pageLimit);
     this.paginatedContributorOrgUsers = usersList;
     this.contributorOrgUser = usersList[0];
     this.pager = this.paginationService.getPager(this.OrgUsersCnt, 1 , this.pageLimit);
  }
  setOrgUsers(orgUsers) {
    if (_.isEmpty(orgUsers)) {
      this.showUsersLoader = false;
      return false;
    }
    this.allContributorOrgUsers = [];
    orgUsers = _.filter(orgUsers, { "selectedRole": "user" });
    _.forEach(orgUsers, r => {
      r.projectselectedRole = 'Select';
      if (this.nominationDetails.rolemapping) {
        _.find(this.nominationDetails.rolemapping, (users, role) => {
          if (_.includes(users, r.identifier)) {
            r.projectselectedRole = role;
          }
        });
      }
      this.allContributorOrgUsers.push(r);
    });

    this.OrgUsersCnt = this.allContributorOrgUsers.length;
    this.sortOrgUsers('projectselectedRole');
    this.showUsersLoader = false;
    return true;
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.contributorOrgUser = this.paginatedContributorOrgUsers[this.pageNumber - 1];
    this.pager = this.paginationService.getPager(this.OrgUsersCnt, this.pageNumber, this.pageLimit);
  }

  onRoleChange(user) {
    const newRole = user.projectselectedRole;
    if (!_.includes(this.roleNames, newRole)) {
      this.toasterService.error(this.resourceService.messages.emsg.roles.m0003);
      return;
    }
    let progRoleMapping = this.nominationDetails.rolemapping;
    if (isNullOrUndefined(progRoleMapping)) {
      progRoleMapping = {};
      progRoleMapping[newRole] = [];
    }
    const programRoleNames = _.keys(progRoleMapping);
    if (!_.includes(programRoleNames, newRole)) {
      progRoleMapping[newRole] = [];
    }
    _.forEach(progRoleMapping, (users, role) => {
      // Add to selected user to current selected role's array
      if (newRole === role && !_.includes(users, user.identifier)) {
        users.push(user.identifier);
      }
      // Remove selected user from other role's array
      if (newRole !== role && _.includes(users, user.identifier)) {
        _.remove(users, (id) => id === user.identifier);
      }
      // Remove duplicate users ids and falsy values
      progRoleMapping[role] = _.uniq(_.compact(users));
    });
    const req = {
      'request': {
        'program_id': this.activatedRoute.snapshot.params.programId,
        'user_id': this.nominationDetails.user_id,
        'rolemapping': progRoleMapping
      }
    };
    const updateNomination = this.programsService.updateNomination(req);
    updateNomination.subscribe(response => {
      this.nominationDetails.rolemapping = progRoleMapping;
      this.toasterService.success(this.resourceService.messages.smsg.roles.m0001);
    }, error => {
      console.log(error);
      this.toasterService.error(this.resourceService.messages.emsg.roles.m0002);
    });
  }

  sortCollection(column) {
    this.contributorTextbooks = this.programsService.sortCollection(this.tempSortTextbooks, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  sortOrgUsers(column) {
    this.allContributorOrgUsers = this.programsService.sortCollection(this.allContributorOrgUsers, column, this.directionOrgUsers);
    this.initialSourcingOrgUser =  this.allContributorOrgUsers;
    this.paginatedContributorOrgUsers = _.chunk(this.allContributorOrgUsers, this.pageLimit);
    this.contributorOrgUser = this.paginatedContributorOrgUsers[this.pageNumber - 1];
    this.pager = this.paginationService.getPager(this.OrgUsersCnt, this.pageNumber, this.pageLimit);

    if (this.directionOrgUsers === 'asc' || this.directionOrgUsers === '') {
      this.directionOrgUsers = 'desc';
    } else {
      this.directionOrgUsers = 'asc';
    }
    this.sortColumnOrgUsers = column;
  }

  getProgramTextbooks(preferencefilters?) {
    const option = {
      url: 'composite/v3/search',
      data: {
        request: {
          filters: {
            objectType: 'content',
            programId: this.activatedRoute.snapshot.params.programId,
            status: ['Draft', 'Live'],
            contentType: 'Textbook'
          }
        }
      }
    };
    if (!isUndefined(preferencefilters)) {
      if (!_.isEmpty(_.get(preferencefilters, 'medium'))) {
        option.data.request.filters['medium'] = _.get(preferencefilters, 'medium');
      }
      if (!_.isEmpty(_.get(preferencefilters, 'gradeLevel'))) {
        option.data.request.filters['gradeLevel'] = _.get(preferencefilters, 'gradeLevel');
      }
      if (!_.isEmpty(_.get(preferencefilters, 'subject'))) {
        option.data.request.filters['subject'] = _.get(preferencefilters, 'subject');
      }
    }
    this.actionService.post(option).subscribe(
      (res) => {
        if (res && res.result) {
          this.showTexbooklist(res);
        }
      },
      (err) => console.log(err)
    );
  }

  showTexbooklist(res) {
    // tslint:disable-next-line:max-line-length
    const contributorTextbooks = (res.result.content && res.result.content.length && this.nominationDetails.collection_ids) ? _.filter(res.result.content, (collection) => {
      return _.includes(this.nominationDetails.collection_ids, collection.identifier);
    }) : [];
    if (!_.isEmpty(contributorTextbooks) && this.isNominationOrg()) {
      this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId).subscribe(
        (response) => {
          if (response && response.result && response.result.content) {
            const contents = _.get(response.result, 'content');
            // tslint:disable-next-line:max-line-length
            this.contentStatusCounts = this.collectionHierarchyService.getContentCounts(contents, this.sessionContext.nominationDetails.organisation_id, contributorTextbooks);
            // tslint:disable-next-line:max-line-length
            this.contributorTextbooks = this.collectionHierarchyService.getIndividualCollectionStatus(this.contentStatusCounts, contributorTextbooks);
          } else {
            // tslint:disable-next-line:max-line-length
            this.contentStatusCounts = this.collectionHierarchyService.getContentCounts([], this.sessionContext.nominationDetails.organisation_id, contributorTextbooks);
            // tslint:disable-next-line:max-line-length
            this.contributorTextbooks = this.collectionHierarchyService.getIndividualCollectionStatus(this.contentStatusCounts, contributorTextbooks);
          }
          this.tempSortTextbooks = this.contributorTextbooks;
          this.showLoader = false;
          const mvcStageData = this.programsService.getMvcStageData();
          if (!_.isEmpty(mvcStageData)) {
            this.viewContribution(mvcStageData.collection);
          }
        },
        (error) => {
          console.log(error);
          this.showLoader = false;
          const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
          this.toasterService.error(errorMes || 'Fetching textbooks failed. Please try again...');
        }
      );
    } else {
      this.contributorTextbooks = contributorTextbooks;
      this.tempSortTextbooks = this.contributorTextbooks;
      this.showLoader = false;
    }
  }

  viewContribution(collection) {
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection = collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.sharedContext = this.programDetails.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: this.getSharedContextObjectProperty(context)};
    }, {});
    this.sharedContext = this.programDetails.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: collection[context] || this.sharedContext[context]};
    }, this.sharedContext);
    _.forEach(['gradeLevel', 'medium', 'subject'], (val) => {
       this.checkArrayCondition(val);
    });
    this.sessionContext = _.assign(this.sessionContext, this.sharedContext);
    this.dynamicInputs = {
      chapterListComponentInput: {
        sessionContext: this.sessionContext,
        collection: collection,
        config: _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.chapterList' }),
        programContext: this.programDetails,
        role: {
          currentRole: this.sessionContext.currentRole
        }
      }
    };
    this.showChapterList = true;
    this.programsService.clearMvcStageData();
    this.programStageService.addStage('chapterListComponent');
  }

  getSharedContextObjectProperty(property) {
    if (property === 'channel') {
       return _.get(this.programDetails, 'config.scope.channel');
    } else if ( property === 'topic' ) {
      return null;
    } else {
      const collectionComComponent = _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.collection' });
      const filters =  collectionComComponent.config.filters;
      const explicitProperty =  _.find(filters.explicit, {'code': property});
      const implicitProperty =  _.find(filters.implicit, {'code': property});
      return (implicitProperty) ? implicitProperty.range || implicitProperty.defaultValue :
       explicitProperty.range || explicitProperty.defaultValue;
    }
  }

  checkArrayCondition(param) {
    // tslint:disable-next-line:max-line-length
    this.sharedContext[param] = _.isArray(this.sharedContext[param]) ? this.sharedContext[param] : _.split(this.sharedContext[param], ',');
  }

  canUploadContent() {
    const contributionendDate  = moment(this.programDetails.content_submission_enddate);
    const endDate  = moment(this.programDetails.enddate);
    const today = moment();
    return (contributionendDate.isSameOrAfter(today, 'day') && endDate.isSameOrAfter(today, 'day')) ? true : false;
  }

  applyPreferences(preferences?) {
    if (_.isUndefined(preferences)) {
      preferences = {};
    }
    this.textbookFiltersApplied = false;
    this.setPreferences['medium'] = [];
    this.setPreferences['subject'] = [];
    this.setPreferences['gradeLevel'] = [];

    // tslint:disable-next-line: max-line-length
    this.programsService.setUserPreferencesforProgram(this.userService.userProfile.identifier, this.programId, preferences, 'contributor').subscribe(
      (response) => {
        this.userPreferences =  response.result;
        if (!_.isEmpty(this.userPreferences.contributor_preference)) {
          this.textbookFiltersApplied = true;
          // tslint:disable-next-line: max-line-length
          this.setPreferences['medium'] = (this.userPreferences.contributor_preference.medium) ? this.userPreferences.contributor_preference.medium : [];
          // tslint:disable-next-line: max-line-length
          this.setPreferences['subject'] = (this.userPreferences.contributor_preference.subject) ? this.userPreferences.contributor_preference.subject : [];
          // tslint:disable-next-line: max-line-length
          this.setPreferences['gradeLevel'] = (this.userPreferences.contributor_preference.gradeLevel) ? this.userPreferences.contributor_preference.gradeLevel : [];
        }
      },
      (error) => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
    });
    this.getProgramTextbooks(preferences);
  }

  applyTextbookFilters() {
    this.prefModal.deny();
    const prefData = {
        ...this.prefernceForm.value
    };
    this.applyPreferences(prefData);
  }
  resetTextbookFilters() {
    this.prefModal.deny();
    this.applyPreferences();
  }

  isNominationOrg() {
    return !!(this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.organisation_id);
  }

  isUserOrgAdmin() {
    return !!(this.userService.userRegistryData && this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org &&
      this.userService.userProfile.userRegData.User_Org.roles.includes('admin'));
  }

  checkIfUserBelongsToOrg() {
    return !!(this.userService.userRegistryData && this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org);
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  tabChangeHandler(e) {
    this.component = this.programComponentsService.getComponentInstance(e);
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
