import { ExtPluginService, UserService, FrameworkService, ProgramsService, RegistryService, ActionService} from '@sunbird/core';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService, PaginationService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { tap, first } from 'rxjs/operators';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { ChapterListComponent } from '../../../sourcing/components/chapter-list/chapter-list.component';
import { ICollectionComponentInput, IDashboardComponentInput,
  IPagination, IChapterListComponentInput} from '../../../sourcing/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService } from '../../../program/services/program-stage/program-stage.service';
import { ProgramComponentsService } from '../../services/program-components/program-components.service';
import { IImpressionEventInput, IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';
import { isUndefined, isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { SourcingService } from '../../../sourcing/services';
import { HelperService } from '../../../sourcing/services/helper.service';

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
  public rolesWithNone;
  public roleNames;
  public currentNominationStatus: any;
  public nominationDetails: any = {};
  public nominated = false;
  showTextbookFiltersModal = false;
  textbookFiltersApplied = false;
  userPreferences: any = {};
  setPreferences = {};
  prefernceForm: FormGroup;
  @ViewChild('prefModal', {static: false}) prefModal;
  public paginatedContributorOrgUsers: any = [];
  public allContributorOrgUsers: any = [];
  public contributorOrgUser: any = [];
  public directionOrgUsers = 'desc';
  public sortColumnOrgUsers = 'projectselectedRole';
  public isInitialSourcingOrgUser = true;
  collection;
  showUsersLoader = true;
  OrgUsersCnt = 0;
  pager: IPagination;
  pageNumber = 1;
  pageLimit: any;
  sharedContext;
  showSkipReview = false;
  searchInput: any;
  initialSourcingOrgUser = [];
  searchLimitMessage: any;
  searchLimitCount: any;

  visitedTab = [];
  @ViewChild('userRemoveRoleModal', {static: false}) userRemoveRoleModal;
  public userRemoveRoleLoader = false;
  public showUserRemoveRoleModal = false;
  public selectedUserToRemoveRole: any;
  public telemetryPageId: string;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  constructor(public frameworkService: FrameworkService, public resourceService: ResourceService,
    public configService: ConfigService, public activatedRoute: ActivatedRoute, private router: Router,
    public extPluginService: ExtPluginService, public userService: UserService,
    public toasterService: ToasterService, public programStageService: ProgramStageService,
    public programComponentsService: ProgramComponentsService, public programsService: ProgramsService,
    private navigationHelperService: NavigationHelperService, public registryService: RegistryService,
    private paginationService: PaginationService, public actionService: ActionService,
    private collectionHierarchyService: CollectionHierarchyService, private telemetryService: TelemetryService,
    private sbFormBuilder: FormBuilder, private sourcingService: SourcingService, private helperService: HelperService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    localStorage.setItem('programId', this.programId);
  }
  ngOnInit() {
    if (['null', null, undefined, 'undefined'].includes(this.programId)) {
      this.toasterService.error(this.resourceService.messages.emsg.project.m0001);
    }
    this.getPageId();
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}, {id: this.programId, type: 'project'}];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
    this.getProgramDetails();
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('programComponent');
    this.currentStage = 'programComponent';
    this.searchLimitCount = this.registryService.searchLimitCount; // getting it from service file for better changing page limit
    this.pageLimit = this.registryService.programUserPageLimit;
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryInteractCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}.programs`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute,'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
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
      this.programContentTypes = (!_.isEmpty(this.programDetails.targetprimarycategories)) ? _.join(_.map(this.programDetails.targetprimarycategories, 'name'), ', ') : _.join(this.programDetails.content_types, ', ');
      this.roles =_.get(this.programDetails, 'config.roles');
      this.roles.push({'id': 3, 'name': 'BOTH', 'defaultTab': 3, 'tabs': [3]});
      this.rolesWithNone = _.cloneDeep(this.roles);
      this.rolesWithNone.push({'id': 4, 'name': 'NONE', 'defaultTab': 4, 'tabs': [4]});
      this.roleNames = _.map(this.rolesWithNone, 'name');
      this.fetchFrameWorkDetails();
      this.getNominationStatus();
      this.setActiveDate();
      this.showSkipReview = !!(_.get(this.userService, 'userProfile.rootOrgId') === _.get(this.programDetails, 'rootorg_id') &&
      this.programDetails.config.defaultContributeOrgReview === false) ;
    }, error => {
      // TODO: navigate to program list page
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.project.m0001,
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: req
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
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
        const errInfo = {
          errorMsg: 'Fetching framework details failed',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      });
    }
  }

  initiateInputs() {
    this.showLoader = false;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.configService.telemetryLabels.pageId.contribute.submitNomination,
      telemetryInteractCdata: this.telemetryInteractCdata
    };
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

    if (this.userService.isUserBelongsToOrg()) {
      req.data.request.filters['organisation_id'] = this.userService.getUserOrgId();
    } else {
      req.data.request.filters['user_id'] = this.userService.userid;
    }
    this.programsService.post(req).subscribe((data) => {
      const nominationDetails = _.first(_.get(data, 'result', []));

      if (!_.isEmpty(nominationDetails)) {
        if (!_.isEmpty(nominationDetails.content_types)) {
          nominationDetails.content_types = this.helperService.mapContentTypesToCategories(nominationDetails.content_types);
        }

        this.nominationDetails = nominationDetails;
      }
      if (!_.isEmpty(nominationDetails) && this.nominationDetails.status !== 'Initiated') {
        this.nominated = true;
        this.sessionContext.nominationDetails = nominationDetails;
        this.currentNominationStatus = _.get(nominationDetails, 'status');
        if (this.userService.isUserBelongsToOrg()) {
          this.sessionContext.currentOrgRole = _.first(this.userService.getUserOrgRole());
          if (this.sessionContext.currentOrgRole === 'admin') {
            this.sessionContext.currentRoles = (['Approved', 'Rejected'].includes(this.currentNominationStatus)) ? ['REVIEWER'] : ['CONTRIBUTOR'];
          } else if (this.sessionContext.nominationDetails.rolemapping) {
            this.sessionContext.currentRoles = this.userService.getMyRoleForProgram(this.nominationDetails);
          } else {
            this.sessionContext.currentRoles = ['CONTRIBUTOR'];
          }
        } else {
          this.sessionContext.currentRoles = ['CONTRIBUTOR'];
          this.sessionContext.currentOrgRole = 'individual';
        }

        const roles = _.filter(this.roles, role => this.sessionContext.currentRoles.includes(role.name));
        this.sessionContext.currentRoleIds = !_.isEmpty(roles) ? _.map(roles, role => role.id) : null;
        if (this.userService.isUserBelongsToOrg()) {
          this.registryService.getcontributingOrgUsersDetails().then((orgUsers) => {
            this.setOrgUsers(orgUsers);
          });
        }
      } else {
        if (data.result && !_.isEmpty(data.result)) {
          this.sessionContext.nominationDetails = _.first(data.result);
        }
        this.component = this.programComponentsService.getComponentInstance('collectionComponent');
        this.tabs = _.get(this.programDetails.config, 'header.config.tabs');
        this.initiateInputs();
      }

      if (this.nominated) {
        if (this.userService.isContributingOrgAdmin() || this.sessionContext.currentRoles.includes('REVIEWER')) {
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
            const errInfo = {
              errorMsg: 'Fetching Preferences  failed',
              telemetryPageId: this.telemetryPageId,
              telemetryCdata : this.telemetryInteractCdata,
              env : this.activatedRoute.snapshot.data.telemetry.env,
            };
            this.sourcingService.apiErrorHandling(err, errInfo);
          });
        } else {
          this.getProgramTextbooks();
        }
      }
    }, error => {
      const errInfo = {
        errorMsg: 'Failed fetching current nomination status',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
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
       filteredUser.length > this.searchLimitCount ? this.searchLimitMessage = true: this.searchLimitMessage = false;
      this.sortUsersList(filteredUser, true);
    } else {
      this.searchLimitMessage = false;
      this.sortUsersList(this.initialSourcingOrgUser, true);
    }
    this.sortColumnOrgUsers = 'projectselectedRole';
  }
  sortUsersList(usersList, isUserSearch?) {
     this.OrgUsersCnt = usersList.length;
     this.allContributorOrgUsers = this.programsService.sortCollection(usersList, this.sortColumnOrgUsers, this.directionOrgUsers);
    if (this.isInitialSourcingOrgUser) {
      this.initialSourcingOrgUser = this.allContributorOrgUsers;
      this.isInitialSourcingOrgUser = false;
    }
     usersList = _.chunk(this.allContributorOrgUsers, this.pageLimit);
     this.paginatedContributorOrgUsers = usersList;
     this.contributorOrgUser = isUserSearch ? usersList[0] : usersList[this.pageNumber - 1];
     this.pager = this.paginationService.getPager(this.OrgUsersCnt, isUserSearch ? 1 : this.pageNumber, this.pageLimit);
  }

  setOrgUsers(orgUsers) {
    if (_.isEmpty(orgUsers)) {
      this.showUsersLoader = false;
      return false;
    }

    this.allContributorOrgUsers = [];
    // Get only the users and skip admins
    orgUsers = _.filter(orgUsers, { "selectedRole": "user" });
    _.forEach(orgUsers, r => {
      r.projectselectedRole = '';
      if (this.nominationDetails.rolemapping) {
        const userRoles = this.userService.getMyRoleForProgram(this.nominationDetails, r.identifier);
        if (userRoles.includes("CONTRIBUTOR") && userRoles.includes("REVIEWER")) {
          r.projectselectedRole = "BOTH";
        } else if (userRoles.includes("CONTRIBUTOR")) {
          r.projectselectedRole = "CONTRIBUTOR";
        } else if (userRoles.includes("REVIEWER")) {
          r.projectselectedRole = "REVIEWER";
        }
      }

      if (r.projectselectedRole) {
        r.roles = this.rolesWithNone;
      } else {
        r.projectselectedRole = 'Select Role';
        r.roles = this.roles;
      }

      r.newRole = r.projectselectedRole;
      this.allContributorOrgUsers.push(r);
    });

    this.OrgUsersCnt = this.allContributorOrgUsers.length;
    this.sortOrgUsers('projectselectedRole');
    this.showUsersLoader = false;
    // tslint:disable-next-line:max-line-length
    this.logTelemetryImpressionEvent(this.allContributorOrgUsers, 'user', this.configService.telemetryLabels.pageId.contribute.projectAssignUsers);
    return true;
  }

  setTelemetryPageId(tabName) {
    if (tabName === 'textbook') {
      this.telemetryPageId = this.configService.telemetryLabels.pageId.contribute.projectContributions;
    } else if (tabName === 'user') {
      this.telemetryPageId = this.configService.telemetryLabels.pageId.contribute.projectAssignUsers;
    }
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.contributorOrgUser = this.paginatedContributorOrgUsers[this.pageNumber - 1];
    this.pager = this.paginationService.getPager(this.OrgUsersCnt, this.pageNumber, this.pageLimit);
  }

  /*showUserRoleOption(roleName, userRole) {
    this.selectRole = _.cloneDeep(this.roles);
     if (!(roleName !== 'NONE' || (roleName === 'NONE' && userRole !== 'Select Role'))) {
       this.selectRole.splice(3);
       return roleName;
    } else {
      return roleName;
    }
  }*/

  removeUserFromProgram() {
    if (this.userRemoveRoleLoader) {
      return false;
    }
    this.userRemoveRoleLoader = true;
    this.updateUserRoleMapping(this.getProgramRoleMapping(this.selectedUserToRemoveRole), this.selectedUserToRemoveRole);
  }

  cancelRemoveUserFromProgram() {
    this.showUserRemoveRoleModal = false;
    this.selectedUserToRemoveRole.newRole = this.selectedUserToRemoveRole.projectselectedRole;
  }

  getProgramRoleMapping(user) {
    const newRole = user.projectselectedRole;
    let progRoleMapping = this.nominationDetails.rolemapping;
    if (isNullOrUndefined(progRoleMapping) && newRole !== 'NONE') {
      progRoleMapping = {};
    }
    const programRoleNames = _.keys(progRoleMapping);
    if (!_.includes(programRoleNames, newRole) && !_.includes(["NONE", "BOTH"], newRole)) {
      progRoleMapping[newRole] = [];
    } else if (newRole == 'BOTH') {
      if (!_.includes(programRoleNames, 'CONTRIBUTOR')) {
        progRoleMapping['CONTRIBUTOR'] = [];
      }
      if (!_.includes(programRoleNames, 'REVIEWER')) {
        progRoleMapping['REVIEWER'] = [];
      }
    }
    _.forEach(progRoleMapping, (users, role) => {
      if (newRole === 'BOTH') {
        // If both option selected add user in both the roles array
        if (!_.includes(users, user.identifier)) {
          users.push(user.identifier);
        }
      } else {
        // Add to selected user to current selected role's array
        if (newRole === role && !_.includes(users, user.identifier) && newRole !== 'NONE') {
          users.push(user.identifier);
        }
        // Remove selected user from other role's array
        if (newRole !== role && _.includes(users, user.identifier)) {
          _.remove(users, (id) => id === user.identifier);
        }
      }
      // Remove duplicate users ids and falsy values
      progRoleMapping[role] = _.uniq(_.compact(users));
    });
    return progRoleMapping;
  }
  setTelemetryForonRoleChange(user) {
     const edata =  {
        id: 'assign_users_to_program',
        type: this.configService.telemetryLabels.eventType.click,
        subtype: this.configService.telemetryLabels.eventSubtype.submit,
        pageid: this.telemetryPageId,
        extra : {values: [user.identifier, user.newRole]}
      }
    this.registryService.generateUserRoleUpdateTelemetry(this.activatedRoute.snapshot.data.telemetry.env,this.telemetryInteractCdata,this.telemetryInteractPdata, edata )
 }
  onRoleChange(user) {
    this.setTelemetryForonRoleChange(user);
    const newRole = user.projectselectedRole;
    if (!_.includes(this.roleNames, newRole)) {
      this.toasterService.error(this.resourceService.messages.emsg.roles.m0003);
      return false;
    }
    // If new role is none then show remove user from program confirmation modal
    if (newRole === 'NONE') {
      this.selectedUserToRemoveRole = user;
      this.showUserRemoveRoleModal = true;
      return false;
    }
    this.updateUserRoleMapping(this.getProgramRoleMapping(user), user);
  }

  updateUserRoleMapping(progRoleMapping, user) {
    const req = {
      'request': {
        'program_id': this.activatedRoute.snapshot.params.programId,
        'user_id': this.nominationDetails.user_id,
        'rolemapping': progRoleMapping
      }
    };
    this.programsService.updateNomination(req).subscribe(response => {
      this.showUserRemoveRoleModal = false;
      this.userRemoveRoleLoader = false;

      if (user.projectselectedRole !== "NONE") {
        user.roles = this.rolesWithNone;
      } else {
        user.roles = this.roles;
        user.projectselectedRole = "Select Role"
      }
      this.nominationDetails.rolemapping = progRoleMapping;
      this.toasterService.success(this.resourceService.messages.smsg.roles.m0001);
    }, error => {
      this.showUserRemoveRoleModal = false;
      this.userRemoveRoleLoader = false;
      console.log(error);
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.roles.m0002,
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: req
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
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
    if (this.directionOrgUsers === 'asc' || this.directionOrgUsers === '') {
      this.directionOrgUsers = 'desc';
    } else {
      this.directionOrgUsers = 'asc';
    }
    this.sortColumnOrgUsers = column;
    this.sortUsersList(this.allContributorOrgUsers);
  }

  getProgramTextbooks(preferencefilters?) {
    const option = {
      url: 'composite/v3/search',
      data: {
        request: {
          filters: {
            objectType: 'collection',
            programId: this.activatedRoute.snapshot.params.programId,
            status: ['Draft', 'Live'],
            primaryCategory: !_.isNull(this.programDetails.target_collection_category) ? this.programDetails.target_collection_category : 'Digital Textbook'
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
      (err) => {
        const errInfo = {
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      }
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
          this.logTelemetryImpressionEvent(this.contributorTextbooks, 'collection');
          if (!_.isEmpty(mvcStageData)) {
            this.viewContribution(mvcStageData.collection);
          }
        },
        (error) => {
          console.log(error);
          this.showLoader = false;
          this.logTelemetryImpressionEvent(contributorTextbooks, 'collection');
          const errInfo = {
            errorMsg: 'Fetching textbooks failed. Please try again...',
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : this.telemetryInteractCdata,
            env : this.activatedRoute.snapshot.data.telemetry.env,
          };
          this.sourcingService.apiErrorHandling(error, errInfo);
        }
      );
    } else {
      this.contributorTextbooks = contributorTextbooks;
      this.tempSortTextbooks = this.contributorTextbooks;
      this.showLoader = false;
      this.logTelemetryImpressionEvent(this.contributorTextbooks, 'collection');
    }
  }

  public logTelemetryImpressionEvent(data, type, pageId?) {
    if (_.includes(this.visitedTab, type)) { return false; }
    this.visitedTab.push(type);
    const telemetryImpression = _.cloneDeep(this.telemetryImpression);
    if (data && !_.isEmpty(data)) {
      telemetryImpression.edata.visits = _.map(data, (row) => {
        return { objid: _.toString(row['identifier']), objtype: type };
      });
    } else {
      telemetryImpression.edata.visits = [];
    }
    telemetryImpression.edata.pageid = pageId ? pageId : this.telemetryPageId;
    this.telemetryService.impression(telemetryImpression);
  }

  viewContribution(collection) {
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection = collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.configService.telemetryLabels.pageId.contribute.projectTargetCollection,
      telemetryInteractCdata: this.getTelemetryInteractCdata(collection.identifier, 'linked_collection')
    };
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
        roles: {
          currentRoles: this.sessionContext.currentRoles
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
    return (contributionendDate.isSameOrAfter(today, 'day') && this.programsService.isProjectLive(this.programDetails)) ? true : false;
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
        const errInfo = {
          errorMsg: 'Fetching textbooks failed',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
          request: preferences
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
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
    return !!(_.get(this.sessionContext, 'nominationDetails.organisation_id'));
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  tabChangeHandler(e) {
    this.component = this.programComponentsService.getComponentInstance(e);
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

  getTelemetryInteractCdata(id, type) {
    return [ ...this.telemetryInteractCdata, {id: _.toString(id), type: type } ];
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
