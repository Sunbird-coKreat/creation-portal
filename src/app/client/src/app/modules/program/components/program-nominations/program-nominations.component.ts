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


@Component({
  selector: 'app-program-nominations',
  templateUrl: './program-nominations.component.html',
  styleUrls: ['./program-nominations.component.scss']
})
export class ProgramNominationsComponent implements OnInit, AfterViewInit, OnDestroy {
  public programId: string;
  public programDetails: any;
  public programContentTypes: string;
  nominations = [];
  nominationsCount;
  collectionsCount;
  tempNominations;
  tempNominationsCount;
  filterApplied: any;
  public selectedStatus = 'All';
  showNominationsComponent = false;
  public initiatedCount = 0;
  public pendingCount = 0;
  public approvedCount = 0;
  public rejectedCount = 0;
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
  public contributionDashboardData: any = [];
  public approvedNominations: any = [];
  public overAllContentCount: any = {};
  public isContributionDashboardTabActive = false;
  public canAssignUsers = false;

  constructor(public frameworkService: FrameworkService, private tosterService: ToasterService, private programsService: ProgramsService,
    public resourceService: ResourceService, private config: ConfigService, private collectionHierarchyService: CollectionHierarchyService,
    private publicDataService: PublicDataService, private activatedRoute: ActivatedRoute, private router: Router,
    private navigationHelperService: NavigationHelperService, public toasterService: ToasterService, public userService: UserService,
    public programStageService: ProgramStageService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
  }

