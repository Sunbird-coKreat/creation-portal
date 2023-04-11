import { ConfigService, ResourceService, ToasterService, ServerResponse, NavigationHelperService } from '@sunbird/shared';
import { FineUploader } from 'fine-uploader';
import { ProgramsService, DataService, FrameworkService, ActionService, UserService, ContentService } from '@sunbird/core';
import { Subscription, forkJoin, throwError, Observable, of } from 'rxjs';
import { tap, first, map, takeUntil, catchError, count, isEmpty, startWith, pairwise } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl, UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormArray, FormGroupName } from '@angular/forms';
import { SourcingService, HelperService } from './../../../sourcing/services';
import { programConfigObj } from './programconfig';
import { IImpressionEventInput, IInteractEventEdata, IStartEventInput, IEndEventInput, TelemetryService } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment';
import * as alphaNumSort from 'alphanum-sort';
import { ProgramTelemetryService } from '../../services';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { IContentEditorComponentInput } from '../../../sourcing/interfaces';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss', './../../../sourcing/components/ckeditor-tool/ckeditor-tool.component.scss']
})

export class CreateProgramComponent implements OnInit, AfterViewInit {
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  @ViewChild('projectTargetTypeModal') projectTargetTypeModal;
  public programId: string;
  public guidLinefileName: String;
  public isFormValueSet = {
    createProgramForm: false,
    projectScopeForm: false,
    projectTargetForm: false
  };
  public collectionEditorVisible: Boolean = false;
  public editPublished = false;
  public editTargetObjectFlag = false;
  public selectedTargetNodeData: any;
  public modifiedNodeData: any = {};
  public editTargetObjectForm: any;
  public unitFormConfig: any;
  public choosedTextBook: any;
  public selectChapter = false;
  public editBlueprintFlag = false;
  public selectedTargetCategories: any;
  public selectedTargetCollection: any;
  public createProgramForm: UntypedFormGroup;
  public projectScopeForm: UntypedFormGroup;
  public projectTargetForm: UntypedFormGroup;
  public chaptersSelectionForm : UntypedFormGroup;
  public programDetails: any = {};
  public collections;
  public tempCollections = [];
  public showProgramScope: boolean = false;
  public textbooks: any = {};
  public programScope: any = {};
  private originalProgramScope: any = {};
  public userprofile;
  public programConfig: any = _.cloneDeep(programConfigObj);
  public stepNo= 1;
  public formIsInvalid = false;
  public pickerMinDate = new Date(new Date().setHours(23,59,59));
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryStart: IStartEventInput;
  public telemetryEnd: IEndEventInput;
  public sortColumn = 'name';
  public chaptersSortColumn = 'name';
  public direction = 'asc';
  public chaptersSortDir = 'asc';
  public tempSortCollections = [];
  public initTopicOptions = [];
  public initLearningOutcomeOptions = [];
  public filterApplied = false;
  public showDocumentUploader = false;
  public defaultContributeOrgReviewChecked = false;
  public disableUpload = false;
  public showPublishModal= false;
  public showFrameworkChangeModal = false;
  public saveFrameWorkValue = {};
  public uploadedDocument;
  public loading = false;
  //private isOpenNominations = true;
  public isClosable = true;
  public uploader;
  public assetConfig: any = this.configService.contentCategoryConfig.sourcingConfig.asset;
  public localBlueprintMap: any;
  public localBlueprintMapDeepClone: any;
  public localBlueprint: any;
  public blueprintTemplate: any;
  public disableCreateProgramBtn = false;
  public btnDoneDisabled = false;
  public telemetryPageId: string;
  private pageStartTime: any;
  public enableQuestionSetEditor: string;
  public questionSetEditorComponentInput: IContentEditorComponentInput = {
    originCollectionData: undefined,
    sourcingStatus: undefined,
    selectedSharedContext: undefined
  };
  public openProjectTargetTypeModal= false;
  projectTargetType: string = null;
  public firstLevelFolderLabel: string;
  public showContributorsListModal = false;
  public selectedContributors = {
    Org:[],
    User: []
  };
  public preSelectedContributors = {
    Org:[],
    User: []
  };
  public selectedContributorsCnt: number = 0;
  public allowToModifyContributors:boolean = true;
  public allowedFrameworkTypes = [];
  public formFieldProperties: any;
  public isValidFrameworkFields = false;
  public frameworkFormData: any;
  public fetchedCategory: string = '';
  public isSendReminderEnabled: boolean;
  constructor(
    public frameworkService: FrameworkService,
    private telemetryService: TelemetryService,
    private programsService: ProgramsService,
    private userService: UserService,
    public toasterService: ToasterService,
    public resource: ResourceService,
    private config: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sourcingService: SourcingService,
    private sbFormBuilder: UntypedFormBuilder,
    private navigationHelperService: NavigationHelperService,
    private helperService: HelperService,
    public configService: ConfigService,
    private deviceDetectorService: DeviceDetectorService,
    public programTelemetryService: ProgramTelemetryService,
    public actionService: ActionService,
    private contentService: ContentService,
    public cacheService: CacheService
  ) { }

  ngOnInit() {
    this.enableQuestionSetEditor = (<HTMLInputElement>document.getElementById('enableQuestionSetEditor'))
      ? (<HTMLInputElement>document.getElementById('enableQuestionSetEditor')).value : 'false';
    const allowedTypes = (<HTMLInputElement>document.getElementById('allowedFrameworkTypes'))
    ? (<HTMLInputElement>document.getElementById('allowedFrameworkTypes')).value : '';
    this.isSendReminderEnabled =  (<HTMLInputElement>document.getElementById('isSendReminderEnabled')) ?
    (<HTMLInputElement>document.getElementById('isSendReminderEnabled')).value === 'true' : false;

    this.allowedFrameworkTypes = (allowedTypes) ? allowedTypes.split(',') : ["K-12", "TPD"];
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.userprofile = this.userService.userProfile;
    this.localBlueprint = {};
    this.localBlueprintMap = {};
    this.telemetryInteractCdata = [{id: this.userService.channel || '', type: 'sourcing_organization'}];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.getPageId();
    // get target collection in dropdown
    if (!_.isEmpty(this.programId)) {
      this.telemetryInteractCdata = [...this.telemetryInteractCdata, {id: this.programId, type: 'project'}];
      this.getProgramDetails();
    } else {
      this.initializeProjectTargetTypeForm();
      this.initializeCreateProgramForm();
      this.openProjectTargetTypeModal = true;
    }
    this.setTelemetryStartData();
    this.pageStartTime = Date.now();
  }

