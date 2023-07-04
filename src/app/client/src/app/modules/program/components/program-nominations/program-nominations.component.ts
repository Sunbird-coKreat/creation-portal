import { ResourceService, ConfigService, NavigationHelperService, ToasterService, PaginationService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { ProgramsService, UserService, FrameworkService, RegistryService, ContentHelperService } from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ISessionContext, InitialState, IPagination} from '../../../sourcing/interfaces';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import * as _ from 'lodash-es';
import { tap, first, catchError, takeUntil, take } from 'rxjs/operators';
import { Subject, forkJoin, of } from 'rxjs';
import * as moment from 'moment';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';
import { ChapterListComponent } from '../../../sourcing/components/chapter-list/chapter-list.component';
import { DatePipe } from '@angular/common';
import {ProgramTelemetryService} from '../../services';
import { SourcingService } from '../../../sourcing/services';
import { HelperService } from '../../../sourcing/services/helper.service';
import { collection } from '../list-contributor-textbooks/data';

@Component({
  selector: 'app-program-nominations',
  templateUrl: './program-nominations.component.html',
  styleUrls: ['./program-nominations.component.scss'],
  providers: [DatePipe]
})

export class ProgramNominationsComponent implements OnInit, AfterViewInit, OnDestroy {
  public programId: string;
  public programDetails: any;
  public programContentTypes: string;
  public unsubscribe = new Subject<void>();
  nominations = [];
  collectionsCount;
  tempNominations;
  public downloadInProgress = false;
  filterApplied: any;
  public selectedStatus = 'All';
  showNominationsComponent = false;
  public statusCount = {};
  public activeDate = '';
  public sessionContext: ISessionContext = {};
  public userProfile: any;
  public selectedNomination: any;
  public showContributorProfilePopup = false;
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public visitedTab = [];
  public activeTab = '';
  public direction = 'asc';
  public sortColumn = '';
  public sourcingOrgUser = [];
  public initialSourcingOrgUser = [];
  public searchLimitMessage: any;
  public sourcingOrgUserCnt = 0;
  public roles;
  roleNames;
  public currentStage: string;
  public dynamicInputs;
  public state: InitialState = {
    stages: []
  };
  public stageSubscription: any;
  public component: any;
  public programCollections: any;
  public contentAggregationData: any = [];
  public contributionDashboardData: any = [];
  public approvedNominations: any = [];
  public overAllContentCount: any = {};
  public isContributionDashboardTabActive = false;
  nominatedContentTypes: any = [];
  public contributedByOrganisation = 0;
  public contributedByIndividual = 0;
  public nominatedTextbook = 0;
  public nominatedContentTypeCount = 0;
  public totalNominations = 0;
  public totalContentTypeCount = 0;
  public nominationSampleCounts: any;
  public showDownloadCsvBtn = false;
  public directionOrgUsers = 'desc';
  public columnOrgUsers = '';
  public userRemoveRoleLoader = false;
  public showUserRemoveRoleModal = false;
  public selectedUserToRemoveRole: any;
  paginatedSourcingUsers;
  showLoader = true;
  showTextbookLoader = false;
  showNominationLoader = false;
  showUsersLoader = false;
  showDashboardLoader = false;
  userPreferences = '';
  sharedContext;
  userRoles = [{name: 'REVIEWER'}];
  pager: IPagination;
  pageNumber = 1;
  pageLimit: any;
  searchLimitCount: any;
  pagerUsers: IPagination;
  pageNumberUsers = 1;
  searchInput: any;
  public telemetryPageId: string;
  public targetCollection: string;
  public targetCollections: string;
  public firstLevelFolderLabel: string;
  public showBulkApprovalButton: Boolean = false;
  public assignUsersHelpConfig: any;
  public noUsersFoundHelpConfig: any;
  public reviewNominationsHelpConfig: any;
  public userServiceData:any;
  constructor(public frameworkService: FrameworkService, private programsService: ProgramsService,
    private sourcingService: SourcingService,
    public resourceService: ResourceService, public config: ConfigService, private collectionHierarchyService: CollectionHierarchyService,
     private activatedRoute: ActivatedRoute, private router: Router,
    private navigationHelperService: NavigationHelperService, public toasterService: ToasterService, public userService: UserService,
    public programStageService: ProgramStageService, private datePipe: DatePipe, private paginationService: PaginationService,
    public programTelemetryService: ProgramTelemetryService, public registryService: RegistryService,
    private contentHelperService: ContentHelperService, public telemetryService: TelemetryService, private helperService: HelperService) {

  }

  ngOnInit() {
    this.filterApplied = null;
    this.getPageId();
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.userServiceData = this.userService.userData$.subscribe((user: any) => {
      this.userProfile = user.userProfile;
      this.getProgramDetails();
    });
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}, {id: this.programId, type: 'project'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
    this.sessionContext.telemetryPageDetails = {
      telemetryInteractCdata: this.telemetryInteractCdata,
      telemetryPageId: this.telemetryPageId
    }
    this.telemetryInteractObject = {};
    this.roles = [{name: 'REVIEWER'}, {name: 'NONE'}];
    this.roleNames = _.map(this.roles, 'name');
    this.sessionContext.currentRoles = ['REVIEWER'];
    this.programStageService.initialize();
    this.programStageService.addStage('programNominations');
    this.currentStage = 'programNominations';
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.searchLimitCount = this.registryService.searchLimitCount; // getting it from service file for better changing page limit
    this.pageLimit = this.registryService.programUserPageLimit;
    this.setContextualHelpConfig();
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryInteractCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.config.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  setContextualHelpConfig() {
    const sunbirdContextualHelpConfig = this.helperService.getContextualHelpConfig();
    if (!_.isUndefined(sunbirdContextualHelpConfig)) {
      if (_.has(sunbirdContextualHelpConfig, 'sourcing.assignUsersToProject') && this.router.url.includes('/sourcing')) {
        this.assignUsersHelpConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.assignUsersToProject');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.assignUsersToProject') && this.router.url.includes('/contribute')) {
        this.assignUsersHelpConfig = _.get(sunbirdContextualHelpConfig, 'contribute.assignUsersToProject');
      }
      if (_.has(sunbirdContextualHelpConfig, 'sourcing.noUsersFound') && this.router.url.includes('/sourcing')) {
        this.noUsersFoundHelpConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.noUsersFound');
      }
      if (_.has(sunbirdContextualHelpConfig, 'contribute.noUsersFound') && this.router.url.includes('/contribute')) {
        this.noUsersFoundHelpConfig = _.get(sunbirdContextualHelpConfig, 'contribute.noUsersFound');
      }
      if (_.has(sunbirdContextualHelpConfig, 'sourcing.reviewNominations') && this.router.url.includes('/sourcing')) {
        this.reviewNominationsHelpConfig = _.get(sunbirdContextualHelpConfig, 'sourcing.reviewNominations');
      }
    }
  }