  ngOnInit() {
    this.filterApplied = null;
    this.getNominationList();
    this.getProgramDetails();
    this.getNominationCounts();
    this.getProgramCollection();
    this.telemetryInteractCdata = [{id: this.activatedRoute.snapshot.params.programId, type: 'Program_ID'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.checkActiveTab();
    this.showUsersTab = this.isSourcingOrgAdmin();
    // this.sourcingOrgUser = this.programsService.sourcingOrgReviewers || [];
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
        this.nominations = this.tempNominations;
        this.nominationsCount = this.tempNominationsCount;
      } else {
        this.filterApplied = true;
        this.nominations = _.filter(this.tempNominations, (o) => {
          return o.nominationData.status === status;
        });
        this.nominationsCount = this.nominations.length;
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
    this.nominations = this.tempNominations;
    this.nominationsCount = this.tempNominationsCount;
    this.isContributionDashboardTabActive  = (tab === 'contributionDashboard') ? true : false;
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

  getNominationList() {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId,
            status: ['Pending', 'Approved', 'Rejected']
          }
        }
      }
    };
    this.programsService.post(req).subscribe((data) => {
      if (data.result && data.result.length > 0) {
        this.getDashboardData(data.result);
        _.forEach(data.result, (res) => {
          const isOrg = !_.isEmpty(res.organisation_id);
          let name = '';
          if (isOrg && !_.isEmpty(res.orgData)) {
            name = res.orgData.name;
          } else if (!_.isEmpty(res.userData)) {
            name = `${res.userData.firstName} ${res.userData.lastName || ''}`;
          }

          if (name) {
            this.nominations.push({
              'name': name.trim(),
              'type': isOrg ? 'Organisation' : 'Individual',
              'nominationData': res
            });
          }
        });
      }
      this.nominationsCount = this.nominations.length;
      this.tempNominations = this.nominations;
      this.tempNominationsCount = this.nominationsCount;
      this.showNominationsComponent = true;
    }, error => {
      this.tosterService.error('User onboarding failed');
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
    if (this.approvedNominations.length) {
    this.collectionHierarchyService.getContentAggregation(this.programId)
      .subscribe(
        (response) => {
          if (response && response.result && response.result.content) {
            const contents = _.get(response.result, 'content');
            this.contributionDashboardData = _.map(this.approvedNominations, nomination => {
              if (nomination.organisation_id) {
                // tslint:disable-next-line:max-line-length
                const dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCounts(contents, nomination.organisation_id, this.programCollections));
                // This is enable sorting table. So duping the data at the root of the dashboardData object
                dashboardData['sourcingPending'] = dashboardData.sourcingOrgStatus['pending'];
                dashboardData['sourcingAccepted'] = dashboardData.sourcingOrgStatus['accepted'];
                dashboardData['sourcingRejected'] = dashboardData.sourcingOrgStatus['rejected'];
                dashboardData['contributorName'] = this.setContributorName(nomination, 'org');
                return {
                  ...dashboardData,
                  contributorDetails: nomination,
                  type: 'org'
                };
              } else {
                // tslint:disable-next-line:max-line-length
                const dashboardData = _.cloneDeep(this.collectionHierarchyService.getContentCountsForIndividual(contents, nomination.user_id, this.programCollections));
                dashboardData['sourcingPending'] = dashboardData.sourcingOrgStatus['pending'];
                dashboardData['sourcingAccepted'] = dashboardData.sourcingOrgStatus['accepted'];
                dashboardData['sourcingRejected'] = dashboardData.sourcingOrgStatus['rejected'];
                dashboardData['contributorName'] = this.setContributorName(nomination, 'individual');
                return {
                  ...dashboardData,
                  contributorDetails: nomination,
                  type: 'individual'
                };
              }
            });
            this.getOverAllCounts(this.contributionDashboardData);
          } else {
            this.contributionDashboardData = _.map(this.approvedNominations, nomination => {
              return {
                total: 0,
                review: '0',
                draft: '0',
                rejected: '0',
                live: '0',
                sourcingPending: '0',
                sourcingAccepted: '0',
                sourcingRejected: '0',
                // tslint:disable-next-line:max-line-length
                contributorName: this.setContributorName(nomination, nomination.organisation_id ? 'org' : 'individual'),
                individualStatus: {},
                sourcingOrgStatus : {accepted: '0', rejected: '0', pending: '0'},
                contributorDetails: nomination,
                type: nomination.organisation_id ? 'org' : 'individual'
              };
            });
            this.getOverAllCounts(this.contributionDashboardData);
          }
        }
      );
    }
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

  setContributorName(nomination, type) {
    if (type === 'org') {
      const name = (nomination.userData && nomination.userData.name)
      ? nomination.userData.name : `${nomination.userData.firstName} ${nomination.userData.lastName}`;
      return _.trim(name);
    }
    return _.trim(`${nomination.userData.firstName} ${nomination.userData.lastName}`);
  }


  getNominatedTextbooksCount(nomination) {
    let count;
    if (nomination.nominationData) {
      count = nomination.nominationData.collection_ids ? nomination.nominationData.collection_ids.length : 0;
    } else {
      count = nomination.collection_ids ? nomination.collection_ids.length : 0;
    }
    if (count < 2) {
      return count + ' ' + this.resourceService.frmelmnts.lbl.textbook;
    }
    return count + ' ' + this.resourceService.frmelmnts.lbl.textbooks;
  }

  getProgramDetails() {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.programContext = this.programDetails;
      this.collectionsCount = _.get(this.programDetails, 'collection_ids').length;
      this.programContentTypes = this.programsService.getContentTypesName(this.programDetails.content_types);
      this.canAssignUsersToProgram();
      this.setActiveDate();
      // this.readRolesOfOrgUsers();
      const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
      this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || this.resourceService.messages.emsg.project.m0001);
    });
  }

  // readRolesOfOrgUsers() {
  //   if (this.programDetails.rolemapping) {
  //     _.forEach(this.roles, (role) => {
  //       if (this.programDetails.rolemapping[role.name]) {
  //         _.forEach(this.sourcingOrgUser, (user) => {
  //           if (_.includes(this.programDetails.rolemapping[role.name], user.identifier)) {
  //             user['selectedRole'] = role.name;
  //           }
  //         });
  //       }
  //     });
  //   }
  // }

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

  getNominationCounts() {
    this.fetchNominationCounts().subscribe((response) => {
      const statuses = _.get(response, 'result');
      statuses.forEach(nomination => {
        if (nomination.status === 'Pending') {
          this.pendingCount = nomination.count;
        }

        if (nomination.status === 'Approved') {
          this.approvedCount = nomination.count;
        }

        if (nomination.status === 'Rejected') {
          this.rejectedCount = nomination.count;
        }
        // tslint:disable-next-line: radix
        this.totalCount += parseInt(nomination.count);
      });
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || this.resourceService.messages.emsg.project.m0001);
    });
  }

  fetchNominationCounts() {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.programId,
            status: ['Pending', 'Approved', 'Rejected']
          },
          facets: ['program_id', 'status']
        }
      }
    };
    return this.programsService.post(req);
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
      this.toasterService.success('Roles updated');
    }, error => {
      this.toasterService.error('Roles update failed!');
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
}
