import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import {
    SharedModule, ResourceService, IUserProfile, NavigationHelperService,
    ConfigService, BrowserCacheTtlService, ToasterService
} from '@sunbird/shared';
import { UserService, ActionService, ProgramsService } from '@sunbird/core';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { FormsModule, ReactiveFormsModule, NgForm, FormGroup, UntypedFormBuilder} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { McqCreationComponent } from './mcq-creation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { ProgramTelemetryService } from '../../../program/services';
import { TelemetryService } from '../../../telemetry/services/telemetry/telemetry.service';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { SanitizeHtmlPipe } from '../../pipe/sanitize-html.pipe';
import { validMcqFormData, invalidMcqFormData } from './mcq-creation.component.spec.data';
import { McqForm } from './../../class/McqForm';
import { HelperService } from '../../services/helper.service';
import { SourcingService } from '../../services/sourcing/sourcing.service';

xdescribe('McqCreationComponent', () => {
    let component: McqCreationComponent;
    let fixture: ComponentFixture<McqCreationComponent>;
    const UserServiceStub = {
        userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
        userProfile: {
          firstName: 'Creator',
          lastName: 'ekstep'
        },
        slug: 'custchannel'
      };
      class RouterStub {
        navigate = jasmine.createSpy('navigate');
        url = jasmine.createSpy('url');
      };
  
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, SharedModule.forRoot()
                , FormsModule, ReactiveFormsModule, TelemetryModule, SuiModule, HttpClientTestingModule],
            declarations: [McqCreationComponent, SanitizeHtmlPipe],
            providers: [
                ResourceService, HttpClient, ChangeDetectorRef,
                ConfigService, ActionService, SourcingService, ,
                ToasterService, BrowserCacheTtlService, UntypedFormBuilder,
                DatePipe, TelemetryService, NavigationHelperService, 
                ProgramTelemetryService, ProgramsService, HelperService,
                {provide: Router, useValue: RouterStub},
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: UserService, useValue: UserServiceStub },
                {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}},
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();
        fixture = TestBed.createComponent(McqCreationComponent);
        component = fixture.componentInstance;
    });
    afterEach(() => {
        fixture.destroy();
      });
    
    it('should create McqCreationComponent', () => {
        expect(component).toBeTruthy();
    });
    it('should create McqCreationComponent', () => {
        spyOn(component, 'handleEditorError').and.callThrough();
        component.handleEditorError(true);
        expect(component.handleEditorError).toHaveBeenCalled();
        expect(component.isEditorThrowingError).toBe(true);
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
    it('#deleteSolution() should call deleteSolution and set showSolutionDropDown value', () => {
        component.deleteSolution();
        expect(component.showSolutionDropDown).toBeTruthy();
    });
    it('#closeRequestChangeModal() should call closeRequestChangeModal', () => {
        component.questionMetaData = {
            data: {
                rejectComment: 'reject'
            }
        };
        spyOn(component, 'closeRequestChangeModal').and.callThrough();
        component.closeRequestChangeModal();
        expect(component.showRequestChangesPopup).toBeFalsy();
        expect(component.rejectComment).toBeDefined();
    });
    it('#onFormValueChange should call onFormValueChange and emit event', () => {
        spyOn(component.questionFormChangeStatus, 'emit');
        spyOn(component, 'onFormValueChange').and.callThrough();
        component.onFormValueChange(true);
        expect(component.questionFormChangeStatus.emit).toHaveBeenCalledWith({ 'status': false });
    });
    it('#getMedia() should call getMedia', () => {
        const mediaArr = [{ id: '100' }, { id: '101' }];
        component.mediaArr = mediaArr;
        const media = { id: '100' };
        spyOn(component, 'getMedia').and.callThrough();
        component.getMedia(media);
        expect(component.mediaArr).toEqual(mediaArr);
    });
    it('#getMedia() should call getMedia', () => {
        const mediaArr = [{ id: '100' }, { id: '101' }];
        component.mediaArr = mediaArr;
        const media = { id: '103' };
        spyOn(component, 'getMedia').and.callThrough();
        component.getMedia(media);
        expect(component.mediaArr.length).toEqual(3);
    });
    it('#validateCurrentQuestion() return true', () => {
        component.mcqForm = new McqForm(validMcqFormData, {});
        const isFormValid = component.validateCurrentQuestion();
        expect(isFormValid).toBeTruthy();
    });

    it('#validateCurrentQuestion() return false', () => {
        component.mcqForm = new McqForm(invalidMcqFormData, {});
        const isFormValid = component.validateCurrentQuestion();
        expect(component.showFormError).toBeTruthy();
        expect(component.showPreview).toBeFalsy();
        expect(isFormValid).toBeFalsy();
    });
});
