import { IImpressionEventInput, IInteractEventEdata} from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, UserService, FrameworkService, NotificationService, ContentHelperService} from '@sunbird/core';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { IChapterListComponentInput } from '../../../sourcing/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService } from '../../services/';
import { ChapterListComponent } from '../../../sourcing/components/chapter-list/chapter-list.component';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { tap, filter, first, map, catchError } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { SourcingService } from '../../../sourcing/services';
import { HelperService } from '../../../sourcing/services/helper.service';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-list-contributor-textbooks',
  templateUrl: './list-contributor-textbooks.component.html',
  styleUrls: ['./list-contributor-textbooks.component.scss']
})
export class ListContributorTextbooksComponent implements OnInit, AfterViewInit, OnDestroy {
  public contributor;
  public contributorTextbooks;
  public tempSortTextbooks = [];
  public nominatedContentTypes: string;
  public noResultFound;
  public telemetryImpression: IImpressionEventInput;
  public component: any;
  public sessionContext: ISessionContext = {};
  public programContext: any = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public dynamicInputs;
  public programDetails: any = {};
  public programId = '';
  public initiatedCount = 0;
  public pendingCount = 0;
  public approvedCount = 0;
  public rejectedCount = 0;
  public totalCount = 0;
  public stageSubscription: any;
  public activeDate = '';
  public mediums: any;
  public roles;
  public grades: any;
  public direction = 'asc';
  public sortColumn = 'name';
  public state: InitialState = {
    stages: []
  };
  public currentStage: any;
  showChapterList = false;
  showcontributorProfile = false;
  collection;
  configData;
  selectedNominationDetails: any;
  showRequestChangesPopup: boolean;
  rejectComment = '';
  public sampleDataCount = 0;
  public showLoader = true;
  sharedContext;
  @ViewChild('FormControl') FormControl: NgForm;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;
  public targetCollections: string;
  private onComponentDestroy$ = new Subject<any>();
  public collectionsCnt = 0;
  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private userService: UserService, private frameworkService: FrameworkService,
    public config: ConfigService, private activatedRoute: ActivatedRoute, private router: Router, 
    public programStageService: ProgramStageService, private navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService, private collectionHierarchyService: CollectionHierarchyService, 
    private contentHelperService: ContentHelperService, private notificationService: NotificationService, 
    private sourcingService: SourcingService, private helperService: HelperService) { }

  ngOnInit() {
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.activatedRoute.fragment.pipe(map(fragment => fragment || 'None')).subscribe((frag) => {
      this.selectedNominationDetails = frag;
    });
    this.contributor = this.selectedNominationDetails;
    this.nominatedContentTypes = this.contributor.nominationData.targetprimarycategories ? _.join(_.map(this.contributor.nominationData.targetprimarycategories, 'name'), ', ') : _.join(this.helperService.mapContentTypesToCategories(this.contributor.nominationData.content_types), ', ');
    this.getPageId();
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('listContributorTextbook');
    this.telemetryInteractCdata = [
      {id: this.userService.channel, type: 'sourcing_organization'},
      {id: this.activatedRoute.snapshot.params.programId, type: 'project'}
    ];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.currentStage = 'listContributorTextbook';
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.programContext = _.get(programDetails, 'result');
      this.sessionContext.framework = _.isArray(_.get(this.programDetails, 'config.framework')) ? _.first(_.get(this.programDetails, 'config.framework')) : _.get(this.programDetails, 'config.framework');
      this.helperService.fetchProgramFramework(this.sessionContext);
      this.sessionContext.nominationDetails = this.selectedNominationDetails && this.selectedNominationDetails.nominationData;
      this.setActiveDate();
      this.setProgramRole();
  
      if (!this.programContext.target_type || this.programContext.target_type === 'collections') {
        this.getProgramTextbooks();
      } else if (this.programDetails.target_type == 'searchCriteria') {
        this.getOriginForApprovedContents().subscribe((res) => {
          this.getProgramContents();
        })
      }
      this.getNominationCounts();
      this.roles = _.get(this.programContext, 'config.roles');
      this.configData = _.find(this.programContext.config.components, {'id': 'ng.sunbird.chapterList'});
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
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

  getNominationCounts() {
    this.fetchNominationCounts().subscribe((response) => {
      const statuses = _.get(response, 'result');
      statuses.forEach(nomination => {
        if (nomination.status === 'Initiated') {
          this.initiatedCount = nomination.count;
        }
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
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.project.m0001,
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }
  fetchNominationCounts() {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.programId
          },
          facets: ['program_id', 'status']
        }
      }
    };
    return this.programsService.post(req);
  }
  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      this.programDetails = programDetails.result;
      this.targetCollections = this.programsService.setTargetCollectionName(this.programDetails, 'plural');
      this.mediums = _.join(this.programDetails.config['medium'], ', ');
      this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');
    }));
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
 
  getProgramContents() {
    let sampleValue, organisation_id, individualUserId, onlyCount, contentStatusCounts;
    const currentNominationStatus = this.contributor.nominationData.status;
    if (_.includes(['Initiated', 'Pending'], currentNominationStatus)) {
        sampleValue = true;
    }
    const orgId =  (this.sessionContext.nominationDetails && this.isNominationOrg()) ?
    this.sessionContext.nominationDetails.organisation_id : undefined;
    const userId = (this.sessionContext.nominationDetails && !this.isNominationOrg()) ?
    this.sessionContext.nominationDetails.user_id : undefined;
    this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId, sampleValue, orgId, userId, onlyCount, true).subscribe(
      (response) => {
        let contents = [];
        if (response && response.result && (_.get(response.result, 'content')|| _.get(response.result, 'QuestionSet'))) {
          contents = _.compact(_.concat(_.get(response.result, 'QuestionSet'), _.get(response.result, 'content')));
        }
        this.contributorTextbooks = _.cloneDeep(contents);
        this.collectionsCnt = (sampleValue) ? this.contributorTextbooks.length : 0;
        _.map(this.contributorTextbooks, (content) => {
          content['contentVisibility'] = (sampleValue) ? true : this.contentHelperService.shouldContentBeVisible(content, this.programDetails);
          if (!sampleValue) {
            content['sourcingStatus'] = this.contentHelperService.checkSourcingStatus(content, this.programDetails);
            const temp = this.contentHelperService.getContentDisplayStatus(content)
            content['resourceStatusText'] = temp[0];
            content['resourceStatusClass'] = temp[1];
            if (content.contentVisibility) {
              this.collectionsCnt++;
            }
          }
        });
        if (this.userService.isUserBelongsToOrg()) {
            contentStatusCounts = this.collectionHierarchyService.getContentCounts(contents, this.userService.getUserOrgId());
        } else {
          // tslint:disable-next-line:max-line-length
          contentStatusCounts = this.collectionHierarchyService.getContentCountsForIndividual(contents, this.userService.userid);
        }
        this.tempSortTextbooks = this.contributorTextbooks;
        this.showLoader = false;
      },(error) => {
        this.showLoader = false;
        const errInfo = {
          errorMsg: 'Fetching textbooks failed. Please try again...',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }
  getProgramTextbooks() {
    const req = this.collectionHierarchyService.getCollectionWithProgramId(this.programId, this.programDetails.target_collection_category, undefined);
    req.subscribe(
      (res) => this.showTexbooklist(res),
      (err) => {
        const errInfo = {
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
          request: {}
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      }
    );
  }
  showTexbooklist (res) {
    const contributorTextbooks = res.result.content.length ? _.filter(res.result.content, (collection) => {
         return _.includes(this.selectedNominationDetails.nominationData.collection_ids, collection.identifier);
    }) : [];
    if (!_.isEmpty(contributorTextbooks)) {
      const isSample = (this.sessionContext.nominationDetails &&
      (this.sessionContext.nominationDetails.status !== 'Approved' ||
      this.sessionContext.nominationDetails.status !== 'Rejected')) ? true : undefined;

      const orgId =  (this.sessionContext.nominationDetails && this.isNominationOrg()) ?
       this.sessionContext.nominationDetails.organisation_id : undefined;
      const userId = (this.sessionContext.nominationDetails && !this.isNominationOrg()) ?
      this.sessionContext.nominationDetails.user_id : undefined;
      this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId, isSample, orgId, userId)
        .subscribe(
          (response) => {
            if (response && response.result && (_.get(response.result, 'content') || _.get(response.result, 'QuestionSet'))) {
              const contents = _.compact(_.concat(_.get(response.result, 'content'), _.get(response.result, 'QuestionSet')));
              let contentStatusCounts: any = {};
              if (this.isNominationOrg()) {
                // tslint:disable-next-line:max-line-length
                contentStatusCounts = this.collectionHierarchyService.getContentCounts(contents, this.sessionContext.nominationDetails.organisation_id, contributorTextbooks);
              } else {
                // tslint:disable-next-line:max-line-length
                contentStatusCounts = this.collectionHierarchyService.getContentCountsForIndividual(contents, this.sessionContext.nominationDetails.user_id, contributorTextbooks);
              }
              // tslint:disable-next-line:max-line-length
              this.contributorTextbooks = this.collectionHierarchyService.getIndividualCollectionStatus(contentStatusCounts, contributorTextbooks);
              this.tempSortTextbooks = this.contributorTextbooks;
              this.collectionsCnt = this.contributorTextbooks.length;
              this.sortCollection(this.sortColumn);
              this.showLoader = false;
            } else {
              this.contributorTextbooks = this.collectionHierarchyService.getIndividualCollectionStatus([], contributorTextbooks);
              this.tempSortTextbooks = this.contributorTextbooks;
              this.collectionsCnt = this.contributorTextbooks.length;
              this.sortCollection(this.sortColumn);
              this.showLoader = false;
            }
          },
          (error) => {
            console.log(error);
            this.showLoader = false;
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
      this.tempSortTextbooks = contributorTextbooks;
      this.showLoader = false;
    }
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
          duration: this.navigationHelperService.getPageLoadTime(),
          visits: []
        }
      };
     });
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }
  openContent(content) {
    this.contentHelperService.initialize(this.programContext, this.sessionContext);
    this.contentHelperService.openContent(content);
    this.contentHelperService.dynamicInputs$.subscribe((res) => {
      this.dynamicInputs = res;
    });
    this.contentHelperService.currentOpenedComponent$.subscribe((res) => {
      this.component = res;
    });
  }

  setProgramRole() {
    this.sessionContext.currentRoles = ['REVIEWER'] ;
    const currentRoles = _.filter(this.programContext.config.roles, role => this.sessionContext.currentRoles.includes(role.name));
    this.sessionContext.currentRoleIds = !_.isEmpty(currentRoles) ? _.map(currentRoles, role => role.id) : null;
  }
  viewContribution(collection) {
    this.setFrameworkCategories(collection);
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.config.telemetryLabels.pageId.sourcing.projectNominationTargetCollection,
      telemetryInteractCdata: [...this.telemetryInteractCdata, { 'id': collection.identifier, 'type': 'linked_collection'}]
    };
    this.sessionContext.collection =  collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.sessionContext.targetCollectionPrimaryCategory = _.get(collection, 'primaryCategory');
    const collectionSharedProperties = this.helperService.getSharedProperties(this.programDetails, collection)
    this.sessionContext = _.assign(this.sessionContext, collectionSharedProperties);
    this.dynamicInputs = {
      chapterListComponentInput: {
        sessionContext: this.sessionContext,
        collection: collection,
        config: this.configData,
        programContext: this.programContext,
        roles: {
          currentRoles: ['REVIEWER']
        }
      }
    };
    this.programStageService.addStage('chapterListComponent');
  }

  setFrameworkCategories(collection) {
    this.sessionContext.targetCollectionFrameworksData = this.helperService.setFrameworkCategories(collection);
  }

  checkArrayCondition(param) {
    // tslint:disable-next-line:max-line-length
    this.sharedContext[param] = _.isArray(this.sharedContext[param]) ? this.sharedContext[param] : _.split(this.sharedContext[param], ',');
  }

  updateNomination(status) {
    let nominationStatus;
    (status === 'accept') ? (nominationStatus = 'Approved') : (nominationStatus = 'Rejected');
     const req = {
       request: {
           program_id: this.programId,
           user_id: this.contributor.nominationData.user_id,
           status: nominationStatus,
           updatedby: this.userService.userProfile.userId
         }
        };
     if (nominationStatus === 'Rejected') {
       if (this.FormControl.value.rejectComment) {
        req.request['feedback'] = this.FormControl.value.rejectComment;
       } else {
         return;
       }
      }
     this.programsService.updateNomination(req).subscribe((res) => {
      this.contributor.nominationData.status = nominationStatus;
      this.contributor.nominationData.programData = this.programDetails;
       this.notificationService.onAfterNominationUpdate(this.contributor.nominationData)
       .subscribe(
         response => { },
         error => console.log(error)
       );
       this.showRequestChangesPopup = false;
       setTimeout(() => {
        this.router.navigate(['/sourcing/nominations/' + this.programId],
         {queryParams: { tab: 'nomination' }, queryParamsHandling: 'merge' });
       });
        this.toasterService.success(this.resourceService.messages.smsg.m0010);
     },
     (err) => {
       this.showRequestChangesPopup = false;
       setTimeout(() => {
        this.router.navigate(['/sourcing/nominations/' + this.programId],
         {queryParams: { tab: 'nomination' }, queryParamsHandling: 'merge' });
       });
       this.toasterService.success(this.resourceService.messages.fmsg.m0026);
     });
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
  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }
  goBack() {
    this.navigationHelperService.navigateToPreviousUrl();
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

  rejectNomination() {
    this.showRequestChangesPopup = true;
    this.rejectComment = '';
  }
  isNominationOrg() {
    return !!(this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.organisation_id);
  }
  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
