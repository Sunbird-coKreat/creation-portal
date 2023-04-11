import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import _, { forEach } from 'lodash';
import { TranscriptMetadata } from './transcript';
import { SearchService } from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService, ConfigService, ResourceService } from '@sunbird/shared';
import { ActionService } from '../../../core/services/action/action.service';
import { HelperService } from '../../../sourcing/services/helper.service';
import { TranscriptService } from '../../../core/services/transcript/transcript.service';
import { SourcingService } from '../../../sourcing/services/sourcing/sourcing.service';

@Component({
  selector: 'app-transcripts',
  templateUrl: './transcripts.component.html',
  styleUrls: ['./transcripts.component.scss']
})

export class TranscriptsComponent implements OnInit {
  @Input() contentMetaData;
  @Output() closePopup = new EventEmitter<any>();
  public transcriptForm: UntypedFormGroup;
  public langControl = 'language';
  public languageOptions;
  public supportedLanguages;
  public assetList = [];
  public loader = true;
  public disableDoneBtn = true;
  public disableAddItemBtn = true;
  public uploadInProgress = false;

  // @Todo -> contributor/ sourcing reviewer/ contribution reviewer/ sourcing admin/ contribution org admin
  public userRole = 'contributor';
  public acceptedFileFormats;
  public mimeType;
  public acceptFileExtensions;

  constructor(private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private sourcingService: SourcingService,
    private transcriptService: TranscriptService,
    public helperService: HelperService,
    private searchService: SearchService,
    private actionService: ActionService,
    public activeRoute: ActivatedRoute,
    private toasterService: ToasterService,
    public configService: ConfigService,
    public resourceService: ResourceService
  ) {
    const languages = (<HTMLInputElement>document.getElementById('sunbirdTranscriptSupportedLanguages')) ?
      // tslint:disable-next-line:max-line-length
      (<HTMLInputElement>document.getElementById('sunbirdTranscriptSupportedLanguages')).value : '[{"language":"English","languageCode":"en"},{"language":"Hindi","languageCode":"hi"},{"language":"Assamese","languageCode":"as"},{"language":"Bengali","languageCode":"bn"},{"language":"Gujarati","languageCode":"gu"},{"language":"Kannada","languageCode":"ka"},{"language":"Marathi","languageCode":"mr"},{"language":"Odia","languageCode":"or"},{"language":"Tamil","languageCode":"ta"},{"language":"Telugu","languageCode":"te"}]';

    this.supportedLanguages = JSON.parse(languages);
    this.languageOptions = _.sortBy(_.map(this.supportedLanguages , 'language'));


    // tslint:disable-next-line:max-line-length
    const sunbirdTranscriptFileFormat = (<HTMLInputElement>document.getElementById('sunbirdTranscriptFileFormat')) ? (<HTMLInputElement>document.getElementById('sunbirdTranscriptFileFormat')).value : 'srt';
    this.acceptedFileFormats = sunbirdTranscriptFileFormat.split(',').map((item) => {
      return item.trim();
    });

    this.acceptFileExtensions = this.acceptedFileFormats.map(item => {
      return '.' + item;
    }).toString();
  }

  ngOnInit(): void {
    this.transcriptForm = this.fb.group({
      items: this.fb.array([])
    });

    this.contentRead(this.contentMetaData.identifier).subscribe(content => {
      this.hideLoader();
      this.contentMetaData.transcripts = _.get(content, 'transcripts') || [];
      if (this.contentMetaData.transcripts.length) {
        this.setFormValues(this.contentMetaData.transcripts);
      }
      this.addItem();
    });

    this.getAssetList();
  }

  get items(): UntypedFormArray {
    return this.transcriptForm.get('items') as UntypedFormArray;
  }

  getLanguage(index) {
    return this.items.controls[index].get('language').value;
  }

  getFileControl(index) {
    return this.items.controls[index].get('transcriptFile');
  }

  getFileNameControl(index) {
    return this.items.controls[index].get('fileName');
  }

  getLanguageControl(index) {
    return this.items.controls[index].get('language');
  }

  setFile(index, value) {
    return this.items.controls[index].get('transcriptFile')['file'] = value;
  }

  getFile(index) {
    return this.items.controls[index].get('transcriptFile')['file'];
  }

  addItem(data?): void {
    this.items.push(this.createItem(data));
    this.disableAddItemBtn = true;
  }

  createItem(data?): UntypedFormGroup {
    return this.fb.group({
      identifier: [data ? data.identifier : null],
      language: [data ? data.language : null],
      languageCode: [data ? data.languageCode : null],
      transcriptFile: '',
      fileName: [data ? data.artifactUrl.split('/').pop() : null]
    });
  }

  get transcripts() {
    return this.transcriptForm.get('transcripts') as UntypedFormArray;
  }

  get languages() {
    return this.transcriptForm.get('languages') as UntypedFormArray;
  }

