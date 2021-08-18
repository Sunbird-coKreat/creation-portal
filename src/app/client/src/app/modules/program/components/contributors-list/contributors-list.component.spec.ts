import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContributorsListComponent } from './contributors-list.component';
import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, UserService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { Observable, of } from 'rxjs';
import { RegistryService, ProgramsService } from '@sunbird/core';
import { ResourceService, PaginationService, ConfigService } from '@sunbird/shared';
import { SourcingService } from './../../../sourcing/services';
import * as mockData from './contributors-list.component.spec.data';
import { ActivatedRoute } from '@angular/router';

describe('ContributorsListComponent', () => {
  let component: ContributorsListComponent;
  let fixture: ComponentFixture<ContributorsListComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '12345'
      },
      data: {
        telemetry: {
          env: 'vdn', pageid: 'create-program', subtype: '', type: '',
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule,
        FormsModule, CoreModule, TelemetryModule, RouterTestingModule,
        SharedModule.forRoot(), SuiModule],
      declarations: [ContributorsListComponent],
      providers: [TelemetryService, RegistryService, ProgramsService,
        ResourceService, PaginationService, ConfigService, SourcingService,
        {provide: UserService, useValue: userServiceStub},
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call the getOrgList', () => {
    component['registryService'] = TestBed.get(RegistryService);
    component['registryService'].programUserPageLimit = 2;
    spyOn(component, 'getOrgList').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.pageLimit).toEqual(2);
    expect(component.getOrgList).toHaveBeenCalled();
  });

  xit('getOrgList should call the registryService.getOrgList', () => {
    component.orgList = [];
    const registryService = TestBed.get(RegistryService);
    spyOn(registryService, 'getOrgList').and.returnValue(of(mockData.orgList));
    spyOn(component, 'getOrgList').and.callThrough();
    component.getOrgList();
    expect(component.getOrgList).toHaveBeenCalled();
    expect(registryService.getOrgList).toHaveBeenCalled();
  });

  it('getPageId should set telemetryPageId', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const pageId = component.getPageId();
    expect(component.telemetryPageId).toEqual('create-program');
    expect(pageId).toEqual('create-program');
  });

  it('getPageId should set telemetryPageId', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const pageId = component.getPageId();
    expect(component.telemetryPageId).toEqual('create-program');
    expect(pageId).toEqual('create-program');
  });

  it('getOrgCreatorIds should call registryService.getUserdetailsByOsIds', () => {
    spyOn(component, 'getOrgCreatorIds').and.callThrough();
    const registryService = TestBed.get(RegistryService);
    spyOn(component, 'getOrgUsersDetails').and.callFake(() => {});
    spyOn(registryService, 'getUserdetailsByOsIds').and.returnValue(of(mockData.orgList));
    component.getOrgCreatorIds('123');
    expect(registryService.getUserdetailsByOsIds).toHaveBeenCalled();
    expect(component.orgList).toBeDefined();
    expect(component.getOrgUsersDetails).toHaveBeenCalled();
  });

  it('getOrgUsersDetails should call programsService.getOrgUsersDetails', () => {
    spyOn(component, 'getOrgUsersDetails').and.callThrough();
    const programsService = TestBed.get(ProgramsService);
    spyOn(component, 'showFilteredResults').and.callFake(() => {});
    spyOn(programsService, 'getOrgUsersDetails').and.returnValue(of(mockData.orgUserDetails));
    component.getOrgUsersDetails('123');
    expect(programsService.getOrgUsersDetails).toHaveBeenCalled();
    expect(component.orgList).toBeDefined();
    expect(component.showFilteredResults).toHaveBeenCalled();
  });

  it('NavigateToPage should set pager value', () => {
    const paginationService = TestBed.get(PaginationService);
    spyOn(paginationService, 'getPager').and.returnValue([]);
    component.pager = mockData.pager;
    component.paginatedList[44] = [];
    component.listCnt = 1;
    component.pageLimit = 5;
    spyOn(component, 'NavigateToPage').and.callThrough();
    component.NavigateToPage(45);
    expect(component.pageNumber).toEqual(45);
    expect(paginationService.getPager).toHaveBeenCalled();
  });

  it('clearSearch should call showFilteredResults', () => {
    spyOn(component, 'showFilteredResults').and.callFake(() => {});
    spyOn(component, 'clearSearch').and.callThrough();
    component.clearSearch();
    expect(component.showFilteredResults).toHaveBeenCalled();
  });

  it('showFilteredResults should call hideLoader', () => {
    spyOn(component, 'displayLoader').and.callFake(() => {});
    spyOn(component, 'applySearchFilter').and.returnValue([]);
    spyOn(component, 'applySort').and.returnValue([]);
    spyOn(component, 'applyPagination').and.returnValue([]);
    spyOn(component, 'hideLoader').and.callFake(() => {});
    spyOn(component, 'showFilteredResults').and.callThrough();
    component.showFilteredResults();
    expect(component.displayLoader).toHaveBeenCalled();
    expect(component.applySearchFilter).toHaveBeenCalled();
    expect(component.applySort).toHaveBeenCalled();
    expect(component.applyPagination).toHaveBeenCalled();
    expect(component.hideLoader).toHaveBeenCalled();
  });

  it('applySort should call programsService.sortCollection', () => {
    component.direction = 'asc';
    component.sortColumn = 'name';
    spyOn(component, 'applySort').and.callThrough();
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'sortCollection').and.returnValue([]);
    component.applySort([]);
    expect(programsService.sortCollection).toHaveBeenCalled();
  });

  it('getTelemetryInteractEdata should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('1234', 'dummyType', 'dummySubtype', 'create', undefined);
    expect(returnObj).not.toContain(undefined);
  });
});
