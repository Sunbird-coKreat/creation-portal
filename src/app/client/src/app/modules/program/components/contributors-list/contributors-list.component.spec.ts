import { of,throwError as observableThrowError } from 'rxjs';
import { ComponentFixture, TestBed,  } from '@angular/core/testing';
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
          env: 'cokreat', pageid: 'create-program', subtype: '', type: '',
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

  beforeEach(() => {
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
    fixture = TestBed.createComponent(ContributorsListComponent);
    component = fixture.componentInstance;
  });
  
  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });

  it('Should call the getData', () => {
    component['registryService'] = TestBed.get(RegistryService);
    component['registryService'].programUserPageLimit = 2;
    component.osLimit = 2;
    spyOn(component, 'getData').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.pageLimit).toEqual(2);
    expect(component.getData).toHaveBeenCalled();
  });

  it('getOrgList should call the registryService.getOrgList', () => {
    const registryService = TestBed.get(RegistryService);
    spyOn(registryService, 'getOrgList').and.returnValue(of(mockData.orgList));
    spyOn(component, 'getOrgList').and.callThrough();
    spyOn(component, 'getOrgCreatorInfo');
    component.getOrgList();
    expect(component.getOrgList).toHaveBeenCalled();
    expect(registryService.getOrgList).toHaveBeenCalled();
  });

  xit('getOrgList should throw error on service error', () => {
    const registryService = TestBed.get(RegistryService);
    spyOn(registryService, 'getOrgList').and.callFake(() => observableThrowError({}));
    component.getOrgList();
    expect(component.getOrgList).toThrowError();
  });



  it('getPageId should set telemetryPageId', () => {
    spyOn(component, 'getPageId').and.callThrough();
    const pageId = component.getPageId();
    expect(component.telemetryPageId).toEqual('create-program');
    expect(pageId).toEqual('create-program');
  });

  xit('getOrgCreatorInfo should call registryService.getUserdetailsByOsIds', () => {
    spyOn(component, 'getOrgCreatorInfo').and.callThrough();
    const registryService = TestBed.get(RegistryService);
    spyOn(component, 'getUsers').and.returnValue(Promise.resolve(true));
    spyOn(registryService, 'getUserdetailsByOsIds');
    const data = [{'createdBy': 123}, {'createdBy': 456}]
    component.getOrgCreatorInfo(data, Promise.resolve, Promise.reject);
    expect(registryService.getUserdetailsByOsIds).toHaveBeenCalled();
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('navigateToPage should set pager value', () => {
    component.pager = mockData.pager;
    component.paginatedList[44] = [];
    component.listCnt = 1;
    component.pageLimit = 5;
    spyOn(component, 'getUsers').and.returnValue(Promise.resolve([]));
    spyOn(component, 'navigateToPage').and.callThrough();
    component.navigateToPage(45);
    expect(component.pageNumber).toEqual(45);
  });

  it('clearSearch should call getData', () => {
    spyOn(component, 'getData').and.callFake(() => {});
    spyOn(component, 'clearSearch').and.callThrough();
    component.clearSearch();
    expect(component.searchInput).toEqual("");
    expect(component.getData).toHaveBeenCalled();
  });

  it('showFilteredResults should call #applyPagination() and #hideLoader()', () => {
    spyOn(component, 'applyPagination').and.returnValue([] as any);
    spyOn(component, 'hideLoader').and.callFake(() => {});
    spyOn(component, 'showFilteredResults').and.callThrough();
    component.showFilteredResults([]);
    expect(component.applyPagination).toHaveBeenCalled();
    expect(component.hideLoader).toHaveBeenCalled();
  });

  it('applySort should call programsService.sortCollection', () => {
    component.direction = 'asc';
    component.orgSortColumn = 'name';
    spyOn(component, 'applySort').and.callThrough();
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'sortCollection').and.returnValue(['jvv']);
    component.applySort(['jvv'], component.orgSortColumn);
    expect(programsService.sortCollection).toHaveBeenCalled();
  });

  it('getTelemetryInteractEdata should return object with defined value', () => {
    spyOn(component, 'getTelemetryInteractEdata').and.callThrough();
    const returnObj = component.getTelemetryInteractEdata('1234', 'dummyType', 'dummySubtype', 'create', undefined);
    expect(returnObj).not.toContain(undefined);
  });

 it('#getData() should call displayLoader()', () => {
    spyOn(component, 'displayLoader');
    component.getData();
    expect(component.displayLoader).toHaveBeenCalled();
  });

  it('#displayLoader() should set #showLoader to true', ()=> {
    component.displayLoader();
    expect(component.showLoader).toEqual(true);
    expect(component.isDisabledSaveBtn).toEqual(true);
    expect(component.pageNumber).toEqual(1);
    expect(component.contributorList).toEqual([]);
  });

  it('#hideLoader() should set #showLoader to false', ()=> {
    component.hideLoader();
    expect(component.showLoader).toEqual(false);
    expect(component.isDisabledSaveBtn).toEqual(false);
  });

  it('#updateSelection() should update the user selection to Org', ()=> {
    component.contributorType = 'Organisation';
    spyOn(component, 'updateSelection');
    component.updateSelection('Organisation','');
    expect(component.updateSelection).toHaveBeenCalled();
  });
  it('#updateSelection() should update the user selection to Individual', ()=> {
    component.contributorType = 'Individual';
    spyOn(component, 'updateSelection');
    component.updateSelection('Individual','');
    expect(component.updateSelection).toHaveBeenCalled();
  });

  it('#getIndividualList() should get the list of user profiles', ()=> {
    const registryService = TestBed.get(RegistryService);
    spyOn(registryService, 'getUserList').and.callFake(() => {});
    spyOn(component, 'getIndividualList');
    component.getIndividualList(500, 0);
    expect(component.getIndividualList).toHaveBeenCalled();
  }); 

  xit('getIndividualList should throw error on service error', () => {
    const registryService = TestBed.get(RegistryService);
    spyOn(registryService, 'getUserList').and.callFake(() => observableThrowError({}));
    component.getIndividualList();
    expect(component.getIndividualList).toThrowError();
  });

  it('getUsersProfile should return user list', () => {
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'getOrgUsersDetails').and.returnValue(of(mockData.userDetails));
    //spyOn(component, 'getOrgUsersDetails').and.callThrough();
    spyOn(component, 'getUsersProfile');
    component.getUsersProfile('','','','','');
    expect(component.getUsersProfile).toHaveBeenCalled();
  });

  xit('getUsersProfile should throw error on service errorreturn user list', () => {
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'getOrgUsersDetails').and.callFake(() => observableThrowError({}));
    component.getUsersProfile('','','','','');
    expect(component.getUsersProfile).toThrowError();
  });
  
});

