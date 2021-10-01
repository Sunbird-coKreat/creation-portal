import {
  ConfigService, ResourceService, ToasterService, RouterNavigationService,
  ServerResponse, NavigationHelperService
} from '@sunbird/shared';
import { FineUploader } from 'fine-uploader';
import { ProgramsService, DataService, FrameworkService, ActionService } from '@sunbird/core';
import { Subscription, Subject, throwError, Observable } from 'rxjs';
import { tap, first, map, takeUntil, catchError, count, isEmpty } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray, FormGroupName } from '@angular/forms';
import { SourcingService } from './../../../sourcing/services';
import { UserService } from '@sunbird/core';
import { programConfigObj } from './programconfig';
import { HttpClient } from '@angular/common/http';
import { IImpressionEventInput, IInteractEventEdata, IStartEventInput, IEndEventInput, TelemetryService } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment';
import * as alphaNumSort from 'alphanum-sort';
import { ProgramTelemetryService } from '../../services';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss', './../../../sourcing/components/ckeditor-tool/ckeditor-tool.component.scss']
})

export class CreateProgramComponent implements OnInit, AfterViewInit {
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  public unsubscribe = new Subject<void>();
  public programId: string;
  public guidLinefileName: String;
  public isFormValueSet = false;
  public editPublished = false;
  callTargetCollection =false;
  public choosedTextBook: any;
  selectChapter = false;
  editBlueprintFlag = false;
  public selectedTargetCategories: any;
  public selectedTargetCollection: any;
  createProgramForm: FormGroup;
  collectionListForm: FormGroup;
  programDetails: any;
  public resourceService: ResourceService;
  public routerNavigationService: RouterNavigationService;
  collections;
  tempCollections = [];
  collectionCategories = [];
  showProgramScope: any;
  textbooks: any = {};
  chaptersSelectionForm : FormGroup;
  private userFramework;
  private userBoard;
  frameworkCategories;
  programScope: any = {};
  originalProgramScope: any = {};
  userprofile;
  public programData: any = {};
  showTextBookSelector = false;
  formIsInvalid = false;
  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  pickerMinDateForEndDate = new Date(new Date().setHours(0, 0, 0, 0));
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
  public showContributorsListModal = false;
  uploadedDocument;
  showAddButton = false;
  loading = false;
  isClosable = true;
  uploader;
  acceptPdfType: any;
  errorMsg: string;
  showErrorMsg = false;
  assetConfig: any = this.configService.contentCategoryConfig.sourcingConfig.asset;
  localBlueprintMap: any;
  projectType: String = "public";
  public programConfig: any;
  public localBlueprint: any;
  public blueprintTemplate: any;
  public disableCreateProgramBtn = false;
  public showLoader = true;
  public btnDoneDisabled = false;
  public telemetryPageId: string;
  private pageStartTime: any;
  public enableQuestionSetEditor: string;
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
  public firstLevelFolderLabel: string;
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
    private sbFormBuilder: FormBuilder,
    private httpClient: HttpClient,
    private navigationHelperService: NavigationHelperService,
    public configService: ConfigService,
    private deviceDetectorService: DeviceDetectorService,
    public programTelemetryService: ProgramTelemetryService,
    public actionService: ActionService, public cacheService: CacheService) {
  }

  ngOnInit() {
    this.enableQuestionSetEditor = (<HTMLInputElement>document.getElementById('enableQuestionSetEditor'))
      ? (<HTMLInputElement>document.getElementById('enableQuestionSetEditor')).value : 'false';
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.userprofile = this.userService.userProfile;
    this.programConfig = _.cloneDeep(programConfigObj);
    this.localBlueprint = {};
    this.localBlueprintMap = {};
    this.telemetryInteractCdata = [{id: this.userService.channel || '', type: 'sourcing_organization'}];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.getPageId();
    this.acceptPdfType = this.getAcceptType(this.assetConfig.pdfFiles, 'pdf');
    // get target collection in dropdown
    if (!_.isEmpty(this.programId)) {
      this.telemetryInteractCdata = [...this.telemetryInteractCdata, {id: this.programId, type: 'project'}];
      this.getProgramDetails();
    } else {
      this.initializeFormFields();
      this.fetchFrameWorkDetails();
    }
    this.setTelemetryStartData();
    this.pageStartTime = Date.now();
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
        acceptFiles: this.acceptPdfType,
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
    this.showErrorMsg = false;
    if (!this.showErrorMsg) {
      const req = this.generateAssetCreateRequest(this.uploader.getName(0), this.uploader.getFile(0).type, 'pdf');
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
          const config = {
            processData: false,
            contentType: 'Asset',
            headers: {
              'x-ms-blob-type': 'BlockBlob'
            }
          };
          this.uploadToBlob(signedURL, this.uploader.getFile(0), config).subscribe(() => {
            const fileURL = signedURL.split('?')[0];
            this.updateContentWithURL(fileURL, this.uploader.getFile(0).type, contentId);
          });
        });
      });
    }
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

  openContributorListPopup() {
    this.showContributorsListModal = true;
  }

  closeContributorListPopup() {
    this.showContributorsListModal = false;
  }

  getProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    this.programsService.get(req).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');

      //this.selectedContentTypes = _.get(this.programDetails, 'content_types');
      //this.programDetails['content_types'] = _.join(this.selectedContentTypes, ', ');

      // tslint:disable-next-line: max-line-length
      this.selectedTargetCollection = !_.isEmpty(_.get(this.programDetails, 'target_collection_category')) ? _.get(this.programDetails, 'target_collection_category')[0] : 'Digital Textbook';
      if (!_.isEmpty(this.programDetails.guidelines_url)) {
        this.guidLinefileName = this.programDetails.guidelines_url.split("/").pop();
      }
      this.initializeFormFields();
      this.fetchFrameWorkDetails();
    }, error => {
      this.showLoader = false;
      const errInfo = {
        errorMsg:  'Fetching program details failed',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: req
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
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
      this.showAddButton = true;
      this.uploadedDocument = res;
      this.showDocumentUploader = false;
    });
  }

  removeUploadedDocument() {
    this.uploadedDocument = null;
    this.guidLinefileName = null;
    this.programDetails.guidelines_url = null;
  }

  generateAssetCreateRequest(fileName, fileType, mediaType) {
    return {
      content: {
        name: fileName,
        mediaType: mediaType,
        mimeType: fileType,
        createdBy: this.userprofile.userId,
        creator: `${this.userprofile.firstName} ${this.userprofile.lastName ? this.userprofile.lastName : ''}`,
        channel: 'sunbird'
      }
    };
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
          return this.createProgramForm.value.shortlisting_enddate;
        }
      }

      if (date === 'shortlisting_enddate') {
        if (this.createProgramForm.value.content_submission_enddate) {
          return this.createProgramForm.value.content_submission_enddate;
        }
      }

      return this.createProgramForm.value.program_end_date;
    }
    return '';
  }

  getMinDate(date) {
    if (date === 'shortlisting_enddate') {
      if (this.createProgramForm.value.nomination_enddate) {
        return this.createProgramForm.value.nomination_enddate;
      }
    }

    if (date === 'content_submission_enddate') {
      if (this.createProgramForm.value.shortlisting_enddate) {
        return this.createProgramForm.value.shortlisting_enddate;
      }

      if (this.createProgramForm.value.nomination_enddate) {
        return this.createProgramForm.value.nomination_enddate;
      }
    }

    if (date === 'program_end_date') {
      if (this.createProgramForm.value.content_submission_enddate) {
        return this.createProgramForm.value.content_submission_enddate;
      }

      if (this.createProgramForm.value.shortlisting_enddate) {
        return this.createProgramForm.value.shortlisting_enddate;
      }

      if (this.createProgramForm.value.nomination_enddate) {
        return this.createProgramForm.value.nomination_enddate;
      }
    }

    if (!this.editPublished) {
      return this.pickerMinDate;
    } else {
      return this.createProgramForm.value.nomination_enddate;
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

  fetchFrameWorkDetails() {
    this.frameworkService.readFramworkCategories().subscribe((frameworkInfo: any) => {
      if (frameworkInfo) {
        this.userFramework = frameworkInfo.identifier;
        this.frameworkCategories = frameworkInfo.categories;
      }
      this.setFrameworkDataToProgram();
    });
    this.setCategoriesFromChannel();
  }

  setProjectType(type) {
    this.projectType = type;
    if (type === 'public') {
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

  onContributorSave(contributors) {
    this.setPreSelectedContributors(contributors);
    this.closeContributorListPopup();
  }

  setCategoriesFromChannel() {
    const channelData$ = this.frameworkService.readChannel();
    channelData$.subscribe((channelData) => {
      if (channelData) {
        this.collectionCategories = _.get(channelData, 'collectionPrimaryCategories');
        const channelCats = _.get(channelData, 'primaryCategories');
        this.programScope['targetPrimaryCategories'] = [];
        const channeltargetObjectTypeGroup = _.groupBy(channelCats, 'targetObjectType');
        if (_.toLower(this.enableQuestionSetEditor) === 'true') {
          const questionSetCategories = _.get(channeltargetObjectTypeGroup, 'QuestionSet');
          this.programScope['targetPrimaryCategories']  = _.map(questionSetCategories, 'name');
          this.programScope['targetPrimaryObjects'] = questionSetCategories;
        }
        const contentCategories = _.get(channeltargetObjectTypeGroup, 'Content');
        // tslint:disable-next-line:max-line-length
        this.programScope['targetPrimaryObjects'] =  _.concat(this.programScope['targetPrimaryObjects'] || [], _.filter(contentCategories, (o) => {
          if (!_.includes(this.programScope['targetPrimaryCategories'], o.name)) {
            this.programScope['targetPrimaryCategories'].push(o.name);
            return o;
          }
        }));

        // tslint:disable-next-line:max-line-length
        this.programScope['selectedTargetCategoryObjects'] = (this.programDetails) ? this.programsService.getProgramTargetPrimaryCategories(this.programDetails, channelCats) : [];
        this.selectedTargetCategories = _.map(this.programScope['selectedTargetCategoryObjects'], 'name');
      }
    });
  }
  setFrameworkDataToProgram() {
    this.programScope['medium'] = [];
    this.programScope['gradeLevel'] = [];
    this.programScope['subject'] = [];

    if (this.collectionListForm) {
      this.collectionListForm.controls['medium'].setValue('');
      this.collectionListForm.controls['gradeLevel'].setValue('');
      this.collectionListForm.controls['subject'].setValue('');
    }

    const board = _.find(this.frameworkCategories, (element) => {
      return element.code === 'board';
    });
    if (board) {
      if (!_.isEmpty(board.terms[0].name)) {
        this.userBoard = board.terms[0].name;
      } else if (_.get(this.userprofile.framework, 'board')) {
        this.userBoard = this.userprofile.framework.board[0];
      }

      const mediumOption = this.programsService.getAssociationData(board.terms, 'medium', this.frameworkCategories);
      if (mediumOption.length) {
        this.programScope['medium'] = mediumOption;
      }
    }

    this.frameworkCategories.forEach((element) => {
      const sortedArray = alphaNumSort(_.reduce(element['terms'], (result, value) => {
        result.push(value['name']);
        return result;
      }, []));
      const sortedTermsArray = _.map(sortedArray, (name) => {
        return _.find(element['terms'], { name: name });
      });
      this.programScope[element['code']] = sortedTermsArray;
      this.originalProgramScope[element['code']] = sortedTermsArray;
    });

    const Kindergarten = _.remove(this.programScope['gradeLevel'], (item) => {
      return item.name === 'Kindergarten';
    });
    this.programScope['gradeLevel'] = [...Kindergarten, ...this.programScope['gradeLevel']];
  }

  onMediumChange() {
    this.collectionListForm.controls['gradeLevel'].setValue('');
    this.collectionListForm.controls['subject'].setValue('');

    if (!_.isEmpty(this.collectionListForm.value.medium)) {
      // tslint:disable-next-line: max-line-length
      const classOption = this.programsService.getAssociationData(this.collectionListForm.value.medium, 'gradeLevel', this.frameworkCategories);

      if (classOption.length) {
        this.programScope['gradeLevel'] = classOption;
      }

      this.onClassChange();
    } else {
      this.programScope['gradeLevel'] = this.originalProgramScope['gradeLevel'];
    }
  }

  onClassChange() {
    this.collectionListForm.controls['subject'].setValue('');

    if (!_.isEmpty(this.collectionListForm.value.gradeLevel)) {
      // tslint:disable-next-line: max-line-length
      const subjectOption = this.programsService.getAssociationData(this.collectionListForm.value.gradeLevel, 'subject', this.frameworkCategories);

      if (subjectOption.length) {
        this.programScope['subject'] = subjectOption;
      }
    } else {
      this.programScope['subject'] = this.originalProgramScope['subject'];
    }
  }

  getCollectionCategoryDefinition() {
    if (this.selectedTargetCollection && this.userprofile.rootOrgId) {
      this.programsService.getCategoryDefinition(this.selectedTargetCollection, this.userprofile.rootOrgId, 'Collection').subscribe(res => {
        const objectCategoryDefinition = res.result.objectCategoryDefinition;
        if (objectCategoryDefinition && objectCategoryDefinition.forms) {
          this.blueprintTemplate = objectCategoryDefinition.forms.blueprintCreate;
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

  /**
   * Executed when user come from any other page or directly hit the url
   *
   * It helps to initialize form fields and apply field level validation
   */
  initializeFormFields(): void {
    this.createProgramForm = this.sbFormBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      nomination_enddate: [null, Validators.required],
      shortlisting_enddate: [null],
      program_end_date: [null, Validators.required],
      content_submission_enddate: [null, Validators.required],
      rewards: [],
      defaultContributeOrgReview: [true]
    });
    this.collectionListForm = this.sbFormBuilder.group({
      pcollections: this.sbFormBuilder.array([]),
      medium: [],
      gradeLevel: [],
      subject: [],
      targetPrimaryCategories: [null, Validators.required],
      target_collection_category: [null, Validators.required],
    });
    if (!_.isEmpty(this.programDetails) && !_.isEmpty(this.programId)) {
      this.projectType = _.get(this.programDetails, 'type') || 'public';
      if (_.get(this.programDetails, 'status') === 'Live' || _.get(this.programDetails, 'status') === 'Unlisted') {
        this.disableUpload = (_.get(this.programDetails, 'guidelines_url')) ? true : false;
        this.editPublished = true;
      }
      this.collectionListForm.controls['target_collection_category'].setValue(this.selectedTargetCollection);

      const obj = {
        name: [_.get(this.programDetails, 'name'), [Validators.required, Validators.maxLength(100)]],
        description: [_.get(this.programDetails, 'description'), Validators.maxLength(1000)],
        nomination_enddate : [null],
        // tslint:disable-next-line: max-line-length
        shortlisting_enddate: [_.get(this.programDetails, 'shortlisting_enddate') ? new Date(_.get(this.programDetails, 'shortlisting_enddate')) : null],
        // tslint:disable-next-line: max-line-length
        program_end_date: [_.get(this.programDetails, 'enddate') ? new Date(_.get(this.programDetails, 'enddate')) : null, Validators.required],
        // tslint:disable-next-line: max-line-length
        content_submission_enddate: [_.get(this.programDetails, 'content_submission_enddate') ? new Date(_.get(this.programDetails, 'content_submission_enddate')) : null, Validators.required],
        // tslint:disable-next-line: max-line-length
        rewards: [_.get(this.programDetails, 'rewards')],
        // tslint:disable-next-line: max-line-length
        defaultContributeOrgReview: new FormControl({ value: _.get(this.programDetails, 'config.defaultContributeOrgReview'), disabled: this.editPublished })
      };

      if (this.projectType === 'public') {
        // tslint:disable-next-line: max-line-length
        obj.nomination_enddate = [_.get(this.programDetails, 'nomination_enddate') ? new Date(_.get(this.programDetails, 'nomination_enddate')) : null, Validators.required];
      } else {
        // tslint:disable-next-line: max-line-length
        obj.nomination_enddate = [_.get(this.programDetails, 'nomination_enddate') ? new Date(_.get(this.programDetails, 'nomination_enddate')) : null];
      }
      this.createProgramForm = this.sbFormBuilder.group(obj);
      this.defaultContributeOrgReviewChecked = _.get(this.programDetails, 'config.defaultContributeOrgReview') ? false : true;
      this.getCollectionCategoryDefinition();
      this.showProgramScope = false;
      this.showTextBookSelector = false;

      if (!_.isEmpty(_.get(this.programDetails, 'config.contributors'))) {
        this.setPreSelectedContributors(_.get(this.programDetails, 'config.contributors'));
      }

      this.createProgramForm.get('content_submission_enddate').valueChanges.subscribe(value => {
        this.setAllowToModifyContributors(value);
      });
      this.setAllowToModifyContributors(_.get(this.programDetails, 'content_submission_enddate'));
    }

    this.showLoader = false;
    this.isFormValueSet = true;
  }

  setAllowToModifyContributors(content_submission_enddate) {
    if(this.projectType === 'restricted' && this.editPublished) {
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
          osid: org.osid,
          isDisabled: !_.isEmpty(_.find(disabledContribOrg, { osid: org.osid }))
        }
      });
    }

    if (_.get(contributors, 'User') !== null) {
      this.selectedContributors.User = _.get(contributors, 'User');
      this.preSelectedContributors.User = _.map(_.get(contributors, 'User'), user => {
        return {
          osid: user.osid,
          isDisabled: !_.isEmpty(_.find(disabledContribUser, { osid: user.osid }))
        }
      });
    }

    this.selectedContributorsCnt = this.preSelectedContributors.Org.length + this.preSelectedContributors.User.length;
  }

  saveProgramError(err) {
    console.log(err);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched();
    });
  }

  navigateTo(stepNo) {
    window.scrollTo(0,0);
    this.showTextBookSelector = false;
  }

  validateDates() {
    let hasError = false;
    const formData = this.createProgramForm.value;
    const nominationEndDate = moment(formData.nomination_enddate);
    const contentSubmissionEndDate = moment(formData.content_submission_enddate);
    const programEndDate = moment(formData.program_end_date);
    const today = moment(moment().format('YYYY-MM-DD'));

    if (this.projectType === 'public') {
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

  resetFilters() {
    this.filterApplied = false;
    this.resetSorting();
    this.collectionListForm.controls['medium'].setValue('');
    this.collectionListForm.controls['gradeLevel'].setValue('');
    this.collectionListForm.controls['subject'].setValue('');
    this.showTexbooklist(true);
  }

  defaultContributeOrgReviewChanged($event) {
    this.createProgramForm.value.defaultContributeOrgReview = !$event.target.checked;
    this.defaultContributeOrgReviewChecked = $event.target.checked;
  }

  setValidations() {
    this.setProjectType(this.projectType);
    this.createProgramForm.controls['description'].setValidators(Validators.required);
    this.createProgramForm.controls['description'].updateValueAndValidity();
    this.createProgramForm.controls['program_end_date'].setValidators(Validators.required);
    this.createProgramForm.controls['program_end_date'].updateValueAndValidity();
    this.createProgramForm.controls['content_submission_enddate'].setValidators(Validators.required);
    this.createProgramForm.controls['content_submission_enddate'].updateValueAndValidity();
    this.collectionListForm.controls['targetPrimaryCategories'].setValidators(Validators.required);
    this.collectionListForm.controls['targetPrimaryCategories'].updateValueAndValidity();
    this.collectionListForm.controls['target_collection_category'].setValidators(Validators.required);
    this.collectionListForm.controls['target_collection_category'].updateValueAndValidity();
  }

  clearValidations() {
    this.createProgramForm.controls['nomination_enddate'].clearValidators();
    this.createProgramForm.controls['nomination_enddate'].updateValueAndValidity();
    this.createProgramForm.controls['description'].clearValidators();
    this.createProgramForm.controls['description'].updateValueAndValidity();
    this.createProgramForm.controls['program_end_date'].clearValidators();
    this.createProgramForm.controls['program_end_date'].updateValueAndValidity();
    this.createProgramForm.controls['content_submission_enddate'].clearValidators();
    this.createProgramForm.controls['content_submission_enddate'].updateValueAndValidity();
    this.collectionListForm.controls['targetPrimaryCategories'].clearValidators();
    this.collectionListForm.controls['targetPrimaryCategories'].updateValueAndValidity();
    this.collectionListForm.controls['target_collection_category'].clearValidators();
    this.collectionListForm.controls['target_collection_category'].updateValueAndValidity();
  }

  saveProgram(cb) {
    this.programData = {
      ...this.createProgramForm.value
    };

    if (this.userFramework) {
      this.programConfig.framework = this.userFramework;
      // tslint:disable-next-line:max-line-length
      _.find(_.find(this.programConfig.components, { id: 'ng.sunbird.collection' }).config.filters.implicit, { code: 'framework' }).defaultValue = this.userFramework;
    }
    this.programData['target_collection_category'] = [this.collectionListForm.value.target_collection_category];
    // tslint:disable-next-line: max-line-length
    _.find(_.find(this.programConfig.components, { id: 'ng.sunbird.collection' }).config.filters.implicit, { code: 'board' }).defaultValue = this.userBoard;

    this.programConfig.defaultContributeOrgReview = !this.defaultContributeOrgReviewChecked;
    this.programData['content_types']  = [];

    this.programData['targetprimarycategories'] = _.filter(this.programScope['targetPrimaryObjects'], (o) => {
      if (_.includes(this.selectedTargetCategories, o.name)) {
        return o;
      }
    });

    if (this.projectType === 'restricted') {
      this.programConfig['contributors'] = this.selectedContributors;
    }

    this.programData['sourcing_org_name'] = this.userprofile.rootOrg.orgName;
    this.programData['rootorg_id'] = this.userprofile.rootOrgId;
    this.programData['createdby'] = this.userprofile.id;
    this.programData['createdon'] = new Date();
    this.programData['startdate'] = new Date();
    this.programData['slug'] = 'sunbird';
    this.programData['type'] = this.projectType;
    this.programData['default_roles'] = ['CONTRIBUTOR'];
    this.programData['enddate'] = this.programData.program_end_date;
    // tslint:disable-next-line: max-line-length
    this.programData['guidelines_url'] = (this.uploadedDocument) ? _.get(this.uploadedDocument, 'artifactUrl') : _.get(this.programDetails, 'guidelines_url');
    this.programData['status'] = this.editPublished ? 'Live' : 'Draft';

    if (!this.programData['nomination_enddate']) {
      this.programData['nomination_enddate']= null;
    } else {
      this.programData['nomination_enddate'].setHours(23,59,59);
    }

    if (!this.programData['shortlisting_enddate']) {
      this.programData['shortlisting_enddate'] = null;
    } else {
      this.programData['shortlisting_enddate'].setHours(23,59,59);
    }

    if (!this.programData['enddate']) {
      this.programData['enddate'] = null;
    } else {
      this.programData['enddate'].setHours(23,59,59);
    }

    if (!this.programData['content_submission_enddate']) {
      this.programData['content_submission_enddate'] = null;
    } else {
      this.programData['content_submission_enddate'].setHours(23,59,59);
    }

    if (!this.programConfig['blueprintMap']) {
      this.programConfig['blueprintMap'] = this.localBlueprintMap;
    }

    delete this.programData.defaultContributeOrgReview;
    delete this.programData.gradeLevel;
    delete this.programData.medium;
    delete this.programData.subject;
    delete this.programData.program_end_date;
    this.programData['program_id'] = '';

    if (!this.programId) {
      this.programData['config'] = this.programConfig;
      this.programsService.createProgram(this.programData).subscribe(
        (res) => {
          this.programId = res.result.program_id;
          this.programData['program_id'] = this.programId;
          cb(null, res);
        },
        (err) => {
          cb(err, null);
          this.saveProgramError(err);
        }
      );
    } else {
      if (!this.editPublished) {
        this.programData['collection_ids'] = [];
        if (!_.isEmpty(this.collectionListForm.value.pcollections)) {
          const config = this.addCollectionsDataToConfig();
          this.programConfig['framework'] = config.framework;
          this.programConfig['board'] = config.board;
          this.programConfig['gradeLevel'] = config.gradeLevel;
          this.programConfig['medium'] = config.medium;
          this.programConfig['subject'] = config.subject;
          this.programConfig['collections'] = this.getCollections();
          _.forEach(this.collectionListForm.value.pcollections, item => {
            this.programData['collection_ids'].push(item.id);
          });
        }
      }

      this.programData['config'] = this.programConfig;
      this.programData['program_id'] = this.programId;
      this.programsService.updateProgram(this.programData).subscribe(
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

      prgData['enddate'] = prgData.program_end_date;
      prgData['program_id'] = this.programId;
      // tslint:disable-next-line: max-line-length
      prgData['guidelines_url'] = (this.uploadedDocument) ? this.uploadedDocument.artifactUrl : _.get(this.programDetails, 'guidelines_url');

      delete prgData.program_end_date;
      delete prgData.targetPrimaryCategories;

      if (this.projectType === 'private' || this.projectType === 'restricted') {
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

      if (this.projectType === 'restricted') {
        prgData['config'] = _.get(this.programDetails, 'config');
        prgData.config['contributors'] = this.selectedContributors;
      }

      this.programsService.updateProgram(prgData).subscribe(
        (res) => {
          this.generateTelemetryEndEvent('update');
          this.toasterService.success(this.resource.messages.smsg.modify.m0001);
          this.router.navigate(['/sourcing']);
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
onChangeTargetCollection() {
    this.showTexbooklist(true);
    this.collectionListForm.value.pcollections = [];
    this.getCollectionCategoryDefinition();
    this.tempCollections = [];
}
showTexbooklist(showTextBookSelector = true) {
    const primaryCategory = this.collectionListForm.value.target_collection_category;
    if (!primaryCategory) {
      return;
    }
    // for scrolling window to top after Next button navigation
    const requestData = {
      request: {
        filters: {
          objectType: 'Collection',
          status: ['Draft'],
          primaryCategory: primaryCategory,
          channel: this.userprofile.rootOrgId,
        },
        limit: 1000,
        not_exists: ['programId']
      }
    };

    if (!_.isEmpty(this.collectionListForm.value.medium)) {
      this.filterApplied = true;
      requestData.request.filters['medium'] = [];
      _.forEach(this.collectionListForm.value.medium, (medium) => {
        requestData.request.filters['medium'].push(medium.name);
      });
    }

    if (!_.isEmpty(this.collectionListForm.value.gradeLevel)) {
      this.filterApplied = true;
      requestData.request.filters['gradeLevel'] = [];
      _.forEach(this.collectionListForm.value.gradeLevel, (gradeLevel) => {
        requestData.request.filters['gradeLevel'].push(gradeLevel.name);
      });
    }

    if (!_.isEmpty(this.collectionListForm.value.subject)) {
      this.filterApplied = true;
      requestData.request.filters['subject'] = this.collectionListForm.value.subject;
    }

    return this.programsService.getCollectionList(requestData).subscribe(
      (res) => {
        this.showTextBookSelector = showTextBookSelector;
        if (res.result.count) {
          this.collections = res.result.content;
          this.showProgramScope = true;
          this.tempSortCollections = this.collections;
          if (!this.filterApplied) {
            this.sortCollection(this.sortColumn);
          }

          if (!this.editPublished) {
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
          }
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

  onCollectionCheck(collection, isChecked: boolean) {
    const pcollectionsFormArray = <FormArray>this.collectionListForm.controls.pcollections;
    const collectionId = collection.identifier;

    if (isChecked) {
      const controls = _.get(pcollectionsFormArray, 'controls');
      if (controls.findIndex(c => c.value === collection.identifier) === -1) {
        pcollectionsFormArray.push(new FormControl(collectionId));
        this.tempCollections.push(collection);

        if (!this.textbooks[collectionId]) {
          this.getCollectionHierarchy(collectionId);
        }
      }
    } else {
      const index = pcollectionsFormArray.controls.findIndex(x => x.value === collectionId);
      pcollectionsFormArray.removeAt(index);

      const cindex = this.tempCollections.findIndex(x => x.identifier === collectionId);
      this.tempCollections.splice(cindex, 1);
      delete this.textbooks[collectionId];
    }
  }

  getCollections() {
    const collections = [];

    _.forEach(this.collectionListForm.value.pcollections, (identifier) => {
      const obj = {
        'id' : identifier,
        'allowed_content_types': [],
        'children': []
      };

      _.forEach(this.textbooks[identifier].children, (item) => {
        if (item.checked === true) {
          obj.children.push({
            'id': item.identifier,
            'allowed_content_types': []
          });
        }
      });

      collections.push(obj);
    });

    return collections;
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
      if(property.code === "learningOutcomes") property.options = this.programsService.filterBlueprintMetadata(this.localBlueprint.topics);
    })
  }

  public mapBlueprintToId() {
    if(this.isBlueprintValid()) {
      this.localBlueprintMap[this.choosedTextBook.code] = this.localBlueprint;
      this.editBlueprintFlag = false;
    }
    else {
      this.toasterService.error(this.resource.messages.emsg.blueprintViolation);
    }

  }

  initEditBlueprintForm(collection) {
   [this.initTopicOptions, this.initLearningOutcomeOptions] = this.programsService.initializeBlueprintMetadata(this.choosedTextBook, this.frameworkCategories);
   let blueprint = {};
    this.blueprintTemplate.properties.forEach( (property) => {
      if(!property.default) {
        if(property.code === 'topics') property.options = this.initTopicOptions;
        else if(property.code === 'learningOutcomes') property.options = this.initLearningOutcomeOptions;
        blueprint[property.code] = [];
      }
      if(property.children) {
        blueprint[property.code] = {};
        property.children.forEach((nestedProperty) => {
          blueprint[property.code][nestedProperty.code] = property.default;
        })
      }
    })
    if(this.localBlueprintMap[this.choosedTextBook && this.choosedTextBook.code]) {
      this.localBlueprint = this.localBlueprintMap[this.choosedTextBook.code]
    }
    else this.localBlueprint = blueprint;

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
    const hierarchyUrl = '/action/content/v3/hierarchy/' + identifier + '?mode=edit';
    const originUrl = this.programsService.getContentOriginEnvironment();
    const url =  originUrl + hierarchyUrl ;

    return this.httpClient.get(url).subscribe(res => {
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
    this.clearValidations();
    if (this.createProgramForm.valid) {
        ($event.target as HTMLButtonElement).disabled = true;
        const cb = (error, resp) => {
          if (!error && resp) {
            this.generateTelemetryEndEvent('save');
            this.toasterService.success(
              '<b>' + this.resource.messages.smsg.program.draft.heading + '</b>',
              this.resource.messages.smsg.program.draft.message);
            this.router.navigate(['/sourcing']);
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
        this.formIsInvalid = true;
        this.validateAllFormFields(this.createProgramForm);
        return false;
      }
  }

  saveAsDraftAndNext ($event) {
    this.clearValidations();

    if ((this.createProgramForm.dirty
      || !_.isUndefined(this.uploadedDocument))
      && this.createProgramForm.valid) {
        ($event.target as HTMLButtonElement).disabled = true;

        const cb = (error, resp) => {
          if (!error && resp) {
            this.showTextBookSelector = true;
            window.scrollTo(0,0);
            this.showTexbooklist();
            ($event.target as HTMLButtonElement).disabled = false;
          } else {
            this.toasterService.error(this.resource.messages.emsg.m0005);
            ($event.target as HTMLButtonElement).disabled = false;
          }
        };

        this.saveProgram(cb);
      } else if (this.createProgramForm.valid) {
        this.showTextBookSelector = true;
        this.showTexbooklist();
        window.scrollTo(0,0);
      } else {
        this.formIsInvalid = true;
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
    if (!this.collectionListForm.valid) {
      this.formIsInvalid = true;
      this.validateAllFormFields(this.collectionListForm);
      return false;
    }
    if (this.validateDates() === true) {
      this.navigateTo(1);
      this.formIsInvalid = true;
      return false;
    }

    if (this.projectType ==='restricted' && !this.selectedContributorsCnt) {
      this.navigateTo(1);
      this.toasterService.warning(this.resource.messages.smsg.selectOneContributor);
      return false;
    }

    if (_.isEmpty(this.collectionListForm.value.pcollections)) {
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

        if (this.projectType === 'public' || this.projectType === 'restricted') {
          this.programsService.publishProgram(data).subscribe(res => {
            this.generateTelemetryEndEvent('publish');
            this.toasterService.success(
              '<b>' + this.resource.messages.smsg.program.published.heading + '</b>',
              this.resource.messages.smsg.program.published.message);
            this.router.navigate(['/sourcing']);
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
            this.router.navigate(['/sourcing']);
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
}
