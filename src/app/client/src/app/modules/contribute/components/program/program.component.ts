import { UserService, FrameworkService,
  ProgramsService, RegistryService, ActionService, ContentHelperService} from '@sunbird/core';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService, PaginationService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { map, catchError, tap, take } from 'rxjs/operators';
import { throwError, of, forkJoin, Subject } from 'rxjs';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { ChapterListComponent } from '../../../sourcing/components';
import { ICollectionComponentInput, IDashboardComponentInput,
  IPagination, IChapterListComponentInput} from '../../../sourcing/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService, ProgramTelemetryService} from '../../../program/services';
import { ProgramComponentsService } from '../../services/program-components/program-components.service';
import { IImpressionEventInput, IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';
import * as moment from 'moment';
import { SourcingService } from '../../../sourcing/services';
import { HelperService } from '../../../sourcing/services/helper.service';
import { isEmpty } from 'lodash';


interface IDynamicInput {
  collectionComponentInput?: ICollectionComponentInput;
  dashboardComponentInput?: IDashboardComponentInput;
}
@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('prefModal') prefModal;
  @ViewChild('userRemoveRoleModal') userRemoveRoleModal;
  public programId: string;
  public programDetails: any;
  public loaders = {
    showProgramHeaderLoader: true,
    showCollectionListLoader: true,
    showUsersLoader: true,
  };
  public showLoader = true;
  public stageSubscription: any;
  public dynamicInputs;
  public component: any;
  public sessionContext: ISessionContext = {};
  public state: InitialState = {
    stages: []
  };
  public currentStage: any;
  public telemetryImpression: IImpressionEventInput;
  public chapterListComponentInput: IChapterListComponentInput = {};
  public contributorTextbooks: any = [];
  public tempSortTextbooks = [];
  public direction = 'asc';
  public sortColumn = '';
  public contentStatusCounts: any = {};
  public programContentTypes: string;
  public roles;
  public rolesWithNone;
  public roleNames;
  public currentNominationStatus = '';
  public nominationDetails: any = {};
  showTextbookFiltersModal = false;
  textbookFiltersApplied = false;
  userPreferences: any = {};
  setPreferences = {};
  prefernceForm: UntypedFormGroup;
  public paginatedContributorOrgUsers: any = [];
  public allContributorOrgUsers: any = [];
  public contributorOrgUser: any = [];
  public directionOrgUsers = 'desc';
  public sortColumnOrgUsers = 'projectselectedRole';
  public isInitialSourcingOrgUser = true;
  OrgUsersCnt = 0;
  pager: IPagination;
  pageNumber = 1;
  pageLimit: any;
  sharedContext;
  showSkipReviewContributor = false;
  searchInput: any;
  initialSourcingOrgUser = [];
  searchLimitMessage: any;
  searchLimitCount: any;
  isContributingOrgAdmin: any;
  visitedTab = [];
  public userRemoveRoleLoader = false;
  public showUserRemoveRoleModal = false;
  public selectedUserToRemoveRole: any;
  public telemetryPageId: string;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public targetCollection: string;
  public targetCollections: string;
  public selectedCollectionIds = [];
  public selectedContentTypes = [];
  public showContentTypeModal = false;
  public preSavedContentTypes = [];
  public visibility = {};
  public firstLevelFolderLabel: string;
  public showResourceTemplatePopup = false;
  public resourceTemplateComponentInput: any;
  public templateDetails;
  public contentId: string;
  public nominationIsInProcess: boolean = false;
  public showNominateModal: boolean = false;
  public contentCount = 0;
  public showConfirmationModal = false;
  public prefernceFormOptions = {};
  public assignUserHelpSectionConfig: any;
  public nominationHelpSectionConfig: any;
  public contributeHelpSectionConfig: any;
  public noUsersFoundHelpConfig: any;
  public reviewHelpSectionConfig: any;

  constructor(public frameworkService: FrameworkService, public resourceService: ResourceService,
    public configService: ConfigService, public activatedRoute: ActivatedRoute, private router: Router,
    public userService: UserService,
    public toasterService: ToasterService, public programStageService: ProgramStageService,
    public programComponentsService: ProgramComponentsService, public programsService: ProgramsService,
    private navigationHelperService: NavigationHelperService, public registryService: RegistryService,
    private paginationService: PaginationService, public actionService: ActionService,
    private collectionHierarchyService: CollectionHierarchyService, private telemetryService: TelemetryService,
    private sbFormBuilder: UntypedFormBuilder, private sourcingService: SourcingService, private helperService: HelperService,
    public programTelemetryService: ProgramTelemetryService, private contentHelperService: ContentHelperService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
  }
  ngOnInit() {
    if (['null', null, undefined, 'undefined'].includes(this.programId)) {
      this.toasterService.error(this.resourceService.messages.emsg.project.m0001);
    }
    this.getPageId();
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}, {id: this.programId, type: 'project'}];
    this.telemetryInteractObject = {};
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.telemetryPageId,
      telemetryInteractCdata: this.telemetryInteractCdata
    };
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('programComponent');
    this.currentStage = 'programComponent';
    this.searchLimitCount = this.registryService.searchLimitCount; // getting it from service file for better changing page limit
    this.pageLimit = this.registryService.programUserPageLimit;
    this.getProgramDetails();
    this.setContextualHelpConfig();
  }

  ngAfterViewInit() {
    this.isContributingOrgAdmin =  this.userService.isContributingOrgAdmin();
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

  setContextualHelpConfig() {
    const sunbirdContextualHelpConfig = this.helperService.getContextualHelpConfig();
    if (!_.isUndefined(sunbirdContextualHelpConfig)) {
      if (_.has(sunbirdContextualHelpConfig, 'sourcing.assignUsersToProject') && this.router.url.includes('/sourcing')) {
        this.assignUserHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.assignUsersToProject');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.assignUsersToProject') && this.router.url.includes('/contribute')) {
        this.assignUserHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'contribute.assignUsersToProject');
      }
      if (_.has(sunbirdContextualHelpConfig, 'sourcing.noUsersFound') && this.router.url.includes('/sourcing')) {
        this.noUsersFoundHelpConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.noUsersFound');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.noUsersFound') && this.router.url.includes('/contribute')) {
        this.noUsersFoundHelpConfig = _.get(sunbirdContextualHelpConfig, 'contribute.noUsersFound');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.myProjectContribute') && this.router.url.includes('/contribute')) {
        this.contributeHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'contribute.myProjectContribute');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.allProjectNomations') && this.router.url.includes('/contribute')) {
        this.nominationHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'contribute.allProjectNomations');
      }
      if (_.has(sunbirdContextualHelpConfig, 'sourcing.reviewContributions') && this.router.url.includes('/sourcing')) {
        this.reviewHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.reviewContributions');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.reviewContributions') && this.router.url.includes('/contribute')) {
        this.reviewHelpSectionConfig = _.get(sunbirdContextualHelpConfig, 'contribute.reviewContributions');
      }
    }
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute,'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  getProgramDetails() {
    this.programsService.getProgram(this.programId).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.programContentTypes = this.programsService.getProgramTargetPrimaryCategories(this.programDetails);
      this.roles =_.get(this.programDetails, 'config.roles');
      this.roles.push({'id': 3, 'name': 'BOTH', 'defaultTab': 3, 'tabs': [3]});
      this.rolesWithNone = _.cloneDeep(this.roles);
      this.rolesWithNone.push({'id': 4, 'name': 'NONE', 'defaultTab': 4, 'tabs': [4]});
      this.roleNames = _.map(this.rolesWithNone, 'name');
      this.sessionContext.programId = this.programDetails.program_id;
      this.sessionContext.framework = _.isArray(_.get(this.programDetails, 'config.framework')) ? _.first(_.get(this.programDetails, 'config.framework')) : _.get(this.programDetails, 'config.framework');
      this.getNominationStatus();
      this.setTargetCollectionValue();
      this.getCollectionCategoryDefinition();
    }, error => {
      // TODO: navigate to program list page
      this.raiseError(error, this.resourceService.messages.emsg.project.m0001)
    });
  }

  setTargetCollectionValue() {
    if (!_.isUndefined(this.programDetails)) {
      this.targetCollection = this.programsService.setTargetCollectionName(this.programDetails);
      this.targetCollections = this.programsService.setTargetCollectionName(this.programDetails, 'plural');
    }
  }

  isSourcingOrgReviewer () {
    return this.userService.isSourcingOrgReviewer(this.programDetails);
  }

  getNominationStatus() {
    const filters = {
      program_id: this.activatedRoute.snapshot.params.programId
    }
    if (this.userService.isUserBelongsToOrg()) {
      filters['organisation_id'] = this.userService.getUserOrgId();
    } else {
      filters['user_id'] = this.userService.userid;
    }
    this.programsService.getNominationList(filters).subscribe((data) => {
      this.nominationDetails = _.first(_.get(data, 'result', []));
      if (!_.isEmpty(this.nominationDetails)) {
        if (!_.isEmpty(this.nominationDetails.content_types)) {
          this.nominationDetails.content_types = this.helperService.mapContentTypesToCategories(this.nominationDetails.content_types);
        }
        this.selectedContentTypes = this.programsService.getNominatedTargetPrimaryCategories(this.programDetails, this.nominationDetails);
        this.currentNominationStatus = _.get(this.nominationDetails, 'status');
        this.selectedCollectionIds = _.get(this.nominationDetails, 'collection_ids');
        this.sessionContext.nominationDetails = this.nominationDetails;
      }
      this.setProgramRole();
      this.handleActionButtons();
      this.setifSampleInSession();
      this.sessionContext['selectedSharedProperties'] = this.helperService.getSharedProperties(this.programDetails);
      this.sessionContext = _.assign(this.sessionContext, this.sessionContext['selectedSharedProperties']);
      this.loaders.showProgramHeaderLoader = false;
      this.contentCount = 0;
      this.frameworkService.getMasterCategories();
      this.frameworkService.readFramworkCategories(this.sessionContext.framework).subscribe((frameworkData) => {
        if (frameworkData) {
          this.sessionContext.frameworkData = frameworkData.categories;
          this.sessionContext['frameworkType'] = frameworkData.type;
          this.sessionContext.topicList = _.get(_.find(this.sessionContext.frameworkData, { code: 'topic' }), 'terms');
        }
        if (!this.programDetails.target_type || this.programDetails.target_type === 'collections' || this.programDetails.target_type === 'questionSets') {
          this.getProgramCollections();
        } else if (this.programDetails.target_type == 'searchCriteria') {
          forkJoin(this.getUserProgramPreferences(),this.getOriginForApprovedContents(), this.getProgramContentAggregation()).subscribe((res) => {
            const preferences = _.get(_.first(res), 'result');
            this.getProgramContents(_.get(preferences, 'contributor_preference'));
          })
        }
      }, error => {
        this.raiseError(error, 'Fetching framework details failed')
      });
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

  setProgramRole() {
    //const nonInitiatedStatus = ['Pending', 'Approved', 'Rejected'];
    //if (this.currentNominationStatus && _.includes(nonInitiatedStatus, this.currentNominationStatus)) {
      if (this.userService.isUserBelongsToOrg()) {
        this.sessionContext.currentOrgRole = _.first(this.userService.getUserOrgRole());
        if (this.sessionContext.currentOrgRole === 'admin') {
          this.sessionContext.currentRoles = (['Approved', 'Rejected'].includes(this.currentNominationStatus)) ? ['REVIEWER'] : ['CONTRIBUTOR'];
        } else if (this.sessionContext.nominationDetails.rolemapping) {
          this.sessionContext.currentRoles = this.userService.getMyRoleForProgram(this.nominationDetails);
        } else {
          this.sessionContext.currentRoles = ['CONTRIBUTOR'];
        }

        const defaultContributeOrgReview = _.get(this.programDetails, 'config.defaultContributeOrgReview');
        const programType = _.get(this.programDetails, 'type');
        const isContributingOrgContributor = this.userService.isContributingOrgContributor(this.sessionContext.nominationDetails);
        const isDefaultContributingOrg = this.userService.isDefaultContributingOrg(this.programDetails);;
        if (defaultContributeOrgReview === false && (programType === 'restricted' ||
        (isContributingOrgContributor && isDefaultContributingOrg && _.get(this.sessionContext, 'currentRoles').includes('CONTRIBUTOR') && this.currentNominationStatus === 'Approved'))) {
          this.sessionContext.currentOrgRole = 'individual';
        }
      } else {
        this.sessionContext.currentRoles = ['CONTRIBUTOR'];
        this.sessionContext.currentOrgRole = 'individual';
      }
      const roles = _.filter(this.roles, role => this.sessionContext.currentRoles.includes(role.name));
      this.sessionContext.currentRoleIds = !_.isEmpty(roles) ? _.map(roles, role => role.id) : null;
      this.roles.currentRoles = this.sessionContext.currentRoles;
    //}
  }
  setifSampleInSession() {
    if (this.sessionContext.currentOrgRole !== 'user' && (!this.currentNominationStatus || !_.includes(['Approved', 'Rejected'], this.currentNominationStatus))) {
      this.sessionContext['sampleContent'] = true;
    } else {
      this.sessionContext['sampleContent'] = false;
    }
  }
  getUserProgramPreferences() {
    this.prefernceForm = this.sbFormBuilder.group({
      medium: [],
      subject: [],
      gradeLevel: [],
    });

    this.prefernceFormOptions['medium'] = _.compact(this.programDetails.config.medium) || [];
    this.prefernceFormOptions['gradeLevel'] = _.compact(this.programDetails.config.gradeLevel) || [];
    this.prefernceFormOptions['subject'] = _.compact(this.programDetails.config.subject) || [];

    if (this.programDetails.target_type === 'searchCriteria' && !_.isEmpty(this.sessionContext.frameworkData)) {
      this.sessionContext.frameworkData.forEach((element) => {
        if (_.includes(['medium', 'subject', 'gradeLevel'], element.code)) {
          this.prefernceFormOptions[element['code']] = _.map(element.terms, 'name');
        }
      });
    }
    const req = this.programsService.getUserPreferencesforProgram(this.userService.userProfile.identifier, this.programId);
    return req.pipe(
      tap((res) => {
        let prefres = _.get(res, 'result')
        if (prefres !== null || prefres !== undefined) {
          this.userPreferences = prefres;
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
      }),catchError((error) => {
        const errInfo = {
          errorMsg: 'Fetching Preferences  failed',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
        console.log('Getting origin data failed');
        return of(false);
      }));
  }

  getProgramCollections() {
    const nonInitiatedStatus = ['Pending', 'Approved', 'Rejected'];
    if (this.currentNominationStatus && _.includes(nonInitiatedStatus, this.currentNominationStatus) && (this.isContributingOrgAdmin || this.sessionContext.currentRoles.includes('REVIEWER'))) {
      this.getUserProgramPreferences().subscribe(
        (prefres) => {
          let preffilter = _.get(prefres, 'result.contributor_preference');
          this.fetchProgramCollections(preffilter);
      }, (err) => { // TODO: navigate to program list page
        this.fetchProgramCollections();
        const errInfo = {
          errorMsg: 'Fetching Preferences  failed',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    } else {
      this.fetchProgramCollections();
    }
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

  getContributorOrgUsers() {
    const roles = _.filter(this.roles, role => this.sessionContext.currentRoles.includes(role.name));
    this.sessionContext.currentRoleIds = !_.isEmpty(roles) ? _.map(roles, role => role.id) : null;
    if (this.userService.isUserBelongsToOrg()) {
      this.registryService.getOrgUsersDetails().then((orgUsers) => {
        this.setOrgUsers(orgUsers);
      });
    }
  }

  setOrgUsers(orgUsers) {
    if (_.isEmpty(orgUsers)) {
      this.loaders.showUsersLoader = false;
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
    this.loaders.showUsersLoader = false;
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
    if ((progRoleMapping === null || progRoleMapping === undefined) && newRole !== 'NONE') {
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
  getOriginForApprovedContents() {
    if (!_.isEmpty(this.programDetails.acceptedcontents)) {
      const originRes = this.collectionHierarchyService.getOriginForApprovedContents(this.programDetails.acceptedcontents);
      return originRes.pipe(
        tap((response: any) => {
        if (_.get(response, 'result.count') && _.get(response, 'result.count') > 0) {
         const allRes = _.compact(_.concat(_.get(response, 'result.content'), _.get(response, 'result.QuestionSet')));
          this.sessionContext['contentOrigins'] = {};
          _.forEach(allRes, (obj) => {
            if (obj.status == 'Live') {
              this.sessionContext['contentOrigins'][obj.origin] = obj;
            }
          });
        }
        }),catchError((error) => {
        console.log('Getting origin data failed');
        return of(false);
      }));
    } else {
      return of([]);
    }
  }

  getProgramContentAggregation() {
    let sampleValue, organisation_id, individualUserId, onlyCount;
    if (_.includes(['Initiated', 'Pending'], this.currentNominationStatus)) {
        sampleValue = true;
      if (this.userService.isUserBelongsToOrg()) {
        organisation_id = this.userService.getUserOrgId();
      } else {
        individualUserId = this.userService.userid;
      }
    }
    return this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId, sampleValue, organisation_id, individualUserId, onlyCount, true).pipe(
      tap((response) => {
        let contents = [];
        if (response && _.get(response, 'result') && (_.get(response, 'result.content')|| _.get(response, 'result.QuestionSet'))) {
          contents = _.compact(_.concat(_.get(response, 'result.QuestionSet'), _.get(response, 'result.content')));
        }
        if (this.userService.isUserBelongsToOrg()) {
          this.contentStatusCounts = this.collectionHierarchyService.getContentCounts(contents, this.userService.getUserOrgId());
        } else {
          // tslint:disable-next-line:max-line-length
          this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForIndividual(contents, this.userService.userid);
        }
      }), catchError((error) => {
        this.loaders.showCollectionListLoader= false;
        this.logTelemetryImpressionEvent([], 'contents');
        const errInfo = {
          errorMsg: 'Fetching textbooks failed. Please try again...',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
        return of(false);
      }));
  }

  getProgramContents(preferences?) {
    let sampleValue, organisation_id, individualUserId, onlyCount;
    if (_.includes(['Initiated', 'Pending'], this.currentNominationStatus)) {
        sampleValue = true;
    }
    if (this.userService.isUserBelongsToOrg()) {
      organisation_id = this.userService.getUserOrgId();
    } else {
      individualUserId = this.userService.userid;
    }

    this.collectionHierarchyService.preferencefilters = preferences;
    this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId, sampleValue, organisation_id, individualUserId, onlyCount, true).subscribe(
      (response) => {
        let contents = [];
        if (response && response.result && (_.get(response.result, 'content')|| _.get(response.result, 'QuestionSet'))) {
          contents = _.compact(_.concat(_.get(response.result, 'QuestionSet'), _.get(response.result, 'content')));
        }
        this.contentCount = 0;
        this.contributorTextbooks = _.cloneDeep(contents);
        _.map(this.contributorTextbooks, (content) => {
          content['contentVisibility'] = this.contentHelperService.shouldContentBeVisible(content, this.programDetails, this.currentNominationStatus, this.sessionContext.currentRoles);
          content['sourcingStatus'] = this.contentHelperService.checkSourcingStatus(content, this.programDetails);
          const temp = this.contentHelperService.getContentDisplayStatus(content)
          content['resourceStatusText'] = temp[0];
          content['resourceStatusClass'] = temp[1];
          if (content.contentVisibility) {
            this.contentCount++;
          }
        });
        this.tempSortTextbooks = this.contributorTextbooks;
        this.loaders.showCollectionListLoader= false;
        this.logTelemetryImpressionEvent(this.contributorTextbooks, 'contents');
      },(error) => {
        this.loaders.showCollectionListLoader= false;
        this.logTelemetryImpressionEvent([], 'contents');
        const errInfo = {
          errorMsg: 'Fetching textbooks failed. Please try again...',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      });
  }
  fetchProgramCollections(preferencefilters?) {
    this.collectionHierarchyService.getCollectionWithProgramId(this.programId, this.programDetails.target_collection_category, preferencefilters, true, this.programDetails.target_type).subscribe(
      (res) => {
        let objType = 'content';
        if(this.programDetails?.target_type === 'questionSets') objType = 'QuestionSet';
        if (res && res.result && res.result[objType] && res.result[objType].length) {
          this.showTexbooklist(res.result[objType]);
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

  showTexbooklist(contributorTextbooks) {
    const notInitiatedNoms = ['Pending', 'Approved', 'Rejected'];
    // tslint:disable-next-line:max-line-length
    const isTargetTypeQuestionSet = this.programDetails?.target_type === 'questionSets' ? true : false;

    contributorTextbooks = (!_.isUndefined(this.currentNominationStatus) && _.includes(notInitiatedNoms, this.currentNominationStatus)) ? _.filter(contributorTextbooks, (collection) => {

      return _.includes(
        isTargetTypeQuestionSet ? this.programDetails.collection_ids :
        this.nominationDetails.collection_ids, collection.identifier);
    }) : contributorTextbooks;

    let sampleValue, organisation_id, individualUserId;
    if (_.includes(['Initiated', 'Pending'], this.currentNominationStatus)) {
        sampleValue = true;
      if (this.userService.isUserBelongsToOrg()) {
        organisation_id = this.userService.getUserOrgId();
      } else {
        individualUserId = this.userService.userid;
      }
    }
    this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId, sampleValue, organisation_id, individualUserId).subscribe(
      (response) => {
        let contents = [];
        if (response && response.result && (_.get(response.result, 'content')|| _.get(response.result, 'QuestionSet') || _.get(response.result, 'Question'))) {
          if(isTargetTypeQuestionSet) {
            contents = _.compact(_.concat(_.get(response.result, 'content'), _.get(response.result, 'Question')));
          } else {
            contents = _.compact(_.concat(_.get(response.result, 'QuestionSet'), _.get(response.result, 'content')), _.get(response.result, 'Question'));
          }
        }
        if (this.userService.isUserBelongsToOrg()) {
            this.contentStatusCounts = this.collectionHierarchyService.getContentCounts(contents, this.userService.getUserOrgId(), contributorTextbooks);
        } else {
          // tslint:disable-next-line:max-line-length
          this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForIndividual(contents, this.userService.userid, contributorTextbooks);
        }
        this.contributorTextbooks = this.collectionHierarchyService.getIndividualCollectionStatus(this.contentStatusCounts, contributorTextbooks);
        this.contentCount = this.contributorTextbooks.length;
        const collectionsWithSamples = _.map(_.filter(this.contributorTextbooks, c => c.totalSampleContent > 0), 'identifier');
        if (!_.isEmpty(this.selectedCollectionIds)) {
          this.selectedCollectionIds = [...this.selectedCollectionIds, ...collectionsWithSamples]
        } else {
          this.selectedCollectionIds = collectionsWithSamples;
        }
        this.selectedCollectionIds = _.uniq(_.compact(this.selectedCollectionIds));
      _.map(this.contributorTextbooks, textbook => {
        textbook.isSelected = _.includes(this.selectedCollectionIds, textbook.identifier);
        });
        this.tempSortTextbooks = this.contributorTextbooks;
        this.loaders.showCollectionListLoader = false;
        this.logTelemetryImpressionEvent(this.contributorTextbooks, 'collection');
        // } else {
        //   if (_.isDefined(this.currentNominationStatus) && _.includes(notInitiatedNoms, this.currentNominationStatus)) {
        //     // tslint:disable-next-line:max-line-length
        //     this.contentStatusCounts = this.collectionHierarchyService.getContentCounts([], this.sessionContext.nominationDetails.organisation_id, contributorTextbooks);
        //     // tslint:disable-next-line:max-line-length
        //   }
        // }

    }, (error) => {
      this.loaders.showCollectionListLoader = false;
      this.logTelemetryImpressionEvent(contributorTextbooks, 'collection');
      const errInfo = {
        errorMsg: 'Fetching textbooks failed. Please try again...',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
    /*else {
      this.contributorTextbooks = contributorTextbooks;
      this.tempSortTextbooks = this.contributorTextbooks;
      this.showLoader = false;
      this.logTelemetryImpressionEvent(this.contributorTextbooks, 'collection');
    }*/
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

  openCollection(collection) {
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection = collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.sessionContext.targetCollectionPrimaryCategory = _.get(collection, 'primaryCategory');
    this.sessionContext.targetCollectionMimetype = _.get(collection, 'mimeType');
    this.sessionContext.targetCollectionObjectType = _.get(collection, 'objectType');
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.configService.telemetryLabels.pageId.contribute.projectTargetCollection,
      telemetryInteractCdata: this.getTelemetryInteractCdata(collection.identifier, 'linked_collection')
    };

    this.setFrameworkCategories(collection);
    const collectionSharedProperties = this.helperService.getSharedProperties(this.programDetails, collection);
    const collectionFramework = collectionSharedProperties.framework;
    const sessionContextFramework = this.sessionContext.framework;
    this.sessionContext = _.assign(this.sessionContext, collectionSharedProperties);
    if (collectionFramework !== sessionContextFramework) {
      this.frameworkService.readFramworkCategories(this.sessionContext.framework).subscribe((frameworkData) => {
        if (frameworkData) {
          this.sessionContext.frameworkData = frameworkData.categories;
          this.sessionContext['frameworkType'] = frameworkData.type;
          this.sessionContext.topicList = _.get(_.find(this.sessionContext.frameworkData, { code: 'topic' }), 'terms');
          this.openToc(collection);
        }
      }, error => {
        this.raiseError(error, 'Fetching framework details failed')
      });
    } else {
      this.openToc(collection);
    }
  }

  openToc(collection) {
    this.dynamicInputs = {
      chapterListComponentInput: {
        sessionContext: this.sessionContext,
        collection: collection,
        programContext: this.programDetails,
        roles: {
          currentRoles: this.sessionContext.currentRoles
        }
      }
    };
    this.programsService.clearMvcStageData();
    this.programStageService.addStage('chapterListComponent');
  }

  openContent(content) {
    this.contentHelperService.initialize(this.programDetails, this.sessionContext);
    this.contentHelperService.openContent(content).then((response) => {
      this.setContentComponent(response);
    }).catch((error) => this.raiseError(error, 'Errror in opening the content componnet'));
  }

  setFrameworkCategories(collection) {
    this.sessionContext.targetCollectionFrameworksData = this.helperService.setFrameworkCategories(collection);
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
    if (this.programDetails.target_type === 'searchCriteria') {
      this.getProgramContents(preferences);
    }
    else {
      this.fetchProgramCollections(preferences);
    }
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

  showResourceTemplate() {
    if (!_.get(this.nominationDetails, 'id') || this.currentNominationStatus === 'Initiated') {
      this.createNomination('Initiated');
    } else {
      this.resourceTemplateInputData();
      this.showResourceTemplatePopup = true;
    }
  }
  uploadSampleContent(collection) {
    if (!_.get(this.nominationDetails, 'id') || this.currentNominationStatus === 'Initiated') {
      this.createNomination('Initiated', collection);
    } else {
      this.openCollection(collection);
    }
  }
  createNomination(status = 'Pending', collection?) {
    this.nominationIsInProcess = true;
    if (!this.selectedContentTypes.length) {
      this.nominationIsInProcess = false;
      this.toasterService.error(this.resourceService.messages.emsg.nomination.m001);
    } else {
      const programId = this.activatedRoute.snapshot.params.programId;
      const userId = this.userService.userid;
      const request = {
        program_id: programId,
        status: status,
        collection_ids: this.selectedCollectionIds
      };

      if (!_.isEmpty(this.programDetails.targetprimarycategories)) {
        request['targetprimarycategories'] =  this.selectedContentTypes;
        request['content_types'] = [];
      } else {
        request['content_types'] = _.map(this.selectedContentTypes, 'name');
      }
      this.programsService.addorUpdateNomination(request).subscribe((data) => {
        this.nominationIsInProcess = false;
        this.showNominateModal = false;
        const router = this.router;
        if (data.result && !_.isEmpty(data.result)) {
          if (status === 'Initiated') {
            this.sessionContext.nominationDetails = {
              id: data.result.id,
              status: 'Initiated',
              program_id: programId,
              user_id: userId,
            };

            if (!_.isEmpty(this.programDetails.targetprimarycategories)) {
              this.sessionContext.nominationDetails['targetprimarycategories'] =  this.selectedContentTypes;
              request['content_types'] = [];
            } else {
              this.sessionContext.nominationDetails['content_types'] = _.map(this.selectedContentTypes, 'name');
            }
            if (this.userService.isUserBelongsToOrg()) {
              this.sessionContext.nominationDetails['organisation_id'] = this.userService.getUserOrgId();
            }
            if (collection && (!_.get(this.programDetails, 'target_type') || this.programDetails.target_type === 'collections')) {
              this.openCollection(collection);
            } else {
              this.contentHelperService.setNominationDetails(this.sessionContext.nominationDetails);
              this.resourceTemplateInputData();
              this.showResourceTemplatePopup = true;
            }
          } else {
            this.toasterService.success('Nomination sent');
            setTimeout(function() { router.navigateByUrl('/contribute/myenrollprograms'); }, 10);
          }
        } else if (data === 'Approved' || data === 'Rejected') {
          this.toasterService.error(`${this.resourceService.messages.emsg.modifyNomination.error} ${data}`);
          setTimeout(function() { router.navigateByUrl('/contribute/myenrollprograms'); }, 10);
        }
      }, (error)=> {
        this.nominationIsInProcess = false;
        const errInfo = {
          errorMsg: this.resourceService.messages.emsg.bulkApprove.something,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
          request: request
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      });
    }
  }

  handleTemplateSelection(event) {
    this.showResourceTemplatePopup = false;
    this.contentHelperService.initialize(this.programDetails, this.sessionContext);
    this.contentHelperService.handleContentCreation(event).then((response) => {
      this.setContentComponent(response);
    }).catch((error) => this.raiseError(error, 'Errror in opening the content componnet'));
  }

  setContentComponent(response) {
    this.dynamicInputs = response.dynamicInputs;
    this.component = response.currentComponent;
    this.programStageService.addStage(response.currentComponentName);
  }

  resourceTemplateInputData() {
    //let contentCategories = this.programsService.getNominatedTargetPrimaryCategories(this.programContext, this.sessionContext.nominationDetails);
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.configService.telemetryLabels.pageId.contribute.submitNominationSampleDetails,
      telemetryInteractCdata: this.telemetryInteractCdata
    }
    this.resourceTemplateComponentInput = {
      templateList: this.selectedContentTypes,
      programContext: this.programDetails,
      sessionContext: this.sessionContext,
      unitIdentifier: null
    };
  }
  handleActionButtons() {
    this.visibility = {};
    const isOpenForNomination = this.helperService.isOpenForNomination(this.programDetails);
    const canAcceptContribution = this.helperService.canAcceptContribution(this.programDetails);
    const isProgramForCollections = !!(!this.programDetails.target_type || _.includes(['collections', 'questionSets'], this.programDetails.target_type));
    const isProgramForNoCollections = !!(this.programDetails.target_type && this.programDetails.target_type === 'searchCriteria')
    const isSourcingSide = this.programsService.ifSourcingInstance();
    this.visibility['showNominate'] = isOpenForNomination && (!_.get(this.nominationDetails, 'id') || _.get(this.nominationDetails, 'status') === 'Initiated');
    this.visibility['showProgramLevelSampleUpload'] = this.visibility['showNominate'] && isProgramForNoCollections;
    this.visibility['showProgramLevelContentUpload'] = this.currentNominationStatus === 'Approved' && isProgramForNoCollections && this.sessionContext?.currentRoles?.includes('CONTRIBUTOR') && canAcceptContribution;
    this.visibility['showCollectionLevelSampleUpload'] = this.visibility['showNominate'] && isProgramForCollections;
    this.visibility['showCollectionLevelUploadContent'] = this.currentNominationStatus === 'Approved' && this.sessionContext?.currentRoles?.includes('CONTRIBUTOR') && canAcceptContribution && isProgramForCollections;
    this.visibility['showViewContribution'] = this.currentNominationStatus === 'Approved' && !canAcceptContribution && isProgramForCollections;
    this.visibility['showReviewContent'] = this.currentNominationStatus === 'Approved' && this.sessionContext?.currentRoles?.includes('REVIEWER') && !this.sessionContext?.currentRoles?.includes('CONTRIBUTOR') && canAcceptContribution && isProgramForCollections;
    this.visibility['showContentLevelOpen'] = (!this.currentNominationStatus || _.includes(['Initiated', 'Pending', 'Approved'], this.currentNominationStatus)) && isProgramForNoCollections;
    this.visibility['showProgramLevelBulkUpload']= isProgramForNoCollections && canAcceptContribution && !_.includes(['Pending', 'Initiated'], this.currentNominationStatus) && _.get(this.sessionContext, 'currentRoles', []).includes('CONTRIBUTOR');
    this.visibility['showFilter'] = (isProgramForCollections && (this.isContributingOrgAdmin || this.sessionContext?.currentRoles?.includes('REVIEWER')) || (isProgramForNoCollections && this.currentNominationStatus === 'Approved'));
    // tslint:disable-next-line:max-line-length
    this.visibility['showCollectionLevelSamples'] = (this.isContributingOrgAdmin || !this.userService.isUserBelongsToOrg()) && isProgramForCollections && _.includes(['Initiated', 'Rejected'], this.currentNominationStatus);
    this.visibility['showCollectionLevelContentStatus'] = this.isContributingOrgAdmin && isProgramForCollections && _.includes(['Approved', 'Pending'], this.currentNominationStatus);
    this.visibility['showReviewContentHelp'] = this.currentNominationStatus === 'Approved' && this.sessionContext?.currentRoles?.includes('REVIEWER') && !this.sessionContext?.currentRoles?.includes('CONTRIBUTOR') && canAcceptContribution;
  }

  getCollectionCategoryDefinition() {
    this.firstLevelFolderLabel = _.get(this.resourceService, 'frmelmnts.lbl.deafultFirstLevelFolders');
    if (!_.isEmpty(this.programDetails.target_collection_category) && this.userService.userProfile.rootOrgId) {
      // tslint:disable-next-line:max-line-length
      let objType = 'Collection';
      if(_.get(this.programDetails, 'target_type') === 'questionSets') objType = 'QuestionSet';
      this.programsService.getCategoryDefinition(this.programDetails.target_collection_category[0], this.userService.userProfile.rootOrgId, objType).subscribe(res => {
        const objectCategoryDefinition = res.result.objectCategoryDefinition;
        if (_.has(objectCategoryDefinition.objectMetadata.config, 'sourcingSettings.collection.hierarchy.level1.name')) {
          // tslint:disable-next-line:max-line-length
        this.firstLevelFolderLabel = objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection.hierarchy.level1.name;
        } else {
          this.firstLevelFolderLabel = _.get(this.resourceService, 'frmelmnts.lbl.deafultFirstLevelFolders');
        }
      });
    }
  }
  cancelNomination() {
    this.showNominateModal = false;
  }
  contentTypeModalAction(action) {
    if (action === 'open') {
      this.preSavedContentTypes = _.clone(this.selectedContentTypes)
    } else if (action === 'cancel') {
      this.selectedContentTypes = this.preSavedContentTypes;
    }
    if (action === 'cancel' && !this.selectedContentTypes.length) {
      this.toasterService.error(this.resourceService.messages.emsg.nomination.m001);
    } else if (action === 'submit') {
      if (this.programDetails.target_type === 'searchCriteria'){
        //this.initiateNomination();
        this.toasterService.success(this.resourceService.messages.smsg.nomination.m001)
      } else {
        this.toasterService.success(this.resourceService.messages.smsg.nomination.m001)
      }
    }
  }
  checkIfSelected(contentType) {
    let catObj = _.find(this.selectedContentTypes, (element) => {
      return element.name === contentType.name;
    });
    return (catObj) ? true : false;
  }
  toggle(item: any) {
    let catObj = _.find(this.selectedContentTypes, (element) => {
      return element.name === item.name;
    });
    if (catObj) {
      _.remove(this.selectedContentTypes, (data) => {
        return data.name === item.name;
      });
    } else {
      this.selectedContentTypes.push(item);
    }
  }
  selectCollectionForNomination(collection) {
    if (_.includes(this.selectedCollectionIds, collection.identifier)) {
      _.remove(this.selectedCollectionIds, (data) => {
        return data === collection.identifier;
      });
    } else {
      this.selectedCollectionIds.push(collection.identifier);
    }
    this.toggleUploadSampleButton(collection);
  }
  toggleUploadSampleButton(collection) {
    collection.isSelected = !collection.isSelected;
  }
  showContentDeleteModal(content) {
    this.contentId = content.identifier;
    this.showConfirmationModal = true;
  }
  deleteContent() {
    this.helperService.retireContent(this.contentId)
      .subscribe(
        (response) => {
          if (response && response.result && response.result.node_id) {
            this.toasterService.success(this.resourceService.messages.smsg.m0064);
            const cindex = this.contributorTextbooks.findIndex(x => x.identifier === this.contentId);
            this.contributorTextbooks.splice(cindex, 1);
            this.contentCount = this.contentCount-1;
          } else {
            this.toasterService.error(this.resourceService.messages.fmsg.m00103);
          }
          this.showConfirmationModal = false;
        },
        (error) => {
          const errInfo = {
            errorMsg: this.resourceService.messages.fmsg.m00103,
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : this.telemetryInteractCdata,
            env : this.activatedRoute.snapshot.data.telemetry.env,
          };
          this.sourcingService.apiErrorHandling(error, errInfo);
        }
      );
  }
  raiseError(error, errorMsg) {
    const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
    this.toasterService.error(errorMes || errorMsg);
    const errInfo = {
      errorMsg:  errorMsg,
      telemetryPageId: _.get(this.activatedRoute,'snapshot.data.telemetry.pageid'),
      telemetryCdata : [{id: this.userService.channel, type: 'sourcing_organization'}, {id: this.sessionContext.programId , type: 'project'}],
      env : this.activatedRoute.snapshot.data.telemetry.env,
    };
    this.sourcingService.apiErrorHandling(error, errInfo);
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
    if (this.sessionContext && this.programDetails && this.currentStage === 'programComponent') {
      this.nominationIsInProcess = false;
      this.loaders.showCollectionListLoader = true;
      setTimeout(() => {
        this.getNominationStatus();
      }, 3000);
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
