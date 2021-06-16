import { TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { EnrollContributorService } from './enroll-contributor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('EnrollContributorService', () => {
  let service: EnrollContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,RouterTestingModule],
      providers:[ConfigService]
    });
    service = TestBed.get(EnrollContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
