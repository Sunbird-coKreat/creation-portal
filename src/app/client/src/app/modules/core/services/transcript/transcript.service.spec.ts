import { TestBed } from '@angular/core/testing';

import { TranscriptService } from './transcript.service';

describe('TranscriptService', () => {
  let service: TranscriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranscriptService);
  });

  xit('should be created', () => {
   expect(service).toBeTruthy();
  });
});
