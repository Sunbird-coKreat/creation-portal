import { TestBed } from '@angular/core/testing';
import { CollectionHierarchyService } from './collection-hierarchy.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpOptions, ConfigService, ToasterService,
  BrowserCacheTtlService, ResourceService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryService } from '@sunbird/telemetry';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CacheService } from 'ng2-cache-service';
import { ActionService, PlayerService, FrameworkService, UserService, LearnerService } from '@sunbird/core';
import {  userProfile, addParticipentResponseSample, mockError, mockData} from './collection-hierarchy.service.spec.data';
import { of as observableOf, throwError as observableError } from 'rxjs';
describe('CollectionHierarchyService', () => {
let collectionHierarchyService;
const errorInitiate = false;
  const userServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError ({
          result: {
            responseCode: 404
          }
        });
      } else {
        return observableOf(addParticipentResponseSample);
      }
    },
    userid: userProfile.userId,
    userProfile : userProfile
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        CollectionHierarchyService,
        ConfigService,
        ToasterService,
        TelemetryService,
        {provide: APP_BASE_HREF, useValue: '/'},
        CacheService,
        BrowserCacheTtlService,
        ResourceService,
        DatePipe,
        {provide: UserService, useValue: userServiceStub},
        ActionService,
        LearnerService
      ]
    });
    collectionHierarchyService = TestBed.inject(CollectionHierarchyService);
  });

  it('should be created', () => {
    expect(collectionHierarchyService).toBeTruthy();
  });

  it('#removeResourceToHierarchy() should call actionService.delete()', () => {
    const  actionService  = TestBed.inject(ActionService);
    spyOn(actionService, 'delete').and.returnValue(observableOf({}));
    spyOn(collectionHierarchyService, 'removeResourceToHierarchy').and.callThrough();
    collectionHierarchyService.removeResourceToHierarchy('do_12345', 'do_12345', 'do_12345');
    expect(actionService.delete).toHaveBeenCalled();
  });

  it('#addResourceToHierarchy() should call actionService.patch()', () => {
    const  actionService  = TestBed.inject(ActionService);
    spyOn(actionService, 'patch').and.returnValue(observableOf({}));
    spyOn(collectionHierarchyService, 'addResourceToHierarchy').and.callThrough();
    collectionHierarchyService.addResourceToHierarchy('do_12345', 'do_12345', 'do_12345');
    expect(actionService.patch).toHaveBeenCalled();
  });

  it('#getCollectionWithProgramId() should call actionService.post()', () => {
    const  actionService  = TestBed.inject(ActionService);
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(collectionHierarchyService, 'getCollectionWithProgramId').and.callThrough();
    collectionHierarchyService.getCollectionWithProgramId('123456789', null);
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#getCollectionHierarchy() should call actionService.get()', () => {
    const  actionService  = TestBed.inject(ActionService);
    spyOn(actionService, 'get').and.returnValue({});
    spyOn(collectionHierarchyService, 'getCollectionHierarchy').and.callThrough();
    collectionHierarchyService.getCollectionHierarchy(['do_12345']);
    const hierarchyRequest = {
      url: 'content/v3/hierarchy/' + 'do_12345',
      param: { 'mode': 'edit' }
    };
    expect(actionService.get).toHaveBeenCalledWith(hierarchyRequest);
  });

  it('#getCollectionHierarchyDetails() should call actionService.get()', () => {
    const  actionService  = TestBed.inject(ActionService);
    spyOn(actionService, 'get').and.returnValue({});
    spyOn(collectionHierarchyService, 'getCollectionHierarchyDetails').and.callThrough();
    collectionHierarchyService.getCollectionHierarchyDetails('do_12345');
    const hierarchyRequest = {
      url: 'content/v3/hierarchy/' + 'do_12345',
      param: { 'mode': 'edit' }
    };
    expect(actionService.get).toHaveBeenCalledWith(hierarchyRequest);
  });

  it('#getContentCounts() should call #getStats()', () => {
    const dummyData = {dummy: 'dummyData'};
    spyOn(collectionHierarchyService, 'getContentsByType').and.returnValue(dummyData);
    spyOn(collectionHierarchyService, 'getContentCounts').and.callThrough();
    spyOn(collectionHierarchyService, 'getStats').and.callThrough();
    collectionHierarchyService.getContentCounts({dummyContent: 'abcd'}, 12345);
    expect(collectionHierarchyService.getStats).toHaveBeenCalledWith(dummyData, dummyData, undefined);
  });

  it('#getContentCountsForAll() should call #getStats()', () => {
    const dummyData = {dummy: 'dummyData'};
    spyOn(collectionHierarchyService, 'getContentsByTypeForAll').and.returnValue(dummyData);
    spyOn(collectionHierarchyService, 'getContentCounts').and.callThrough();
    spyOn(collectionHierarchyService, 'getStats').and.callThrough();
    collectionHierarchyService.getContentCountsForAll({dummyContent: 'abcd'});
    expect(collectionHierarchyService.getStats).toHaveBeenCalledWith(dummyData, dummyData, undefined);
  });

  it('#getMvcContentCounts() should return mvcContributions length', () => {
    const collections = [
      {mvcContributions: ['dummyData'] }
    ];
    spyOn(collectionHierarchyService, 'getMvcContentCounts').and.callThrough();
    const mvcContributionsCounts = collectionHierarchyService.getMvcContentCounts(collections);
    expect(mvcContributionsCounts).toEqual(1);
  });

  it('#getRejectOrDraft() should return expected contents when status is Draft', () => {
    spyOn(collectionHierarchyService, 'getRejectOrDraft').and.callThrough();
    const expectedContents = collectionHierarchyService.getRejectOrDraft(mockData.sampleContents, 'Draft');
    expect(expectedContents).toEqual([mockData.sampleContents[0]]);
  });

  it('#getRejectOrDraft() should return expected contents when status is Reject', () => {
    spyOn(collectionHierarchyService, 'getRejectOrDraft').and.callThrough();
    const expectedContents = collectionHierarchyService.getRejectOrDraft(mockData.sampleContents, 'Reject');
    expect(expectedContents).toEqual([mockData.sampleContents[1]]);
  });

  it('#getRejectOrDraft() should return expected contents when status is correctionsPending', () => {
    spyOn(collectionHierarchyService, 'getRejectOrDraft').and.callThrough();
    const expectedContents = collectionHierarchyService.getRejectOrDraft(mockData.sampleContents, 'correctionsPending');
    expect(expectedContents).toEqual([mockData.sampleContents[2]]);
  });

  it('#getContentAggregation() should call actionService.post()', () => {
    const  actionService  = TestBed.inject(ActionService);
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(collectionHierarchyService, 'getContentAggregation').and.callThrough();
    collectionHierarchyService.getContentAggregation('123456789');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#getContentsByType() should return expected contents when userType is individual and contentType is sample', () => {
    spyOn(collectionHierarchyService, 'getContentsByType').and.callThrough();
    const expectedContents = collectionHierarchyService.getContentsByType(mockData.sampleContentsWithContentType,
      'abcd1234', 'individual', 'sample');
    expect(expectedContents).toEqual([mockData.sampleContentsWithContentType[0]]);
  });

  it('#getContentsByType() should return expected contents when userType is individual and contentType is not sample', () => {
    spyOn(collectionHierarchyService, 'getContentsByType').and.callThrough();
    const expectedContents = collectionHierarchyService.getContentsByType(mockData.sampleContentsWithContentType,
      'abcd1234', 'individual', 'nonsample');
    expect(expectedContents).toEqual([mockData.sampleContentsWithContentType[1]]);
  });

  it('#getContentsByType() should return expected contents when userType is org and contentType is sample', () => {
    spyOn(collectionHierarchyService, 'getContentsByType').and.callThrough();
    const expectedContents = collectionHierarchyService.getContentsByType(mockData.sampleContentsWithContentType,
      '012345', 'org', 'sample');
    expect(expectedContents).toEqual([mockData.sampleContentsWithContentType[0]]);
  });

  it('#getContentsByType() should return expected contents when userType is org and contentType is not sample', () => {
    spyOn(collectionHierarchyService, 'getContentsByType').and.callThrough();
    const expectedContents = collectionHierarchyService.getContentsByType(mockData.sampleContentsWithContentType,
      '012345', 'org', 'nonsample');
    expect(expectedContents).toEqual([mockData.sampleContentsWithContentType[1]]);
  });

  it('#getContentsByTypeForAll() should return expected contents  and contentType is sample', () => {
    spyOn(collectionHierarchyService, 'getContentsByTypeForAll').and.callThrough();
    const expectedContents = collectionHierarchyService.getContentsByTypeForAll(mockData.sampleContentsWithContentType, 'sample');
    expect(expectedContents).toEqual([mockData.sampleContentsWithContentType[0]]);
  });

  it('#getContentsByTypeForAll() should return expected contents  and contentType is not sample', () => {
    spyOn(collectionHierarchyService, 'getContentsByTypeForAll').and.callThrough();
    const expectedContents = collectionHierarchyService.getContentsByTypeForAll(mockData.sampleContentsWithContentType, 'nonsample');
    expect(expectedContents).toEqual([mockData.sampleContentsWithContentType[1]]);
  });

  it('#apiErrorHandling() should call toasterService.error() and telemetryService.error()', () => {
    const errorInfo = {errorMsg: 'Something went wrong'};
    const  toasterService  = TestBed.inject(ToasterService);
    const telemetryService = TestBed.inject(TelemetryService);
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(telemetryService, 'error').and.callThrough();
    spyOn(collectionHierarchyService, 'apiErrorHandling').and.callThrough();
    collectionHierarchyService.apiErrorHandling(mockError, errorInfo);
    expect(toasterService.error).toHaveBeenCalled();
    expect(telemetryService.error).toHaveBeenCalled();
  });

  it('#getAllAcceptedContentsCount() should return liveContentsCounts', () => {
    const textbookMeta = { Live: [
        {identifier: 'do_1234', name: 'abcd'},
        {identifier: 'do_12345', name: 'pqrst'}]};
    spyOn(collectionHierarchyService, 'getAllAcceptedContentsCount').and.callThrough();
    const liveContentsCounts = collectionHierarchyService.getAllAcceptedContentsCount(textbookMeta);
    expect(liveContentsCounts).toEqual(2);
  });

  it('#getAllPendingForApprovalCount() should return liveContentsCounts', () => {
    const textbookMeta = { Live: [
        {identifier: 'do_1234', name: 'abcd'},
        {identifier: 'do_12345', name: 'pqrst'}]};
    spyOn(collectionHierarchyService, 'getAllPendingForApprovalCount').and.callThrough();
    const liveContentsCounts = collectionHierarchyService.getAllPendingForApprovalCount(textbookMeta);
    expect(liveContentsCounts).toEqual(2);
  });

  it('#getOriginForApprovedContents() should call learnerService.post()', () => {
    const  learnerService  = TestBed.inject(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(observableOf({}));
    spyOn(collectionHierarchyService, 'getOriginForApprovedContents').and.callThrough();
    collectionHierarchyService.getOriginForApprovedContents('do_12345');
    expect(learnerService.post).toHaveBeenCalled();
  });

});
