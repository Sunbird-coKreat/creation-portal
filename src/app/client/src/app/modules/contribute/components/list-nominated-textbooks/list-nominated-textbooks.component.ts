import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Observable, of } from 'rxjs';
import { ResourceService, ConfigService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, PublicDataService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { map, catchError, retry } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgramStageService } from '../../services/';
import { ProgramComponentsService} from '../../services/program-components/program-components.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { programContext, sessionContext, configData, collection } from './data';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';

@Component({
  selector: 'app-list-contributor-textbooks',
  templateUrl: './list-nominated-textbooks.component.html',
  styleUrls: ['./list-nominated-textbooks.component.scss']
})
export class ListNominatedTextbooksComponent implements OnInit, AfterViewInit {

  public contributor;
  public contributorTextbooks;
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

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private config: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient) { }

  ngOnInit() {
  this.contributor = {'name': 'Nitesh Kesarkar', 'type': 'Organisation', 'nominationStatus': 'Pending'};
  this.getProgramTextbooks();
  this.programContext = programContext;
  this.sessionContext = sessionContext;
  this.configData = configData;
  this.collection = collection;
  }

  getProgramTextbooks() {
     const option = {
      url: 'learner/composite/v1/search',
       data: {
      request: {
         filters: {
          objectType: 'content',
          programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1',
          status: ['Draft', 'Live'],
          contentType: 'Textbook',
          framework: 'NCFCOPY',
          board:	'NCERT',
          medium:	['English']
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
}
