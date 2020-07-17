import { InterpolatePipe } from '@sunbird/shared';
import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { FrameworkService, UserService, ExtPluginService } from '@sunbird/core';

// import { DynamicModule } from 'ng-dynamic-component';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
let errorInitiate;
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProgramComponent } from './create-program.component';
import { OnboardPopupComponent } from '../onboard-popup/onboard-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray, FormGroupName } from '@angular/forms';
// import { DateFormatPipe, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe } from './pipes';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

// RouterNavigationService, ServerResponse,
import {  NavigationHelperService } from '@sunbird/shared';
// import { FineUploader } from 'fine-uploader';
// import { ProgramsService, DataService, ActionService } from '@sunbird/core';
// import { Subscription, Subject, Observable } from 'rxjs';
// import { tap, first, map, takeUntil, catchError, count } from 'rxjs/operators';
// import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
// import * as _ from 'lodash-es';
// import { IProgram } from './../../../core/interfaces';
// import { CbseProgramService } from './../../../cbse-program/services';
// import { programConfigObj } from './programconfig';
// import { HttpClient } from '@angular/common/http';
// import { IImpressionEventInput, IInteractEventEdata, IStartEventInput, IEndEventInput } from '@sunbird/telemetry';
// import { DeviceDetectorService } from 'ngx-device-detector';
// import * as moment from 'moment';
// import * as alphaNumSort from 'alphanum-sort';
// import { ProgramTelemetryService } from '../../services';

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
            {
              provide: Router,
              useClass: RouterStub
            }, {
              provide: FrameworkService,
            },
            {
              provide : NavigationHelperService,
            },
            {
              provide: UserService,
            },
            {
              provide: ConfigService,
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

    it('should have a defined component', () => {
        expect(component.addition()).toBe(10);
    });
});