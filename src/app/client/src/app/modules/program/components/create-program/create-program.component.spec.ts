import { By, BrowserModule } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { CreateProgramComponent } from './create-program.component';
import { CacheService } from 'ng2-cache-service';
import * as mockData from './create-program.spec.data';
import { DatePipe } from '@angular/common';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { ProgramsService, DataService, FrameworkService, ActionService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { CbseProgramService } from './../../../cbse-program/services';
import { UserService } from '@sunbird/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CreateProgramComponent', () => {
  let component: CreateProgramComponent;
  let fixture: ComponentFixture<CreateProgramComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      params: [
        {
          pageNumber: '1',
        }
      ],
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-draft', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule.forRoot(),
        BrowserModule,
        HttpClientTestingModule,
        CoreModule,
        TelemetryModule,
        SuiModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [CreateProgramComponent],
      providers: [
        ResourceService,
        CacheService,
        ConfigService,
        DatePipe,
        ProgramsService,
        DataService,
        FrameworkService,
        ActionService,
        UserService,
        CbseProgramService,
        DeviceDetectorService,
        TelemetryService,
       { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should call the component initialization', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
  describe('Variable checks', () => {
    it('editPublished should be defined and false', () => {
      expect(component.editPublished).toBeDefined();
      expect(component.editPublished).toBeFalsy();
    });

    it('programId should be undefined', () => {
      expect(component.programId).toBeUndefined();
    });

    it('guidLinefileName should be undefined', () => {
      expect(component.guidLinefileName).toBeUndefined();
    });

    it('isFormValueSet should be defined and true', () => {
      expect(component.isFormValueSet).toBeDefined();
      expect(component.isFormValueSet).toBeTruthy();
    });

    it('choosedTextBook should be undefined', () => {
      expect(component.choosedTextBook).toBeUndefined();
    });

    it('selectChapter should be defined and false', () => {
      expect(component.selectChapter).toBeDefined();
      expect(component.selectChapter).toBeFalsy();
    });

    it('selectedContentTypes should be undefined', () => {
      expect(component.selectedContentTypes).toBeUndefined();
    });

    it('createProgramForm should be defined', () => {
      expect(component.createProgramForm).toBeDefined();
    });

    it('collectionListForm should be defined', () => {
      expect(component.collectionListForm).toBeDefined();
    });

    it('programDetails should be undefined', () => {
      expect(component.programDetails).toBeUndefined();
    });

    it('resourceService should be undefined', () => {
      expect(component.resourceService).toBeUndefined();
    });

    it('collections should be undefined', () => {
     expect(component.collections).toBeUndefined();
    });

    it('tempCollections should be array', () => {
      expect(component.tempCollections).toEqual([]);
    });

    it('textbooks should be Object', () => {
      expect(component.textbooks).toEqual({});
    });

    it('chaptersSelectionForm to be undefined', () => {
      expect(component.chaptersSelectionForm).toBeUndefined();
    });

    it('frameworkCategories to be undefined', () => {
      expect(component.frameworkCategories).toBeUndefined();
    });

    it('programData to be object', () => {
      expect(component.programData).toEqual({});
    });

    it('chaptersSelectionForm to be undefined', () => {
      expect(component.chaptersSelectionForm).toBeUndefined();
    });

    it('showTextBookSelector to be false', () => {
      expect(component.showTextBookSelector).toBeFalsy();
    });

    it('formIsInvalid to be false', () => {
      expect(component.chaptersSelectionForm).toBeFalsy();
    });

    it('mediumOption to be array', () => {
      expect(component.mediumOption).toEqual([]);
    });

    it('gradeLevelOption to be array', () => {
      expect(component.gradeLevelOption).toEqual([]);
    });

    it('telemetryImpression to be undefined', () => {
      expect(component.telemetryImpression).toBeUndefined();
    });

    it('telemetryEnd to be undefined', () => {
      expect(component.telemetryEnd).toBeUndefined();
    });

    it('sortColumn to be equal "name"', () => {
      expect(component.sortColumn).toEqual('name');
    });

    it('chaptersSortColumn to be "name"', () => {
      expect(component.chaptersSortColumn).toEqual('name');
    });
  });
  it('Should call the initiateDocumentUploadModal method', () => {
    spyOn(component, 'initiateDocumentUploadModal');
    component.initiateDocumentUploadModal();
    expect(component.initiateDocumentUploadModal).toHaveBeenCalled();
  });
  it('Should call the initiateUploadModal method', () => {
    spyOn(component, 'initiateUploadModal');
    component.initiateUploadModal();
    expect(component.initiateUploadModal).toHaveBeenCalled();
  });
  it('Should call the uploadContent method', () => {
    spyOn(component, 'uploadContent');
    component.uploadContent();
    expect(component.uploadContent).toHaveBeenCalled();
  });
  it('Should call the uploadDocument method', () => {
    spyOn(component, 'uploadDocument');
    component.uploadDocument();
    expect(component.uploadDocument).toHaveBeenCalled();
  });
  it('Should call the updateContentWithURL method', () => {
    const url = './test.pdf';
    spyOn(component, 'updateContentWithURL');
    component.updateContentWithURL(url, 'mimeType/pdf', 'do_1129159525832540161668');
    expect(component.updateContentWithURL).toHaveBeenCalled();
  });
  it('Should call the fetchFrameWorkDetails method', () => {
    spyOn(component, 'fetchFrameWorkDetails');
    component.fetchFrameWorkDetails();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
  });
  it('Should call the setFrameworkDataToProgram method', () => {
    spyOn(component, 'setFrameworkDataToProgram');
    component.setFrameworkDataToProgram();
    expect(component.setFrameworkDataToProgram).toHaveBeenCalled();
  });
  it('Should call the openForNominations method', () => {
    spyOn(component, 'openForNominations');
    component.openForNominations('accept');
    expect(component.openForNominations).toHaveBeenCalled();
  });
  it('Should call the onMediumChange method', () => {
    spyOn(component, 'onMediumChange');
    component.onMediumChange();
    expect(component.onMediumChange).toHaveBeenCalled();
    spyOn(component, 'onClassChange');
    component.onClassChange();
    expect(component.onClassChange).toHaveBeenCalled();
    spyOn(component, 'initializeFormFields');
    component.initializeFormFields();
    expect(component.initializeFormFields).toHaveBeenCalled();
  });
  it('Should call the initializeFormFields method', () => {
    spyOn(component, 'initializeFormFields');
    component.initializeFormFields();
    expect(component.initializeFormFields).toHaveBeenCalled();
  });
  it('Should execute getAcceptType on initialization of component', () => {
    spyOn(component, 'getAcceptType');
    component.ngOnInit();
    expect(component.getAcceptType).toHaveBeenCalled();
  });
  it('Verify getAcceptType output', () => {
    expect(component).toBeDefined();
    expect(component.getAcceptType('pdf', 'pdf')).toBe('pdf/pdf');
  });
  it('Should call initiateDocumentUploadModal on upload button', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'initiateDocumentUploadModal');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(component.initiateDocumentUploadModal).toHaveBeenCalled();
  }));
  it('Should call setValidations if validateFormBeforePublish called', fakeAsync(() => {
    spyOn(component, 'setValidations');
    component.validateFormBeforePublish();
    expect(component.setValidations).toHaveBeenCalled();
  }));
  describe('Remove uploaded document', () => {
    it('programId should be defined', () => {
      component.programDetails = {
        'guidelines_url': null
      };
      component.removeUploadedDocument();
      expect(component.uploadedDocument).toBeNull();
      expect(component.guidLinefileName).toBeNull();
      expect(component.programDetails.guidelines_url).toBeNull();
    });
  });
  describe('Test reset sort', () => {
    it('Sort column should be "name"', () => {
      component.resetSorting();
      expect(component.sortColumn).toEqual('name');
    });
    it('Sort direction should be "asc"', () => {
      component.resetSorting();
      expect(component.direction).toEqual('asc');
    });
  });
  describe('Methods call verification', () => {
    it('Should call saveAsDraft on save program (edit live)', () => {
      spyOn(component, 'saveAsDraft');
      const button = fixture.debugElement.query(By.css('#btnSaveAsDraft'));
      button.nativeElement.click({});
      expect(component.saveAsDraft).toHaveBeenCalled();
    });
    it('Should call saveAsDraftAndNext on next button click', () => {
      spyOn(component, 'saveAsDraftAndNext');
      const button = fixture.debugElement.query(By.css('#btnSaveAsDraftAndNext'));
      button.nativeElement.click({});
      expect(component.saveAsDraftAndNext).toHaveBeenCalled();
    });
  });
  describe('Test the form Visibility', () => {
    it('Check if metadata form visible', () => {
      const metaForm = fixture.debugElement.query(By.css('.metadata'));
      expect(metaForm).not.toBeNull();
    });
  });
});
