import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';

import { SourcingService } from './sourcing.service';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';

describe('SourcingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule]
  }));

  xit('should be created', () => {
    const service: SourcingService = TestBed.get(SourcingService);
    expect(service).toBeTruthy();
  });
});
