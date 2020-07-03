import {
  ConfigService, ResourceService, ToasterService, RouterNavigationService,
  ServerResponse, NavigationHelperService
} from '@sunbird/shared';
import { FineUploader } from 'fine-uploader';
import { ProgramsService, DataService, FrameworkService } from '@sunbird/core';
import { Subscription, Subject, throwError, Observable } from 'rxjs';
import { tap, first, map, takeUntil, catchError } from 'rxjs/operators';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup, FormArray, FormGroupName } from '@angular/forms';
import { IProgram } from './../../../core/interfaces';
import { CbseProgramService } from './../../../cbse-program/services';
import { UserService } from '@sunbird/core';
import { programConfigObj } from './programconfig';
import { HttpClient } from '@angular/common/http';
import { IImpressionEventInput, IInteractEventEdata, IStartEventInput, IEndEventInput } from '@sunbird/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment';
import * as alphaNumSort from 'alphanum-sort';
import { ProgramTelemetryService } from '../../services';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss', './../../../cbse-program/components/ckeditor-tool/ckeditor-tool.component.scss']
})

export class CreateProgramComponent implements OnInit, AfterViewInit {
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  public unsubscribe = new Subject<void>();
  public programId: string;
  public guidLinefileName: String;
  public isFormValueSet = false;
  public editMode = false;
  /**
   * Program creation form name
   */
  createProgramForm: FormGroup;
  collectionListForm: FormGroup;

  /**
   * Contains Program form data
   */
  programDetails: any;


  /**
  * To call resource service which helps to use language constant
  */
  public resourceService: ResourceService;

  /**
  * To navigate back to parent component
  */
  public routerNavigationService: RouterNavigationService;

  /**
  * List of textbooks for the program by BMGC
  */
  collections;
  tempCollections = [];
  /**
  * List of textbooks for the program by BMGC
  */
  private userFramework;
  private userBoard;
  frameworkCategories;
  programScope: any = {};
  originalProgramScope: any = {};
  userprofile;
  public programData: any = {};
  showTextBookSelector = false;
  formIsInvalid = false;
  subjectsOption = [];
  mediumOption = [];
  gradeLevelOption = [];
  pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  pickerMinDateForEndDate = new Date(new Date().setHours(0, 0, 0, 0));
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryStart: IStartEventInput;
  public telemetryEnd: IEndEventInput;
  public sortColumn = 'name';
  public direction = 'asc';
  public tempSortCollections = [];
  public filterApplied = false;
  public showDocumentUploader = false;
  public defaultContributeOrgReviewChecked = false;
  public disableUpload = false;
  uploadedDocument;
  showAddButton = false;
  loading = false;
  isOpenNominations = true;
  isClosable = true;
  uploader;
  acceptPdfType: any;
  errorMsg: string;
  showErrorMsg = false;
  assetConfig: any = {
    'pdf': {
      'size': '50',
      'accepted': 'pdf'
    }
  };
  public programConfig: any;
  public disableCreateProgramBtn = false;
  public showLoader = true;

  constructor(
    public frameworkService: FrameworkService,
    private programsService: ProgramsService,
    private userService: UserService,
    public toasterService: ToasterService,
    public resource: ResourceService,
    private config: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cbseService: CbseProgramService,
    private sbFormBuilder: FormBuilder,
    private httpClient: HttpClient,
    private navigationHelperService: NavigationHelperService,
    private configService: ConfigService,
    private deviceDetectorService: DeviceDetectorService,
    public programTelemetryService: ProgramTelemetryService) {
  }

