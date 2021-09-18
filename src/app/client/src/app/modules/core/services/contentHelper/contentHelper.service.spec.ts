import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { ContentHelper } from './contentHelper.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('contentHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,RouterTestingModule],
      providers: [ContentHelper, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([ContentHelper], (service: ContentHelper) => {
    expect(service).toBeTruthy();
  }));
});
