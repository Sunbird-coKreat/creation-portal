import { TestBed } from '@angular/core/testing';

import { BulkJobService } from './bulk-job.service';

describe('BulkJobService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BulkJobService = TestBed.get(BulkJobService);
    expect(service).toBeTruthy();
  });
});
