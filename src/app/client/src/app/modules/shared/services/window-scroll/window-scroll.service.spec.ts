import { TestBed, inject } from '@angular/core/testing';

import { WindowScrollService } from './window-scroll.service';

xdescribe('WindowScrollService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WindowScrollService]
    });
  });

  xit('should be created', inject([WindowScrollService], (service: WindowScrollService) => {
    expect(service).toBeTruthy();
  }));
});
