import { ComponentFixture, TestBed,  } from '@angular/core/testing';

import { OrgUserListComponent } from './org-user-list.component';
import { NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SharedModule, ToasterService, ConfigService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DynamicModule } from 'ng-dynamic-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import * as SpecData from './org-user-list.component.spec.data';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { throwError, Subject, of } from 'rxjs';
import { ProgramsService, RegistryService, UserService, FrameworkService, NotificationService, ContentHelperService } from '@sunbird/core';
import { HelperService } from '../../../sourcing/services/helper.service';
import { SourcingService } from './../../../sourcing/services';
import { ProgramTelemetryService } from '../../services';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';
import {userDetail, chunkedUserList} from '../../services/programUserTestData';
import { CacheService } from '../../../shared/services/cache-service/cache.service';


describe('OrgUserListComponent', () => {
  let component: OrgUserListComponent;
  let fixture: ComponentFixture<OrgUserListComponent>;
  let telemetryService;
  const errorInitiate = false;
  const userServiceStub = {
    get() {
      if (errorInitiate) {
        return throwError ({
          result: {
            responseCode: 404
          }
        });
      }
    },
    isUserBelongsToOrg() {
    },
    userid: SpecData.userProfile.userId,
    userProfile : SpecData.userProfile
  };
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '12345'
      },
      data: {
        telemetry: {
          env: 'workspace', pageid: 'list-contributor', subtype: 'scroll', type: 'list',
          object: { type: '', ver: '1.0' }
        }
      }
    },
    fragment: of(SpecData.contributor)
  };
  const resourceBundle = {
    messages: {
      emsg: {
        blueprintViolation : 'Please provide all required blueprint values'
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
             DynamicModule,
             SuiModule,
             SharedModule.forRoot(),
             ReactiveFormsModule,
             FormsModule,
             TelemetryModule.forRoot(),
             HttpClientTestingModule,
             RouterModule.forRoot([], { relativeLinkResolution: 'legacy' })
         ],
       declarations: [ OrgUserListComponent],
       providers: [
         
         { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        //  { provide: UserService, useValue: userServiceStub },
         { provide: APP_BASE_HREF, useValue: '/' },
         { provide: ResourceService, useValue: resourceBundle },
         ToasterService , ConfigService, DatePipe, ProgramStageService,
         ProgramsService,RegistryService, FrameworkService, HelperService, Subject,
         ViewChild, NavigationHelperService, CollectionHierarchyService, ContentHelperService,
         SourcingService, ProgramTelemetryService, TelemetryService, NotificationService, CacheService, UserService
       ],
       schemas: [NO_ERRORS_SCHEMA]
     })
     .compileComponents();
    fixture = TestBed.createComponent(OrgUserListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    component.telemetryImpression = {
      context: {
        env: fakeActivatedRoute.snapshot.data.telemetry.env,
        cdata:[ {} ],
        pdata: {
          id: 'userService.appId',
          ver: 'version',
          pid: 'PID'
        },
        did: ''
      },
      edata: {
        type: 'snapshot.data.telemetry.type',
        pageid: 'getPageId',
        uri:  'router.url',
        duration: 10
      }
    };
    telemetryService = TestBed.inject(TelemetryService);
    spyOn(telemetryService, 'initialize');

  });

  
  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('getUserDetailsBySearch should get the user list when there is a search input', () => {

    component.searchInput = 'jnc68';
    component.searchLimitCount = 1;
    const registryService: any = TestBed.inject(RegistryService);
    spyOn(registryService, 'getSearchedUserList').and.returnValue(['bbbb', 'bbbbb']);
    
    spyOn(component, 'sortUsersList').and.callFake(() => {});
    spyOn(component, 'logTelemetryImpressionEvent').and.returnValue(true);
    component.getUserDetailsBySearch();
    expect(component.sortUsersList).toHaveBeenCalled();
  });

  it('sortUsersList should call the sortUsersList method when there is input', () => {
    component.pageLimit = 1;
    component.searchInput = 'jnc68';
    const usersList = ['bbbb', 'bbbbb']
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'sortCollection').and.returnValue(['bbbb', 'bbbbb']);
    spyOn(component, 'logTelemetryImpressionEvent').and.returnValue(true);
    component.sortUsersList(usersList, true);
    expect(programsService.sortCollection).toHaveBeenCalled();
    expect(component.logTelemetryImpressionEvent).toHaveBeenCalled();
  });


  it('#getTelemetryInteractEdata() should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('copy_link',
      'click', 'launch', 'sourcing_my_projects', undefined);
    expect(returnObj).not.toContain(undefined);
  });

  it('#setContextualHelpConfig should set mangeUsersContextualConfig', () => {
    component.mangeUsersContextualConfig = undefined;
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'getContextualHelpConfig').and.returnValue(SpecData.contextualHelpConfig);
    spyOn(component, 'setContextualHelpConfig').and.callThrough();
    component.setContextualHelpConfig();
    expect(component.mangeUsersContextualConfig).toBeDefined();
  });

  xit('#updateUserRole should update User Role', () => {
    //component.resourceService={messages:{smsg:{m0065:''}}}
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'], 'updateUserRole').and.returnValue(of({result:{identifier: 'identifier'},
    id: 'api.programsService',
    params: {
        err: null,
        errmsg : null,
        msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
        resmsgid : null,
        status : 'success'},
   responseCode: 'OK',
   ts:'',
   ver:''}));
    spyOn(component['programsService'], 'updateUser').and.returnValue(of({result:{identifier: 'identifier'},
    id: 'api.programsService',
    params: {
        err: null,
        errmsg : null,
        msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
        resmsgid : null,
        status : 'success'},
   responseCode: 'OK',
   ts:'',
   ver:''}));
    component.updateUserRole('','','');
    expect(component['programsService'].updateUserRole).toHaveBeenCalled();

  });

  it('#ngOnInit should initialize the member variables', () => {
   component.ngOnInit();
    component['userService'] = TestBed.inject(UserService);
    spyOn(component['userService'], 'getUserProfile')
  });
});
