import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkUploadComponent } from './bulk-upload.component';
import { SuiPopupModule, SuiModule } from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';
import { DatePipe } from '@angular/common';
import { ContentService, UserService, LearnerService, CoreModule } from '@sunbird/core';
import { By } from '@angular/platform-browser';
import {
  SharedModule, ResourceService, ConfigService, PaginationService,
  ToasterService, ServerResponse, BrowserCacheTtlService
} from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
xdescribe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SuiPopupModule,
        SuiModule,
        TelemetryModule,
        SharedModule,
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [ BulkUploadComponent ],
      providers: [
        ConfigService,
        ResourceService,
        CacheService,
        {provide: APP_BASE_HREF, useValue: '/'},
        BrowserCacheTtlService,
        ToasterService,
        DatePipe,
        TelemetryService,
        UserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    component.sessionContext = {
      collection: 'do_123456789',
      telemetryPageDetails: {
        telemetryPageId: 'bulk-upload'
      }};
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});