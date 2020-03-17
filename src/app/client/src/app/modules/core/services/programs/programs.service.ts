import { IProgram } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, skipWhile } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService, HttpOptions} from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, throwError as observableThrowError, BehaviorSubject, throwError, merge } from 'rxjs';
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

  headers: {
    'content-type': 'application/json'
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZThlNmU5MjA4YjI0MjJmOWFlM2EzNjdiODVmNWQzNiJ9.gvpNN7zEl28ZVaxXWgFmCL6n65UJfXZikUWOKSE8vJ8',
    'X-Authenticated-User-Token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1WXhXdE4tZzRfMld5MG5PS1ZoaE5hU0gtM2lSSjdXU25ibFlwVVU0TFRrIn0.eyJqdGkiOiI1YTcyYzcwYi1hYzdlLTQxYmItYTVhMi1lZmRiZWU3ZDBkYmUiLCJleHAiOjE1ODQ1MzQxNDEsIm5iZiI6MCwiaWF0IjoxNTg0MzYxMzQxLCJpc3MiOiJodHRwczovL2Rldi5zdW5iaXJkZWQub3JnL2F1dGgvcmVhbG1zL3N1bmJpcmQiLCJzdWIiOiJmOjVhOGEzZjJiLTM0MDktNDJlMC05MDAxLWY5MTNiYzBmZGUzMTo4NDU0Y2IyMS0zY2U5LTRlMzAtODViNS1mYWRlMDk3ODgwZDgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhZG1pbi1jbGkiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiI3NjNjZmEyMi01NzQyLTQyZmMtYTk1ZC0yNzA0ZDUxZjc2ZjQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vZGV2LmNlbnRyYWxpbmRpYS5jbG91ZGFwcC5henVyZS5jb20vIiwiaHR0cDovL2Rldi5jZW50cmFsaW5kaWEuY2xvdWRhcHAuYXp1cmUuY29tLyJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwic2NvcGUiOiIiLCJuYW1lIjoiTWVudG9yIEZpcnN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJudHB0ZXN0MTA0IiwiZ2l2ZW5fbmFtZSI6Ik1lbnRvciBGaXJzdCIsImZhbWlseV9uYW1lIjoiVXNlciIsImVtYWlsIjoidXMqKioqKioqKkB0ZXN0c3MuY29tIn0.O4qydQ3K2Rm0dhE-GlzlA_D9eQVeu702K7blBzRKmu6I7ockmQxCM9Vh60ubJy2F3leCTjlD2_7fFxo_Ct_X6YWrkil2RkTiqj1sBuuMXNTpql407u1hIAcAbyLhphs3_wEGDH9kp7GHQn7oxIkGD5SatL4CVcl_K55gkBSdO-IsddPF01z17xPj5v0YofJ2YTXkB4h6g2eFSwtJ7g9vWse7-CZtQm7FG01nqTjb7-4PXAL7bNxkI2a3B6N6z1QtZDWOsohYPVVyeagjk3lhfhyodG2nvHI2Ohw8-F6jD_eMGRjD41PhGHOuF1irjapV8rU4BsS2eWlf0ERWEREp1A',
    'observe': 'response'
  };

  httpOptions: HttpOptions = {
    headers: this.headers
  };

  constructor(config: ConfigService, http: HttpClient, private extFrameworkService: ExtPluginService, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private userService: UserService,
    private router: Router, private toasterService: ToasterService, private resourceService: ResourceService) {
      super(http);
      this.config = config;
      this.baseUrl = 'http://localhost:6000';
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
      url: '/program/v1/create',
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request
      }
    };

    return this.post(req);
  }

   /**
   * makes api call to get the textbooks for program
   */
  getProgramCollection(request): Observable<ServerResponse> {
    return this.http.post('http://localhost:3000/content/composite/v1/search', request, this.httpOptions).pipe(
      mergeMap(({body, headers}: any) => {
        console.log(body);
        // replace ts time with header date , this value is used in telemetry
        if (body.responseCode !== 'OK') {
          return observableThrowError(body);
        }
        return of(body);
      }));
  }

  /**
   * makes api call to get the textbooks for program
   */
  updateProgram(request): Observable<ServerResponse> {
    const req = {
      url: '/program/v1/update',
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request
      }
    };

    return this.post(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  searchProgramsAPICall(): Observable<ServerResponse> {
    const req = {
      url: _.get(this.configService, 'urlConFig.URLS.CONTRIBUTION_PROGRAMS.SEARCH'),
      param: _.get(this.configService, 'urlConFig.params.programSearch'),
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
      url: '/program/v1/list',
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request: {
          rootorg_id: _.get(this.userService, 'userProfile.rootOrg.rootOrgId')
        }
      }
    };
    return this.post(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getAllProgramsByType(type): Observable<ServerResponse> {
    const req = {
      url: '/program/v1/list',
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request: {
          type: type
        }
      }
    };
    return this.post(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getMyProgramsForContribFromApi(): Observable<ServerResponse> {
    const req = {
      url: '/program/v1/list',
      headers: {
        'content-type' : 'application/json'
      },
      data: {
        request: {
          "userId": _.get(this.userService, 'userProfile.userId')
        }
      }
    };
    return this.post(req);
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
    return iif(() => !this.userService.loggedIn, of(false), this.allowToContribute$.pipe(
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
  public getMyProgramsForOrg(): Observable<IProgram[]> {
    let list = [];
    let mergeObj = this.getApiSampleObj();
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10)

    return this.getMyProgramsForOrgFromApi().pipe(
      map(result => {
        _.forEach(_.get(result, 'result'), function(program) {
          list.push({...program, ...mergeObj});
        });
        return list;
      }),
      catchError(err => {
        console.log("getMyProgramsForOrg", err);
        return of([])
      })
    );
  }

  /**
   * gets list of programs
   */
  public getAllProgramsForContrib(type): Observable<IProgram[]> {
    let list = [];
    let mergeObj = this.getApiSampleObj();
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10)

    return this.getAllProgramsByType(type).pipe(
      map(result => {
        _.forEach(_.get(result, 'result'), function(program) {
          list.push({...program, ...mergeObj});
        });
        return list;
      }),
      catchError(err => {
        console.log("getAllProgramsForContrib", err);
        return of([])
      })
    );
  }

  /**
   * gets list of programs
   */
  public getMyProgramsForContrib(): Observable<IProgram[]> {
    let list = [];
    let mergeObj = this.getApiSampleObj();
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10)

    return this.getMyProgramsForContribFromApi().pipe(
      map(result => {
        _.forEach(_.get(result, 'result'), function(program) {
          list.push({...program, ...mergeObj});
        });
        return list;
      }),
      catchError(err => {
        console.log("getAllProgramsForContrib", err);
        return of([])
      })
    );
  }

  /**
   * get api obj sample
   */
  private getApiSampleObj() {
   return {
      textbooks: [
        { id: "1", name: "Textbook 1" },
        { id: "2", name: "Textbook 2" },
        { id: "3", name: "Textbook 3" }
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

  /**
   * Get the association data for B M G S
   */
  getAssociationData(selectedData: Array<any>, category: string, frameworkCategories) {
    // Getting data for selected parent, eg: If board is selected it will get the medium data from board array
    let selectedCategoryData = [];
    _.forEach(selectedData, (data) => {
      const categoryData = _.filter(data.associations, (o) => {
        return o.category === category;
      });
      if (categoryData) {
        selectedCategoryData = _.concat(selectedCategoryData, categoryData);
      }
    });

    // Getting associated data from next category, eg: If board is selected it will get the association data for medium
    let associationData;
    _.forEach(frameworkCategories, (data) => {
      if (data.code === category) {
        associationData = data.terms;
      }
    });

    // Mapping the final data for next drop down
    let resultArray = [];
    _.forEach(selectedCategoryData, (data) => {
      const codeData = _.find(associationData, (element) => {
        return element.code === data.code;
      });
      if (codeData) {
        resultArray = _.concat(resultArray, codeData);
      }
    });

    return _.sortBy(_.unionBy(resultArray, 'identifier'), 'index');
  }
}
