import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardPopupComponent } from './onboard-popup.component';
import { By } from '@angular/platform-browser';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { TelemetryModule, TelemetryInteractDirective } from '@sunbird/telemetry';
import { ConfigService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as _ from 'lodash-es';

describe('OnboardPopupComponent', () => {

  let fixture: ComponentFixture<OnboardPopupComponent>;
  let component: OnboardPopupComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModalModule, SuiProgressModule,
        SuiAccordionModule, TelemetryModule.forRoot(),
        HttpClientTestingModule],
      declarations: [ OnboardPopupComponent ],
      providers: [ ConfigService ]
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

