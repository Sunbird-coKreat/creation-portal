import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditorComponent } from './content-editor.component';
import { contentEditorComponentInput, playerConfig } from './content-editor.spec.data';
import { ActionService, PlayerService, FrameworkService, UserService } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { TelemetryService } from '@sunbird/telemetry';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, ConfigService, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HelperService } from '../../services/helper.service';

describe('ContentEditorComponent', () => {
  let component: ContentEditorComponent;
  let fixture: ComponentFixture<ContentEditorComponent>;

  const userServiceStub = {
    userProfile: {
      userId: '123456789',
      firstName: 'abc',
      lastName: 'xyz',
      organisationIds: ['Org01']
    }
  };

  const collectionHierarchyServiceStub = {
    addResourceToHierarchy() {
      return of('success');
    }
  };

  const playerServiceStub = {
    getConfig() {
      return playerConfig;
    },
    getContent() {
      return of({
        result: {
          content: {
            status: 'Review'
          }
        }
      });
    },
    updateContentBodyForReviewer(data) {
      return data;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlayerHelperModule, SuiModule, FormsModule, RouterTestingModule, TelemetryModule],
      declarations: [ ContentEditorComponent ],
      providers: [ConfigService, ResourceService, BrowserCacheTtlService, TelemetryService, NavigationHelperService, UtilService,
        ToasterService, {provide: CollectionHierarchyService, useValue: collectionHierarchyServiceStub},
                   {provide: UserService, useValue: userServiceStub}, {provide: PlayerService, useValue: playerServiceStub},
                   {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}},
                   HelperService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditorComponent);
    component = fixture.componentInstance;
    component.contentEditorComponentInputs = contentEditorComponentInput;
    // fixture.detectChanges();
    component.getDetails = jasmine.createSpy('getDetails() spy').and.callFake(() => {
      return of({tenantDetails: { titleName: 'sunbird', logo: 'http://localhost:3000/assets/images/sunbird_logo.png'},
                 ownershipType: ['createdBy']});
    });
    component.sessionContext = {targetCollectionFrameworksData: {
      framework: 'cbse_framework'
    }};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('#validateFormConfiguration() should call helperService.validateFormConfiguration', () => {
    component.formFieldProperties = [{code: 'name', name: 'name' }];
    const  helperService  = TestBed.get(HelperService);
    spyOn(component, 'validateFormConfiguration').and.callThrough();
    spyOn(helperService, 'initializeFormFields').and.returnValue([{code: 'name'}]);
    spyOn(component, 'showEditDetailsForm').and.callThrough();
    spyOn(helperService, 'validateFormConfiguration').and.returnValue(false);
    component.validateFormConfiguration();
    expect(helperService.validateFormConfiguration).toHaveBeenCalled();
    expect(component.showEditDetailsForm).toHaveBeenCalled();
  });

  it ('#showEditDetailsForm() should call helperService.initializeFormFields', () => {
     const sampleFieldArray = [{code: 'name', name: 'name' }];
     const sampleFieldArrayWithData = [{code: 'name', name: 'name', default: 'test content'}];
    component.formFieldProperties = sampleFieldArray;
    component.contentData = {name: 'test content'};
    const  helperService  = TestBed.get(HelperService);
    spyOn(helperService, 'initializeFormFields').and.returnValue(sampleFieldArrayWithData);
    spyOn(component, 'showEditDetailsForm').and.callThrough();
    component.showEditDetailsForm();
    expect(helperService.initializeFormFields).toHaveBeenCalled();
    expect(component.formFieldProperties).toBe(sampleFieldArrayWithData);
    expect(component.showEditMetaForm).toBeTruthy();
  });

  it ('#formStatusEventListener() should set formstatus value', () => {
    const statusEvent = {isValid: true};
    spyOn(component, 'formStatusEventListener').and.callThrough();
    component.formStatusEventListener(statusEvent);
    expect(component.formstatus).toBe(statusEvent);
  });

  it ('#getFormData() should set formInputData value', () => {
    const formInput = {name: 'test content'};
    spyOn(component, 'formStatusEventListener').and.callThrough();
    component.getFormData(formInput);
    expect(component.formInputData).toBe(formInput);
  });

});
