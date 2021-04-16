import { IProgram } from './../../interfaces';
import { mergeMap, catchError, tap, retry, map, skipWhile, switchMap} from 'rxjs/operators';
import { OrgDetailsService } from './../org-details/org-details.service';
import { FrameworkService } from './../framework/framework.service';
import { ExtPluginService } from './../ext-plugin/ext-plugin.service';
import { PublicDataService } from './../public-data/public-data.service';
import { ActionService } from './../action/action.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService,
  HttpOptions, BrowserCacheTtlService, IUserProfile } from '@sunbird/shared';
import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { combineLatest, of, iif, Observable, BehaviorSubject, throwError, merge, forkJoin, Subject} from 'rxjs';
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
import { isUndefined } from 'lodash';
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
  ///private _contentTypes: any[];
  //private _contentCategories: any[];
  private _overrideMetaData: any[];
  private _sourcingOrgReviewers: Array<any>;
  // private orgUsers: Array<any>;
  public mvcStageData: any;

  private _programsNotificationData = new Subject();
  public readonly programsNotificationData = this._programsNotificationData.asObservable()
    .pipe(skipWhile(data => data === undefined || data === null));
  private _projectFeedDays: string;

  private userProfile: IUserProfile;
  constructor(config: ConfigService, http: HttpClient, private publicDataService: PublicDataService,
    private orgDetailsService: OrgDetailsService, private userService: UserService,
    private extFrameworkService: ExtPluginService, private datePipe: DatePipe,
    private contentService: ContentService, private router: Router,
    private toasterService: ToasterService, private resourceService: ResourceService,
    public learnerService: LearnerService, private registryService: RegistryService,
    public frameworkService: FrameworkService, private actionService: ActionService,
    public cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService) {
      super(http);
      this.config = config;
      this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;//"http://localhost:6000/";//
    }
    
  /**
   * initializes the service is the user is logged in;
   */
  public initialize() {
    // this.enableContributeMenu().subscribe();
    //this.getAllContentTypes().subscribe();
    //this.getAllContentCategories().subscribe();
    this.getOverridableMetaDataConfig().subscribe();
    this.mapSlugstoOrgId();

    this.userService.userData$.subscribe((user: any) => {
      if (user && !user.err) {
        this.userProfile = user.userProfile;
      }
    });
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

  // Get organisation details based on tenant user visit page
  get organisationDetails() {
    return this._organisations;
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
 mapUsertoContributorOrgReg (orgOsid, UserOsid, userRegData) {
  let contribOrgs = [];
  let sourcingOrgs = [];
  let updateOsid = '';
  let uRoles = [];
  // Check if user is already part of the organisation
  if (!_.isEmpty(_.get(userRegData, 'user_org'))) {
    _.forEach(_.get(userRegData, 'user_org'), mappingObj => {
      if (mappingObj.roles.includes('user') || mappingObj.roles.includes('admin')) {
        contribOrgs.push(mappingObj.orgId);
      }
      if (mappingObj.roles.includes('sourcing_reviewer') || mappingObj.roles.includes('sourcing_admin')) {
        sourcingOrgs.push(mappingObj.orgId);
      }

      if (mappingObj.orgId == orgOsid) {
        uRoles = mappingObj.roles;
        if (this.router.url.includes('/sourcing') && !(mappingObj.roles.includes('sourcing_reviewer') || mappingObj.roles.includes('sourcing_admin'))) {
          uRoles.push('sourcing_reviewer');
          updateOsid = mappingObj.osid;
        } else if (this.router.url.includes('/contribute') &&  !(mappingObj.roles.includes('user') || mappingObj.roles.includes('admin'))) {
          updateOsid = mappingObj.osid;
          uRoles.push('user');
        }
      }
    });
  }

  if (this.router.url.includes('/sourcing') && sourcingOrgs.length > 0 && sourcingOrgs.includes(orgOsid)) {
    this.toasterService.warning(this.resourceService.messages.emsg.contributorjoin.m0002);
    this.router.navigate(['sourcing']);
    return false;
  }else if (this.router.url.includes('/contribute') && contribOrgs.length > 0) {
    if (contribOrgs.includes(orgOsid)) {
      this.toasterService.warning(this.resourceService.messages.emsg.contributorjoin.m0002);
      this.router.navigate(['contribute/myenrollprograms']);
      return false;
    } else if (!contribOrgs.includes(orgOsid)) {
      this.toasterService.warning(this.resourceService.messages.emsg.contributorjoin.m0003);
      this.router.navigate(['contribute/myenrollprograms']);
      return false;
    }
  } else if (updateOsid) {
    this.updateUserRole(updateOsid, _.uniq(uRoles)).subscribe(
      (userAddRes) => {
        console.log('User added to org'+ UserOsid, userAddRes);
        this.onAfterJoinRedirect();
      },
      (userAddErr) => {
          console.log('Error while adding User added to org'+ UserOsid, userAddErr);
          this.toasterService.error(this.resourceService.messages.fmsg.contributorjoin.m0002);
          this.router.navigate(['sourcing']);
        }
    );
  } else if ((this.router.url.includes('/contribute') && contribOrgs.length == 0) ||
  (this.router.url.includes('/sourcing') && ((sourcingOrgs.length == 0) || (sourcingOrgs.length > 0 && !sourcingOrgs.includes(orgOsid))))) {
      const userOrgAdd = {
        User_Org: {
          userId: UserOsid,
          orgId: orgOsid,
          roles: ['user']
        }
      };

      if (this.router.url.includes('/sourcing')) {
        userOrgAdd.User_Org.roles = ['sourcing_reviewer'];
      }

      this.addToRegistry(userOrgAdd).subscribe(
        (res) => {
          this.onAfterJoinRedirect();
        },
        (error) => {
          this.toasterService.error(this.resourceService.messages.fmsg.contributorjoin.m0002);
          this.router.navigate(['contribute/myenrollprograms']);
        }
      );
    }
  }

  private onAfterJoinRedirect() {
    this.toasterService.success(this.resourceService.messages.smsg.contributorjoin.m0001);
    this.userService.openSaberRegistrySearch().then((userRegData) => {
      this.userService.userProfile.userRegData = userRegData;
      if (this.router.url.includes('/sourcing')) {
        this.router.navigateByUrl('/sourcing');
      } else {
        this.router.navigateByUrl('/contribute/myenrollprograms');
      }
    }).catch((err) => {
      this.toasterService.error('Please Try Later...');
      setTimeout(() => {
        if (this.router.url.includes('/sourcing')) {
          this.router.navigateByUrl('/sourcing');
        } else {
          this.router.navigateByUrl('/contribute/myenrollprograms');
        }
      });
    });
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
          this.registryService.openSaberRegistrySearch(this.userService.userProfile.identifier).then((userRegData) => {
            if (_.get(userRegData, 'error') === false) {
              if (_.isEmpty(_.get(userRegData, 'user'))) {
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
                  this.mapUsertoContributorOrgReg(orgOsid, res.result.User.osid, userRegData);
                }, (error) => {});
              } else {
                this.mapUsertoContributorOrgReg(orgOsid, _.get(userRegData, 'user.osid'), userRegData);
              }
            }
          }).catch((err) => {
            console.log('errr', err);
            this.toasterService.warning('Fetching registry failed');
          });
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
      !_.isEmpty(this.userProfile.userRegData.User_Org) &&
      !this.userProfile.userRegData.User_Org.roles.includes('admin')) {
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

  getUserOrganisationRoles(profileData) {
    let userRoles = ['PUBLIC'];
    if (profileData.organisations) {
      _.forEach(profileData.organisations, (org) => {
        if (org.roles && _.isArray(org.roles)) {
          userRoles = _.union(userRoles, org.roles);
        }
      });
    }
    return userRoles;
  }
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
          const userOrgRoles = this.getUserOrganisationRoles(user);
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
                      if (userOrgRoles.includes('CONTENT_REVIEWER')) {
                        userOrgAdd.User_Org.roles = ['user', 'sourcing_reviewer'];
                      }


                      this.addToRegistry(userOrgAdd).subscribe(
                        (userAddRes) => {console.log('User added to org'+ user.identifier, userAddRes);},
                        (userAddErr) => {console.log('Errro while adding User added to org'+ user.identifier,userAddErr);}
                      );
                    },
                    (error) => {console.log('Errro while adding User added to reg'+ user.identifier, error);}
                );
              } else if (!_.isEmpty(_.get(userProfile, 'user')) && _.isEmpty(_.get(userProfile, 'user_org'))) {
                userOrgAdd = {
                  User_Org: {
                    userId: _.get(userProfile, 'user.osid'),
                    orgId: userRegData.User_Org.orgId,
                    roles: ['user']
                  }
                };
                if (userOrgRoles.includes('CONTENT_REVIEWER')) {
                  userOrgAdd.User_Org.roles = ['user', 'sourcing_reviewer'];
                }
                this.addToRegistry(userOrgAdd).subscribe(
                  (userAddRes) => {console.log('User added to org'+ user.identifier, userAddRes);},
                  (userAddErr) => {console.log('Errro while adding User added to org'+ user.identifier,userAddErr);}
                );
              } else if (userOrgRoles.includes('CONTENT_REVIEWER')) {
                const uOrgs = _.map(_.get(userProfile, 'user_org'), 'orgId');
                if (uOrgs.includes(userRegData.User_Org.orgId)){
                _.forEach(_.get(userProfile, 'user_org'), mapping => {
                  if (mapping.orgId === userRegData.User_Org.orgId) {
                      const uroles = mapping.roles;
                      uroles.push('sourcing_reviewer');
                      this.updateUserRole(mapping.osid, _.uniq(uroles)).subscribe(
                        (userAddRes) => {console.log('User added to org'+ user.identifier, userAddRes);},
                        (userAddErr) => {console.log('Errro while adding User added to org'+ user.identifier,userAddErr);}
                      );
                   }
                  });
                } else {
                  userOrgAdd = {
                    User_Org: {
                      userId: _.get(userProfile, 'user.osid'),
                      orgId: userRegData.User_Org.orgId,
                      roles: ['sourcing_reviewer']
                    }
                  };
                  this.addToRegistry(userOrgAdd).subscribe(
                    (userAddRes) => {console.log('User added to org'+ user.identifier, userAddRes);},
                    (userAddErr) => {console.log('Errro while adding User added to org'+ user.identifier,userAddErr);}
                  );
                }
              }
            }
          }).catch((err) => {
            console.log('errr', err);
          });
        });
      }));
  }

  /**
   * Logic add contrib user and org for the sourcing admin and make him its admin
   */
  enableContributorProfileForSourcing () {
    /*this.makeContributorOrgForSourcing().subscribe(
      (res) => {*/
        this.userService.openSaberRegistrySearch().then((userRegData) => {
          this.userService.userProfile.userRegData = userRegData;

          this.addSourcingUserstoContribOrg(userRegData).subscribe(
            (res) => {
              console.log('Added users to contribution org');
            },
            (error) => {
              console.log('Error while adding users to contribution org');
            }
          );
        }).catch((err) => {
          this.toasterService.error('Fetching contributor profile created for sourcing failed...');
        });
      /*},
      (error) => {
        this.toasterService.error('Adding contributor profile failed.');
      }
    );*/
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
                description: orgName,
                type: ['contribute', 'sourcing'],
                orgId: this.userService.userProfile.rootOrgId,
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
    return this.API_URL(req);
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
        const nomination = _.first(data.result);

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

        if (_.get(nomination, 'status') === 'Approved' || _.get(nomination, 'status') === 'Rejected') {
          return of(_.get(nomination, 'status'));
        } else {
          return this.post(req);
        }
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
  getAllProgramsByType(req): Observable<ServerResponse> {
    const request = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.LIST}`,
      data: req
    };
    // Check if slug is present in the URL, if yes then fetch the program those slug org only
    const urlSlug = this.userService.slug;
    if (urlSlug && !_.isEmpty(this._organisations[urlSlug])) {
      request.data.request.filters['rootorg_id'] = this._organisations[urlSlug];
      return this.API_URL(request);
    } else {
      return this.API_URL(request);
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

  initializeBlueprintMetadata(selectedData: any, frameworkCategories) {
    let { gradeLevel, subject} = selectedData;
    let gradeLevelTerms = [], subjectTerms = [], topicTerms = [];
    let gradeLevelTopicAssociations = [], subjectTopicAssociations = [];
    let tempTopicOptions = [], tempLearningOutcomeOptions = [];
    _.forEach(frameworkCategories, (category) => {
      if(category.code === 'gradeLevel') {
        const terms = category.terms;
        if(terms) gradeLevelTerms =  _.concat(gradeLevelTerms, _.filter(terms,  (t)  => _.includes(gradeLevel, t.name)));
      }

      if(category.code === 'topic') {
        const terms = category.terms;
        if(terms) topicTerms = terms;
      }

      if(category.code === 'subject') {
        const terms = category.terms;
        if(terms) subjectTerms =  _.concat(subjectTerms, _.filter(terms,  (t)  => _.includes(subject, t.name)));
      }
    });

    if(gradeLevelTerms.length && subjectTerms.length) {
        _.forEach(gradeLevelTerms, (term) => {
          if(term.associations) {
          gradeLevelTopicAssociations = _.concat(gradeLevelTopicAssociations,
            _.filter(term.associations, (association) => association.category === 'topic'))
          }
        })
        _.forEach(subjectTerms, (term) => {
          if(term.associations) {
          subjectTopicAssociations = _.concat(subjectTopicAssociations,
            _.filter(term.associations, (association) => association.category === 'topic'))
          }
        })
          tempTopicOptions = _.intersectionWith(gradeLevelTopicAssociations, subjectTopicAssociations, (a, o) =>  a.name === o.name );
        }
        topicTerms = _.filter(topicTerms, (t) => _.find(tempTopicOptions, { name: t.name }))

      if(topicTerms) {
        _.forEach(topicTerms, (term) => {
          if(term.associations) {
            tempLearningOutcomeOptions = _.concat(tempLearningOutcomeOptions || [], _.map(term.associations, (learningOutcome) =>learningOutcome));
              }
            });
        }

        return [tempTopicOptions, tempLearningOutcomeOptions];
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
   * Get all overridable meta fields configured
   */
  get overrideMetaData() {
    return this._overrideMetaData;
  }

  getOverridableMetaDataConfig(): Observable<any[]> {
    const option = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CONFIGURATION_SEARCH}`,
      data: {
        request: {
          key: 'overrideMetaData',
          status: 'active'
        }
      }
    };

    return this.post(option).pipe(
      map(result => _.get(result, 'result.configuration.value')),
      catchError(err => of([]))
    ).pipe(
      tap(data => {
        this._overrideMetaData = JSON.parse(data);
      })
    );
  }

  getCategoryDefinition(category, rootOrgId) {
    const cacheInd = category.name + ':' + rootOrgId;
    if (this.cacheService.get(cacheInd)) {
      return  of(this.cacheService.get(cacheInd));
    } else {
      const req = {
        url: 'object/category/definition/v1/read?fields=objectMetadata,forms,name',
        data: {
          request: {
            "objectCategoryDefinition": {
                "objectType": category.targetObjectType,
                "name": category.name,
                "channel": rootOrgId
            },
          }
        }
      };
      return this.post(req).pipe(tap(data => {
        this.setSessionCache({name: cacheInd, value: data})
      }));
    }
  }

  getCollectionCategoryDefinition(categoryName, rootOrgId) {
    const cacheInd = categoryName + ':' + rootOrgId;
    if (this.cacheService.get(cacheInd)) {
      return  of(this.cacheService.get(cacheInd));
    } else {
      const req = {
        url: 'object/category/definition/v1/read?fields=objectMetadata,forms,name',
        data: {
          request: {
            "objectCategoryDefinition": {
                "objectType": "Collection",
                "name": categoryName,
                "channel": rootOrgId
            },
          }
        }
      };
      return this.post(req).pipe(tap(data => {
        this.setSessionCache({name: cacheInd, value: data})
      }));
    }

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

  generateCollectionPDF(identifier) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.PRINT_PREVIEW}`,
      param: {
        id: identifier,
        format: 'json'
      }
    };
  return this.contentService.get(req);
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
    const today = moment();
    return (contributionendDate.isSameOrAfter(today, 'day') && this.isProjectLive(programDetails)) ? true : false;
  }

  getContentOriginEnvironment() {
    switch(window.location.hostname) {
      case 'dock.sunbirded.org': return 'https://dev.sunbirded.org'; break;
      case 'vdn.diksha.gov.in': return 'https://diksha.gov.in'; break;
      case 'dock.preprod.ntp.net.in': return 'https://preprod.ntp.net.in'; break;
      default: return  'https://dev.sunbirded.org'; break;
    }
  }

  setMvcStageData(data) {
    this.mvcStageData = data;
  }

  getMvcStageData() {
    return this.mvcStageData;
  }

  clearMvcStageData() {
    this.mvcStageData = undefined;
  }

  getProgramsNotificationData(reqData): Observable<any> {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.FEED_SEARCH}`,
      data: {
        request: reqData
      }
    };
    if (this.cacheService.get('programsNotificationData')) {
      return  of(this.cacheService.get('programsNotificationData'));
    } else {
      return this.post(req).pipe(tap(data => this.setSessionCache({name: 'programsNotificationData', value: data})));
    }
  }

  fetchProjectFeedDays() {
    const option = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CONFIGURATION_SEARCH}`,
      data: {
        request: {
          key: 'projectFeedDays',
          status: 'active'
        }
      }
    };

    return this.post(option).pipe(
      map(result => _.get(result, 'result.configuration.value')),
      catchError(err => of('')),
      tap(data => {
        this._projectFeedDays = data;
      })
    );
  }

  get projectFeedDays(): string {
    return this._projectFeedDays;
  }

  setSessionCache(data) {
    this.cacheService.set(data.name, data.value,
    { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }

  sendprogramsNotificationData(programData) {
    this._programsNotificationData.next(programData);
  }
  frameworkInitialize(frameworkName?) {
    this.frameworkService.initialize(frameworkName); // initialize framework details here
  }
  getAllTenantList(): Observable<ServerResponse> {
    const req = {
      url: this.config.urlConFig.URLS.DOCK_TENANT.LIST,
      data: {
        request: {
          filters: {
            status: 'Live'
          }
        }
      }
    };
    if (this.cacheService.get('allTenantList')) {
      return  of(this.cacheService.get('allTenantList'));
    } else {
      return this.post(req).pipe(tap(data => this.setSessionCache({name: 'allTenantList', value: data})));
    }
  }
  getFiltersAppliedCount(appliedfilters) { // finding the applied filters count
    let count = 0;
    if (appliedfilters) {
     _.map(_.compact(Object.values(appliedfilters)), (values) =>{
       values.length ? count++ : 0;
        });
    }
    return count;
  }

  setTargetCollectionName(program, plural?) {
    if (program.target_collection_category === null) {
     return plural ? 'Digital Textbooks' : 'Digital Textbook';
    } else  {
      let collectionCat = '';
      if (_.isArray(program.target_collection_category)) {
        collectionCat = program.target_collection_category[0];
      } else {
        collectionCat = program.target_collection_category;
      }

     return plural ? collectionCat + 's' : collectionCat;
    }
  }

  isProjectEnded(program) {
    const endDate  = moment(program.enddate);
    const today = moment();
    return (today.isAfter(endDate)) ? true : false;
  }

  isProjectClosed(program) {
    return !! ((this.isProjectEnded(program) && (program.status === 'Live' || program.status === 'Unlisted')) || program.status === 'Closed');
  }

  isProjectLive(program) {
    return !! (!this.isProjectEnded(program) && (program.status === 'Live' || program.status === 'Unlisted'));
  }

  getProgramTargetPrimaryCategories(program, channelCategories?) {
    let targetPrimaryCategories = [];
    if (!_.isEmpty(program.targetprimarycategories)) {
      return program.targetprimarycategories;
    } else {
      _.forEach (program.content_types, (val) => {
        let catObj = {
          identifier: '',
          name: val,
          targetObjectType: 'Content'
        };

        if (!isUndefined(channelCategories)) {
          let cat = _.find(channelCategories, {"name": val, "targetObjectType": 'Content'});
          catObj['identifier'] = (cat) ? cat.identifier : '';
        }
        targetPrimaryCategories.push(catObj);
      });
      return targetPrimaryCategories;
    }
  }

  getNominatedTargetPrimaryCategories(program, nomination) {
    let projectPrimaryCategories = this.getProgramTargetPrimaryCategories(program);
    let targetPrimaryCategories;
    if (nomination && !_.isEmpty(nomination.targetprimarycategories)) {
      targetPrimaryCategories = _.filter(nomination.targetprimarycategories, (nomCat) => {
        let cat = _.find(projectPrimaryCategories, { 'identifier': nomCat.identifier });
        if (cat) {
          return cat;        
        }
      });
    } else if (nomination && !_.isEmpty(nomination.content_types)) {
      targetPrimaryCategories = _.filter(projectPrimaryCategories, (cat) => {
        if (_.includes(nomination.content_types, cat.name)) {
          return cat;        
        } 
      });
    } 
    return targetPrimaryCategories;
  }
}
