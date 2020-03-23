import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { tap, first } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgramStageService } from '../../services/';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { programContext, sessionContext, configData, collection } from './data';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { ISessionContext } from '../../interfaces';
import * as moment from 'moment';

@Component({
  selector: 'app-list-contributor-textbooks',
  templateUrl: './list-nominated-textbooks.component.html',
  styleUrls: ['./list-nominated-textbooks.component.scss']
})
export class ListNominatedTextbooksComponent implements OnInit, AfterViewInit {

  public contributor;
  public contributorTextbooks: any = [];
  public noResultFound;
  public telemetryImpression: IImpressionEventInput;
  public component: any;
  public sessionContext: ISessionContext = {};
  public programContext: any = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public dynamicInputs;
  collection;
  configData;
  showChapterList = false;
  public currentNominationStatus: any;
  public nominated = false;
  public programId: string;
  public programDetails: any;
  public mediums: any;
  public grades: any;
  public userProfile: any;
  public activeDate = '';

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private configService: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  public toasterService: ToasterService, private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient,
  public frameworkService: FrameworkService, public userService: UserService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
   }

  ngOnInit() {
  this.contributor = {'name': 'Nitesh Kesarkar', 'type': 'Organisation', 'nominationStatus': 'Pending'};
  this.getProgramDetails();
  this.getProgramTextbooks();
  this.programContext = programContext;
  this.sessionContext = sessionContext;
  this.configData = configData;
  this.collection = collection;
  this.getNominationStatus();
  }

  getProgramDetails() {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
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

  getProgramTextbooks() {
     const option = {
      url: 'learner/composite/v1/search',
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
      (res) => this.showTexbooklist(res),
      (err) => console.log(err)
    );
  }

  showTexbooklist (res) {
    this.contributorTextbooks = res.result.content;
  }

  ngAfterViewInit() {

  }

  viewContribution() {
  this.component = ChapterListComponent;
  //   this.programContext.programId = this.programId;
  this.dynamicInputs = {
  // tslint:disable-next-line:max-line-length
  chapterListComponentInput :  {
  sessionContext: this.sessionContext,
  collection: this.collection,
  config: this.configData,
  programContext: this.programContext,
  role: {
    currentRole: 'REVIEWER'
  }
  }
   };
  this.showChapterList = true;
  this.programStageService.addStage('chapterListComponent');
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


  getNominationStatus() {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId,
            user_id: this.userService.userProfile.userId,
          }
        }
      }
    };
    this.programsService.post(req).subscribe((data) => {
      if (data.result && !_.isEmpty(data.result)) {
        this.nominated = true;
        this.currentNominationStatus =  _.get(_.first(data.result), 'status');
      }
    }, error => {
      this.toasterService.error('Failed fetching current nomination status');
    });
  }
}
