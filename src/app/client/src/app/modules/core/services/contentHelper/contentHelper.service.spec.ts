import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { contentHelper } from './contentHelper.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('contentHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,RouterTestingModule],
      providers: [contentHelper, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([contentHelper], (service: contentHelper) => {
    expect(service).toBeTruthy();
  }));
});
