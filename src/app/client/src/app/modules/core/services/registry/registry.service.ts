import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { HttpClient } from '@angular/common/http';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService, ServerResponse, ToasterService, ResourceService } from '@sunbird/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistryService extends DataService {

  public config: ConfigService;
  baseUrl: string;
  public http: HttpClient;
  private API_URL = this.post || this.publicDataService.post;
  constructor(config: ConfigService, http: HttpClient, private publicDataService: PublicDataService) {
    super(http);
    this.config = config;
    this.baseUrl = this.config.urlConFig.URLS.CONTENT_PREFIX;
  }



  public getContributionOrgUsers(orgId): Observable<ServerResponse> {
    const req = {
      url: `content/reg/search`,
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
    return this.API_URL(req);
  }


  public getUserDetails(userId): Observable<ServerResponse> {
    const req = {
      url: `content/reg/read`,
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
    return this.API_URL(req);
  }

}
