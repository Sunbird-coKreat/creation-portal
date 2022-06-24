import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentListComponent } from './content-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { UserService, ProgramsService, DataService, FrameworkService, SearchService, ContentHelperService } from '@sunbird/core';
import { of, Subject, throwError } from 'rxjs';
import { Validators, FormGroupName, FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SourcingService, HelperService } from './../../../sourcing/services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Component, ViewChild } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash-es';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import * as mockData from './content-list.component.spec.data';

describe('ContentListComponent', () => {
  let component: ContentListComponent;
  let fixture: ComponentFixture<ContentListComponent>;

  const userServiceStub = {
    userProfile: mockData.userProfile,
    channel: '12345',
    appId: 'abcd1234',
    hashTagId: '01309282781705830427'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, FormsModule, CoreModule, TelemetryModule,
        RouterTestingModule, SharedModule.forRoot(), SuiModule, MatDialogModule],
      declarations: [ContentListComponent],
      providers: [ToasterService, CacheService, ConfigService,
        ProgramsService, DataService, FrameworkService,
        Component, ViewChild, Validators, FormGroupName, FormBuilder, NavigationHelperService,
        SourcingService, TelemetryService, HelperService,
        DeviceDetectorService,
        Subject,
        SearchService,
        MatDialog,
        HelperService,
        FrameworkService,
        ContentHelperService,
        ProgramStageService,
        { provide: UserService, useValue: userServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(ContentListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should initalize variables', () => {
    component['userService'] = TestBed.inject(UserService);
    component['programStageService'] = TestBed.inject(ProgramStageService);
    spyOn(component, 'userRoles').and.callFake(() => { });
    spyOn(component, 'getPageId').and.callFake(() => { });
    spyOn(component['programStageService'], 'getStage').and.returnValue(of({ result: { stages: 'identifier' } }));
    spyOn(component, 'changeView').and.callFake(() => { });
    spyOn(component['programStageService'], 'addStage').and.callFake(() => { });
    component.ngOnInit();
    expect(component['programStageService'].getStage).toHaveBeenCalled();
    expect(component['currentStage']).toBeDefined();
  });

  it('#showResourceTemplate() should show Resource Template', () => {
    component['frameworkService'] = TestBed.inject(FrameworkService);
    spyOn(component['frameworkService'], 'readChannel').and.returnValue(of(mockData.readChannelMockResponse));
    spyOn(component, 'setProgramandSessionContext').and.callFake(() => { });
    component.showResourceTemplate();
    expect(component['showPrimaryCategoriesModal']).toBeTruthy();
  });

  it('#getFacets() should get Facets when selectedTab is published ', () => {
    component.selectedTab = 'published';
    component['searchService'] = TestBed.inject(SearchService);
     spyOn(component['searchService'], 'compositeSearch').and.returnValue(of(mockData.getFacetsMockResponse));
    component.getFacets();
    expect(component['searchService'].compositeSearch).toHaveBeenCalled();
  });
  
  it('#getContents() should get Contents', () => {
    component.showLoader = true;
    component.selectedTab = 'published';
    component['searchService'] = TestBed.inject(SearchService);
     spyOn(component['searchService'], 'compositeSearch').and.returnValue(of(mockData.getFacetsMockResponse));
    component.getContents('');
    expect(component['searchService'].compositeSearch).toHaveBeenCalled();
  });

  it('#openContent() should open Content', () => {
    component['frameworkService'] = TestBed.inject(FrameworkService);
    component['contentHelperService'] = TestBed.inject(ContentHelperService);
    spyOn(component['frameworkService'], 'readChannel').and.returnValue(of(mockData.readChannelMockResponse));
    
    spyOn(component, 'setProgramandSessionContext').and.callFake(() => { });
    spyOn(component['contentHelperService'], 'initialize').and.callFake(() => { });
    spyOn(component['contentHelperService'], 'openContent').and.returnValue(of({}));
    spyOn(component, 'setContentComponent').and.callFake(() => { });
    
    component.openContent('');
    expect(component['contentHelperService'].initialize).toHaveBeenCalled();
  
  });

  it('#deleteContent() should delete Content', () => {
    component['helperService'] = TestBed.inject(HelperService);
    spyOn(component['helperService'], 'retireContent').and.returnValue(of({ result: { node_id: 'node_id' } }));
    component.itemToDelete = { identifier: 'kk' };
    component.list =  { identifier: 'kk' };
    component.deleteContent();
    expect(component['helperService'].retireContent).toHaveBeenCalled();
  });

  it('#handleCategorySelection() should handle Category Selection', () => {
    component['contentHelperService'] = TestBed.inject(ContentHelperService);
    
    spyOn(component['contentHelperService'], 'initialize').and.callFake(() => { });
    spyOn(component['contentHelperService'], 'handleContentCreation').and.returnValue(Promise.resolve(true));
    spyOn(component, 'setContentComponent').and.callFake(() => { });
    component.handleCategorySelection({});
    expect(component['contentHelperService'].handleContentCreation).toHaveBeenCalled();
  });

  it('#setContentComponent() should set Content Component', () => {
    component['programStageService'] = TestBed.inject(ProgramStageService);
    spyOn( component['programStageService'], 'addStage').and.callFake(() => { });
    component.setContentComponent({});
    expect( component['programStageService'].addStage).toHaveBeenCalled();
  });
  
  
  

});
