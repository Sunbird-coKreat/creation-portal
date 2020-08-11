import { ResourceService, ConfigService, NavigationHelperService, ToasterService, PaginationService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ProgramsService, UserService, FrameworkService, RegistryService } from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ISessionContext, InitialState, IPagination} from '../../../cbse-program/interfaces';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import * as _ from 'lodash-es';
import { tap, first, catchError, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { DatePipe } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { isDefined } from '@angular/compiler/src/util';
import { isUndefined, isNullOrUndefined } from 'util';
import {ProgramTelemetryService} from '../../services';

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
  paginatedSourcingUsers;
  showLoader = true;
  showTextbookLoader = false;
  showNominationLoader = false;
  showUsersLoader = false;
  showDashboardLoader = false;
  userPreferences = '';
  sharedContext;

  pager: IPagination;
  pageNumber = 1;
  pageLimit = 200;
  pagerUsers: IPagination;
  pageNumberUsers = 1;

  constructor(public frameworkService: FrameworkService, private programsService: ProgramsService,
    public resourceService: ResourceService, private config: ConfigService, private collectionHierarchyService: CollectionHierarchyService,
     private activatedRoute: ActivatedRoute, private router: Router,
    private navigationHelperService: NavigationHelperService, public toasterService: ToasterService, public userService: UserService,
    public programStageService: ProgramStageService, private datePipe: DatePipe, private paginationService: PaginationService,
    public programTelemetryService: ProgramTelemetryService, public registryService: RegistryService) {
    this.userProfile = this.userService.userProfile;
    this.programId = this.activatedRoute.snapshot.params.programId;
  }

  ngOnInit() {
    this.filterApplied = null;
    this.getProgramDetails();
    this.telemetryInteractCdata = [{id: this.activatedRoute.snapshot.params.programId, type: 'Program'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.roles = [{name: 'REVIEWER'}];
    this.roleNames = _.map(this.roles, 'name');
    this.sessionContext.currentRole = 'REVIEWER';
    this.programStageService.initialize();
    this.programStageService.addStage('programNominations');
    this.currentStage = 'programNominations';
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{type: 'Program', id: this.activatedRoute.snapshot.params.programId}];
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.config.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  canAssignUsersToProgram() {
    const today = moment();
    return moment(this.programDetails.content_submission_enddate).isSameOrAfter(today, 'day');
  }
  isSourcingOrgAdmin() {
    return _.includes(this.userProfile.userRoles, 'ORG_ADMIN') &&
    this.router.url.includes('/sourcing');
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
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

    if (tab === 'textbook' && !_.includes(this.visitedTab, 'textbook')) {
      this.visitedTab.push('textbook');
      this.showTextbookLoader = true;
      this.programsService.getUserPreferencesforProgram(this.userProfile.identifier, this.programId).subscribe(
          (prefres) => {
            let preffilter = {};
            if (!isNullOrUndefined(prefres.result)) {
              this.userPreferences = prefres.result;
              preffilter = _.get(this.userPreferences, 'sourcing_preference');
            }
            this.getProgramCollection(preffilter).subscribe((res) => {
              this.showTextbookLoader  =  false;
            }, (err) => { // TODO: navigate to program list page
              this.showTextbookLoader  =  false;
              const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
              this.toasterService.warning(errorMes || 'Fetching textbooks failed');
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
      this.sortCollection(this.sortColumn, this.nominations);
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
          }
        );
      } else {
        this.getNominationList();
      }

      this.visitedTab.push('contributionDashboard');
    }
  }

  sortCollection(column, object) {
    this.nominations = this.programsService.sortCollection(object, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  getsourcingOrgReviewers (offset?, iteration?) {
    this.registryService.getcontributingOrgUsersDetails(true).then((orgUsers) => {
      this.paginatedSourcingUsers = orgUsers;
      this.sourcingOrgUserCnt = this.paginatedSourcingUsers.length;
      this.readRolesOfOrgUsers();
      this.paginatedSourcingUsers = this.programsService.sortCollection(this.paginatedSourcingUsers, 'selectedRole', 'desc');
      this.paginatedSourcingUsers = _.chunk( this.paginatedSourcingUsers, this.pageLimit);
      this.sourcingOrgUser = this.paginatedSourcingUsers[this.pageNumber - 1];
      this.pagerUsers = this.paginationService.getPager(this.sourcingOrgUserCnt, this.pageNumberUsers, this.pageLimit);
      this.showUsersLoader = false;
    });
    /*if (!isDefined(iteration) || iteration === 0) {
      iteration = 0;
      this.paginatedSourcingUsers = [];
      this.sourcingOrgUser = [];
    }

    const OrgDetails = this.userProfile.organisations[0];
    const filters = {
      'organisations.organisationId': OrgDetails.organisationId,
      'organisations.roles': ['CONTENT_REVIEWER']
      };

    this.programsService.getSourcingOrgUsers(filters, offset, 1000).subscribe(
      (res) => {
        this.sourcingOrgUserCnt = res.result.response.count || 0;
        const responseContent = _.get(res, 'result.response.content');
        const responseContentLength =  responseContent ? responseContent.length : offset;
        this.paginatedSourcingUsers = _.compact(_.concat(this.paginatedSourcingUsers, res.result.response.content));

        if (this.sourcingOrgUserCnt > this.paginatedSourcingUsers.length) {
          iteration++;
          this.getsourcingOrgReviewers(responseContentLength * iteration, iteration);
        } else {
          this.readRolesOfOrgUsers();
          this.paginatedSourcingUsers = this.programsService.sortCollection(this.paginatedSourcingUsers, 'selectedRole', 'desc');
          this.paginatedSourcingUsers = _.chunk( this.paginatedSourcingUsers, this.pageLimit);
          this.sourcingOrgUser = this.paginatedSourcingUsers[this.pageNumber - 1];
          this.pagerUsers = this.paginationService.getPager(this.sourcingOrgUserCnt, this.pageNumberUsers, this.pageLimit);
          this.showUsersLoader = false;
        }
      },
    );*/
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
    this.collectionHierarchyService.getContentAggregation(this.programId, true)
    .subscribe(
      (response) => {
        if (response && response.result && response.result.count) {
          const contents = _.get(response.result, 'content');
          this.setNominationSampleCounts(contents);
        }

        this.showNominationLoader = false;
      }, (error) => {
        this.showNominationLoader = false;
      });
  }

  getProgramCollection (preferencefilters?) {
    return this.collectionHierarchyService.getCollectionWithProgramId(this.programId, preferencefilters).pipe(
      tap((response: any) => {
        if (response && response.result) {
          this.programCollections = response.result.content || [];
        }
      }),
      catchError(err => {
        return of(err);
      })
    );
  }

  getcontentAggregationData() {
    return this.collectionHierarchyService.getContentAggregation(this.programId).pipe(
      tap((response: any) => {
        if (response && response.result && response.result.content) {
          this.contentAggregationData = _.get(response.result, 'content');
        }
      }),
      catchError(err => {
        return of(false);
      })
    );
  }

  getDashboardData(approvedNominations) {
    // tslint:disable-next-line:max-line-length
        if (!_.isEmpty(this.contentAggregationData) && approvedNominations.length && !_.isEmpty(this.programCollections)) {
          const contents = _.cloneDeep(this.contentAggregationData);
          this.contributionDashboardData = _.map(approvedNominations, nomination => {
            if (nomination.organisation_id) {
              // tslint:disable-next-line:max-line-length
              const dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCounts(contents, nomination.organisation_id, this.programCollections));
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
            } else {
              // tslint:disable-next-line:max-line-length
              const dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCountsForIndividual(contents, nomination.user_id, this.programCollections));
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
      this.nominationSampleCounts[index] = temp.length;
    });

    // tslint:disable-next-line: max-line-length
    let individualSampleUploads = _.filter(contentResult, contribution => _.isEmpty(contribution.organisationId) && contribution.sampleContent);
    individualSampleUploads = _.groupBy(individualSampleUploads, 'createdBy');
    _.forEach(individualSampleUploads, (temp, index) => {
      this.nominationSampleCounts[index] = temp.length;
    });
  }

  getNominationSampleCounts(nomination) {
    return (nomination.organisation_id) ?
    _.get(this.nominationSampleCounts, nomination.organisation_id) || 0 :
    _.get(this.nominationSampleCounts, nomination.user_id) || 0;
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
      this.programDetails.config.medium = _.compact(this.programDetails.config.medium);
      this.programDetails.config.subject = _.compact(this.programDetails.config.subject);
      this.programDetails.config.gradeLevel = _.compact(this.programDetails.config.gradeLevel);

      this.fetchFrameWorkDetails();

      forkJoin(this.getAggregatedNominationsCount(), this.getcontentAggregationData()).subscribe(
        (response) => {
            this.checkActiveTab();
        },
        (error) => {
          this.showLoader = false;
          const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
          this.toasterService.error(errorMes || 'Fetching textbooks failed. Please try again...');
      });

      this.setActiveDate();
      this.collectionsCount = _.get(this.programDetails, 'collection_ids').length;
      this.totalContentTypeCount = _.get(this.programDetails, 'content_types').length;
      this.programContentTypes = this.programsService.getContentTypesName(this.programDetails.content_types);
      const getCurrentRoleId = _.find(this.programDetails.config.roles, {'name': this.sessionContext.currentRole});
      this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;

    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || this.resourceService.messages.emsg.project.m0001);
    });
  }

  readRolesOfOrgUsers() {
    if (this.programDetails.rolemapping) {
      _.forEach(this.roles, (role) => {
        if (this.programDetails.rolemapping[role.name]) {
          _.forEach(this.paginatedSourcingUsers, (user) => {
            if (_.includes(this.programDetails.rolemapping[role.name], user.identifier)) {
              user['selectedRole'] = role.name;
            } else {
              user['selectedRole'] = '-';
            }
          });
        }
      });
    }
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

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }

  checkActiveTab() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.activeTab = !_.isEmpty(params.get('tab')) ? params.get('tab') : 'textbook';
    });
    this.visitedTab.push(this.activeTab);
    this.showLoader = false;

    if (this.activeTab === 'textbook') {
      this.showTextbookLoader = true;
        this.programsService.getUserPreferencesforProgram(this.userProfile.identifier, this.programId).subscribe(
          (prefres) => {
            let preffilter = {};
            if (!isNullOrUndefined(prefres.result)) {
              this.userPreferences = prefres.result;
              preffilter = _.get(this.userPreferences, 'sourcing_preference');
            }
            this.getProgramCollection(preffilter).subscribe((res) => {
              this.showTextbookLoader  =  false;
            }, (err) => { // TODO: navigate to program list page
              this.showTextbookLoader  =  false;
              const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
              this.toasterService.warning(errorMes || 'Fetching textbooks failed');
            });
        }, (err) => { // TODO: navigate to program list page
          this.showTextbookLoader  =  false;
          const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
          this.toasterService.warning(errorMes || 'Fetching Preferences  failed');
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
      this.getProgramCollection().subscribe(
        (res) => { this.getNominationList(); },
        (err) => { // TODO: navigate to program list page
          const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
          this.toasterService.warning(errorMes || 'Fetching textbooks failed');
        }
      );
    }
  }

  onRoleChange(user) {
    if (_.includes(this.roleNames, user.selectedRole)) {
        let progRoleMapping = this.programDetails.rolemapping;
         if (isNullOrUndefined(progRoleMapping)) {
          progRoleMapping = {};
          progRoleMapping[user.selectedRole] = [];
         }
         const programRoleNames = _.map(progRoleMapping, function(currentelement, index, arrayobj) {
          return index;
        });
        if (!_.includes(programRoleNames, user.selectedRole)) {
          progRoleMapping[user.selectedRole] = [];
        }
        _.forEach(progRoleMapping, function(ua, role, arr) {
            if (user.selectedRole === role) {
              ua.push(user.identifier);
              _.compact(ua);
              progRoleMapping[role] = ua;
            }
          });

      const request = {
            'program_id': this.activatedRoute.snapshot.params.programId,
            'rolemapping': progRoleMapping
      };
      this.programsService.updateProgram(request)
        .subscribe(response => {
          this.toasterService.success(this.resourceService.messages.smsg.roles.m0001);
        }, error => {
          this.toasterService.error(this.resourceService.messages.emsg.roles.m0001);
        });
    } else {
      this.toasterService.error('Role not found');
    }
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
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

  public isEmptyObject(obj) {
    return !!(_.isEmpty(obj));
  }

  /*assignSampleCounts() {
    this.nominations = _.map(this.nominations, n => {
      n.programName = this.programDetails.name.trim();
      n.samples = this.getNominationSampleCounts(n);
      return n;
    });
    this.tempNominations = _.cloneDeep(this.nominations);
    this.showDownloadCsvBtn = !_.isEmpty(this.programDetails) && this.nominations.length > 0;
  }*/

  downloadNominationList() {
    this.downloadInProgress = true;
    const headers = [
      this.resourceService.frmelmnts.lbl.projectName,
      this.resourceService.frmelmnts.lbl.contributorName,
      this.resourceService.frmelmnts.lbl.type,
      this.resourceService.frmelmnts.lbl.textbooks,
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
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.error(errorMes || 'Unable to download nomination list. Please try later.');
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
              textbooks: res.collection_ids.length,
              samples: 0,
              createdon: res.createdon,
              status: res.status,
              user_id: res.user_id,
              organisation_id: res.organisation_id,
              nominationData: res,
            });
          }
        });
        this.getSampleContent();
      } else {
        this.showNominationLoader = false;
      }
      this.tempNominations = _.cloneDeep(this.nominations);
  }, error => {
    this.showNominationLoader = false;
    this.toasterService.error(this.resourceService.messages.emsg.projects.m0003);
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
    'pendingContributingOrg', 'acceptedContributingOrg', 'rejectedContributingOrg', 'pendingtSourcingOrg',
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
    this.toasterService.error(this.resourceService.messages.emsg.projects.m0005);
  });
}

textbookLevelReportHeaders() {
  const headers = [
    this.resourceService.frmelmnts.lbl.projectName,
    this.resourceService.frmelmnts.lbl.profile.Medium,
    this.resourceService.frmelmnts.lbl.profile.Classes,
    this.resourceService.frmelmnts.lbl.profile.Subjects,
    this.resourceService.frmelmnts.lbl.textbookName,
    this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn6,
    this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn7,
    this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn8,
    this.resourceService.frmelmnts.lbl.TextbookLevelReportColumn9,
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
    this.resourceService.frmelmnts.lbl.textbookName,
    this.resourceService.frmelmnts.lbl.ChapterLevelReportColumn6,
    this.resourceService.frmelmnts.lbl.ChapterLevelReportColumn7,
    ..._.map(this.programContentTypes.split(', '), type => `${this.resourceService.frmelmnts.lbl.ChapterLevelReportColumn8} ${type}` )
  ];
  return headers;
}
}
