import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadComponent } from './bulk-upload.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ConfigService , BrowserCacheTtlService, ToasterService} from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableError, of } from 'rxjs';

import { UserService, ProgramsService, ActionService, FrameworkService } from '@sunbird/core';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
import { HelperService } from '../../services/helper.service';
import {addParticipentResponseSample, userProfile} from './bulk-upload.component.spec.data';
describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  const errorInitiate = false;
  const userServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError ({
          result: {
            responseCode: 404
          }
        });
      } else {
        return observableOf(addParticipentResponseSample);
      }
    },
    userid: userProfile.userId,
    userProfile : userProfile
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadComponent ],
      imports: [RouterTestingModule, SharedModule.forRoot(), SuiModule, HttpClientTestingModule],
      providers: [
        ResourceService,
        ConfigService, CacheService, TelemetryService,
        UserService,
        ProgramsService, HelperService,
        ActionService, FrameworkService, BulkJobService,
        ToasterService, BrowserCacheTtlService,
        DatePipe,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: UserService, useValue: userServiceStub}
      ],
      schemas: [NO_ERRORS_SCHEMA],

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    component.sampleMetadataCsvUrl = 'bulk-content-upload-format.csv';
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
