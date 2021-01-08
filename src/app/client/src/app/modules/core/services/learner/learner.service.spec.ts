import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  ResourceService, ConfigService } from '@sunbird/shared';
import { LearnerService } from './learner.service';

xdescribe('LearnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LearnerService, ConfigService, HttpClient,ResourceService]
    });
  });

  it('should be created', inject([LearnerService], (service: LearnerService) => {
    expect(service).toBeTruthy();
  }));
});
