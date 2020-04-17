import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ProgramsService, PublicDataService, UserService, FrameworkService } from '@sunbird/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ISessionContext, InitialState } from '../../../cbse-program/interfaces';
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
export class ProgramNominationsComponent implements OnInit, AfterViewInit {
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
  public currentStage: string;
  public dynamicInputs;
  public programContext: any = {};
  public state: InitialState = {
    stages: []
  };
  public stageSubscription: any;
  public component: any;

  constructor(public frameworkService: FrameworkService, private tosterService: ToasterService, private programsService: ProgramsService,
    public resourceService: ResourceService, private config: ConfigService,
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
    this.telemetryInteractCdata = [{id: this.activatedRoute.snapshot.params.programId, type: 'Program_ID'}];
  this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
  this.telemetryInteractObject = {};
  this.checkActiveTab();
  this.sourcingOrgUser = this.programsService.sourcingOrgReviewers || [];
  this.roles = [{name: 'REVIEWER'}];
  this.sessionContext.currentRole = 'REVIEWER';
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
  }

  sortCollection(column) {
    this.nominations = this.programsService.sortCollection(this.nominations, column, this.direction);
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
      if (data.result.length > 0) {
        _.forEach(data.result, (res) => {
          const isOrg = !_.isEmpty(res.organisation_id);
          let name = '';
          /*if (isOrg) {
            name = res.userData.name;
          } else {
            name = res.userData.firstName;
            if (!_.isEmpty(res.userData.lastName)) {
              name  += ' ' + res.userData.lastName;
            }
          }*/
          name = res.userData.firstName;
          if (!_.isEmpty(res.userData.lastName)) {
            name  += ' ' + res.userData.lastName;
          }
          this.nominations.push({
            'name': name,
            'type': isOrg ? 'Organisation' : 'Individual',
            'nominationData': res
          });
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
      this.setActiveDate();
      this.readRolesOfOrgUsers();
      const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
          this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
    });
  }

  readRolesOfOrgUsers() {
    if (this.programDetails.rolemapping) {
      _.forEach(this.roles, (role) => {
        if (this.programDetails.rolemapping[role.name]) {
          _.forEach(this.sourcingOrgUser, (user) => {
            if (_.includes(this.programDetails.rolemapping[role.name], user.identifier)) {
              user['selectedRole'] = role.name;
            }
          });
        }
      });
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
      this.toasterService.error(errorMes || 'Fetching program details failed');
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
