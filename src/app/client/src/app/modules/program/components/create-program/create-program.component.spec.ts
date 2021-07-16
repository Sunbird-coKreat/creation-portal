import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService , ToasterService} from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CoreModule, UserService } from '@sunbird/core';
import { CreateProgramComponent } from './create-program.component';
import { CacheService } from 'ng2-cache-service';
import { DatePipe } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { ProgramsService, DataService, FrameworkService, ActionService } from '@sunbird/core';
import { of, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormGroupName, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SourcingService } from './../../../sourcing/services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Component, ViewChild} from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { mockProgramDetails } from './create-program.component.spec.data';

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
      imports: [ReactiveFormsModule, HttpClientTestingModule, FormsModule, CoreModule, TelemetryModule, RouterTestingModule, SharedModule.forRoot(), SuiModule],
      declarations: [CreateProgramComponent],
      providers: [ResourceService, ToasterService, CacheService, ConfigService, DatePipe,
        ProgramsService, DataService, FrameworkService, ActionService,
        Component, ViewChild, Validators, FormGroupName,
        SourcingService, UserService, TelemetryService,
        DeviceDetectorService,
        Subject,
       {provide: ActivatedRoute, useValue: fakeActivatedRoute}]
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
  it('#getAcceptType() should return accept type', ()=> {
    const typeList = "pdf";
    const type = "pdf";
    const result =  component.getAcceptType(typeList, type);
    expect(result).toEqual("pdf/pdf");
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
  it('Should call the #uploadMedia() and getUploadVideo () methods', () => {
    const url = './test.pdf';
    const sourcingService: SourcingService = TestBed.inject(SourcingService);
    spyOn(component, 'getUploadVideo');
    spyOn(sourcingService, 'uploadMedia').and.returnValue(of({
      result : {
        node_id: 123
      }
    }));
    component.updateContentWithURL(url, 'mimeType/pdf', 'do_1129159525832540161668');
    expect(sourcingService.uploadMedia).toHaveBeenCalled();
    expect(component.getUploadVideo).toHaveBeenCalledWith(123);
  });
  it('Should call the fetchFrameWorkDetails method', () => {
    spyOn(component, 'fetchFrameWorkDetails');
    component.fetchFrameWorkDetails();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
  });
  it('Should call the fetchBlueprintTemplate method', () => {
    spyOn(component, 'fetchBlueprintTemplate');
    component.fetchBlueprintTemplate();
    expect(component.fetchBlueprintTemplate).toHaveBeenCalled();
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
  xit('Should call the onChangeTargetCollection method', () => {
    component.callTargetCollection = true;
    component.onChangeTargetCollection();
    expect(component.showTexbooklist).toHaveBeenCalled();
    expect(component.fetchBlueprintTemplate).toHaveBeenCalled();
    expect(component.collectionListForm.value.pcollections).toBeDefined([]);
  });
  xit('Should call the saveAsDraftAndNext method', () => {
    spyOn(component, 'saveAsDraftAndNext');
    component.callTargetCollection = true;
    component.collectionListForm.value.target_collection_category = 'Digital Textbook';
    expect(component.onChangeTargetCollection).toHaveBeenCalled();
  });
  xit('Should call the validateFormBeforePublish method', () => {
    component.collectionListForm.value.pcollections = [];
    const toasterService = TestBed.get(ToasterService);
    component.validateFormBeforePublish();
    expect(toasterService.warning).toHaveBeenCalledWith('Please select at least a one collection');
    expect(component.disableCreateProgramBtn).toBeFalsy();
  });
  it('#getProgramDetails() it should return program details on API success', inject([ProgramsService], (service: ProgramsService) => {
    spyOn(component, 'initializeFormFields');
    spyOn(service, 'get').and.returnValue(of(mockProgramDetails));
    component.getProgramDetails();
    expect(service.get).toHaveBeenCalled();
    expect(component.initializeFormFields).toHaveBeenCalled();
  }))
});
