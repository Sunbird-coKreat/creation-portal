import { ResourceService } from './../../../shared/services/resource/resource.service';
import { ToasterService } from './../../../shared/services/toaster/toaster.service';
import { BrowserCacheTtlService } from './../../../shared/services/browser-cache-ttl/browser-cache-ttl.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardPopupComponent } from './onboard-popup.component';
import { By } from '@angular/platform-browser';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';
import { ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import {APP_BASE_HREF} from '@angular/common';

import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CacheService } from 'ng2-cache-service';

describe('OnboardPopupComponent', () => {

  let fixture: ComponentFixture<OnboardPopupComponent>;
  let component: OnboardPopupComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, FormsModule, SuiModule, SuiModalModule, SuiProgressModule,
        SuiAccordionModule, TelemetryModule.forRoot(),
        HttpClientTestingModule],
      declarations: [ OnboardPopupComponent ],
      providers: [ResourceService, ToasterService, BrowserCacheTtlService, CacheService, ConfigService, {provide: APP_BASE_HREF, useValue: '/'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardPopupComponent);
    component = fixture.componentInstance;
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

});

