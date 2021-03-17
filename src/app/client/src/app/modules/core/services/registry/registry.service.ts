import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import { ContentService } from './../content/content.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Observable, of, throwError, BehaviorSubject, forkJoin, empty} from 'rxjs';
import { switchMap, tap, catchError, skipWhile, isEmpty } from 'rxjs/operators';
import { UserService } from './../user/user.service';
import { LearnerService } from '../learner/learner.service';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import {TelemetryService } from '@sunbird/telemetry';

@Injectable({
  providedIn: 'root'
})
export class RegistryService extends DataService {
  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;
  public mycontributionOrgUsers = [];
  osReqLimit =  250;
  searchLimitCount = 100;// setting count here , because in future we can get/set limit from configuration
  programUserPageLimit = 200; // setting page limit here , because in future we can get/set limit from configuration 
  constructor(config: ConfigService, http: HttpClient, public contentService: ContentService, public telemetryService: TelemetryService,
    public userService: UserService, public learnerService: LearnerService, public cacheService: CacheService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
  }

  checkIfUserBelongsToOrg() {
    return !!(this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org && this.userService.userProfile.userRegData.Org);
  }

  public getcontributingOrgUsersDetails(userRegData?, forSourcing?) {
    const sourcingRoles = ["sourcing_reviewer", "sourcing_admin"];
    const contribRoles = ["user", "admin"];
    if (_.isUndefined(userRegData)) {
      userRegData = _.get(this.userService, 'userProfile.userRegData');
    }
    const orgId = _.get(userRegData, 'Org.osid');
    //const storedOrglist = this.cacheService.get('orgUsersDetails');
    if (orgId) {
      return this.getAllContributionOrgUsers(orgId, forSourcing).then((allOrgUsers) => {
        return new Promise((resolve, reject) => {
          const tempMapping = [];
          if (!_.isEmpty(allOrgUsers)) {
            const userList = _.uniq(_.map(
              _.filter(allOrgUsers, obj => {
                const isHavingSouringRoles = _.intersection(sourcingRoles, obj.roles);
                const isHavingContribRoles = _.intersection(contribRoles, obj.roles);
                if ((obj.userId !== _.get(userRegData, 'User.osid')) &&
                    (
                      (!_.isUndefined(forSourcing) && forSourcing && isHavingSouringRoles.length > 0) ||
                      ((_.isUndefined(forSourcing) || (!_.isUndefined(forSourcing) && !forSourcing)) && isHavingContribRoles.length > 0)
                  )) {
                    return obj
                  }
              }),
              (mapObj) => {
                tempMapping.push(mapObj);
                return mapObj.userId;
              }));
            if (userList.length == 0) {
              return resolve([]);
            }

          let orgUsersDetails = {};
          const tempUser = [];
          const osUsersReq = _.map(_.chunk( userList, this.osReqLimit), chunk => {
            return this.getUserdetailsByOsIds(chunk);
          });

          return forkJoin(osUsersReq).pipe(
            switchMap((res2: any) => {
              const usersReq = [];
              if (!_.isEmpty(res2) && res2.length > 0) {
              _.forEach(res2, (usersReqResult) => {
                  if (usersReqResult && usersReqResult.result.User.length) {
                    const userList = _.map(usersReqResult.result.User, (obj) => {
                      tempUser.push(obj);
                      return obj.userId;
                    });

                    const req = {
                      url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
                      data: {
                        'request': {
                          'filters': {
                            'identifier': _.compact(userList)
                          }
                        }
                      }
                    };
                    usersReq.push(this.learnerService.post(req));
                  }
                });
                if (!_.isEmpty(usersReq)) {
                  return forkJoin(usersReq);
                } else {
                  return of(null);
                }
              } else {
                return of(null);
              }
            })).subscribe((res) => {
              if (!_.isEmpty(res) && res.length > 0) {
              _.forEach(res, (usersReqResult) => {
                  orgUsersDetails = _.compact(_.concat(orgUsersDetails, _.get(usersReqResult, 'result.response.content')));
                });
              }
              if (!_.isEmpty(orgUsersDetails)) {
                  orgUsersDetails = _.map(
                    _.filter(orgUsersDetails, obj => { if (obj.identifier) { return obj; } }),
                    (obj) => {
                      if (obj.identifier) {
                        const tempUserObj = _.find(tempUser, { 'userId': obj.identifier });
                        obj.name = `${obj.firstName} ${obj.lastName || ''}`;
                        obj.User = _.find(tempUser, { 'userId': obj.identifier });
                        obj.User_Org = _.find(tempMapping, { 'userId': _.get(tempUserObj, 'osid') });
                        if (!_.isUndefined(forSourcing) && forSourcing) {
                          obj.selectedRole = _.first(_.intersection(sourcingRoles, obj.User_Org.roles));
                        } else if (_.isUndefined(forSourcing) || (!_.isUndefined(forSourcing) && !forSourcing)) {
                          obj.selectedRole = _.first(_.intersection(contribRoles, obj.User_Org.roles));
                        }
                        return obj;
                      }
                  });
              }
              return resolve(_.compact(orgUsersDetails));
            }, (err) => { console.log(err); return reject([]); });
          } else {
            return resolve([]);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        return resolve([]);
      })
    }
   }

  public getAllContributionOrgUsers(orgId, forSourcing?, offset?) {
    offset = (!_.isUndefined(offset)) ? offset : 0;

    return new Promise((resolve, reject) => {
      this.getContributionOrgUsers(orgId, forSourcing, offset, this.osReqLimit).subscribe(
        (res) => {
          if (res.result && res.result.User_Org && res.result.User_Org.length > 0) {
            this.mycontributionOrgUsers = _.compact(_.concat(this.mycontributionOrgUsers, res.result.User_Org));
            if (res.result.User_Org.length < this.osReqLimit) {
              return resolve(this.mycontributionOrgUsers);
            }
            offset = offset + this.osReqLimit;
            return resolve(this.getAllContributionOrgUsers(orgId, forSourcing, offset));
          } else {
            return resolve(this.mycontributionOrgUsers);
          }
        },
        (error) => { return reject([]);
      });
    });
  }

  public getUserdetailsByOsIds(userList: []): Observable<ServerResponse> {
    const option = {
      url: 'reg/search',
      data: {
        id: 'open-saber.registry.search',
        ver: '1.0',
        ets: '11234',
        params: {
          did: '',
          key: '',
          msgid: ''
        },
        request: {
          entityType: ['User'],
          filters: {
            osid: { or: userList }
          }
        }
      }
    };

    return this.contentService.post(option);
  }

  public getContributionOrgUsers(orgId, forSourcing?, offset?, limit?): Observable<ServerResponse> {
    const req = {
      url: `reg/search`,
      data: {
        'id': 'open-saber.registry.search',
        'ver': '1.0',
        'ets': '11234',
        'params': {
          'did': '',
          'key': '',
          'msgid': ''
        },
        'request': {
          'entityType': ['User_Org'],
          'filters': {
            'orgId': { 'eq': orgId }
          },
        }
      }
    };

    if (!_.isUndefined(limit)) {
      req.data.request['limit'] = limit;
    }
    if (!_.isUndefined(offset)) {
      req.data.request['offset'] = offset;
    }
    /*if (!_.isUndefined(forSourcing)) {
      req.data.request.filters['roles'] = { 'contains': 'sourcing_reviewer' };
    }*/

    return this.contentService.post(req);
  }

  public getUserDetails(userId): Observable<ServerResponse> {
    const req = {
      url: `reg/read`,
      data: {
        'id': 'open-saber.registry.read',
        'ver': '1.0',
        'ets': '11234',
        'params': {
          'did': '',
          'key': '',
          'msgid': ''
        },
        'request': {
          'User': {
            'osid': userId
          }
        }
      }
    };
    return this.contentService.post(req);
  }

  public getOpenSaberOrgByOrgId(userProfile): Observable<ServerResponse> {
    const req = {
      url: `reg/search`,
      data: {
        'id': 'open-saber.registry.search',
        'ver': '1.0',
        'ets': '11234',
        'params': {
          'did': '',
          'key': '',
          'msgid': ''
        },
        'request': {
          'entityType': ['Org'],
          'filters': {
            'orgId': { 'eq': userProfile.rootOrgId }
          },
        }
      }
    };
    return this.contentService.post(req);
  }


  public openSaberRegistrySearch(userId) {
    const userProfile = {};
    userProfile['error'] = true;
    const option = {
      url: 'reg/search',
      data: {
        id: 'open-saber.registry.search',
        ver: '1.0',
        ets: '11234',
        params: {
          did: '',
          key: '',
          msgid: ''
        }
      }
    };
    option.data['request'] = {
      entityType: ['User'],
      filters: {
        userId: { eq: userId }
      }
    };
    return new Promise((resolve, reject) => {
      this.contentService.post(option).pipe(tap((res1) => {
        if (res1.result.User.length) {
          userProfile['user'] = res1.result.User[0];
        }
      }), switchMap((res2) => {
        if (res2.result.User.length) {
          option.data['request'] = {
            entityType: ['User_Org'],
            filters: {
              userId: { eq: res2.result.User[0].osid }
            }
          };
          return this.contentService.post(option);
        } else {
          return of(null);
        }
      }), tap((res3) => {
        if (res3 && res3.result.User_Org.length) {
          userProfile['user_org'] = res3.result.User_Org;
        }
      }), switchMap((res4) => {
        if (res4 && res4.result.User_Org.length) {
          const orgList = res4.result.User_Org.map((value) => value.orgId);
          option.data['request'] = {
            entityType: ['Org'],
            filters: {
              osid: { or: orgList }
            }
          };
          return this.contentService.post(option);
        } else {
          return of(null);
        }
      })
      ).subscribe((res: any) => {
        if (res && res.result.Org.length) {
          userProfile['org'] = res.result.Org;
        }
        userProfile['error'] = false;
        return resolve(userProfile);
      }, (err) => {
        return reject(userProfile);
      });
    });
  }
  
  public getSearchedUserList(userList,searchInput) {
    let searchedUserList = [];
    searchInput = searchInput.toUpperCase();
    _.forEach(userList, (user) => {
      if (user.firstName.toUpperCase().includes(searchInput)) {
        searchedUserList.push(user);
      }
    });
    return searchedUserList;
  }
  public generateUserRoleUpdateTelemetry (env, cdata, pdata, edata) {
    const appTelemetryInteractData = {
      context: {
        env: env,
        cdata: cdata || [],
        pdata: pdata
      },
      edata: edata
    };
    this.telemetryService.interact(appTelemetryInteractData);
  }
}
