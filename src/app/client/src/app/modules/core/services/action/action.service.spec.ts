import { TestBed } from '@angular/core/testing';

import { ActionService } from './action.service';

describe('ActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ActionService = TestBed.inject(ActionService);
    expect(service).toBeTruthy();
  });
});
