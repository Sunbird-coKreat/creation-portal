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

   public getOrgUsersDetails(userRegData?, forSourcing?) {
    this.mycontributionOrgUsers = [];
    const roles = forSourcing ?  ["sourcing_reviewer", "sourcing_admin"] : ["user", "admin"];
    if (_.isUndefined(userRegData)) {
      userRegData = _.get(this.userService, 'userProfile.userRegData');
    }
    const orgId = _.get(userRegData, 'Org.osid');
    if (orgId) {
      return this.getAllOrgUsers(orgId, roles).then((allOrgUsers) => {
        return new Promise((resolve, reject) => {
          if (!_.isEmpty(allOrgUsers)) {
            const userList = _.filter(allOrgUsers, obj => {
              if ((_.get(obj, 'User_Org.userId') !== _.get(userRegData, 'User.osid'))) {
                return obj;
              }
            });
            if (userList.length == 0) {
              return resolve([]);
            }
            return resolve(_.compact(userList));
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

   getAllOrgUsers(orgId, roles?, offset?) {
    offset = (!_.isUndefined(offset)) ? offset : 0;
    return new Promise((resolve, reject) => {
      this.getOrgUsers(orgId, roles, offset, this.osReqLimit).subscribe(
        (res) => {
          if (res.result && res.result.contributor && res.result.count > 0) {
            this.mycontributionOrgUsers = _.compact(_.concat(this.mycontributionOrgUsers, res.result.contributor));
            if (res.result.count < this.osReqLimit) {
              return resolve(this.mycontributionOrgUsers);
            }
            offset = offset + this.osReqLimit;
            return resolve(this.getAllOrgUsers(orgId, roles, offset));
          } else {
            return resolve(this.mycontributionOrgUsers);
          }
        },
        (error) => { return reject([]);
      });
    });
   }

   public getOrgUsers(orgId, roles, offset?, limit?, fields?): Observable<ServerResponse> {
    const req = {
      url: `program/v1/contributor/search`,
      data: {
        'request': {
          'filters': {
            'user_org': {
              'orgId': {
                'eq': orgId
              },
              'roles': roles
            }
          },
          "fields": fields || [],
          'limit': limit || 250,
          'offset': offset || 0
        }
      }
    };
    return this.contentService.post(req);
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

  public getOrgList(limit?, offset?): Observable<ServerResponse> {
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
          entityType: ['Org'],
          filters:{},
          limit: limit || 250,
          offset: offset || 0,
        }
      }
    };

    return this.contentService.post(option);
  }

  public getUserList(limit?, offset?, filters?): Observable<ServerResponse> {
    const option = {
      url: 'reg/search',
      data: {
        id: 'open-saber.registry.search',
        ver: '1.0',
        ets: Date.now(),
        params: {
          did: '',
          key: '',
          msgid: ''
        },
        request: {
          entityType: ['User'],
          filters: filters || {},
          limit: limit || 250,
          offset: offset || 0,
        }
      }
    };

    return this.contentService.post(option);
  }


}
