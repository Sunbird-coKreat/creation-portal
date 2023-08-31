import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
  import { RouterTestingModule } from '@angular/router/testing';
import { AzureFileUploaderService } from './azure-file-uploader.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('AzureFileUploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,RouterTestingModule],
  }));

  it('should be created', () => {
    const service: AzureFileUploaderService = TestBed.get(AzureFileUploaderService);
    expect(service).toBeTruthy();
  });
});
