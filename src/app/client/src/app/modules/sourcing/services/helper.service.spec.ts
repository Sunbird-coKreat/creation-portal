import { TestBed, fakeAsync } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, ActionService, ContentService, ProgramsService,
  FrameworkService, PublicDataService } from '@sunbird/core';
import { SharedModule, ToasterService, ResourceService } from '@sunbird/shared';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { childMetaFormData } from './sourcing/helper.service.spec.data';

describe('HelperService', () => {
  const resourceBundle = {
    messages: {
      fmsg: {
        m00100: 'toaster error message',
        approvingFailed: 'toaster error message'
      }
    }
  };
  let helperService;
  let actionService;
  let contentService;
  let programsService;
  let frameworkService;
  let toasterService;
  let publicDataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule],
      providers: [
        ActionService,
        TelemetryService,
        ToasterService,
        HttpClient,
        {provide: ResourceService, useValue: resourceBundle}
      ]
    });
    helperService = TestBed.inject(HelperService);
    actionService = TestBed.inject(ActionService);
    contentService = TestBed.inject(ContentService);
    programsService = TestBed.inject(ProgramsService);
    frameworkService =  TestBed.inject(FrameworkService);
    toasterService = TestBed.inject(ToasterService);
    publicDataService = TestBed.inject(PublicDataService);
  });

  it('should be created', () => {
    expect(HelperService).toBeTruthy();
  });

  xit('#initialize() should call #fetchChannelData()', () => {
    const programDetails = {
      rootorg_id: '12345'
    };
    spyOn(helperService, 'getAvailableLicences').and.returnValue(undefined);
    spyOn(helperService, 'initialize').and.callThrough();
    spyOn(helperService, 'fetchChannelData').and.callThrough();
    helperService.initialize(programDetails);
    expect(helperService.fetchChannelData).toHaveBeenCalledWith(programDetails.rootorg_id);
  });

  it('#getCategoryMetaData() should call programsService.getCategoryDefinition()', () => {
    spyOn(programsService, 'getCategoryDefinition').and.returnValue(observableOf({res: 'dummyData'}));
    spyOn(helperService, 'getCategoryMetaData').and.callThrough();
    helperService.getCategoryMetaData('dummyCategory', '12345', 'content');
    expect(programsService.getCategoryDefinition).toHaveBeenCalledWith('dummyCategory', '12345', 'content');
    expect(helperService.selectedCategoryMetaData).toEqual({res: 'dummyData'});
  });

  xit('#getCollectionOrContentCategoryDefinition() should call programsService.getCollectionCategoryDefinition()', () => {
    const targetCollectionMeta = {
      primaryCategory: 'Digital Textbook',
      channelId: '123456789',
      objectType: 'Collection'
    };

    const assetMeta = {
      primaryCategory: 'eTextbook',
      channelId: '987654321',
      objectType: 'Content'
    };

    spyOn(programsService, 'getCollectionCategoryDefinition').and.returnValue(observableOf(childMetaFormData));
    spyOn(helperService, 'getCollectionOrContentCategoryDefinition').and.callThrough();
    helperService.getCollectionOrContentCategoryDefinition(targetCollectionMeta, assetMeta);
    expect(programsService.getCollectionCategoryDefinition).toHaveBeenCalledWith(targetCollectionMeta.primaryCategory,
      targetCollectionMeta.channelId);
  });

  it('#selectedCategoryMetaData should set _categoryMetaData', () => {
    helperService.selectedCategoryMetaData = childMetaFormData;
    expect(helperService._categoryMetaData).toEqual(childMetaFormData);
  });

  it('#selectedCategoryMetaData should give _categoryMetaData', () => {
    const dummyData = {name: 'sample textbook'};
    helperService._categoryMetaData = dummyData;
    const data  = helperService.selectedCategoryMetaData;
    expect(data).toEqual(dummyData);
  });

  it('#checkIfCollectionFolder should return true', () => {
    const data = {mimeType: 'application/vnd.ekstep.content-collection', visibility: 'Parent'};
    spyOn(helperService, 'checkIfCollectionFolder').and.callThrough();
    const returnedValue = helperService.checkIfCollectionFolder(data);
    expect(returnedValue).toBeTruthy();
  });

  it('#checkIfCollectionFolder should return false', () => {
    const data = {mimeType: 'application/pdf', visibility: 'Parent'};
    spyOn(helperService, 'checkIfCollectionFolder').and.callThrough();
    const returnedValue = helperService.checkIfCollectionFolder(data);
    expect(returnedValue).toBeFalsy();
  });

  it('#checkIfMainCollection should return true', () => {
    const data = {mimeType: 'application/vnd.ekstep.content-collection', visibility: 'Default'};
    spyOn(helperService, 'checkIfMainCollection').and.callThrough();
    const returnedValue = helperService.checkIfMainCollection(data);
    expect(returnedValue).toBeTruthy();
  });

  it('#checkIfMainCollection should return false', () => {
    const data = {mimeType: 'application/pdf', visibility: 'Default'};
    spyOn(helperService, 'checkIfMainCollection').and.callThrough();
    const returnedValue = helperService.checkIfMainCollection(data);
    expect(returnedValue).toBeFalsy();
  });

  it('#getLicences() should call contentService.post()', () => {
    spyOn(contentService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'getLicences').and.callThrough();
    helperService.getLicences();
    expect(contentService.post).toHaveBeenCalled();
  });

  it('#fetchChannelData() should call frameworkService.getChannelData()', () => {
    spyOn(frameworkService, 'getChannelData').and.returnValue(observableOf({}));
    spyOn(helperService, 'fetchChannelData').and.callThrough();
    helperService.fetchChannelData('12345');
    expect(frameworkService.getChannelData).toHaveBeenCalledWith('12345');
  });

  it('#getProgramLevelChannelData() should return _channelData', () => {
    const dummyChannelData = {identifier: '12345', name: 'sunbird'};
    helperService._channelData = dummyChannelData;
    spyOn(helperService, 'getProgramLevelChannelData').and.callThrough();
    const returnedValue = helperService.getProgramLevelChannelData();
    expect(returnedValue).toEqual(dummyChannelData);
  });

  it('#getAvailableLicences() should return _availableLicences', () => {
    const dummyLicenseData = ['CC BY 4.0', 'CC BY-NC 4.0'];
    helperService._availableLicences = dummyLicenseData;
    spyOn(helperService, 'getAvailableLicences').and.callThrough();
    const returnedValue = helperService.getAvailableLicences();
    expect(returnedValue).toEqual(dummyLicenseData);
  });

  it('#updateContent() should call actionService.patch()', () => {
    spyOn(actionService, 'patch').and.returnValue(observableOf({}));
    spyOn(helperService, 'updateContent').and.callThrough();
    helperService.updateContent('do_12345');
    expect(actionService.patch).toHaveBeenCalled();
  });

  it('#reviewContent() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'reviewContent').and.callThrough();
    helperService.reviewContent('do_12345');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#publishContent() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'publishContent').and.callThrough();
    helperService.publishContent('do_12345', '12345');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#publishQuestionSet() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'publishQuestionSet').and.callThrough();
    helperService.publishQuestionSet('do_12345', '12345');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#submitRequestChanges() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'submitRequestChanges').and.callThrough();
    helperService.submitRequestChanges('do_12345', '12345');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#updateContentStatus() should call actionService.patch()', () => {
    spyOn(actionService, 'patch').and.returnValue(observableOf({}));
    spyOn(helperService, 'updateContentStatus').and.callThrough();
    helperService.updateContentStatus('do_12345', 'draft');
    expect(actionService.patch).toHaveBeenCalled();
  });

  it('#acceptContent_errMsg() should call toasterService.error() when action is accept', () => {
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(helperService, 'acceptContent_errMsg').and.callThrough();
    helperService.acceptContent_errMsg('accept');
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#acceptContent_errMsg() should call toasterService.error() when action is acceptWithChanges', () => {
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(helperService, 'acceptContent_errMsg').and.callThrough();
    helperService.acceptContent_errMsg('acceptWithChanges');
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#acceptContent_errMsg() should call toasterService.error() when action is not accept or  acceptWithChanges', () => {
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(helperService, 'acceptContent_errMsg').and.callThrough();
    helperService.acceptContent_errMsg('dummy');
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#fetchOrgAdminDetails() should call programsService.searchRegistry()', () => {
    spyOn(programsService, 'searchRegistry').and.returnValue(observableOf({}));
    spyOn(helperService, 'fetchOrgAdminDetails').and.callThrough();
    helperService.fetchOrgAdminDetails('abcd1234');
    expect(programsService.searchRegistry).toHaveBeenCalled();
  });

  it('#prepareNotificationData() should call #fetchOrgAdminDetails()', () => {
    spyOn(helperService, 'fetchOrgAdminDetails').and.returnValue(observableOf({}));
    spyOn(helperService, 'prepareNotificationData').and.callThrough();
    helperService.prepareNotificationData('draft', {organisationId: 'abcd12345'}, {id: '12345'});
    expect(helperService.fetchOrgAdminDetails).toHaveBeenCalledWith('abcd12345');
  });

  it('#getProgramConfiguration() should call contentService.post()', () => {
    spyOn(contentService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'getProgramConfiguration').and.callThrough();
    helperService.getProgramConfiguration({key: '', status: ''});
    expect(contentService.post).toHaveBeenCalled();
  });

  it('#apiErrorHandling() should call toasterService.error()', () => {
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(helperService, 'apiErrorHandling').and.callThrough();
    helperService.apiErrorHandling(undefined, {errorMsg: 'something went wrong'});
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#getContentOriginUrl() should return content url', () => {
    spyOn(programsService, 'getContentOriginEnvironment').and.returnValue('https://dock.sunbirded.org');
    spyOn(helperService, 'getContentOriginUrl').and.callThrough();
    const contentUrl = helperService.getContentOriginUrl('do_12345');
    expect(programsService.getContentOriginEnvironment).toHaveBeenCalled();
    expect(contentUrl).toEqual('https://dock.sunbirded.org/resources/play/content/do_12345');
  });

  it('#getTextbookDetails() should call actionService.get()', () => {
    spyOn(actionService, 'get').and.returnValue(observableOf({}));
    spyOn(helperService, 'getTextbookDetails').and.callThrough();
    helperService.getTextbookDetails('do_12345');
    expect(actionService.get).toHaveBeenCalled();
  });

  it('#validateForm() should return true when form status has isValid true', () => {
    spyOn(helperService, 'validateForm').and.callThrough();
    const returnValue = helperService.validateForm({isValid: true});
    expect(returnValue).toBeTruthy();
  });

  it('#validateForm() should return true when form status is undefined', () => {
    spyOn(helperService, 'validateForm').and.callThrough();
    const returnValue = helperService.validateForm(undefined);
    expect(returnValue).toBeTruthy();
  });

  it('#validateForm() should return true when form status has isValid false', () => {
    spyOn(helperService, 'validateForm').and.callThrough();
    const returnValue = helperService.validateForm({isValid: false});
    expect(returnValue).toBeFalsy();
  });

  it('#contentMetadataUpdate() should call #updateContent() when role is CONTRIBUTOR', () => {
    spyOn(helperService, 'updateContent').and.callThrough();
    spyOn(helperService, 'contentMetadataUpdate').and.callThrough();
    helperService.contentMetadataUpdate('CONTRIBUTOR', {}, 'do_123');
    expect(helperService.updateContent).toHaveBeenCalled();
  });

  it('#contentMetadataUpdate() should call #systemUpdateforContent() when role is REVIEWER', () => {
    spyOn(helperService, 'systemUpdateforContent').and.callThrough();
    spyOn(helperService, 'contentMetadataUpdate').and.callThrough();
    helperService.contentMetadataUpdate('REVIEWER', {content: {versionKey: 1}}, 'do_123');
    expect(helperService.systemUpdateforContent).toHaveBeenCalled();
  });

  it('#getContent() should call publicDataService.get()', () => {
    spyOn(publicDataService, 'get').and.returnValue(observableOf({}));
    spyOn(helperService, 'getContent').and.callThrough();
    helperService.getContent('do_12345');
    expect(publicDataService.get).toHaveBeenCalled();
  });

  it('#updateQuestionSetStatus() should call actionService.patch()', () => {
    spyOn(actionService, 'patch').and.returnValue(observableOf({}));
    spyOn(helperService, 'updateQuestionSetStatus').and.callThrough();
    helperService.updateQuestionSetStatus('do_12345', 'draft');
    expect(actionService.patch).toHaveBeenCalled();
  });

});
