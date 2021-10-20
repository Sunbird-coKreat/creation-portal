import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContributorTextbooksComponent } from './list-contributor-textbooks.component';
import { NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { DaysToGoPipe } from '@sunbird/shared-feature';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SharedModule, ToasterService, ConfigService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DynamicModule } from 'ng-dynamic-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import * as SpecData from './list-contributor-textbooks.spec.data';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { throwError, Subject } from 'rxjs';
import { ProgramsService, UserService, FrameworkService, NotificationService, ContentHelperService } from '@sunbird/core';
import { HelperService } from '../../../sourcing/services/helper.service';
import { SourcingService } from './../../../sourcing/services';
import { ProgramTelemetryService } from '../../services';
import { ProgramStageService } from '../../services/program-stage/program-stage.service';

describe('ListContributorTextbooksComponent', () => {
  let component: ListContributorTextbooksComponent;
  let fixture: ComponentFixture<ListContributorTextbooksComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
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
    }
  };
  const resourceBundle = {
    messages: {
      emsg: {
        blueprintViolation : 'Please provide all required blueprint values'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
     imports: [
            DynamicModule,
            SuiModule,
            SharedModule.forRoot(),
            ReactiveFormsModule,
            FormsModule,
            TelemetryModule.forRoot(),
            HttpClientTestingModule,
            RouterModule.forRoot([])
        ],
      declarations: [ ListContributorTextbooksComponent, DaysToGoPipe],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: UserService, useValue: userServiceStub },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ResourceService, useValue: resourceBundle },
        ToasterService, ConfigService, DatePipe, ProgramStageService, 
        ProgramsService, FrameworkService, HelperService, Subject,
        ViewChild, NavigationHelperService, CollectionHierarchyService, ContentHelperService,
        SourcingService, ProgramTelemetryService, TelemetryService, NotificationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContributorTextbooksComponent);
    component = fixture.componentInstance;
    component.stageSubscription= new Subject;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    const  programsService  = TestBed.get(ProgramsService);
    component.targetCollections = 'Question papers';
    component.programDetails = SpecData.programDetailsTargetCollection;
    spyOn(programsService, 'setTargetCollectionName').and.returnValue('Question papers');
    component.fetchProgramDetails();
    expect(component.programDetails).toBe(SpecData.programDetailsTargetCollection);
    expect(component.targetCollections).toEqual('Question papers');
  });

  it('#setFrameworkCategories() should call helperService.setFrameworkCategories()', () => {
    const collection = {};
    const  helperService  = TestBed.get(HelperService);
    spyOn(helperService, 'setFrameworkCategories').and.returnValue({});
    spyOn(component, 'setFrameworkCategories').and.callThrough();
    component.setFrameworkCategories(collection);
    expect(helperService.setFrameworkCategories).toHaveBeenCalledWith({});
  });

  it('#getPageId() should return pageId', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const pageId = component.getPageId();
    expect(pageId).toBeDefined();
  });

  it('#getTelemetryInteractEdata() should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('download_collection_level_content_gap_report',
    'click', 'launch', 'sourcing_my_projects', undefined);
    expect(returnObj).not.toContain(undefined);
  });

});