  getPageId() {
    this.telemetryPageId = this.telemetryPageId || _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  canAssignUsersToProgram() {
    const today = moment();
    return moment(this.programDetails.content_submission_enddate).isSameOrAfter(today, 'day') && this.programsService.isProjectLive(this.programDetails);
  }
  isSourcingOrgAdmin() {
    return _.includes(this.userProfile.userRoles, 'ORG_ADMIN') &&
    this.router.url.includes('/sourcing');
  }
  showBulkApproval() {
    const isProgramForNoCollections = !!(this.programDetails.target_type && this.programDetails.target_type === 'searchCriteria')
    const isSourcingSide = this.programsService.ifSourcingInstance();
    const canAcceptContribution = this.helperService.canAcceptContribution(this.programDetails);;
    return isSourcingSide && isProgramForNoCollections && canAcceptContribution;
  }
  ngOnDestroy() {
    if (this.stageSubscription) {
      this.stageSubscription.unsubscribe();
    }
    if (this.userServiceData) {
      this.userServiceData.unsubscribe();
    }
    if (this.unsubscribe) {
      this.unsubscribe.next();
      this.unsubscribe.complete();
    }
  }

  onStatusChange(status) {
    if (this.selectedStatus !== status) {
      this.selectedStatus = status;
      if (status === 'All') {
        this.filterApplied = false;
        this.nominations = _.cloneDeep(this.tempNominations);
      } else {
        this.filterApplied = true;
        this.nominations = _.filter(this.tempNominations, (o) => {
          return o.status === status;
        });
      }
    }
  }

  resetStatusFilter(tab) {
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: { tab: tab }, queryParamsHandling: 'merge' });
    this.setTelemetryPageId(tab);
    if (tab === 'textbook' && !_.includes(this.visitedTab, 'textbook')) {
      this.visitedTab.push('textbook');
      this.showTextbookLoader = true;
      this.programsService.getUserPreferencesforProgram(this.userProfile.identifier, this.programId).subscribe(
          (prefres) => {
            let preffilter = {};
            if (prefres.result !== undefined || prefres.result !== null) {
              this.userPreferences = prefres.result;
              preffilter = _.get(this.userPreferences, 'sourcing_preference');
            }
            this.getProgramCollection(preffilter).subscribe((res) => {
              this.showTextbookLoader  =  false;
              this.logTelemetryImpressionEvent(this.programCollections, 'identifier', 'collection');
            }, (err) => { // TODO: navigate to program list page
              this.showTextbookLoader  =  false;
              const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
              this.toasterService.warning(errorMes || 'Fetching textbooks failed');
              this.logTelemetryImpressionEvent();
            });
        }, (err) => { // TODO: navigate to program list page
          this.showTextbookLoader  =  false;
          const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
          this.toasterService.warning(errorMes || 'Fetching Preferences  failed');
      });
    }

    if (tab === 'nomination' && !_.includes(this.visitedTab, 'nomination')) {
      this.showNominationLoader =  true;
      this.visitedTab.push('nomination');
      this.direction = 'desc';
      this.sortColumn = 'createdon';
      this.getPaginatedNominations(0);
      this.sortCollection(this.sortColumn);
    }
    if (tab === 'user' && !_.includes(this.visitedTab, 'user')) {
      this.showUsersLoader = true;
      this.visitedTab.push('user');
      this.getsourcingOrgReviewers();
    }

    if (tab === 'contributionDashboard' && !_.includes(this.visitedTab, 'contributionDashboard')) {
      this.showDashboardLoader =  true;
      if (_.isEmpty(this.programCollections)) {
        this.getProgramCollection().subscribe(
        (res) => { this.getNominationList(); },
        (err) => { // TODO: navigate to program list page
          this.showDashboardLoader =  false;
          const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
          this.toasterService.warning(errorMes || 'Fetching textbooks failed');
        });
      } else {
        this.getNominationList();
      }
      this.visitedTab.push('contributionDashboard');
      this.logTelemetryImpressionEvent();
    }

