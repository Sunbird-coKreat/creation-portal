import { IProgram } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, skipWhile } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError, merge } from 'rxjs';
import * as _ from 'lodash-es';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService implements CanActivate {

  private _programsList$ = new BehaviorSubject(undefined);
  private _allowToContribute$ = new BehaviorSubject(undefined);

  public readonly programsList$ = this._programsList$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

  public readonly allowToContribute$ = this._allowToContribute$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

  constructor(private extFrameworkService: ExtPluginService, private configService: ConfigService,
    private orgDetailsService: OrgDetailsService, private userService: UserService,
    private router: Router, private toasterService: ToasterService, private resourceService: ResourceService) { }


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
  public getProgramsForOrg(): Observable<IProgram[]> {
    let list = [];
    let mergeObj = {
      textbooks: [ 
        { id: "1", name: "Textbook 1" },
        { id: "2", name: "Textbook 2" },
        { id: "3", name: "Textbook 3" }
      ],
      grades: [ 
        { id: "1", name: "Grade 1" },
        { id: "2", name: "Grade 2" },
        { id: "3", name: "Grade 3" }
      ],
      mediums: [ 
        { id: "1", name: "Marathi" },
        { id: "2", name: "English" },
        { id: "3", name: "Kannada" }
      ],
      subjects: [ 
        { id: "1", name: "Mathematics" },
        { id: "2", name: "Science" },
        { id: "3", name: "Geography" }
      ],
      nominations: {
        pending: 5,
        approved: 8,
        rejected: 2
      },
      program_end_date: '',
      nomination_end_date: '',
      nomination_shortlisting_date: '',
      curation_end_date: '',
    };

    return this.searchProgramsAPICall().pipe(
      map(result => {
        _.forEach(_.get(result, 'result.programs'), function(program) {
          list.push({...program, ...mergeObj});
        });
        return list;
      }),
      catchError(err => {
        console.log("getProgramsForOrg", err);
        this.toasterService.warning(err);
        return of([])
      })
    );
  }
}