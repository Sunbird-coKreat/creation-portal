import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ProgramsService, PublicDataService, UserService, FrameworkService } from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ISessionContext, InitialState } from '../../../cbse-program/interfaces';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import * as _ from 'lodash-es';
import { tap, first } from 'rxjs/operators';
import * as moment from 'moment';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { DatePipe } from '@angular/common';

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
  nominations = [];
  pageNominations = [];
  collectionsCount;
  tempNominations;
  filterApplied: any;
  public selectedStatus = 'All';
  showNominationsComponent = false;
  public initiatedCount = 0;
  public statusCount = {};
  public totalCount = 0;
  public activeDate = '';
  public sessionContext: ISessionContext = {};
  public userProfile: any;
  public mediums: any;
  public grades: any;
  public selectedNomination: any;
  showContributorProfilePopup = false;
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public activeTab = '';
  public direction = 'asc';
  public sortColumn = '';
  public sourcingOrgUser = [];
  public roles;
  public showUsersTab = false;
  public currentStage: string;
  public dynamicInputs;
  public programContext: any = {};
  public state: InitialState = {
    stages: []
  };
  public stageSubscription: any;
  public component: any;
  public programCollections: any;
  public contentAggregationData: any;
  public contributionDashboardData: any = [];
  public approvedNominations: any = [];
  public overAllContentCount: any = {};
  public isContributionDashboardTabActive = false;
  public canAssignUsers = false;
  nominatedContentTypes: any = [];
  public contributedByOrganisation = 0;
  public contributedByIndividual = 0;
  public nominatedTextbook = 0;
  public nominatedContentTypeCount = 0;
  public samplesCount = 0;
  public totalContentTypeCount = 0;
  public nominationSampleCounts: any;
  public showDownloadCsvBtn = false;
  public directionOrgUsers = 'desc';
  public columnOrgUsers = '';
  public totalPages: number;
  public nominationsPerPage = 200;
  public currentPage: number;
  public totalNominations: number;
  public showLoader = true;
  public tableLoader = false;
  public disablePagination = {};
  public pageNumArray: Array<number>;

  constructor(public frameworkService: FrameworkService, private tosterService: ToasterService, private programsService: ProgramsService,
    public resourceService: ResourceService, private config: ConfigService, private collectionHierarchyService: CollectionHierarchyService,
    private publicDataService: PublicDataService, private activatedRoute: ActivatedRoute, private router: Router,
    private navigationHelperService: NavigationHelperService, public toasterService: ToasterService, public userService: UserService,
    public programStageService: ProgramStageService, private datePipe: DatePipe) {
    this.programId = this.activatedRoute.snapshot.params.programId;
  }

  ngOnInit() {
    this.filterApplied = null;
    this.getProgramDetails();
    this.telemetryInteractCdata = [{id: this.activatedRoute.snapshot.params.programId, type: 'Program_ID'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.checkActiveTab();
    this.showUsersTab = this.isSourcingOrgAdmin();
    this.sourcingOrgUser = this.programsService.sourcingOrgReviewers || [];
    this.roles = [{name: 'REVIEWER'}];
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
    const telemetryCdata = [{type: 'Program_ID', id: this.activatedRoute.snapshot.params.programId}];
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
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  canAssignUsersToProgram() {
    const today = moment();
    this.canAssignUsers = moment(this.programContext.content_submission_enddate).isSameOrAfter(today, 'day');
  }
  isSourcingOrgAdmin() {
    return _.includes(this.userService.userProfile.userRoles, 'ORG_ADMIN') &&
    this.router.url.includes('/sourcing');
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
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
    this.router.navigate([], {
    relativeTo: this.activatedRoute,
    queryParams: {
      tab: tab
    },
    queryParamsHandling: 'merge'
    });
    this.filterApplied = null;
    this.selectedStatus = 'All';
    this.sortColumn = '';
    this.direction = 'asc';
    this.nominations = _.cloneDeep(this.tempNominations);
    this.isContributionDashboardTabActive  = (tab === 'contributionDashboard') ? true : false;
    if (tab === 'nomination') {
      this.direction = 'desc';
      this.sortColumn = 'createdon';
      this.sortCollection(this.sortColumn, this.nominations);
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
            status: ['Pending', 'Approved', 'Rejected']
          },
          limit: 1000
        }
      }
    };
    this.programsService.post(req).subscribe((data) => {
      if (data.result && data.result.length > 0) {
        const filteredArr = _.filter(data.result, (obj) => obj.userData);
        this.getDashboardData(filteredArr);
        _.forEach(data.result, (res) => {
            this.nominatedContentTypes = _.concat(this.nominatedContentTypes, res.content_types);
        });
      }
      this.nominatedContentTypes =  _.uniq(this.nominatedContentTypes);
      this.nominatedContentTypes = this.programsService.getContentTypesName(this.nominatedContentTypes);
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.projects.m0003);
    });
  }

  public getSampleContent() {
    this.collectionHierarchyService.getContentAggregation(this.programId, true)
    .subscribe(
      (response) => {
        if (response && response.result && response.result.count) {
          const contents = _.get(response.result, 'content');
          this.samplesCount = response.result.count;
          this.setNominationSampleCounts(contents);
        }
        this.showLoader = false;
      });
  }
  getProgramCollection () {
    this.collectionHierarchyService.getCollectionWithProgramId(this.programId).subscribe(
      (res: any) => {
        if (res && res.result && res.result.content && res.result.content.length) {
          this.programCollections = res.result.content;
        }
      },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );

  }

  getDashboardData(nominations) {
    // tslint:disable-next-line:max-line-length
    this.approvedNominations = _.filter(nominations, nomination => nomination.status === 'Approved' );
    this.collectionHierarchyService.getContentAggregation(this.programId)
      .subscribe(
        (response) => {
          if (response && response.result && response.result.content) {
            const contents = _.get(response.result, 'content');
            this.contentAggregationData = _.cloneDeep(contents);
            if (this.approvedNominations.length) {
              this.contributionDashboardData = _.map(this.approvedNominations, nomination => {
                if (nomination.organisation_id) {
                  // tslint:disable-next-line:max-line-length
                  const dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCounts(contents, nomination.organisation_id, this.programCollections));
                  // This is enable sorting table. So duping the data at the root of the dashboardData object
                  dashboardData['sourcingPending'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['pending'];
                  dashboardData['sourcingAccepted'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['accepted'];
                  dashboardData['sourcingRejected'] = dashboardData.sourcingOrgStatus && dashboardData.sourcingOrgStatus['rejected'];
                  dashboardData['contributorName'] = nomination.name;
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
                  dashboardData['contributorName'] = nomination.name;
                  return {
                    ...dashboardData,
                    contributorDetails: nomination,
                    type: 'individual'
                  };
                }
              });
              this.getOverAllCounts(this.contributionDashboardData);
            } else if (this.approvedNominations.length) {
              this.contributionDashboardData = _.map(this.approvedNominations, nomination => {
                return this.dashboardObject(nomination);
              });
              this.getOverAllCounts(this.contributionDashboardData);
            }
          } else if (this.approvedNominations.length) {
            this.contentAggregationData = [];
            this.contributionDashboardData = _.map(this.approvedNominations, nomination => {
              return this.dashboardObject(nomination);
            });
            this.getOverAllCounts(this.contributionDashboardData);
          } else  {
            this.contentAggregationData = [];
          }
        },
        (error) => {
          console.log(error);
          const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
          this.toasterService.error(errorMes || 'Fetching textbooks failed. Please try again...');
        });
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
                  contributorName: this.setContributorName(nomination, nomination.organisation_id ? 'org' : 'individual'),
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
    this.assignSampleCounts();
  }

  getNominationSampleCounts(nomination) {
    // tslint:disable-next-line:max-line-length
    return (nomination.organisation_id) ? this.nominationSampleCounts[nomination.organisation_id] || 0 : this.nominationSampleCounts[nomination.user_id] || 0;
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
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.programContext = this.programDetails;
      this.collectionsCount = _.get(this.programDetails, 'collection_ids').length;
      this.totalContentTypeCount = _.get(this.programDetails, 'content_types').length;
      this.programContentTypes = this.programsService.getContentTypesName(this.programDetails.content_types);
      this.canAssignUsersToProgram();
      this.setActiveDate();
      this.readRolesOfOrgUsers();
      const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
      this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
      this.getProgramCollection();
      this.getAggregatedNominationsCount();
      this.getNominationList();
      this.getPaginatedNominations(0);
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
          _.forEach(this.sourcingOrgUser, (user) => {
            if (_.includes(this.programDetails.rolemapping[role.name], user.identifier)) {
              user['selectedRole'] = role.name;
            } else {
              user['selectedRole'] = '-';
            }
          });
        }
      });
      this.sortOrgUsers('selectedRole');
    }
  }

  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
      this.mediums = _.join(this.programDetails.config['medium'], ', ');
      this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');

      this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
      if (this.sessionContext.framework) {
        this.userProfile = this.userService.userProfile;
        this.fetchFrameWorkDetails();
      }
    }));
  }

  public fetchFrameWorkDetails() {
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
  }
  onRoleChange() {
    const roleMap = {};
    _.forEach(this.roles, role => {
      roleMap[role.name] = _.reduce(this.sourcingOrgUser, (result, user) => {
        if (user.selectedRole === role.name) {  result.push(user.identifier); }
        return result;
      }, []);
    });
    const request = {
          'program_id': this.activatedRoute.snapshot.params.programId,
          'rolemapping': roleMap
    };
  this.programsService.updateProgram(request)
    .subscribe(response => {
      this.toasterService.success(this.resourceService.messages.smsg.roles.m0001);
    }, error => {
      this.toasterService.error(this.resourceService.messages.emsg.roles.m0001);
    });
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  viewContribution(collection) {
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection = collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.dynamicInputs = {
      chapterListComponentInput: {
        sessionContext: this.sessionContext,
        collection: collection,
        config: _.find(this.programContext.config.components, { 'id': 'ng.sunbird.chapterList' }),
        programContext: this.programContext,
        role: {
          currentRole: this.sessionContext.currentRole
        }
      }
    };
    this.programStageService.addStage('chapterListComponent');
  }

  public isEmptyObject(obj) {
    return !!(_.isEmpty(obj));
  }

  assignSampleCounts() {
    this.nominations = _.map(this.nominations, n => {
      n.programName = this.programDetails.name.trim();
      n.samples = this.getNominationSampleCounts(n);
      return n;
    });
    this.tempNominations = _.cloneDeep(this.nominations);
    this.showDownloadCsvBtn = !_.isEmpty(this.programDetails) && this.nominations.length > 0;
  }

  downloadNominationList() {
    const tableData = _.filter(_.cloneDeep(this.tempNominations), (nomination) => {
      nomination.createdon = this.datePipe.transform(nomination.createdon, 'LLLL d, yyyy');
      delete nomination.nominationData;
      delete nomination.user_id;
      delete nomination.organisation_id;
      return nomination;
    });
    const headers = [
      this.resourceService.frmelmnts.lbl.projectName,
      this.resourceService.frmelmnts.lbl.contributorName,
      this.resourceService.frmelmnts.lbl.type,
      this.resourceService.frmelmnts.lbl.textbooks,
      this.resourceService.frmelmnts.lbl.samples,
      this.resourceService.frmelmnts.lbl.nominationDate,
      this.resourceService.frmelmnts.lbl.status,
    ];
    const csvDownloadConfig = {
      filename: this.programDetails.name.trim(),
      tableData: tableData,
      headers: headers,
      showTitle: false
    };
    this.programsService.downloadReport(csvDownloadConfig);
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
        limit: this.nominationsPerPage
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
        if (!this.nominationSampleCounts) {
          this.getSampleContent();
        } else {
          this.assignSampleCounts();
        }
      }
      this.tempNominations = _.cloneDeep(this.nominations);
      this.showNominationsComponent = true;
      this.tableLoader = false;
}, error => {
  this.tableLoader = false;
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
this.programsService.post(req).subscribe((data) => {
  const aggregatedCount = data.result.nomination;
  this.totalNominations = aggregatedCount.count;
  if (aggregatedCount.fields && aggregatedCount.fields.length) {
  this.statusCount = _.get(_.find(aggregatedCount.fields, {name: 'status'}), 'fields');
  this.contributedByOrganisation = _.get(_.find(aggregatedCount.fields, {name: 'organisation_id'}), 'count');
  this.contributedByIndividual = this.totalNominations - this.contributedByOrganisation;
  this.nominatedTextbook = _.get(_.find(aggregatedCount.fields, {name: 'collection_ids'}), 'count');
  this.nominatedContentTypeCount = _.get(_.find(aggregatedCount.fields, {name: 'content_types'}), 'count');
  }
  this.currentPage = 1;
  this.totalPages = Math.ceil(this.totalNominations / this.nominationsPerPage);
  this.handlePageNumArray();
  this.disablePaginationButtons();
}, err => {
  this.toasterService.error(this.resourceService.messages.emsg.projects.m0003);
});
}

