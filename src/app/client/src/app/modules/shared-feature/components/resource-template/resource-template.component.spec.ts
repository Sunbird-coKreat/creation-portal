import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { resourceTemplateComponentInput } from './resource-template.data';
import { ResourceTemplateComponent } from './resource-template.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CacheService } from 'ng2-cache-service';
import { throwError } from 'rxjs';
import { ProgramTelemetryService } from '../../../program/services';
import { ConfigService, ResourceService, ToasterService, BrowserCacheTtlService } from '@sunbird/shared';
import { UserService, ProgramsService } from '@sunbird/core';

const routerStub = {
  navigate: jasmine.createSpy('navigate')
};
const fakeActivatedRoute = {
  snapshot: {
    queryParams: {
      dialCode: 'D4R4K4'
    },
    data: {
      telemetry: { env: 'programs' }
    }
  }
};
const userStub = {
  user_id: 'abcd1234'
};
const resourceBundle = {
  messages: {
    emsg: {
      m0027: 'Something went wrong while fetching the category details',
      m0026: 'The mimetypes are not configured for the selected category.'
    }
  }
};
describe('ResourceTemplateComponent', () => {
  let component: ResourceTemplateComponent;
  let fixture: ComponentFixture<ResourceTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, TelemetryModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ResourceTemplateComponent],
      providers: [ ProgramTelemetryService, ConfigService, TelemetryService, ResourceService, CacheService, BrowserCacheTtlService, ToasterService, DatePipe, ProgramsService, DatePipe,
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle },
        { provide: UserService, useValue: userStub },
        { provide: APP_BASE_HREF, useValue: '/' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTemplateComponent);
    component = fixture.componentInstance;
    component.resourceTemplateComponentInput = resourceTemplateComponentInput;
    component.unitIdentifier = 'do_1131700101604311041350';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showButton should be false on component initialize', () => {
    expect(component.showButton).toBeFalsy();
  });

  it('#ngOnInit() ngOnInit should be called', () => {
    spyOn(component.programTelemetryService, 'getTelemetryInteractObject');
    spyOn(component.programTelemetryService, 'getTelemetryInteractPdata');
    component.resourceTemplateComponentInput = resourceTemplateComponentInput;
    component.ngOnInit();
    expect(component.unitIdentifier).toEqual('do_1131700101604311041350');
    expect(component.telemetryPageId).toEqual('dummyPage');
    expect(component.templateList).toBeDefined();
    expect(component.sessionContext).toBeDefined();
  });

  it('should emit event with type -next- on handleSubmit method execution', () => {
    component.templateSelected = 'explanationContent';
    component.programContext = {
      rootorg_id: '1131700101604311041350'
    };
    component.selectedtemplateDetails = {
      objectMetadata: {
        schema: {
          properties: {
            mimeType: {
              enum: ['application/vnd.sunbird.questionset', 'application/vnd.ekstep.ecml-archive']
            }
          }
        }
      }
    };
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(throwError(true));
    spyOn(component['toasterService'], 'error');
    component.handleSubmit();
    expect(component['toasterService']['error']).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0027);
  });

  it('#submit() Should call submit for questionset creation', () => {
    component.selectedtemplateDetails = {
      modeOfCreation: 'questionset',
      onClick: '',
      mimeType: ''
    };
    component.showQuestionTypeModal = false;
    component.showModeofCreationModal = false;
    component.submit();
    expect(component.selectedtemplateDetails).toBeDefined();
    expect(component.selectedtemplateDetails.onClick).toBe('questionSetEditorComponent');
    expect(component.selectedtemplateDetails.mimeType).toEqual(['application/vnd.sunbird.questionset']);
  });
  it('#submit() Should call submit for ecml creation', () => {
    component.selectedtemplateDetails = {
      modeOfCreation: 'ecml',
      onClick: '',
    };
    component.showQuestionTypeModal = false;
    component.showModeofCreationModal = false;
    component.submit();
    expect(component.selectedtemplateDetails).toBeDefined();
    expect(component.selectedtemplateDetails.onClick).toBe('editorComponent');
    expect(component.selectedtemplateDetails.mimeType).toEqual(['application/vnd.ekstep.ecml-archive']);
  });
  it('#submit() Should call submit for question creation', () => {
    component.selectedtemplateDetails = {
      modeOfCreation: 'question',
      onClick: '',
      mimetype: '',
      editors: [{ mimeType: 'application/vnd.ekstep.upload-archive', 'type': 'question' }]
    };
    component.showQuestionTypeModal = false;
    component.showModeofCreationModal = false;
    component.submit();
    expect(component.selectedtemplateDetails).toBeDefined();
    expect(component.selectedtemplateDetails.onClick).toBe('questionSetComponent');
  });
  it('#submit() Should call submit for upload', () => {
    component.selectedtemplateDetails = {
      modeOfCreation: 'upload',
      onClick: '',
      editors: [{ mimeType: 'application/vnd.ekstep.upload-archive' }]
    };
    component.showQuestionTypeModal = false;
    component.showModeofCreationModal = false;
    component.submit();
    expect(component.selectedtemplateDetails).toBeDefined();
    expect(component.selectedtemplateDetails.onClick).toBe('uploadComponent');
  });
  it('#setQuestionType() should call setQuestionType', () => {
    component.selectedtemplateDetails = {
      questionCategory: ''
    };
    component.setQuestionType('sample');
    expect(component.selectedtemplateDetails['questionCategory']).toBeDefined();
  });
  it('#ngOnDestroy() should call modal deny ', () => {
    component['modal'] = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component['modal'].deny).toHaveBeenCalled();
  });
  it('#ngOnDestroy() should call modal deny for questionTypeModal', () => {
    component['questionTypeModal'] = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component['questionTypeModal'].deny).toHaveBeenCalled();
  });
  it('#ngOnDestroy() should call modal deny for modeofcreationmodal', () => {
    component['modeofcreationmodal'] = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component['modeofcreationmodal'].deny).toHaveBeenCalled();
  });
  it('#setModeOfCreation() should call setModeOfCreation', () => {
    component.selectedtemplateDetails = {
      modeOfCreation: ''
    };
    component.setModeOfCreation('question');
    expect(component.selectedtemplateDetails['modeOfCreation']).toBeDefined();
  });
  it('#handleModeOfCreation() should call handleModeOfCreation and mode of creation is question', () => {
    component.selectedtemplateDetails = {
      modeOfCreation: 'question'
    };
    component.handleModeOfCreation();
    expect(component.showModeofCreationModal).toBeFalsy();
    expect(component.showQuestionTypeModal).toBeTruthy();
  });
  it('#handleModeOfCreation() should call handleModeOfCreation and mode of creation other than  question', () => {
    component.selectedtemplateDetails = {
      modeOfCreation: 'upload'
    };
    spyOn(component, 'submit');
    component.handleModeOfCreation();
    expect(component.submit).toHaveBeenCalled();
  });
});
