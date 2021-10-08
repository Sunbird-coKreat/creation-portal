import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BulkApprovalComponent } from './bulk-approval.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, ConfigService, ToasterService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
import { mockData } from './bulk-approval.component.spec.data'
import { UserService, ProgramsService, ActionService, LearnerService} from '@sunbird/core';
import { HelperService } from '../../services/helper.service';
import { ProgramTelemetryService } from '../../../program/services';

describe('BulkApprovalComponent', () => {
  let component: BulkApprovalComponent;
  let fixture: ComponentFixture<BulkApprovalComponent>;
  const userServiceStub = {
    userProfile : mockData.userProfile,
    channel: '12345',
    appId: 'abcd1234',
    hashTagId: '01309282781705830427'
  };
  const resourceBundle = {
    messages: {
      emsg: {
        blueprintViolation : 'Please provide all required blueprint values'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, TelemetryModule,
        RouterTestingModule, SharedModule.forRoot()],      
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ BulkApprovalComponent ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: ResourceService, useValue: resourceBundle }, BulkJobService,
        ProgramsService, ToasterService, HelperService, DatePipe, CacheService,
        ActionService, ProgramTelemetryService, ConfigService, LearnerService, TelemetryService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkApprovalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('#ngOnChanges() should call ngOnChanges', () => {
    component.initialized = true;
    component.approvalPending = [];
    component.storedCollectionData = [{name: 'dummy'}]
    spyOn(component, 'approvalPendingContents');
    component.ngOnChanges();
    expect(component.showBulkApprovalButton).toBeDefined();
  });
  xit('#bulkApproval() should call bulkApproval', () => {
    spyOn(component, 'sendContentForBulkApproval');
    component.bulkApproval();
    expect(component.sendContentForBulkApproval).toHaveBeenCalled();
  });
 xit('#showApproveBulkModal() should call showApproveBulkModal', () => {
    component.disableBulkApprove = false;
    component.showApproveBulkModal();
    expect(component.showBulkApproveModal).toBeTruthy();
    expect(component.bulkApprovalComfirmation).toBeTruthy();
  });
  xit('#bulkApproval() should call bulkApproval', () => {
    component.disableBulkApprove = false;
    spyOn(component, 'sendContentForBulkApproval').and.callFake (() => {});
    component.bulkApproval();
    expect(component.disableBulkApprove).toBeTruthy();
    expect(component.sendContentForBulkApproval).toHaveBeenCalled();
  });
});