  ngOnInit() {
    this.programId = this.activatedRoute.snapshot.params.programId;
    this.userprofile = this.userService.userProfile;
    this.programScope['purpose'] = this.programsService.contentTypes;
    this.programConfig = _.cloneDeep(programConfigObj);
    this.telemetryInteractCdata = [];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    this.acceptPdfType = this.getAcceptType(this.assetConfig.pdf.accepted, 'pdf');

    if (!_.isEmpty(this.programId)) {
      this.editMode = true;
      this.getProgramDetails();
    }
    else {
      this.initializeFormFields();
    }
    this.fetchFrameWorkDetails();
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
        allowedExtensions: this.assetConfig.pdf.accepted.split(', '),
        acceptFiles: this.acceptPdfType,
        itemLimit: 1,
        sizeLimit: _.toNumber(this.assetConfig.pdf.size) * 1024 * 1024  // 52428800  = 50 MB = 50 * 1024 * 1024 bytes
      },
      messages: {
        sizeError: `{file} is too large, maximum file size is ${this.assetConfig.pdf.size} MB.`,
        typeError: `Invalid content type (supported type: ${this.assetConfig.pdf.accepted})`
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
      this.cbseService.createMediaAsset(req).pipe(catchError(err => {
        this.loading = false;
        this.isClosable = true;
        const errInfo = { errorMsg: ' Unable to create an Asset' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      })).subscribe((res) => {
        const contentId = res['result'].node_id;
        const request = {
          content: {
            fileName: this.uploader.getName(0)
          }
        };
        this.cbseService.generatePreSignedUrl(request, contentId).pipe(catchError(err => {
          const errInfo = { errorMsg: 'Unable to get pre_signed_url and Content Creation Failed, Please Try Again' };
          this.loading = false;
          this.isClosable = true;
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
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
    this.cbseService.uploadMedia(option, contentId).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Unable to update pre_signed_url with Content Id and Content Creation Failed, Please Try Again' };
      this.isClosable = true;
      this.loading = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      // Read upload video data
      this.getUploadVideo(res.result.node_id);
    });
  }

  getProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    this.programsService.get(req).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.programDetails['content_types'] = this.programsService.getContentTypesName(this.programDetails.content_types);
      this.initializeFormFields();

      if (!_.isEmpty(this.programDetails.guidelines_url)) {
        this.guidLinefileName = this.programDetails.guidelines_url.split("/").pop();
      }

    }, error => {
      this.showLoader = false;
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
    });
  }


  getUploadVideo(videoId) {
    this.loading = false;
    this.isClosable = true;
    this.cbseService.getVideo(videoId).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Document, Please Try Again' };
      this.loading = false;
      this.isClosable = true;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
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
    console.log(this.userprofile);
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
      const errInfo = { errorMsg: 'Unable to upload to Blob and Content Creation Failed, Please Try Again' };
      this.isClosable = true;
      this.loading = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }), map(data => data));
  }

  sortCollection(column) {
    this.collections = this.programsService.sortCollection(this.tempSortCollections, column, this.direction);
    this.direction = (this.direction === 'asc' || this.direction === '') ? 'desc' : 'asc';
    this.sortColumn = column;
  }

  resetSorting() {
    this.sortColumn = 'name';
    this.direction = 'asc';
  }

  getMaxDate(date) {
    if (!this.editMode) {
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

    if (!this.editMode) {
      return this.pickerMinDate;
    }
    else {
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
          cdata: [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.config.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  fetchFrameWorkDetails() {
    if (_.get(this.userprofile.framework, 'id')) {
      this.userFramework = _.get(this.userprofile.framework, 'id')[0];
      this.frameworkService.getFrameworkCategories(_.get(this.userprofile.framework, 'id')[0])
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data) => {
          if (data && _.get(data, 'result.framework.categories')) {
            this.frameworkCategories = _.get(data, 'result.framework.categories');
          }
          this.setFrameworkDataToProgram();
        }, error => {
          const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
          this.toasterService.warning(errorMes || 'Fetching framework details failed');
        });
    } else {
      this.frameworkService.initialize();
      this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkInfo: any) => {
        if (frameworkInfo && !frameworkInfo.err) {
          this.userFramework = frameworkInfo.frameworkdata.defaultFramework.identifier;
          this.frameworkCategories = frameworkInfo.frameworkdata.defaultFramework.categories;
        }
        this.setFrameworkDataToProgram();
      });
    }
  }

  setFrameworkDataToProgram() {
    this.programScope['medium'] = [];
    this.programScope['gradeLevel'] = [];
    this.programScope['subject'] = [];

    this.collectionListForm.controls['medium'].setValue('');
    this.collectionListForm.controls['gradeLevel'].setValue('');
    this.collectionListForm.controls['subject'].setValue('');

    const board = _.find(this.frameworkCategories, (element) => {
      return element.code === 'board';
    });

    this.userBoard = board.terms[0].name;

    if (_.get(this.userprofile.framework, 'board')) {
      this.userBoard = this.userprofile.framework.board[0];
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

    const mediumOption = this.programsService.getAssociationData(board.terms, 'medium', this.frameworkCategories);

    if (mediumOption.length) {
      this.programScope['medium'] = mediumOption;
    }
  }
  openForNominations(status) {
    this.isOpenNominations = status;
    if (status) {
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
  onMediumChange() {
    // const thisClassOption = this.createProgramForm.value.gradeLevel;

    /*this.programScope['gradeLevel'] = [];
    this.programScope['subject'] = [];*/
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
    // const thisSubjectOption = this.createProgramForm.value.subject;
    // this.programScope['subject'] = [];
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

  /**
   * Executed when user come from any other page or directly hit the url
   *
   * It helps to initialize form fields and apply field level validation
   */
  initializeFormFields(): void {

    if (!_.isEmpty(this.programDetails) && !_.isEmpty(this.programId)) {
      this.isOpenNominations = (_.get(this.programDetails, 'type') == "public") ? true : false;
      this.disableUpload = (_.get(this.programDetails, 'guidelines_url')) ? true : false;

      let obj = {
        name: [_.get(this.programDetails, 'name'), [Validators.required, Validators.maxLength(100)]],
        description: [_.get(this.programDetails, 'description'), Validators.maxLength(1000)],
        nomination_enddate : [],
        shortlisting_enddate: [_.get(this.programDetails, 'shortlisting_enddate') ? new Date(_.get(this.programDetails, 'shortlisting_enddate')) : ''],
        program_end_date: [_.get(this.programDetails, 'enddate') ? new Date(_.get(this.programDetails, 'enddate')) : '', Validators.required],
        content_submission_enddate: [_.get(this.programDetails, 'content_submission_enddate') ? new Date(_.get(this.programDetails, 'content_submission_enddate')) : '', Validators.required],
        content_types: [_.get(this.programDetails, 'content_types'), Validators.required],
        rewards: [_.get(this.programDetails, 'rewards')],
        defaultContributeOrgReview: new FormControl({ value: this.defaultContributeOrgReviewChecked, disabled: this.editMode })
      };

      if (this.isOpenNominations == true) {
        obj.nomination_enddate = [_.get(this.programDetails, 'nomination_enddate') ? new Date(_.get(this.programDetails, 'nomination_enddate')) : '', Validators.required];
      }
      else {
        obj.nomination_enddate = [_.get(this.programDetails, 'nomination_enddate') ? new Date(_.get(this.programDetails, 'nomination_enddate')) : ''];
      }

      this.createProgramForm = this.sbFormBuilder.group(obj);
    }
    else
    {
      this.createProgramForm = this.sbFormBuilder.group({
        name: ['', [Validators.required, Validators.maxLength(100)]],
        description: ['', Validators.maxLength(1000)],
        nomination_enddate: ['', Validators.required],
        shortlisting_enddate: [],
        program_end_date: ['', Validators.required],
        content_submission_enddate: ['', Validators.required],
        content_types: ['', Validators.required],
        rewards: [],
        defaultContributeOrgReview: [true]
      });
    }

    this.showLoader = false;
    this.isFormValueSet = true;

    this.collectionListForm = this.sbFormBuilder.group({
      pcollections: this.sbFormBuilder.array([]),
      medium: [],
      gradeLevel: [],
      subject: [],
    });
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
    this.showTextBookSelector = false;
  }

  validateDates() {
    let hasError = false;
    const formData = this.createProgramForm.value;
    const nominationEndDate = moment(formData.nomination_enddate);
    const contentSubmissionEndDate = moment(formData.content_submission_enddate);
    const programEndDate = moment(formData.program_end_date);
    const today = moment(moment().format('YYYY-MM-DD'));

    if (this.isOpenNominations) {
      // nomination date should be >= today
      if (!nominationEndDate.isSameOrAfter(today) && !this.editMode) {
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
    this.showTexbooklist();
  }

  handleContentTypes() {
    const contentTypes = this.createProgramForm.value.content_types;
    let configContentTypes = _.get(_.find(this.programConfig.components, { id: 'ng.sunbird.chapterList' }), 'config.contentTypes.value');
    configContentTypes = _.filter(configContentTypes, (type) => {
      return _.includes(contentTypes, type.metadata.contentType);
    });
    _.find(this.programConfig.components, { id: 'ng.sunbird.chapterList' }).config.contentTypes.value = configContentTypes;
  }

  defaultContributeOrgReviewChanged($event) {
    this.createProgramForm.value.defaultContributeOrgReview = !$event.target.checked;
    this.defaultContributeOrgReviewChecked = $event.target.checked;
  }

  saveProgram() {
    this.formIsInvalid = false;
    this.handleContentTypes();

    if ((this.createProgramForm.dirty || !_.isUndefined(this.uploadedDocument)) && this.createProgramForm.valid) {
      const contentTypes = this.createProgramForm.value.content_types;
      this.createProgramForm.value.content_types = _.isEmpty(contentTypes) ? [] : contentTypes;
      this.programData = {
        ...this.createProgramForm.value
      };
      if (this.userFramework) {
        this.programConfig.framework = this.userFramework;
        // tslint:disable-next-line:max-line-length
        _.find(_.find(this.programConfig.components, { id: 'ng.sunbird.collection' }).config.filters.implicit, { code: 'framework' }).defaultValue = this.userFramework;
      }
      this.programConfig.defaultContributeOrgReview = !this.defaultContributeOrgReviewChecked;
      this.programData['sourcing_org_name'] = this.userprofile.rootOrgName;
      this.programData['rootorg_id'] = this.userprofile.rootOrgId;
      this.programData['createdby'] = this.userprofile.id;
      this.programData['createdon'] = new Date();
      this.programData['startdate'] = new Date();
      this.programData['slug'] = 'sunbird';

      this.programData['type'] = (!this.isOpenNominations) ? 'private' : 'public';
      this.programData['default_roles'] = ['CONTRIBUTOR'];
      this.programData['enddate'] = this.programData.program_end_date;
      this.programData['config'] = this.programConfig;
      this.programData['guidelines_url'] = (this.uploadedDocument) ? this.uploadedDocument.artifactUrl : '';

      delete this.programData.defaultContributeOrgReview;
      delete this.programData.gradeLevel;
      delete this.programData.medium;
      delete this.programData.subject;
      delete this.programData.program_end_date;
      this.programData['program_id'] = '';

      if (!this.programId) {
        this.programData['status'] = 'Draft';
        this.programsService.createProgram(this.programData).subscribe(
          (res) => {
            this.programId = res.result.program_id;
            this.programData['program_id'] = this.programId;
            this.showTexbooklist();
            this.generateTelemetryEvent('START');
          },
          (err) => this.saveProgramError(err)
        );
      } else {
        this.programData['program_id'] = this.programId;
        this.programsService.updateProgram(this.programData).subscribe(
          (res) => { this.showTexbooklist(); },
          (err) => this.saveProgramError(err)
        );
      }
    } else {
      this.formIsInvalid = true;
      this.validateAllFormFields(this.createProgramForm);
    }

    this.validateDates();
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
      prgData['guidelines_url'] = (this.uploadedDocument) ? this.uploadedDocument.artifactUrl : this.programDetails.guidelines_url;

      delete prgData.program_end_date;
      delete prgData.content_types;

      if (this.isOpenNominations == false) {
        delete prgData.nomination_enddate;
        delete prgData.shortlisting_enddate;
      }

      this.programsService.updateProgram(prgData).subscribe(
        (res) => {
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

  showTexbooklist() {
    const requestData = {
      request: {
        filters: {
          objectType: 'content',
          status: ['Draft'],
          contentType: 'Textbook',
          framework: this.userFramework,
          board: this.userBoard,
          channel: this.userprofile.rootOrgId
        },
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
        this.showTextBookSelector = true;
        if (res.result.count) {
          this.collections = res.result.content;
          this.tempSortCollections = this.collections;
          if (!this.filterApplied) {
            this.sortCollection(this.sortColumn);
          }
        } else {
          this.collections = [];
          this.tempSortCollections = [];
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
      pcollectionsFormArray.push(new FormControl(collectionId));
      this.tempCollections.push(collection);
    } else {
      const index = pcollectionsFormArray.controls.findIndex(x => x.value === collectionId);
      pcollectionsFormArray.removeAt(index);

      const cindex = this.tempCollections.findIndex(x => x.identifier === collectionId);
      this.tempCollections.splice(cindex, 1);
    }
  }

  updateProgramCollection() {
    this.disableCreateProgramBtn = true;
    if (_.isEmpty(this.collectionListForm.value.pcollections)) {
      this.disableCreateProgramBtn = false;
      this.toasterService.warning('Please select at least a textbook');
      return false;
    }

    const requestData = {
      'program_id': this.programId,
      'collections': this.collectionListForm.value.pcollections,
      'allowed_content_types': this.programData.content_types,
      'channel': 'sunbird'
    };

    this.programsService.copyCollectionForPlatform(requestData).subscribe(
      (res) => {
        let copiedCollections = [];
        if (res && res.result) {
          copiedCollections = _.map(res.result, (collection) => {
            return collection.result.content_id;
          });
          this.addCollectionsToProgram(this.programData.content_types, copiedCollections);
        }
      },
      (err) => {
        this.disableCreateProgramBtn = false;
        console.log(err);
        // TODO: navigate to program list page
        const errorMes = typeof _.get(err, 'error.params.errmsg') === 'string' && _.get(err, 'error.params.errmsg');
        this.toasterService.warning(errorMes || 'Fetching textbooks failed');
      }
    );
  }

  addCollectionsToProgram(contentTypes, copiedCollections) {
    _.forEach(this.tempCollections, (collection) => {

      if (_.isArray(collection.medium)) {
        _.forEach(collection.medium, (single) => {
          if (this.mediumOption.indexOf(single) === -1) {
            this.mediumOption.push(single);
          }
        });
      } else {
        if (this.mediumOption.indexOf(collection.medium) === -1) {
          this.mediumOption.push(collection.medium);
        }
      }
      if (_.isArray(collection.subject)) {
        _.forEach(collection.subject, (single) => {
          if (this.subjectsOption.indexOf(single) === -1) {
            this.subjectsOption.push(single);
          }
        });
      } else {
        if (this.subjectsOption.indexOf(collection.subject) === -1) {
          this.subjectsOption.push(collection.subject);
        }
      }

      _.forEach(collection.gradeLevel, (single) => {
        if (this.gradeLevelOption.indexOf(single) === -1) {
          this.gradeLevelOption.push(single);
        }
      });
    });

    const data = {};
    data['program_id'] = this.programId;
    data['collection_ids'] = this.collectionListForm.value.pcollections;
    data['copiedCollections'] = copiedCollections;
    data['programContentTypes'] = contentTypes;

    this.programConfig.board = this.userBoard;
    // tslint:disable-next-line:max-line-length
    _.find(_.find(this.programConfig.components, { id: 'ng.sunbird.collection' }).config.filters.implicit, { code: 'board' }).defaultValue = this.userBoard;
    this.programConfig.gradeLevel = this.gradeLevelOption;
    this.programConfig.medium = this.mediumOption;
    this.programConfig.subject = this.subjectsOption;
    data['config'] = this.programConfig;
    if (this.isOpenNominations) {
      data['status'] = 'Live';
    } else {
      data['status'] = 'Unlisted';
    }

    this.programsService.updateProgram(data).subscribe(
      (res) => {
        this.toasterService.success(this.resource.messages.smsg.projectCreateSuccess);
        this.router.navigate(['/sourcing']);
        this.generateTelemetryEvent('END');
      },
      (err) => {
        this.disableCreateProgramBtn = false;
        this.saveProgramError(err);
      }
    );
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }

  generateTelemetryEvent(event) {
    switch (event) {
      case 'START':
        const deviceInfo = this.deviceDetectorService.getDeviceInfo();
        this.telemetryStart = {
          context: {
            env: this.activatedRoute.snapshot.data.telemetry.env
          },
          object: {
            id: this.programId || '',
            type: this.activatedRoute.snapshot.data.telemetry.object.type,
            ver: this.activatedRoute.snapshot.data.telemetry.object.ver
          },
          edata: {
            type: this.activatedRoute.snapshot.data.telemetry.type || '',
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid || '',
            mode: this.activatedRoute.snapshot.data.telemetry.mode || '',
            uaspec: {
              agent: deviceInfo.browser,
              ver: deviceInfo.browser_version,
              system: deviceInfo.os_version,
              platform: deviceInfo.os,
              raw: deviceInfo.userAgent
            }
          }
        };
        break;
      case 'END':
        this.telemetryEnd = {
          object: {
            id: this.programId || '',
            type: this.activatedRoute.snapshot.data.telemetry.object.type,
            ver: this.activatedRoute.snapshot.data.telemetry.object.ver
          },
          context: {
            env: this.activatedRoute.snapshot.data.telemetry.env
          },
          edata: {
            type: this.activatedRoute.snapshot.data.telemetry.type,
            pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
            mode: 'create'
          }
        };
        break;
      default:
        break;
    }
  }
}
