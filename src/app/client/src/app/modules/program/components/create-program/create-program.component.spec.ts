import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService , ToasterService, NavigationHelperService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { CreateProgramComponent } from './create-program.component';
import { CacheService } from 'ng2-cache-service';
import * as mockData from './create-program.spec.data';
import { DatePipe } from '@angular/common';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { ProgramsService, DataService, FrameworkService, ActionService, ContentService } from '@sunbird/core';
import { of, Subject, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormGroupName, FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SourcingService, HelperService } from './../../../sourcing/services';
import { UserService } from '@sunbird/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment';
import * as alphaNumSort from 'alphanum-sort';
import { Component, ViewChild} from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProgramTelemetryService } from '../../services';

describe('CreateProgramComponent', () => {
  let component: CreateProgramComponent;
  let fixture: ComponentFixture<CreateProgramComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '12345'
      },
      data: {
        telemetry: {
          env: 'workspace', pageid: 'workspace-content-draft', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };
  const userServiceStub = {
    userProfile : mockData.userProfile,
    channel: '12345',
    appId: 'abcd1234',
    hashTagId: '01309282781705830427'
  };

  const resourceBundle = {
    messages: {
      emsg: {
        blueprintViolation : 'Please provide all required blueprint values'
      },
      smsg: {
        questionset: { updated: '' }
      }
    }
  };
  const routerStub = { url: '/sourcing/orgreports' };

  const contentServiceMock = {
    get: (req) => {
      return ({ subscribe: (e) => e(mockData.questionsetReadResp) })
    }
  };
  const actionServiceMock = {
    patch: (req) => {
      return ({ subscribe: (e) => e() })
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, FormsModule, CoreModule, TelemetryModule,
        RouterTestingModule, SharedModule.forRoot(), SuiModule],
      declarations: [CreateProgramComponent],
      providers: [ToasterService, CacheService, ConfigService, DatePipe,
        ProgramsService, DataService, FrameworkService,
        Component, ViewChild, Validators, FormGroupName, FormBuilder, NavigationHelperService,
        SourcingService, ProgramTelemetryService, TelemetryService, HelperService,
        DeviceDetectorService,
        Subject,
       { provide: Router, useValue: routerStub },
       { provide: ActivatedRoute, useValue: fakeActivatedRoute },
       { provide: UserService, useValue: userServiceStub },
       { provide: ContentService, useValue: contentServiceMock },
       { provide: ActionService, useValue: actionServiceMock },
       { provide: ResourceService, useValue: resourceBundle }],
       schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProgramComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('#ngOnInit() should initalize varibles', () => {
    component.enableQuestionSetEditor = undefined;
    component.assetConfig = {pdfFiles: 'sample.pdf'};
    component.openProjectTargetTypeModal = false;
    spyOn(document, 'getElementById').and.returnValue({value: 'data'});
    spyOn(component, 'getPageId').and.callFake(() => {});
    spyOn(component, 'getProgramDetails').and.callFake(() => {});
    spyOn(component, 'initializeProjectTargetTypeForm').and.callFake(() => {});
    spyOn(component, 'initializeCreateProgramForm').and.callFake(() => {});
    spyOn(component, 'initializeProjectScopeForm').and.callFake(() => {});
    spyOn(component, 'setTelemetryStartData').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.enableQuestionSetEditor).toBeDefined();
    expect(component.programId).toBeDefined();
    expect(component.userprofile).toBeDefined();
    expect(component.programConfig).toBeDefined();
    expect(component.localBlueprint).toBeDefined();
    expect(component.localBlueprintMap).toBeDefined();
    expect(component.telemetryInteractObject).toBeDefined();
    expect(component.telemetryInteractPdata).toBeDefined();
    expect(component.telemetryInteractCdata).toBeDefined();
    expect(component.getPageId).toHaveBeenCalled();
    expect(component.getProgramDetails).toHaveBeenCalled();
    expect(component.initializeProjectTargetTypeForm).not.toHaveBeenCalled();
    expect(component.initializeCreateProgramForm).toHaveBeenCalled();
    expect(component.initializeProjectScopeForm).toHaveBeenCalled();
    expect(component.setTelemetryStartData).toHaveBeenCalled();
    expect(component['pageStartTime']).toBeDefined();
  });

  // Failing sometimes due to setTimeOut in implementation
  xit('Should call the initiateDocumentUploadModal method', () => {
    component.showDocumentUploader = false;
    component.loading = true;
    component.isClosable = false;
    spyOn(component, 'initiateUploadModal').and.callFake(() => {});
    spyOn(component, 'initiateDocumentUploadModal').and.callThrough();
    component.initiateDocumentUploadModal();
    expect(component.initiateDocumentUploadModal).toHaveBeenCalled();
    expect(component.showDocumentUploader).toBeTruthy();
    expect(component.loading).toBeFalsy();
    expect(component.isClosable).toBeTruthy();
  });

  it('Should call the getAcceptType method', () => {
    spyOn(component, 'getAcceptType').and.callThrough();
    const returnValue = component.getAcceptType('data1,data2', 'dummyType');
    expect(component.getAcceptType).toHaveBeenCalled();
    expect(returnValue).toEqual('dummyType/data1,data2');
  });

  it('Should call the initiateUploadModal method', () => {
    spyOn(component, 'initiateUploadModal').and.callFake(() => {});
    const returnValue = component.initiateUploadModal();
    expect(component.initiateUploadModal).toHaveBeenCalled();
  });

  it('#uploadContent() should call the uploadDocument method', () => {
    component.uploader = {
      getFile(data) { return true; },
      reset() {}
    };
    spyOn(component, 'uploadDocument').and.callFake(() => {});
    component.uploadContent();
    expect(component.uploadDocument).toHaveBeenCalled();
  });

  it('#uploadContent() should call the uploadDocument method', () => {
    component.uploader = {
      getFile(data) { return null; },
      reset() {}
    };
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    component.uploadContent();
    expect(toasterService.error).toHaveBeenCalled();
  });

  xit('Should call the uploadDocument method', () => {
    component.uploader = {
      getFile(data) { return {type: 'pdf'}; },
      getName(data) { return 'sample.pdf'; },
      reset() {}
    };

    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'generateAssetCreateRequest').and.returnValue({});
    spyOn(sourcingService, 'createMediaAsset').and.returnValue(of({result: {node_id: '12345'}}));
    spyOn(sourcingService, 'generatePreSignedUrl').and.returnValue(of({result: {pre_signed_url: ''}}));
    spyOn(component, 'uploadToBlob').and.callFake(() => {});
    spyOn(component, 'uploadDocument');
    component.uploadDocument();
    expect(component.uploadDocument).toHaveBeenCalled();
    expect(sourcingService.generateAssetCreateRequest).toHaveBeenCalled();
    expect(sourcingService.createMediaAsset).toHaveBeenCalled();
  });

  it('Should call the updateContentWithURL method', () => {
    const url = './test.pdf';
    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'uploadMedia').and.returnValue(of({result: {node_id: '12345'}}));
    spyOn(component, 'getUploadVideo').and.callFake(() => {});
    spyOn(component, 'updateContentWithURL').and.callThrough();
    component.updateContentWithURL(url, 'mimeType/pdf', 'do_1129159525832540161668');
    expect(component.updateContentWithURL).toHaveBeenCalled();
    expect(sourcingService.uploadMedia).toHaveBeenCalled();
    expect(component.getUploadVideo).toHaveBeenCalled();
  });

  it('openContributorListPopup set showContributorsListModal to true', () => {
    component.showContributorsListModal = false;
    spyOn(component, 'openContributorListPopup').and.callThrough();
    component.openContributorListPopup();
    expect(component.showContributorsListModal).toBeTruthy();
  });

  it('closeContributorListPopup set showContributorsListModal to false', () => {
    component.showContributorsListModal = true;
    spyOn(component, 'closeContributorListPopup').and.callThrough();
    component.closeContributorListPopup();
    expect(component.showContributorsListModal).toBeFalsy();
  });
  it('Should call the initializeCreateProgramForm method', () => {
    spyOn(component, 'initializeCreateProgramForm').and.callFake(() => {});
    component.initializeCreateProgramForm();
    expect(component.initializeCreateProgramForm).toHaveBeenCalled();
  });

  xit('getProgramDetails Should call apiErrorHandling method', () => {
    component.programId = 'abcd12345';
    component.telemetryPageId = 'create-program';
    component.telemetryInteractCdata = {};
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'getProgram').and.returnValue(throwError({}));
    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'apiErrorHandling').and.callFake(() => {});
    spyOn(component, 'getProgramDetails').and.callThrough();
    programsService.getProgram();
    expect(programsService.getProgram).toHaveBeenCalled();
    expect(component.programDetails).toEqual({});
    expect(component.selectedTargetCollection).toBeUndefined();
    expect(sourcingService.apiErrorHandling).toHaveBeenCalled();
  });

  it('getUploadVideo Should call sourcingService.getVideo method', () => {
    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'getVideo').and.returnValue(of({result: {content: {}}}));
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callFake(() => {});
    spyOn(component, 'getUploadVideo').and.callThrough();
    component.getUploadVideo('12345');
    expect(sourcingService.getVideo).toHaveBeenCalled();
    expect(toasterService.success).toHaveBeenCalled();
    expect(component.uploadedDocument).toBeDefined();
    expect(component.showDocumentUploader).toBeFalsy();
  });

  xit('getUploadVideo Should call apiErrorHandling method', () => {
    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'getVideo').and.returnValue(throwError({}));
    spyOn(sourcingService, 'apiErrorHandling').and.callFake(() => {});
    spyOn(component, 'getUploadVideo').and.callThrough();
    component.getUploadVideo('12345');
    expect(sourcingService.getVideo).toHaveBeenCalled();
    expect(sourcingService.apiErrorHandling).toHaveBeenCalled();
  });

  it('removeUploadedDocument should set values to null', () => {
    component.uploadedDocument = 'abcd';
    component.guidLinefileName = 'abcd';
    component.programDetails = {guidelines_url: 'abcd'};
    spyOn(component, 'removeUploadedDocument').and.callThrough();
    component.removeUploadedDocument();
    expect(component.uploadedDocument).toBeNull();
    expect(component.guidLinefileName).toBeNull();
    expect(component.programDetails.guidelines_url).toBeNull();
  });

  it('generateAssetCreateRequest should return data', () => {
    const userprofile = {
      userId: '123456789',
      firstName: 'n11',
      lastName: 'yopmail',
      rootOrg : {
        slug: 'sunbird'
      }
    };
    const sourcingService = TestBed.get(SourcingService);
    spyOn(sourcingService, 'generateAssetCreateRequest').and.callThrough();
    const data = sourcingService.generateAssetCreateRequest('abcd', 'pdf', 'pdf', userprofile);
    expect(data).toBeDefined();
  });

  it('uploadToBlob should call programsService.http.put', () => {
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService.http, 'put').and.returnValue(of({data: {}}));
    spyOn(component, 'uploadToBlob').and.callThrough();
    component.uploadToBlob('signedURL', 'file', {});
    expect(programsService.http.put).toHaveBeenCalled();
  });

  it('sortCollection should set variable values', () => {
    component.tempSortCollections = [];
    component.direction = 'asc';
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'sortCollection').and.callFake(() => {});
    spyOn(component, 'sortCollection').and.callThrough();
    component.sortCollection('name');
    expect(component.sortCollection).toHaveBeenCalled();
    expect(programsService.sortCollection).toHaveBeenCalled();
  });

  it('sortChapters should set variable values', () => {
    component.tempSortCollections = [];
    component.chaptersSortDir = 'asc';
    component.textbooks = {'12345': {children: []}};
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'sortCollection').and.callFake(() => {});
    spyOn(component, 'sortChapters').and.callThrough();
    component.sortChapters('12345', 'name');
    expect(component.sortChapters).toHaveBeenCalled();
    expect(programsService.sortCollection).toHaveBeenCalled();
  });

  it('resetSorting should set variable value', () => {
    spyOn(component, 'resetSorting').and.callThrough();
    component.resetSorting();
    expect(component.sortColumn).toEqual('name');
    expect(component.direction).toEqual('asc');
  });

  xit('getMaxDate should return empty string', () => {
    component.editPublished = undefined;
    spyOn(component, 'getMaxDate').and.callThrough();
    const res = component.getMaxDate('nomination_enddate');
    expect(res).toEqual('');
  });

  it('getPageId should return page id', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const page = component.getPageId();
    expect(component.telemetryPageId).toBeDefined();
    expect(page).toBeDefined();
  });

  it('Should call the openForNominations method when type is public', () => {
    component.createProgramForm = new FormGroup({
      nomination_enddate: new FormControl(null),
      shortlisting_enddate: new FormControl(null),
    });
    spyOn(component, 'openForNominations').and.callThrough();
    component.openForNominations('public');
    expect(component.openForNominations).toHaveBeenCalled();
  });

  it('Should call the openForNominations method when type is not public', () => {
    component.createProgramForm = new FormGroup({
      nomination_enddate: new FormControl(null),
      shortlisting_enddate: new FormControl(null),
    });
    spyOn(component, 'openForNominations').and.callThrough();
    component.openForNominations('private');
    expect(component.openForNominations).toHaveBeenCalled();
  });

  it('onContributorSave should call setPreSelectedContributors and closeContributorListPopup', () => {
    spyOn(component, 'closeContributorListPopup').and.callFake(() => {});
    spyOn(component, 'setPreSelectedContributors').and.callFake(() => {});
    spyOn(component, 'onContributorSave').and.callThrough();
    component.onContributorSave({});
    expect(component.onContributorSave).toHaveBeenCalled();
    expect(component.setPreSelectedContributors).toHaveBeenCalled();
    expect(component.closeContributorListPopup).toHaveBeenCalled();
  });

  it('#getCollectionCategoryDefinition() Should call programsService.getCategoryDefinition() method', () => {
    component.selectedTargetCollection = 'Course';
    component.userprofile = {rootOrgId: '12345'};
    component.blueprintTemplate = undefined;
    component.firstLevelFolderLabel = undefined;
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(mockData.objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).toHaveBeenCalled();
    expect(component.blueprintTemplate).toBeDefined();
    expect(component.firstLevelFolderLabel).toBeDefined();
  });

  it('#getCollectionCategoryDefinition() Should not call programsService.getCategoryDefinition() method', () => {
    component.selectedTargetCollection = undefined;
    component.userprofile = {rootOrgId: undefined};
    component.blueprintTemplate = undefined;
    component.firstLevelFolderLabel = undefined;
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(mockData.objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).not.toHaveBeenCalled();
  });

  it('Should call the initializeProjectTargetTypeForm method', () => {
    spyOn(component, 'initializeProjectTargetTypeForm').and.callFake(() => {});
    component.initializeProjectTargetTypeForm();
    expect(component.initializeProjectTargetTypeForm).toHaveBeenCalled();
  });

  it('navigateTo should set showTextBookSelector to false', () => {
    component.stepNo = 1;
    spyOn(component, 'navigateTo').and.callThrough();
    component.navigateTo(component.stepNo);
    expect(component.navigateTo).toHaveBeenCalled();
  });

  it('should call resetFilters', () => {
    component.projectScopeForm = new FormGroup({
      medium: new FormControl('English', Validators.required),
      gradeLevel: new FormControl('Class1', Validators.required),
      subject: new FormControl('Maths', Validators.required),
    });
    spyOn(component, 'resetSorting').and.callFake(() => {});
    spyOn(component, 'showTexbooklist').and.callFake(() => {});
    spyOn(component, 'resetFilters').and.callThrough();
    component.resetFilters();
    expect(component.resetFilters).toHaveBeenCalled();
    expect(component.filterApplied).toBeFalsy();
    expect(component.resetSorting).toHaveBeenCalled();
    expect(component.showTexbooklist).toHaveBeenCalled();
  });

  it('defaultContributeOrgReviewChanged should set variable', () => {
    component.createProgramForm = new FormGroup({
      value: new FormControl({defaultContributeOrgReview: false}, Validators.required)
    });
    component.defaultContributeOrgReviewChecked = false;
    spyOn(component, 'defaultContributeOrgReviewChanged').and.callThrough();
    component.defaultContributeOrgReviewChanged({target: {checked: true}});
    expect(component.defaultContributeOrgReviewChanged).toHaveBeenCalled();
    expect(component.defaultContributeOrgReviewChecked).toBeTruthy();
  });

  it('should call  setValidations', () => {
    spyOn(component, 'setValidations').and.callFake(() => {});
    component.setValidations();
    expect(component.setValidations).toHaveBeenCalled();
  });

  it('should call clearValidations', () => {
    spyOn(component, 'setValidations').and.callFake(() => {});
    component.setValidations();
    expect(component.setValidations).toHaveBeenCalled();
  });

  xit('Should call the onChangeTargetCollectionCategory method', () => {
    component.projectScopeForm.value.pcollections = [{}];
    spyOn(component, 'getCollectionCategoryDefinition').and.callFake(() => {});
    spyOn(component, 'showTexbooklist').and.callFake(() => {});
    component.onChangeTargetCollectionCategory();
    expect(component.showTexbooklist).toHaveBeenCalled();
    expect(component.projectScopeForm.value.pcollections).toEqual([]);
    expect(component.getCollectionCategoryDefinition).toHaveBeenCalled();
    expect(component.tempCollections).toEqual([]);
  });

  it('should call showTexbooklist', () => {
    spyOn(component, 'showTexbooklist').and.callFake(() => {});
    component.showTexbooklist();
    expect(component.showTexbooklist).toHaveBeenCalled();
  });

  it('should call getCollections', () => {
    spyOn(component, 'getCollections').and.callFake(() => {});
    component.getCollections();
    expect(component.getCollections).toHaveBeenCalled();
  });

  it('should call onCollectionCheck', () => {
    spyOn(component, 'onCollectionCheck').and.callFake(() => {});
    component.onCollectionCheck([], true);
    expect(component.onCollectionCheck).toHaveBeenCalled();
  });

  it('addCollectionsDataToConfig should return collection config', () => {
    component.tempCollections = mockData.tempCollections;
    spyOn(component, 'addCollectionsDataToConfig').and.callThrough();
    const collectionConfig = component.addCollectionsDataToConfig();
    expect(collectionConfig).toBeDefined();
  });

  it('getTelemetryInteractEdata should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('1234', 'dummyType', 'dummySubtype', 'create', undefined);
    expect(returnObj).not.toContain(undefined);
  });

  it('should call setTelemetryStartData', () => {
    spyOn(component, 'setTelemetryStartData').and.callFake(() => {});
    component.setTelemetryStartData();
    expect(component.setTelemetryStartData).toHaveBeenCalled();
  });

  xit('generateTelemetryEndEvent should call telemetryService.end', () => {
    component.programId = '3cbbfb00-f66e-11eb-8d22-35d6fc24c6f9';
    component['pageStartTime'] = 0;
    const telemetryService = TestBed.get('TelemetryService');
    spyOn(telemetryService, 'end').and.callFake(() => {});
    spyOn(component, 'generateTelemetryEndEvent').and.callThrough();
    component.generateTelemetryEndEvent('create');
    expect(telemetryService.end).toHaveBeenCalled();
  });

  it('chooseChapters should call getCollectionHierarchy', () => {
    component.textbooks = ['1234'];
    spyOn(component, 'getCollectionHierarchy').and.callFake(() => {});
    spyOn(component, 'chooseChapters').and.callThrough();
    component.chooseChapters({identifier: '12345'});
    expect(component.getCollectionHierarchy).toHaveBeenCalled();
    expect(component.selectChapter).toBeTruthy();
  });

  it('chooseChapters should call initChaptersSelectionForm', () => {
    component.textbooks['12345'] = {};
    spyOn(component, 'initChaptersSelectionForm').and.callFake(() => {});
    spyOn(component, 'chooseChapters').and.callThrough();
    component.chooseChapters({identifier: '12345'});
    expect(component.choosedTextBook).toBeDefined();
    expect(component.initChaptersSelectionForm).toHaveBeenCalled();
    expect(component.selectChapter).toBeTruthy();
  });

  it('editBlueprint should call getCollectionHierarchy', () => {
    component.textbooks = ['1234'];
    spyOn(component, 'getCollectionHierarchy').and.callFake(() => {});
    spyOn(component, 'editBlueprint').and.callThrough();
    component.editBlueprint({identifier: '12345'});
    expect(component.getCollectionHierarchy).toHaveBeenCalled();
    expect(component.editBlueprintFlag).toBeTruthy();
  });

  it('editBlueprint should call initEditBlueprintForm', () => {
    component.textbooks['12345'] = {};
    spyOn(component, 'initEditBlueprintForm').and.callFake(() => {});
    spyOn(component, 'editBlueprint').and.callThrough();
    component.editBlueprint({identifier: '12345'});
    expect(component.choosedTextBook).toBeDefined();
    expect(component.initEditBlueprintForm).toHaveBeenCalled();
    expect(component.editBlueprintFlag).toBeTruthy();
  });

  xit('totalQuestions should return revisedTotalCount', () => {
    component.localBlueprint = {questionTypes: {'type': 5}, totalQuestions: 0};
    spyOn(component, 'totalQuestions').and.callThrough();
    const count = component.totalQuestions();
    expect(count).toEqual(5);
  });

  it('onChangeTopics should call programsService.filterBlueprintMetadata', () => {
    component.blueprintTemplate = {properties: [{code: 'learningOutcomes', name: 'learningOutcomes', options: []}]};
    component.localBlueprint = {topics: {}};
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'filterBlueprintMetadata').and.returnValue(['lo1', 'lo2']);
    spyOn(component, 'onChangeTopics').and.callThrough();
    component.onChangeTopics();
    expect(programsService.filterBlueprintMetadata).toHaveBeenCalled();
  });

  it('mapBlueprintToId should call isBlueprintValid', () => {
    component.editBlueprintFlag = true;
    component.choosedTextBook = {code: '1234'};
    component.localBlueprint = [{}];
    component.localBlueprintMap = {'1234': []};
    spyOn(component, 'isBlueprintValid').and.returnValue(true);
    spyOn(component, 'mapBlueprintToId').and.callThrough();
    component.mapBlueprintToId();
    expect(component.isBlueprintValid).toHaveBeenCalled();
    expect(component.editBlueprintFlag).toBeFalsy();
  });

  xit('mapBlueprintToId should call toasterService.error', () => {
    const toasterService = TestBed.get('ToasterService');
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'isBlueprintValid').and.returnValue(false);
    spyOn(component, 'mapBlueprintToId').and.callThrough();
    component.mapBlueprintToId();
    expect(component.isBlueprintValid).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  xit('initEditBlueprintForm should call programsService.initializeBlueprintMetadata', () => {
    component.choosedTextBook = {};
    component.localBlueprintMap = {};
    component.blueprintTemplate = {properties:
      [
        {code: 'topics', options: []},
        {code: 'learningOutcomes', options: []}
      ]
    };
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'initializeBlueprintMetadata').and.returnValue([['topic1', 'toppic2'], ['lo1', 'lo2']]);
    component.initEditBlueprintForm({});
    expect(programsService.initializeBlueprintMetadata).toHaveBeenCalled();
  });

  it('should call isBlueprintValid', () => {
    spyOn(component, 'isBlueprintValid').and.callFake(() => {});
    component.isBlueprintValid();
    expect(component.isBlueprintValid).toHaveBeenCalled();
  });

  it('initChaptersSelectionForm should call getChapterLevelCount', () => {
    spyOn(component, 'getChapterLevelCount').and.callFake(() => {});
    spyOn(component, 'initChaptersSelectionForm').and.callThrough();
    component.initChaptersSelectionForm({children: [{checked: true}, {checked: false}]});
    expect(component.getChapterLevelCount).toHaveBeenCalled();
  });

  xit('getCollectionHierarchy should call programsService.getContentOriginEnvironment', () => {
    component.programDetails = {config: {collections: []}};
    component.textbooks = {};
    component['programsService'] = TestBed.get(ProgramsService);
    spyOn(component['programsService'], 'getHierarchyFromOrigin').and.returnValue(of(mockData.hierarchyRead));
    spyOn(component, 'initChaptersSelectionForm').and.callFake(() => {});
    spyOn(component, 'getCollectionHierarchy').and.callThrough();
    component.getCollectionHierarchy('do_1133407744582696961763');
    expect(component['programsService'].getHierarchyFromOrigin).toHaveBeenCalled();
  });

  xit('should call updateSelection', () => {
    spyOn(component, 'updateSelection').and.callFake(() => {});
    component.updateSelection('do_1234');
    expect(component.updateSelection).toHaveBeenCalled();
  });

  it('should call getChapterLevelCount', () => {
    spyOn(component, 'getChapterLevelCount').and.callFake(() => {});
    component.getChapterLevelCount({});
    expect(component.getChapterLevelCount).toHaveBeenCalled();
  });

  it('should call onChangeSelection', () => {
    spyOn(component, 'onChangeSelection').and.callFake(() => {});
    component.onChangeSelection();
    expect(component.onChangeSelection).toHaveBeenCalled();
  });

  it('should call saveAsDraftAndNext', () => {
    spyOn(component, 'saveAsDraftAndNext').and.callFake(() => {});
    component.saveAsDraftAndNext({});
    expect(component.saveAsDraftAndNext).toHaveBeenCalled();
  });

  xit('Should call the validateFormBeforePublish method', () => {
    component.projectScopeForm.value.pcollections = [];
    const toasterService = TestBed.get(ToasterService);
    component.validateFormBeforePublish();
    expect(toasterService.warning).toHaveBeenCalledWith('Please select at least a one collection');
    expect(component.disableCreateProgramBtn).toBeFalsy();
  });

  it('should call publishProject', () => {
    spyOn(component, 'publishProject').and.callFake(() => {});
    component.publishProject({});
    expect(component.publishProject).toHaveBeenCalled();
  });

  it('#editTargetNode should set #selectedTargetNodeData and #editTargetObjectFlag', () => {
    component.editTargetObjectForm = mockData.editTargetObjectFormMock;
    component.editTargetNode({"identifier": "do_213469757284712448194"});
    expect(component.selectedTargetNodeData).toEqual(mockData.questionsetReadResp.result.questionset);
    expect(component.editTargetObjectFlag).toBeTruthy();
  });

  it('#valueChanges should set #modifiedNodeData', () => {
    const outputData = {"name": "Test Question Set"};
    component.valueChanges(outputData);
    expect(component.modifiedNodeData).toEqual(outputData);
  });

  it('#updateTargetNode should update QuestionSet', () => {
    component.selectedTargetNodeData = {
      identifier: "do_1234",
      name: 'Question Set',
      instructions: {
        default: 'instructions',
      }
    };
    component.modifiedNodeData = {
      name: 'Question Set',
      instructions: "updated instructions"
    };
    component.tempCollections = [
      {identifier: 'do_1234'}
    ]
    component.userprofile = {
      rootOrgId: '01309282781705830427'
    }
    component.updateTargetNode();
    expect(component.tempCollections).toEqual([
      {
        identifier: "do_1234",
        name: 'Question Set',
        instructions: {
          default: 'updated instructions',
        }
      }
    ]);
    expect(component.editTargetObjectFlag).toBeFalsy();
  });

});
