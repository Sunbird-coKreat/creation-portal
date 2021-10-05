import { TestBed } from '@angular/core/testing';

import { ContentHelperService } from './content-helper.service';

xdescribe('ContentHelperService', () => {
  let service: ContentHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentHelperService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
