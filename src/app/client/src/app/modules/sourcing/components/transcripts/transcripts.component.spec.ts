import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranscriptsComponent } from './transcripts.component';
import { contentMetaData} from './transcripts.component.spec.data';
import { ResourceService, ToasterService, SharedModule, ConfigService, ServerResponse, 
  UtilService, BrowserCacheTtlService, NavigationHelperService } from '@sunbird/shared';
import { HelperService } from '../../../sourcing/services/helper.service';
import { TranscriptService } from '../../../core/services/transcript/transcript.service';
import { SourcingService } from '../../../sourcing/services/sourcing/sourcing.service';
import { ActionService, SearchService, ContentHelperService } from '@sunbird/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TelemetryService } from '@sunbird/telemetry';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
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
  beforeEach(async(() => {
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
                  FormBuilder,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptsComponent);
    component = fixture.componentInstance;
    component.contentMetaData = contentMetaData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});