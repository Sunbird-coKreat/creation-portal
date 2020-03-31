import { IImpressionEventInput, IInteractEventEdata} from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService, ActionService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService } from '../../services/';
import { ProgramComponentsService} from '../../services/program-components/program-components.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { tap, filter, first, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { throwError, forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-contributor-textbooks',
  templateUrl: './list-contributor-textbooks.component.html',
  styleUrls: ['./list-contributor-textbooks.component.scss']
})
export class ListContributorTextbooksComponent implements OnInit, AfterViewInit, OnDestroy {
  public contributor;
  public contributorTextbooks;
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
  public state: InitialState = {
    stages: []
  };
  public currentStage: any;
  showChapterList = false;
  show = false;
  role: any = {};
  collection;
  configData;
  selectedNominationDetails: any;
  showRequestChangesPopup: boolean;
  public sampleDataCount = 0;
  @ViewChild('FormControl') FormControl: NgForm;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private userService: UserService, private frameworkService: FrameworkService,
    private config: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient,
  public toasterService: ToasterService, public actionService: ActionService) { }


  ngOnInit() {
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.activatedRoute.fragment.pipe(map(fragment => fragment || 'None')).subscribe((frag) => {
      this.selectedNominationDetails = frag;
    });
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('listContributorTextbook');

    this.currentStage = 'listContributorTextbook';
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.setActiveDate();
      this.getProgramTextbooks();
      this.getNominationCounts();
      this.programContext = _.get(programDetails, 'result');
      this.roles = _.get(this.programContext, 'config.roles');
      this.configData = _.find(this.programContext.config.components, {'id': 'ng.sunbird.chapterList'});
      this.sessionContext.framework = _.get(this.programContext, 'config.framework');
      this.sessionContext.nominationDetails = this.selectedNominationDetails && this.selectedNominationDetails.nominationData;
      if (this.sessionContext.framework) {
        this.fetchFrameWorkDetails();
      }
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
    });
    this.contributor = this.selectedNominationDetails;
    this.telemetryInteractCdata = [{id: this.activatedRoute.snapshot.params.programId, type: 'Program_ID'}];
  this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
  this.telemetryInteractObject = {};
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

  showHideNominationBtn() {
    if (!this.programDetails) {
      return false;
    }
    let isShortlistingDateFuture = true;
    if (!_.isEmpty(this.programDetails.shortlisting_enddate)) {
      isShortlistingDateFuture = this.isFutureDate(this.programDetails.shortlisting_enddate);
    }
    const isContributionDateFuture = this.isFutureDate(this.programDetails.content_submission_enddate);
    const isEndDateFuture = this.isFutureDate(this.programDetails.enddate);
    return isShortlistingDateFuture && isContributionDateFuture && isEndDateFuture;
  }

  isFutureDate(inputDate) {
    const date  = moment(moment(inputDate).format('YYYY-MM-DD'));
    const today = moment(moment().format('YYYY-MM-DD'));
    return moment(date).isSameOrAfter(today);
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
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
      this.mediums = _.join(this.programDetails.config['medium'], ', ');
      this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');
    }));
  }
  getProgramTextbooks() {
     const option = {
      url: 'content/composite/v1/search',
       data: {
      request: {
         filters: {
          objectType: 'content',
          programId: this.programId,
          status: ['Draft', 'Live'],
          contentType: 'Textbook'
        }
      }
      }
    };
    this.httpClient.post<any>(option.url, option.data).subscribe(
      (res) => this.showTexbooklist(res),
      (err) => console.log(err)
    );
  }
  showTexbooklist (res) {
    const contributorTextbooks = res.result.content.length ? _.filter(res.result.content, (collection) => {
         return _.includes(this.selectedNominationDetails.nominationData.collection_ids, collection.identifier);
    }) : [];
    if (!_.isEmpty(contributorTextbooks)) {
      const collectionIds = _.map(contributorTextbooks, 'identifier');
      this.getCollectionHierarchy(collectionIds)
        .subscribe(response => {
          const hierarchies = _.map(response, r => {
            if (r.result && r.result.content) {
              return r.result.content;
            } else {
              return r.result;
            }
          });
          const hierarchyContent = _.map(hierarchies, hierarchy => {
            this.sampleDataCount = 0;
            hierarchy.sampleContentCount = this.getSampleContentStatusCount(hierarchy);
            return hierarchy;
          });
          this.contributorTextbooks = _.map(contributorTextbooks, content => {
            const contentWithHierarchy =  _.find(hierarchyContent, {identifier: content.identifier});
            content.sampleContentCount = contentWithHierarchy.sampleContentCount;
            return content;
          });
        });
    } else {
      this.contributorTextbooks = contributorTextbooks;
    }
  }
  getSampleContentStatusCount(data) {
    const self = this;
    if (data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit' && data.sampleContent) {
        self.sampleDataCount = self.sampleDataCount + 1;
    }
    const childData = data.children;
    if (childData) {
      childData.map(child => {
        self.getSampleContentStatusCount(child);
      });
    }
    return self.sampleDataCount;
  }
  getCollectionHierarchy(collectionIds) {
    const hierarchyRequest =  _.map(collectionIds, id => {
       const req = {
         url: 'content/v3/hierarchy/' + id,
         param: { 'mode': 'edit' }
       };
       return this.actionService.get(req);
     });
     return forkJoin(hierarchyRequest);
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
  viewContribution(collection) {
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection =  collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.sessionContext.currentRole = 'REVIEWER';
    const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
    this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    this.dynamicInputs = {
      chapterListComponentInput: {
        sessionContext: this.sessionContext,
        collection: collection,
        config: this.configData,
        programContext: this.programContext,
        role: {
          currentRole: 'REVIEWER'
        }
      }
    };
    this.programStageService.addStage('chapterListComponent');
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
       this.showRequestChangesPopup = false;
       setTimeout(() => {
         this.router.navigate(['/sourcing/nominations/' + this.programId]);
       });
        this.toasterService.success(this.resourceService.messages.smsg.m0010);
     },
     (err) => {
       this.showRequestChangesPopup = false;
       setTimeout(() => {
         this.router.navigate(['/sourcing/nominations/' + this.programId]);
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
  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
