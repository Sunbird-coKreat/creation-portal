import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import ClassicEditor from '@project-sunbird/ckeditor-build-classic';
import * as _ from 'lodash-es';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { QuestionService } from '../../services/question/question.service';
import { EditorService } from '../../services/editor/editor.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { ConfigService } from '../../services/config/config.service';
import { config } from '../asset-browser/asset-browser.data';
@Component({
  selector: 'lib-ckeditor-tool',
  templateUrl: './ckeditor-tool.component.html',
  styleUrls: ['./ckeditor-tool.component.scss']
})
export class CkeditorToolComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('editor') public editorRef: ElementRef;
  @Input() editorDataInput: any;
  @Output() editorDataOutput = new EventEmitter<any>();
  @Output() hasError = new EventEmitter<any>();
  @Output() videoDataOutput = new EventEmitter<any>();
  @Input() videoShow;
  @Input() setCharacterLimit: any;
  @Input() setImageLimit: any;
  public editorConfig: any;
  public imageUploadLoader = false;
  public editorInstance: any;
  public isEditorFocused: boolean;
  public limitExceeded: boolean;
  public isAssetBrowserReadOnly = false;
  public characterCount;
  public mediaobj;
  initialized = false;
  public assetProxyUrl: any;
  public lastImgResizeWidth;
  constructor(private questionService: QuestionService, private editorService: EditorService,
              private toasterService: ToasterService, public configService: ConfigService) { }
  assetConfig: any = {};
  myAssets = [];
  allImages = [];
  allVideos = [];
  selectedVideo = {};
  loading = false;
  isClosable = true;
  selectedVideoId: string;
  showAddButton: boolean;
  showImagePicker: boolean;
  showVideoPicker = false;
  showImageUploadModal: boolean;
  showVideoUploadModal: boolean;
  acceptVideoType: any;
  acceptImageType: any;
  showErrorMsg: boolean;
  errorMsg: string;
  query: string;
  public assetsCount: any;
  public searchMyInput = '';
  public searchAllInput: any;
  public formData: any;
  public assestData = {};
  public formConfig: any;
  public initialFormConfig: any;
  public imageFormValid = false;
  public videoFile: any;
  public termsAndCondition: any;
  public assetName: any;
  public emptyImageSearchMessage: any;
  public emptyVideoSearchMessage: any;
  ngOnInit() {
    this.assetProxyUrl =  _.get(this.configService.urlConFig, 'URLS.assetProxyUrl');
    this.initialFormConfig = _.get(config, 'uploadIconFormConfig');
    this.formConfig = _.get(config, 'uploadIconFormConfig');
    this.emptyImageSearchMessage =  _.get(this.configService.labelConfig, 'messages.error.016');
    this.emptyVideoSearchMessage =  _.get(this.configService.labelConfig, 'messages.error.017');
    this.termsAndCondition =  _.get(this.configService.labelConfig, 'termsAndConditions.001');
    this.assetConfig = this.editorService.editorConfig.config.assetConfig;
    this.initialized = true;
    this.editorConfig = {
      toolbar: ['heading', '|', 'bold', '|', 'italic', '|', 'underline', '|', 'BulletedList', '|', 'alignment',
        '|', 'insertTable', '|', 'numberedList', '|', 'fontSize', '|', 'subscript', '|', 'superscript', '|',
        'MathText', '|', 'specialCharacters', '|'
      ],
      fontSize: {
        options: [
          'eight',
          'ten',
          'twelve',
          'fourteen',
          'sixteen',
          'eighteen',
          'twenty',
          'twentytwo',
          'twentyfour',
          'twentysix',
          'twentyeight',
          'thirty',
          'thirtysix'
        ]
      },
      image: {
        resizeUnit: '%',
        resizeOptions: [{
          name: 'resizeImage:25',
          value: '25',
          icon: 'small',
          className: 'resize-25'
        },
        {
          name: 'resizeImage:50',
          value: '50',
          icon: 'medium',
          className: 'resize-50'
        },
        {
          name: 'resizeImage:75',
          value: '75',
          icon: 'large',
          className: 'resize-75'
        },
        {
          name: 'resizeImage:100',
          value: '100',
          icon: 'full',
          className: 'resize-100'
        },
        {
          name: 'resizeImage:original',
          value: null,
          icon: 'original',
          className: 'resize-original'
        }],
        toolbar: ['imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight', '|',
        'resizeImage:25', 'resizeImage:50', 'resizeImage:75',  'resizeImage:100', 'resizeImage:original'],
        styles: ['full', 'alignLeft', 'alignRight', 'alignCenter']
      },
      isReadOnly: false,
      removePlugins: ['ImageCaption', 'mathtype', 'ChemType', 'ImageResizeHandles']
    };

    this.acceptVideoType = this.getAcceptType(this.assetConfig.video.accepted, 'video');
    this.acceptImageType = this.getAcceptType(this.assetConfig.image.accepted, 'image');
  }
  ngOnChanges() {
    if (this.videoShow) {
      this.showVideoPicker = true;
      this.selectVideo(undefined);
    }
  }

  ngAfterViewInit() {
    this.initializeEditors();
  }


  initializeImagePicker(editorType) {
    this.showImagePicker = true;
  }

  initializeVideoPicker(editorType) {
    this.showVideoPicker = true;
  }
  /**
   * function to hide image picker
   */
  dismissImagePicker() {
    this.showImagePicker = false;
  }

  /**
   * function to hide video picker
   */
  dismissVideoPicker() {
    this.showVideoPicker = false;
    this.videoShow = false;
    this.videoDataOutput.emit(false);
  }
  dismissImageUploadModal() {
    this.showImageUploadModal = false;
  }
  initiateImageUploadModal() {
    this.showImagePicker = false;
    this.showImageUploadModal = true;
  }

  dismissVideoUploadModal() {
    if (this.isClosable) {
      this.showVideoUploadModal = false;
    }
  }
  initiateVideoUploadModal() {
    this.showVideoPicker = false;
    this.showImageUploadModal = true;
    this.loading = false;
    this.isClosable = true;
  }
  public isEditorReadOnly(state) {
    this.editorInstance.isReadOnly = state;
    this.isAssetBrowserReadOnly = state;
  }
  getAcceptType(typeList, type) {
    const acceptTypeList = typeList.split(', ');
    const result = [];
    _.forEach(acceptTypeList, (content) => {
      result.push(`${type}/${content}`);
    });
    return result.toString();
  }

  customImageResizer(editor) {
    // Both the data and the editing pipelines are affected by this conversion.
    editor.conversion.for('downcast').add(dispatcher => {
      // Links are represented in the model as a "linkHref" attribute.
      // Use the "low" listener priority to apply the changes after the link feature.
      dispatcher.on('attribute:width:image', (evt, data, conversionApi) => {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
          return;
        }
        const options = editor.config.get('image.resizeOptions');
        const isEnabled = editor.config.get('image.resizeEnabled');
        const sizeLables = options.map((item) => {
          return item.label;
        });
        const newImgWidthValue = data.attributeNewValue === null ? 'Original' : data.attributeNewValue;
        if (sizeLables.includes(newImgWidthValue)) {
          this.lastImgResizeWidth = newImgWidthValue;
        }

        if (!isEnabled && sizeLables.length > 0 && !sizeLables.includes(newImgWidthValue)) {
          editor.execute('imageResize', { width: this.lastImgResizeWidth });
          return evt.stop();
        }

        const viewWriter = conversionApi.writer;
        const figure = conversionApi.mapper.toViewElement(data.item);

        if (data.attributeNewValue !== null) {
          viewWriter.setStyle('width', data.attributeNewValue, figure);
          viewWriter.addClass('image_resized', figure);
        } else {
          viewWriter.removeStyle('width', figure);
          viewWriter.removeClass('image_resized', figure);
        }
      });
    });
  }

  initializeEditors() {
    ClassicEditor.create(this.editorRef.nativeElement, {
      alignment: {
        options: [
          { name: 'left', className: 'text-left' },
          { name: 'center', className: 'text-center' },
          { name: 'right', className: 'text-right' }
        ]
      },
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3' },
          { model: 'heading4', view: 'h4', title: 'Heading 4' },
          { model: 'heading5', view: 'h5', title: 'Heading 5' },
          { model: 'heading6', view: 'h6', title: 'Heading 6' }
        ]
      },
      extraPlugins: ['Table', 'Heading'],
      toolbar: this.editorConfig.toolbar,
      fontSize: this.editorConfig.fontSize,
      image: this.editorConfig.image,
      isReadOnly: this.editorConfig.isReadOnly,
      removePlugins: this.editorConfig.removePlugins
    })
      .then(editor => {
        this.editorInstance = editor;
        this.isAssetBrowserReadOnly = this.editorConfig.isReadOnly;
        if (this.editorDataInput) {
          this.editorDataInput = this.editorDataInput
            .replace(/(<img("[^"]*"|[^\/">])*)>/gi, '$1/>')
            .replace(/(<br("[^"]*"|[^\/">])*)>/gi, '$1/>');
          this.editorInstance.setData(this.editorDataInput);
        } else {
          this.editorInstance.setData('');
        }
        console.log('Editor was initialized');
        this.changeTracker(this.editorInstance);
        this.attachEvent(this.editorInstance);
        // this.pasteTracker(this.editorInstance);
        this.characterCount = this.countCharacters(this.editorInstance.model.document);
      })
      .catch(error => {
        console.error(error.stack);
      });
  }
  changeTracker(editor) {
    editor.model.document.on('change', (eventInfo, batch) => {
      if (this.setCharacterLimit && this.setCharacterLimit > 0) {
        this.checkCharacterLimit();
      }
      const selectedElement = eventInfo.source.selection.getSelectedElement();
      this.isEditorFocused = (selectedElement && selectedElement.name === 'image') ? true : false;
      if (this.setImageLimit && this.setImageLimit > 0) {
        this.checkImageLimit();
      }
      this.editorDataOutput.emit({
        body: editor.getData(),
        length: this.characterCount,
        mediaobj: this.mediaobj
      });
    });
  }
  pasteTracker(editor) {
    editor.editing.view.document.on('clipboardInput', (evt, data) => {
      const dataTransfer = data.dataTransfer;
      const urlMatch =
        // tslint:disable-next-line:max-line-length
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}|file:\/\/\/+[^\s]{0,})/gi;
      const regex = new RegExp(urlMatch);
      const getUrl = dataTransfer.getData('text/html').match(regex);
      if (getUrl && getUrl.length > 0) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.010'));
        evt.stop();
      }
    });
  }
  checkImageLimit() {
    const childNodes = this.editorInstance.model.document.getRoot()._children._nodes;
    this.isAssetBrowserReadOnly = _.keys(_.pickBy(childNodes, { name: 'image' })).length === this.setImageLimit ? true : false;
  }
  checkCharacterLimit() {
    this.characterCount = this.countCharacters(this.editorInstance.model.document);
    this.limitExceeded = (this.characterCount <= this.setCharacterLimit) ? false : true;
    this.hasError.emit(this.limitExceeded);
  }
  /**
   * function to get images
   * @param offset page no
   */
  getMyImages(offset, query?, search?) {
    this.assetsCount = 0;
    if (!search) {
      this.searchMyInput = '';
    }
    if (offset === 0) {
      this.myAssets.length = 0;
    }
    const req = {
      filters: {
        mediaType: ['image'],
        createdBy: _.get(this.editorService.editorConfig, 'context.user.id')
      },
      offset
    };
    if (query) {
      req['query'] = query;
    }
    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.022') };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      this.assetsCount = res.result.count;
      _.map(res.result.content, (item) => {
        if (item.downloadUrl) {
          this.myAssets.push(item);
        }
      });
    });
  }

  addImageInEditor(imageUrl, imageId) {
    const src = this.getMediaOriginURL(imageUrl);
    const baseUrl = _.get(this.editorService.editorConfig, 'context.host') || document.location.origin;
    this.mediaobj = {
      id: imageId,
      type: 'image',
      src,
      baseUrl
    };
    this.editorInstance.model.change(writer => {
      const imageElement = writer.createElement('image', {
        src,
        alt: imageId,
        'data-asset-variable': imageId
      });
      this.editorInstance.model.insertContent(imageElement, this.editorInstance.model.document.selection);
    });
    this.showImagePicker = false;
  }

  addVideoInEditor(videoModal?) {
    const videoData: any = _.cloneDeep(this.selectedVideo);
    videoData.src = this.getMediaOriginURL(videoData.downloadUrl);
    videoData.thumbnail = (videoData.thumbnail) && this.getMediaOriginURL(videoData.thumbnail);
    this.showVideoPicker = false;
    this.videoDataOutput.emit(videoData);
    if (videoModal) {
      videoModal.deny();
    }
  }


  getAllImages(offset, query?, search?) {
    this.assetsCount = 0;
    if (!search) {
      this.searchAllInput = '';
    }
    if (offset === 0) {
      this.allImages.length = 0;
    }
    const req = {
      filters: {
        mediaType: ['image']
      },
      offset
    };
    if (query) {
      req['query'] = query;
    }
    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.022') };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((res) => {
        this.assetsCount = res.result.count;
        _.map(res.result.content, (item) => {
          if (item.downloadUrl) {
            this.allImages.push(item);
          }
        });
      });
  }

  /**
   * function to get videos
   * @param offset page no
   */
  getMyVideos(offset, query?, search?) {
    this.assetsCount = 0;
    if (!search) {
      this.searchMyInput = '';
      this.selectVideo(undefined);
    }
    if (offset === 0) {
      this.myAssets.length = 0;
    }
    const req: any = {
      filters: {
        mediaType: ['video'],
        createdBy: _.get(this.editorService.editorConfig, 'context.user.id')
      },
      offset
    };

    if (query) {
      req.query = query;
    }

    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.023')};
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      this.assetsCount = res.result.count;
      _.map(res.result.content, (item) => {
        if (item.downloadUrl) {
          this.myAssets.push(item);
        }
      });
    });
  }

  getAllVideos(offset, query?, search?) {
    this.assetsCount = 0;
    if (!search) {
      this.searchAllInput = '';
      this.selectVideo(undefined);
    }
    if (offset === 0) {
      this.allVideos.length = 0;
    }
    const req: any = {
      filters: {
        mediaType: ['video'],
      },
      offset
    };
    if (query) {
      req.query = query;
    }

    this.questionService.getAssetMedia(req).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.023') };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      this.assetsCount = res.result.count;
      _.map(res.result.content, (item) => {
        if (item.downloadUrl) {
          this.allVideos.push(item);
        }
      });
    });
  }

  /**
   * function to lazy load my images
   */
  lazyloadMyImages() {
    const offset = this.myAssets.length;
    this.getMyImages(offset, this.query, true);
  }

  /**
   * function to lazy load all images
   */
  lazyloadAllImages() {
    const offset = this.allImages.length;
    this.getAllImages(offset, this.query, true);
  }


  lazyloadMyVideos() {
    const offset = this.myAssets.length;
    this.getMyVideos(offset, this.query, true);
  }

  /**
   * function to lazy load all videos
   */
  lazyloadAllVideos() {
    const offset = this.allVideos.length;
    this.getAllVideos(offset, this.query, true);
  }

  /**
   * function to upload image
   */
  uploadImage(event) {
    const file = event.target.files[0];
    this.assetName = file.name;
    const reader = new FileReader();
    this.formData = new FormData();
    this.formData.append('file', file);
    const fileType = file.type;
    const fileName = file.name.split('.').slice(0, -1).join('.');
    const fileSize = file.size / 1024 / 1024;
    if (fileType.split('/')[0] === 'image') {
      this.showErrorMsg = false;
      if (fileSize > this.assetConfig.image.size) {
        this.showErrorMsg = true;
        this.errorMsg = _.get(this.configService.labelConfig, 'messages.error.021')
         + this.assetConfig.image.size + this.assetConfig.image.sizeType;
        this.resetFormConfig();
      } else {
        this.errorMsg = '';
        this.showErrorMsg = false;
        reader.readAsDataURL(file);
      }
    } else {
      this.showErrorMsg = true;
      this.errorMsg = _.get(this.configService.labelConfig, 'messages.error.020');
    }
    if (!this.showErrorMsg) {
      this.imageUploadLoader = true;
      this.imageFormValid = true;
      this.assestData = this.generateAssetCreateRequest(fileName, fileType, 'image');
      this.populateFormData(this.assestData);
    }
  }
  resetFormConfig() {
    this.imageUploadLoader = false;
    this.imageFormValid = false;
    this.formConfig = this.initialFormConfig;
  }
  populateFormData(formData) {
    const formvalue = _.cloneDeep(this.formConfig);
    this.formConfig = null;
    _.forEach(formvalue, (formFieldCategory) => {
      formFieldCategory.default = formData[formFieldCategory.code];
      formFieldCategory.editable = true;
    });
    this.formConfig = formvalue;
  }
  uploadAndUseImage(modal) {
    this.questionService.createMediaAsset({ content: this.assestData }).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.019') };
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      const imgId = res.result.node_id;
      const request = {
        data: this.formData
      };
      this.questionService.uploadMedia(request, imgId).pipe(catchError(err => {
        const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.019') };
        return throwError(this.editorService.apiErrorHandling(err, errInfo));
      })).subscribe((response) => {
        this.addImageInEditor(response.result.content_url, response.result.node_id);
        this.dismissPops(modal);
      });
    });
  }
  openImageUploadModal() {
    this.showImageUploadModal = true;
    this.resetFormData();
  }
  dismissPops(modal) {
    this.dismissImagePicker();
    modal.deny();
  }
  onStatusChanges(event) {
    if (event.isValid && this.imageUploadLoader) {
      this.imageFormValid = true;
    } else {
      this.imageFormValid = false;
    }
  }
  valueChanges(event) {
    this.assestData = _.merge({}, this.assestData, event);
  }
  // search feature for images
  searchImages(event, type) {
    if (event === 'clearInput' && type === 'myImages') {
      this.query = '';
      this.searchMyInput = '';
    } else if (event === 'clearInput' && type === 'allImages') {
      this.query = '';
      this.searchAllInput = '';
    } else {
      this.query = event.target.value;
    }
    if (type === 'myImages') {
      this.getMyImages(0, this.query, true);
    } else {
      this.getAllImages(0, this.query, true);
    }
  }
  // general method
  resetFormData() {
    this.showErrorMsg = false;
    this.formData = null;
    this.formConfig = this.initialFormConfig;
    this.imageUploadLoader = false;
    this.imageFormValid = false;
  }
  /**
   * function to upload video
   */
  openVideoUploadModal() {
    this.showVideoUploadModal = true;
    this.resetFormData();
  }
  dismissVideoPops(modal) {
    if (this.isClosable) {
    this.dismissVideoPicker();
    modal.deny();
    }
  }
  uploadVideoFromLocal(event) {
    this.videoFile = event.target.files[0];
    const reader = new FileReader();
    this.formData = new FormData();
    this.formData.append('file', this.videoFile);
    const fileType = this.videoFile.type;
    const fileName = this.videoFile.name.split('.').slice(0, -1).join('.');
    const fileSize = this.videoFile.size / 1024 / 1024;
    if (_.includes(fileType.split('/'), 'video')) {
      this.showErrorMsg = false;
      if (fileSize > this.assetConfig.video.size) {
        this.showErrorMsg = true;
        this.errorMsg = _.get(this.configService.labelConfig, 'messages.error.021') +
         this.assetConfig.video.size + this.assetConfig.video.sizeType;
        this.resetFormConfig();
      } else {
        this.errorMsg = '';
        this.showErrorMsg = false;
        reader.readAsDataURL(this.videoFile);
      }
    } else {
      this.showErrorMsg = true;
      this.errorMsg = _.get(this.configService.labelConfig, 'messages.error.024');
    }
    if (!this.showErrorMsg) {
      this.imageUploadLoader = true;
      this.imageFormValid = true;
      this.assestData = this.generateAssetCreateRequest(fileName, fileType, 'video');
      this.populateFormData(this.assestData);
    }
  }
  uploadVideo(videoModal) {
    this.isClosable = false;
    this.loading = true;
    this.showErrorMsg = false;
    this.imageFormValid = false;
    if (!this.showErrorMsg) {
      this.questionService.createMediaAsset({ content: this.assestData }).pipe(catchError(err => {
        this.loading = false;
        this.isClosable = true;
        this.imageFormValid = true;
        const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.025') };
        return throwError(this.editorService.apiErrorHandling(err, errInfo));
      })).subscribe((res) => {
        const contentId = res.result.node_id;
        const request = {
          content: {
            fileName: this.videoFile.name
          }
        };
        this.questionService.generatePreSignedUrl(request, contentId).pipe(catchError(err => {
          const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.026') };
          this.loading = false;
          this.isClosable = true;
          this.imageFormValid = true;
          return throwError(this.editorService.apiErrorHandling(err, errInfo));
        })).subscribe((response) => {
          const signedURL = response.result.pre_signed_url;
          const config = {
            processData: false,
            contentType: 'Asset',
            headers: {
              'x-ms-blob-type': 'BlockBlob'
            }
          };
          this.uploadToBlob(signedURL, this.videoFile, config).subscribe(() => {
            const fileURL = signedURL.split('?')[0];
            this.updateContentWithURL(fileURL, this.videoFile.type, contentId, videoModal);
          });
        });
      });
    }
  }

  generateAssetCreateRequest(fileName, fileType, mediaType) {
    return {
      name: fileName,
      mediaType,
      mimeType: fileType,
      createdBy: _.get(this.editorService.editorConfig, 'context.user.id'),
      creator: _.get(this.editorService.editorConfig, 'context.user.fullName'),
      channel: _.get(this.editorService.editorConfig, 'context.channel')
    };
  }

  uploadToBlob(signedURL, file, config): Observable<any> {
    return this.questionService.http.put(signedURL, file, config).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.018') };
      this.isClosable = true;
      this.loading = false;
      this.imageFormValid = true;
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    }), map(data => data));
  }

  updateContentWithURL(fileURL, mimeType, contentId, videoModal?) {
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
      data,
      param: config
    };
    this.questionService.uploadMedia(option, contentId).pipe(catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService.labelConfig, 'messages.error.027') };
      this.isClosable = true;
      this.loading = false;
      this.imageFormValid = true;
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      // Read upload video data
      this.getUploadVideo(res.result.node_id, videoModal);
    });
  }

  getUploadVideo(videoId, videoModal?) {
    this.questionService.getVideo(videoId).pipe(map((data: any) => data.result.content), catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService, 'labelConfig.messages.error.011') };
      this.loading = false;
      this.isClosable = true;
      this.imageFormValid = true;
      return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })).subscribe(res => {
      this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.006'));
      this.selectedVideo = res;
      this.showAddButton = true;
      this.loading = false;
      this.isClosable = true;
      this.imageFormValid = true;
      this.addVideoInEditor(videoModal);
    });
  }

  searchMyVideo(event) {
    this.query = event.target.value;
    this.getMyVideos(0, this.query);
  }
  searchAllVideo(event) {
    this.query = event.target.value;
    this.getAllVideos(0, this.query);
  }
  // searchVideo feature
  searchVideo(event, type) {
    if (event === 'clearInput' && type === 'myVideos') {
      this.query = '';
      this.searchMyInput = '';
    } else if (event === 'clearInput' && type === 'allVideos') {
      this.query = '';
      this.searchAllInput = '';
    } else {
      this.query = event.target.value;
    }
    if (type === 'myVideos') {
      this.getMyVideos(0, this.query, true);
    } else {
      this.getAllVideos(0, this.query, true);
    }
  }
  selectVideo(data) {
    if (data) {
      this.showAddButton = true;
      this.selectedVideoId = data.identifier;
      this.selectedVideo = data;
    } else {
      this.showAddButton = false;
      this.selectedVideoId = '';
      this.selectedVideo = {};
    }

  }

  countCharacters(document) {
    const rootElement = document.getRoot();
    return this.countCharactersInElement(rootElement);
  }
  countCharactersInElement(node) {
    let chars = 0;
    const forEach = Array.prototype.forEach;
    const forE = node.getChildren();
    let child;

    while (!(child = forE.next()).done) {
      if (child.value.is('text')) {
        chars += child.value.data.length;
      } else if (child.value.is('element')) {
        chars += this.countCharactersInElement(child.value);
      }
    }
    return chars;
  }

  getMediaOriginURL(src) {
    const replaceText = this.assetProxyUrl;
    const cloudStorageUrls = _.get(this.editorService.editorConfig, 'context.cloudStorageUrls') || [];
    _.forEach(cloudStorageUrls, url => {
      if (src.indexOf(url) !== -1) {
        src = src.replace(url, replaceText);
      }
    });
    return src;
  }
  // Here Event listener is attached to document to listen the click event from Wiris plugin ('OK'-> button)
  attachEvent(editor) {
    document.addEventListener('click', e => {
      if (e.target && (e.target as Element).className === 'wrs_modal_button_accept') {
        editor.model.change(writer => {
          const insertPosition = editor.model.document.selection.getFirstPosition();
          writer.insertText(' ', insertPosition);
        });
      }
    });
  }
}
