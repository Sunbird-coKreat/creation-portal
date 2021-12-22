import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule } from '@sunbird/telemetry';
import { TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { AccessibilityInfoComponent } from './accessibility-info.component';
import { ActionService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgramTelemetryService } from '../../../program/services';
import { SourcingService } from '../../services';
import { APP_BASE_HREF, DatePipe } from '@angular/common';

describe('AccessibilityInfoComponent', () => {
  let component: AccessibilityInfoComponent;
  let fixture: ComponentFixture<AccessibilityInfoComponent>;
  const resourceServiceStub = {
    messages: {
      fmsg: {
        m0076: 'Please Fill Mandatory Fields!',
      },
      smsg: {
        m0060: 'Content added to Hierarchy Successfully...'
      }
    }
  };

  const activatedRouteStub = {
    snapshot: {
      data: {
        telemetry: { env: 'env' }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, TelemetryModule, HttpClientTestingModule, SharedModule],
      declarations: [ AccessibilityInfoComponent ],
      providers: [TelemetryService, ConfigService, ActionService, ToasterService, ProgramTelemetryService,
          SourcingService, { provide: ResourceService, useValue: resourceServiceStub },
         { provide: ActivatedRoute, useValue: activatedRouteStub }, { provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessibilityInfoComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
