import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import { ContentService } from './../content/content.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Observable, of} from 'rxjs';
import { switchMap, tap} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RegistryService extends DataService {
  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;
  constructor(config: ConfigService, http: HttpClient, public contentService: ContentService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
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
        userId: {eq: userId}
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
        userId: {eq: res2.result.User[0].osid}
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
            osid: {or: orgList}
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
