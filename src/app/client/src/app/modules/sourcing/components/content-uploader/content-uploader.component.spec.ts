import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUploaderComponent } from './content-uploader.component';
import { By } from '@angular/platform-browser';
import { DebugElement, ChangeDetectorRef} from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { TelemetryModule } from '@sunbird/telemetry';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableError, of } from 'rxjs';
import { ActionService, PlayerService, FrameworkService, UserService, NotificationService, ProgramsService, ContentService,
  CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { RouterTestingModule } from '@angular/router/testing';
import {contentUploadComponentInput, contentMetaData, contentMetaData1, playerConfig, frameworkDetails,
             licenseDetails, updateContentResponse, getPreSignedUrl,
             contentUploadComponentInput1, userProfile, addParticipentResponseSample} from './content-uploader.component.data';
import { HelperService } from '../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash-es';
import { SourcingService } from '../../services';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { AzureFileUploaderService } from '../../services';

// Following describe method is for 'PREVIEW' scenario
xdescribe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
  // tslint:disable-next-line:prefer-const
  let errorInitiate;
    // tslint:disable-next-line:prefer-const
  const actionServiceStub = {
    patch() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf('Success');
      }
    },
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(contentMetaData);
      }
    }
  };

  const playerServiceStub = {
    getConfig() {
        return playerConfig;
    }
  };

  const frameWorkServiceStub = {
    initialize() {
      return null;
    },
    frameworkData$: observableOf(frameworkDetails)
  };

  const helperServiceStub = {
    getLicences() {
        return observableOf(licenseDetails);
    },
    updateContent() {
      return observableOf(updateContentResponse);
    },
    reviewContent() {
      return observableOf('success');
    }
  };

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

  const userServiceStub = {
    userProfile: {
      userId: '123456789'
    }
  };
  const activatedRouteStub = {
    data: of({
      config: {
        question_categories: [
          'vsa',
          'sa',
          'la',
          'mcq'
        ]
      }
    }),
    snapshot: {
      root: { firstChild: { data: { telemetry: { env: 'env' } } } },
      data: {
        telemetry: { env: 'env' }
      }
    }
  };

  beforeEach(async(() => {
    //helperService = jasmine.createSpy('HelperService');
    // helperService.getNotification();
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule, SharedModule],
      declarations: [ ContentUploaderComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService, SourcingService, ProgramsService,
         TelemetryService, DatePipe, ProgramStageService, ProgramTelemetryService, ChangeDetectorRef, NotificationService,
         AzureFileUploaderService, ContentService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub },
                  { provide: HelperService, useValue: helperServiceStub }, { provide: ResourceService, useValue: resourceServiceStub },
                  { provide: UserService, useValue: userServiceStub },
                  { provide: ActivatedRoute, useValue: activatedRouteStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUploaderComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
    //debugElement = fixture.debugElement;
    component.contentUploadComponentInput = contentUploadComponentInput;
    component.sessionContext = contentUploadComponentInput.sessionContext;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create ContentUploaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should not execute saveContent if Mandatory Form-fields are empty', () => {
    component.ngOnInit();
    debugElement
      .query(By.css('#saveContent'))
      .triggerEventHandler('click', null);
      expect(component.contentDetailsForm.get('bloomslevel').touched).toBeTruthy();
      expect(component.contentDetailsForm.get('bloomslevel').errors.required).toBeTruthy();
  });

  it('should execute saveContent after successful validation of Form without calling sendForReview', () => {
    component.contentDetailsForm.get('bloomslevel').patchValue([{bloomslevel: 'Knowledge (Remembering)'}]);
    component.editTitle = 'Explanation Content Test1';
     fixture.detectChanges();
     spyOn(component, 'sendForReview');
     debugElement
      .query(By.css('#saveContent'))
      .triggerEventHandler('click', null);
     expect(component.sendForReview).not.toHaveBeenCalled();
  });

  it('should execute sendForReview before successful saveContent', () => {
    component.contentDetailsForm.get('bloomslevel').patchValue([{bloomslevel: 'Knowledge (Remembering)'}]);
    component.editTitle = 'Explanation Content Test1';
     fixture.detectChanges();
     spyOn(component, 'sendForReview');
     debugElement
      .query(By.css('#submitContent'))
      .triggerEventHandler('click', null);
     expect(component.sendForReview).toHaveBeenCalled();
  });

  it('should Preview be playing, when even clicked on changeFile', () => {
    component.showUploadModal = true;
    fixture.detectChanges();
    spyOn(component, 'showPreview');
    debugElement
    .query(By.css('#changeContent'))
    .triggerEventHandler('click', null);
    expect(component.showPreview).toBeTruthy();
  });

});

