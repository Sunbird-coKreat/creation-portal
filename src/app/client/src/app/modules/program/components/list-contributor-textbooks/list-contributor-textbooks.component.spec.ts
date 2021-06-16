import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContributorTextbooksComponent } from './list-contributor-textbooks.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DaysToGoPipe } from '@sunbird/shared-feature';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DynamicModule } from 'ng-dynamic-component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import * as SpecData from './list-contributor-textbooks.spec.data';
import { CollectionHierarchyService } from '../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { throwError } from 'rxjs';
import { UserService, ProgramsService} from '@sunbird/core';
import { HelperService } from '../../../sourcing/services/helper.service';
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
        programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
      },
      data: {
        telemetry: {
          env: 'programs'
        }
      }
    },
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
        {
            provide: Router,
            useClass: RouterStub
          },
          {
            provide: ActivatedRoute,
            useValue: fakeActivatedRoute
          },
          {
            provide: UserService,
            useValue: userServiceStub
          },
          {provide: APP_BASE_HREF, useValue: '/'},
          DatePipe,
          CollectionHierarchyService,
          HelperService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListContributorTextbooksComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    const  programsService  = TestBed.inject(ProgramsService);
    component.targetCollections = 'Question papers';
    component.programDetails = SpecData.programDetailsTargetCollection;
    spyOn(programsService, 'setTargetCollectionName').and.returnValue('Question papers');
    component.fetchProgramDetails();
    expect(component.programDetails).toBe(SpecData.programDetailsTargetCollection);
    expect(component.targetCollections).toEqual('Question papers');
  });

  it('#setFrameworkCategories() should call helperService.setFrameworkCategories()', () => {
    const collection = {};
    const  helperService  = TestBed.inject(HelperService);
    spyOn(helperService, 'setFrameworkCategories').and.returnValue({});
    spyOn(component, 'setFrameworkCategories').and.callThrough();
    component.setFrameworkCategories(collection);
    expect(helperService.setFrameworkCategories).toHaveBeenCalledWith({});
  });

});
