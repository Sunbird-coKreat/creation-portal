import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BulkJobService } from './bulk-job.service';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF,DatePipe } from '@angular/common'; 
import {
  ResourceService, ToasterService, SharedModule, ConfigService,
  UtilService, BrowserCacheTtlService, NavigationHelperService,
} from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

describe('BulkJobService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,RouterTestingModule,TelemetryModule],
    providers: [ConfigService,ResourceService,CacheService,BrowserCacheTtlService,TelemetryService,ToasterService,DatePipe,
      {provide: APP_BASE_HREF, useValue: '/'}]
  }));

  it('should be created', () => {
    const service: BulkJobService = TestBed.inject(BulkJobService);
    expect(service).toBeTruthy();
  });
});
