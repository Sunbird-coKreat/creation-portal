import { TestBed } from '@angular/core/testing';

import { TextbookListService } from './textbook-list.service';

describe('TextbookListService', () => {
  let service: TextbookListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(TextbookListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
