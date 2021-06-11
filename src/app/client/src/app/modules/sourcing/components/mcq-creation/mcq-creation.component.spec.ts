import { TelemetryService } from '../../../telemetry/services/telemetry/telemetry.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { McqCreationComponent } from './mcq-creation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProgramTelemetryService } from '../../../program/services';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import {
    SharedModule, ResourceService, IUserProfile, NavigationHelperService,
    ConfigService, BrowserCacheTtlService, ToasterService
} from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SanitizeHtmlPipe } from '../../pipe/sanitize-html.pipe';
import { UserService, ActionService, ProgramsService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { SourcingService } from '../../services';
import { HelperService } from '../../services/helper.service';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';

describe('McqCreationComponent', () => {
    let component: McqCreationComponent;
    let fixture: ComponentFixture<McqCreationComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, SharedModule.forRoot()
                , FormsModule, ReactiveFormsModule, TelemetryModule, SuiModule, HttpClientTestingModule],
            declarations: [McqCreationComponent, SanitizeHtmlPipe],
            providers: [
                ResourceService,
                ConfigService,
                ToasterService, BrowserCacheTtlService,
                DatePipe, TelemetryService,
                ProgramTelemetryService,
                { provide: APP_BASE_HREF, useValue: '/' }
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(McqCreationComponent);
        component = fixture.componentInstance;
    });
    it('should create McqCreationComponent', () => {
        expect(component).toBeTruthy();
    });
    it('#videoDataOutput() should call videoDataOutput and event data is empty', () => {
        const event = '';
        spyOn(component, 'deleteSolution');
        component.videoDataOutput(event);
        expect(component.deleteSolution).toHaveBeenCalled();
    });
    it('#videoDataOutput() should call videoDataOutput and event data is not  empty', () => {
        const event = { name: 'event name', identifier: '1234' };
        component.videoDataOutput(event);
        expect(component.videoSolutionData).toBeDefined();
    });
    it('#videoDataOutput() should call videoDataOutput for thumbnail', () => {
        const event = { name: 'event name', identifier: '1234', thumbnail: 'sample data' };
        component.videoDataOutput(event);
        expect(component.videoSolutionData).toBeDefined();
    });
    it('#videoDataOutput() should call videoDataOutput for thumbnail', () => {
        const event = { name: 'event name', identifier: '1234', thumbnail: 'sample data' };
        component.videoDataOutput(event);
        expect(component.videoSolutionData).toBeDefined();
    });
});
