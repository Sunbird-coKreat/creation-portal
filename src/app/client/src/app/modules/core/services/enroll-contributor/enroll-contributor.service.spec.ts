import { TestBed } from '@angular/core/testing';

import { EnrollContributorService } from './enroll-contributor.service';

describe('EnrollContributorService', () => {
  let service: EnrollContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EnrollContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
