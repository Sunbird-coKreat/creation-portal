import { Injectable } from '@angular/core';
import { ConfigService, ToasterService, ServerResponse, ResourceService } from '@sunbird/shared';
import { ContentService, ActionService, PublicDataService, ProgramsService, NotificationService, UserService,
  FrameworkService } from '@sunbird/core';
import { throwError, Observable, of, Subject, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap, mergeMap, filter, first } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ProgramStageService } from '../../program/services';
import { CacheService } from 'ng2-cache-service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  mvcLibraryFeatureConfiguration: any
  private sendNotification = new Subject<string>();
  private _availableLicences: Array<any>;
  private _channelData: any;

  constructor(private configService: ConfigService, private contentService: ContentService,
    private toasterService: ToasterService, private publicDataService: PublicDataService,
    private actionService: ActionService, private resourceService: ResourceService,
    public programStageService: ProgramStageService, private programsService: ProgramsService,
    private notificationService: NotificationService, private userService: UserService, private cacheService: CacheService,
    public frameworkService: FrameworkService) { }

  initialize(programDetails) {
    if (!this.getAvailableLicences()) {
      this.getLicences().subscribe();
    }
    if (programDetails.rootorg_id) {
      this.fetchChannelData(programDetails.rootorg_id);
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


  publishContentToDiksha(action, collectionId, contentId, originData, rejectedComments?) {
    const option = {
      url: 'content/v3/read/' + collectionId,
      param: { 'mode': 'edit', 'fields': 'acceptedContents,rejectedContents,versionKey,sourcingRejectedComments' }
    };

    // @Todo remove after testing
    // this.sendNotification.next(_.capitalize(action));
    this.actionService.get(option).pipe(map((res: any) => res.result.content)).subscribe((data) => {
      if (this.checkIfContentPublishedOrRejected(data, action, contentId)) { return; }
      if (action === 'accept' || action === 'acceptWithChanges') {
        const req = {
          url: `program/v1/content/publish`,
          data: {
            'request': {
              'content_id': contentId,
              'origin': {
                'channel': _.get(originData, 'channel'),
                'textbook_id': _.get(originData, 'textbookOriginId'),
                'units': [_.get(originData, 'unitOriginId')],
                'lastPublishedBy': this.userService.userProfile.userId
              }
            }
          }
        };
        this.programsService.post(req).subscribe((response) => {
          const me = this;
          setTimeout(() => {
            me.attachContentToTextbook(action, collectionId, contentId, data);
          }, 1000);
        }, err => {
          this.acceptContent_errMsg(action);
        });
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
    _.forEach(categoryMasterList, (category) => {
      _.forEach(formFieldProperties, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.range = category.terms;
        }
        if (formFieldCategory.code === 'learningOutcome') {
          const topicTerm = _.find(sessionContext.topicList, { name: _.first(sessionContext.topic) });
          if (topicTerm && topicTerm.associations) {
            formFieldCategory.range = _.map(topicTerm.associations, (learningOutcome) =>  learningOutcome);
          }
        }
        if (formFieldCategory.code === 'additionalCategories') {
          console.log(this.cacheService.get(this.userService.hashTagId));
          // tslint:disable-next-line:max-line-length
          formFieldCategory.range = _.map(_.get(this.getProgramLevelChannelData(), 'contentAdditionalCategories'), data => {
            return {name: data};
          });
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
          formFieldCategory.defaultValue = creator;
        }
        if (formFieldCategory.code === 'learningOutcome' && formFieldCategory.inputType === 'select' && _.isArray(requiredData)) {
          formFieldCategory.defaultValue = _.first(requiredData) || '';
        }
      });
    }
    // else {
    //   _.forEach(formFieldProperties, (formFieldCategory) => {
    //     if (!_.isUndefined(sessionContext[formFieldCategory.code])) {
    //       formFieldCategory.defaultValue = sessionContext[formFieldCategory.code];
    //     }
    //   });
    // }
    const sortedFormFields = _.sortBy(_.uniqBy(formFieldProperties, 'code'), 'index');
    return [categoryMasterList, sortedFormFields];
  }

  validateForm(formFieldProperties, formInputData) {
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

    return _.includes(validFields, false) ? false : true;
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
    return [{
      'code': 'name',
      'editable': true,
      'displayProperty': 'Editable',
      'dataType': 'text',
      'renderingHints': {
        'semanticColumnWidth': 'twelve'
      },
      'description': 'Name',
      'index': 1,
      'label': 'Name',
      'required': true,
      'name': 'Name',
      'inputType': 'text',
      'placeholder': 'Name'
    },
    // {
    //   'code': 'board',
    //   'visible': true,
    //   'depends': [
    //     'medium',
    //     'gradeLevel',
    //     'subject'
    //   ],
    //   'editable': true,
    //   'displayProperty': 'Editable',
    //   'dataType': 'text',
    //   'renderingHints': {
    //     'semanticColumnWidth': 'six'
    //   },
    //   'description': 'Education Board (Like MP Board, NCERT, etc)',
    //   'index': 2,
    //   'label': 'Board',
    //   'required': false,
    //   'name': 'Board',
    //   'inputType': 'select',
    //   'placeholder': 'Board'
    // },
    // {
    //   'code': 'medium',
    //   'visible': true,
    //   'depends': [
    //     'gradeLevel',
    //     'subject'
    //   ],
    //   'editable': true,
    //   'displayProperty': 'Editable',
    //   'dataType': 'list',
    //   'renderingHints': {
    //     'semanticColumnWidth': 'six'
    //   },
    //   'description': 'Medium of instruction',
    //   'index': 3,
    //   'label': 'Medium',
    //   'required': true,
    //   'name': 'Medium',
    //   'inputType': 'multiSelect',
    //   'placeholder': 'Medium'
    // },
    // {
    //   'code': 'gradeLevel',
    //   'visible': true,
    //   'depends': [
    //     'subject'
    //   ],
    //   'editable': true,
    //   'displayProperty': 'Editable',
    //   'dataType': 'list',
    //   'renderingHints': {
    //     'semanticColumnWidth': 'six'
    //   },
    //   'description': 'Class',
    //   'index': 4,
    //   'label': 'Class',
    //   'required': true,
    //   'name': 'Class',
    //   'inputType': 'multiSelect',
    //   'placeholder': 'Class'
    // },
    // {
    //   'code': 'subject',
    //   'visible': true,
    //   'editable': true,
    //   'displayProperty': 'Editable',
    //   'dataType': 'list',
    //   'renderingHints': {
    //     'semanticColumnWidth': 'six'
    //   },
    //   'description': 'Subject of the Content to use to teach',
    //   'index': 5,
    //   'label': 'Subject',
    //   'required': true,
    //   'name': 'Subject',
    //   'inputType': 'multiSelect',
    //   'placeholder': 'Subject'
    // },
    {
      'code': 'learningOutcome',
      'visible': true,
      'editable': true,
      'displayProperty': 'Editable',
      'dataType': 'list',
      'renderingHints': {
        'semanticColumnWidth': 'six'
      },
      'description': 'Subject of the Content to use to teach',
      'index': 2,
      'label': 'Learning Outcome',
      'required': false,
      'name': 'learningOutcome',
      'inputType': 'select',
      'placeholder': 'learningOutcome'
    },
    {
      'code': 'attributions',
      'dataType': 'list',
      'description': 'Attributions',
      'editable': true,
      'index': 3,
      'inputType': 'text',
      'label': 'Attributions',
      'name': 'attribution',
      'placeholder': '',
      'renderingHints': {
        'semanticColumnWidth': 'six'
      },
      'required': false
    },
    {
      'code': 'author',
      'dataType': 'text',
      'description': 'Author',
      'editable': true,
      'renderingHints': {
        'semanticColumnWidth': 'six'
      },
      'index': 4,
      'inputType': 'text',
      'label': 'Author',
      'name': 'Author',
      'placeholder': 'Author',
      'required': true
    },
    {
      'code': 'copyright',
      'dataType': 'text',
      'description': 'Copyright',
      'editable': true,
      'index': 5,
      'inputType': 'text',
      'label': 'Copyright',
      'name': 'Copyright',
      'placeholder': 'Copyright',
      'renderingHints': {
        'semanticColumnWidth': 'six'
      },
      'required': false
    },
    {
      'code': 'license',
      'visible': true,
      'editable': true,
      'displayProperty': 'Editable',
      'dataType': 'text',
      'renderingHints': {
        'semanticColumnWidth': 'six'
      },
      'description': 'Subject of the Content to use to teach',
      'index': 6,
      'label': 'License',
      'required': false,
      'name': 'license',
      'inputType': 'select',
      'placeholder': 'license'
    },
    {
      'code': 'additionalCategories',
      'visible': true,
      'editable': true,
      'displayProperty': 'Editable',
      'dataType': 'list',
      'renderingHints': {
        'semanticColumnWidth': 'six'
      },
      'description': 'Subject of the Content to use to teach',
      'index': 7,
      'label': 'Content Additional Categories',
      'required': false,
      'name': 'additionalCategories',
      'inputType': 'multiSelect',
      'placeholder': 'Content Additional Categories'
    },
    {
      'code': 'contentPolicyCheck',
      'editable': true,
      'displayProperty': 'Editable',
      'dataType': 'text',
      'renderingHints': {
        'semanticColumnWidth': 'twelve'
      },
      'description': 'Name',
      'index': 8,
      'label': 'Content PolicyCheck',
      'required': true,
      'name': 'contentPolicyCheck',
      'inputType': 'checkbox',
      'placeholder': 'Name'
    }];
  }
  /*getContentMetadata(componentInput: any) {
    const contentId = sessionContext.resourceIdentifier;
    const option = {
      url: `${this.configService.urlConFig.URLS.CONTENT.GET}/${contentId}`,
    };
    this.contentService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Content, Please Try Again' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(resourceDetails => {
      //this.resourceDetails = res;
      //this.sessionContext.contentMetadata = resourceDetails;
      const contentTypeValue = [resourceDetails.contentType];
      const contentType = this.programsService.getContentTypesName(contentTypeValue);
      resourceDetails.contentTypeName = contentType;
      this.sessionContext.contentMetadata = resourceDetails;
      this.sessionContext.resourceStatus = _.get(this.resourceDetails, 'status');;

      //this.existingContentVersionKey = resourceDetails.versionKey;
      //this.resourceStatus =  _.get(this.resourceDetails, 'status');
      this.setResourceStatus(resourceDetails);
      if (this.resourceDetails.questionCategories) {
        this.sessionContext.questionType = _.lowerCase(_.nth(this.resourceDetails.questionCategories, 0));
      }
      this.sessionContext.resourceStatus = this.resourceStatus;
      this.resourceName = this.resourceDetails.name || this.templateDetails.metadata.name;
      this.contentRejectComment = this.resourceDetails.rejectComment || '';
      if (!this.resourceDetails.itemSets) {
        this.createDefaultQuestionAndItemset();
      } else {
        const itemSet = this.resourceDetails.itemSets;
        if (itemSet[0].identifier) {
          this.itemSetIdentifier = itemSet[0].identifier;
        }
        this.fetchQuestionList();
        this.resourceName = (this.resourceName !== 'Untitled') ? this.resourceName : '' ;
        if (this.visibility && this.visibility.showSave && !this.resourceName) {
          this.showResourceTitleEditor();
        }
      }
      this.handleActionButtons();
    });
  }

  setResourceStatus(resourceDetails) {
    const resourceStatus = this.sessionContext.resourceStatus

    if (resourceStatus === 'Review') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
    } else if (resourceStatus === 'Draft' && resourceDetails.rejectComment && resourceDetails.rejectComment !== '') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
    } else if (resourceStatus === 'Live' && _.isEmpty(this.sourcingReviewStatus)) {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
    } else if (this.sourcingReviewStatus === 'Rejected') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.rejected;
    } else if (this.sourcingReviewStatus === 'Approved') {
      this.sessionContext.resourceStatusText = this.resourceService.frmelmnts.lbl.approved;
    } else {
      this.sessionContext.resourceStatusText = resourceStatus;
    }
  }*/
}
