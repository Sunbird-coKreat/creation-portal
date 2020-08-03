import { TestBed, async, inject } from '@angular/core/testing';

import { LandingpageGuard } from './landingpage.guard';

describe('LandingpageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingpageGuard]
    });
  });

  xit('should ...', inject([LandingpageGuard], (guard: LandingpageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
