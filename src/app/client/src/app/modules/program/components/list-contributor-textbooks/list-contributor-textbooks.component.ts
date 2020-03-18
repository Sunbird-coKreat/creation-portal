import { IImpressionEventInput} from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService } from '../../services/';
import { ProgramComponentsService} from '../../services/program-components/program-components.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { programContext, sessionContext, configData, collection } from './data';
import { tap, filter, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-contributor-textbooks',
  templateUrl: './list-contributor-textbooks.component.html',
  styleUrls: ['./list-contributor-textbooks.component.scss']
})
export class ListContributorTextbooksComponent implements OnInit, AfterViewInit {

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
  @ViewChild('FormControl') FormControl: NgForm;

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private userService: UserService,
    private config: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient,
  public toasterService: ToasterService) { }

  ngOnInit() {
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.activatedRoute.fragment.pipe(map(fragment => fragment || 'None')).subscribe((frag) => {
      this.selectedNominationDetails = frag;
    });
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.getProgramTextbooks();
      this.programContext = programContext;
      this.sessionContext = sessionContext;
      this.configData = configData;
      this.collection = collection;
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
    });
    this.contributor = {'name': 'Pratham', 'type': 'Organisation', 'nominationStatus': 'Pending'};
  }

  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
    }));
  }

  getProgramTextbooks() {
     const option = {
      url: 'learner/composite/v1/search',
       data: {
      request: {
         filters: {
          objectType: 'content',
          programId: this.programId,
          status: ['Draft', 'Live'],
          contentType: 'Textbook',
          framework: this.programDetails.config.framework,
          board:	this.programDetails.config.board,
          medium:	this.programDetails.config.medium,
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

   updateNomination(status) {
    let nominationStatus;
    (status === 'accept') ? (nominationStatus = 'Approved') : (nominationStatus = 'Rejected');
     const option = {
       url: this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_UPDATE,
       data: {
         request: {
           program_id: this.programId,
           user_id: this.selectedNominationDetails.userData.identifier,
           status: nominationStatus,
           updatedby: this.userService.userProfile.userId
         }
       }
     };
     if (nominationStatus === 'Rejected') {
       if (this.FormControl.value.rejectComment) {
         option.data.request['feedback'] = this.FormControl.value.rejectComment;
       } else {
         return;
       }
      }
     this.programsService.updateNomination(option).subscribe((res) => {
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
}
