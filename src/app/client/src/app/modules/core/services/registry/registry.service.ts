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

@Injectable({
  providedIn: 'root'
})
export class RegistryService extends DataService {
  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;
  public mycontributionOrgUsers = [];
  osReqLimit =  250;
  constructor(config: ConfigService, http: HttpClient, public contentService: ContentService,
    public userService: UserService, public learnerService: LearnerService, public cacheService: CacheService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
  }

  checkIfUserBelongsToOrg() {
    return !!(this.userService.userProfile.userRegData &&
      this.userService.userProfile.userRegData.User_Org && this.userService.userProfile.userRegData.Org);
  }

  public getcontributingOrgUsersDetails() {
    const userRegData = _.get(this.userService, 'userProfile.userRegData');
    const orgId = userRegData.User_Org.orgId;
    const storedOrglist = this.cacheService.get('orgUsersDetails');
    if (this.checkIfUserBelongsToOrg()) {
      return this.getAllContributionOrgUsers(orgId).then((allOrgUsers) => {
        return new Promise((resolve, reject) => {
          const tempMapping = [];
          if (!_.isEmpty(allOrgUsers)) {
            const userList = _.uniq(_.map(
              _.filter(allOrgUsers, obj => { if (obj.userId !== userRegData.User.osid) { return obj; } }),
              (mapObj) => {
                tempMapping.push(mapObj);
                return mapObj.userId;
              }));
            if (userList.length === 0) {
              return resolve([]);
            }
            if (userList && storedOrglist && userList.length === storedOrglist.length) {
              return resolve(this.cacheService.get('orgUsersDetails'));
            } else {
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
                        const userList1 = _.map(usersReqResult.result.User, (obj) => {
                          tempUser.push(obj);
                          return obj.userId;
                        });

                        const req = {
                          url: this.config.urlConFig.URLS.ADMIN.USER_SEARCH,
                          data: {
                            'request': {
                              'filters': {
                                'identifier': _.compact(userList1)
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
                            obj.selectedRole = _.first(obj.User_Org.roles);
                            return obj;
                          }
                      });
                  }
                  this.cacheService.set('orgUsersDetails', _.compact(orgUsersDetails));
                  return resolve(this.cacheService.get('orgUsersDetails'));
                }, (err) => { console.log(err); return reject([]); });
            }
          } else {
            return resolve([]);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        return resolve([]);
      });
    }
   }

  public getAllContributionOrgUsers(orgId, offset?) {
    offset = (!_.isUndefined(offset)) ? offset : 0;

    return new Promise((resolve, reject) => {
      this.getContributionOrgUsers(orgId, offset, this.osReqLimit).subscribe(
        (res) => {
          if (res.result && res.result.User_Org && res.result.User_Org.length > 0) {
            this.mycontributionOrgUsers = _.compact(_.concat(this.mycontributionOrgUsers, res.result.User_Org));
            if (res.result.User_Org.length < this.osReqLimit) {
              return resolve(this.mycontributionOrgUsers);
            }
            offset = offset + this.osReqLimit;
            return resolve(this.getAllContributionOrgUsers(orgId, offset));
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

  public getContributionOrgUsers(orgId, offset?, limit?): Observable<ServerResponse> {
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
          userProfile['user_org'] = res3.result.User_Org[0];
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
          userProfile['org'] = res.result.Org[0];
        }
        userProfile['error'] = false;
        return resolve(userProfile);
      }, (err) => {
        return reject(userProfile);
      });
    });
  }
}
