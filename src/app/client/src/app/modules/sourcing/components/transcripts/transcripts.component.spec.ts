import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { TranscriptsComponent } from './transcripts.component';
import { contentMetaData, dummyItems} from './transcripts.component.spec.data';
import { ResourceService, ToasterService, SharedModule, ConfigService, ServerResponse,
  UtilService, BrowserCacheTtlService, NavigationHelperService } from '@sunbird/shared';
import { HelperService } from '../../../sourcing/services/helper.service';
import { TranscriptService } from '../../../core/services/transcript/transcript.service';
import { SourcingService } from '../../../sourcing/services/sourcing/sourcing.service';
import { ActionService, SearchService, ContentHelperService } from '@sunbird/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TelemetryService } from '@sunbird/telemetry';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { of } from 'rxjs';
describe('TranscriptsComponent', () => {
  let component: TranscriptsComponent;
  let fixture: ComponentFixture<TranscriptsComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
           env: 'program'
          }
        }
      }
    };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ TranscriptsComponent ],
      providers: [ActionService,
                  HelperService,
                  TranscriptService,
                  SourcingService,
                  SearchService,
                  ToasterService,
                  ConfigService,
                  ResourceService,
                  UntypedFormBuilder,
                  TelemetryService,
                  {provide: APP_BASE_HREF, useValue: '/'},
                  {provide: ActivatedRoute, useValue: fakeActivatedRoute},
                  {provide: Router, useValue: RouterStub},
                  CacheService,
                  BrowserCacheTtlService,
                  DatePipe
                ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(TranscriptsComponent);
    component = fixture.componentInstance;
    component.contentMetaData = contentMetaData;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('ngOnInit should call contentRead', () => {
    spyOn(component, 'getAssetList').and.callFake(() => {});
    spyOn(component, 'hideLoader').and.callFake(() => {});
    spyOn(component, 'setFormValues').and.callFake(() => {});
    spyOn(component, 'addItem').and.callFake(() => {});
    spyOn(component, 'contentRead').and.callFake(() => of(contentMetaData));
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit()
    expect(component.contentRead).toHaveBeenCalled();
    expect(component.hideLoader).toHaveBeenCalled();
    expect(component.setFormValues).toHaveBeenCalled();
    expect(component.addItem).toHaveBeenCalled();
    expect(component.getAssetList).toHaveBeenCalled();
  });

/*   it('getLanguage should return data', () => {
    spyOn(component.items, 'controls').and.returnValue({} as any);
    spyOn(component, 'getLanguage').and.callThrough();
    const language = component.getLanguage(0);
    expect(language).toEqual('dummyData');
  }); */

  it('attachFile should set file', () => {
    spyOn(component, 'setFile').and.callFake(() => {});
    spyOn(component, 'getLanguageControl').and.callFake(() => {return {value: true} as any});
    spyOn(component, 'fileValidation').and.callFake(()=> {return true});
    spyOn(component, 'getFileNameControl').and.callFake(() => { return {patchValue(data) {}} as any});
    spyOn(component, 'enableDisableAddItemButton').and.callFake(() => {});
    spyOn(component, 'attachFile').and.callThrough();
    component.attachFile({target: {files: ['example.srt']}},0);
    expect(component.setFile).toHaveBeenCalled();
    expect(component.enableDisableAddItemButton).toHaveBeenCalled();
  });

  it('fileValidation should call detectMimeType', () => {
    spyOn(component, 'detectMimeType').and.callThrough();
    component.acceptedFileFormats = ['srt'];
    spyOn(component, 'fileValidation').and.callThrough();
    const retunedValue = component.fileValidation({name: 'example.srt'});
    expect(retunedValue).toBeTruthy();
  });

  it('detectMimeType should return mimeType', () => {
    spyOn(component, 'detectMimeType').and.callThrough();
    const returnedMimeType = component.detectMimeType('srt');
    expect(returnedMimeType).toEqual('application/x-subrip');
  })

  it('reset should call enableDisableAddItemButton', () => {
    component.disableDoneBtn = true;
    spyOn(component, 'getFileControl').and.callFake(() => { return {reset() {}} as any});
    spyOn(component, 'getFileNameControl').and.callFake(() => { return {reset() {}}as any});
    spyOn(component, 'getLanguageControl').and.callFake(() => { return {reset() {}} as any});
    spyOn(component, 'enableDisableAddItemButton').and.callFake(() => {});
    spyOn(component, 'reset').and.callThrough();
    component.reset(0);
    expect(component.disableDoneBtn).toBeFalsy();
    expect(component.enableDisableAddItemButton).toHaveBeenCalled();
  });

  it('download should call window.open', () => {
    component.contentMetaData = contentMetaData;
    spyOn(window, 'open').and.returnValue({} as any);
    spyOn(component, 'download').and.callThrough();
    component.download(contentMetaData.transcripts[0]['identifier']);
    expect(window.open).toHaveBeenCalled();
  });

  it('setFormValues should call addItem', () => {
    spyOn(component, 'addItem').and.callFake(() => {});
    spyOn(component, 'setFormValues').and.callThrough();
    component.setFormValues(contentMetaData.transcripts);
    expect(component.addItem).toHaveBeenCalled();
  })

  xit('addItem should add data in items', () => {
    component.disableAddItemBtn = false;
    spyOn(component, 'createItem').and.returnValue({} as any);
    spyOn(component, 'addItem').and.callThrough();
    component.addItem({});
    expect(component.createItem).toHaveBeenCalled();
    expect(component.disableAddItemBtn).toBeTruthy();
  });

  it('uploadToBlob should call transcriptService.http.put', () => {
    const transcriptService = TestBed.get(TranscriptService);
    spyOn(transcriptService.http, 'put').and.callFake(() => {});
    spyOn(component, 'uploadToBlob').and.callThrough();
    component.uploadToBlob({result: {pre_signed_url: ''}}, {get(){return {file: []}}});
    expect(transcriptService.http.put).toHaveBeenCalled();
  });

  it('generatePreSignedUrl should call sourcingService.generatePreSignedUrl', () => {
    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'generatePreSignedUrl').and.callFake(() => {});
    spyOn(component,  'generatePreSignedUrl').and.callThrough();
    component.generatePreSignedUrl({result: {identifier: '12345'}}, {
      get(data?){
        return {
          value: 'https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11341940189214310411914/en_1_5mg.mp4'
        }
      }
    });
    expect(sourcingService.generatePreSignedUrl).toHaveBeenCalled();
  });

  it('updateAssetWithURL should call sourcingService.uploadAsset', () => {
    component.mimeType = 'application/x-subrip';
    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'uploadAsset').and.callFake(() => {});
    spyOn(component, 'updateAssetWithURL').and.callThrough();
    component.updateAssetWithURL({preSignedResponse: {result: {pre_signed_url: contentMetaData.transcripts[0]['artifactUrl']}}});
    expect(sourcingService.uploadAsset).toHaveBeenCalled();
  })

  it('updateContent should call helperService.updateContent', () => {
    component.contentMetaData = contentMetaData;
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'updateContent').and.callFake(() => {});
    spyOn(component, 'updateContent').and.callThrough();
    component.updateContent(contentMetaData.transcripts);
    expect(helperService.updateContent).toHaveBeenCalled();
  });

  it('getAssetList should call searchService.compositeSearch', () => {
    component.contentMetaData = contentMetaData;
    const searchService = TestBed.get(SearchService);
    spyOn(searchService, 'compositeSearch').and.callFake(() => {
      return of({
        responseCode: 'OK',
        result: {
          content: {}
        }
      })
    });
    spyOn(component, 'getAssetList').and.callThrough();
    spyOn(component, 'hideLoader').and.callFake(() => {});
    component.getAssetList();
    expect(searchService.compositeSearch).toHaveBeenCalled();
  });

  it('showLoader should set loader to true', () => {
    component.loader = false;
    spyOn(component, 'showLoader').and.callThrough();
    component.showLoader();
    expect(component.loader).toBeTruthy();
  });

  it('hideLoader should set loader to false', () => {
    component.loader = true;
    spyOn(component, 'hideLoader').and.callThrough();
    component.hideLoader();
    expect(component.loader).toBeFalsy();
  });

  it('#close() should emit closePopup event', () => {
    spyOn(component.closePopup, 'emit').and.callFake(() => {});
    spyOn(component, 'close').and.callThrough();
    component.close();
    expect(component.closePopup.emit).toHaveBeenCalled();
  });
});
