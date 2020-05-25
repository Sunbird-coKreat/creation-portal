import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import { ContentService } from './../content/content.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, tap, catchError, skipWhile } from 'rxjs/operators';
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
    const storedOrglist = this.cacheService.get('orgUsersDetails')
    return new Promise((resolve, reject) => {
      if (this.checkIfUserBelongsToOrg()) {
        return this.getContributionOrgUsers(orgId).subscribe(
          (res1) => {
            const tempMapping = [];

            if (res1.result.User_Org.length) {
              const userList = _.uniq(_.map(
                _.filter(res1.result.User_Org, obj => { if (obj.userId !== userRegData.User.osid) { return obj } }),
                (mapObj) => {
                  tempMapping.push(mapObj);
                  return mapObj.userId;
                }));

              if (userList && storedOrglist && userList.length === storedOrglist.length) {
                return resolve(this.cacheService.get('orgUsersDetails'));
              } else {
                let orgUsersDetails = {};
                const tempUser = [];

                return this.getUserdetailsByOsIds(userList).pipe(
                  switchMap((res2: any) => {
                    if (res2 && res2.result.User.length) {
                      const userList = _.map(res2.result.User, (obj) => {
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
                      return this.learnerService.post(req);
                    } else {
                      return of(null);
                    }
                  })).subscribe((res) => {
                    orgUsersDetails = _.get(res, 'result.response.content');
                    const userList = _.map(orgUsersDetails, (obj) => {
                      const tempUserObj = _.find(tempUser, { 'userId': obj.identifier });
                      obj.name = `${obj.firstName} ${obj.lastName || ''}`;
                      obj.User = _.find(tempUser, { 'userId': obj.identifier });
                      obj.User_Org = _.find(tempMapping, { 'userId': _.get(tempUserObj, 'osid') });
                      obj.selectedRole = _.first(obj.User_Org.roles);
                      return obj;
                    });
                    this.cacheService.set('orgUsersDetails', _.get(res, 'result.response.content'));
                    return resolve(this.cacheService.get('orgUsersDetails'));
                  }, (err) => { console.log(err); return reject([]); });
              }
            } else {
              return resolve([]);
            }
          }, (error) => {
            console.log(error); return reject([]);
          });
      } else {
        return resolve([]);
      }
    });
  }

  private getUserdetailsByOsIds(userList: []): Observable<ServerResponse> {
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

  public getContributionOrgUsers(orgId): Observable<ServerResponse> {
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
          }
        }
      }
    };
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
          const orgList = res4.result.User_Org.map((value) => value.orgId.slice(2));
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
