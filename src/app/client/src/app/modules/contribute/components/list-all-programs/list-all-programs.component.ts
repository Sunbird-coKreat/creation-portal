import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Observable, of } from 'rxjs';
import { ResourceService, ConfigService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { map, catchError, retry } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramStageService } from '../../services/';
import { ProgramComponentsService} from '../../services/program-components/program-components.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { programContext, sessionContext, configData, collection } from './data';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
@Component({
  selector: 'app-list-all-programs',
  templateUrl: './list-all-programs.component.html',
  styleUrls: ['./list-all-programs.component.scss']
})
export class ListAllProgramsComponent implements OnInit, AfterViewInit {

  public programsList$;
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

  constructor(private programsService: ProgramsService, public resourceService: ResourceService, public userService: UserService,
    private config: ConfigService, private publicDataService: PublicDataService, public programStageService: ProgramStageService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService,
    public activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.programsList$ = this.getProgramsList();
    this.programContext = programContext;
    this.sessionContext = sessionContext;
    this.configData = configData;
    this.collection = collection;

  }

  /**
   * fetch the list of programs.
   */
  private getProgramsList() {
    return this.programsService.programsList$.pipe(
      map(programs => {
        _.forEach(programs, async (program) => {
          if (!_.get(program, 'rootOrgName')) {
            program['rootOrgName'] = await this.getRootOrgName(_.get(program, 'rootOrgId')).toPromise();
          }
        });
        return programs;
      })
    );
  }

  /**
   * returns the orgName for the provided rootOrgId.
   * @param rootOrgId
   */
  private getRootOrgName(rootOrgId): Observable<string> {
    return this.getOrgDetails(rootOrgId).pipe(
      map(orgDetailsApiResponse => {
        const orgDetails = _.get(orgDetailsApiResponse, 'result.response.content');
        return _.join(_.map(orgDetails, 'orgName'), ',');
      }),
      retry(1),
      catchError(err => {
        return of('');
      })
    );
  }

  /**
   * makes api call to get orgDetails.
   * @param rootOrgId
   */
  private getOrgDetails(rootOrgId): Observable<ServerResponse> {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: {
            id: [rootOrgId],
          }
        }
      }
    };
    return this.publicDataService.post(option);
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.config.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.activeRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  public getTelemetryInteractEdata(id: string): IInteractEventEdata {
    return {
      id,
      type: 'click',
      pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid')
    };
  }

  public getTelemetryInteractObject(id: string): IInteractEventObject {
    return {
      id,
      type: 'Program',
      ver: '1.0'
    };
  }

  getFeatureId(featureId, taskId) {
    return [{ id: featureId, type: 'Feature' }, { id: taskId, type: 'Task' }];
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
