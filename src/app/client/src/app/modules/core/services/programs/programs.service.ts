import { IProgram } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, skipWhile } from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService, HttpOptions } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError, merge } from 'rxjs';
import * as _ from 'lodash-es';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../content/content.service';
import { DatePipe } from '@angular/common';
import * as alphaNumSort from 'alphanum-sort';

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
  private _contentTypes: any[];

  constructor(config: ConfigService, http: HttpClient, private publicDataService: PublicDataService,
    private orgDetailsService: OrgDetailsService, private userService: UserService,
    private extFrameworkService: ExtPluginService, private datePipe: DatePipe,
    private contentService: ContentService, private router: Router,
    private toasterService: ToasterService, private resourceService: ResourceService) {
      super(http);
      this.config = config;
      this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
    }

  /**
   * initializes the service is the user is logged in;
   */
  public initialize() {
    this.enableContributeMenu().subscribe();
    this.getAllContentTypes().subscribe();
  }

  /**
   * Function used to serach user or org in registry
   */
  searchRegistry(reqData) {
    const option = {
      url: 'reg/search',
      data:
      {
        id : 'open-saber.registry.search',
        request: reqData
      }
    };

    return this.contentService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.params.status !== 'SUCCESSFUL') {
          return throwError(data);
        }
        return of(data);
      }));
  }

  /**
   * Function used to add user or org in registry
  */
  addToRegistry(reqData) {
    const option = {
      url: 'reg/add',
      data:
      {
        id : 'open-saber.registry.create',
        request: reqData
      }
    };

    return this.contentService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.params.status !== 'SUCCESSFUL') {
          return throwError(data);
        }
        return of(data);
      }));
  }

