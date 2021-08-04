import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialcodeComponent } from './dialcode.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { DialcodeService } from '../../services/dialcode/dialcode.service';
import { of, throwError } from 'rxjs';
import { mockData } from './dialcode.component.spec.data';
import { ConfigService } from '../../services/config/config.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { HttpClient } from '@angular/common/http';

describe('DialcodeComponent', () => {
  let component: DialcodeComponent;
  let fixture: ComponentFixture<DialcodeComponent>;
  const configServiceData = {
    labelConfig: {
      messages: {
        success: {
          '010' : 'QR code generated.',
          '011': 'QR codes downloaded'
        },
        error: {
          '013' : 'No new QR Codes have been generated!'
        },
        info : {
          '001' : 'QR code image generation is in progress. Please try downloading after sometime'
       }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      declarations: [ DialcodeComponent, TelemetryInteractDirective ],
      providers: [TreeService, DialcodeService, { provide: ConfigService, useValue: configServiceData}, ToasterService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialcodeComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial data after calls ngOnInit', () => {
    spyOn(component, 'setQRCodeCriteria').and.callThrough();
    spyOn(component, 'treeStatusListener').and.callThrough();
    component.ngOnInit();
    expect(component.setQRCodeCriteria).toHaveBeenCalled();
    expect(component.treeStatusListener).toHaveBeenCalled();
  });

  it('#setQRCodeCriteria() should not set min and max dialcode length', () => {
    component.setQRCodeCriteria();
    expect(component.minQRCode).toBe(2);
    expect(component.maxQRCode).toBe(250);
  });

  it('#setQRCodeCriteria() should set #dialcodeMinLength and #dialcodeMaxLength', () => {
    const treeService = TestBed.get(TreeService);
    treeService.config = { dialcodeMinLength: 5, dialcodeMaxLength: 100 };
    component.setQRCodeCriteria();
    expect(component.minQRCode).toBe(5);
    expect(component.maxQRCode).toBe(100);
  });

  it('#dialcodeControl should has required validator', () => {
    expect(component.dialcodeControl).toBeUndefined();
    component.setQRCodeCriteria();
    const control: AbstractControl = component.dialcodeControl;
    expect(component.dialcodeControl).toBeDefined();
    expect(control.hasError('required')).toBeTruthy();
  });

  it('#dialcodeControl should has max length validator', () => {
    expect(component.dialcodeControl).toBeUndefined();
    component.setQRCodeCriteria();
    const control: AbstractControl = component.dialcodeControl;
    expect(component.dialcodeControl).toBeDefined();
    control.setValue(400);
    expect(control.hasError('max')).toBeTruthy();
  });

  xit('#treeStatusListener() should set to true disables the download QR button', () => {
    const treeService = TestBed.get(TreeService);
    treeService.nextTreeStatus('saved');
    component.treeStatusListener();
    expect(component.disableQRGenerateBtn).toBeTruthy();
  });

  it('#resolveQRDownloadBtn() should enables the QR download button  ', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { qrCodeProcessId: '0123'} } };
    });
    component.resolveQRDownloadBtn();
    expect(component.disableQRDownloadBtn).toBeTruthy();
  });

  it('#resolveQRDownloadBtn() should disables the QR download button  ', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { } } };
    });
    component.resolveQRDownloadBtn();
    expect(component.disableQRDownloadBtn).toBeFalsy();
  });

  it('#doQRCodeCount() should count #request and #reserve based on data', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getTreeObject').and.callFake(() => {
      return { visit(cb) { cb({ data: { metadata: { dialcodeRequired: 'Yes'} } }); } };
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { reservedDialcodes: ['ABC'] } } };
    });
    component.doQRCodeCount();
    expect(component.qrCodeCount).toEqual( { request: 1, reserve: 1});
  });

  it('#openRequestPopup() should call #reserveDialCode method ', () => {
    spyOn(component, 'reserveDialCode').and.callFake(() => {});
    component.qrCodeCount.request = 1;
    component.openRequestPopup();
    expect(component.reserveDialCode).toHaveBeenCalledWith(2);
  });

  it('#openRequestPopup() should open dialcode modal ', () => {
    spyOn(component, 'reserveDialCode').and.callFake(() => {});
    component.setQRCodeCriteria();
    component.openRequestPopup();
    expect(component.showQRCodePopup).toBeTruthy();
  });

  it('#submitDialcodeForm() should submit dialcode form with valid data', () => {
    spyOn(component, 'reserveDialCode').and.callFake(() => {});
    component.setQRCodeCriteria();
    const control: AbstractControl = component.dialcodeControl;
    control.setValue(2);
    component.submitDialcodeForm();
    expect(component.showQRCodePopup).toBeFalsy();
    expect(component.reserveDialCode).toHaveBeenCalledWith(2);
  });

  it('#reserveDialCode() should reserve dialcode when API success', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callThrough();
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getTreeObject').and.callFake(() => {
      return { visit(cb) { cb({ data: { metadata: { dialcodeRequired: 'Yes'} } }); } };
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { reservedDialcodes: ['ABC'], qrCodeProcessId: '1234' } } };
    });
    const dialcodeService = TestBed.get(DialcodeService);
    spyOn(dialcodeService, 'reserveDialCode').and.returnValues(of(mockData.dialcodeReserveSuccess));
    component.reserveDialCode(1);
    expect(component.isGeneratingQRCodes).toBeFalsy();
    expect(toasterService.success).toHaveBeenCalledWith(configServiceData.labelConfig.messages.success['010']);
  });

  it('#reserveDialCode() should thorw error msg when API failed', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getTreeObject').and.callFake(() => {
      return { visit(cb) { cb({ data: { metadata: { dialcodeRequired: 'Yes'} } }); } };
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { reservedDialcodes: ['ABC'], qrCodeProcessId: '1234' } } };
    });
    const dialcodeService = TestBed.get(DialcodeService);
    spyOn(dialcodeService, 'reserveDialCode').and.returnValues(throwError({error: mockData.dialcodeReserveFailed}));
    component.reserveDialCode(1);
    expect(component.isGeneratingQRCodes).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(configServiceData.labelConfig.messages.error['013']);
  });

  it('#downloadQRCodes() should show info msg if status is #in-process', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'info').and.callThrough();
    const dialcodeService = TestBed.get(DialcodeService);
    spyOn(dialcodeService, 'downloadQRCode').and.returnValues(of(mockData.downloadQRcodeInProcess));
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { qrCodeProcessId: '0123'} } };
    });
    component.downloadQRCodes();
    expect(toasterService.info).toHaveBeenCalledWith(configServiceData.labelConfig.messages.info['001']);
  });

  it('#downloadQRCodes() should download QR codes', () => {
    component.contentId = 'do_123';
    spyOn(component, 'downloadFile').and.callThrough();
    const dialcodeService = TestBed.get(DialcodeService);
    spyOn(dialcodeService, 'downloadQRCode').and.returnValues(of(mockData.downloadQRcodeCompleted));
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { qrCodeProcessId: '0123', name: 'test'} } };
    });
    component.downloadQRCodes();
    expect(component.downloadFile).toHaveBeenCalled();
  });

  it('#contentMetadata() should return expected data', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: { name: 'test'} } };
    });
    const result = component.contentMetadata;
    expect(result).toEqual({ name: 'test'});
  });

  it('#downloadFile() should download the file', () => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callThrough();
    spyOn(URL, 'createObjectURL').and.callFake((data) => {});
    const http = TestBed.get(HttpClient);
    spyOn(http, 'get').and.returnValue(of({ test: 'ok' }));
    component.downloadFile(mockData.downloadQRcodeCompleted.result.url, 'test');
    expect(http.get).toHaveBeenCalled();
    expect(http.get).toHaveBeenCalledTimes(1);
    expect(http.get).toHaveBeenCalledWith(mockData.downloadQRcodeCompleted.result.url, { responseType: 'blob' });
    expect(toasterService.success).toHaveBeenCalledWith(configServiceData.labelConfig.messages.success['011']);
  });

  it('#keyPressNumbers() should return expected data', () => {
    const result = component.keyPressNumbers({key : 12, preventDefault() {}} as any);
    expect(result).toBeFalsy();
    const result1 = component.keyPressNumbers({key : 2, preventDefault() {}} as any);
    expect(result1).toBeTruthy();
  });

});
