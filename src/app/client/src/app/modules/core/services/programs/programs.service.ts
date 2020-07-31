import { IProgram } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, skipWhile, switchMap} from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService, HttpOptions } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError, merge, forkJoin} from 'rxjs';
import * as _ from 'lodash-es';
import { CanActivate, Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../content/content.service';
import { DatePipe } from '@angular/common';
import { LearnerService } from '../learner/learner.service';
import { RegistryService } from '../registry/registry.service';
import { ExportToCsv } from 'export-to-csv';
import { CacheService } from 'ng2-cache-service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService extends DataService implements CanActivate {

  private _programsList$ = new BehaviorSubject(undefined);
  // private _allowToContribute$ = new BehaviorSubject(undefined);
  private _organisations = {};

  public readonly programsList$ = this._programsList$.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));

  // public readonly allowToContribute$ = this._allowToContribute$.asObservable()
  //   .pipe(skipWhile(data => data === undefined || data === null));

  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;
  private API_URL = this.publicDataService.post; // TODO: remove API_URL once service is deployed

  private _contentTypes: any[];
  private _sourcingOrgReviewers: Array<any>;
  // private orgUsers: Array<any>;

  constructor(config: ConfigService, http: HttpClient, private publicDataService: PublicDataService,
    private orgDetailsService: OrgDetailsService, private userService: UserService,
    private extFrameworkService: ExtPluginService, private datePipe: DatePipe,
    private contentService: ContentService, private router: Router,
    private toasterService: ToasterService, private resourceService: ResourceService,
    public learnerService: LearnerService, private registryService: RegistryService,
    public cacheService: CacheService) {
      super(http);
      this.config = config;
      this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
    }

  /**
   * initializes the service is the user is logged in;
   */
  public initialize() {
    // this.enableContributeMenu().subscribe();
    this.getAllContentTypes().subscribe();
    this.mapSlugstoOrgId();
  }

  mapSlugstoOrgId () {
    const urlSlug = this.userService.slug;
    if (urlSlug && _.isEmpty(this._organisations[urlSlug])) {
     const orgFilters = {
         slug: urlSlug,
         isRootOrg: true
     };

     this.getOrganisationDetails(orgFilters).subscribe
     ((data: ServerResponse) => {
       if (data.result && _.get(data, 'result.response.count')) {
         const organisationDetails = _.get(data, 'result.response.content');
         this._organisations[urlSlug] = organisationDetails[0].identifier;
       }
     },
     (err: ServerResponse) => {
       console.log('error while fetching the org details');
     }
     );
   }
  }
  /**
   * Function used to search user or org in registry
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
  // Check if user is already part of the organisation

  if (this.userService.userRegistryData && !_.isEmpty(this.userService.userProfile.userRegData.User_Org)) {
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
        this.userService.openSaberRegistrySearch().then((userRegData) => {
          this.userService.userProfile.userRegData = userRegData;
          this.router.navigateByUrl('/contribute/myenrollprograms');
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
                enrolledDate: new Date().toISOString(),
                board : contibutorOrg.board,
                medium: contibutorOrg.medium,
                gradeLevel: contibutorOrg.gradeLevel,
                subject: contibutorOrg.subject
              }
            };

            this.addToRegistry(userAdd).subscribe((res) => {
              this.mapUsertoContributorOrgReg(orgOsid, res.result.User.osid);
            }, (error) => {});
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
    return combineLatest([this.userService.userData$])
      .pipe(
        mergeMap(([userData]) => {
          return iif(() => !_.get(userData, 'userProfile.stateValidated'),
            of(false),
            this.moreThanOneProgram());
        }),
        retry(1),
        catchError(err => {
          console.error(err);
          return of(false);
        }),
        tap(allowedToContribute => {
          // this._allowToContribute$.next(allowedToContribute);
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

 /**
   * Logic to get the all the users of sourcing organisation and add it to the same cont org as sourcing admin
   */
  addSourcingUserstoContribOrg(userRegData) {
    let userOrgAdd;
    let userAdd;

    const OrgDetails = this.userService.userProfile.organisations[0];
    const filters = {
      'organisations.organisationId': OrgDetails.organisationId,
      'organisations.roles': ['CONTENT_REVIEWER', 'CONTENT_CREATOR']
      };
    return this.getSourcingOrgUsers(filters).pipe(tap(
      (res) => {
        const sourcingOrgUser =  res.result.response.content;
        _.forEach(sourcingOrgUser, (user) => {

          this.registryService.openSaberRegistrySearch(user.identifier).then((userProfile) => {

            if (_.get(userProfile, 'error') === false) {
              // Add user to the org if not added to any org previously
              if (_.isEmpty(_.get(userProfile, 'user'))) {
                // Add user to the registry
                 userAdd = {
                  User: {
                    firstName: user.firstName,
                    lastName: user.lastName || '',
                    userId: user.identifier,
                    enrolledDate: new Date().toISOString(),
                    channel: user.rootOrgId
                  }
                };

                this.addToRegistry(userAdd).subscribe(
                    (res) => {
                      userOrgAdd = {
                        User_Org: {
                          userId: res.result.User.osid,
                          orgId: userRegData.User_Org.orgId,
                          roles: ['user']
                        }
                      };
                      this.addToRegistry(userOrgAdd).subscribe(
                        (userAddRes) => {console.log("User added to org"+ user.identifier, userAddRes);},
                        (userAddErr) => {console.log("Errro while adding User added to org"+ user.identifier,userAddErr);}
                      );
                    },
                    (error) => {console.log("Errro while adding User added to reg"+ user.identifier, error);}
                );
              } else if (!_.isEmpty(_.get(userProfile, 'user')) && _.isEmpty(_.get(userProfile, 'user_org'))) {
                userOrgAdd = {
                  User_Org: {
                    userId: _.get(userProfile, 'user.osid'),
                    orgId: userRegData.User_Org.orgId,
                    roles: ['user']
                  }
                };
                this.addToRegistry(userOrgAdd).subscribe(
                  (userAddRes) => {console.log("User added to org"+ user.identifier, userAddRes);},
                  (userAddErr) => {console.log("Errro while adding User added to org"+ user.identifier,userAddErr);}
                );
              }
            }
          }).catch((err) => {
            console.log("errr", err);
          });
        });
      }));
  }

  /**
   * Logic add contrib user and org for the sourcing admin and make him its admin
   */
  enableContributorProfileForSourcing (request) {
    this.makeContributorOrgForSourcing().subscribe(
      (res) => {
        this.userService.openSaberRegistrySearch().then((userRegData) => {
          this.userService.userProfile.userRegData = userRegData;

          this.addSourcingUserstoContribOrg(userRegData).subscribe(
            (res) => {
              this.addorUpdateNomination(request).subscribe(
                (res) => { console.log("Nomination added")},
                (err) => { console.log("error added")}
              );
            },
            (error) => {
              console.log("Error while adding users to contribution org");
            }
          );
        }).catch((err) => {
          this.toasterService.error('Fetching contributor profile created for sourcing failed...');
        });
      },
      (error) => {
        this.toasterService.error('Adding contributor profile failed.');
      }
    );
  }

  /**
   * Logic add contrib user and org for the sourcing admin and make him its admin
   */
  makeContributorOrgForSourcing() {
    let userOsId;
    let orgOsId;

    // if user is not added to registry
    if (!this.userService.userProfile.userRegData.User) {
        // Add user to the registry
        const userAdd = {
          User: {
            firstName: this.userService.userProfile.firstName,
            lastName: this.userService.userProfile.lastName || '',
            userId: this.userService.userProfile.identifier,
            enrolledDate: new Date().toISOString(),
            channel: this.userService.userProfile.rootOrgId
          }
        };

        return this.addToRegistry(userAdd).pipe(
          switchMap((res1: any) => {
            userOsId = res1.result.User.osid;
            const orgName = this.userService.userProfile.rootOrgName;
            const orgAdd = {
              Org: {
                name: orgName,
                code: orgName.toUpperCase(),
                createdBy: res1.result.User.osid,
                description: orgName
              }
            };

            return this.addToRegistry(orgAdd);
          }),
          switchMap((res2: any) => {
            orgOsId = res2.result.Org.osid;
            const userOrgAdd = {
              User_Org: {
                userId: userOsId,
                orgId: orgOsId,
                roles: ['admin']
              }
            };
            return this.addToRegistry(userOrgAdd);
          }),
          catchError(err => throwError(err))
        );
    } else if (!this.userService.userProfile.userRegData.User_Org) {
          // Add user to the registry
          userOsId = this.userService.userProfile.userRegData.User.osid;
          const orgName = this.userService.userProfile.rootOrgName;
          const orgAdd = {
            Org: {
              name: orgName,
              code: orgName.toUpperCase(),
              createdBy: userOsId,
              description: orgName
            }
          };
        return this.addToRegistry(orgAdd).pipe(
          switchMap((res1: any) => {
            orgOsId = res1.result.Org.osid;
            const userOrgAdd = {
              User_Org: {
                userId: userOsId,
                orgId: orgOsId,
                roles: ['admin']
              }
            };
            return this.addToRegistry(userOrgAdd);
          }),
          catchError(err => throwError(err))
        );
     }
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
    return this.API_URL(req).pipe(tap((res) => {
      if (res.result.program_id) {
        const programId = res.result.program_id;
        if (request.status === 'Live' || request.status === 'Unlisted') {
          const nomRequest = {
            program_id: programId,
            status: 'Approved',
            content_types: request.programContentTypes,
            collection_ids: request.copiedCollections
          };

        this.userService.openSaberRegistrySearch().then((userRegData) => {
            this.userService.userProfile.userRegData = userRegData;
          if (!this.userService.userProfile.userRegData.User || !this.userService.userProfile.userRegData.User_Org) {
            this.enableContributorProfileForSourcing(nomRequest);
          } else {
            this.addorUpdateNomination(nomRequest).subscribe(
              (res) => { console.log("Nomination added") },
              (err) => { console.log("error added") }
            );
          }
        });
        }
      }
    }));
  }

  publishProgram(request) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.PUBLISH}`,
      data: request
    };
    return this.API_URL(req);
  }

  unlistPublishProgram(request) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.UNLIST_PUBLISH}`,
      data: request
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

  addorUpdateNomination(request: any) {
    // check if nomination for the program already exists by org id
    const filters = {
      program_id: request.program_id,
    };

    if (!_.isEmpty(this.userService.userProfile.userRegData.User_Org)) {
      filters['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
    } else {
      filters['user_id'] = this.userService.userProfile.identifier;
    }

    return this.getNominationList(filters).pipe(
      switchMap((data: any) => {
        const req = {
          url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_ADD}`,
          data: {
            request: request
          }
        };

        if (!_.isEmpty(this.userService.userProfile.userRegData.User_Org)) {
          req.data.request['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
        } else {
          req.data.request['user_id'] = this.userService.userProfile.identifier;
        }

        if (data.result && data.result.length) {
          req['url'] = `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_UPDATE}`;
          req.data.request['updatedby'] = this.userService.userProfile.userRegData.User.osid;
        } else {
          req.data.request['user_id'] = this.userService.userProfile.identifier;
          req.data.request['createdby'] = this.userService.userProfile.userRegData.User.osid;
        }
        return this.post(req);
      }), catchError(err => throwError(err) ));
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
  getMyProgramsForOrg(reqFilters): Observable<ServerResponse> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
      data: {
        request: {
          filters: reqFilters
        }
      }
    };
    return this.API_URL(req);
  }

  /* Get the org details by filters*/
  getOrganisationDetails(filters) {
    const option = {
      url: this.config.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: {
        request: {
          filters: filters
        }
      }
    };

    return this.publicDataService.post(option);
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

    // Check if slug is present in the URL, if yes then fetch the program those slug org only
    const urlSlug = this.userService.slug;
    if (urlSlug && !_.isEmpty(this._organisations[urlSlug])) {
      req.data.request.filters['rootorg_id'] = this._organisations[urlSlug];
      return this.API_URL(req);
    } else {
      return this.API_URL(req);
    }
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

  getOrgUsersDetails(reqFilters, offset?, limit?) {
    const req = {
      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        'request': {
          'filters': reqFilters
        }
      }
    };

    if (!_.isUndefined(limit)) {
      req.data.request['limit'] = limit;
    }
    if (!_.isUndefined(offset)) {
      req.data.request['offset'] = offset;
    }

    return this.learnerService.post(req);
  }

  getSourcingOrgUsers(reqFilters, offset?, limit?) {
      return this.getOrgUsersDetails(reqFilters, offset, limit).pipe(tap((res) => {
        if (reqFilters['organisations.roles'].length === 1 &&  reqFilters['organisations.roles'][0] === 'CONTENT_REVIEWER') {
          this._sourcingOrgReviewers = res.result.response.content;
        }
      }));
    }

  /**
  * Function to update the role of org user
  */
  updateUserRole(osid, newRoles) {
    const userOrgUpdate = {
      User_Org: {
        osid: osid,
        roles: newRoles
      }
    };
    return this.updateToRegistry(userOrgUpdate);
  }

  /**
   * Function used to add user or org in registry
  */
  updateToRegistry(reqData) {
    const option = {
      url: 'reg/update',
      data: {
        id : 'open-saber.registry.update',
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

  downloadReport(programId, programName) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST_DOWNLOAD}`,
      data: {
        request: {
          filters: {
            program_name: programName,
            program_id: programId,
            status: ['Pending', 'Approved', 'Rejected']
          }
        }
      }
    };
    return this.API_URL(req);
  }

  generateCSV(config) {
    const tableData = config.tableData;
    delete config.tableData;
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      showTitle: true,
      title: '',
      filename: '',
      headers: []
    };
    options = _.merge(options, config);
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(tableData);
  }

  getUserPreferencesforProgram(userId, programId) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.PREFERENCE_READ}`,
      data: {
          request: {
            user_id: userId,
            program_id: programId
          }
      }
    };
    return this.API_URL(req);
  }

  setUserPreferencesforProgram(userId, programId, preference, type) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.PREFERENCE_ADD}`,
      data: {
          request: {
            user_id: userId,
            program_id: programId,
            preference: preference,
            type: type
          }
      }
    };
    return this.API_URL(req);
  }

  /* To check if the content can be uploaded or updated*/
  checkForContentSubmissionDate(programDetails) {
    const contributionendDate  = moment(programDetails.content_submission_enddate);
    const endDate  = moment(programDetails.enddate);
    const today = moment();
    return (contributionendDate.isSameOrAfter(today, 'day') && endDate.isSameOrAfter(today, 'day')) ? true : false;
  }

  getContentOriginEnvironment() {
    switch(window.location.hostname) {
      case 'dock.sunbirded.org': return 'https://dev.sunbirded.org'; break;
      case 'vdn.diksha.gov.in': return "https://diksha.gov.in"; break;
      case 'dock.preprod.ntp.net.in': return 'https://preprod.ntp.net.in'; break;
      default: return  'https://dev.sunbirded.org'; break;
    }
  }

  /*getSourcingOrgUserList(sourcingOrgId, roles, limit?) {
    return new Promise((resolve, reject) => {
      // Get all diskha users
      return this.getAllSourcingOrgUsers(sourcingOrgId, roles, limit)
      .then((sourcingOrgUsers) => {
        // Remove currently logged in user
        sourcingOrgUsers = _.filter(sourcingOrgUsers, user => {
          return user.identifier !== this.userService.userProfile.identifier;
        });

        if (_.isEmpty(sourcingOrgUsers)) {
          return resolve([]);
        }

        // Get the open saber users for org
        const storedOrglist = this.cacheService.get('orgUsersDetails');
        const orgId = _.get(this.userService, 'userProfile.userRegData.Org.osid');

        return this.registryService.getAllContributionOrgUsers(orgId)
        .then((allOrgUsers) => {
          // Get the open saber user details
          const userList = _.map(allOrgUsers, u => u.userId);
          const osUsersReq = this.registryService.getUserdetailsByOsIds(userList);

          if (userList && storedOrglist && userList.length === storedOrglist.length) {
            return resolve(this.cacheService.get('orgUsersDetails'));
          }

          return forkJoin(osUsersReq).subscribe(res => {
            const users = _.get(_.first(res), 'result.User');
            let orgUsersDetails = _.map(sourcingOrgUsers, u => {
              const osUser = _.first(_.filter(users, u1 => {
                return u1.userId === u.identifier;
              }));

              const osUserOrg = _.first(_.filter(allOrgUsers, u1 => {
                return u1.userId === _.get(osUser, 'osid');
              }));

              return {
                ...u,
                name: `${u.firstName} ${u.lastName || ''}`,
                User: osUser,
                User_Org: osUserOrg,
                selectedRole: !_.isUndefined(osUserOrg) ? _.first(osUserOrg.roles) : 'user'
              };
            });
            orgUsersDetails = _.compact(orgUsersDetails);
            this.cacheService.set('orgUsersDetails', orgUsersDetails);

            return resolve(orgUsersDetails);
          }, (err) => {
            console.log('Error:', err);
            return resolve([]);
          });
        });
      }, (err) => {
        console.log('Error:', err);
        return resolve([]);
      });
    });
  }

  getAllSourcingOrgUsers(orgId, roles, limit?, offset?) {
    // Get the diskha users for org
    const filters = {
      'organisations.organisationId': orgId,
      'organisations.roles': roles
    };

    offset = (!_.isUndefined(offset)) ? offset : 0;
    limit = (!_.isUndefined(limit)) ? limit : 100;

    if (offset === 0) {
      this.orgUsers = [];
    }

    return new Promise((resolve, reject) => {
      this.getSourcingOrgUsers(filters, offset, limit).subscribe(
        (res) => {
          const sourcingOrgUsers =  _.get(res, 'result.response.content', []);
          const totalCount =  _.get(res, 'result.response.count');

          if (sourcingOrgUsers.length > 0) {
            this.orgUsers = _.compact(_.concat(this.orgUsers, sourcingOrgUsers));
            offset = offset + limit;
          }

          if (totalCount > this.orgUsers.length){
            return resolve(this.getAllSourcingOrgUsers(orgId, roles, limit, offset));
          }
          return resolve(this.orgUsers);
        },
        (error) => {
          return reject([]);
        }
      );
    });
  } */
}