/**
  * Function used map the user with user role in registry
  */
 mapUsertoContributorOrgReg (orgOsid, UserOsid) {
  // Check if user is alredy part of the orgnisation

  if (!_.isEmpty(this.userService.userProfile.userRegData.User_Org)) {
    const userOrg = this.userService.userProfile.userRegData.User_Org;

    if (userOrg.orgId && userOrg.orgId === orgOsid) {
      this.toasterService.warning(this.resourceService.messages.emsg.contributorjoin.m0002);
      this.router.navigate(['contribute/myenrollprograms']);
      return false;
    }

    if (userOrg.orgId && userOrg.orgId !== orgOsid) {
      this.toasterService.warning(this.resourceService.messages.emsg.contributorjoin.m0003);
      this.router.navigate(['contribute/myenrollprograms']);
      return false;
    }
  }

  const userOrgAdd = {
    User_Org: {
      userId: UserOsid,
      orgId: orgOsid,
      roles: ['user']
    }
  };

  this.addToRegistry(userOrgAdd).subscribe(
      (res) => {
        this.toasterService.success(this.resourceService.messages.smsg.contributorjoin.m0001);
        this.userService.openSaberRegistrySearch().then(() => {
          this.router.navigate(['contribute/myenrollprograms']);
        }).catch((err) => {
          this.toasterService.error('Please Try Later...');
          setTimeout(() => {
            this.router.navigate(['contribute/myenrollprograms']);
          });
        });
      },
      (error) => {
        this.toasterService.error(this.resourceService.messages.fmsg.contributorjoin.m0002);
        this.router.navigate(['contribute/myenrollprograms']);
      }
    );
  }

  /**
   * logic which decides if user is with join link shoule we add him to the organisation or not
   */
  addUsertoContributorOrg(orgId) {
      // Check if organisation exists

      const orgSearch = {
        entityType: ['Org'],
        filters: {
          osid: {eq : orgId}
        }
      };
      this.searchRegistry(orgSearch).subscribe(
        (response) => {
          if (_.isEmpty(response.result.Org)) {
            this.toasterService.warning(this.resourceService.messages.emsg.contributorjoin.m0001);
            return false;
          }

          const contibutorOrg = response.result.Org[0];
          const orgOsid = contibutorOrg.osid;
          if (!this.userService.userProfile.userRegData.User) {
            // Add user to the registry
            const userAdd = {
              User: {
                firstName: this.userService.userProfile.firstName,
                lastName: this.userService.userProfile.lastName || '',
                userId: this.userService.userProfile.identifier,
                enrolledDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
                board : contibutorOrg.board,
                medium: contibutorOrg.medium,
                gradeLevel: contibutorOrg.gradeLevel,
                subject: contibutorOrg.subject
              }
            };

            this.addToRegistry(userAdd).subscribe(
                (res) => {
                    this.mapUsertoContributorOrgReg(orgOsid, res.result.User.osid);
                },
                (error) => {}
            );
          } else {

            this.mapUsertoContributorOrgReg(orgOsid, this.userService.userProfile.userRegData.User.osid);
          }
        },
        (err) => {
          console.log(err);
          // TODO: navigate to program list page
          const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
          this.toasterService.warning(errorMes || this.resourceService.messages.fmsg.contributorjoin.m0001);
        }
      );
  }

  /**
   * logic which decides whether or not to show contribute tab menu
   */
  enableContributeMenu(): Observable<boolean> {
    return combineLatest([this.userService.userData$, this.orgDetailsService.getCustodianOrgDetails()])
      .pipe(
        mergeMap(([userData, custodianOrgDetails]) => {
          return iif(() => _.get(userData, 'userProfile.rootOrgId') === _.get(custodianOrgDetails, 'result.response.value') ||
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

  /*
  * Logic to decide if the All programs should be shown to the contributor
  */
  checkforshowAllPrograms() {
    if (this.userService.userRegistryData &&
      !_.isEmpty(this.userService.userProfile.userRegData.User_Org) &&
      !this.userService.userProfile.userRegData.User_Org.roles.includes('admin')) {
        return false;
    }

    return true;
  }

  /**
   * makes api call to save the program
   */
  createProgram(request): Observable<ServerResponse> {
    const req = {
      url: this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CREATE,
      data: {
        request
      }
    };

    return this.API_URL(req);
  }

  /**
   * makes api call to get the textbooks for program
   */
  getCollectionList(request): Observable<ServerResponse> {
    return this.http.post('learner/composite/v1/search', request).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return throwError(data);
        }
        return of(data);
      }));
  }

  /**
   * makes api call to get the textbooks for program
   */
  updateProgramCollection(request): Observable<ServerResponse> {

    const req = {
      url: 'program/v1/collection/link',
      data: {
        request
      }
    };

    return this.API_URL(req);
  }

  copyCollectionForPlatform(request): Observable<ServerResponse> {
    const req = {
      url: `program/v1/collection/copy`,
      data: {
        request
      }
    };
    return this.API_URL(req);
  }

  /**
   * makes api call to get the textbooks for program
   */
  updateProgram(request): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.UPDATE}`,
      data: {
        request
      }
    };

    return this.API_URL(req);
  }

  updateNomination(request) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_UPDATE}`,
      data: request
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
          rootOrgId: _.get(this.userService, 'userProfile.rootOrgId')
        }
      }
    };
    return this.extFrameworkService.post(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getMyProgramsForOrg(status): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
      data: {
        request: {
          filters: {
            rootorg_id: _.get(this.userService, 'userProfile.rootOrgId'),
            status: status
          }
        }
      }
    };
    return this.API_URL(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getAllProgramsByType(type, status): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
      data: {
        request: {
          filters: {
            type: type,
            status: status
          }
        }
      }
    };
    return this.API_URL(req);
  }

  /**
   * makes api call to get list of programs from ext framework Service
   */
  getMyProgramsForContrib(req): Observable<ServerResponse> {
        const request  = {
          url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
          data: req
        };
        return this.API_URL(request);
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

  getNominationList(reqFilters) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: reqFilters
        }
      }
    };
    return this.API_URL(req);
  }

  /**
   * Get all the content types configured
   */

  get contentTypes() {
    return _.cloneDeep(this._contentTypes);
  }

  private getAllContentTypes(): Observable<any[]> {
    const option = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CONTENTTYPE_LIST}`,
    };

    return this.get(option).pipe(
      map(result => _.get(result, 'result.contentType')),
      catchError(err => of([]))
    ).pipe(
      tap(contentTypes => {
        this._contentTypes = contentTypes;
      })
    );
  }

  /**
   * Get program content types
   */
  getContentTypesName(programContentType) {
    const selectedContentTypes = [];
    _.forEach(programContentType, (contentType) => {
      const found = _.find(this._contentTypes, (contentTypeObj) => {
        return contentTypeObj.value === contentType;
      });
      if (found) {
        selectedContentTypes.push(found.name);
      }
    });
    return selectedContentTypes.length ? _.join(selectedContentTypes, ', ') : '-';
  }

  isNotEmpty(obj, key) {
   if (_.isNil(obj) || _.isNil(obj[key])) {
     return false;
   }
   return true;
  }

  private sort(a, b, column) {
   if (!this.isNotEmpty(a, column) || !this.isNotEmpty(b, column)) {
     return 1;
   }
   let aColumn = a[column];
   let bColumn = b[column];
   if (_.isArray(aColumn)) {
     aColumn = _.join(aColumn, ', ');
   }
   if (_.isArray(bColumn)) {
     bColumn = _.join(bColumn, ', ');
   }
   if (_.isNumber(aColumn)) {
    aColumn = _.toString(aColumn);
  }
  if (_.isNumber(bColumn)) {
   bColumn = _.toString(bColumn);
  }
   return bColumn.localeCompare(aColumn);
  }

  sortCollection(collection, column, direction) {
   if (!collection.length) {
     return collection;
   }

   if (direction === 'asc' || direction === '') {
     return collection.sort((a, b) => {
       return this.sort(b, a, column);
     });
   } else {
    return collection.sort((a, b) => {
       return this.sort(a, b, column);
     });
   }
  }
}
