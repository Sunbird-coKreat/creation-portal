import { ResourceService } from './../../../shared/services/resource/resource.service';
import { ToasterService } from './../../../shared/services/toaster/toaster.service';
import { BrowserCacheTtlService } from './../../../shared/services/browser-cache-ttl/browser-cache-ttl.service';
import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { OnboardPopupComponent } from './onboard-popup.component';
import { By } from '@angular/platform-browser';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';
import { ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import {APP_BASE_HREF} from '@angular/common';

import * as _ from 'lodash-es';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

xdescribe('OnboardPopupComponent', () => {

  let fixture: ComponentFixture<OnboardPopupComponent>;
  let component: OnboardPopupComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, FormsModule, SuiModule, SuiModalModule, SuiProgressModule,
        SuiAccordionModule, TelemetryModule.forRoot(),
        HttpClientTestingModule],
      declarations: [ OnboardPopupComponent ],
      providers: [ResourceService, ToasterService, BrowserCacheTtlService,
        ConfigService, {provide: APP_BASE_HREF, useValue: '/'}]
    })
    .compileComponents();
    fixture = TestBed.createComponent(OnboardPopupComponent);
    component = fixture.componentInstance;
  });


  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should set formFieldOptions value', () => {
    component.formFieldOptions = [];
    component.programDetails = {
      config: {
        onBoardingForm: {
          fields: [{dummy: 'dummy'}]
        }
      }
    };
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.formFieldOptions.length).toEqual(1);
  });

});

