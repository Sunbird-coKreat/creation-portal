import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService, RegistryService, ActionService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { tap, first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgramStageService } from '../../../program/services/program-stage/program-stage.service';
import { CollectionHierarchyService } from '../../../cbse-program/services/collection-hierarchy/collection-hierarchy.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
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
  public programContext: any = {};
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
  public showUsersTab = false;
  public stageSubscription: any;
  public state: InitialState = {
    stages: []
  };
  public contributorOrgUser: any = [];
  public tempSortOrgUser: any = [];
  public orgDetails: any = {};
  public roles;
  public selectedRole;
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

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private configService: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  public toasterService: ToasterService, private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient,
  public frameworkService: FrameworkService, public userService: UserService, public registryService: RegistryService,
  public activeRoute: ActivatedRoute, private collectionHierarchyService: CollectionHierarchyService, public actionService: ActionService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
   }

  ngOnInit() {
    this.getProgramDetails();
    this.getNominationStatus();
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('listNominatedTextbookComponent');

    this.currentStage = 'listNominatedTextbookComponent';

    if (!_.isEmpty(this.userService.userProfile.userRegData) &&
      this.userService.userProfile.userRegData.User_Org &&
      this.userService.userProfile.userRegData.User_Org.roles.includes('admin')) {
      this.getContributionOrgUsers();
      this.showUsersTab = true;
    }
    this.telemetryInteractCdata = [{
      id: this.activatedRoute.snapshot.params.programId,
      type: 'Program_ID'
    }];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
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

  getProgramDetails() {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.roles = _.get(this.programDetails, 'config.roles');
      this.programContentTypes = this.programsService.getContentTypesName(this.programDetails.content_types);
      this.setActiveDate();
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
    });
  }

  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
      this.programContext = this.programDetails;
      this.mediums = _.join(this.programDetails.config['medium'], ', ');
      this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');

      this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
      if (this.sessionContext.framework) {
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

  getProgramTextbooks() {
     const option = {
      url: 'content/composite/v1/search',
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

    this.httpClient.post<any>(option.url, option.data).subscribe(
      (res) =>  {
        if (res && res.result && res.result.content) {
          this.showTexbooklist(res);
        }
      },
      (err) => console.log(err)
    );
  }

  showTexbooklist(res) {
    // tslint:disable-next-line:max-line-length
    const contributorTextbooks = (res.result.content.length && this.nominationDetails.collection_ids) ? _.filter(res.result.content, (collection) => {
      return _.includes(this.nominationDetails.collection_ids, collection.identifier);
    }) : [];
    if (!_.isEmpty(contributorTextbooks) && this.isNominationOrg()) {
      this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId).subscribe(
        (response) => {
          if (response && response.result && response.result.content) {
            const contents = _.get(response.result, 'content');
            // tslint:disable-next-line:max-line-length
            this.contentStatusCounts = this.collectionHierarchyService.getContentCounts(contents, this.sessionContext.nominationDetails.organisation_id);
            // tslint:disable-next-line:max-line-length
            this.contributorTextbooks = this.collectionHierarchyService.getIndividualCollectionStatus(this.contentStatusCounts, contributorTextbooks);
          } else {
            // tslint:disable-next-line:max-line-length
            this.contentStatusCounts = this.collectionHierarchyService.getContentCounts([], this.sessionContext.nominationDetails.organisation_id);
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
    const telemetryCdata = [{ 'type': 'Program_ID', 'id': this.activatedRoute.snapshot.params.programId }];
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
          uri: this.router.url,
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
    this.showChapterList = true;
    this.programStageService.addStage('chapterListComponent');
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
    this.contributorOrgUser = this.programsService.sortCollection(this.tempSortOrgUser, column, this.directionOrgUsers);
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
        if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
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
        if (this.programContext.config) {
          const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
          this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
        }
      }
      this.getProgramTextbooks();
    }, error => {
      this.toasterService.error('Failed fetching current nomination status');
    });
  }

  getContributionOrgUsers() {
    const baseUrl = ( <HTMLInputElement> document.getElementById('portalBaseUrl')) ?
      ( <HTMLInputElement> document.getElementById('portalBaseUrl')).value : '';
    if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
      const orgUsers = this.registryService.getContributionOrgUsers(this.userService.userProfile.userRegData.User_Org.orgId);
      this.orgDetails.name = this.userService.userProfile.userRegData.Org.name;
      this.orgDetails.id = this.userService.userProfile.userRegData.Org.osid;
      this.orgDetails.orgLink = `${baseUrl}contribute/join/${this.userService.userProfile.userRegData.Org.osid}`;
      orgUsers.subscribe(response => {
        const result = _.get(response, 'result');
        if (!result || _.isEmpty(result)) {
          console.log('NO USER FOUND');
        } else {
          // get Ids of all users whose role is 'user'
          const userIds = _.map(_.filter(result[_.first(_.keys(result))], ['roles', ['user']]), 'userId');
          const getUserDetails = _.map(userIds, id => this.registryService.getUserDetails(id));
          forkJoin(...getUserDetails)
            .subscribe((res: any) => {
              if (res) {
                _.forEach(res, r => {
                  if (r.result && r.result.User) {
                    let creator = r.result.User.firstName;
                    if (r.result.User.lastName) {
                      creator = creator + r.result.User.lastName;
                    }
                    r.result.User.fullName = creator;
                    if (this.nominationDetails.rolemapping) {
                      _.find(this.nominationDetails.rolemapping, (users, role) => {
                        if (_.includes(users, r.result.User.userId)) {
                          r.result.User.selectedRole = role;
                        }
                      });
                    }
                    this.contributorOrgUser.push(r.result.User);
                  }
                });
                this.tempSortOrgUser = this.contributorOrgUser;
              }
            }, error => {
              console.log(error);
            });
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onRoleChange() {
    const roleMap = {};
    _.forEach(this.roles, role => {
      roleMap[role.name] = _.filter(this.contributorOrgUser, user => {
        if (user.selectedRole === role.name) {  return user.userId; }
      }).map(({userId}) => userId);
    });
    const req = {
      'request': {
          'program_id': this.activatedRoute.snapshot.params.programId,
          'user_id': this.userService.userid,
          'rolemapping': roleMap
      }
    };
    const updateNomination = this.programsService.updateNomination(req);
    updateNomination.subscribe(response => {
      this.toasterService.success('Roles updated');
    }, error => {
      console.log(error);
    });
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
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
    return !!(this.checkIfUserBelongsToOrg() &&
      this.userService.userProfile.userRegData.User_Org.roles.includes('admin'));
  }

  checkIfUserBelongsToOrg() {
    return !!(this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org);
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
