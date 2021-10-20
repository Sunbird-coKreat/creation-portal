import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '@sunbird/core';
import { TelemetryModule, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { SharedModule, ResourceService, ToasterService, ConfigService, NavigationHelperService} from '@sunbird/shared';
import { OrgReportsComponent } from './org-reports.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsageService } from '@sunbird/dashboard';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import {mockData} from './org-reports.component.spec.data'
import { ProgramTelemetryService } from '../../../program/services';
import { SourcingService } from '../../../sourcing/services';

describe('OrgReportsComponent', () => {
  let component: OrgReportsComponent;
  let fixture: ComponentFixture<OrgReportsComponent>;
  const fakeActivatedRoute = {
    snapshot: { data: {
      roles: 'programSourcingRole',
      telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'list-org-reports' }
    }}
  };
  const userServiceStub = {
    userProfile : mockData.userProfile
  };
  const resourceBundle = mockData.resourceBundle;
  const routerStub = { url: '/sourcing/orgreports' };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ OrgReportsComponent ],
      providers: [ ToasterService, ResourceService, NavigationHelperService, ConfigService, UsageService, 
        ProgramTelemetryService, SourcingService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, { provide: Router, useValue: routerStub },
        {provide: APP_BASE_HREF, useValue: '/'}, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        {provide: UserService, useValue: userServiceStub}, { provide: ResourceService, useValue: resourceBundle }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgReportsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('reportsLocation defaults to: undefined', () => {
    expect(component.reportsLocation).toBeUndefined();
  });
  it('slug defaults to: undefined', () => {
    expect(component.slug).toBeUndefined();
  });
  it('reportFormat defaults to: .csv', () => {
    expect(component.reportFormat).toBe('.csv');
  });

  it('makes expected calls of ngOnInit', () => {
    spyOn(document, 'getElementById').and.callFake( () => {
      return {
          value: 'reports'
      };
    });
    component.ngOnInit();
    expect(component.slug).toBe('sunbird');
    expect(component.reportsLocation).toBe('reports');
    expect(component.telemetryInteractObject).toEqual({});
  });

  it('should call #downloadReport() method', () => {
    const usageService = TestBed.get(UsageService);
    spyOn(usageService, 'getData').and.returnValue(observableOf(mockData.reportReadSuccess));
    spyOn(window, 'open');
    component.downloadReport('TextbookLevel', true);
    expect(window.open).toHaveBeenCalledWith(mockData.reportReadSuccess.result.signedUrl, '_blank');

  });

  it('should throw error when it fails to download', () => {
    const usageService = TestBed.get(UsageService);
    const toasterService = TestBed.get(ToasterService);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    spyOn(usageService, 'getData').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.downloadReport('TextbookLevel', true);
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0076);
  });

  it('should throw error when data not available', () => {
    const usageService = TestBed.get(UsageService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(usageService, 'getData').and.returnValue(observableOf(mockData.reportReadFailed));
    spyOn(toasterService, 'error').and.callThrough();
    component.downloadReport('TextbookLevel', true);
    const resourceService = TestBed.get(ResourceService);
    resourceService.messages = resourceBundle.messages;
    expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0076);
  });

  it('#getPageId() should return pageId', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const pageId = component.getPageId();
    expect(pageId).toBeDefined();
  });

  it('#getTelemetryInteractEdata() should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('download_collection_level_content_gap_report',
    'click', 'launch', 'sourcing_my_projects', undefined);
    expect(returnObj).not.toContain(undefined);
  });

});