navigatePage(pageNum) {
    switch (pageNum) {
      case 'first':
        this.currentPage = 1;
        break;
      case 'last':
        this.currentPage = this.totalPages;
        break;
      case 'prev':
        this.currentPage = this.currentPage - 1;
        break;
      case 'next':
        this.currentPage = this.currentPage + 1;
        break;
      default:
        this.currentPage = pageNum;
    }
    this.handlePagination(this.currentPage);
}

handlePagination(pageNum) {
const offset = (pageNum - 1) * this.nominationsPerPage;
this.tableLoader = true;
this.getPaginatedNominations(offset);
this.handlePageNumArray();
this.disablePaginationButtons();
}

disablePaginationButtons() {
 this.disablePagination = {};
 if (this.currentPage === 1) {
   this.disablePagination['first'] = true;
   this.disablePagination['prev'] = true;
 }
 if (this.currentPage === this.totalPages) {
  this.disablePagination['last'] = true;
  this.disablePagination['next'] = true;
}
}

handlePageNumArray() {
if ((this.currentPage + 5) >= (this.totalPages + 1)) {
  const initValue = this.totalPages - 4 <= 0 ? 1 : this.totalPages - 4;
  this.pageNumArray = _.range(initValue , (this.totalPages + 1));
} else {
  this.pageNumArray = _.range(this.currentPage, (this.currentPage + 5));
}
}
}
