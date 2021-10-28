import { Injectable } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse, ResourceService } from '@sunbird/shared';
import { ContentService, ActionService, PublicDataService, ProgramsService, NotificationService, UserService,
  FrameworkService, LearnerService } from '@sunbird/core';
import { throwError, Observable, of, Subject, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap, mergeMap, filter, first, skipWhile } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ProgramStageService } from '../../program/services';
import { CacheService } from 'ng2-cache-service';
import { ActivatedRoute, Router} from '@angular/router';
import { SourcingService } from '../../sourcing/services';
import { isUndefined } from 'lodash';
import { UUID } from 'angular2-uuid';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  mvcLibraryFeatureConfiguration: any
  private sendNotification = new Subject<string>();
  private _availableLicences: Array<any>;
  private _channelData: any;
  private _categoryMetaData: any;
  private _categoryMetaData$ = new Subject<any>();
  public flattenedFrameworkCategories = {};
  public readonly categoryMetaData$: Observable<any> = this._categoryMetaData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  private _selectedCollectionMetaData: any;
  private _telemetryPageId: any;
  private _telemetryInteractCdata: any;
  constructor(private configService: ConfigService, private contentService: ContentService,
    private toasterService: ToasterService, private publicDataService: PublicDataService,
    private actionService: ActionService, private resourceService: ResourceService,
    public programStageService: ProgramStageService, private programsService: ProgramsService,
    private notificationService: NotificationService, private userService: UserService, private cacheService: CacheService,
    public frameworkService: FrameworkService, public learnerService: LearnerService, public activatedRoute: ActivatedRoute, public httpClient: HttpClient,
    private sourcingService: SourcingService, private router: Router) { }

  initialize(programDetails) {
    if (!this.getAvailableLicences()) {
      this.getLicences().subscribe();
    }
    if (programDetails.rootorg_id) {
      this.fetchChannelData(programDetails.rootorg_id);
    }
    this.actionService.channelId = programDetails.rootorg_id;
  }

  getCategoryMetaData(category, channelId, objectType) {
    this.programsService.getCategoryDefinition(category, channelId, objectType).subscribe(data => {
      this.selectedCategoryMetaData = data;
      this._categoryMetaData$.next(data);
    });
  }

  getCollectionOrContentCategoryDefinition(targetCollectionMeta, assetMeta, programTargetType?) {

    if (!programTargetType || programTargetType === 'collections') {
    // tslint:disable-next-line:max-line-length
    const categoryDefinition$ = this.programsService.getCategoryDefinition(targetCollectionMeta.primaryCategory, targetCollectionMeta.channelId, 'Collection')
      .pipe(
        switchMap((response: any) => {
          const targetCollectionFormData = _.get(response, 'result.objectCategoryDefinition.forms.childMetadata.properties');
          if (!targetCollectionFormData) {
            // tslint:disable-next-line:max-line-length
            const contentCategoryDefinition$ = this.programsService.getCategoryDefinition(assetMeta.primaryCategory, assetMeta.channelId, assetMeta.objectType);
            return contentCategoryDefinition$.pipe(
              map(data => _.get(data, 'result.objectCategoryDefinition.forms.update.properties')));
          }
          return of(targetCollectionFormData);
        })
      );
      categoryDefinition$.subscribe(
        (response) => {
          this.selectedCategoryMetaData = response;
          this._categoryMetaData$.next(response);
        }
      );
    } else if(programTargetType === 'searchCriteria'){
      const contentCategoryDefinition$ = this.programsService.getCategoryDefinition(assetMeta.primaryCategory, assetMeta.channelId, assetMeta.objectType).pipe(map((data) => {
        return _.get(data, 'result.objectCategoryDefinition.forms.update.properties');
      }));
      contentCategoryDefinition$.subscribe(
        (response) => {
          this.selectedCategoryMetaData = response;
          this._categoryMetaData$.next(response);
        }
      );
    }
  }

  set selectedCategoryMetaData(data) {
    this._categoryMetaData = data;
    this._categoryMetaData$.next(data);
  }

  get selectedCategoryMetaData() {
    return this._categoryMetaData;
  }

  set selectedCollectionMetaData(data) {
    this._selectedCollectionMetaData = data;
  }

  get selectedCollectionMetaData() {
    return this._selectedCollectionMetaData;
  }

  checkIfCollectionFolder(data) {
    // tslint:disable-next-line:max-line-length
    if (data.mimeType === 'application/vnd.ekstep.content-collection' && data.visibility === 'Parent') {
      return true;
    } else {
      return false;
    }
  }

  checkIfMainCollection (data) {
    // tslint:disable-next-line:max-line-length
    if (data.mimeType === 'application/vnd.ekstep.content-collection' && data.visibility === 'Default') {
      return true;
    } else {
      return false;
    }
  }

  getLicences(): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'license',
            'status': ['Live']
          }
        }
      }
    };
    return this.contentService.post(req).pipe(map((res) => {
      return res.result;
    }), tap((data: any) => this._availableLicences = _.get(data, 'license')), catchError(err => {
      const errInfo = { errorMsg: 'search failed' };
      return throwError(this.apiErrorHandling(err, errInfo));
    }));
  }

  fetchChannelData(channelId) {
    this.frameworkService.getChannelData(channelId);
    // tslint:disable-next-line:max-line-length
    this.frameworkService.channelData$.pipe(filter(data => channelId === _.get(data, 'channelData.identifier'), first())).subscribe(data => {
      this._channelData = _.get(data, 'channelData');
    });
  }

  getProgramLevelChannelData() {
    return this._channelData;
  }

  getAvailableLicences() {
    return this._availableLicences;
  }

  getNotification(): Observable<any> {
    return this.sendNotification.asObservable();
  }

  updateContent(req, contentId): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.CONTENT.UPDATE + '/' + contentId,
      data: {
        'request': req
      }
    };
    return this.actionService.patch(option);
  }

  reviewContent(contentId): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.CONTENT.REVIEW + '/' + contentId,
      data: {
        'request': {
          'content': {}
        }
      }
    };
    return this.actionService.post(option);
  }

  reviewQuestionSet(contentId): Observable<ServerResponse> {
    const option = {
      url: `questionset/v1/review/${contentId}`,
      data: {
        'request': {
          'questionset': {}
        }
      }
    };
    return this.actionService.post(option);
  }

  retireContent(contentId): Observable<ServerResponse> {
    const option = {
      url: this.configService.urlConFig.URLS.DOCKCONTENT.RETIRE + '/' + contentId
    };
    return this.actionService.delete(option);
  }

  publishContent(contentId, userId) {
    const requestBody = {
      request: {
        content: {
          lastPublishedBy: userId
        }
      }
    };
    const option = {
      url: `content/v3/publish/${contentId}`,
      data: requestBody
    };
    return this.actionService.post(option);
  }

  publishQuestionSet(contentId, userId) {
    const requestBody = {
      request: {
        questionset: {
          lastPublishedBy: userId
        }
      }
    };
    const option = {
      url: `questionset/v1/publish/${contentId}`,
      data: requestBody
    };
    return this.actionService.post(option);
  }

  submitRequestChanges(contentId, comment) {
    const requestBody = {
      request: {
        content: {
          rejectComment: _.trim(comment)
        }
      }
    };
    const option = {
      url: `content/v3/reject/${contentId}`,
      data: requestBody
    };
    return this.actionService.post(option);
  }

  updateContentStatus(contentId, status, comment?) {
    const requestBody = {
      request: {
        content: {
          status: status
        }
      }
    };

    if (!_.isUndefined(comment)) {
      requestBody.request.content['requestChanges'] = _.trim(comment);
    }
    const option = {
      url: `system/v3/content/update/${contentId}`,
      data: requestBody
    };
    return this.actionService.patch(option);
  }

  checkIfContentPublishedOrRejected(data, action, contentId) {
    if ((action === 'accept' && _.includes(data.acceptedcontents, contentId))
      || (action === 'reject' && _.includes(data.rejectedcontents, contentId))) {
      action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00104) :
        this.toasterService.error(this.resourceService.messages.fmsg.m00105);
      this.programStageService.removeLastStage();
      this.programsService.emitHeaderEvent(true);
      return true;
    } else {
      return false;
    }
  }


  publishContentToDiksha(action, collectionId, contentId, originData, contentMetaData, rejectedComments?) {
    const channel =  _.get(this._selectedCollectionMetaData.originData, 'channel');
    if (_.isString(channel)) {
      contentMetaData['createdFor'] = [channel];
    } else if (_.isArray(channel)) {
      contentMetaData['createdFor'] = channel;
    }
    const option = {
      url: 'content/v3/read/' + collectionId,
      param: { 'mode': 'edit', 'fields': 'acceptedContents,rejectedContents,versionKey,sourcingRejectedComments' }
    };

    // @Todo remove after testing
    // this.sendNotification.next(_.capitalize(action));
    this.actionService.get(option).pipe(map((res: any) => res.result.content)).subscribe((data) => {
      if (this.checkIfContentPublishedOrRejected(data, action, contentId)) { return; }
      if (action === 'accept' || action === 'acceptWithChanges') {
        if (_.get(this._selectedCollectionMetaData, 'printable')) {
          this.attachContentToTextbook(action, collectionId, contentId, data, rejectedComments);
        } else {
          // tslint:disable-next-line:max-line-length
          const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
          ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : window.location.origin;

          const reqFormat = {
            source: `${baseUrl}/api/content/v1/read/${contentMetaData.identifier}`,
            metadata: {..._.pick(this._selectedCollectionMetaData, ['framework']),
                        ..._.pick(_.get(this._selectedCollectionMetaData, 'originData'), ['channel']),
                        ..._.pick(contentMetaData, ['name', 'code', 'mimeType', 'contentType', 'createdFor']),
                          ...{'lastPublishedBy': this.userService.userProfile.userId}},
            collection: [
              {
                identifier: originData.textbookOriginId,
                unitId: originData.unitOriginId,
              }
            ]
          };

          const reqOption = {
            url: this.configService.urlConFig.URLS.BULKJOB.DOCK_IMPORT_V1,
            data: {
              request: {
                content: [
                  reqFormat
                ]
              }
            }
          };
          if (_.get(contentMetaData, 'mimeType').toLowerCase() === 'application/vnd.sunbird.questionset') {
            reqOption.url = this.configService.urlConFig.URLS.BULKJOB.DOCK_QS_IMPORT_V1;
            reqOption.data.request['questionset'] = {};
            reqOption.data.request['questionset'] = reqOption.data.request.content;
            _.first(reqOption.data.request['questionset']).source = `${baseUrl}/api/questionset/v1/read/${contentMetaData.identifier}`;
            delete reqOption.data.request.content;
          }
          this.learnerService.post(reqOption).subscribe((res: any) => {
            if (res && res.result) {
              const me = this;
              setTimeout(() => {
                me.attachContentToTextbook(action, collectionId, contentId, data);
              }, 1000);
            }
          }, err => {
            this.acceptContent_errMsg(action);
          });
        }
      } else {
        const me = this;
        setTimeout(() => {
          me.attachContentToTextbook(action, collectionId, contentId, data, rejectedComments);
        }, 1000);
      }
    }, (err) => {
      this.acceptContent_errMsg(action);
    });
  }

  publishQuestionSetToConsumption(questionSetId) {
    const option = {
      url: 'questionset/v1/read/' + questionSetId,
      param: { 'mode': 'edit' }
    };

    return this.actionService.get(option).pipe(
      mergeMap((res: any) => {
        const questionSetData  = res.result.questionset;

        const channel =  _.get(this._selectedCollectionMetaData.originData, 'channel');
        if (_.isString(channel)) {
          questionSetData['createdFor'] = [channel];
        } else if (_.isArray(channel)) {
          questionSetData['createdFor'] = channel;
        }

        const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
              ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : window.location.origin;

        const reqFormat = {
            source: `${baseUrl}/api/questionset/v1/read/${questionSetData.identifier}`,
            metadata: {..._.pick(this._selectedCollectionMetaData, ['framework']),
                          ..._.pick(_.get(this._selectedCollectionMetaData, 'originData'), ['channel']),
                          ..._.pick(questionSetData, ['name', 'code', 'mimeType', 'contentType', 'createdFor']),
                          ...{'lastPublishedBy': this.userService.userProfile.userId}}
        };

        const reqOption = {
          url: this.configService.urlConFig.URLS.BULKJOB.DOCK_QS_IMPORT_V1,
          data: {
            request: {
              questionset: [ reqFormat ]
            }
          }
        };
      return this.learnerService.post(reqOption);
    }));
  }

  attachContentToTextbook(action, collectionId, contentId, data, rejectedComments?) {
    const request = {
      content: {
        'versionKey': data.versionKey
      }
    };

    // tslint:disable-next-line:max-line-length
    if (action === 'accept' || action === 'acceptWithChanges') {
      request.content['acceptedContents'] = _.uniq([...data.acceptedContents || [], contentId]);
    } else {
      request.content['rejectedContents'] = _.uniq([...data.rejectedContents || [], contentId]);
    }

    if (action === 'reject' && rejectedComments) {
      // tslint:disable-next-line:max-line-length
      request.content['sourcingRejectedComments'] = data.sourcingRejectedComments && _.isString(data.sourcingRejectedComments) ? JSON.parse(data.sourcingRejectedComments) : data.sourcingRejectedComments || {};
      request.content['sourcingRejectedComments'][contentId] = rejectedComments;
    }

    this.updateContent(request, collectionId).subscribe(() => {
        if (action === 'accept' || action === 'acceptWithChanges') {
          this.toasterService.success(this.resourceService.messages.smsg.m0066);
        } else if (action === 'reject') {
          this.toasterService.success(this.resourceService.messages.smsg.m0067);
        }
        this.sendNotification.next(_.capitalize(action));
        this.programStageService.removeLastStage();
        this.programsService.emitHeaderEvent(true);
    }, (err) => {
      this.acceptContent_errMsg(action);
    });
  }

  acceptContent_errMsg(action) {
    action === 'accept' || action === 'acceptWithChanges' ? this.toasterService.error(this.resourceService.messages.fmsg.approvingFailed) :
    this.toasterService.error(this.resourceService.messages.fmsg.m00100);
  }

  fetchOrgAdminDetails(orgId): Observable<any> {
    const finalResult = {};
    const orgSearch = {
      entityType: ['Org'],
      filters: {
        osid: { eq: orgId }
      }
    };
    return this.programsService.searchRegistry(orgSearch).pipe(switchMap((res: any) => {
      if (res && res.result.Org.length) {
        const userSearch = {
          entityType: ['User'],
          filters: {
            osid: { eq: res.result.Org[0].createdBy }
          }
        };
        finalResult['Org'] = res.result.Org[0];
        return this.programsService.searchRegistry(userSearch);
      }
    }), map((res2: any) => {
      finalResult['User'] = res2.result.User[0];
      return finalResult;
    }),
      catchError(err => throwError(err)));
  }

  prepareNotificationData(status, contentMetaData, programDetails) {
    this.fetchOrgAdminDetails(contentMetaData.organisationId).subscribe(result => {
      if (result && result.Org && result.User && result.User.userId) {
        const notificationForContributor = {
          user_id: contentMetaData.createdBy,
          content: { name: contentMetaData.name },
          org: { name: result.Org.name },
          program: { name: programDetails.name },
          status: status
        };
        const notificationForPublisher = {
          user_id: result.User.userId,
          content: { name: contentMetaData.name },
          org: { name: result.Org.name },
          program: { name: programDetails.name },
          status: status
        };
        const notify = [notificationForContributor, notificationForPublisher];
        forkJoin(..._.map(notify, role => this.notificationService.onAfterContentStatusChange(role))).subscribe();
      }
    }, err => {
      console.error('error in triggering notification');
    });
  }

  getProgramConfiguration(reqData) {
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.CONFIGURATION_SEARCH}`,
      data: {
        request: {
          key: reqData.key,
          status: reqData.status
        }
      }
    };
    return this.contentService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        const response = _.get(data, 'params.status');
        if (response !== 'successful') {
          return throwError(data);
        }
       if (_.get(data, 'result.configuration.key') === 'mvcLibraryFeature') {
          this.mvcLibraryFeatureConfiguration = _.get(data, 'result.configuration.value');
       }
        return of(data);
      }));
  }
  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
  }

  getContentOriginUrl(contentId) {
    return this.programsService.getContentOriginEnvironment() + '/resources/play/content/' + contentId;
  }

  getQuestionSetOriginUrl(questionsetId) {
    return this.programsService.getContentOriginEnvironment() + '/resources/play/questionset/' + questionsetId;
  }

  getTextbookDetails(textbookId) {
    const option = {
      url: 'content/v3/read/' + textbookId,
      param: { 'mode': 'edit', 'fields': 'versionKey,mvcContentCount,mvcContributions' }
    };
    return  this.actionService.get(option);
  }

  getEditableFields(role, formFields, contentMetaData) {
    const editableFields = [];
    switch (role) {
      case 'CONTRIBUTOR':
        editableFields.push('name');
      _.forEach(formFields, (field) => {
        editableFields.push(field.code);
      });
      break;
      case 'REVIEWER':
        if (!contentMetaData.sourceURL) {
          // tslint:disable-next-line:max-line-length
          const editablefieldConfiguration = _.filter(this.programsService.overrideMetaData, {editable: true});

          _.forEach(formFields, (field) => {
            _.forEach(editablefieldConfiguration, (fieldConfig) => {
              if (_.has(field, 'sourceCategory') && field.sourceCategory === fieldConfig.code && fieldConfig.editable === true) {
                editableFields.push(field.code);
              } else if (!_.has(field, 'sourceCategory') && field.code === fieldConfig.code && fieldConfig.editable === true) {
                editableFields.push(field.code);
              }
            });
          });
        }
      break;
    }
    return editableFields;
  }

  getFormattedData(formValue, formFields) {
    // tslint:disable-next-line:only-arrow-functions
    const truthyformValue = _.pickBy(formValue, function(value, key) {
      return !(value === undefined || (_.isArray(value) && value.length === 0) || value === '' || value === null);
    });
    const trimmedValue = _.mapValues(truthyformValue, (value) => {
      if (_.isString(value)) {
        return _.trim(value);
      } else {
        return value;
      }
    });
    _.forEach(formFields, field => {
      if (field.dataType === 'list') {
        if (_.isString(trimmedValue[field.code])) {
          trimmedValue[field.code] = _.split(trimmedValue[field.code], ',');
        }
      } else if (field.dataType === 'text') {
        if (_.isArray(trimmedValue[field.code])) {
          trimmedValue[field.code] = _.join(trimmedValue[field.code]);
        }
      }
    });
    return _.pickBy(_.assign({}, trimmedValue), _.identity);
  }

  isMetaDataModified(metaBeforeUpdate, metaAfterUpdate) {
    let metaDataModified = false;
    const overridableFields = _.filter(this.programsService.overrideMetaData, (field) => field.editable === true);
    _.forEach(overridableFields, (field) => {
        if (Array.isArray(metaAfterUpdate[field.code])) {
          if (JSON.stringify(metaAfterUpdate[field.code]) !== JSON.stringify(metaBeforeUpdate[field.code])) {
            if (typeof metaBeforeUpdate[field.code] === 'undefined') {
              if (metaAfterUpdate[field.code].length) {
                metaDataModified = true;
              }
            } else {
              metaDataModified = true;
            }
          }
        } else if (typeof metaAfterUpdate[field.code] !== 'undefined'
          && metaAfterUpdate[field.code].localeCompare(metaBeforeUpdate[field.code]) !== 0) {
            metaDataModified = true;
        }
    });

    return metaDataModified;
  }

  initializeMetadataForm(sessionContext, formFieldProperties, contentMetadata) {
    const categoryMasterList = sessionContext.frameworkData;
    let { gradeLevel, subject} = sessionContext;
    let gradeLevelTerms = [], subjectTerms = [], topicTerms = [];
    let gradeLevelTopicAssociations = [], subjectTopicAssociations = [];
    _.forEach(categoryMasterList, (category) => {
      if(category.code === 'gradeLevel') {
        const terms = category.terms;
        if(terms) {
          gradeLevelTerms =  _.concat(gradeLevelTerms, _.filter(terms,  (t)  => _.includes(gradeLevel, t.name)));
        }
      }

      if(category.code === 'subject') {
        const terms = category.terms;
        if(terms) {
          subjectTerms =  _.concat(subjectTerms, _.filter(terms,  (t)  => _.includes(subject, t.name)));
        }
      }
      _.forEach(formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code && category.code !== 'learningOutcome' && category.code !== 'topic') {
          formFieldCategory.range = category.terms;
        }

        if(formFieldCategory.code === 'topic') {
          if(!formFieldCategory.range) formFieldCategory.range = [];
          if(!gradeLevelTopicAssociations.length && !subjectTopicAssociations.length && gradeLevelTerms.length && subjectTerms.length) {
            _.forEach(gradeLevelTerms, (term) => {
              if(term.associations) {
              gradeLevelTopicAssociations = _.concat(gradeLevelTopicAssociations,
                _.filter(term.associations, (association) => association.category === 'topic'))
              }
            })
            _.forEach(subjectTerms, (term) => {
              if(term.associations) {
              subjectTopicAssociations = _.concat(subjectTopicAssociations,
                _.filter(term.associations, (association) => association.category === 'topic'))
              }
            })
            formFieldCategory.range = _.intersectionWith(gradeLevelTopicAssociations, subjectTopicAssociations, (a, o) =>  a.name === o.name );
          }
          topicTerms = _.filter(sessionContext.topicList, (t) => _.find(formFieldCategory.range, { name: t.name }))
        }

        if (formFieldCategory.code === 'learningOutcome') {
          const topicTerm = _.find(sessionContext.topicList, { name: _.first(sessionContext.topic) });
          if (topicTerm && topicTerm.associations) {
            formFieldCategory.range = _.map(topicTerm.associations, (learningOutcome) =>  learningOutcome);
          }
          else {
            if(topicTerms) {
              _.forEach(topicTerms, (term) => {
                if(term.associations) {
                  formFieldCategory.range = _.concat(formFieldCategory.range || [], _.map(term.associations, (learningOutcome) =>learningOutcome));
                }
              })
            }
          }
        }
        if (formFieldCategory.code === 'additionalCategories') {
          console.log(this.cacheService.get(this.userService.hashTagId));
          // tslint:disable-next-line:max-line-length
          formFieldCategory.range = _.map(_.get(this.getProgramLevelChannelData(), 'contentAdditionalCategories'), data => {
            return {name: data};
          });
        }
        if(formFieldCategory.code === 'bloomsLevel' && !categoryMasterList[formFieldCategory.code]) {
          categoryMasterList[formFieldCategory.code] = formFieldCategory.range;
        }
        if (formFieldCategory.code === 'license' && this.getAvailableLicences()) {
          formFieldCategory.range = this.getAvailableLicences();
        }
      });
    });

    // set default values in the form
    if (contentMetadata) {
      _.forEach(formFieldProperties, (formFieldCategory) => {
        const requiredData = _.get(contentMetadata, formFieldCategory.code);
        if (!_.isEmpty(requiredData) && requiredData !== 'Untitled') {
          formFieldCategory.defaultValue = requiredData;
        }
        if (formFieldCategory.inputType === 'checkbox' && requiredData) {
          formFieldCategory.defaultValue = requiredData;
        }
        if (formFieldCategory.code === 'author' && !requiredData) {
          let creator = this.userService.userProfile.firstName;
          if (!_.isEmpty(this.userService.userProfile.lastName)) {
            creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
          }
          formFieldCategory.defaultValue = contentMetadata.creator || creator;
        }
        if (formFieldCategory.code === 'learningOutcome' && formFieldCategory.inputType === 'select' && _.isArray(requiredData)) {
          formFieldCategory.defaultValue = _.first(requiredData) || '';
        }
        // tslint:disable-next-line:max-line-length
        if (formFieldCategory.code === 'additionalCategories' && formFieldCategory.inputType === 'multiSelect' && contentMetadata.primaryCategory === 'eTextbook' &&
            contentMetadata.status === 'Draft' && _.isEmpty(contentMetadata.additionalCategories)) {
          formFieldCategory.defaultValue = ['Textbook'];
        }
      });
    }
    const sortedFormFields = _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
    return [categoryMasterList, sortedFormFields];
  }

  initializeFormFields(sessionContext, formFieldProperties, contentMetadata) {
    let categoryMasterList;
    let targetCategoryMasterList;
    const nonFrameworkFields = ['additionalCategories', 'license'];
    // tslint:disable-next-line:max-line-length
    if (_.has(sessionContext.targetCollectionFrameworksData, 'targetFWIds') && !_.isEmpty(this.frameworkService.frameworkData[sessionContext.targetCollectionFrameworksData.targetFWIds])) {
      targetCategoryMasterList = this.frameworkService.frameworkData[sessionContext.targetCollectionFrameworksData.targetFWIds];
      _.forEach(targetCategoryMasterList.categories, (frameworkCategories) => {
        _.forEach(formFieldProperties, (field) => {
          // tslint:disable-next-line:max-line-length
          if (frameworkCategories.code === field.sourceCategory && _.includes(field.code, 'target') && !_.includes(nonFrameworkFields, field.code)) {
              field.terms = frameworkCategories.terms;
          }
        });
      });
    }

    // tslint:disable-next-line:max-line-length
    if (_.has(sessionContext.targetCollectionFrameworksData, 'framework') && !_.isEmpty(this.frameworkService.frameworkData[sessionContext.targetCollectionFrameworksData.framework])) {
      categoryMasterList = this.frameworkService.frameworkData[sessionContext.targetCollectionFrameworksData.framework];
      _.forEach(categoryMasterList.categories, (frameworkCategories) => {
       _.forEach(formFieldProperties, (field) => {
         // tslint:disable-next-line:max-line-length
         if ((frameworkCategories.code === field.sourceCategory || frameworkCategories.code === field.code) && !_.includes(field.code, 'target') && !_.includes(nonFrameworkFields, field.code)) {
             field.terms = frameworkCategories.terms;
         }
         if (field.code === 'additionalCategories' && _.includes(nonFrameworkFields, field.code)) {
            field.range = _.map(_.get(this.getProgramLevelChannelData(), 'contentAdditionalCategories'), data => {
            return {name: data};
          });
         }
         if (field.code === 'license') {
           const license = this.getAvailableLicences();
           if (license) {
            field.range = _.map(license, 'name');
           }
         }
       });
     });
    }

    // set default values in the form
    if (contentMetadata) {
      _.forEach(formFieldProperties, (formFieldCategory) => {
        const requiredData = _.get(contentMetadata, formFieldCategory.code);
        if (!_.isEmpty(requiredData) && requiredData !== 'Untitled') {
          formFieldCategory.default = requiredData;
        }
        if (_.isEmpty(requiredData) && requiredData !== 'Untitled') {
          // tslint:disable-next-line:max-line-length
          if (_.has(sessionContext.targetCollectionFrameworksData, formFieldCategory.code) && !_.isUndefined(sessionContext.targetCollectionFrameworksData, formFieldCategory.code)) {
            formFieldCategory.default = sessionContext.targetCollectionFrameworksData[formFieldCategory.code];
          }
        }
        if (formFieldCategory.code === 'author' && !requiredData) {
          let creator = this.userService.userProfile.firstName;
          if (!_.isEmpty(this.userService.userProfile.lastName)) {
            creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
          }
          formFieldCategory.default = contentMetadata.creator || creator;
        }
      });
    }
    return formFieldProperties;
  }

  validateForm(formStatus) {
    let sbValidField = false;
    if (_.isEmpty(formStatus) || formStatus.isValid === true) {
      sbValidField = true;
    }
    return sbValidField;
  }

  contentMetadataUpdate(role, req, contentId): Observable<any> {
    if (role === 'CONTRIBUTOR') {
      return this.updateContent(req, contentId);
    } else if ('REVIEWER') {
      delete req.content.versionKey;
      return this.systemUpdateforContent(req, contentId);
    }
  }

  systemUpdateforContent(requestBody, contentId) {
    const option = {
      url: `system/v3/content/update/${contentId}`,
      data: {
        'request': requestBody
      }
    };
    return this.actionService.patch(option);
  }

  getFormConfiguration() {
    return _.cloneDeep(this.selectedCategoryMetaData);
  }

  mapContentTypesToCategories(nomContentTypes) {
      const mapping = {
              'TeachingMethod' : 'Teacher Resource',
              'PedagogyFlow' : 'Teacher Resource',
              'FocusSpot' : 'Teacher Resource',
              'LearningOutcomeDefinition' : 'Teacher Resource',
              'PracticeQuestionSet' : 'Practice Question Set',
              'CuriosityQuestionSet': 'Practice Question Set',
              'MarkingSchemeRubric' : 'Teacher Resource',
              'ExplanationResource' : 'Explanation Content',
              'ExperientialResource' : 'Learning Resource',
              'ConceptMap' : 'Learning Resource',
              'SelfAssess' : 'Course Assessment',
              'ExplanationVideo' : 'Explanation Content',
              'ClassroomTeachingVideo' : 'Explanation Content',
              'ExplanationReadingMaterial' : 'Learning Resource',
              'PreviousBoardExamPapers' : 'Learning Resource',
              'LessonPlanResource' : 'Teacher Resource',
              'LearningActivity' : 'Learning Resource',
              };
      const oldContentTypes = _.keys(mapping);
      if (!_.isEmpty(nomContentTypes) && _.includes(oldContentTypes,  _.nth(nomContentTypes, 0))) {
        // means the nomination is has old contnet types and not the content categories
        const nomContentCategories = _.map(nomContentTypes, (contentType) => {
            return mapping[contentType];
        });
        return _.uniq(nomContentCategories);
      } else {
        return nomContentTypes;
      }
  }
  getSharedProperties(programDetails, collection?) {
    const selectedSharedContext = programDetails.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: this.getSharedContextObjectProperty(programDetails, context, collection)};
    }, {});
    return selectedSharedContext;
  }
  getSharedContextObjectProperty(programDetails, property, collection?) {
    let ret;
    switch (property) {
      case 'channel':
        ret =  _.get(programDetails, 'rootorg_id');
        break;
      case 'topic':
        ret = null;
        break;
      default:
        ret =  _.get(programDetails, `config.${property}`);
        break;
    }
    if (collection) {
      ret = collection[property] || ret;
    }
    if (_.includes(['gradeLevel', 'medium', 'subject'], property)) {
      ret = _.isArray(ret) ? ret : _.split(ret, ',');
    }
    return ret || null;

    /*if (property === 'channel') {
       return _.get(this.programDetails, 'rootorg_id');
    } else if ( property === 'topic' ) {
      return null;
    } else {
      const collectionComComponent = _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.collection' });
      const filters =  collectionComComponent.config.filters;
      const explicitProperty =  _.find(filters.explicit, {'code': property});
      const implicitProperty =  _.find(filters.implicit, {'code': property});
      return (implicitProperty) ? implicitProperty.range || implicitProperty.defaultValue :
       explicitProperty.range || explicitProperty.defaultValue;
    }*/
  }
  fetchRootMetaData(sharedContext, selectedSharedContext, programTargetType?) {
    return sharedContext.reduce((obj, context) => {
              return { ...obj, ...(this.getContextObj(context, selectedSharedContext, programTargetType)) };
            }, {});
  }

  getContextObj(context, selectedSharedContext, programTargetType?) {
    if (context === 'topic' || (!_.isUndefined(programTargetType) && programTargetType && programTargetType === 'searchCriteria')) { // Here topic is fetched from unitLevel meta
      const fieldMustbeString = ['framework', 'board'];
      if (_.includes(fieldMustbeString, context) && _.isArray(selectedSharedContext[context])) {
        return {[context]:_.first(selectedSharedContext[context])}
      }
      return {[context]: selectedSharedContext[context]};
    } else {
      return {[context]: this._selectedCollectionMetaData[context]};
    }
  }

  isIndividualAndNotSample(currentOrgRole, sampleContent) {
    return !!(currentOrgRole === 'individual' && sampleContent !== true);
  }
   /**
   * get content details by id and query param
   */
  getContent(contentId: string, option: any = { params: {} }): Observable<ServerResponse> {
    const param = { fields: this.configService.editorConfig.DEFAULT_PARAMS_FIELDS };
    const req = {
        url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
        param: { ...param, ...option.params }
    };
    return this.publicDataService.get(req).pipe(map((response: ServerResponse) => {
        return response;
    }));
  }

  getDynamicHeaders(configUrl){
    const req = {
      url: `${configUrl}schemas/collection/1.0/config.json`,
    };
    return this.httpClient.get(req.url).pipe(map((response) => {
      return response;
    }));
  }

  // tslint:disable-next-line:max-line-length
  manageSourcingActions (action, sessionContext, programContext, unitIdentifier, contentData, rejectComment = '', isMetadataOverridden =  false) {
    if (!_.get(programContext, 'target_type') || programContext.target_type === 'collections') {
      const hierarchyObj  = _.get(sessionContext.hierarchyObj, 'hierarchy');
      if (hierarchyObj) {
        const rootOriginInfo = _.get(_.get(hierarchyObj, sessionContext.collection), 'originData');
        let channel =  rootOriginInfo && rootOriginInfo.channel;
        if (_.isUndefined(channel)) {
          const originInfo = _.get(_.get(hierarchyObj, unitIdentifier), 'originData');
          channel = originInfo && originInfo.channel;
        }
        const originData = {
          textbookOriginId: _.get(_.get(hierarchyObj, sessionContext.collection), 'origin'),
          unitOriginId: _.get(_.get(hierarchyObj, unitIdentifier), 'origin'),
          channel: channel
        };
        if (originData.textbookOriginId && originData.unitOriginId && originData.channel) {
          if (action === 'accept') {
            action = isMetadataOverridden ? 'acceptWithChanges' : 'accept';
            // tslint:disable-next-line:max-line-length
            this.publishContentToDiksha(action, sessionContext.collection, contentData.identifier, originData, contentData);
          } else if (action === 'reject' && rejectComment.length) {
            // tslint:disable-next-line:max-line-length
            this.publishContentToDiksha(action, sessionContext.collection, contentData.identifier, originData, contentData, rejectComment);
          }
        } else {
          action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00102) :
          this.toasterService.error(this.resourceService.messages.fmsg.m00100);
          console.error('origin data missing');
        }
      } else {
        action === 'accept' ? this.toasterService.error(this.resourceService.messages.emsg.approvingFailed) :
        this.toasterService.error(this.resourceService.messages.fmsg.m00100);
        console.error('origin data missing');
      }
    } else if (programContext.target_type === 'searchCriteria') {
      if (this.checkIfContentisWithProgram(contentData.identifier, programContext)) { return; }
      if (action === 'accept' || action === 'acceptWithChanges') {
        this.publishContentOnOrigin(action, contentData.identifier, contentData, programContext);
      } else {
        const me = this;
        setTimeout(() => {
          me.attachContentToProgram(action, contentData.identifier, programContext, rejectComment);
        }, 1000);
      }
    }
  }
  attachContentToProgram(action, contentId, programContext, rejectedComments?) {
    let request = {
      program_id: programContext.program_id
    };
      // tslint:disable-next-line:max-line-length
    if (action === 'accept' || action === 'acceptWithChanges') {
      request['acceptedcontents'] = _.uniq([...programContext.acceptedcontents || [], contentId]);
    } else {
      request['rejectedcontents'] = _.uniq([...programContext.rejectedcontents || [], contentId]);
    }

    if (action === 'reject' && rejectedComments) {
      // tslint:disable-next-line:max-line-length
      request['sourcingrejectedcomments'] = programContext.sourcingrejectedcomments && _.isString(programContext.sourcingrejectedcomments) ? JSON.parse(programContext.sourcingrejectedcomments) : programContext.sourcingrejectedcomments || {};
      request['sourcingrejectedcomments'][contentId] = rejectedComments;
    }

    this.programsService.updateProgram(request).subscribe(() => {
        if (action === 'accept' || action === 'acceptWithChanges') {
          this.toasterService.success(this.resourceService.messages.smsg.m0066);
        } else if (action === 'reject') {
          this.toasterService.success(this.resourceService.messages.smsg.m0067);
        }
        this.sendNotification.next(_.capitalize(action));
        this.programStageService.removeLastStage();
        this.programsService.emitHeaderEvent(true);
    }, (err) => {
      this.acceptContent_errMsg(action);
    });
  }

  publishContentOnOrigin(action, contentId, contentMetaData, programContext) {
    if (programContext.target_type === 'searchCriteria') {
      contentMetaData['createdFor'] = [programContext.rootorg_id];
    } else {
      const channel =  _.get(this._selectedCollectionMetaData, 'originData.channel');
      if (_.isString(channel)) {
        contentMetaData['createdFor'] = [channel];
      } else if (_.isArray(channel)) {
        contentMetaData['createdFor'] = channel;
      }
    }

    // @Todo remove after testing
    // this.sendNotification.next(_.capitalize(action));

    // tslint:disable-next-line:max-line-length
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
    ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : window.location.origin;

    const reqFormat = {
      source: `${baseUrl}/api/content/v1/read/${contentMetaData.identifier}`,
      metadata: {..._.pick(contentMetaData, ['framework']),
                  ..._.pick(contentMetaData, ['channel']),
                  ..._.pick(contentMetaData, ['name', 'code', 'mimeType', 'contentType', 'createdFor']),
                    ...{'lastPublishedBy': this.userService.userProfile.userId}}
    };

    const reqOption = {
      url: this.configService.urlConFig.URLS.BULKJOB.DOCK_IMPORT_V1,
      data: {
        request: {
          content: [
            reqFormat
          ]
        }
      }
    };
    if (_.get(contentMetaData, 'mimeType').toLowerCase() === 'application/vnd.sunbird.questionset') {
      reqOption.url = this.configService.urlConFig.URLS.BULKJOB.DOCK_QS_IMPORT_V1;
      reqOption.data.request['questionset'] = {};
      reqOption.data.request['questionset'] = reqOption.data.request.content;
      _.first(reqOption.data.request['questionset']).source = `${baseUrl}/api/questionset/v1/read/${contentMetaData.identifier}`;
      delete reqOption.data.request.content;
    }
    return this.learnerService.post(reqOption).subscribe((res: any) => {
      if (res && res.result) {
        const me = this;
        setTimeout(() => {
          me.attachContentToProgram(action, contentId, programContext);
        }, 1000);
      }
    }, err => {
      this.acceptContent_errMsg(action);
    });
  }
  checkIfContentisWithProgram(contentId, programContext) {
    let msg;
    if (_.includes(programContext.acceptedContents, contentId)) {
      msg = this.resourceService.messages.emsg.contentAcceptedForProgram;
    } else if (_.includes(programContext.rejectedContents, contentId)) {
      msg = this.resourceService.messages.emsg.contentRejectedForProgram;
    }
   if (msg) {
      this.toasterService.error(msg)
      this.programStageService.removeLastStage();
      this.programsService.emitHeaderEvent(true);
      return true;
    } else {
      return false;
    }
  }

  getContentCorrectionComments(contentMetaData, sessionContext) {
    const id = _.get(contentMetaData, 'identifier');
    let contentComment = '';
    const sourcingRejectedComments = _.get(sessionContext, 'hierarchyObj.sourcingRejectedComments')
    if (id && contentMetaData.status === "Draft" && contentMetaData.prevStatus  === "Review") {
      // if the contributing org reviewer has requested for changes
      contentComment = _.get(contentMetaData, 'rejectComment');
    } else if (id && !_.isEmpty(_.get(contentMetaData, 'requestChanges')) &&
    ((contentMetaData.status === "Draft" && contentMetaData.prevStatus === "Live") || contentMetaData.status === "Live")) {
      // if the souring org reviewer has requested for changes
      contentComment = _.get(contentMetaData, 'requestChanges');
    } else  if (id && contentMetaData.status === 'Live' && !_.isEmpty(_.get(sourcingRejectedComments, id))) {
        contentComment = _.get(sourcingRejectedComments, id);
    }
    return contentComment;
  }

  updateQuestionSetStatus(questionsetId, status, comment?) {
    const requestBody = {
      request: {
        questionset: {
          status: status
        }
      }
    };

    if (!_.isUndefined(comment)) {
       requestBody.request.questionset['requestChanges'] = _.trim(comment);
    }
    const option = {
      url: `questionset/v4/system/update/${questionsetId}`,
      data: requestBody
    };
    return this.actionService.patch(option);
  }

  setTargetFrameWorkData(targetFWIds) {
    const unlistedframeworkIds = [];
    const existingFWIs = _.keys(this.frameworkService.frameworkData);
    _.forEach(targetFWIds, (value) => {
      if (!_.includes(existingFWIs, value)) {
        unlistedframeworkIds.push(value);
      }
    });

    if (!_.isEmpty(unlistedframeworkIds)) {
      this.frameworkService.addUnlistedFrameworks(unlistedframeworkIds);
    }
  }

  getFormattedFrameworkMeta(row, targetCollectionFrameworksData) {
    const organisationFrameworkUserInput = _.pick(row, _.map(this.frameworkService.orgFrameworkCategories, 'orgIdFieldName'));
    const targetFrameworkUserInput = _.pick(row, _.map(this.frameworkService.targetFrameworkCategories, 'targetIdFieldName'));
    const framework = _.get(targetCollectionFrameworksData, 'framework');
    const targetFWIds = _.get(targetCollectionFrameworksData, 'targetFWIds');
    this.flattenedFrameworkCategories[framework] = {};
    // tslint:disable-next-line:max-line-length
    const orgFrameworkCategories = _.get(this.frameworkService.frameworkData[framework], 'categories');
    _.forEach(orgFrameworkCategories, item => {
      const terms = _.get(item, 'terms');
      this.flattenedFrameworkCategories[framework][item.code] = terms || [];
    });
    if (framework !== _.first(targetFWIds) && !_.isEmpty(_.first(targetFWIds))) {
      const targetFWId = _.first(targetFWIds);
      this.flattenedFrameworkCategories[targetFWId] = {};
      const targetFrameworkCategories = _.get(this.frameworkService.frameworkData[_.first(targetFWIds)], 'categories');
      // tslint:disable-next-line:max-line-length
      _.forEach(targetFrameworkCategories, item => {
        const terms = _.get(item, 'terms');
        this.flattenedFrameworkCategories[_.first(targetFWIds)][item.code] = terms || [];
      });
    }
    _.forEach(organisationFrameworkUserInput, (value, key) => {
      const code = _.get(_.find(this.frameworkService.orgFrameworkCategories, {
        'orgIdFieldName': key
      }), 'code');
      organisationFrameworkUserInput[key] = this.hasEmptyElement(value) ? _.get(targetCollectionFrameworksData, key) || [] :
      this.convertNameToIdentifier(framework, value, key, code, targetCollectionFrameworksData, 'identifier');
    });
    _.forEach(targetFrameworkUserInput, (value, key) => {
      const code = _.get(_.find(this.frameworkService.targetFrameworkCategories, {
        'targetIdFieldName': key
      }), 'code');
      targetFrameworkUserInput[key] = this.hasEmptyElement(value) ?
      _.get(targetCollectionFrameworksData, key) || [] :
      this.convertNameToIdentifier(_.first(targetFWIds), value, key, code, targetCollectionFrameworksData, 'identifier');
    });
    return {...organisationFrameworkUserInput, ...targetFrameworkUserInput, ...{targetFWIds}};
  }

  getFormattedFrameworkMetaWithOutCollection(row, sessionContext) {
    const organisationFrameworkUserInput = _.pick(row, _.map(this.frameworkService.orgFrameworkCategories, 'orgIdFieldName'));
    const framework = _.first(_.get(sessionContext, 'framework'));
    this.flattenedFrameworkCategories[framework] = {};
    // tslint:disable-next-line:max-line-length
    const orgFrameworkCategories = _.get(this.frameworkService.frameworkData[framework], 'categories');
    _.forEach(orgFrameworkCategories, item => {
      const terms = _.get(item, 'terms');
      this.flattenedFrameworkCategories[framework][item.code] = terms || [];
    });
    _.forEach(organisationFrameworkUserInput, (value, key) => {
      const code = _.get(_.find(this.frameworkService.orgFrameworkCategories, {
        'orgIdFieldName': key
      }), 'code');
      organisationFrameworkUserInput[key] = this.hasEmptyElement(value) ? _.get(sessionContext.frameworkData, key) || [] :
      this.convertNameToIdentifier(framework, value, key, code, sessionContext.frameworkData, 'identifier');
    });
    return {...organisationFrameworkUserInput};
  }

/**
 *
 *
 * @param {*} framework - target collection's framework
 * @param {*} value - user input in the CSV row
 * @param {*} key - CSV cell identifier
 * @param {*} code - corresponding system level code for `key`
 * @param {*} collectionMeta - target collection metadata
 * @returns - returns user input in the framework_code_value format.
 * @memberof HelperService
 */

  convertNameToIdentifier(framework, value, key, code, collectionMeta, mapBy) {
    const filteredTermsByName = _.filter(_.get(this.flattenedFrameworkCategories[framework], code), i => _.includes(value, i.name));
    const uniqByName = _.uniqBy(filteredTermsByName, 'name');
    return _.map(uniqByName, mapBy);
  }

  hasEmptyElement(value) {
    if (_.isArray(value)) {
      if (value.length === 1 && _.isEmpty(_.first(value))) {
        return true;
      } else if (value.length === 1 &&  !_.isEmpty(_.first(value))) {
        return false;
      }
    } else if (_.isEmpty(value)) {
      return true;
    }
  }

  validateFormConfiguration(targetCollectionFrameworksData, formFieldProperties) {
    let invalidFormConfig = false;
    // tslint:disable-next-line:max-line-length
    const orgFrameworkFieldIds = _.map(_.get(this.frameworkService.orgAndTargetFrameworkCategories, 'orgFrameworkCategories'), 'orgIdFieldName');
    const orgFrameworkFieldCodes = _.map(_.get(this.frameworkService.orgAndTargetFrameworkCategories, 'orgFrameworkCategories'), 'code');
    // tslint:disable-next-line:max-line-length
    const targetFrameworkFieldIds = _.map(_.get(this.frameworkService.orgAndTargetFrameworkCategories, 'targetFrameworkCategories'), 'targetIdFieldName');
    // tslint:disable-next-line:max-line-length
    const targetFrameworkFieldCodes = _.map(_.get(this.frameworkService.orgAndTargetFrameworkCategories, 'targetFrameworkCategories'), 'code');
    const masterCategoryIds = [...orgFrameworkFieldIds, ...targetFrameworkFieldIds];
    const masterCategoryCodes = [...orgFrameworkFieldCodes, ...targetFrameworkFieldCodes];
    const framework = this.frameworkService.frameworkData[targetCollectionFrameworksData.framework];
    // tslint:disable-next-line:max-line-length
    const targetFramework = targetCollectionFrameworksData.targetFWIds && this.frameworkService.frameworkData[_.first(targetCollectionFrameworksData.targetFWIds)];


    _.forEach(formFieldProperties, field => {
          if (_.has(targetCollectionFrameworksData, 'framework') && !_.has(field, 'sourceCategory')
           && _.includes(masterCategoryCodes, field.code)
           && !_.includes(_.map(framework.categories, 'code'), field.code)) { // board,medium,gradeLevel,...
            console.error(field, 'field is not in framework: ', targetCollectionFrameworksData.framework);
            invalidFormConfig = true;
            return false;
          } else if (_.has(targetCollectionFrameworksData, 'framework') && _.has(field, 'sourceCategory')
            && !_.includes(field.code, 'target') && _.includes(masterCategoryIds, field.code)
            && !_.includes(_.map(framework.categories, 'code'), field.sourceCategory)) { // boardIds, mediumIds, ...
              console.error(field, 'is not in framework: ', targetCollectionFrameworksData.framework);
              invalidFormConfig = true;
              return false;
          } else if (_.has(targetCollectionFrameworksData, 'targetFWIds') && _.has(field, 'sourceCategory')
            && _.includes(field.code, 'target') && _.includes(masterCategoryIds, field.code) && targetFramework
            && !_.includes(_.map(targetFramework.categories, 'code'), field.sourceCategory)) {
              console.error(field, 'is not in targetframework: ', targetCollectionFrameworksData.targetFWIds);
              invalidFormConfig = true;
              return false;
          } else if (!_.has(targetCollectionFrameworksData, 'framework') && !_.has(field, 'sourceCategory')
          && (_.includes(orgFrameworkFieldIds, field.code) || _.includes(orgFrameworkFieldCodes, field.code))) {
            console.error('collection does not have framework but form config have framework fields');
            invalidFormConfig = true;
            return false;
          } else if (!_.has(targetCollectionFrameworksData, 'targetFWIds') && _.has(field, 'sourceCategory')
          && (_.includes(targetFrameworkFieldIds, field.code)  || _.includes(targetFrameworkFieldCodes, field.code))) {
            console.error('collection does not have targetFramework but form config have targetFramework fields');
            invalidFormConfig = true;
            return false;
          } else if ((field.code).toLowerCase() === 'framework' || (field.code).toLowerCase() === 'targetfwids') {
            console.error('form config should not field.code as framework / targetFwIds');
            invalidFormConfig = true;
            return false;
          }
       });
    return invalidFormConfig;
  }

  setFrameworkCategories(collection) {
    let OrgAndTargetFrameworkCategories = this.frameworkService.orgAndTargetFrameworkCategories;
    if (_.isUndefined(OrgAndTargetFrameworkCategories)) {
      this.frameworkService.setOrgAndTargetFrameworkCategories();
      OrgAndTargetFrameworkCategories = this.frameworkService.orgAndTargetFrameworkCategories;
    }

    let targetCollectionFrameworksData = {};
    if (_.has(collection, 'framework') && !_.isUndefined(collection.framework)) {
          targetCollectionFrameworksData = _.pick(collection,
        _.map(OrgAndTargetFrameworkCategories.orgFrameworkCategories, 'orgIdFieldName'));
    }
    if (_.has(collection, 'targetFWIds') && !_.isUndefined(collection.targetFWIds)) {
        targetCollectionFrameworksData = _.assign(targetCollectionFrameworksData,
          _.pick(collection, _.map(OrgAndTargetFrameworkCategories.targetFrameworkCategories, 'targetIdFieldName')));
    }
    return  targetCollectionFrameworksData;
  }

  getSourceCategoryValues(row, targetCollectionFrameworksData) {
    const framework = _.get(targetCollectionFrameworksData, 'framework');
    const organisationFrameworkUserInput = _.pick(row, _.map(this.frameworkService.orgFrameworkCategories, 'orgIdFieldName'));
    const userInputKeys = _.keys(organisationFrameworkUserInput);
    const organisationFrameworkCategories = _.get(this.frameworkService, 'orgFrameworkCategories');
    const sourceCategoryValues = _.filter(organisationFrameworkCategories, i => {
      if (_.includes(userInputKeys, i.orgIdFieldName)) {
        i.value = organisationFrameworkUserInput[i.orgIdFieldName];
        return i.code;
      }
    });
    const sourceCategoryValuesMap = {};
    _.forEach(sourceCategoryValues, (category, key) => {
      // tslint:disable-next-line:max-line-length
      sourceCategoryValuesMap[category.code] = this.convertNameToIdentifier(framework, category.value, key, category.code, targetCollectionFrameworksData, 'name');
    });
    return sourceCategoryValuesMap;
  }

  fetchProgramFramework(sessionContext) {
    if (sessionContext.framework) {
      this.frameworkService.initialize(sessionContext.framework);
      this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
        if (frameworkDetails && !frameworkDetails.err) {
          sessionContext.frameworkData = frameworkDetails.frameworkdata[sessionContext.framework].categories;
          sessionContext.topicList = _.get(_.find(sessionContext.frameworkData, { code: 'topic' }), 'terms');
        }
      }, error => {
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.error(errorMes || 'Fetching framework details failed');
        const errInfo = {
          errorMsg: 'Fetching framework details failed',
          telemetryPageId: _.get(this.activatedRoute,'snapshot.data.telemetry.pageid'),
          telemetryCdata : [{id: this.userService.channel, type: 'sourcing_organization'}, {id: sessionContext.programId , type: 'project'}],
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      });
    }
  }

  isOpenForNomination(programDetails) {
    const today = moment();
    const validNomDate = moment(programDetails.nomination_enddate).isSameOrAfter(today, 'day') && this.programsService.isProjectLive(programDetails);
    const ifOnlyforDefaultOrg = (programDetails.status === 'Unlisted' && _.get(this.userService, 'userProfile.rootOrgId') === _.get(programDetails, 'rootorg_id'));
    return validNomDate && ( ifOnlyforDefaultOrg || programDetails.status === 'Live');
  }

  canAcceptContribution(programDetails) {
    const contributionendDate  = moment(programDetails.content_submission_enddate);
    const endDate  = moment(programDetails.enddate);
    const today = moment();
    return (contributionendDate.isSameOrAfter(today, 'day') && this.programsService.isProjectLive(programDetails)) ? true : false;
  }
  /**
   * @param {*} type - is it content, questionset or question
   * @param {*} value - user input in the CSV row
   * @param {*} key - CSV cell identifier
   * @param {*} code - corresponding system level code for `key`
   * @param {*} collectionMeta - target collection metadata
   * @returns - returns user input in the framework_code_value format.
   * @memberof HelperService
   */
  //createContent (type, mimeType, primaryCategory, program, nominationDetails, sharedMetaData, appIcon?, collectionId?, unitId?, questionCategory?) {
  createContent (componentInput, mimeType?) {
    const sessionContext  = _.get(componentInput, 'sessionContext');
    const templateDetails  = _.get(componentInput, 'templateDetails');
    const unitIdentifier  = _.get(componentInput, 'unitIdentifier');
    const programContext = _.get(componentInput, 'programContext');
    const selectedSharedContext = _.get(componentInput, 'selectedSharedContext');
    const sharedContext = _.get(componentInput, 'programContext.config.sharedContext');
    const nominationDetails = _.get(sessionContext, 'nominationDetails');
    const collectionId =  _.get(sessionContext, 'collection');
    let creator = this.userService.userProfile.firstName;
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    }
    const sharedMetaData = this.fetchRootMetaData(sharedContext, selectedSharedContext, programContext.target_type);
    _.merge(sharedMetaData, sessionContext.targetCollectionFrameworksData);

    let obj= {
      'name': 'Untitled',
      'code': UUID.UUID(),
      'mimeType': mimeType || templateDetails.mimeType[0],
      'createdBy': this.userService.userid,
      'primaryCategory': templateDetails.name,
      'creator': creator,
      'author': creator,
      'programId': programContext.program_id,
      ...(nominationDetails &&
        nominationDetails.organisation_id &&
        {'organisationId': nominationDetails.organisation_id || null}),
        ...(_.pickBy(sharedMetaData, _.identity))
    }
    if (collectionId && unitIdentifier) {
      obj['collectionId'] = collectionId;
      obj['unitIdentifiers'] = [unitIdentifier];
    }
    if (sessionContext.sampleContent) {
     obj['sampleContent'] = true;
    }
    if (_.get(templateDetails, 'appIcon')) {
      obj['appIcon'] = _.get(templateDetails, 'appIcon');
    }
    if (_.get(templateDetails, 'modeOfCreation') === 'question') {
      obj['questionCategories'] =  [templateDetails.questionCategory];
    }
    const option = {
      url: 'content/v3/create',
      header: {
        'X-Channel-Id': programContext.rootorg_id
      },
      data: { request: {} }
    };

    if (_.get(templateDetails, 'modeOfCreation') === 'questionset') {
      option.url = 'questionset/v1/create';
      option.data.request['questionset'] = {};
      option.data.request['questionset'] = obj;
    } else {
      option.data.request['content'] = {};
      option.data.request['content'] = obj;
    }

    return this.actionService.post(option);
  }

  canSourcingReviewerPerformActions(contentMetaData, sourcingReviewStatus, programContext, originCollectionData, selectedOriginUnitStatus) {
    const resourceStatus = contentMetaData.status;
    // tslint:disable-next-line:max-line-length
    const flag = !!(this.router.url.includes('/sourcing')
    && !contentMetaData.sampleContent === true && resourceStatus === 'Live' && !sourcingReviewStatus
    && this.userService.userid !== contentMetaData.createdBy && this.programsService.isProjectLive(programContext));
    if (!programContext.target_type || programContext.target_type === 'collections') {
      return flag && !!(originCollectionData.status === 'Draft' && selectedOriginUnitStatus === 'Draft')
    }
    return flag;
  }
}
