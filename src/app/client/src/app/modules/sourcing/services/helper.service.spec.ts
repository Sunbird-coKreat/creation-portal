import { TestBed, fakeAsync } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentService, ActionService, PublicDataService, ProgramsService, NotificationService, UserService,
  FrameworkService, LearnerService, CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule, ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { ProgramStageService } from '../../program/services';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, of, throwError as observableError } from 'rxjs';
import { childMetaFormData } from './sourcing/helper.service.spec.data';
import { CacheService } from '../../shared/services/cache-service/cache.service';
import { SourcingService } from '../../sourcing/services';

xdescribe('HelperService', () => {
  const resourceBundle = {
    messages: {
      fmsg: {
        m00100: 'toaster error message',
        approvingFailed: 'toaster error message'
      },
      emsg: {
        m00100: 'toaster error message',
        approvingFailed: 'toaster error message',
        contentRejectedForProgram: 'toaster error message',
        contentAcceptedForProgram: 'toaster error message'
      }
    }
  };
  const userServiceStub = {
    userid: 'abcd1234',
    userProfile : {
      userid: 'abcd1234'
    }
  };
  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
      },
      data: {
        telemetry: {
          env: 'programs',
          pageid: 'program'
        }
      }
    }
  };
  const errorRespone = {
    'id': '',
    'ver': 'private',
    'ts': '2019-08-09 06:36:01:735+0000',
    'params': {
        'resmsgid': null,
        'msgid': '9ee5a376-9e09-76d0-abb5-ebcf658e645b',
        'err': 'INVALID_PARAMETER',
        'status': 'INVALID_PARAMETER',
        'errmsg': 'Please provide valid accessCode.'
    },
    'responseCode': 'CLIENT_ERROR',
    'result': {
    }
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  let helperService, actionService, programStageService, contentService, learnerService;
  let programsService, frameworkService, toasterService, publicDataService, sourcingService, httpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule.forRoot(), TelemetryModule.forRoot(), RouterTestingModule],
      providers: [
        HelperService,
        ConfigService,
        ContentService,
        PublicDataService,
        ActionService,
        TelemetryService,
        ToasterService,
        ProgramStageService,
        ProgramsService,
        NotificationService,
        CacheService,
        FrameworkService,
        LearnerService,
        HttpClient,
        SourcingService,
        { provide: UserService, useValue: userServiceStub },
        { provide: ResourceService, useValue: resourceBundle },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
      ]
    });
    helperService = TestBed.inject(HelperService);
    actionService = TestBed.inject(ActionService);
    contentService = TestBed.inject(ContentService);
    programsService = TestBed.inject(ProgramsService);
    frameworkService =  TestBed.inject(FrameworkService);
    toasterService = TestBed.inject(ToasterService);
    publicDataService = TestBed.inject(PublicDataService);
    programStageService = TestBed.inject(ProgramStageService);
    sourcingService = TestBed.inject(SourcingService);
    learnerService = TestBed.inject(LearnerService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(HelperService).toBeTruthy();
  });

  it('#initialize() should call #fetchChannelData()', () => {
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
    spyOn(programsService, 'getCategoryDefinition').and.returnValue(of({res: 'dummyData'}));
    //spyOn(helperService, 'getCategoryMetaData').and.callThrough();
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

  it('#formConfigforContext should set _formConfigForContext', () => {
    helperService.formConfigforContext = childMetaFormData;
    expect(helperService._formConfigForContext).toEqual(childMetaFormData);
  });

  it('#formConfigforContext should give _formConfigForContext', () => {
    const dummyData = {name: 'sample textbook'};
    helperService._formConfigForContext = dummyData;
    const data  = helperService.formConfigforContext;
    expect(data).toEqual(dummyData);
  });

  it('#getFormConfigurationforContext should give copy of FormConfigurationforContext', () => {
    spyOn(helperService, 'getFormConfigurationforContext').and.callThrough();
    const result = helperService.getFormConfigurationforContext();
    expect(result).toEqual(helperService._formConfigForContext);
  });

  it('#selectedCollectionMetaData should set _selectedCollectionMetaData', () => {
    helperService.selectedCollectionMetaData = childMetaFormData;
    expect(helperService._selectedCollectionMetaData).toEqual(childMetaFormData);
  });

  it('#selectedCollectionMetaData should give _selectedCollectionMetaData', () => {
    const dummyData = {name: 'sample textbook'};
    helperService._selectedCollectionMetaData = dummyData;
    const data  = helperService.selectedCollectionMetaData;
    expect(data).toEqual(dummyData);
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

  it('#getContentOriginUrl() and #getQuestionSetOriginUrl() should return content url', () => {
    spyOn(programsService, 'getContentOriginEnvironment').and.returnValue('https://dock.sunbirded.org');
    spyOn(helperService, 'getContentOriginUrl').and.callThrough();
    const contentUrl = helperService.getContentOriginUrl('do_12345');
    expect(programsService.getContentOriginEnvironment).toHaveBeenCalled();
    expect(contentUrl).toEqual('https://dock.sunbirded.org/resources/play/content/do_12345');

    spyOn(helperService, 'getQuestionSetOriginUrl').and.callThrough();
    const contentUrlNew = helperService.getQuestionSetOriginUrl('do_12345');
    expect(contentUrlNew).toEqual('https://dock.sunbirded.org/resources/play/questionset/do_12345');
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
    helperService.updateQuestionSetStatus('do_12345', 'draft', 'comment');
    expect(actionService.patch).toHaveBeenCalled();
  });

  it('#getContextualHelpConfig() should return undefined', () => {
    spyOn(helperService, 'getContextualHelpConfig').and.callThrough();
    const sunbirdContextualHelpConfig = helperService.getContextualHelpConfig();
    expect(sunbirdContextualHelpConfig).toBeUndefined();
  });

  it('#reviewQuestionSet() should call actionService.post()', () => {
    spyOn(actionService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'reviewQuestionSet').and.callThrough();
    helperService.reviewQuestionSet('do_12345');
    expect(actionService.post).toHaveBeenCalled();
  });

  it('#retireContent() should call actionService.post()', () => {
    spyOn(actionService, 'delete').and.returnValue(observableOf({}));
    spyOn(helperService, 'retireContent').and.callThrough();
    helperService.retireContent('do_12345', 'questionSets');
    expect(actionService.delete).toHaveBeenCalled();
  });

  xit('#checkIfContentPublishedOrRejected() should return boolean value', () => {
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(programStageService, 'removeLastStage').and.callThrough();
    const data = {
      acceptedcontents: ['do_12345', 'do_123']
    };
    helperService.checkIfContentPublishedOrRejected(data, 'accept', 'do_12345');
    expect(actionService.delete).toHaveBeenCalled();
    // const datanew = {
    //   rejectedcontents: ['do_12345', 'do_123']
    // };
    // helperService.checkIfContentPublishedOrRejected(datanew, 'reject', 'do_12345');
    // expect(toasterService.error).toHaveBeenCalled();
  });


  it('#canAcceptContribution() should return boolean value', () => {
    const programDetails = {
      'program_id': '68443a40-3678-11ec-a56f-4b503455085f',
      'startdate': '2021-10-26T16:19:19.116Z',
      'enddate': '2022-12-03T18:29:59.000Z',
      'nomination_enddate': '2021-11-12T18:29:59.000Z',
      'shortlisting_enddate': '2022-11-19T18:29:59.000Z',
      'content_submission_enddate': '2022-11-26T18:29:59.000Z',
      'status': 'Live'
    };
    spyOn(programsService, 'isProjectLive').and.callThrough();
    spyOn(helperService, 'canAcceptContribution').and.callThrough();
    const res = helperService.canAcceptContribution(programDetails);
    expect(res).toBeTruthy();
  });

  it('#isOpenForNomination() should return boolean value', () => {
    const programDetails = {
      'program_id': '68443a40-3678-11ec-a56f-4b503455085f',
      'startdate': '2021-10-26T16:19:19.116Z',
      'enddate': '2022-12-03T18:29:59.000Z',
      'nomination_enddate': '2021-11-12T18:29:59.000Z',
      'shortlisting_enddate': '2022-11-19T18:29:59.000Z',
      'content_submission_enddate': '2022-11-26T18:29:59.000Z',
      'status': 'Live'
    };
    spyOn(programsService, 'isProjectLive').and.callThrough();
    spyOn(helperService, 'isOpenForNomination').and.callThrough();
    const res = helperService.isOpenForNomination(programDetails);
    expect(res).toBeFalsy();
  });

  it('#getSourceCategoryValues() should return source category valuese', () => {
    const targetCollectionFrameworksData = {
      framework: 'NCF'
    };
    const res = helperService.getSourceCategoryValues('', targetCollectionFrameworksData);
    expect(res).toEqual({});
  });

  it('#fetchProgramFramework() should get freamework deatils', () => {
    spyOn(frameworkService, 'initialize').and.callThrough();
    const sessionContext = {
      framework: 'NCF'
    };
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(sourcingService, 'apiErrorHandling').and.callThrough();
    spyOn(helperService, 'fetchProgramFramework').and.callThrough();
    helperService.fetchProgramFramework({});
    sourcingService.apiErrorHandling(errorRespone, {errorMsg: 'Fetching framework details failed'});
    helperService.fetchProgramFramework(sessionContext);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#setFrameworkCategories() should return freamework categories', () => {
    const sessionContext = {
      framework: 'NCF'
    };
    spyOn(helperService, 'setFrameworkCategories').and.callThrough();
    const res = helperService.setFrameworkCategories(sessionContext);
    expect(res).toEqual({});
  });

  it('#validateFormConfiguration() should return boolean value', () => {
    const data = {
      framework: 'NCF',
      targetFWIds: 'NCF'
    };
    spyOn(helperService, 'validateFormConfiguration').and.callThrough();
    const formFields = [{"code":"targetBoardIds","visible":true,"depends":[],"editable":true,"dataType":"list","sourceCategory":"board","output":"identifier","renderingHints":{"class":"sb-g-col-lg-1 required"},"description":"Board","label":"Board/Syllabus of the audience","required":true,"name":"Board/Syllabus","inputType":"select","placeholder":"Select Board/Syllabus","validations":[{"type":"required","message":"Board is required"}]}];
    const res = helperService.validateFormConfiguration(data, formFields);
    expect(res).toBeFalsy();
  });

  it('#hasEmptyElement() should return value', () => {
    spyOn(helperService, 'hasEmptyElement').and.callThrough();
    const res = helperService.hasEmptyElement(['framework']);
    expect(res).toBeFalsy();
    const data = helperService.hasEmptyElement(undefined);
    expect(data).toBeTruthy();
  });

  it('#convertNameToIdentifier() should return value', () => {
    spyOn(helperService, 'convertNameToIdentifier').and.callThrough();
    const res = helperService.convertNameToIdentifier('framework', 'value', 'key', 'code', 'collectionMeta', 'mapBy');
    expect(res).toEqual([]);
  });

  it('#getFormattedFrameworkMetaWithOutCollection() should return value', () => {
    const data = {
      framework: 'NCF',
      targetFWIds: 'NCF'
    };
    spyOn(helperService, 'getFormattedFrameworkMetaWithOutCollection').and.callThrough();
    const res = helperService.getFormattedFrameworkMetaWithOutCollection({}, data);
    expect(res).toEqual({});
  });

  it('#getFormattedFrameworkMeta() should return value', () => {
    const data = {
      framework: 'NCF',
      targetFWIds: 'NCF'
    };
    spyOn(helperService, 'getFormattedFrameworkMeta').and.callThrough();
    const res = helperService.getFormattedFrameworkMeta({}, data);
    expect(res.targetFWIds).toEqual('NCF');
  });

  it('#setTargetFrameWorkData() should call', () => {
    const data = {
      framework: 'NCF',
      targetFWIds: 'NCF'
    };
    spyOn(helperService, 'setTargetFrameWorkData').and.callThrough();
    const res = helperService.setTargetFrameWorkData(data);
    expect(helperService.setTargetFrameWorkData).toHaveBeenCalled();
  });

  it('#getContentCorrectionComments() should return value', () => {
    const program = {
      target_type: 'searchCriteria',
      sourcingrejectedcomments: 'test'
    };
    const contentMetaData = {
      identifier: 'do_123',
      status: 'Draft',
      prevStatus: 'Review',
      rejectComment: 'test',
      requestChanges: 'test',
      framework: 'NCF',
      targetFWIds: 'NCF'
    };
    spyOn(helperService, 'getContentCorrectionComments').and.callThrough();
    const res = helperService.getContentCorrectionComments(contentMetaData, {}, program);
    expect(res).toEqual('test');
  });

  it('#checkIfContentisWithProgram() should return value', () => {
    const acceptedcontents = {
      acceptedcontents: ['do_12345', 'do_123']
    };
    spyOn(helperService, 'checkIfContentisWithProgram').and.callThrough();
    const res = helperService.checkIfContentisWithProgram('do_123', acceptedcontents);
    expect(res).toBeFalsy();

    const rejectedContents = {
      rejectedContents: ['do_123']
    };
    spyOn(toasterService, 'error').and.callThrough();
    const returnVal = helperService.checkIfContentisWithProgram('do_123', rejectedContents);
    expect(returnVal).toBeTruthy();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#publishContentOnOrigin() should publish content', () => {
    const contentMetaData = {
      identifier: 'do_123',
      status: 'Draft',
      prevStatus: 'Review',
      rejectComment: 'test',
      requestChanges: 'test',
      framework: 'NCF',
      targetFWIds: 'NCF',
      mimeType: 'application/vnd.sunbird.questionset'
    };
    const program = {
      // target_type: 'searchCriteria',
      sourcingrejectedcomments: 'test',
      rootorg_id: 'rootorg_id'
    };
    spyOn(learnerService, 'post').and.returnValue(observableOf({}));
    spyOn(helperService, 'publishContentOnOrigin').and.callThrough();
    helperService.publishContentOnOrigin('accept', 'do_123', contentMetaData, program);
    expect(helperService.publishContentOnOrigin).toHaveBeenCalled();
  });

  xit('#attachContentToProgram() should add content to program', () => {
    const program = {
      sourcingrejectedcomments: 'test',
      rootorg_id: 'rootorg_id',
      acceptedcontents: ['do_12345', 'do_123'],
      rejectedContents: ['do_1234']
    };
    spyOn(toasterService, 'error').and.callThrough();
    spyOn(publicDataService, 'post').and.returnValue(observableOf({}));
    spyOn(programsService, 'updateProgram').and.returnValue({});
    spyOn(helperService, 'attachContentToProgram').and.callThrough();
    helperService.attachContentToProgram('accept', 'do_123', program, 'test');
    expect(helperService.attachContentToProgram).toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#getDynamicHeaders() should get headers', () => {
    spyOn(httpClient, 'get').and.returnValue(observableOf({}));
    spyOn(helperService, 'getDynamicHeaders').and.callThrough();
    helperService.getDynamicHeaders('url', 'questionSets');
    expect(helperService.getDynamicHeaders).toHaveBeenCalled();
  });

  it('#isIndividualAndNotSample() should return value', () => {
    spyOn(helperService, 'isIndividualAndNotSample').and.callThrough();
    helperService.isIndividualAndNotSample('individual', false);
    expect(helperService.isIndividualAndNotSample).toHaveBeenCalled();
  });

  it('#getContextObj() should return value', () => {
    spyOn(helperService, 'getContextObj').and.callThrough();
    helperService.getContextObj('topic', {}, 'searchCriteria');
    expect(helperService.getContextObj).toHaveBeenCalled();

    helperService.getContextObj('topic', {}, 'questionSets');
    expect(helperService.getContextObj).toHaveBeenCalled();
  });

  it('#fetchRootMetaData() should return value', () => {
    spyOn(helperService, 'fetchRootMetaData').and.callThrough();
    helperService.fetchRootMetaData([
      'channel',
      'framework',
      'board',
      'medium',
      'gradeLevel',
      'subject'
    ], {}, 'searchCriteria');
    expect(helperService.fetchRootMetaData).toHaveBeenCalled();
  });

  it('#getSharedContextObjectProperty() should return value', () => {
    const programDetails = {
      'program_id': '68443a40-3678-11ec-a56f-4b503455085f',
      'startdate': '2021-10-26T16:19:19.116Z',
      'enddate': '2022-12-03T18:29:59.000Z',
      'nomination_enddate': '2021-11-12T18:29:59.000Z',
      'shortlisting_enddate': '2022-11-19T18:29:59.000Z',
      'content_submission_enddate': '2022-11-26T18:29:59.000Z',
      'status': 'Live'
    };
    spyOn(helperService, 'getSharedContextObjectProperty').and.callThrough();
    helperService.getSharedContextObjectProperty(programDetails, 'rootorg_id');
    expect(helperService.getSharedContextObjectProperty).toHaveBeenCalled();

    const returnVal = helperService.getSharedContextObjectProperty(programDetails, 'channel', {'channel': '123'});
    expect(returnVal).toBeTruthy();
  });

});
