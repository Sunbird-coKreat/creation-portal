import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramListComponent } from './program-list.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe, APP_BASE_HREF } from '@angular/common';
import { DaysToGoPipe, TextbookListComponent } from '../../../shared-feature';
import { SharedModule, ResourceService, ToasterService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryService} from '@sunbird/telemetry';
import { ProgramsService, RegistryService, UserService, FrameworkService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { SourcingService, HelperService } from '../../../sourcing/services';

describe('ProgramListComponent', () => {
  let component: ProgramListComponent;
  let fixture: ComponentFixture<ProgramListComponent>;

  const routerStub = { url: '/sourcing/contribute' };

  const fakeActivatedRoute = {
    snapshot: { data: {
      roles: 'programSourcingRole',
      telemetry: { env: 'sourcing-portal', type: 'view', subtype: 'paginate', pageid: 'list-program' }
    }}
  };
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule.forRoot(), SuiModule,
        TelemetryModule, ReactiveFormsModule , RouterTestingModule, HttpClientTestingModule],
      declarations: [ ProgramListComponent, DaysToGoPipe ],
      providers: [ DatePipe, ProgramsService, ResourceService, CacheService, RegistryService, FrameworkService, 
        ToasterService, ConfigService, NavigationHelperService, SourcingService, HelperService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }, { provide: Router, useValue: routerStub },
         TelemetryService, UserService, {provide: APP_BASE_HREF, useValue: '/'},
         ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ProgramListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

it('should call setClose', () => {
    const program = 'program';
    component.setClose(program);
    expect(component.program).toBe(program);
    expect(component.showCloseModal).toBeTruthy();
  });

  it('#setContextualHelpConfig should set myProjectContextHelpConfig', () => {
    const contextualHelpConfig = {
      'contribute': {
        'myProjects': {
          'url': 'https://dock.preprod.ntp.net.in/help/contribute/contributor/enrol/index.html',
          'header': 'You can use this space to view all the projects assigned to you, along with your designated role.',
          'message': 'You can contribute or review content based on the requirements'
        }
      }
    };
    component.myProjectContextHelpConfig = undefined;
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'getContextualHelpConfig').and.returnValue(contextualHelpConfig);
    spyOn(component, 'setContextualHelpConfig').and.callThrough();
    component.setContextualHelpConfig();
    expect(component.myProjectContextHelpConfig).toBeDefined();
  });
});
