import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService, PaginationService} from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService, RegistryService, ActionService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild} from '@angular/core';
import { tap, first } from 'rxjs/operators';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgramStageService } from '../../../program/services/program-stage/program-stage.service';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { IChapterListComponentInput, IPagination } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { isUndefined, isNullOrUndefined } from 'util';
import * as moment from 'moment';

@Component({
  selector: 'app-nominated-contributor-textbooks',
  templateUrl: './list-nominated-textbooks.component.html',
  styleUrls: ['./list-nominated-textbooks.component.scss']
})
export class ListNominatedTextbooksComponent implements OnInit, AfterViewInit, OnDestroy {

  public contributor;
  public contributorTextbooks: any = [];
  public tempSortTextbooks = [];
  public direction = 'asc';
  public sortColumn = '';
  public noResultFound;
  public telemetryImpression: IImpressionEventInput;
  public component: any;
  public sessionContext: ISessionContext = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public dynamicInputs;
  public currentStage: any;
  collection;
  configData;
  showChapterList = false;
  public currentNominationStatus: any;
  public nominationDetails: any = {};
  public nominated = false;
  public programId: string;
  public programDetails: any;
  public mediums: any;
  public grades: any;
  public userProfile: any;
  public activeDate = '';
  public stageSubscription: any;
  public state: InitialState = {
    stages: []
  };
  public contributorOrgUser: any = [];
  public tempSortOrgUser: any = [];
  public orgDetails: any = {};
  public roles;
  roleNames;
  public showNormalModal = false;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any = {};
  public currentUserRole: any;
  public contentStatusCounts: any = {};
  public chapterCount = 0;
  public programContentTypes: string;
  public directionOrgUsers = 'asc';
  public sortColumnOrgUsers = '';
  public showLoader = true;
  showTextbookFiltersModal = false;
  textbookFiltersApplied = false;
  setPreferences = {};
  prefernceForm: FormGroup;
  sbFormBuilder: FormBuilder;
  userPreferences: any = {};
  @ViewChild('prefModal') prefModal;
  public paginatedContributorOrgUsers: any = [];
  public allContributorOrgUsers: any = [];
  showUsersLoader = true;
  OrgUsersCnt = 0;
  pager: IPagination;
  pageNumber = 1;
  pageLimit = 250;
  sharedContext;

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private configService: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  public toasterService: ToasterService, private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient,
  public frameworkService: FrameworkService, public userService: UserService, public registryService: RegistryService,
  public activeRoute: ActivatedRoute, private collectionHierarchyService: CollectionHierarchyService, public actionService: ActionService,
  private paginationService: PaginationService, private formBuilder: FormBuilder) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.sbFormBuilder = formBuilder;
   }

  ngOnInit() {
    this.prefernceForm = this.sbFormBuilder.group({
      medium: [],
      subject: [],
      gradeLevel: [],
    });
    this.getProgramDetails();
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('listNominatedTextbookComponent');
    this.currentStage = 'listNominatedTextbookComponent';
    this.telemetryInteractCdata = [{
      id: this.activatedRoute.snapshot.params.programId,
      type: 'Program'
    }];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
  }

  getProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    this.programsService.get(req).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.programDetails.config = JSON.parse(this.programDetails.config);
      this.programDetails.config.medium = _.compact(this.programDetails.config.medium);
      this.programDetails.config.subject = _.compact(this.programDetails.config.subject);
      this.programDetails.config.gradeLevel = _.compact(this.programDetails.config.gradeLevel);
      this.programContentTypes = this.programsService.getContentTypesName(this.programDetails.content_types);

      this.roles = _.get(this.programDetails, 'config.roles');
      this.roleNames = _.map(this.roles, 'name');

      this.fetchFrameWorkDetails();
      this.getNominationStatus();

      this.setActiveDate();
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
    });
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
  sortCollection(column) {
    this.contributorTextbooks = this.programsService.sortCollection(this.tempSortTextbooks, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
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
      (res) =>  {
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

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{ 'type': 'Program', 'id': this.activatedRoute.snapshot.params.programId }];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata,
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.activeRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
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

  setActiveDate() {
    const dates = [ 'nomination_enddate', 'shortlisting_enddate', 'content_submission_enddate', 'enddate'];

    dates.forEach(key => {
      const date  = moment(moment(this.programDetails[key]).format('YYYY-MM-DD'));
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

  sortOrgUsers(column) {
    this.allContributorOrgUsers = this.programsService.sortCollection(this.allContributorOrgUsers, column, this.directionOrgUsers);
    this.paginatedContributorOrgUsers = _.chunk( this.allContributorOrgUsers, this.pageLimit);
    this.contributorOrgUser = this.paginatedContributorOrgUsers[this.pageNumber-1];
    this.pager = this.paginationService.getPager(this.OrgUsersCnt, this.pageNumber, this.pageLimit);

    if (this.directionOrgUsers === 'asc' || this.directionOrgUsers === '') {
      this.directionOrgUsers = 'desc';
    } else {
      this.directionOrgUsers = 'asc';
    }
    this.sortColumnOrgUsers = column;
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
        this.nominated = true;
        this.nominationDetails = _.first(data.result);
        this.sessionContext.nominationDetails = _.first(data.result);
        this.currentNominationStatus =  _.get(_.first(data.result), 'status');
        if (this.checkIfUserBelongsToOrg()) {
          this.sessionContext.currentOrgRole = this.userService.userProfile.userRegData.User_Org.roles[0];
          if (this.userService.userProfile.userRegData.User_Org.roles[0] === 'admin') {
            // tslint:disable-next-line:max-line-length
            this.sessionContext.currentRole = (this.currentNominationStatus === 'Approved' ||  this.currentNominationStatus === 'Rejected') ? 'REVIEWER' : 'CONTRIBUTOR';
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
          const getCurrentRoleId = _.find(this.programDetails.config.roles, {'name': this.sessionContext.currentRole});
          this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
        }

        this.orgDetails.name = _.get(this.userService, 'userProfile.userRegData.Org.name');
        this.orgDetails.id = _.get(this.userService, 'userProfile.userRegData.Org.osid');

        /*if (this.isSourcingOrgAdmin()) {
          const dikshaOrgId = _.get(this.userService, 'userProfile.organisations[0].organisationId');
          const roles= ['CONTENT_REVIEWER', 'CONTENT_CREATOR'];

          // Get all diskha users
          this.programsService.getSourcingOrgUserList(dikshaOrgId, roles, this.pageLimit).then((orgUsersDetails) => {
            this.setOrgUsers(orgUsersDetails);
          });
        } else */
        
        if (this.isUserOrgAdmin()) {
          this.registryService.getcontributingOrgUsersDetails().then((orgUsers) => {
            this.setOrgUsers(orgUsers);
          });
        }
      }

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
      },(err) => { // TODO: navigate to program list page
        this.getProgramTextbooks();
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching Preferences  failed');
      });
    }, error => {
      this.toasterService.error('Failed fetching current nomination status');
    });
  }
  
  setOrgUsers(orgUsers) {
    if (_.isEmpty(orgUsers)) {
      this.showUsersLoader = false;
      return false;
    }
    this.allContributorOrgUsers = [];
    orgUsers = _.filter(orgUsers, {"selectedRole": "user"});
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
    this.contributorOrgUser = this.paginatedContributorOrgUsers[this.pageNumber -1];
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

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
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

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
