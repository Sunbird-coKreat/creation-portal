import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, ProgramsService } from '@sunbird/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ResourceService, ToasterService} from '@sunbird/shared';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { FineUploader } from 'fine-uploader';
import { Subject, throwError, Observable } from 'rxjs';
import { CbseProgramService } from './../../../cbse-program/services';
import {  map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.scss']
})
export class EditProgramComponent implements OnInit {
  @ViewChild('fineUploaderUI') fineUploaderUI: ElementRef;
  public unsubscribe = new Subject<void>();
  public programId: string;
  /**
   * Program Edit form name
   */
  editProgramForm: FormGroup;
  public programDetails: any;
  public isFormValueSet = false;
  public formIsInvalid = false;
  public showDocumentUploader = false;
  public pickerMinDate = new Date(new Date().setHours(0, 0, 0, 0));
  public  loading = false;
  public isClosable = true;
  public uploader: any;
  assetConfig: any = {
    'pdf': {
      'size': '50',
      'accepted': 'pdf'
    }
  };
  public acceptPdfType: any;
  public showErrorMsg = false;
  public userProfile;
  public showAddButton = false;
  public uploadedDocument;
  public showLoader = true;
  public enableBtn = false;
  public guidLinefileName: String;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private programsService: ProgramsService,
    public toasterService: ToasterService, public formBuilder: FormBuilder, public resource: ResourceService,
    private cbseService: CbseProgramService, private userService: UserService,) { }

  ngOnInit(): void {
    this.programId = this.activatedRoute.snapshot.params.programId,
    this.userProfile = this.userService.userProfile;
    this.getProgramDetails();
    this.acceptPdfType = this.getAcceptType(this.assetConfig.pdf.accepted, 'pdf');
  }

  getProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    this.programsService.get(req).subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.programDetails['content_types'] = this.programsService.getContentTypesName(this.programDetails.content_types);
      this.initializeFormFields();

      if (!_.isEmpty(this.programDetails.guidelines_url))
      {
        //this.guidLinefileName = this.programDetails.guidelines_url.getName(0);
        this.guidLinefileName = this.programDetails.guidelines_url.split("/").pop();
      }

    }, error => {
      this.showLoader = false;
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
    });
  }

  initializeFormFields(): void {
    this.editProgramForm = this.formBuilder.group({
      name: [this.programDetails.name, [Validators.required, Validators.maxLength(100)]],
      description: [this.programDetails.description, Validators.maxLength(1000)],
      nomination_enddate: [new Date(this.programDetails.nomination_enddate), Validators.required],
      shortlisting_enddate: [new Date(this.programDetails.shortlisting_enddate)],
      program_end_date: [new Date(this.programDetails.enddate), Validators.required],
      content_submission_enddate: [new Date(this.programDetails.content_submission_enddate), Validators.required],
      content_types: [this.programDetails.content_types, Validators.required],
      rewards: [this.programDetails.rewards],
    });
    this.showLoader = false;
    this.isFormValueSet = true;
  }

  updateProgram($event: MouseEvent) {
    this.formIsInvalid = false;

    if ((this.editProgramForm.dirty || this.uploadedDocument) && this.editProgramForm.valid) {
      ($event.target as HTMLButtonElement).disabled = true;

      const programData = {
        ...this.editProgramForm.value
      };

      programData['enddate'] = programData.program_end_date;
      programData['program_id'] = this.programId;
      programData['guidelines_url'] = (this.uploadedDocument) ? this.uploadedDocument.artifactUrl : this.programDetails.guidelines_url;

      delete programData.program_end_date;
      delete programData.program_end_date;
      delete programData.content_types;

        this.programsService.updateProgram(programData).subscribe(
          (res) => {
            this.toasterService.success('Project Successfully Updated...');
            ($event.target as HTMLButtonElement).disabled = false;
            this.router.navigate(['/sourcing']);
           },
          (err) => {
            console.log(err, err)
            this.toasterService.error('Unable to Update...');
            ($event.target as HTMLButtonElement).disabled = false;
          }
        );
    } else {
      this.formIsInvalid = true;
      this.validateAllFormFields(this.editProgramForm);
    }
    this.validateDates();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched();
    });
  }

  validateDates() {
    let hasError = false;
    const formData = this.editProgramForm.value;
    const nominationEndDate = moment(formData.nomination_enddate);
    const contentSubmissionEndDate = moment(formData.content_submission_enddate);
    const programEndDate = moment(formData.program_end_date);
    const today = moment(moment().format('YYYY-MM-DD'));

    // nomination date should be >= today
    if (!nominationEndDate.isSameOrAfter(today)) {
      this.toasterService.error(this.resource.messages.emsg.createProgram.m0001);
      hasError = true;
    }

    if (!_.isEmpty(formData.shortlisting_enddate)) {
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

    // end date should be >= submission date
    if (!programEndDate.isSameOrAfter(contentSubmissionEndDate)) {
      this.toasterService.error(this.resource.messages.emsg.createProgram.m0004);
      hasError = true;
    }

    return hasError;
  }
  getMaxDate(date) {
    if (date === 'nomination_enddate') {
      if (this.editProgramForm.value.shortlisting_enddate) {
        return this.editProgramForm.value.shortlisting_enddate;
      }
    }

    if (date === 'shortlisting_enddate') {
      if (this.editProgramForm.value.content_submission_enddate) {
        return this.editProgramForm.value.content_submission_enddate;
      }
    }

    return this.editProgramForm.value.program_end_date;
  }

  getMinDate(date) {
    if (date === 'shortlisting_enddate') {
      if (this.editProgramForm.value.nomination_enddate) {
        return this.editProgramForm.value.nomination_enddate;
      }
    }

    if (date === 'content_submission_enddate') {
      if (this.editProgramForm.value.shortlisting_enddate) {
        return this.editProgramForm.value.shortlisting_enddate;
      }

      if (this.editProgramForm.value.nomination_enddate) {
        return this.editProgramForm.value.nomination_enddate;
      }
    }

    if (date === 'program_end_date') {
      if (this.editProgramForm.value.content_submission_enddate) {
        return this.editProgramForm.value.content_submission_enddate;
      }

      if (this.editProgramForm.value.shortlisting_enddate) {
        return this.editProgramForm.value.shortlisting_enddate;
      }

      if (this.editProgramForm.value.nomination_enddate) {
        return this.editProgramForm.value.nomination_enddate;
      }
    }

    return this.pickerMinDate;
  }

  initiateDocumentUploadModal() {
    this.showDocumentUploader = true;
    this.loading = false;
    this.isClosable = true;
    return setTimeout(() => {
      this.initiateUploadModal();
    }, 0);
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

  getAcceptType(typeList, type) {
    const acceptTypeList = typeList.split(', ');
    const result = [];
    _.forEach(acceptTypeList, (content) => {
      result.push(`${type}/${content}`);
    });
    return result.toString();
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
    this.enableBtn = true;

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

  generateAssetCreateRequest(fileName, fileType, mediaType) {
    return {
      content: {
        name: fileName,
        mediaType: mediaType,
        mimeType: fileType,
        createdBy: this.userProfile.userId,
        creator: `${this.userProfile.firstName} ${this.userProfile.lastName ? this.userProfile.lastName : ''}`,
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

  getUploadVideo(videoId) {
    this.loading = false;
    this.isClosable = true;
    this.cbseService.getVideo(videoId).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: 'Unable to read the Document, Please Try Again' };
      this.loading = false;
      this.isClosable = true;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      this.enableBtn = true;
      this.toasterService.success('Document Successfully Uploaded...');
      this.showAddButton = true;
      this.uploadedDocument = res;
      this.guidLinefileName = null;
      this.showDocumentUploader = false;
    });
  }

  removeUploadedDocument() {
    this.uploadedDocument = null;
    this.guidLinefileName = null;
    this.programDetails.guidelines_url = null;
  }
}