  getProgramDetails() {
    this.programsService.getProgram(this.programId).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.editPublished = _.includes(['Live', 'Unlisted'], _.get(this.programDetails, 'status'));
      this.disableUpload = (this.editPublished && _.get(this.programDetails, 'guidelines_url')) ? true : false;
      this.defaultContributeOrgReviewChecked = _.get(this.programDetails, 'config.defaultContributeOrgReview') ? false : true;
      this.isSendReminderEnabled = _.get(this.programDetails, 'config.isSendReminderEnabled');
      // tslint:disable-next-line: max-line-length
      this.selectedTargetCollection = !_.isEmpty(_.compact(_.get(this.programDetails, 'target_collection_category'))) ? _.get(this.programDetails, 'target_collection_category')[0] : '';

      if (!_.isEmpty(this.programDetails.guidelines_url)) {
        this.guidLinefileName = this.programDetails.guidelines_url.split("/").pop();
      }
      this.initializeCreateProgramForm();
      if (!_.isEmpty(this.programDetails.target_type)) {
        this.projectTargetType = this.programDetails.target_type;
        this.openProjectTargetTypeModal = false;
        //this.fetchFrameWorkDetails();
      } else {
        this.initializeProjectTargetTypeForm();
        this.openProjectTargetTypeModal = true;
      }

      if (!_.isEmpty(_.get(this.programDetails, 'config.contributors'))) {
        this.setPreSelectedContributors(_.get(this.programDetails, 'config.contributors'));
      }
      this.localBlueprintMap = _.get(this.programDetails, 'config.blueprintMap');
    }, error => {
      const errInfo = {
        errorMsg:  'Fetching program details failed',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: {}
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  initializeProjectTargetTypeForm() {
    this.projectTargetForm = this.sbFormBuilder.group({
      'target_type': [this.projectTargetType, Validators.required]
    });
    this.isFormValueSet.projectTargetForm = true;
}

  initializeCreateProgramForm() {
    const nominationEndDate = _.get(this.programDetails, 'nomination_enddate') ? new Date(_.get(this.programDetails, 'nomination_enddate')) : null;
    const shortlistingEndDate = (this.programDetails && _.get(this.programDetails, 'shortlisting_enddate')) ? new Date(_.get(this.programDetails, 'shortlisting_enddate')) : null;
    const programEndDate = (this.programDetails && _.get(this.programDetails, 'enddate')) ? new Date(_.get(this.programDetails, 'enddate')) : null;
    const contentSubmissionEndDate = _.get(this.programDetails, 'content_submission_enddate') ? new Date(_.get(this.programDetails, 'content_submission_enddate')) : null;

    const nomEndDateValidators = _.get(this.programDetails, 'type') === 'public' ? [Validators.required] : '';
    this.createProgramForm =  this.sbFormBuilder.group({
      name: [_.get(this.programDetails, 'name') || null, [Validators.required, Validators.maxLength(100)]],
      description: [_.get(this.programDetails, 'description') || null, Validators.maxLength(1000)],
      nomination_enddate: [nominationEndDate, nomEndDateValidators],
      rewards: [_.get(this.programDetails, 'rewards')],
      shortlisting_enddate: [shortlistingEndDate],
      enddate: [programEndDate, Validators.required],
      content_submission_enddate: [contentSubmissionEndDate, Validators.required],
      type: [{ value: _.get(this.programDetails, 'type') || 'public', disabled: this.editPublished }],
      defaultContributeOrgReview: [{ value: _.get(this.programDetails, 'config.defaultContributeOrgReview') || null, disabled: this.editPublished }]
    });
    this.createProgramForm.get('type').valueChanges.subscribe(projectType => {
        this.openForNominations(projectType);
    });

    this.stepNo = 1;
    this.isFormValueSet.createProgramForm = true;
  }

  initializeProjectScopeForm(): void {
    this.projectScopeForm = this.sbFormBuilder.group({
      pcollections: this.sbFormBuilder.array([]),
      framework: [null, Validators.required],
      board: [],
      targetPrimaryCategories: [[], Validators.required],
      target_collection_category: [this.selectedTargetCollection || null]
    });

    if (_.includes(['collections','questionSets'], this.projectTargetType)) {
      this.projectScopeForm.controls['target_collection_category'].setValidators(Validators.required);
    }
    this.setProjectScopeDetails();
  }

  changeFrameWork() {
    this.showFrameworkChangeModal = false;
    if (!_.isEmpty(this.projectScopeForm.value.framework)) {
      this.tempCollections.length = 0;
      const pcollectionsFormArray = <UntypedFormArray>this.projectScopeForm.controls.pcollections;
      pcollectionsFormArray.controls.length = 0;
      this.projectScopeForm.value.pcollections.length = 0;
      this.textbooks = {};

      if (this.programDetails.config
        && this.programDetails.config.collections
        && this.programDetails.config.collections.length > 0) {
          this.programDetails.config.collections.length = 0;
      }
    }

    this.onFrameworkChange();
  }

  cancelFrameworkChange() {
    this.projectScopeForm.get('framework').patchValue(this.saveFrameWorkValue['prev']);
    this.showFrameworkChangeModal = false;
  }

  setProjectScopeDetails() {
    this.programScope['targetPrimaryCategories'] = [];
    this.programScope['collectionCategories'] = [];
    const channelData$ = this.frameworkService.readChannel();
    channelData$.subscribe((channelData) => {
      if (channelData) {
        this.programScope['userChannelData'] = channelData;
        if (_.includes(['collections', 'searchCriteria'], this.projectTargetType)) {
          this.getFramework().then((response) => {
              if (!response) {
                this.toasterService.error(this.resource.frmelmnts.lbl.projectSource.foraFramework.noFrameworkError)
                return false;
              } else {
                this.programScope['framework'] = response;
                this.frameworkService.getMasterCategories();
                  if (!_.isEmpty(_.first(_.get(this.programDetails, 'config.framework')))) {
                    const selectedFramework =  _.find(this.programScope.framework, {'identifier': _.first(_.get(this.programDetails, 'config.framework'))});
                    this.projectScopeForm.controls['framework'].setValue(selectedFramework);
                    this.onFrameworkChange();
                  }
                  this.isFormValueSet.projectScopeForm = true;
              }

              if (!this.projectScopeForm.value.framework) {
                this.projectScopeForm.controls['framework'].setValue((this.programScope['framework'][0] || null));
                this.onFrameworkChange();
              }

              let frameworkValue = this.projectScopeForm.value.framework || null;
              this.projectScopeForm.get('framework')
              .valueChanges
              .pipe(startWith(frameworkValue as string), pairwise())
              .subscribe(([prev, next]: [any, any]) => {
                if (!prev && next) {
                  this.projectScopeForm.get('framework').patchValue(next);
                  this.changeFrameWork();
                } else if (prev.identifier != next.identifier) {
                  this.saveFrameWorkValue['prev'] = prev;
                  this.saveFrameWorkValue['next'] = next;
                  this.showFrameworkChangeModal = true;
                } else {
                  return false;
                }
              });
          }).catch((err) => {
            console.log(err);
            this.toasterService.error(this.resource.frmelmnts.lbl.projectSource.foraFramework.noFrameworkError);
            return false;
          });
        } else {
          this.getDefaultChannelFramework();
        }
        const channelCats = _.get(this.programScope['userChannelData'], 'primaryCategories');
        const channeltargetObjectTypeGroup = _.groupBy(channelCats, 'targetObjectType');
        const contentCategories = _.get(channeltargetObjectTypeGroup, 'Content');
        const questionSetCategories = _.get(channeltargetObjectTypeGroup, 'QuestionSet');
        const questionCategories = _.get(channeltargetObjectTypeGroup, 'Question');
        if (_.toLower(this.enableQuestionSetEditor) === 'true') {
          this.programScope['targetPrimaryObjects'] = questionSetCategories;
          this.programScope['targetPrimaryCategories']  = _.map(questionSetCategories, 'name');
        }
        if (this.projectTargetType === 'questionSets') {
          this.programScope['collectionCategories'] = _.map(questionSetCategories, 'name');
          this.programScope['targetPrimaryObjects'] = questionCategories;
          this.programScope['targetPrimaryCategories']  = _.map(questionCategories, 'name');
        }
        // tslint:disable-next-line:max-line-length
        if(this.projectTargetType !== 'questionSets') {
          this.programScope['collectionCategories'] = _.map(_.get(channeltargetObjectTypeGroup, 'Collection'), 'name');
          this.programScope['targetPrimaryObjects'] =  _.concat(this.programScope['targetPrimaryObjects'] || [], _.filter(contentCategories, (o) => {
            if (!_.includes(this.programScope['targetPrimaryCategories'], o.name)) {
              this.programScope['targetPrimaryCategories'].push(o.name);
              return o;
            }
          }));
        }
        // tslint:disable-next-line:max-line-length
        this.programScope['selectedTargetCategoryObjects'] = (this.programDetails) ? this.programsService.getProgramTargetPrimaryCategories(this.programDetails, channelCats) : [];
        this.selectedTargetCategories = _.map(this.programScope['selectedTargetCategoryObjects'], 'name');

        // set draft collections on projectScope page load
        this.onChangeTargetCollectionCategory();
      }
    });
  }

  getDefaultChannelFramework () {
    const frameWork = _.get(this.programScope['userChannelData'], 'defaultFramework');
    this.frameworkService.readFramworkCategories(frameWork).subscribe((frameworkDetails) => {
      if (frameworkDetails) {
        this.programScope['framework'] = [frameworkDetails];
        this.programScope['selectedFramework'] = _.cloneDeep(frameworkDetails);
        this.projectScopeForm.controls['framework'].setValue(frameworkDetails);
        const board = _.find(this.programScope.selectedFramework.categories, (element) => {
          return element.code === 'board';
        });
        if (board) {
          if (!_.isEmpty(board.terms[0].name)) {
            this.projectScopeForm.controls['board'].setValue(board.terms[0].name);
          } else if (_.get(this.userprofile.framework, 'board')) {
            this.projectScopeForm.controls['board'].setValue(this.userprofile.framework.board[0]);
          }
        }
      }
      this.isFormValueSet.projectScopeForm = true;
    });
  }

  getFramework () {
    let frameworks = [];
    let systemRequests = [];
    const channelFrameworks = _.get(this.programScope['userChannelData'], 'frameworks');
    const frameworkTypeGroup = _.groupBy(channelFrameworks, 'type');
    return new Promise ((resolve, reject) => {
      _.forEach(this.allowedFrameworkTypes, type => {
        if (!_.isEmpty(_.get(frameworkTypeGroup, type))) {
          const ret = _.first(_.get(frameworkTypeGroup, type));
          frameworks.push(ret);
        } else {
          systemRequests.push(this.frameworkService.getFrameworkData(undefined, type, undefined, "Yes"));
        }
      });
      if (systemRequests.length) {
        forkJoin(systemRequests).subscribe((response) => {
          _.forEach(response, res => {
            if (res.result.count) {
              frameworks.push(_.first(_.get(res, 'result.Framework')));
            }
          })
          return resolve(frameworks);
        })
      } else {
        return resolve(frameworks);
      }
    });
  }

  initiateDocumentUploadModal() {
    this.showDocumentUploader = true;
    this.loading = false;
    this.isClosable = true;
    return setTimeout(() => {
      this.initiateUploadModal();
    }, 0);
  }

  getAcceptType(typeList, type) {
    const acceptTypeList = typeList.split(', ');
    const result = [];
    _.forEach(acceptTypeList, (content) => {
      result.push(`${type}/${content}`);
    });
    return result.toString();
  }

  initiateUploadModal() {
    this.uploader = new FineUploader({
      element: document.getElementById('upload-document-div'),
      template: 'qq-template-validation',
      multiple: false,
      autoUpload: false,
      request: {
        endpoint: '/assets/uploads'
      },
      validation: {
        allowedExtensions: this.assetConfig.pdfFiles.split(', '),
        acceptFiles: this.getAcceptType(this.assetConfig.pdfFiles, 'pdf'),
        itemLimit: 1,
        sizeLimit: _.toNumber(this.assetConfig.defaultfileSize) * 1024 * 1024  // 52428800  = 50 MB = 50 * 1024 * 1024 bytes
      },
      messages: {
        sizeError: `{file} is too large, maximum file size is ${this.assetConfig.defaultfileSize} MB.`,
        typeError: `Invalid content type (supported type: ${this.assetConfig.pdfFiles})`
      },
      callbacks: {
        onStatusChange: () => {

        },
        onSubmit: () => {
          this.uploadContent();
        },
        onError: () => {
          this.uploader.reset();
        }
      }
    });
    this.fineUploaderUI.nativeElement.remove();
  }

  initializeSelectedSharedContext(target_type) {
    if(target_type === 'questionSets') {
      if(this.isFormValueSet.projectScopeForm && this.projectScopeForm.controls) {
        let board = this.projectScopeForm.controls.board.value;
        let framework = _.get(this.projectScopeForm.controls.framework.value, 'identifier');
        if(_.isArray(board) && board.length) board = _.first(board);
        return {
          'board': board,
          'framework': framework,
          channel: this.userprofile.rootOrgId
        }
      }
    }
    return {}
  }

  initializeCollectionEditorInput() {
    const selectedTargetCollectionObject = this.programScope['selectedTargetCollectionObject'];
    const objType = _.replace(_.lowerCase(selectedTargetCollectionObject?.targetObjectType), ' ', '');

    this.questionSetEditorComponentInput['sessionContext'] = {
      currentRoles: this.userService.userProfile.userRoles,
    };
    this.questionSetEditorComponentInput['templateDetails'] =
      {
        name: selectedTargetCollectionObject?.name,
        modeOfCreation: objType,
        mimeType: [_.get(_.find(this.configService.contentCategoryConfig.sourcingConfig.editor, {
          type: objType
        }), 'mimetype', 'application/vnd.sunbird.questionset')]
      };
    this.questionSetEditorComponentInput['selectedSharedContext'] = this.initializeSelectedSharedContext(this.projectTargetType);
    this.questionSetEditorComponentInput['action'] = 'creation';
    this.questionSetEditorComponentInput['programContext'] = _.merge({ framework: _.get(this.programScope, 'framework.code') }, this.programDetails);
    this.questionSetEditorComponentInput['enableQuestionCreation'] = false;
    this.questionSetEditorComponentInput['enableAddFromLibrary'] = false;
    this.questionSetEditorComponentInput['setDefaultCopyright'] = true;
    this.questionSetEditorComponentInput['hideSubmitForReviewBtn'] = true;
  }


  initiateCollectionEditor(identifier?) {
    this.initializeCollectionEditorInput();
    if(_.isEmpty(identifier)) {
    const createContentReq = this.helperService.createContent(this.questionSetEditorComponentInput);
    createContentReq.pipe(map((res: any) => res.result), catchError(
      err => {
       const errInfo = {
        errorMsg: 'Unable to create contentId, Please Try Again',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: {}
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      }))
      .subscribe(result => {
        this.questionSetEditorComponentInput.contentId = result.identifier;
        this.programsService.emitHeaderEvent(false);
        this.collectionEditorVisible = true;
      });
    } else {
        this.questionSetEditorComponentInput.contentId = identifier;
        this.programsService.emitHeaderEvent(false);
        this.collectionEditorVisible = true;
    }
  }

  collectionEditorEventListener(event) {
    console.log(event);
    switch (event.action) {
     case 'saveContent':
       this.collectionEditorVisible = false;
       this.navigateTo(2);
       this.onCollectionCheck(event.collection, true);
       this.showProgramScope = true;
      break;
     case 'backContent':
     default:
        this.navigateTo(2);
        this.collectionEditorVisible = false;
        break;
    }
   }

  uploadContent() {
    if (this.uploader.getFile(0) == null) {
      this.toasterService.error('File is required to upload');
      this.uploader.reset();
      return;
    }
    this.uploadDocument();
  }

  /**
   * function to upload Document
   */
  uploadDocument() {
    this.isClosable = false;
    this.loading = true;
    const req = this.sourcingService.generateAssetCreateRequest(this.uploader.getName(0), this.uploader.getFile(0).type, 'pdf', this.userprofile);
    this.sourcingService.createMediaAsset(req).pipe(catchError(err => {
      this.loading = false;
      this.isClosable = true;
      const errInfo = {
        errorMsg: ' Unable to create an Asset',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env, request: req
        };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      const contentId = res['result'].node_id;
      const request = {
        content: {
          fileName: this.uploader.getName(0)
        }
      };
      this.sourcingService.generatePreSignedUrl(request, contentId).pipe(catchError(err => {
        const errInfo = {
          errorMsg: 'Unable to get pre_signed_url and Content Creation Failed, Please Try Again',
          telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env, request: request};
        this.loading = false;
        this.isClosable = true;
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
      })).subscribe((response) => {
        const signedURL = response.result.pre_signed_url;
        const headers = this.helperService.addCloudStorageProviderHeaders();
        const config = {
          processData: false,
          contentType: 'Asset',
          headers: headers
        };
        this.uploadToBlob(signedURL, this.uploader.getFile(0), config).subscribe(() => {
          const fileURL = signedURL.split('?')[0];
          this.updateContentWithURL(fileURL, this.uploader.getFile(0).type, contentId);
        });
      });
    });
  }

  updateContentWithURL(fileURL, mimeType, contentId) {
    const data = new FormData();
    data.append('fileUrl', fileURL);
    data.append('mimeType', mimeType);
    const config = {
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      cache: false
    };
    const option = {
      data: data,
      param: config
    };
    this.sourcingService.uploadMedia(option, contentId).pipe(catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to update pre_signed_url with Content Id and Content Creation Failed, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env, request: option };
      this.isClosable = true;
      this.loading = false;
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      // Read upload video data
      this.getUploadVideo(res.result.node_id);
    });
  }

  getUploadVideo(videoId) {
    this.loading = false;
    this.isClosable = true;
    this.sourcingService.getVideo(videoId).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to read the Document, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env, request: videoId };
      this.loading = false;
      this.isClosable = true;
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      this.toasterService.success('Document Successfully Uploaded...');
      this.uploadedDocument = res;
      this.showDocumentUploader = false;
    });
  }

  removeUploadedDocument() {
    this.uploadedDocument = null;
    this.guidLinefileName = null;
    this.programDetails.guidelines_url = null;
  }

  uploadToBlob(signedURL, file, config): Observable<any> {
    return this.programsService.http.put(signedURL, file, config).pipe(catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to upload to Blob and Content Creation Failed, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env, request: signedURL };
      this.isClosable = true;
      this.loading = false;
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }), map(data => data));
  }

  sortCollection(column) {
    this.collections = this.programsService.sortCollection(this.tempSortCollections, column, this.direction);
    this.direction = (this.direction === 'asc' || this.direction === '') ? 'desc' : 'asc';
    this.sortColumn = column;
  }

  sortChapters(identifier, column) {
    this.textbooks[identifier].children = this.programsService.sortCollection(this.textbooks[identifier].children, column, this.chaptersSortDir);
    this.chaptersSortDir = (this.chaptersSortDir === 'asc' || this.chaptersSortDir === '') ? 'desc' : 'asc';
    this.chaptersSortColumn = column;
  }

  resetSorting() {
    this.sortColumn = 'name';
    this.direction = 'asc';
  }

  getMaxDate(date) {
    if (!this.editPublished) {
      if (date === 'nomination_enddate') {
        if (this.createProgramForm.value.shortlisting_enddate) {
          return new Date(this.createProgramForm.value.shortlisting_enddate.setHours(23,59,59));
        }
      }

      if (date === 'shortlisting_enddate') {
        if (this.createProgramForm.value.content_submission_enddate) {
          return new Date(this.createProgramForm.value.content_submission_enddate.setHours(23,59,59));
        }
      }
      return (this.createProgramForm.value.enddate) ? new Date(this.createProgramForm.value.enddate.setHours(23,59,59)) : '';
    }
    return '';
  }

  getMinDate(date) {
    if (date === 'shortlisting_enddate') {
      if (this.createProgramForm.value.nomination_enddate) {
        return new Date(this.createProgramForm.value.nomination_enddate.setHours(23,59,59));
      }
    }

    if (date === 'content_submission_enddate') {
      if (this.createProgramForm.value.shortlisting_enddate) {
        return new Date(this.createProgramForm.value.shortlisting_enddate.setHours(23,59,59));
      }

      if (this.createProgramForm.value.nomination_enddate) {
        return new Date(this.createProgramForm.value.nomination_enddate.setHours(23,59,59));
      }
    }

    if (date === 'enddate') {
      if (this.createProgramForm.value.content_submission_enddate) {
        return new Date(this.createProgramForm.value.content_submission_enddate.setHours(23,59,59));
      }

      if (this.createProgramForm.value.shortlisting_enddate) {
        return new Date(this.createProgramForm.value.shortlisting_enddate.setHours(23,59,59));
      }

      if (this.createProgramForm.value.nomination_enddate) {
        return new Date(this.createProgramForm.value.nomination_enddate.setHours(23,59,59));
      }
    }

    if (!this.editPublished) {
      return this.pickerMinDate;
    } else if(this.createProgramForm.value.type === 'public') {
      return new Date(this.createProgramForm.value.nomination_enddate.setHours(23,59,59));
    }
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryInteractCdata,
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.config.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  openForNominations(projectType) {
    if (projectType === 'public') {
      this.createProgramForm.controls['nomination_enddate'].setValidators(Validators.required);
    } else {
      this.createProgramForm.controls['nomination_enddate'].clearValidators();
      this.createProgramForm.controls['shortlisting_enddate'].clearValidators();
      this.createProgramForm.controls['nomination_enddate'].setValue(null);
      this.createProgramForm.controls['shortlisting_enddate'].setValue(null);
    }
    this.createProgramForm.controls['nomination_enddate'].updateValueAndValidity();
    this.createProgramForm.controls['shortlisting_enddate'].updateValueAndValidity();
  }
  onFrameworkChange() {
    //Get framework fields data
    if (!_.isEmpty(this.projectScopeForm.value.framework)) {
      const framework = this.projectScopeForm.value.framework;
      const request = [ this.programsService.getformConfigData(this.userService.hashTagId, 'framework', framework.type, null, null, this.selectedTargetCollection),
                        this.frameworkService.readFramworkCategories(framework.identifier),
                        ];

      forkJoin(request).subscribe(res => {
        const formData = _.get(_.first(res), 'result.data.properties');
        const frameworkDetails = res[1];
        this.programScope['selectedFramework'] = _.cloneDeep(frameworkDetails);
        this.formFieldProperties = this.programsService.initializeFrameworkFormFields(frameworkDetails['categories'], formData, _.get(this.programDetails, 'config'));
        this.programScope['formFieldProperties'] = _.cloneDeep(this.formFieldProperties);

      });
      if (!this.projectTargetType || _.includes(['collections', 'questionSets'], this.projectTargetType)) {
        this.showTexbooklist()
      }
    }
  }

  getCollectionCategoryDefinition() {
    if (this.selectedTargetCollection && this.userprofile.rootOrgId && this.selectedTargetCollection !== this.fetchedCategory) {
      let objType = this.projectTargetType === 'questionSets' ? 'QuestionSet' : 'Collection';
      this.programsService.getCategoryDefinition(this.selectedTargetCollection, this.userprofile.rootOrgId, objType).subscribe(res => {
        const objectCategoryDefinition = res.result.objectCategoryDefinition;
        this.fetchedCategory = _.get(objectCategoryDefinition, 'name');
        if (objectCategoryDefinition && objectCategoryDefinition.forms) {
          if (!_.isEmpty(objectCategoryDefinition.forms.blueprintCreate)) {
            this.blueprintTemplate = objectCategoryDefinition.forms.blueprintCreate;
          }
          if (!_.isEmpty(objectCategoryDefinition.forms.modify)) {
            this.editTargetObjectForm = objectCategoryDefinition.forms.modify.properties;
          }
        }
        if (_.has(objectCategoryDefinition.objectMetadata.config, 'sourcingSettings.collection.hierarchy.level1.name')) {
          // tslint:disable-next-line:max-line-length
        this.firstLevelFolderLabel = objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection.hierarchy.level1.name;
        } else {
          this.firstLevelFolderLabel = _.get(this.resource, 'frmelmnts.lbl.deafultFirstLevelFolders');
        }
      });
    }
  }

  editTargetNode(nodeData: any) {
    const formFields = [];
    _.forEach(this.editTargetObjectForm, (section) => {
      _.forEach(section.fields, field => {
          formFields.push(field.code);
      })
    });
    const req = {
      url: `${this.configService.urlConFig.URLS.QUESTIONSET.GET}/${nodeData.identifier}`,
      param: {
          mode: 'edit',
          fields: formFields.join(',')
        }
    };
    return this.contentService.get(req).subscribe((res) => {
      this.selectedTargetNodeData = res.result.questionset;
      _.forEach(this.editTargetObjectForm, (section) => {
        _.forEach(section.fields, field => {
            if (_.has(this.selectedTargetNodeData, field.code)) {
              const value = _.get(this.selectedTargetNodeData, field.code);
              if (_.isObject(value) && _.has(value, 'default')) {
                field.default = _.get(value, 'default');
              }
              else  {
                field.default = value;
              }
            }
            else {
              field.default = '';
            }
        })
      });
      this.editTargetObjectFlag = true;
    },
    (err) => {
      this.toasterService.error(this.resource.messages.emsg.questionset.failedToRead);
    })
  }

  updateTargetNode() {
    if (_.has(this.modifiedNodeData, 'instructions')) {
      this.modifiedNodeData['instructions'] = {
        default: _.get(this.modifiedNodeData, 'instructions')
      };
    }
    if (this.selectedTargetNodeData) {
      const req = {
        url: `${this.configService.urlConFig.URLS.QUESTIONSET.UPDATE}/${this.selectedTargetNodeData.identifier}`,
        data: {
          request: {
            questionset: {
              channel: this.userprofile.rootOrgId,
              ...this.modifiedNodeData
            }
          }
        }
      };
      this.actionService.patch(req).subscribe((res) => {
        _.forEach(this.tempCollections, (tempCollection, index) => {
            if (tempCollection.identifier === this.selectedTargetNodeData.identifier) {
              this.tempCollections[index] = { ...tempCollection, ...this.modifiedNodeData }
            }
        })
        this.toasterService.success(this.resource.messages.smsg.questionset.updated);
        this.editTargetObjectFlag = false;
        this.selectedTargetNodeData = {};
      },
      (err) => {
        this.toasterService.error(this.resource.messages.smsg.questionset.failedToUpdate);
      })
    }
  }

  valueChanges(data: any) {
    this.modifiedNodeData = data;
  }

  saveProgramError(err) {
    console.log(err);
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched();
      control.markAsDirty();
    });
  }

  navigateTo(stepNo) {
    window.scrollTo(0,0);
    this.stepNo = stepNo;
    if (this.stepNo === 2 && !this.isFormValueSet.projectScopeForm) {
      this.initializeProjectScopeForm();
    }
  }

  validateDates() {
    let hasError = false;
    const formData = this.createProgramForm.getRawValue();
    const nominationEndDate = moment(formData.nomination_enddate);
    const contentSubmissionEndDate = moment(formData.content_submission_enddate);
    const programEndDate = moment(formData.enddate);
    const today = moment(moment().format('YYYY-MM-DD'));

    if (formData.type === 'public') {
      // nomination date should be >= today
      if (!nominationEndDate.isSameOrAfter(today) && !this.editPublished) {
        this.toasterService.error(this.resource.messages.emsg.createProgram.m0001);
        hasError = true;
      }
      const invalidValues = ['', null, undefined];
      if (!_.includes(invalidValues, formData.shortlisting_enddate)) {
        const shortlistingEndDate = moment(formData.shortlisting_enddate);
        // shortlisting date should be >= nomination date
        if (!shortlistingEndDate.isSameOrAfter(nominationEndDate)) {
          this.toasterService.error(this.resource.messages.emsg.createProgram.m0002);
          hasError = true;
        }
        // submission date should be >= shortlisting date
        if (!contentSubmissionEndDate.isSameOrAfter(shortlistingEndDate)) {
          this.toasterService.error(this.resource.messages.emsg.createProgram.m0003);
          hasError = true;
        }
      } else {
        if (!contentSubmissionEndDate.isSameOrAfter(nominationEndDate)) {
          this.toasterService.error(this.resource.messages.emsg.createProgram.m0005);
          hasError = true;
        }
      }
    }

    // end date should be >= submission date
    if (!programEndDate.isSameOrAfter(contentSubmissionEndDate)) {
      this.toasterService.error(this.resource.messages.emsg.createProgram.m0004);
      hasError = true;
    }

    return hasError;
  }

  applyFilters() {
    const primaryCategory = this.projectScopeForm.value.target_collection_category;

    if (!primaryCategory) {
      this.toasterService.warning(this.resource.messages.emsg.NoTargetCollection);
      return true;
    }
    this.filterApplied=true;
    this.showTexbooklist();
  }

  resetFilters() {
    this.filterApplied = false;
    this.resetSorting();
    this.formFieldProperties = _.cloneDeep(this.programScope['formFieldProperties']);
    this.frameworkFormData = {};
    this.showTexbooklist();
  }

  defaultContributeOrgReviewChanged($event) {
    this.createProgramForm.value.defaultContributeOrgReview = !$event.target.checked;
    this.defaultContributeOrgReviewChecked = $event.target.checked;
  }

  setValidations() {
    this.openForNominations(this.createProgramForm.value.type);
    this.createProgramForm.controls['description'].setValidators(Validators.required);
    this.createProgramForm.controls['description'].updateValueAndValidity();
    this.createProgramForm.controls['enddate'].setValidators(Validators.required);
    this.createProgramForm.controls['enddate'].updateValueAndValidity();
    this.createProgramForm.controls['content_submission_enddate'].setValidators(Validators.required);
    this.createProgramForm.controls['content_submission_enddate'].updateValueAndValidity();
    this.projectScopeForm.controls['targetPrimaryCategories'].setValidators(Validators.required);
    this.projectScopeForm.controls['targetPrimaryCategories'].updateValueAndValidity();
    this.projectScopeForm.controls['framework'].setValidators(Validators.required);
    this.projectScopeForm.controls['framework'].updateValueAndValidity();
    if (_.includes(['collections','questionSets'], this.projectTargetType)) {
      this.projectScopeForm.controls['target_collection_category'].setValidators(Validators.required);
      this.projectScopeForm.controls['target_collection_category'].updateValueAndValidity();
    }
  }

  removeFieldValidatorsForDraft() {
    if (this.isFormValueSet.createProgramForm) {
      Object.keys(this.createProgramForm.controls).forEach(field => {
        // Only name should be mandatory for draft projects. But type was giving issue and removing other fields that is why type is also checked
        if (field !== 'name' && field !== 'type') {
          const control = this.createProgramForm.get(field);
          control.clearValidators();
          control.updateValueAndValidity();
        }
      });
    }

    if (this.isFormValueSet.projectScopeForm) {
      Object.keys(this.projectScopeForm.controls).forEach(field => {
          const control = this.projectScopeForm.get(field);
          control.clearValidators();
          control.updateValueAndValidity();
      });
    }
  }
  getGuidelinesOriginURL(src) {
    const replaceText = '/assets/public/';
    const aws_s3_urls = this.userService.cloudStorageUrls;

    _.forEach(aws_s3_urls, url => {
      if (src.indexOf(url) !== -1) {
        src = src.replace(url, replaceText);
      }
    });
    return src;
  }
  saveProgram(cb) {
    let programData;
    if (this.isFormValueSet.createProgramForm) {
      programData = { ...this.createProgramForm.value };
    }
    programData['target_type'] = this.projectTargetType;
    if(this.isFormValueSet.projectScopeForm) {
      programData['target_collection_category'] = (this.isFormValueSet.projectScopeForm && _.includes(['collections','questionSets'], this.projectTargetType)) ? [this.projectScopeForm.value.target_collection_category] : [];
    }
    this.programConfig.defaultContributeOrgReview = !this.defaultContributeOrgReviewChecked;
    if (this.projectTargetType=='questionSets'){
    this.programConfig.isSendReminderEnabled = this.isSendReminderEnabled;
    }
    programData['content_types']  = [];
    programData['targetprimarycategories'] = _.filter(this.programScope['targetPrimaryObjects'], (o) => {
      if (_.includes(this.selectedTargetCategories, o.name)) {
        return o;
      }
    });
    if (programData.type === 'restricted') {
      this.programConfig['contributors'] = this.selectedContributors;
    }
    programData['sourcing_org_name'] = this.userprofile.rootOrg.orgName;
    programData['rootorg_id'] = this.userprofile.rootOrgId;
    programData['createdby'] = this.userprofile.id;
    programData['createdon'] = new Date();
    programData['startdate'] = new Date();
    programData['slug'] = 'sunbird';
    // tslint:disable-next-line: max-line-length
    programData['guidelines_url'] = _.get(this.programDetails, 'guidelines_url');
    if (this.uploadedDocument && _.get(this.uploadedDocument, 'artifactUrl')) {
      programData['guidelines_url'] = this.getGuidelinesOriginURL(_.get(this.uploadedDocument, 'artifactUrl'));
    }
    programData['status'] = this.editPublished ? 'Live' : 'Draft';

    if (!this.programConfig['blueprintMap']) {
      this.programConfig['blueprintMap'] = this.localBlueprintMap;
    }

    delete programData.defaultContributeOrgReview;
    delete programData.gradeLevel;
    delete programData.medium;
    delete programData.subject;
    //delete this.programData.program_end_date;
    programData['program_id'] = '';
    this.setFrameworkAttributesToconfig();
    if (!this.programId) {
      programData['config'] = this.programConfig;
      this.programsService.createProgram(programData).subscribe(
        (res) => {
          this.programId = res.result.program_id;
          programData['program_id'] = this.programId;
          this.programDetails = programData;
          cb(null, res);
        },
        (err) => {
          cb(err, null);
          this.saveProgramError(err);
        }
      );
    } else {
      if (!this.editPublished && _.includes(['collections','questionSets'], this.projectTargetType)) {
        programData['collection_ids'] = [];
        if (_.get(this.projectScopeForm, 'value.pcollections') && !_.isEmpty(this.projectScopeForm.value.pcollections)) {
          const config = this.addCollectionsDataToConfig();
          this.programConfig['framework'] = config.framework;
          this.programConfig['board'] = config.board;
          this.programConfig['gradeLevel'] = config.gradeLevel;
          this.programConfig['medium'] = config.medium;
          this.programConfig['subject'] = config.subject;
          this.programConfig['collections'] = this.getCollections();
          _.forEach(this.projectScopeForm.value.pcollections, item => {
            programData['collection_ids'].push(item.id);
          });
        }
      }

      programData['config'] = this.programConfig;
      programData['program_id'] = this.programId;
      this.programsService.updateProgram(programData).subscribe(
        (res) => {
          cb(null, res);
        },
        (err) => {
          cb(err, null);
          this.saveProgramError(err);
        }
      );
    }
  }

  updateProgram($event: MouseEvent) {
    this.formIsInvalid = false;

    if (this.createProgramForm.valid) {
      ($event.target as HTMLButtonElement).disabled = true;
      const prgData = {
        ...this.createProgramForm.value
      };
      const invalidValues = ['', null, undefined];

      if (_.includes(invalidValues, prgData.shortlisting_enddate)) {
        prgData['shortlisting_enddate'] = null;
      }

      //prgData['enddate'] = prgData.program_end_date;
      prgData['program_id'] = this.programId;
      // tslint:disable-next-line: max-line-length
      prgData['guidelines_url'] = (this.uploadedDocument) ? this.uploadedDocument.artifactUrl : _.get(this.programDetails, 'guidelines_url');

      //delete prgData.program_end_date;
      delete prgData.targetPrimaryCategories;

      if (prgData.type && prgData.type !== 'public') {
        delete prgData.nomination_enddate;
        delete prgData.shortlisting_enddate;
      }

      if (prgData['nomination_enddate']) {
        prgData['nomination_enddate'].setHours(23,59,59);
      }

      if (prgData['shortlisting_enddate']) {
        prgData['shortlisting_enddate'].setHours(23,59,59);
      }

      if (prgData['enddate']) {
        prgData['enddate'].setHours(23,59,59);
      }

      if (prgData['content_submission_enddate']) {
        prgData['content_submission_enddate'].setHours(23,59,59);
      }

      if (this.programDetails.type === 'restricted') {
        prgData['config'] = _.get(this.programDetails, 'config');
        prgData.config['contributors'] = this.selectedContributors;
      } else if (this.editPublished && _.includes(['questionSets'], this.projectTargetType) && this.projectScopeForm) {
        prgData['collection_ids'] = [];
        if (_.get(this.projectScopeForm, 'value.pcollections') && !_.isEmpty(this.projectScopeForm.value.pcollections)) {
          const config = this.addCollectionsDataToConfig();
          this.programConfig['framework'] = config.framework;
          this.programConfig['board'] = config.board;
          this.programConfig['gradeLevel'] = config.gradeLevel;
          this.programConfig['medium'] = config.medium;
          this.programConfig['subject'] = config.subject;
          this.programConfig['collections'] = this.getCollections();
          _.forEach(this.projectScopeForm.value.pcollections, item => {
            prgData['collection_ids'].push(item);
          });
          prgData['config'] = this.programConfig;
        }
      }

      if (!_.isEmpty(this.localBlueprintMap)) {
        if (!prgData.config) {
          prgData['config'] = _.get(this.programDetails, 'config');
        }
        prgData.config['blueprintMap'] = this.localBlueprintMap;
      }

      this.programsService.updateProgram(prgData).subscribe(
        (res) => {
          this.generateTelemetryEndEvent('update');
          this.toasterService.success(this.resource.messages.smsg.modify.m0001);
          let tab = (this.projectTargetType === 'searchCriteria') ? 'noCollections' : 'collections';
          if(this.projectTargetType === 'questionSets') tab = 'questionSets';
          this.router.navigate(['/sourcing'],
            {queryParams: { targetType: tab }, queryParamsHandling: 'merge' });
        },
        (err) => {
          console.log(err, err);
          this.toasterService.error(this.resource.messages.emsg.m0005);
          ($event.target as HTMLButtonElement).disabled = false;
        }
      );
    } else {
      this.formIsInvalid = true;
      this.validateAllFormFields(this.createProgramForm);
    }
    this.validateDates();
  }

