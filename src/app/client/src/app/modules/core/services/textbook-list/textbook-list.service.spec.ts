import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TextbookListService } from './textbook-list.service';

xdescribe('TextbookListService', () => {
  let service: TextbookListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[RouterTestingModule,HttpClientTestingModule]
    });
    service = TestBed.inject(TextbookListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