  attachFile(event, index) {
    if (!this.getLanguageControl(index).value) {
      event.target.value = '';
      this.toasterService.warning('Please select language first');
      return false;
    }

    this.disableDoneBtn = false;
    const file = event.target.files[0];
    if (!this.fileValidation(file)) {
      event.target.value = '';
      return false;
    }

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.setFile(index, file);
      this.getFileNameControl(index).patchValue(file.name);
    }

    this.enableDisableAddItemButton();
  }

  fileValidation(file) {
    const extn = file.name.split('.').pop();
    if (!this.acceptedFileFormats.includes(extn)) {
      this.toasterService.error(`Invalid file type (supported type: ${this.acceptFileExtensions})`);
      return false;
    }
    this.mimeType = this.detectMimeType(extn);
    return true;
  }

  detectMimeType(extn) {
    const appFilesConfig = this.configService.contentCategoryConfig.sourcingConfig.files;
    let thisFileMimetype = '';

    _.forEach(appFilesConfig, (item, key) => {
      if (item === extn) {
        thisFileMimetype = key;
      }
    });

    return thisFileMimetype;
  }


  replaceFile(index) {
    document.getElementById('attachFileInput' + index).click();
  }

  reset(index) {
    this.disableDoneBtn = false;
    this.getFileControl(index).reset();
    this.getFileNameControl(index).reset();
    this.getLanguageControl(index).reset();
    this.enableDisableAddItemButton();
  }

  download(identifier) {
    const item = _.find(this.contentMetaData.transcripts, e => e.identifier === identifier);
    if (_.get(item, 'artifactUrl')) {
      window.open(_.get(item, 'artifactUrl'), '_blank');
    } else {
      this.toasterService.error('Something went wrong');
    }
  }

  setFormValues(transcriptsMeta) {
    transcriptsMeta.forEach((element) => {
      this.addItem(element);
    });
  }

  languageChange(language, index) {
    if (language) {
      forEach(this.items.controls, (e, i) => {
        if (e.get('language').value && i !== index) {
          if (e.get('language').value === language) {
            this.items.controls[index].get('language').reset();
            this.toasterService.warning(language + ' is already selected');
            return true;
          }
        }
      });
    }

    this.disableDoneBtn = false;
    this.enableDisableAddItemButton();
  }

  submit() {
    if (!this.items['controls'].length) {
      this.closePopup.emit();
      return true;
    } else {
      for (let item of this.items['controls']) {
        if ((item.get('transcriptFile')['file'] || item.get('fileName').value)
          && !item.get('language').value) {
          this.toasterService.warning('Please select language for transcript file');
          return false;
        }
      }
    }

    this.uploadInProgress = true;
    this.disableDoneBtn = true;
    const transcriptMeta = [];
    const assetRequest = [];

    for (let item of this.items['controls']) {
      let transcriptMetadata: TranscriptMetadata = {};
      let orgAsset;

      if (item.get('identifier').value) {
        orgAsset = _.find(this.assetList, e => e.identifier === item.get('identifier').value);
      }

      if (item.get('fileName').value && item.get('language').value) {
        let forkReq;
        // if selected then upload it
        if (item.get('transcriptFile')['file']) {
          forkReq = this.createOrUpdateAsset(item).pipe(
            switchMap(asset => {
              transcriptMetadata.language = item.get('language').value;
              transcriptMetadata.identifier = _.get(asset, 'result.identifier');
              const seletedLanguage = _.find(this.supportedLanguages, (lan) => {
                return lan.language.toLowerCase() === transcriptMetadata.language.toLowerCase();
              });
              if (seletedLanguage.languageCode) {
                transcriptMetadata.languageCode = seletedLanguage.languageCode;
              }
              return this.generatePreSignedUrl(asset, item);
            }),
            switchMap((rsp) => {
              item['preSignedResponse'] = rsp;
              const signedURL = item['preSignedResponse'].result.pre_signed_url;
              transcriptMetadata.artifactUrl = signedURL.split('?')[0];
              transcriptMeta.push(transcriptMetadata);
              return this.uploadToBlob(rsp, item);
            }),
            switchMap(response => {
              return this.updateAssetWithURL(item);
            })
          );
        } else {
          // Update only asset language only
          forkReq = this.createOrUpdateAsset(item).pipe(switchMap((rs) => {
            transcriptMetadata.identifier = _.get(orgAsset, 'identifier');
            transcriptMetadata.language = item.get('language').value;
            const seletedLanguage = _.find(this.supportedLanguages, (lan) => {
              return lan.language.toLowerCase() === transcriptMetadata.language.toLowerCase();
            });
            if (seletedLanguage.languageCode) {
              transcriptMetadata.languageCode = seletedLanguage.languageCode;
            }
            transcriptMetadata.artifactUrl = _.get(orgAsset, 'artifactUrl');
            transcriptMeta.push(transcriptMetadata);
            return of(transcriptMetadata);
          }));
        }
        assetRequest.push(forkReq);
      }
    }

    if (assetRequest && assetRequest.length) {
      forkJoin(assetRequest).subscribe(response => {
        this.updateContent(transcriptMeta).subscribe(response => {
          this.toasterService.success(this.resourceService?.messages?.smsg?.transcriptUpdate);
          this.closePopup.emit();
        }, error => {
          console.log('Something went wrong', error);
          this.closePopup.emit();
        });
      }, error => {
        console.log(error);
        this.closePopup.emit();
      });
    } else if (!_.isEmpty(this.contentMetaData.transcripts)) {
      this.updateContent(transcriptMeta).subscribe(response => {
        this.toasterService.success(this.resourceService?.messages?.smsg?.transcriptUpdate);
        this.closePopup.emit();
      }, error => {
        console.log('Something went wrong', error);
        this.closePopup.emit();
      });
    } else {
      this.closePopup.emit();
    }
  }

  enableDisableAddItemButton() {
    const itemCnt = this.items['controls'].length - 1;
    const lastItem = this.items['controls'][itemCnt];

    if (lastItem.get('fileName').value && lastItem.get('language').value) {
      this.disableAddItemBtn = false;
    } else {
      this.disableAddItemBtn = true;
    }
  }

  createOrUpdateAsset(item): Observable<any> {
    const identifier = item.get('identifier').value;
    const req = _.clone(this.createAssetReq);
    req.asset['name'] = item.get('fileName').value;
    req.asset['language'].push(item.get('language').value);

    if (identifier) {
      const asset = _.find(this.assetList, em => em.identifier === identifier);
      req.asset['versionKey'] = _.get(asset, 'versionKey');
      return this.sourcingService.updateAsset(req, identifier);
    } else {
      return this.sourcingService.createAsset(req);
    }
  }

  uploadToBlob(response, item): Observable<any> {
    try {
      const signedURL = response.result.pre_signed_url;
      const headers = this.helperService.addCloudStorageProviderHeaders();
      const config = {
        processData: false,
        contentType: 'Asset',
        headers: headers
      };

      return this.transcriptService.http.put(signedURL, item.get('transcriptFile')['file'], config);
    } catch (err) {
      console.log(err);
    }
  }

  generatePreSignedUrl(asset, item): Observable<any> {
    try {
      const req = {
        'content': {
          'fileName': item.get('fileName').value
        }
      };
      return this.sourcingService.generatePreSignedUrl(req, _.get(asset, 'result.identifier'));
    } catch (err) {
      throw err;
    }
  }

  updateAssetWithURL(item): Observable<any> {
    const signedURL = item['preSignedResponse'].result.pre_signed_url;
    const fileURL = signedURL.split('?')[0];
    const formData = new FormData();
    formData.append('fileUrl', fileURL);
    formData.append('mimeType', this.mimeType);

    const request = {
      data: formData
    };

    return this.sourcingService.uploadAsset(request, item['preSignedResponse'].result.identifier);
  }

  updateContent(transcriptMeta): Observable<any> {
    const req = {
      content: {
        versionKey: this.contentMetaData.versionKey,
        transcripts: transcriptMeta
      }
    };

    return this.helperService.updateContent(req, this.contentMetaData.identifier);
  }

  get createAssetReq() {
    return {
      'asset': {
        'name': '',
        'mimeType': this.mimeType,
        'primaryCategory': 'Video transcript',
        'mediaType': 'text',
        'language': []
      }
    };
  }

  getAssetList(): void {
    const transcripts = _.get(this.contentMetaData, 'transcripts') || [];
    const identifier = _.map(transcripts, e => e.identifier);
    if (identifier && identifier.length) {
      const req = {
        'filters': {
          'primaryCategory': 'Video transcript',
          'status': [],
          'identifier': identifier
        },
        'fields': ['versionKey']
      };

      this.searchService.compositeSearch(req).subscribe(res => {
        this.hideLoader();
        if (_.get(res, 'responseCode') === 'OK') {
          this.assetList = _.get(res, 'result.content');
        }
      }, err => {
        console.log('Something went wrong', err);
      });
    } else {
      this.hideLoader();
    }
  }

  contentRead(identifier): Observable<any> {
    const option = {
      url: `${this.configService.urlConFig.URLS.DOCKCONTENT.GET}/${identifier}`
    };
    return this.actionService.get(option).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to read the Content, Please Try Again',
        telemetryPageId: '',
        telemetryCdata: '',
        env: this.activeRoute.snapshot.data.telemetry.env,
        request: option
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  showLoader(): void {
    this.loader = true;
  }

  hideLoader(): void {
    this.loader = false;
  }

  close() {
    this.closePopup.emit();
  }
}
