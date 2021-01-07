import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistryService } from './registry.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ResourceService, ToasterService, SharedModule, ConfigService,
  UtilService, BrowserCacheTtlService, NavigationHelperService,
} from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { APP_BASE_HREF,DatePipe } from '@angular/common'; 
import { CacheService } from 'ng2-cache-service';

describe('RegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[RouterTestingModule,HttpClientTestingModule,TelemetryModule],
    providers:[ConfigService,TelemetryService,CacheService,
      {provide: APP_BASE_HREF, useValue: '/'}]
  }));

  it('should be created', () => {
    const service: RegistryService = TestBed.get(RegistryService);
    expect(service).toBeTruthy();
  });
});
