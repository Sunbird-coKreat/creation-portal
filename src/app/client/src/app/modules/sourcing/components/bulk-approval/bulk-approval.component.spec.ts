import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkApprovalComponent } from './bulk-approval.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { SharedModule, ResourceService, ConfigService , BrowserCacheTtlService, ToasterService} from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF, DatePipe } from '@angular/common';

describe('BulkApprovalComponent', () => {
  let component: BulkApprovalComponent;
  let fixture: ComponentFixture<BulkApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[RouterTestingModule, SharedModule.forRoot(), TelemetryModule, SuiModule, HttpClientTestingModule],
      declarations: [ BulkApprovalComponent ],
      providers: [
        ResourceService,
        ConfigService, CacheService,
        ToasterService, BrowserCacheTtlService,
        DatePipe, TelemetryService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkApprovalComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#ngOnChanges() should call ngOnChanges', () => {
    component.initialized = true;
    component.approvalPending = [];
    component.storedCollectionData = [{name: 'dummy'}]
    spyOn(component, 'approvalPendingContents');
    component.ngOnChanges();
    expect(component.showBulkApprovalButton).toBeDefined();
  });
  it('#bulkApproval() should call bulkApproval', () => {
    spyOn(component, 'sendContentForBulkApproval');
    component.bulkApproval();
    expect(component.sendContentForBulkApproval).toHaveBeenCalled();
  });
  it('#showApproveBulkModal() should call showApproveBulkModal', () => {
    component.disableBulkApprove = false;
    component.showApproveBulkModal();
    expect(component.showBulkApproveModal).toBeTruthy();
    expect(component.bulkApprovalComfirmation).toBeTruthy();
  });
  it('#bulkApproval() should call bulkApproval', () => {
    component.disableBulkApprove = false;
    spyOn(component, 'sendContentForBulkApproval').and.callFake (() => {});
    component.bulkApproval();
    expect(component.disableBulkApprove).toBeTruthy();
    expect(component.sendContentForBulkApproval).toHaveBeenCalled();
  });
});