    if (tab === 'report' && !_.includes(this.visitedTab, 'report')) {
      this.logTelemetryImpressionEvent();
    }
  }

  setTelemetryPageId(tab: string) {
    if (tab === 'textbook') {
      this.telemetryPageId = _.get(this.config, 'telemetryLabels.pageId.sourcing.projectContributions');
    } else if (tab === 'nomination') {
      this.telemetryPageId = _.get(this.config, 'telemetryLabels.pageId.sourcing.projectNominations');
    } else if (tab === 'user') {
      this.telemetryPageId = _.get(this.config, 'telemetryLabels.pageId.sourcing.projectAssignUsers');
    } else if (tab === 'contributionDashboard') {
      this.telemetryPageId = _.get(this.config, 'telemetryLabels.pageId.sourcing.projectContributionDashboard');
    } else if (tab === 'report') {
      this.telemetryPageId = _.get(this.config, 'telemetryLabels.pageId.sourcing.projectReports');
    }
  }

  sortCollection(column) {
    switch (this.activeTab) {
      case 'nomination' :
            this.nominations = this.programsService.sortCollection(this.nominations, column, this.direction);
            break;
      case 'contributionDashboard' :
      default:
        this.contributionDashboardData = this.programsService.sortCollection(this.contributionDashboardData, column, this.direction);
        break;
    }
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
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
  }

  sortUsersList(usersList,isUserSearch?) {
     this.sourcingOrgUserCnt = usersList.length;
     this.paginatedSourcingUsers = this.programsService.sortCollection(usersList, 'selectedRole', 'asc');
     isUserSearch? this.paginatedSourcingUsers :this.initialSourcingOrgUser = this.paginatedSourcingUsers;
     usersList = _.chunk(this.paginatedSourcingUsers, this.pageLimit);
     this.paginatedSourcingUsers = usersList;
     this.sourcingOrgUser = isUserSearch ? usersList[0] : usersList[this.pageNumber - 1];
     this.logTelemetryImpressionEvent(this.sourcingOrgUser, 'identifier', 'user');
     this.pagerUsers = this.paginationService.getPager(this.sourcingOrgUserCnt, isUserSearch ? 1 : this.pageNumberUsers, this.pageLimit);
 }

 public logTelemetryImpressionEvent(data?, keyName?, type?) {
  const telemetryImpression = _.cloneDeep(this.telemetryImpression);
  if (data && !_.isEmpty(data)) {
    telemetryImpression.edata.visits = _.map(data, (row) => {
      return { objid: _.toString(row[keyName]), objtype: type };
    });
  }
  // tslint:disable-next-line:max-line-length
  if (_.isEqual(this.telemetryPageId, this.config.telemetryLabels.pageId.sourcing.projectContributionDashboard) || _.isEqual(this.telemetryPageId, this.config.telemetryLabels.pageId.sourcing.projectReports)) {
    telemetryImpression.edata.type = this.config.telemetryLabels.pageType.report;
  }
  telemetryImpression.edata.pageid = this.telemetryPageId;
  this.telemetryService.impression(telemetryImpression);
}


  getsourcingOrgReviewers (offset?, iteration?) {
    const userRegData = {};
    this.registryService.getOpenSaberOrgByOrgId(this.userService.userProfile).subscribe((res1) => {
      userRegData['Org'] = (_.get(res1, 'result.Org').length > 0) ? _.first(_.get(res1, 'result.Org')) : {};
      this.registryService.getOrgUsersDetails(userRegData, true).then((orgUsers) => {
        this.paginatedSourcingUsers = orgUsers;
          this.readRolesOfOrgUsers(orgUsers);
          this.sortUsersList(this.paginatedSourcingUsers);
          this.showUsersLoader = false;
      });
    }, (error1) => {
      this.logTelemetryImpressionEvent();
	console.log(error1, "No opensaber org for sourcing");
	const errInfo = {
      telemetryPageId: this.telemetryPageId,
      telemetryCdata : this.telemetryInteractCdata,
      env : this.activatedRoute.snapshot.data.telemetry.env,
    };
    this.sourcingService.apiErrorHandling(error1, errInfo);
   });
  }

  /**
   * This method helps to navigate to different pages.
   * If page number is less than 1 or page number is greater than total number
   * of pages is less which is not possible, then it returns.
	 *
	 * @param {number} page Variable to know which page has been clicked
	 *
	 * @example navigateToPage(1)
	 */
  navigateToSourcingPage(page: number): undefined | void {
    if (page < 1 || page > this.pagerUsers.totalPages) {
      return;
    }
    this.pageNumberUsers = page;
    this.sourcingOrgUser = this.paginatedSourcingUsers[this.pageNumberUsers - 1];
    this.pagerUsers = this.paginationService.getPager(this.sourcingOrgUserCnt, this.pageNumberUsers, this.pageLimit);
  }

  NavigateTonominationPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.pager = this.paginationService.getPager(this.totalNominations, this.pageNumber, this.pageLimit);
    const offset = (page - 1) * this.pageLimit;
    this.getPaginatedNominations(offset);
  }

  sortOrgUsers(column) {
    this.sourcingOrgUser = this.programsService.sortCollection(this.sourcingOrgUser, column, this.directionOrgUsers);
    if (this.directionOrgUsers === 'asc' || this.directionOrgUsers === '') {
      this.directionOrgUsers = 'desc';
    } else {
      this.directionOrgUsers = 'asc';
    }
    this.columnOrgUsers = column;
  }

  getNominationList() {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId,
            status: ['Approved']
          },
          limit: 1000
        }
      }
    };
    this.programsService.post(req).subscribe((data) => {
      this.showDashboardLoader =  false;

      if (data.result && data.result.length > 0) {
        const filteredArr = _.filter(data.result, (obj) => obj.userData);
        this.getDashboardData(filteredArr);
       /* _.forEach(data.result, (res) => {
            this.nominatedContentTypes = _.concat(this.nominatedContentTypes, res.content_types);
        });*/
      }
      /*this.nominatedContentTypes =  _.uniq(this.nominatedContentTypes);
      this.nominatedContentTypes = this.programsService.getContentTypesName(this.nominatedContentTypes);*/
    }, error => {
      this.showDashboardLoader =  false;
      this.toasterService.error(this.resourceService.messages.emsg.projects.m0003);
    });
  }
  public getSampleContent() {
    this.collectionHierarchyService.getContentAggregation(this.programId, true, undefined, undefined, undefined, true)
    .subscribe(
      (response) => {
        if (response && response.result && response.result.count) {
          const contents = _.compact(_.concat(_.get(response.result, 'QuestionSet'), _.get(response.result, 'content')));
          this.setNominationSampleCounts(contents);
        }

        this.showNominationLoader = false;
      }, (error) => {
        this.showNominationLoader = false;
      });
  }

  getProgramCollection (preferencefilters?) {
    if (!this.programDetails.target_type || _.includes(['collections', 'questionSets'], this.programDetails.target_type)) {
      return this.collectionHierarchyService.getCollectionWithProgramId(this.programId, this.programDetails.target_collection_category, preferencefilters, true, this.programDetails.target_type).pipe(
        tap((response: any) => {
          if (response && response.result) {
            let objectType = 'content';
            if(this.programDetails.target_type === 'questionSets') objectType = 'QuestionSet';
            this.programCollections = response.result[objectType] || [];
          }
        }),
        catchError(err => {
          return of(err);
        })
      );
    } else if (this.programDetails.target_type === 'searchCriteria') {
      this.collectionHierarchyService.preferencefilters = preferencefilters;
      return this.collectionHierarchyService.getnonCollectionProgramContents(this.programId).pipe(
        tap((response: any) => {
          if (response && response.result) {
            this.programCollections = _.compact(_.concat(_.get(response.result, 'QuestionSet'), _.get(response.result, 'content')));
          }
        }),
        catchError(err => {
          return of(false);
        })
      );
    }
  }

  getcontentAggregationData() {
    return this.collectionHierarchyService.getContentAggregation(this.programId, undefined, undefined, undefined, undefined, true).pipe(
      tap((response: any) => {
        if (response && response.result && (response.result.content || response.result.QuestionSet || response.result.Question)) {
          this.contentAggregationData = _.compact(_.concat(_.get(response.result, 'QuestionSet'), _.get(response.result, 'content'), _.get(response.result, 'Question')));
        }
      }),
      catchError(err => {
        return of(false);
      })
    );
  }

  getDashboardData(approvedNominations) {
    // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.setProgram(this.programDetails);
        if (!_.isEmpty(this.contentAggregationData) || approvedNominations.length) {
          const contents = _.cloneDeep(this.contentAggregationData);
          let dashboardData;
          this.contributionDashboardData = _.map(approvedNominations, nomination => {
            if (nomination.organisation_id) {
              if ((!this.programDetails.target_type || this.programDetails.target_type === 'collections') && !_.isEmpty(this.programCollections)) {
              // tslint:disable-next-line:max-line-length
                dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCounts(contents, nomination.organisation_id, this.programCollections));
              } else {
                dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCounts(contents, nomination.organisation_id));
              }
              if (dashboardData) {
                // This is enable sorting table. So duping the data at the root of the dashboardData object
                dashboardData['sourcingPending'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['pending'];
                dashboardData['sourcingAccepted'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['accepted'];
                dashboardData['sourcingRejected'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['rejected'];
                dashboardData['contributorName'] = this.setContributorName(nomination, nomination.organisation_id ? true : false);
                return {
                  ...dashboardData,
                  contributorDetails: nomination,
                  type: 'org'
                };
              }
            } else {
              // tslint:disable-next-line:max-line-length
              if ((!this.programDetails.target_type || this.programDetails.target_type === 'collections') && !_.isEmpty(this.programCollections)) {
                dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCountsForIndividual(contents, nomination.user_id, this.programCollections));
              } else {
                dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCountsForIndividual(contents, nomination.user_id));
              }
              if (dashboardData) {
                dashboardData['sourcingPending'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['pending'];
                dashboardData['sourcingAccepted'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['accepted'];
                dashboardData['sourcingRejected'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['rejected'];
                dashboardData['contributorName'] = this.setContributorName(nomination, nomination.organisation_id ? true : false);
                return {
                  ...dashboardData,
                  contributorDetails: nomination,
                  type: 'individual'
                };
              }
            }
          });
          this.getOverAllCounts(this.contributionDashboardData);
        } else if (approvedNominations.length) {
          this.contributionDashboardData = _.map(approvedNominations, nomination => {
            return this.dashboardObject(nomination);
          });
          this.getOverAllCounts(this.contributionDashboardData);
        }
    }

  dashboardObject(nomination) {
      return {
        total: 0,
        review: 0,
        draft: 0,
        rejected: 0,
        live: 0,
        correctionsPending: 0,
        sourcingPending: 0,
        sourcingAccepted: 0,
        sourcingRejected: 0,
        // tslint:disable-next-line:max-line-length
        contributorName: this.setContributorName(nomination, nomination.organisation_id ? true : false),
        individualStatus: {},
        sourcingOrgStatus : {accepted: 0, rejected: 0, pending: 0},
        contributorDetails: nomination,
        type: nomination.organisation_id ? 'org' : 'individual'
      };
  }

  setNominationSampleCounts(contentResult) {
    this.nominationSampleCounts = {};
    let orgSampleUploads = _.filter(contentResult, contribution => !_.isEmpty(contribution.organisationId) && contribution.sampleContent);
    orgSampleUploads = _.groupBy(orgSampleUploads, 'organisationId');
    _.forEach(orgSampleUploads, (temp, index) => {
      let nomInd = _.findIndex(this.nominations, {organisation_id: index});
      if (nomInd !== -1) {
       this.nominations[nomInd].samples = temp.length;
      }
    });

    // tslint:disable-next-line: max-line-length
    let individualSampleUploads = _.filter(contentResult, contribution => _.isEmpty(contribution.organisationId) && contribution.sampleContent);
    individualSampleUploads = _.groupBy(individualSampleUploads, 'createdBy');
    _.forEach(individualSampleUploads, (temp, index) => {
      let nomInd = _.findIndex(this.nominations, {user_id: index});
      if (nomInd !== -1) {
        this.nominations[nomInd].samples = temp.length;
      }
    });
  }

  getNominationSampleCounts(nomination) {
    const ret =  (nomination.organisation_id) ?
    _.get(this.nominationSampleCounts, nomination.organisation_id) || 0 :
    _.get(this.nominationSampleCounts, nomination.user_id) || 0;
      var index = _.findIndex(this.nominations, {id: nomination.id});
      this.nominations[index].samples = ret;
      return ret;
  }

  getOverAllCounts(dashboardData) {
    this.overAllContentCount = dashboardData.reduce((obj, v)  => {
      obj['sourcingPending'] += _.toNumber(v.sourcingPending);
      obj['sourcingAccepted'] += _.toNumber(v.sourcingAccepted);
      obj['sourcingRejected'] += _.toNumber(v.sourcingRejected);
      return obj;
    }, {sourcingPending: 0, sourcingAccepted: 0, sourcingRejected: 0});
    // tslint:disable-next-line:max-line-length
    this.overAllContentCount['sourcingTotal'] = this.overAllContentCount.sourcingPending + this.overAllContentCount.sourcingAccepted + this.overAllContentCount.sourcingRejected;
  }

  setContributorName(nomination, isOrg) {
    if (isOrg && !_.isEmpty(nomination.orgData)) {
      return _.trim(nomination.orgData.name);
    } else  if (!_.isEmpty(nomination.userData)) {
     return _.trim(`${nomination.userData.firstName} ${nomination.userData.lastName || ''}`);
    } else {
      return null;
    }
  }

  getProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    this.programsService.get(req).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.sessionContext.programId = this.programDetails.program_id;
      this.getCollectionCategoryDefinition();
      this.programDetails.config.medium = _.compact(this.programDetails.config.medium);
      this.programDetails.config.subject = _.compact(this.programDetails.config.subject);
      this.programDetails.config.gradeLevel = _.compact(this.programDetails.config.gradeLevel);
      this.sessionContext.framework = _.isArray(_.get(this.programDetails, 'config.framework')) ? _.first(_.get(this.programDetails, 'config.framework')) : _.get(this.programDetails, 'config.framework');
      this.showBulkApprovalButton = this.showBulkApproval();
      this.setTargetCollectionValue();
      this.frameworkService.initialize(this.sessionContext.framework);
      forkJoin(this.frameworkService.readFramworkCategories(this.sessionContext.framework), this.getAggregatedNominationsCount(),
              this.getcontentAggregationData(), this.getOriginForApprovedContents()).subscribe(
        (response) => {
            const frameworkRes = _.first(response);
            this.sessionContext.frameworkData = _.get(frameworkRes, 'categories');
            this.sessionContext['frameworkType'] = frameworkRes.type;
            this.sessionContext.topicList = _.get(_.find(this.sessionContext.frameworkData, { code: 'topic' }), 'terms');
            this.checkActiveTab();
        },
        (error) => {
          this.showLoader = false;
          const errInfo = {
            errorMsg: 'Fetching textbooks failed. Please try again...',
            telemetryPageId: this.telemetryPageId,
            telemetryCdata : this.telemetryInteractCdata,
            env : this.activatedRoute.snapshot.data.telemetry.env,
          };
          this.sourcingService.apiErrorHandling(error, errInfo);
      });

      this.setActiveDate();
      this.collectionsCount = _.get(this.programDetails, 'collection_ids').length;
      const programContentTypesArr = this.programDetails.targetprimarycategories ? _.map(this.programDetails.targetprimarycategories, 'name') : this.programDetails.content_types;
      this.programContentTypes = _.join(programContentTypesArr, ',');
      this.totalContentTypeCount = programContentTypesArr.length;
      const currentRoles = _.filter(this.programDetails.config.roles, role => this.sessionContext.currentRoles.includes(role.name));
      this.sessionContext.currentRoleIds = !_.isEmpty(currentRoles) ? _.map(currentRoles, role => role.id) : null;
      this.sessionContext['selectedSharedProperties'] = this.helperService.getSharedProperties(this.programDetails);
      this.sessionContext = _.assign(this.sessionContext, this.sessionContext['selectedSharedProperties']);
    }, error => {
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.project.m0001,
        telemetryPageId:this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: req
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  getCollectionCategoryDefinition() {
    if (this.programDetails.target_collection_category && this.userProfile.rootOrgId && (!this.programDetails.target_type || _.includes(['collections','questionSets'], this.programDetails.target_type))) {
      // tslint:disable-next-line:max-line-length
      let objectType = _.get(this.programDetails, 'target_type') === 'questionSets' ? 'QuestionSet' : 'Collection';
      this.programsService.getCategoryDefinition(this.programDetails.target_collection_category[0],
        this.userProfile.rootOrgId, objectType).subscribe(res => {
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

  setTargetCollectionValue() {
    if (!_.isUndefined(this.programDetails)) {
      this.targetCollection = this.programsService.setTargetCollectionName(this.programDetails);
      this.targetCollections = this.programsService.setTargetCollectionName(this.programDetails, 'plural');
    }
  }

  getProgramInfo(type) {
    const config = JSON.parse(this.programDetails.config);
    return type === 'board' ? config[type] : _.join(config[type], ', ');
  }

  showSelectedContributorProfile(nomination) {
    this.showContributorProfilePopup = true;
    this.selectedNomination = nomination.nominationData;
  }

  viewNominationDetails(nomination) {
    const extraData: NavigationExtras = {
      fragment: nomination
    };
    this.router.navigate(['/sourcing/contributor/' + nomination.nominationData.program_id], extraData);
  }

  goBack() {
    this.navigationHelperService.navigateToPreviousUrl();
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

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  getCollectionsAddedToProgram() {
    let collectionsAddedToProgram = _.filter(this.programCollections,
      (collection) => _.indexOf(this.programDetails.collection_ids, collection.identifier) !== -1
    )
    return collectionsAddedToProgram || [];
  }

  checkActiveTab() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.activeTab = !_.isEmpty(params.get('tab')) ? params.get('tab') : 'textbook';
    });
    this.visitedTab.push(this.activeTab);
    this.setTelemetryPageId(this.activeTab);
    this.showLoader = false;
    if (this.activeTab === 'textbook') {
      this.showTextbookLoader = true;
        this.programsService.getUserPreferencesforProgram(this.userProfile.identifier, this.programId).subscribe(
          (prefres) => {
            let preffilter = {};
            if (prefres.result !== null || prefres.result !== undefined) {
              this.userPreferences = prefres.result;
              preffilter = _.get(this.userPreferences, 'sourcing_preference');
            }
            this.getProgramCollection(preffilter).subscribe((res) => {
              this.showTextbookLoader  =  false;
              if (_.get(this.programDetails, 'target_type') === 'questionSets') {
                this.programCollections = this.getCollectionsAddedToProgram();
              }
              this.logTelemetryImpressionEvent(this.programCollections, 'identifier', 'collection');
            }, (err) => { // TODO: navigate to program list page
              this.showTextbookLoader  =  false;
              this.logTelemetryImpressionEvent();
              const errInfo = {
                errorMsg: 'Fetching textbooks failed',
                telemetryPageId:this.telemetryPageId,
                telemetryCdata : this.telemetryInteractCdata,
                env : this.activatedRoute.snapshot.data.telemetry.env,
                request: preffilter
              };
              this.sourcingService.apiErrorHandling(err, errInfo);
            });
        }, (err) => { // TODO: navigate to program list page
        this.showTextbookLoader  =  false;
        const errInfo = {
          errorMsg: 'Fetching Preferences  failed',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }

    if (this.activeTab === 'nomination') {
      this.showNominationLoader =  true;
      this.getPaginatedNominations(0);
    }

    if (this.activeTab === 'user') {
      this.showUsersLoader = true;
      this.getsourcingOrgReviewers();
    }

    if (this.activeTab === 'contributionDashboard') {
      this.showDashboardLoader =  true;
      this.logTelemetryImpressionEvent();
      this.getProgramCollection().subscribe(
      (res) => { this.getNominationList(); },
      (err) => { // TODO: navigate to program list page
        const errInfo = {
          errorMsg: 'Fetching textbooks failed',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    }
    if (this.activeTab === 'report') {
      this.logTelemetryImpressionEvent();
    }
  }
  bulkApprovalSuccess(e) {
    this.checkActiveTab();
  }
  readRolesOfOrgUsers(orgUsers) {
    if (_.isEmpty(orgUsers)) {
      return false;
    }
    _.forEach(orgUsers, r => {
      r.selectedRole = 'Select Role';
      const rolemapping = _.get(this.programDetails, 'rolemapping', {});
      if (!_.isEmpty(rolemapping)) {
        _.find(rolemapping, (users, role) => {
          if (_.includes(users, r.identifier)) {
            r.selectedRole = role;
          }
        });
      }
      r.selectedRole !== 'Select Role' ? r.roles = this.roles : r.roles = this.userRoles;
      r.newRole = r.selectedRole;
    });
  }

  updateUserRoleMapping(progRoleMapping, user) {
    const request = {
      'program_id': this.activatedRoute.snapshot.params.programId,
      'rolemapping': progRoleMapping
    };
    this.programsService.updateProgram(request)
      .subscribe((response) => {
        this.showUserRemoveRoleModal = false;
        this.userRemoveRoleLoader = false;
        if (user.newRole === "NONE") {
          user.newRole = 'Select Role';
          user.roles = this.userRoles;
        } else {
          user.roles  = this.roles;
        }
        user.selectedRole = user.newRole;
        this.programDetails.rolemapping = progRoleMapping;
        this.toasterService.success(this.resourceService.messages.smsg.roles.m0001);
      }, error => {
        this.showUserRemoveRoleModal = false;
        this.userRemoveRoleLoader = false;
        const errInfo = {
          errorMsg: this.resourceService.messages.emsg.roles.m0002,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
          request: request
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      });
  }

  getProgramRoleMapping(user) {
    const newRole = user.newRole;
    let progRoleMapping = this.programDetails.rolemapping;
    if ((progRoleMapping === null || progRoleMapping === undefined) && newRole !== 'NONE') {
      progRoleMapping = {};
      progRoleMapping[newRole] = [];
    }
    const programRoleNames = _.keys(progRoleMapping);
    if (!_.includes(programRoleNames, newRole) && newRole !== 'NONE') {
      progRoleMapping[newRole] = [];
    }
    _.forEach(progRoleMapping, (users, role) => {
      // Add to selected user to current selected role's array
      if (newRole === role && !_.includes(users, user.identifier) && newRole !== 'NONE') {
        users.push(user.identifier);
      }
      // Remove selected user from other role's array
      if (newRole !== role && _.includes(users, user.identifier)) {
        _.remove(users, (id) => id === user.identifier);
      }
      // Remove duplicate users ids and falsy values
      progRoleMapping[role] = _.uniq(_.compact(users));
    });
    return progRoleMapping;
  }

  removeUserFromProgram() {
    if (this.userRemoveRoleLoader) {
      return false;
    }
    this.userRemoveRoleLoader = true;
    this.updateUserRoleMapping(this.getProgramRoleMapping(this.selectedUserToRemoveRole), this.selectedUserToRemoveRole);
  }
  setTelemetryForonRoleChange(user) {
    const edata =  {
      id: 'assign_role_by_sourcingOrg',
      type: this.config.telemetryLabels.eventType.click,
      subtype: this.config.telemetryLabels.eventSubtype.submit,
      pageid: this.telemetryPageId,
      extra : {values: [user.identifier, user.newRole]}
    };
    this.registryService.generateUserRoleUpdateTelemetry(this.activatedRoute.snapshot.data.telemetry.env,this.telemetryInteractCdata,this.telemetryInteractPdata, edata )
  }

  cancelRemoveUserFromProgram() {
    this.showUserRemoveRoleModal = false;
    this.selectedUserToRemoveRole.newRole = this.selectedUserToRemoveRole.selectedRole;
  }

  onRoleChange(user) {
    this.setTelemetryForonRoleChange(user);
    const newRole = user.newRole;
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

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
    if (this.sessionContext && this.programDetails && this.currentStage === 'programNominations') {
      this.showTextbookLoader = true;
      setTimeout(() => {
        const req = {
          url: `program/v1/read/${this.programId}`
        };
        this.programsService.get(req).subscribe((programDetails) => {
          this.programDetails = _.get(programDetails, 'result');
          forkJoin(this.getAggregatedNominationsCount(), this.getcontentAggregationData(), this.getOriginForApprovedContents()).subscribe(
          (response) => {
              this.checkActiveTab();
          });
        });
      }, 3000);
    }
  }

  applyPreferences(preferences?) {
    this.showTextbookLoader  =  true;
    if (_.isUndefined(preferences)) {
      preferences = {};
    }
    // tslint:disable-next-line: max-line-length
    forkJoin(this.programsService.setUserPreferencesforProgram(this.userProfile.identifier, this.programId, preferences, 'sourcing'), this.getProgramCollection(preferences)).subscribe(
      (response) => {
        this.userPreferences =  _.get(_.first(response), 'result');
        this.showTextbookLoader  =  false;
      },
      (error) => {
        this.showTextbookLoader  =  false;
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
    });
  }

  openContent(content) {
      this.contentHelperService.initialize(this.programDetails, this.sessionContext);
      this.contentHelperService.openContent(content).then((response) => {
        this.dynamicInputs = response['dynamicInputs'];
        this.component = response['currentComponent'];
        this.programStageService.addStage(response['currentComponentName']);
      }).catch((error) => this.toasterService.error('Errror in opening the content componnet'));
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
  viewContribution(collection) {
    if (this.programDetails.target_type === 'searchCriteria') {
      this.openContent(collection);
      return;
    }
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection = collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.sessionContext.targetCollectionPrimaryCategory = _.get(collection, 'primaryCategory') || _.first(_.get(this.programDetails, 'target_collection_category'));
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.config.telemetryLabels.pageId.sourcing.projectTargetCollection,
      telemetryInteractCdata: [...this.telemetryInteractCdata, { 'id': collection.identifier, 'type': 'linked_collection'}]
    };
    const collectionSharedProperties = this.helperService.getSharedProperties(this.programDetails, collection)
    this.sessionContext = _.assign(this.sessionContext, collectionSharedProperties);
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
    this.programStageService.addStage('chapterListComponent');
    this.setFrameworkCategories(collection);
  }
  public isEmptyObject(obj) {
    return !!(_.isEmpty(obj));
  }
  downloadNominationList() {
    this.downloadInProgress = true;
    const headers = [
      this.resourceService.frmelmnts.lbl.projectName,
      this.resourceService.frmelmnts.lbl.contributorName,
      this.resourceService.frmelmnts.lbl.type,
      this.programsService.setTargetCollectionName(this.programDetails, true),
      this.resourceService.frmelmnts.lbl.samples,
      this.resourceService.frmelmnts.lbl.nominationDate,
      this.resourceService.frmelmnts.lbl.status,
    ];
    const csvDownloadConfig: any = {
      filename: this.programDetails.name.trim(),
      headers: headers,
      showTitle: false
    };
    const nominationList$ = this.programsService.downloadReport(this.programId, this.programDetails.name.trim());
    nominationList$
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      (response) => {
        const csvData = _.get(response, 'result.stats');
        if (csvData && !_.isEmpty(csvData)) {
          csvDownloadConfig['tableData'] = csvData;
          this.programsService.generateCSV(csvDownloadConfig);
        } else {
          this.toasterService.error('Unable to download list. Please try again.');
        }
      },
      (error) => {
        const errInfo = {
          errorMsg: 'Unable to download nomination list. Please try later.',
          telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
        this.downloadInProgress = false;
      },
      () => {
        this.downloadInProgress = false;
      }
    );
}


getPaginatedNominations(offset) {
  const req = {
    url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
    data: {
      request: {
        filters: {
          program_id: this.activatedRoute.snapshot.params.programId,
          status: ['Pending', 'Approved', 'Rejected']
        },
        offset: offset,
        limit: this.pageLimit
      }
    }
  };
this.programsService.post(req).subscribe((data) => {
      if (data.result && data.result.length > 0) {
        this.nominations = [];
        _.forEach(data.result, (res) => {
          const isOrg = !_.isEmpty(res.organisation_id);
          const name = this.setContributorName(res, isOrg);
          if (name) {
            this.nominations.push({
              programName: '',
              name: name.trim(),
              type: isOrg ? 'Organisation' : 'Individual',
              textbooks: (!_.isEmpty(_.get(res,'collection_ids'))) ? res.collection_ids.length : [],
              samples: 0,
              createdon: res.createdon,
              status: res.status,
              user_id: res.user_id,
              organisation_id: res.organisation_id,
              nominationData: res,
              id: res.id
            });
          }
        });
        this.getSampleContent();
      } else {
        this.showNominationLoader = false;
      }
      this.tempNominations = _.cloneDeep(this.nominations);
      this.logTelemetryImpressionEvent(this.nominations, 'id', 'nomination');
  }, error => {
    this.showNominationLoader = false;
    this.logTelemetryImpressionEvent();
    const errInfo = {
      errorMsg: this.resourceService.messages.emsg.projects.m0003,
      telemetryPageId: this.telemetryPageId,
      telemetryCdata : this.telemetryInteractCdata,
      env : this.activatedRoute.snapshot.data.telemetry.env,
      request: req
    };
    this.sourcingService.apiErrorHandling(error, errInfo);
  });
}

getAggregatedNominationsCount() {
  const req = {
    url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
    data: {
      request: {
        filters: {
          program_id: this.activatedRoute.snapshot.params.programId,
          status: ['Pending', 'Approved', 'Rejected']
        },
        fields: ['organisation_id', 'collection_ids', 'content_types', 'status'],
        limit: 0
      }
    }
  };
  return this.programsService.post(req).pipe(
    tap((data: any) => {
      const aggregatedCount = data.result.nomination;
      this.totalNominations = aggregatedCount.count;
      if (aggregatedCount.fields && aggregatedCount.fields.length) {
        this.pager = this.paginationService.getPager(aggregatedCount.count, this.pageNumber, this.pageLimit);
        this.statusCount = _.get(_.find(aggregatedCount.fields, {name: 'status'}), 'fields');
        this.contributedByOrganisation = _.get(_.find(aggregatedCount.fields, {name: 'organisation_id'}), 'count');
        this.contributedByIndividual = this.totalNominations - this.contributedByOrganisation;
        this.nominatedTextbook = _.get(_.find(aggregatedCount.fields, {name: 'collection_ids'}), 'count');
        this.nominatedContentTypeCount = _.get(_.find(aggregatedCount.fields, {name: 'content_types'}), 'count');
      }
    }),
    catchError(err => {
      console.error(err);
      return of(false);
    })
  );
}

downloadContribDashboardDetails() {
  try {
    const headers = this.getContribDashboardHeaders();
    const tableData = [];

    if (this.contributionDashboardData.length) {
      _.forEach(this.contributionDashboardData, (contributor) => {
        const row = [
          _.get(this.programDetails, 'name', '').trim(),
          contributor.contributorName,
          contributor.type === 'org' ? 'Organisation' : 'Individual',
          contributor.draft || 0,
          contributor.type !== 'individual' ? contributor.review : '-',
          contributor.correctionsPending || 0,
          contributor.live || 0,
          contributor.type !== 'individual' ? contributor.rejected : '-',
          contributor.sourcingPending || 0,
          contributor.sourcingAccepted || 0,
          contributor.sourcingRejected || 0,
        ];
        tableData.push(row);
      });
    }
    const csvDownloadConfig = {
      filename: _.get(this.programDetails, 'name', '').trim(),
      tableData: tableData,
      headers: headers,
      showTitle: false
    };
      this.programsService.generateCSV(csvDownloadConfig);
    } catch (err) {
      this.toasterService.error(_.get(this.resourceService, 'messages.emsg.projects.m0005', ''));
    }
}

getContribDashboardHeaders() {
  const columnNames = [
    'projectName', 'contributorName', 'typeOfContributor', 'draftContributingOrg',
    'pendingContributingOrg', 'correctionsPending', 'acceptedContributingOrg', 'rejectedContributingOrg', 'pendingtSourcingOrg',
    'acceptedSourcingOrg', 'rejectedSourcingOrg'];
  return _.map(columnNames, name => _.get(this.resourceService, `frmelmnts.lbl.${name}`));
}

downloadReport(report) {
  const req = {
    url: `program/v1/report`,
    data: {
        'request': {
            'filters': {
                program_id: [this.programId],
                openForContribution: true,
                report: report
        }
      }
    }
  };
  return this.programsService.post(req).subscribe((res) => {
    if (res.result && res.result.tableData && res.result.tableData.length) {
      try {
      const resObj = res.result.tableData[0];
      let headers = [];
      if (report === 'textbookLevelReport') {
        headers = this.textbookLevelReportHeaders();
      } else if (report === 'chapterLevelReport') {
        headers = this.chapterLevelReportHeaders();
      }
      const tableData = [];
      if (_.isArray(resObj) && resObj.length) {
        _.forEach(resObj, (obj) => {
          tableData.push(_.assign({'Project Name': this.programDetails.name.trim()}, obj));
        });
      }
      const csvDownloadConfig = {
        filename: this.programDetails.name.trim(),
        tableData: tableData,
        headers: headers,
        showTitle: false
      };
        this.programsService.generateCSV(csvDownloadConfig);
      } catch (err) {
        this.toasterService.error(this.resourceService.messages.emsg.projects.m0005);
      }
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.projects.m0005);
    }
  }, (err) => {
    const errInfo = {
      errorMsg: this.resourceService.messages.emsg.projects.m0005,
      telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
      env : this.activatedRoute.snapshot.data.telemetry.env,
    };
    this.sourcingService.apiErrorHandling(err, errInfo);
  });
}

textbookLevelReportHeaders() {
  const headers = [
    this.resourceService.frmelmnts.lbl.projectName,
    this.resourceService.frmelmnts.lbl.profile.Medium,
    this.resourceService.frmelmnts.lbl.profile.Classes,
    this.resourceService.frmelmnts.lbl.profile.Subjects,
    // tslint:disable-next-line:max-line-length
    this.programDetails.target_collection_category ? this.resourceService.frmelmnts.lbl.textbookName.replace('{TARGET_NAME}', this.programDetails.target_collection_category[0]) : 'Textbook Name',
    // tslint:disable-next-line:max-line-length
    this.firstLevelFolderLabel ? this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn6.replace('{FIRST_LEVEL_FOLDER}', this.firstLevelFolderLabel) : 'Folder',
    this.resourceService.frmelmnts.lbl.contentsContributed,
    this.resourceService.frmelmnts.lbl.contentsReviewed,
    // tslint:disable-next-line:max-line-length
    this.firstLevelFolderLabel ? this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn7.replace('{FIRST_LEVEL_FOLDER}', this.firstLevelFolderLabel) : 'Folder',
    // tslint:disable-next-line:max-line-length
    this.firstLevelFolderLabel ? this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn8.replace('{FIRST_LEVEL_FOLDER}', this.firstLevelFolderLabel) : 'Folder',
    // tslint:disable-next-line:max-line-length
    this.firstLevelFolderLabel ? this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn9.replace('{FIRST_LEVEL_FOLDER}', this.firstLevelFolderLabel) : 'Folder',
    ..._.map(this.programContentTypes.split(', '), type => `${this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn10} ${type}` )
  ];
  return headers;
}

chapterLevelReportHeaders() {
  const headers = [
    this.resourceService.frmelmnts.lbl.projectName,
    this.resourceService.frmelmnts.lbl.profile.Medium,
    this.resourceService.frmelmnts.lbl.profile.Classes,
    this.resourceService.frmelmnts.lbl.profile.Subjects,
    // tslint:disable-next-line:max-line-length
    this.programDetails.target_collection_category ? this.resourceService.frmelmnts.lbl.textbookName.replace('{TARGET_NAME}', this.programDetails.target_collection_category[0]) : 'Textbook Name',
    // tslint:disable-next-line:max-line-length
    this.firstLevelFolderLabel ? this.resourceService.frmelmnts.lbl.ChapterLevelReportColumn6.replace('{FIRST_LEVEL_FOLDER}', this.firstLevelFolderLabel) : 'Folder',
    this.resourceService.frmelmnts.lbl.contentsContributed,
    this.resourceService.frmelmnts.lbl.contentsReviewed,
    this.resourceService.frmelmnts.lbl.ChapterLevelReportColumn7,
    ..._.map(this.programContentTypes.split(', '), type => `${this.resourceService.frmelmnts.lbl.ChapterLevelReportColumn8} ${type}` )
  ];
  return headers;
}

setFrameworkCategories(collection) {
  this.sessionContext.targetCollectionFrameworksData = this.helperService.setFrameworkCategories(collection);
}
}
