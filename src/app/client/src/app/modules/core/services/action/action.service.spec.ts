import { TestBed } from '@angular/core/testing';

import { ActionService } from './action.service';

xdescribe('ActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: ActionService = TestBed.get(ActionService);
    expect(service).toBeTruthy();
  });
});
