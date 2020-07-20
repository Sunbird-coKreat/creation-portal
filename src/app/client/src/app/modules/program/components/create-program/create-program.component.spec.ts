import { InterpolatePipe } from '@sunbird/shared';
import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { FrameworkService, UserService, ExtPluginService } from '@sunbird/core';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProgramComponent } from './create-program.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import * as SpecData from './create-program.component.spec.data';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../../telemetry/services/telemetry/telemetry.service';
import {  NavigationHelperService } from '@sunbird/shared';

let errorInitiate;

describe("Create program component on boarding test", () => {

    let component: CreateProgramComponent;
    let fixture: ComponentFixture<CreateProgramComponent>;

    class RouterStub {
        navigate = jasmine.createSpy('navigate');
      }

    const fakeActivatedRoute = {
        snapshot: {
            params: {
            programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
            },
            data: {
            telemetry: {
                env: 'programs'
            }
            }
        }
    };

    const config = {
      urlConFig : {
        URLS: {
          PUBLIC_PREFIX: "http://localhost:3000"
        }
      },
      appConfig : {
        TELEMETRY :{
          PID: ""
        }
      }
    };

    const userServiceStub = {
      get() {
        if (errorInitiate) {
          return throwError ({
            result: {
              responseCode: 404
            }
          });
        } else {
          return of(SpecData.addParticipentResponseSample);
        }
      },
      userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
      userProfile :  {
        'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
        "userRegData": {},
      }
    };

    const frameworkServiceStub = {
      initialize() {
        return null;
      },
      frameworkData$:  of(SpecData.frameWorkData)
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [
            SuiModule,
            ReactiveFormsModule,
            FormsModule,
            TelemetryModule.forRoot(),
            HttpClientTestingModule,
            RouterTestingModule
          ],
          declarations: [
            InterpolatePipe,
            CreateProgramComponent,
            OnboardPopupComponent
          ],
          providers: [
            TelemetryService,
            {
              provide: TELEMETRY_PROVIDER, useValue: EkTelemetry
            },
            {
              provide: Router,
              useClass: RouterStub
            }, {
              provide: FrameworkService,
              useValue: frameworkServiceStub
            },
            {
              provide : NavigationHelperService,
            },
            {
              provide: UserService,
              useValue: userServiceStub
            },
            {
              provide: ConfigService,
              useValue: config
            },
            {
              provide: CacheService,
            },
            {
              provide: BrowserCacheTtlService,
            },
            {
              provide: ToasterService,
            },
            {
              provide: ActivatedRoute,
              useValue: fakeActivatedRoute
            },
            {
              provide: ResourceService,
            },
            {
              provide: ExtPluginService,
            },
            {
              provide: DatePipe,
            }
          ]
        }).compileComponents();
      }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateProgramComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});