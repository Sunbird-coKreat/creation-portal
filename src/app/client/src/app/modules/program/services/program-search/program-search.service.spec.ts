import { TestBed } from '@angular/core/testing';

import { ProgramSearchService } from './program-search.service';

describe('ProgramSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramSearchService = TestBed.get(ProgramSearchService);
    expect(service).toBeTruthy();
  });
});
