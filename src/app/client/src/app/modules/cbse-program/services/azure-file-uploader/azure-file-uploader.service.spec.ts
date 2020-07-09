import { TestBed } from '@angular/core/testing';

import { AzureFileUploaderService } from './azur-file-uploader.service';

describe('AzureFileUploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AzureFileUploaderService = TestBed.get(AzureFileUploaderService);
    expect(service).toBeTruthy();
  });
});