// Following describe method is for fresh 'UPLOAD' scenario
xdescribe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let collectionHierarchyService: CollectionHierarchyService;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
    // tslint:disable-next-line:prefer-const
  let errorInitiate;
    // tslint:disable-next-line:prefer-const
  let errorInitiate1;
  const actionServiceStub = {
    patch() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf('Success');
      }
    },
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(contentMetaData);
      }
    },
    http: {
      put() {
        return observableOf('success');
      }
    },
    post() {
      return observableOf(getPreSignedUrl);
    }
  };

  const playerServiceStub = {
    getConfig() {
        return playerConfig;
    }
  };
  const helperServiceStub = {
    getLicences() {
      return observableOf(licenseDetails);
    },
    publishContent() {
      return observableOf({
        result: { node_id: '123'}
      });
    },
    submitRequestChanges() {
      return observableOf({
        result: { node_id: '123'}
      });
    },
    initializeFormFields() {
      return [{code: 'name'}];
    },
    validateFormConfiguration() {
      return false;
    }
  };
  const frameWorkServiceStub = {
    initialize() {
      return null;
    },
    frameworkData$: observableOf(frameworkDetails)
  };

  const userServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError ({
          result: {
            responseCode: 404
          }
        });
      } else {
        return observableOf(addParticipentResponseSample);
      }
    },
    userid: userProfile.userId,
    userProfile : userProfile
  };
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
    data: of({
      config: {
        question_categories: [
          'vsa',
          'sa',
          'la',
          'mcq'
        ]
      }
    }),
    snapshot: {
      root: { firstChild: { data: { telemetry: { env: 'env' } } } },
      data: {
        telemetry: { env: 'env' }
      }
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule, SharedModule, CoreModule ],
      declarations: [ ContentUploaderComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService, SourcingService, ProgramsService,
         TelemetryService, DatePipe, ProgramStageService, ProgramTelemetryService, ChangeDetectorRef, NotificationService,
         AzureFileUploaderService, ContentService, DeviceDetectorService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub },
                  { provide: HelperService, useValue: helperServiceStub }, { provide: ResourceService, useValue: resourceServiceStub },
                  { provide: UserService, useValue: userServiceStub },
                  { provide: ActivatedRoute, useValue: activatedRouteStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUploaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    contentUploadComponentInput.action = '';
    component.contentUploadComponentInput = contentUploadComponentInput;
    collectionHierarchyService = TestBed.get(CollectionHierarchyService);
    component.sessionContext = {targetCollectionFrameworksData: {
      framework: 'cbse_framework'
    }};
    // fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should throw error if upload is clicked without browsing files', () => {
    spyOn(component.toasterService, 'error');
    debugElement
      .query(By.css('#uploadContent'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.error).toHaveBeenCalledWith('File is required to upload');
  });

  xit('should upload successfully on select of file', () => {
    component.uploader = {
      getFile() {
        return {uploadedFile: 'dummy'};
      },
      getName() {
        return 'Sample.pdf';
      }
    };
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#uploadContent'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).toHaveBeenCalledWith('Content Successfully Uploaded...');
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
    component.contentMetaData = {name: 'test content'};
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

// Following describe method is for 'REVIEWER' role scenario
xdescribe('ContentUploaderComponent', () => {
  let component: ContentUploaderComponent;
  let fixture: ComponentFixture<ContentUploaderComponent>;
  let debugElement: DebugElement;
  // tslint:disable-next-line:prefer-const
  let errorInitiate;
  // tslint:disable-next-line:prefer-const
  let errorInitiate1;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(contentMetaData1);
      }
    }
  };

  const playerServiceStub = {
    getConfig() {
        return playerConfig;
    }
  };

  const frameWorkServiceStub = {
    initialize() {
      return null;
    },
    frameworkData$: observableOf(frameworkDetails)
  };

  const helperServiceStub = {
    getLicences() {
      return observableOf(licenseDetails);
    },
    publishContent() {
      return observableOf({
        result: { node_id: '123'}
      });
    },
    submitRequestChanges() {
      return observableOf({
        result: { node_id: '123'}
      });
    }
  };
  const collectionServiceStub = {
    addResourceToHierarchy() {
      return observableOf('success');
    }
  };

  const userServiceStub = {
    userProfile: {
      userId: '123456789'
    }
  };
  const resourceServiceStub = {
    messages: {
      smsg: {
        m0063: 'Content Published Successfully...',
        m0062: 'Content sent for changes Successfully...'
      }
    }
  };

  let helperService: any;

  beforeEach(async(() => {
    helperService = jasmine.createSpy('HelperService');
    // helperService.getNotification();
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule, PlayerHelperModule,
                  RouterTestingModule, TelemetryModule],
      declarations: [ ContentUploaderComponent ],
      providers: [ ConfigService, UtilService, ToasterService, TelemetryService, PlayerService, ResourceService,
                  CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }, NavigationHelperService,
                  { provide: PlayerService, useValue: playerServiceStub }, { provide: FrameworkService, useValue: frameWorkServiceStub },
                  { provide: HelperService, useValue: helperServiceStub }, {provide: UserService, useValue: userServiceStub},
                  { provide: CollectionHierarchyService, useValue: collectionServiceStub},
                  // tslint:disable-next-line:max-line-length
                  { provide: ResourceService, useValue: resourceServiceStub }, {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}}],
    schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUploaderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.contentUploadComponentInput = contentUploadComponentInput1;
    fixture.detectChanges();
  });

  it('should be success when reviewer publishes content', () => {
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#publishContent'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).toHaveBeenCalledWith('Content Published Successfully...');
  });

  it('should not be able to reject content without comments', () => {
    spyOn(helperServiceStub, 'submitRequestChanges');
    debugElement
      .query(By.css('#requestChanges'))
      .triggerEventHandler('click', null);
      expect(helperServiceStub.submitRequestChanges).not.toHaveBeenCalled();
  });

});
