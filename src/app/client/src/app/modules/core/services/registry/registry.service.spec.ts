import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistryService } from './registry.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService} from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CacheService } from 'ng2-cache-service';
import { ContentService } from './../content/content.service';

describe('RegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule, TelemetryModule],
    providers: [ConfigService, TelemetryService, CacheService,
      {provide: APP_BASE_HREF, useValue: '/'}]
  }));

  it('should be created', () => {
    const service: RegistryService = TestBed.get(RegistryService);
    expect(service).toBeTruthy();
  });

  it('getOrgUsers should call contentService.post', () => {
    const req = {
      url: `program/v1/contributor/search`,
      data: {
        'request': {
          'filters': {
            'user_org': {
              'orgId': {
                'eq': '12345'
              },
              'roles': ['sourcing_admin']
            }
          },
          'fields': 'name',
          'limit': 200,
          'offset': 0
        }
      }
    };
    const registryService = TestBed.get(RegistryService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => {});
    spyOn(registryService, 'getOrgUsers').and.callThrough();
    registryService.getOrgUsers('12345', ['sourcing_admin'], 0, 200, 'name');
    expect(contentService.post).toHaveBeenCalledWith(req);
  });

  it('getUserdetailsByOsIds should call contentService.post', () => {
    const registryService = TestBed.get(RegistryService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => {});
    spyOn(registryService, 'getUserdetailsByOsIds').and.callThrough();
    registryService.getUserdetailsByOsIds(['n11']);
    expect(contentService.post).toHaveBeenCalled();
  });

  it('getContributionOrgUsers should call contentService.post', () => {
    const registryService = TestBed.get(RegistryService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => {});
    spyOn(registryService, 'getContributionOrgUsers').and.callThrough();
    registryService.getContributionOrgUsers('12345', {}, 0, 200);
    expect(contentService.post).toHaveBeenCalled();
  });

  it('getUserDetails should call contentService.post', () => {
    const registryService = TestBed.get(RegistryService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => {});
    spyOn(registryService, 'getUserDetails').and.callThrough();
    registryService.getUserDetails('12345');
    expect(contentService.post).toHaveBeenCalled();
  });

  it('getOpenSaberOrgByOrgId should call contentService.post', () => {
    const registryService = TestBed.get(RegistryService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => {});
    spyOn(registryService, 'getOpenSaberOrgByOrgId').and.callThrough();
    registryService.getOpenSaberOrgByOrgId({rootOrgId: '12345'});
    expect(contentService.post).toHaveBeenCalled();
  });

  it('getSearchedUserList should return searchedUserList', () => {
    const registryService = TestBed.get(RegistryService);
    spyOn(registryService, 'getSearchedUserList').and.callThrough();
    const searchedUserList = registryService.getSearchedUserList([{firstName: 'n11'}], 'n11');
    expect(searchedUserList).toBeDefined();
  });

  it('generateUserRoleUpdateTelemetry should call telemetryService.interact', () => {
    const registryService = TestBed.get(RegistryService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(telemetryService, 'interact').and.callFake(() => {});
    spyOn(registryService, 'generateUserRoleUpdateTelemetry').and.callThrough();
    registryService.generateUserRoleUpdateTelemetry('vdn', {}, {}, {});
    expect(telemetryService.interact).toHaveBeenCalled();
  });

  it('getOrgList should call contentService.post', () => {
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
          filters: {},
          limit: 200,
          offset: 0,
        }
      }
    };
    const registryService = TestBed.get(RegistryService);
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'post').and.callFake(() => {});
    spyOn(registryService, 'getOrgList').and.callThrough();
    registryService.getOrgList(200, 0);
    expect(contentService.post).toHaveBeenCalledWith(option);
  });
});
