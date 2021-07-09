import { TestBed } from '@angular/core/testing';
import { DialcodeService } from './dialcode.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../config/url.config.json';
import * as labelConfig from '../config/label.config.json';
import { PublicDataService } from '../public-data/public-data.service';
import { ToasterService } from '../toaster/toaster.service';
import { TreeService } from '../tree/tree.service';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';

describe('DialcodeService', () => {
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient, PublicDataService, TreeService, ToasterService, { provide: ConfigService, useValue: configStub }]
    });
  });

  it('should be created', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    expect(service).toBeTruthy();
  });

  it('#reserveDialCode() should reserve dialcode when API success', () => {
    const publicDataService: PublicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({ responseCode: 'ok' }));
    const service: DialcodeService = TestBed.get(DialcodeService);
    const observable = service.reserveDialCode('do_123', 3);
    observable.subscribe((data) => {
      expect(data).toEqual({responseCode: 'ok'});
    });
  });

  it('#linkDialcode() should link dialcode when API success', () => {
    const publicDataService: PublicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({responseCode: 'ok'}));
    const service: DialcodeService = TestBed.get(DialcodeService);
    const observable = service.linkDialcode('do_123', ['ABC', 'BHD']);
    observable.subscribe((data) => {
      expect(data).toEqual({responseCode: 'ok'});
    });
  });

  it('#downloadQRCode() should download dialcode when API success', () => {
    const publicDataService: PublicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of({}));
    const service: DialcodeService = TestBed.get(DialcodeService);
    const observable = service.downloadQRCode('do_123');
    observable.subscribe((data) => {
      expect(data).toEqual({});
    });
  });

  it('#searchDialCode() should fetch dialcode when API success', () => {
    const publicDataService: PublicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    const service: DialcodeService = TestBed.get(DialcodeService);
    const observable = service.searchDialCode('do_123');
    observable.subscribe((data) => {
      expect(data).toEqual({});
    });
  });

  it('#updateDialCode() should not update dialcode when empty', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    const observable = service.updateDialCode([]);
    observable.subscribe((data) => {
      expect(data.isEditable).toBeFalsy();
    });
  });

  it('#updateDialCode() should not call  #searchDialCode when dialcode exists in the #dialcodeList', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'searchDialCode').and.callThrough();
    service.dialcodeList = ['ABC123'];
    const observable = service.updateDialCode(['ABC123']);
    observable.subscribe((data) => {
      expect(data.isEditable).toBeTruthy();
      expect(data.isValid).toBeTruthy();
      expect(service.searchDialCode).not.toHaveBeenCalled();
    });
  });

  it('#updateDialCode() should update the dialcode value ', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'searchDialCode').and.callFake(() => {
      return of({ result: { count: 1, dialcodes: [{ identifier: 'ABC123' }]} });
    });
    const observable = service.updateDialCode(['ABC123']);
    observable.subscribe((data) => {
      expect(data.isEditable).toBeTruthy();
      expect(data.isValid).toBeTruthy();
    });
  });

  it('#clearDialCode() should clear dialcode', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data : { id: 'do_123', metadata: { dialcodes: null } } };
    });
    spyOn(treeService, 'nextTreeStatus').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'searchDialCode').and.callThrough();
    service.clearDialCode();
    expect(treeService.nextTreeStatus).toHaveBeenCalledWith('modified');
  });

  it('#clearDialCode() should remove dialcode from the #dialCodeMap', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data : { id: 'do_123', metadata: { dialcodes: null } } };
    });
    spyOn(treeService, 'nextTreeStatus').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    service.dialCodeMap = { do_123 : 'ABC123' };
    spyOn(service, 'searchDialCode').and.callThrough();
    service.clearDialCode();
    expect(service.dialCodeMap).toEqual({ do_123 : '' });
    expect(treeService.nextTreeStatus).toHaveBeenCalledWith('modified');
  });

  it('#changeDialCode should not call #nextTreeStatus when passing parameter', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data : { id: 'do_123', metadata: { dialcodes: 'XYA1H5' } }};
    });
    spyOn(treeService, 'nextTreeStatus').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    service.changeDialCode('ABC123');
    expect(treeService.nextTreeStatus).not.toHaveBeenCalled();
  });

  it('#changeDialCode should call #nextTreeStatus when passing empty parameter', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data : { id: 'do_123', metadata: { dialcodes: 'XYA1H5' } } };
    });
    spyOn(treeService, 'nextTreeStatus').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    service.dialCodeMap = { do_123 : 'XYA1H5' };
    service.invaliddialCodeMap = { do_123 : 'XYA1H5' };
    service.changeDialCode('');
    expect(treeService.nextTreeStatus).toHaveBeenCalledWith('modified');
  });

  it('#validateDialCode should throw error msg when duplicate dialcode', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'checkDuplicateDialCode').and.returnValue(true);
    const observable = service.validateDialCode('ABC123');
    observable.subscribe((data) => {
      expect(data.isEditable).toBeTruthy();
      expect(data.isValid).toBeFalsy();
      expect(data.statusMsg).toBe('Duplicate QR code');
    });
  });

  it('#validateDialCode should return expected result when dialcode exists in the #dialcodeList', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data : { id: 'do_123', metadata: { dialcodes: 'ABC123' } } };
    });
    spyOn(treeService, 'nextTreeStatus').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'checkDuplicateDialCode').and.returnValue(false);
    service.dialcodeList = ['ABC123'];
    service.invaliddialCodeMap = { do_123 : 'XYA1H5' };
    const observable = service.validateDialCode('ABC123');
    observable.subscribe((data) => {
      expect(data.isEditable).toBeTruthy();
      expect(data.isValid).toBeTruthy();
    });
    expect(treeService.nextTreeStatus).toHaveBeenCalledWith('modified');
  });

  it('#validateDialCode should return expected result when #searchDialCode API success', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data : { id: 'do_123', metadata: { dialcodes: 'ABC123' } } };
    });
    spyOn(treeService, 'nextTreeStatus').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'searchDialCode').and.callFake(() => {
      return of({ result: { count: 1, dialcodes: [{ identifier: 'ABC123' }] } });
    });
    spyOn(service, 'checkDuplicateDialCode').and.returnValue(false);
    service.invaliddialCodeMap = { do_123 : 'XYA1H5' };
    const observable = service.validateDialCode('ABC123');
    observable.subscribe((data) => {
      expect(data.isEditable).toBeTruthy();
      expect(data.isValid).toBeTruthy();
    });
    expect(treeService.nextTreeStatus).toHaveBeenCalledWith('modified');
  });

  it('should highlight node for invalid dialcode', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'highlightNode').and.callFake(() => {});
    spyOn(treeService, 'getNodeById').and.callFake(() => {
      return { data : { id: 'do_123', metadata: { dialcodes: 'ABC123' } } };
    });
    const service: DialcodeService = TestBed.get(DialcodeService);
    const res = { content_id: 'do_456', identifiers: { do_123 : 'do_456' } };
    const nodesModified = { do_123 : { metadata: { dialcodes: null } } };
    service.invaliddialCodeMap = { do_123 : 'XYA1H5' };
    service.dialCodeMap = { do_123 : 'ABC123' };
    service.highlightNodeForInvalidDialCode(res, nodesModified, 'do_123');
    expect(treeService.highlightNode).toHaveBeenCalled();
    expect(treeService.getNodeById).toHaveBeenCalled();
  });

  it('should not call #dialcodeLink method ', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'dialcodeLink').and.callThrough();
    const res = {};
    const nodesModified = {};
    service.highlightNodeForInvalidDialCode(res, nodesModified, 'do_123');
    expect(service.dialcodeLink).not.toHaveBeenCalled();
  });

  it('#checkDuplicateDialCode should return expected', () => {
    const treeService: TreeService = TestBed.get(TreeService);
    spyOn(treeService, 'getTreeObject').and.callFake(() => {});
    const service: DialcodeService = TestBed.get(DialcodeService);
    const result = service.checkDuplicateDialCode('ABC123');
    expect(result).toBeFalsy();
  });

  it('#dialcodeLink() should throw warning msg when #invaliddialCodeMap not empty  ', () => {
    const toasterService: ToasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'warning').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    service.invaliddialCodeMap = { do_123 : 'XYA1H5' };
    service.dialcodeLink([], 'do_123');
    expect(toasterService.warning).toHaveBeenCalledWith(configStub.labelConfig.messages.warning['002']);
  });

  it('#dialcodeLink() should throw warning msg when #invaliddialCodeMap and #dialCodeMap not empty', () => {
    const toasterService: ToasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'warning').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    service.invaliddialCodeMap = { do_123 : 'XYA1H5' };
    service.dialCodeMap = { do_123 : 'ABC123' };
    spyOn(service, 'linkDialcode').and.returnValue(of({}));
    service.dialcodeLink(['ABC123'], 'do_123');
    expect(toasterService.warning).toHaveBeenCalledWith(configStub.labelConfig.messages.warning['002']);
  });

  it('#dialcodeLink() should show success msg when API success', () => {
    const toasterService: ToasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'linkDialcode').and.returnValue(of({}));
    service.dialcodeLink(['ABC123'], 'do_123');
    expect(toasterService.success).toHaveBeenCalledWith(configStub.labelConfig.messages.success['009']);
  });

  it('#dialcodeLink() should throw error msg when API failed', () => {
    const toasterService: ToasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    const service: DialcodeService = TestBed.get(DialcodeService);
    spyOn(service, 'linkDialcode').and.returnValue(throwError({}));
    service.dialcodeLink(['ABC123'], 'do_123');
    expect(toasterService.error).toHaveBeenCalledWith(configStub.labelConfig.messages.error['012']);
  });

});
