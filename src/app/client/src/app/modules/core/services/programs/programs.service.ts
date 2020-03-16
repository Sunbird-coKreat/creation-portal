import { IProgram } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, skipWhile } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError, merge } from 'rxjs';
import * as _ from 'lodash-es';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService extends DataService implements CanActivate {

  private _programsList$ = new BehaviorSubject(undefined);
  private _allowToContribute$ = new BehaviorSubject(undefined);

  public readonly programsList$ = this._programsList$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

  public readonly allowToContribute$ = this._allowToContribute$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;
  private API_URL = this.publicDataService.post; // TODO: remove API_URL once service is deployed

  constructor(config: ConfigService, http: HttpClient, private publicDataService: PublicDataService,
    private orgDetailsService: OrgDetailsService, private userService: UserService, private extFrameworkService: ExtPluginService,
    private router: Router, private toasterService: ToasterService, private resourceService: ResourceService) {
      super(http);
      this.config = config;
      this.baseUrl = this.config.urlConFig.URLS.PUBLIC_PREFIX;
    }

  /**
   * initializes the service is the user is logged in;
   */
  public initialize() {
    this.enableContributeMenu().subscribe();
  }

  /**
   * logic which decides whether or not to show contribute tab menu
   */
  enableContributeMenu(): Observable<boolean> {
    return combineLatest([this.userService.userData$, this.orgDetailsService.getCustodianOrgDetails()])
      .pipe(
        mergeMap(([userData, custodianOrgDetails]) => {
          return iif(() => _.get(userData, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrgDetails, 'result.response.value') ||
            !_.get(userData, 'userProfile.stateValidated'),
            of(false),
            this.moreThanOneProgram());
        }),
        retry(1),
        catchError(err => {
          console.error(err);
          return of(false);
        }),
        tap(allowedToContribute => {
          this._allowToContribute$.next(allowedToContribute);
        })
      );
  }

  /**
   * makes api call to save the program
   */
  createProgram(request): Observable<ServerResponse> {
    const req = {
      url: this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CREATE,
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request
      }
    };

    return this.API_URL(req);
  }

   /**
   * makes api call to get the textbooks for program
   */
  getProgramCollection(request): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.COMPOSITE.SEARCH}`,
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request
      }
    };
    console.log(req);
    return this.API_URL(req);
  }

  /**
   * makes api call to get the textbooks for program
   */
  updateProgram(request): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.UPDATE}`,
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request
      }
    };

    return this.API_URL(req);
  }
  /**
   * makes api call to get list of programs from ext framework Service
   */
  searchProgramsAPICall(): Observable<ServerResponse> {
    const req = {
      url: _.get(this.config, 'urlConFig.URLS.CONTRIBUTION_PROGRAMS.SEARCH'),
      param: _.get(this.config, 'urlConFig.params.programSearch'),
      data: {
        request: {
          rootOrgId: _.get(this.userService, 'userProfile.rootOrg.rootOrgId')
        }
      }
    };
    return this.extFrameworkService.post(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getMyProgramsForOrgFromApi(): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request: {
          filters: {
            rootorg_id: _.get(this.userService, 'userProfile.rootOrg.rootOrgId')
          }
        }
      }
    };
    return this.API_URL(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getAllProgramsByType(type): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request: {
          filters: {
            type: type
          }
        }
      }
    };
    return this.API_URL(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getMyProgramsForContribFromApi(): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request: {
          filters: {
            'userId': _.get(this.userService, 'userProfile.userId')
          }
        }
      }
    };
    return this.API_URL(req);
  }

  /**
   * gets list of programs
   */
  private getPrograms(): Observable<IProgram[]> {
    return this.searchProgramsAPICall().pipe(
      map(result => _.get(result, 'result.programs')),
      catchError(err => of([]))
    );
  }

  /**
   * filters out programs which are open to enrollment
   */
  private filterPublicPrograms(): Observable<IProgram> {
    return this.getPrograms().pipe(
      map(programs => _.filter(programs, { type: 'public' })),
      tap(programs => {
        this._programsList$.next(programs);
      })
    );
  }

  /**
   * returns true if more than one programs exists else false
   */
  private moreThanOneProgram(): Observable<boolean> {
    return this.filterPublicPrograms().pipe(
      map(programs => !_.isEmpty(programs))
    );
  }

  /**
   * auth guard to prevent unauthorized access to the route
   */
  canActivate(): Observable<boolean> {
    return iif(() => !this.userService.loggedIn, of(false), of(true).pipe(
      tap(allow => {
        if (!allow) {
          this.toasterService.warning(this.resourceService.messages.imsg.m0035);
          this.router.navigate(['learn']);
        }
      })
    )
    );
  }

  /**
   * gets list of programs
   */
  public getMyProgramsForOrg(): Observable<any> {
    const list = [];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);

    return this.getMyProgramsForOrgFromApi();
  }

  /**
   * gets list of programs
   */
  public getAllProgramsForContrib(type): Observable<any> {
    const list = [];
    const mergeObj = this.getApiSampleObj();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);

    return this.getAllProgramsByType(type);
  }

  /**
   * gets list of programs
   */
  public getMyProgramsForContrib(): Observable<any> {
    const list = [];
    const mergeObj = this.getApiSampleObj();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);

    return this.getMyProgramsForContribFromApi();
  }

  /**
   * get api obj sample
   */
  private getApiSampleObj() {
   return {
      textbooks: [
        { id: '1', name: 'Textbook 1' },
        { id: '2', name: 'Textbook 2' },
        { id: '3', name: 'Textbook 3' }
      ],
      nominations: {
        pending: 0,
        approved: 0,
        rejected: 0
      },
      nomination_status: 'Pending',
      contribution_date: this.getFutureDate(-1),
      nomination_end_date: this.getFutureDate(-5),
      nomination_shortlisting_date: this.getFutureDate(0),
      curation_end_date: this.getFutureDate(1),
      program_end_date: this.getFutureDate(10),
    };
  }

  /**
   * get future date
   */
  private getFutureDate(days) {
    return new Date((new Date()).getTime() + (days * 86400000));
  }
}
