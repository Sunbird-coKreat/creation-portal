import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkUploadComponent } from './bulk-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CacheService } from 'ng2-cache-service';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService, NavigationHelperService, SharedModule } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { UserService, FrameworkService, ProgramsService, ContentService, NotificationService } from '@sunbird/core';
import { SourcingService } from '../../services';
import { ProgramStageService } from '../../../program/services';
import { HelperService } from '../../services/helper.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;

  let debugElement: DebugElement;
  const UserServiceStub = {
    userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
    userProfile: {
      firstName: 'Creator',
      lastName: 'ekstep'
    },
    slug: 'custchannel'
  };
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '12345'
      },
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-draft', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), SharedModule.forRoot(), HttpClientModule],
      declarations: [ BulkUploadComponent ],
      providers: [ConfigService, TelemetryService, CacheService, CollectionHierarchyService,
        BrowserCacheTtlService, ToasterService, ResourceService, DatePipe, NavigationHelperService,
        FrameworkService, ProgramsService, ContentService, ProgramStageService, HelperService,
        SourcingService, NotificationService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: UserService, useValue: UserServiceStub }, HttpClient],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
