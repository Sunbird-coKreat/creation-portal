import { Injectable } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse, ResourceService } from '@sunbird/shared';
import { ContentService, ActionService, PublicDataService, ProgramsService, NotificationService, UserService,
  FrameworkService, LearnerService } from '@sunbird/core';
import { throwError, Observable, of, Subject, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap, mergeMap, filter, first, skipWhile } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ProgramStageService } from '../../program/services';
import { CacheService } from 'ng2-cache-service';
import { isUndefined } from 'lodash';

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
  public readonly categoryMetaData$: Observable<any> = this._categoryMetaData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  private _selectedCollectionMetaData: any;
  constructor(private configService: ConfigService, private contentService: ContentService,
    private toasterService: ToasterService, private publicDataService: PublicDataService,
    private actionService: ActionService, private resourceService: ResourceService,
    public programStageService: ProgramStageService, private programsService: ProgramsService,
    private notificationService: NotificationService, private userService: UserService, private cacheService: CacheService,
    public frameworkService: FrameworkService, public learnerService: LearnerService) { }

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

  getCollectionOrContentCategoryDefinition(targetCollectionMeta, assetMeta) {
    // tslint:disable-next-line:max-line-length
    const categoryDefinition$ = this.programsService.getCollectionCategoryDefinition(targetCollectionMeta.primaryCategory, targetCollectionMeta.channelId)
      .pipe(
        switchMap((response: any) => {
          const targetCollectionFormData = _.get(response, 'result.objectCategoryDefinition.forms.childMetadata.properties');
          if (!targetCollectionFormData) {
            // tslint:disable-next-line:max-line-length
            const contentCategoryDefinition$ = this.programsService.getCategoryDefinition(assetMeta.primaryCategory, assetMeta.channelId, assetMeta.objectType);
            return contentCategoryDefinition$.pipe(
              map(data => _.get(data, 'result.objectCategoryDefinition.forms.update.properties')));
            // return of(this.programsService.getCategoryDefinition(assetMeta.primaryCategory, assetMeta.channelId, assetMeta.objectType));
          }
          return of(targetCollectionFormData);
        })
      );

    categoryDefinition$.subscribe(
      (response) => {
        console.log(response);
        this.selectedCategoryMetaData = response;
        this._categoryMetaData$.next(response);
      }
    );

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
        content: {
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
    if ((action === 'accept' && _.includes(data.acceptedContents, contentId))
      || (action === 'reject' && _.includes(data.rejectedContents, contentId))) {
      action === 'accept' ? this.toasterService.error(this.resourceService.messages.fmsg.m00104) :
        this.toasterService.error(this.resourceService.messages.fmsg.m00105);
      this.programStageService.removeLastStage();
      return true;
    } else {
      return false;
    }
  }


  publishContentToDiksha(action, collectionId, contentId, originData, contentMetaData, rejectedComments?) {
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
                        ..._.pick(contentMetaData, ['name', 'code', 'mimeType', 'contentType']),
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
          const nameFieldConfig = _.find(this.programsService.overrideMetaData, (item) => item.code === 'name');
          if (nameFieldConfig && nameFieldConfig.editable === true) {
            editableFields.push(nameFieldConfig.code);
          }
          _.forEach(formFields, (field) => {
            const fieldConfig = _.find(this.programsService.overrideMetaData, (item) => item.code === field.code);
            if (fieldConfig && fieldConfig.editable === true) {
              editableFields.push(fieldConfig.code);
            }
          });
        }
      break;
    }
    return editableFields;
  }

  getFormattedData(formValue, formFields) {
    const trimmedValue = _.mapValues(formValue, (value) => {
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
          categoryMasterList[formFieldCategory.code] === formFieldCategory.range;
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
    const nonFrameworkFields = ['topic', 'learningOutcome', 'additionalCategories', 'bloomsLevel', 'license'];
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
       });
     });
    }

    if (sessionContext.frameworkData) {
       categoryMasterList = sessionContext.frameworkData;
       let { gradeLevel, subject } = sessionContext;
       let gradeLevelTerms = [], subjectTerms = [], topicTerms = [];
       let gradeLevelTopicAssociations = [], subjectTopicAssociations = [];
       _.forEach(categoryMasterList, (category) => {

         if (category.code === 'gradeLevel') {
           const terms = category.terms;
           if (terms) {
             gradeLevelTerms =  _.concat(gradeLevelTerms, _.filter(terms,  (t)  => _.includes(gradeLevel, t.name)));
           }
         }

         if (category.code === 'subject') {
           const terms = category.terms;
           if (terms) {
             subjectTerms =  _.concat(subjectTerms, _.filter(terms,  (t)  => _.includes(subject, t.name)));
           }
         }
         _.forEach(formFieldProperties, (formFieldCategory) => {
           if (formFieldCategory.code === 'topic') {
             if (!formFieldCategory.range) { formFieldCategory.range = []; }
             if (!gradeLevelTopicAssociations.length && !subjectTopicAssociations.length && gradeLevelTerms.length && subjectTerms.length) {
               _.forEach(gradeLevelTerms, (term) => {
                 if (term.associations) {
                 gradeLevelTopicAssociations = _.concat(gradeLevelTopicAssociations,
                   _.filter(term.associations, (association) => association.category === 'topic'));
                 }
               });
               _.forEach(subjectTerms, (term) => {
                 if (term.associations) {
                 subjectTopicAssociations = _.concat(subjectTopicAssociations,
                   _.filter(term.associations, (association) => association.category === 'topic'));
                 }
               });
               // tslint:disable-next-line:max-line-length
               formFieldCategory.range = _.intersectionWith(gradeLevelTopicAssociations, subjectTopicAssociations, (a, o) =>  a.name === o.name );
             }
             topicTerms = _.filter(sessionContext.topicList, (t) => _.find(formFieldCategory.range, { name: t.name }));
           }

           if (formFieldCategory.code === 'learningOutcome') {
             const topicTerm = _.find(sessionContext.topicList, { name: _.first(sessionContext.topic) });
             if (topicTerm && topicTerm.associations) {
               formFieldCategory.range = _.map(topicTerm.associations, (learningOutcome) =>  learningOutcome);
             } else {
               if (topicTerms) {
                 _.forEach(topicTerms, (term) => {
                   if (term.associations) {
                     // tslint:disable-next-line:max-line-length
                     formFieldCategory.range = _.concat(formFieldCategory.range || [], _.map(term.associations, (learningOutcome) => learningOutcome));
                   }
                 });
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
           if (formFieldCategory.code === 'bloomsLevel' && !categoryMasterList[formFieldCategory.code]) {
             // tslint:disable-next-line:no-unused-expression
             categoryMasterList[formFieldCategory.code] === formFieldCategory.range;
           }
           if (formFieldCategory.code === 'license') {
             const license = this.getAvailableLicences();
             if (license) {
              formFieldCategory.range = _.map(license, 'name');
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
        if (formFieldCategory.inputType === 'checkbox' && requiredData) {
          formFieldCategory.default = requiredData;
        }
        if (formFieldCategory.code === 'author' && !requiredData) {
          let creator = this.userService.userProfile.firstName;
          if (!_.isEmpty(this.userService.userProfile.lastName)) {
            creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
          }
          formFieldCategory.default = contentMetadata.creator || creator;
        }
        if (formFieldCategory.code === 'learningOutcome' && formFieldCategory.inputType === 'select' && _.isArray(requiredData)) {
          formFieldCategory.default = _.first(requiredData) || '';
        }
        // tslint:disable-next-line:max-line-length
        if (formFieldCategory.code === 'additionalCategories' && formFieldCategory.inputType === 'multiSelect' && contentMetadata.primaryCategory === 'eTextbook' &&
            contentMetadata.status === 'Draft' && _.isEmpty(contentMetadata.additionalCategories)) {
          formFieldCategory.default = ['Textbook'];
        }
      });
    }
    return formFieldProperties;
  }

  validateForm(formFieldProperties, formInputData, formStatus?) {
    let sbValidField = false;
    if (_.isEmpty(formStatus) || formStatus.isValid === true) {
      sbValidField = true;
    }

    const requiredFields = _.map(_.filter(formFieldProperties, { 'required': true }), field => field.code );
    const textFields = _.filter(formFieldProperties, {'inputType': 'text', 'editable': true});

    const validFields = _.map(requiredFields, field => {
      if (_.find(formFieldProperties, val => val.code === field && val.inputType === 'checkbox') && _.get(formInputData, field)) {
        return true;
      // tslint:disable-next-line:max-line-length
      } else if (_.isEmpty(_.get(formInputData, field)) || (_.find(textFields, data => data.code === field) && _.trim(formInputData[field]).length === 0)) {
        return false;
      } else {
        return true;
      }
    });

    return (_.includes(validFields, false) ? false : true) && sbValidField;
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
    const formFields = _.cloneDeep(this.selectedCategoryMetaData);
    const contentPolicyCheck = [{
      'code': 'contentPolicyCheck',
      'editable': true,
      'displayProperty': 'Editable',
      'dataType': 'boolean',
      'renderingHints': {
      },
      'description': 'Content PolicyCheck',
      'label': 'Content PolicyCheck',
      'required': true,
      'name': 'contentPolicyCheck',
      'inputType': 'checkbox',
      'placeholder': 'Content PolicyCheck'
    }];
    return formFields && formFields.length ? [...formFields, ...contentPolicyCheck] : [];
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

  fetchRootMetaData(sharedContext, selectedSharedContext) {
    return sharedContext.reduce((obj, context) => {
              return { ...obj, ...(this.getContextObj(context, selectedSharedContext)) };
            }, {});
  }

  getContextObj(context, selectedSharedContext) {
    if (context === 'topic') { // Here topic is fetched from unitLevel meta
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

  manageSourcingActions (action, sessionContext, unitIdentifier, contentData, rejectComment = '', isMetadataOverridden =  false) {
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
  }

  updateQuestionSetStatus(questionsetId, status, comment?) {
    const requestBody = {
      request: {
        questionset: {
          status: status
        }
      }
    };

    // if (!_.isUndefined(comment)) {
    //   requestBody.request.questionset['requestChanges'] = _.trim(comment);
    // }
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

    _.forEach(organisationFrameworkUserInput, (value, key) => {
      const code = _.get(_.find(this.frameworkService.orgFrameworkCategories, {
        'orgIdFieldName': key
      }), 'code');

      organisationFrameworkUserInput[key] = this.hasEmptyElement(value) ? _.get(targetCollectionFrameworksData, key) || [] :
      this.convertNameToIdentifier(framework, value, key, code, targetCollectionFrameworksData);

    });

    _.forEach(targetFrameworkUserInput, (value, key) => {
      const code = _.get(_.find(this.frameworkService.targetFrameworkCategories, {
        'targetIdFieldName': key
      }), 'code');
      targetFrameworkUserInput[key] = this.hasEmptyElement(value) ?
      _.get(targetCollectionFrameworksData, key) || [] :
      this.convertNameToIdentifier(_.first(targetFWIds), value, key, code, targetCollectionFrameworksData);
    });

    return {...organisationFrameworkUserInput, ...targetFrameworkUserInput, ...{targetFWIds}};
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

convertNameToIdentifier(framework, value, key, code, collectionMeta) {
    if (_.isArray(value)) {
      if (value.length === 1) {
        return _.map(value, item => {
          return !_.isEmpty(item) ?
            `${framework}_${code.toLowerCase()}_${item.split(' ').join('-').toLowerCase()}` :
            _.get(collectionMeta, key) ;
        });
      } else {
        return _.map(value, item => {
          return !_.isEmpty(item) ? `${framework}_${code.toLowerCase()}_${item.split(' ').join('-').toLowerCase()}` : '';
        });
      }
    } else {
      return `${framework}_${code.toLowerCase()}_${value.split(' ').join('-').toLowerCase()}`;
    }
  }


  hasEmptyElement(value) {
    if (_.isArray(value)) { // [""]
      if (value.length === 1 && _.isEmpty(_.first(value))) { // [""]
        return true;
      } else if (value.length === 1 &&  !_.isEmpty(_.first(value))) { // ["Something"]
        return false;
      }
    } else if (_.isEmpty(value)) { // []
      return true;
    }
  }

  checkErrorCondition(targetCollectionFrameworksData, formFieldProperties) {
    let errorCondition = false;
    const orgFrameworkFields = _.map(this.frameworkService.orgAndTargetFrameworkCategories.orgFrameworkCategories, 'code');
    const targetFrameworkFields = _.map(this.frameworkService.orgAndTargetFrameworkCategories.targetFrameworkCategories, 'code');
    const frameworksFields = _.uniq(_.concat(orgFrameworkFields, targetFrameworkFields));
    _.forEach(formFieldProperties, (formFields) => {
      if (_.has(formFields, 'sourceCategory') && !_.includes(frameworksFields, formFields.sourceCategory)) {
        errorCondition = true;
        return false;
      }
    });

    if (_.has(targetCollectionFrameworksData, 'framework')) {
      const frameworkCategories = this.frameworkService.frameworkData[targetCollectionFrameworksData.framework];
      _.forEach(formFieldProperties, (formFields) => {
        // tslint:disable-next-line:max-line-length
        if (_.has(formFields, 'sourceCategory') && !_.includes(formFields, 'target') && !_.includes(_.map(frameworkCategories.categories, 'code'), formFields.sourceCategory)) {
          errorCondition = true;
          return false;
        }
      });
    }

    if (_.has(targetCollectionFrameworksData, 'targetFWIds')) {
      const targetFrameworkCategories = this.frameworkService.frameworkData[targetCollectionFrameworksData.targetFWIds];
      _.forEach(formFieldProperties, (formFields) => {
        // tslint:disable-next-line:max-line-length
        if (_.has(formFields, 'sourceCategory') && _.includes(formFields, 'target') && !_.includes(_.map(targetFrameworkCategories.categories, 'code'), formFields.sourceCategory)) {
          errorCondition = true;
          return false;
        }
      });
    }

    // When target collection will not have framework/targetFWIds but form config will have corresponding fields
    if (!_.has(targetCollectionFrameworksData, 'targetFWIds')) {
      _.forEach(formFieldProperties, (formFields) => {
        if (_.includes(formFields.code, 'target') && _.has(formFields.sourceCategory)) {
          errorCondition = true;
        }
      });
    }
    if (!_.has(targetCollectionFrameworksData, 'framework')) {
      _.forEach(formFieldProperties, (formFields) => {
        if (!_.includes(formFields.code, 'target') && _.has(formFields.sourceCategory)) {
          errorCondition = true;
        }
      });
    }

    // If form config will have framework fields
    _.forEach(formFieldProperties, (formFields) => {
      if ((formFields.code).toLowerCase() === 'framework' || (formFields.code).toLowerCase() === 'targetfwids') {
        errorCondition = true;
      }
    });
    return errorCondition;
  }
}