onChangeTargetCollectionCategory() {
  if(this.projectScopeForm.controls && this.projectScopeForm.value) {
    this.projectScopeForm.controls['target_collection_category'].setValue(this.selectedTargetCollection);
    this.projectScopeForm.value.pcollections = [];
    if (!_.isEmpty(this.projectScopeForm.value.framework) && _.isEmpty(this.programScope['formFieldProperties'])) {
      this.onFrameworkChange();
    } else {
      this.showTexbooklist();
    }
  }

  if(this.programScope['userChannelData']) {
    this.setSelectedTargetCollectionObject();
  }

  this.getCollectionCategoryDefinition();
  this.tempCollections = [];
}

setSelectedTargetCollectionObject() {
  const channelCats = _.get(this.programScope['userChannelData'], 'primaryCategories');
  this.programScope['selectedTargetCollectionObject'] = _.find(channelCats, { name: this.selectedTargetCollection });
}

showTexbooklist() {
    const primaryCategory = this.projectScopeForm.value.target_collection_category;

    if (!primaryCategory) {
      return true;
    }

    if (this.projectTargetType !== 'questionSets' && _.isEmpty(this.projectScopeForm.value.framework)) {
      return true;
    }

    // for scrolling window to top after Next button navigation
    const requestData = {
      request: {
        filters: {
          objectType: this.projectTargetType === 'questionSets' ? 'QuestionSet' : 'Collection',
          status: ['Draft'],
          primaryCategory: primaryCategory,
          channel: this.userprofile.rootOrgId,
        },
        limit: 1000,
        not_exists: ['programId']
      }
    };
    if (!_.isEmpty(this.projectScopeForm.value.framework)) {
      const framework = this.projectScopeForm.value.framework;
      requestData.request.filters['framework'] = framework.identifier;
    }
    if (!_.isEmpty(this.frameworkFormData)) {
      _.forEach(this.frameworkFormData,  (value, key) => {
        if (!_.isEmpty(value)) {
          requestData.request.filters[key] =_.isArray(value) ? value : [value];
        }
      });
    }
    requestData.request.filters = _.pickBy(requestData.request.filters, function(v,k){return (!_.isEmpty(v))});

    if(this.projectTargetType === 'questionSets') {
      delete requestData.request.not_exists;
      requestData.request.filters['programId'] = this.programId;
    }

    return this.programsService.getCollectionList(requestData, this.projectTargetType).subscribe(
      (res) => {
        if (this.projectTargetType === 'questionSets' || res.result.count) {
          this.collections = res.result.content;
          if(this.projectTargetType === 'questionSets') {
            this.collections = _.get(res.result, 'QuestionSet', []);
          }
          this.showProgramScope = true;
          this.tempSortCollections = this.collections;
          if (!this.filterApplied) {
            this.sortCollection(this.sortColumn);
          }


          _.forEach(this.collections, item => {
            const draftCollections = _.get(this.programDetails, 'config.collections');
            const cindex = this.collections.findIndex(x => x.id === item.identifier);
            if (!_.isEmpty(draftCollections)) {
              const index = draftCollections.findIndex(x => x.id === item.identifier);
              if (index !== -1) {
                this.onCollectionCheck(item, true);
              }
            }
          });
        } else {
          this.showProgramScope = (!this.filterApplied) ? false : true;
          this.collections = [];
          this.tempSortCollections = [];
          if (!this.filterApplied) {
           // tslint:disable-next-line: max-line-length
           this.toasterService.warning(this.resource.messages.smsg.selectDifferentTargetCollection.replace('{TARGET_NAME}', primaryCategory));
          }
        }
      },
      (err) => {
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );
  }

  updateTempCollections(collection) {
    let collectionId = collection.identifier;
    let cIndex = _.findIndex(this.tempCollections, { identifier: collectionId })
    if(cIndex !== -1) {
      this.tempCollections[cIndex] = collection;
    }
    else this.tempCollections.push(collection);
  }

  onCollectionCheck(collection, isChecked: boolean) {
    const pcollectionsFormArray = <UntypedFormArray>this.projectScopeForm.controls.pcollections;
    const collectionId = collection.identifier;

    if (isChecked) {
      const controls = _.get(pcollectionsFormArray, 'controls');
      if (controls.findIndex(c => c.value === collection.identifier) === -1) {
        pcollectionsFormArray.push(new UntypedFormControl(collectionId));
        this.tempCollections.push(collection);

        if(this.projectTargetType === 'questionSets') {
          if (!this.textbooks[collectionId]) {
            this.textbooks[collectionId] = collection;
          }
        } else {
          if (!this.textbooks[collectionId]) {
            this.getCollectionHierarchy(collectionId);
          }
        }
      }
      else { // Update already created questionset during project creation
        this.textbooks[collectionId] = collection;
        this.updateTempCollections(collection);
      }
    } else {
      const index = pcollectionsFormArray.controls.findIndex(x => x.value === collectionId);
      pcollectionsFormArray.removeAt(index);

      const cindex = this.tempCollections.findIndex(x => x.identifier === collectionId);
      this.tempCollections.splice(cindex, 1);

      const colIndex = this.programDetails.config.collections.findIndex(x => x.id === collectionId);
      this.programDetails.config.collections.splice(colIndex, 1);

      delete this.textbooks[collectionId];
    }
  }

  getCollections() {
    const collections = [];

    _.forEach(this.projectScopeForm.value.pcollections, (identifier) => {
      const obj = {
        'id' : identifier,
        'allowed_content_types': [],
        'children': []
      };

      if (this.textbooks[identifier]) {
        _.forEach(this.textbooks[identifier].children, (item) => {
          if (item.checked === true) {
            obj.children.push({
              'id': item.identifier,
              'allowed_content_types': []
            });
          }
        });
        collections.push(obj);
      }
    });

    return collections;
  }
  setFrameworkAttributesToconfig() {
    if (!_.isEmpty(this.programScope['selectedFramework'])) {
      const frameworkSelected = this.programScope['selectedFramework'];
      this.programConfig['framework'] = [frameworkSelected.code];
      this.programConfig['frameworkObj'] = {
        identifier : frameworkSelected.identifier,
        code: frameworkSelected.code,
        type: frameworkSelected.type,
        name : frameworkSelected.name,
      };
      if (this.isFormValueSet.projectScopeForm && this.projectTargetType === 'searchCriteria') {
        _.forEach(this.frameworkFormData,  (value, key) => {
          const formData = _.isArray(value) ? value : [value];
          this.programConfig[key] = _.compact(formData);
          const code = _.get(_.find(this.frameworkService.orgFrameworkCategories, {
            'code': key
          }), 'orgIdFieldName');
          this.programConfig[code] = [];
          const formField = _.find(this.formFieldProperties, {'code': key});
          _.map(formField.terms, (field) => {
            if (_.includes(this.programConfig[key], field.name)) {
              this.programConfig[code].push(field.identifier);
            }
          });
        });
      }
    }
  }

  addCollectionsDataToConfig() {
    const config = {
      'framework': [],
      'board': [],
      'gradeLevel': [],
      'medium': [],
      'subject': []
    };

    _.forEach(this.tempCollections, (collection) => {

      if (_.isArray(collection.framework)) {
        _.forEach(collection.framework, (single) => {
          if (config.framework.indexOf(single) === -1) {
            config.framework.push(single);
          }
        });
      } else if (_.isString(collection.framework)) {
        if (config.framework.indexOf(collection.framework) === -1) {
          config.framework.push(collection.framework);
        }
      }

      if (_.isArray(collection.board)) {
        _.forEach(collection.board, (single) => {
          if (config.board.indexOf(single) === -1) {
            config.board.push(single);
          }
        });
      } else if (_.isString(collection.board)) {
        if (config.board.indexOf(collection.board) === -1) {
          config.board.push(collection.board);
        }
      }

      if (_.isArray(collection.medium)) {
        _.forEach(collection.medium, (single) => {
          if (config.medium.indexOf(single) === -1) {
            config.medium.push(single);
          }
        });
      } else {
        if (config.medium.indexOf(collection.medium) === -1) {
          config.medium.push(collection.medium);
        }
      }
      if (_.isArray(collection.subject)) {
        _.forEach(collection.subject, (single) => {
          if (config.subject.indexOf(single) === -1) {
            config.subject.push(single);
          }
        });
      } else {
        if (config.subject.indexOf(collection.subject) === -1) {
          config.subject.push(collection.subject);
        }
      }

      _.forEach(collection.gradeLevel, (single) => {
        if (config.gradeLevel.indexOf(single) === -1) {
          config.gradeLevel.push(single);
        }
      });
    });

    return config;
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  setTelemetryStartData() {
    const telemetryCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    setTimeout(() => {
        this.telemetryStart = {
          context: {
            env: this.activatedRoute.snapshot.data.telemetry.env,
            cdata: telemetryCdata
          },
          edata: {
            type: this.activatedRoute.snapshot.data.telemetry.type || '',
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid || '',
            uaspec: {
              agent: deviceInfo.browser,
              ver: deviceInfo.browser_version,
              system: deviceInfo.os_version,
              platform: deviceInfo.os,
              raw: deviceInfo.userAgent
            }
          }
        };
    });
  }

  generateTelemetryEndEvent(eventMode) {
    const telemetryCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
    this.telemetryEnd = {
      object: {
        id: this.programId || '',
        type: this.activatedRoute.snapshot.data.telemetry.object.type,
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: telemetryCdata
      },
      edata: {
        type: this.configService.telemetryLabels.pageType.workflow,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        mode: eventMode || this.activatedRoute.snapshot.data.telemetry.mode,
        duration: _.toString((Date.now() - this.pageStartTime) / 1000)
      }
    };
    this.telemetryService.end(this.telemetryEnd);
  }

  public chooseChapters(collection) {
    if (!this.textbooks[collection.identifier]) {
      this.getCollectionHierarchy(collection.identifier);
    } else {
      this.choosedTextBook = this.textbooks[collection.identifier];
      this.initChaptersSelectionForm(this.choosedTextBook);
    }
    this.selectChapter = true;
  }

  public editBlueprint(collection) {
    if(!this.textbooks[collection.identifier]) {
      this.getCollectionHierarchy(collection.identifier);
    } else {
      this.choosedTextBook = this.textbooks[collection.identifier];
      this.initEditBlueprintForm(this.choosedTextBook);
    }
    this.editBlueprintFlag = true;
  }

  public totalQuestions() {
    let revisedTotalCount = 0;
    _.forEach(Object.keys(this.localBlueprint.questionTypes), (type: any) => {
      revisedTotalCount = revisedTotalCount + parseInt(this.localBlueprint.questionTypes[type]);
    });
    this.localBlueprint.totalQuestions  = revisedTotalCount;
    return revisedTotalCount;
  }

  public onChangeTopics() {
    this.blueprintTemplate.properties.forEach( (property) => {
      if (property.code === "learningOutcomes") {
        const topics = this.initTopicOptions.filter(e => ( _.includes(this.localBlueprint["topics"], e.identifier)));
        property.options = this.programsService.filterBlueprintMetadata(topics);
      }
    });
  }

  public mapBlueprintToId() {
    if(this.isBlueprintValid()) {
      this.localBlueprintMap[this.choosedTextBook.code] = this.localBlueprint;
      if (this.localBlueprintMap[this.choosedTextBook.code]["topics"]) {
        this.localBlueprintMap[this.choosedTextBook.code]["topics"] = this.initTopicOptions.filter(e => ( _.includes(this.localBlueprint["topics"], e.identifier)));
      }
      if (this.localBlueprintMap[this.choosedTextBook.code]["learningOutcomes"]) {
        this.localBlueprintMap[this.choosedTextBook.code]["learningOutcomes"] = this.initLearningOutcomeOptions.filter(e => (_.includes(this.localBlueprint["learningOutcomes"], e.identifier)));
      }
      this.editBlueprintFlag = false;
    } else {
      this.toasterService.error(this.resource.messages.emsg.blueprintViolation);
    }

  }

  initEditBlueprintForm(collection) {
    let frameworkDetails = _.get(this.programScope, 'selectedFramework');
    if (_.isArray(frameworkDetails)) {
      frameworkDetails = _.first(frameworkDetails);
    }
    const frameworkCategories = _.get(frameworkDetails, 'categories', []);
    [this.initTopicOptions, this.initLearningOutcomeOptions] = this.programsService.initializeBlueprintMetadata(this.choosedTextBook, frameworkCategories);
    let blueprint = {};
     this.blueprintTemplate.properties.forEach( (property) => {
      if (!property.default) {
          if (property.code === 'topics') {
            property.options = this.initTopicOptions;
          } else if (property.code === 'learningOutcomes') {
          property.options = this.initLearningOutcomeOptions;
          }
         blueprint[property.code] = [];
       }
       if (property.children) {
         blueprint[property.code] = {};
         property.children.forEach((nestedProperty) => {
           blueprint[property.code][nestedProperty.code] = property.default;
         });
       }
     });
     if (this.localBlueprintMap[this.choosedTextBook && this.choosedTextBook.code]) {
      this.localBlueprintMapDeepClone = _.cloneDeep(this.localBlueprintMap[this.choosedTextBook.code]);
      this.localBlueprint = this.localBlueprintMap[this.choosedTextBook.code];
      this.localBlueprint["topics"] = this.localBlueprint["topics"].map(e => e.identifier);
      this.localBlueprint["learningOutcomes"] = this.localBlueprint["learningOutcomes"].map(e => e.identifier);
      console.log(this.localBlueprintMap);
    } else {
        this.localBlueprint = blueprint;
    }

  }

  dismissedBluePrintModal () {
    if (this.localBlueprintMap[this.choosedTextBook && this.choosedTextBook.code] && this.localBlueprintMapDeepClone) {
      this.localBlueprintMap[this.choosedTextBook.code] = _.cloneDeep(this.localBlueprintMapDeepClone);
    }
    this.editBlueprintFlag = false;
  }

  isBlueprintValid() {
    let validity = true, totalQuestions = this.localBlueprint.totalQuestions;
    _.forEach(this.blueprintTemplate.properties, (prop) => {
      let val = this.localBlueprint[prop.code]
      if(prop.required) {
        if(!val) validity = false;
        else if(Array.isArray(val)) {
          if(!val.length) validity = false;
        }
        else if(typeof val === 'object') {
          if(_.reduce(val, (result, child, key) => {
            if(isNaN(parseFloat(child))) validity = false;
            else if(parseFloat(child) < 0) validity = false;
            result = result + parseInt(child);
            return result;
          }, 0) === 0) {
            validity = false;
          }
        }
      }
      if(prop.code === 'totalMarks') {
        if(val) {
          if(isNaN(parseFloat(val))) validity = false;
          else if(parseFloat(val) < 0) validity = false;
        }
      }
    })
    if(!totalQuestions) validity = false;
    else {
      if(isNaN(totalQuestions) && isNaN(parseFloat(totalQuestions))) validity = false;
    }
    return validity;
  }

  initChaptersSelectionForm(chapters) {
    let values = [];

    chapters.children.forEach((o, i) => {
      values.push(o.checked);
    });

    this.chaptersSelectionForm = this.sbFormBuilder.group({
      chaptersCtrl: this.sbFormBuilder.array(values)
    });

    this.getChapterLevelCount(chapters.children);
    this.btnDoneDisabled = false;
  }

  public getCollectionHierarchy(identifier: string) {
    return this.programsService.getHierarchyFromOrigin(identifier).subscribe(res => {
      const content = _.get(res, 'result.content');
      this.textbooks[identifier] = {};
      const chapter = {
        'id' : identifier,
        'children': [],
        'allowed_content_types' : []
      };

      let dcollection = {};

      if (!this.editPublished) {
        const draftCollections = _.get(this.programDetails, 'config.collections');
        if (!_.isEmpty(draftCollections)) {
          const dcindex = draftCollections.findIndex(x => x.id ===  identifier);
          if (dcindex !== -1) {
            dcollection = draftCollections[dcindex];
          }
        }
      }

      const cindex = this.tempCollections.findIndex(x => x.identifier === identifier);
      this.tempCollections[cindex]['selected'] = 0;
      this.tempCollections[cindex]['total']    = content.children.length;
      this.tempCollections[cindex]['contentTypeUnit'] = this.blueprintTemplate ? 'Section' : 'Chapter';

      _.forEach(content.children, (item) => {
        if (!_.isEmpty(_.get(dcollection, 'children'))) {
          if (_.get(dcollection, 'children').findIndex(x => x.id === item.identifier) !== -1) {
            item['checked'] = true;
            this.tempCollections[cindex]['selected']++;
          }
        } else {
          item['checked'] = true;
          this.tempCollections[cindex]['selected']++;
        }

        chapter.children.push({
          'id' : item.identifier,
          'allowed_content_types' : []
        });
      });

      this.textbooks[identifier] = content;
      this.choosedTextBook = content;
      this.initChaptersSelectionForm(this.choosedTextBook);
    }, error => console.log(console.error()
    ));
  }

  updateSelection(identifier) {
    let selectedCount = 0;
    const selectedChapters = _.get(this.chaptersSelectionForm.controls.chaptersCtrl, "controls");
    this.selectChapter = false;

    _.forEach(selectedChapters, (item, i) => {
      this.textbooks[identifier].children[i].checked = item.value;
      if (item.value === true) {
        selectedCount ++;
      }
    });

    const cindex = this.tempCollections.findIndex(x => x.identifier === identifier);
    this.tempCollections[cindex].selected = selectedCount;
  }

  getChapterLevelCount(collections) {
    const status = ['Live'];
    let createdBy, visibility;
    visibility = true;

    _.forEach(collections, collection => {
       let totalLeaf = 0;
       let contentTypes = [];
       let result = this.getContentCountPerFolder(collection , status , false, undefined, createdBy, visibility, totalLeaf, contentTypes);

       let contentTypeDisplayTxt = '';
       for (const property in result.contentTypes) {
        contentTypeDisplayTxt += `${result.contentTypes[property]}  ${property} `;
      }

      collection['totalLeaf'] = result.totalLeaf;
      collection['contentTypesText'] = contentTypeDisplayTxt;
    });
  }

  getContentCountPerFolder(collection, contentStatus?: string[], onlySample?: boolean, organisationId?: string, createdBy?: string, visibility?: boolean, totalLeaf?, contentTypes?) {
    const self = this;
    _.each(collection.children, child => {
      if (contentStatus.indexOf(child.status) !== -1) {
        ++totalLeaf;
        contentTypes.push(child.primaryCategory);
      }

      self.getContentCountPerFolder(child, contentStatus, onlySample, organisationId, createdBy, visibility, totalLeaf, contentTypes);
    });

    var counts = {};
    contentTypes.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

    return {"totalLeaf": totalLeaf, "contentTypes": counts};
  }

  onChangeSelection() {
    let selectedChapters = _.get(this.chaptersSelectionForm.controls.chaptersCtrl, "controls");

    if (selectedChapters.findIndex(o => o.value) == -1) {
      this.btnDoneDisabled = true;

      return false;
    }

    this.btnDoneDisabled = false;
  }

  saveAsDraft($event: MouseEvent) {
    this.removeFieldValidatorsForDraft();
    if (this.createProgramForm.valid) {
        ($event.target as HTMLButtonElement).disabled = true;
        const cb = (error, resp) => {
          if (!error && resp) {
            this.generateTelemetryEndEvent('save');
            this.toasterService.success(
              '<b>' + this.resource.messages.smsg.program.draft.heading + '</b>',
              this.resource.messages.smsg.program.draft.message);
            let tab = (this.projectTargetType === 'searchCriteria') ? 'noCollections' : 'collections';
            if(this.projectTargetType === 'questionSets') tab = 'questionSets';
            this.router.navigate(['/sourcing'],
              {queryParams: { targetType: tab }, queryParamsHandling: 'merge' });
          } else {
            const errInfo = {
              errorMsg: this.resource.messages.emsg.m0005,
              telemetryPageId: this.telemetryPageId,
              telemetryCdata : this.telemetryInteractCdata,
              env : this.activatedRoute.snapshot.data.telemetry.env,
            };
            this.sourcingService.apiErrorHandling(error, errInfo);
            ($event.target as HTMLButtonElement).disabled = false;
          }
        };
        this.saveProgram(cb);
      } else if (!this.createProgramForm.valid) {
        this.validateAllFormFields(this.createProgramForm);
        window.scrollTo(0,0);
        return false;
      }
  }

  saveAsDraftAndNext ($event) {
    this.removeFieldValidatorsForDraft();
    // If createProgramForm's contents have been changed and still that form is valid
    if ( this.createProgramForm.dirty && this.createProgramForm.valid ) {
        ($event.target as HTMLButtonElement).disabled = true;
        const cb = (error, resp) => {
          if (!error && resp) {
            this.navigateTo(2);
            ($event.target as HTMLButtonElement).disabled = false;
          } else {
            this.toasterService.error(this.resource.messages.emsg.m0005);
            ($event.target as HTMLButtonElement).disabled = false;
          }
        };
        this.saveProgram(cb);
      } else if (this.createProgramForm.valid) {
        this.navigateTo(2);
      } else {
        this.validateAllFormFields(this.createProgramForm);
        return false;
      }
  }

  validateFormBeforePublish() {
    this.setValidations();

    if (!this.createProgramForm.valid) {
      this.navigateTo(1);
      this.formIsInvalid = true;
      this.validateAllFormFields(this.createProgramForm);
      return false;
    }

    if (!this.projectScopeForm.valid) {
      this.formIsInvalid = true;
      this.validateAllFormFields(this.projectScopeForm);
      return false;
    }
    if (!this.helperService.validateForm(this.isValidFrameworkFields)) {
      this.toasterService.error(this.resource.messages.fmsg.m0101);
      return false;
    }
    if (this.validateDates() === true) {
      this.navigateTo(1);
      this.formIsInvalid = true;
      return false;
    }

    if (this.createProgramForm.value.type ==='restricted' && !this.selectedContributorsCnt) {
      this.navigateTo(1);
      this.toasterService.warning(this.resource.messages.smsg.selectOneContributor);
      return false;
    }

    if (_.includes(['collections','questionSets'], this.projectTargetType) && _.isEmpty(this.projectScopeForm.value.pcollections)) {
      this.disableCreateProgramBtn = false;
      this.toasterService.warning(this.resource.messages.smsg.selectOneTargetCollection);
      return false;
    }

    this.showPublishModal = true;
  }

  publishProject($event) {
    this.showPublishModal = false;
    this.disableCreateProgramBtn = true;

    ($event.target as HTMLButtonElement).disabled = true;
    const cb = (error, resp) => {
      if (!error && resp) {
        const data = {
          'request': {
            'program_id': this.programId,
            'channel': 'sunbird'
          }
        };

        if (_.includes(['public','restricted'], this.createProgramForm.value.type)) {
          this.programsService.publishProgram(data).subscribe(res => {
            this.generateTelemetryEndEvent('publish');
            this.toasterService.success(
              '<b>' + this.resource.messages.smsg.program.published.heading + '</b>',
              this.resource.messages.smsg.program.published.message);
              let tab = (this.projectTargetType === 'searchCriteria') ? 'noCollections' : 'collections';
              if(this.projectTargetType === 'questionSets') tab = 'questionSets';
              this.router.navigate(['/sourcing'],
                {queryParams: { targetType: tab }, queryParamsHandling: 'merge' });
          },
          err => {
            this.disableCreateProgramBtn = false;
            const errInfo = {
              errorMsg: this.resource.messages.emsg.m0005,
              telemetryPageId: this.telemetryPageId,
              telemetryCdata : this.telemetryInteractCdata,
              env : this.activatedRoute.snapshot.data.telemetry.env,
              request: data
            };
            this.sourcingService.apiErrorHandling(error, errInfo);
            console.log(err);
          });
        } else {
          this.programsService.unlistPublishProgram(data).subscribe(res => {
            this.toasterService.success(
              '<b>' + this.resource.messages.smsg.program.published.heading + '</b>',
              this.resource.messages.smsg.program.published.message);
              let tab = (this.projectTargetType === 'searchCriteria') ? 'noCollections' : 'collections';
              if(this.projectTargetType === 'questionSets') tab = 'questionSets';
              this.router.navigate(['/sourcing'],
                {queryParams: { targetType: tab }, queryParamsHandling: 'merge' });
          },
          err => {
            this.disableCreateProgramBtn = false;
            this.toasterService.error(this.resource.messages.emsg.m0005);
            console.log(err);
          });
        }

      } else {
        this.disableCreateProgramBtn = false;
        ($event.target as HTMLButtonElement).disabled = false;
        this.toasterService.error(this.resource.messages.emsg.m0005);
        const errInfo = {
          errorMsg: this.resource.messages.emsg.m0005,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      }
    };
    this.saveProgram(cb);
  }

  closeprojectTargetTypeModal() {
    this.projectTargetTypeModal.deny();
    this.openProjectTargetTypeModal = false;
    this.router.navigateByUrl('/sourcing');
  }

  setProjectTargetType() {
    if (!this.projectTargetForm.valid) {
      return false;
    } else {
      this.projectTargetType = this.projectTargetForm.value.target_type;
      // if (this.projectTargetType == 'searchCriteria') {
      //   this.initializeFormFields();
      // }
      this.openProjectTargetTypeModal = false;
    }
    if (this.projectTargetType === 'questionSets') {
      this.createProgramForm.patchValue({type: 'private'});
    }
  }

  openContributorListPopup() {
    this.showContributorsListModal = true;
  }
  closeContributorListPopup() {
    this.showContributorsListModal = false;
  }
  setAllowToModifyContributors(content_submission_enddate) {
    if(this.createProgramForm.value.type === 'restricted' && this.editPublished) {
      const today = moment(moment().format('YYYY-MM-DD'));
      const contentSubmissionEndDate = moment(content_submission_enddate);
      if (contentSubmissionEndDate.isBefore(today)) {
        this.allowToModifyContributors = false;
      }
      else {
        this.allowToModifyContributors = true;
      }
    }
  }
  setPreSelectedContributors(contributors) {
    const disabledContribOrg = this.editPublished ? _.get(this.programDetails, 'config.contributors.Org') : [];
    const disabledContribUser = this.editPublished ? _.get(this.programDetails, 'config.contributors.User') : [];

    if (_.get(contributors, 'Org') !== null) {
      this.selectedContributors.Org = _.get(contributors, 'Org');
      this.preSelectedContributors.Org = _.map(_.get(contributors, 'Org'), org => {
        return {
          ...org,
          osid: org.osid,
          isDisabled: !_.isEmpty(_.find(disabledContribOrg, { osid: org.osid }))
        }
      });
    }

    if (_.get(contributors, 'User') !== null) {
      this.selectedContributors.User = _.get(contributors, 'User');
      this.preSelectedContributors.User = _.map(_.get(contributors, 'User'), user => {
        return {
          ...user,
          osid: user.osid,
          isDisabled: !_.isEmpty(_.find(disabledContribUser, { osid: user.osid }))
        }
      });
    }

    this.selectedContributorsCnt = this.preSelectedContributors.Org.length + this.preSelectedContributors.User.length;
  }
  onContributorSave(contributors) {
    this.setPreSelectedContributors(contributors);
    this.closeContributorListPopup();
  }
  formStatusEventListener(event) {
    this.isValidFrameworkFields = event;
  }
  getFormData(event) {
    this.frameworkFormData = event;
  }

  duplicateQuestionSet(tempCollection) {
    this.sourcingService.duplicateQuestionSet({
      createdBy: this.userprofile.id,
      createdFor: [this.userprofile.id],
      name: tempCollection.name
    }, tempCollection.identifier)
      .subscribe((response) => {
        const nodeId = _.get(response, 'result.node_id');
        if (nodeId) {
          const pcollectionIds = this.projectScopeForm.value.pcollections;
          pcollectionIds.push(nodeId[tempCollection.identifier]);
          this.projectScopeForm.patchValue({pcollections: pcollectionIds});
          if (!this.programDetails.config.collections) {
            this.programDetails.config.collections = [];
          }
          this.programDetails.config.collections.push({
            allowed_content_types: [],
            children: [],
            id: nodeId[tempCollection.identifier],
          });
          setTimeout(() => {
            this.showTexbooklist();
          }, 2000);
        }
      });
  }
  isSendReminderChanged($event){
    this.isSendReminderEnabled = $event.target.checked;
  }
}
