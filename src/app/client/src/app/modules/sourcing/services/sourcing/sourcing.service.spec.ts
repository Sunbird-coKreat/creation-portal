import { of as observableOf, throwError as observableError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { SourcingService } from './sourcing.service';
import { CoreModule, ActionService, ContentService } from '@sunbird/core';
import { SharedModule, ToasterService, ConfigService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClient } from '@angular/common/http';
describe('SourcingService', () => {

  const mockError = {
    error: {
      'params': {
        'resmsgid': '98b0a030-3ca6-11e8-964f-83be3d8fc737',
        'msgid': null,
        'status': 'failed',
        'errmsg': 'Something went wrong'
      }
    },
    status: 'failed'
  };

  let sourcingService;
  let actionService;
  let contentService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule],
      providers: [ SourcingService, ActionService, TelemetryService, ToasterService, HttpClient, ConfigService, ContentService ]
    });
    sourcingService = TestBed.get(SourcingService);
    actionService   = TestBed.get(ActionService);
    contentService  = TestBed.get(ContentService);
  });

  it('should be created', () => {
    expect(sourcingService).toBeTruthy();
  });

  it('#postCertData() should call httpClient.post()', () => {
    const httpClient = TestBed.get(HttpClient);
    spyOn(httpClient, 'post').and.returnValue(observableOf({}));
    spyOn(sourcingService, 'postCertData').and.callThrough();
    sourcingService.postCertData('dummy', 'dummy', 'abcd1234', '123456789');
    expect(httpClient.post).toHaveBeenCalled();
  });

  it('#getQuestionDetails() should call actionService.get()', () => {
    spyOn(actionService, 'get').and.returnValue(observableOf({}));
    spyOn(sourcingService, 'getQuestionDetails').and.callThrough();
    sourcingService.getQuestionDetails('do_12345');
    expect(actionService.get).toHaveBeenCalled();
  });

  it('#getAssetMedia() should call contentService.post()', () => {
    spyOn(contentService, 'post').and.returnValue(observableOf({}));
    spyOn(sourcingService, 'getAssetMedia').and.callThrough();
    sourcingService.getAssetMedia();
    expect(contentService.post).toHaveBeenCalled();
  });

  it('#createMediaAsset() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(sourcingService, 'createMediaAsset').and.callThrough();
    sourcingService.createMediaAsset();
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#uploadMedia() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(sourcingService, 'uploadMedia').and.callThrough();
    sourcingService.uploadMedia({}, 'do_1234');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#generatePreSignedUrl() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(sourcingService, 'generatePreSignedUrl').and.callThrough();
    sourcingService.generatePreSignedUrl({}, 'do_1234');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#getVideo() should call actionService.get()', () => {
    spyOn(actionService, 'get').and.returnValue(observableOf({}));
    spyOn(sourcingService, 'getVideo').and.callThrough();
    sourcingService.getVideo('do_1234');
    expect(actionService.get).toHaveBeenCalled();
  });

  it('#apiErrorHandling() should call toasterService.error() and telemetryService.error()', () => {
    const errorInfo = {
      errorMsg: 'Something went wrong',
      telemetryPageId: 'dummyPage'
    };
    const  toasterService  = TestBed.get(ToasterService);
    const telemetryService = TestBed.get(TelemetryService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(telemetryService, 'error').and.callThrough();
    spyOn(sourcingService, 'apiErrorHandling').and.callThrough();
    sourcingService.apiErrorHandling(mockError, errorInfo);
    expect(toasterService.error).toHaveBeenCalled();
    expect(telemetryService.error).toHaveBeenCalled();
  });

});
