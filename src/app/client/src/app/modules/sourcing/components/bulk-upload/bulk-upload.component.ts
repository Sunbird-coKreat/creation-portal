import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { UserService, ProgramsService, ActionService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService, IUserProfile } from '@sunbird/shared';
import { FineUploader } from 'fine-uploader';
import CSVFileValidator, { CSVFileValidatorResponse } from './csv-helper-util';
import * as _ from 'lodash-es';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
import { UUID } from 'angular2-uuid';
import { HelperService } from '../../services/helper.service';
import { ProgramTelemetryService } from '../../../program/services';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  @Input('sessionContext') sessionContext: any;
  @Input('sharedContext') sharedContext: any;
  @Input('programContext') programContext: any;
  @Input() storedCollectionData;
  @ViewChild('fineUploaderUI', {static: false}) fineUploaderUI: ElementRef;

  public process: any = {
    process_id: '',
    status: '',
    type: 'bulk_upload',
    overall_stats: {
      total: 0,
      upload_failed: 0,
      upload_pending: 0,
      upload_success: 0
    }
  };
  public mimeTypes: any = this.configService.contentCategoryConfig.sourcingConfig.files
  public oldProcessStatus = '';
  public stageStatus = '';
  public contentTypes: Array<any> = [];
  public unitsInLevel: Array<any> = [];
  public licenses: Array<any> = [];
  public unitGroup: any;
  public uploadCsvConfig: any;
  public contents: Array<any> = [];
  public completionPercentage = 0;
  public showBulkUploadModal: boolean = false;
  public bulkUploadState: number = 0;
  public loading: boolean = false;
  public telemetryPageId: string;
  public assetConfig: any = {
    csv: {
      accepted: 'csv',
      size: 50
    }
  };
  uploader;
  public bulkUploadConfig = {
    maxRows: 300,
    fileFormats: ['pdf', 'html', 'epub', 'h5p', 'mp4', 'webm', 'mp3']
  };
  public catFormatMapping = {};
  public bulkUploadErrorMsgs = [];
  public bulkUploadValidationError = '';
  public levels = [];
  //public sampleMetadataCsvUrl: string = (<HTMLInputElement>document.getElementById('portalCloudStorageUrl')).value.split(',')  + 'bulk-content-upload-format.csv';
  public sampleMetadataCsvUrl: string = 'bulk-content-upload-format.csv';

  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public userProfile: IUserProfile;
  public unsubscribe = new Subject<void>();
  constructor(
    private userService: UserService,
    private resourceService: ResourceService,
    private toasterService: ToasterService,
    private bulkJobService: BulkJobService,
    private programsService: ProgramsService,
    private helperService: HelperService,
    public actionService: ActionService,
    public programTelemetryService: ProgramTelemetryService, public configService: ConfigService
  ) { }

   ngOnInit() {
    this.userService.userData$.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((user: any) => {
      if (user && !user.err) {
        this.userProfile = user.userProfile;
      }
    });
    this.checkBulkUploadStatus();
    this.stageStatus = this.getContentStatus();
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.sessionContext.collection, 'Content', '1.0');
    this.telemetryPageId = this.sessionContext.telemetryPageDetails.telemetryPageId;
  }

  getContentTypes() {
    const req = [];
    const appFilesConfig = this.configService.contentCategoryConfig.sourcingConfig.files;
    this.contentTypes = _.get(this.sessionContext, 'nominationDetails.content_types');
    return new Promise((resolve) => {
      _.forEach(this.contentTypes, (contentType) => {
        this.catFormatMapping[_.toLower(contentType)] = [];
        req.push(this.programsService.getCategoryDefinition(contentType, this.programContext.rootorg_id));
      });

      forkJoin(req).subscribe((res)=> {
        let mapped_array = _.map(res, (obj) => {
          const catDef = _.get(obj, 'result.objectCategoryDefinition');
          if (!_.isEmpty(_.get(catDef, 'objectMetadata.schema.properties.mimeType.enum'))) {
            const supportedMimeTypes = catDef.objectMetadata.schema.properties.mimeType.enum;
            let tempEditors = _.map(supportedMimeTypes, (mimetype) => {
              if (!_.isEmpty(appFilesConfig[mimetype])) {
                this.catFormatMapping[_.toLower(catDef.name)].push(appFilesConfig[mimetype]);
                if (mimetype === "application/vnd.ekstep.html-archive") {
                  this.catFormatMapping[_.toLower(catDef.name)].push('html');
                }
              }
            });
          }
          return obj;
        })
        resolve(this.catFormatMapping);
      });
    });
  }

  getLicences() {
    this.helperService.getLicences().subscribe((res) => {
      this.licenses = res.license;
    });
  }

  getDownloadableLink(url: string) {
    const match = 'https://drive.google.com/file/d/';
    if (!url.includes(match)) {
      return url;
    }

    const id = _.split(_.nth(_.split(url, match, 2), 1), '/', 1);
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }

  getChapters() {
    const hierarchy = _.get(this.sessionContext, 'hierarchyObj.hierarchy');
    this.levels = _.filter(hierarchy, (unit, identifier) => {
      unit.identifier = identifier;
      return (unit.root === false && unit.mimeType === 'application/vnd.ekstep.content-collection')
    }).map((unit) => {
      return { identifier: unit.identifier, name: unit.name, parent: unit.parent }
    });
  }

  calculateCompletionPercentage() {
    this.completionPercentage = 0;
    // console.log('process.overall_stats', this.process.overall_stats);
    const { total, upload_pending } = this.process.overall_stats;

    this.completionPercentage = parseInt(_.toNumber(100 - ((upload_pending / total) * 100)));
    // console.log('completionPercentage',  this.completionPercentage);
  }

  checkBulkUploadStatus() {
    const reqData = {
      filters: {
        program_id: _.get(this.programContext, 'program_id', ''),
        collection_id: _.get(this.sessionContext, 'collection', ''),
        type: 'bulk_upload',
        createdby: _.get(this.userService, 'userid', '')
      },
      limit: 1
    };
    this.bulkJobService.getBulkOperationStatus(reqData)
      .subscribe((statusResponse) => {
        const count = _.get(statusResponse, 'result.count', 0);
        if (!count) {
          return;
        }

        this.process = _.first(_.get(statusResponse, 'result.process', []));
        this.oldProcessStatus = this.process.status;
        // console.log('process', JSON.stringify(this.process));
        this.searchContentWithProcessId();
        this.bulkUploadState = 5;
      }, (error) => {
        console.log(error);
      });
  }

  searchContentWithProcessId() {
    this.bulkJobService.searchContentWithProcessId(this.process.process_id, 'bulk_upload').subscribe((searchResponse) => {
      // console.log('searchResponse res', JSON.stringify(searchResponse));
      this.process.overall_stats.upload_failed = 0;
      this.process.overall_stats.upload_success = 0;
      this.process.overall_stats.upload_pending = 0;

      if (_.get(searchResponse, 'result.count', 0) > 0) {
        this.contents = _.get(searchResponse, 'result.content');
        let status = this.stageStatus;
        if (status === 'review') {
          status = 'Review';
        } else if (status === 'publish') {
          status = 'Live';
        }
        _.each(this.contents, (content) => {
          if (content.status === 'Failed') {
            this.process.overall_stats.upload_failed++;
          } else if (content.status === status) {
            this.process.overall_stats.upload_success++;
          } else {
            this.process.overall_stats.upload_pending++;
          }
        });

        this.process.overall_stats.upload_pending = this.process.overall_stats.total -
        (this.process.overall_stats.upload_success + this.process.overall_stats.upload_failed);

        if (this.process.overall_stats.upload_pending === 0) {
          this.process.status = 'completed';
        }

        const req = {
          url: `content/v3/hierarchy/${this.sessionContext.collection}`,
          param: { 'mode': 'edit' }
        };
        this.actionService.get(req).subscribe((response) => {
          const children = [];
          _.forEach(response.result.content.children, (child) => {
            if (child.mimeType !== 'application/vnd.ekstep.content-collection' ||
            (child.mimeType === 'application/vnd.ekstep.content-collection' && child.openForContribution === true)) {
              children.push(child);
            }
          });

          response.result.content.children = children;
          this.storedCollectionData = response.result.content;
          this.calculateCompletionPercentage();
          // console.log('updated process:', JSON.stringify(this.process));
          if (this.oldProcessStatus !== this.process.status) {
            this.updateJob();
          }

        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  tree(ob) {
    _.forEach(ob.chi, bb => {
      if (bb.contentType === 'TextBookUnit') {
        this.unitGroup.push({ name: bb.name, identifier: bb.identifier });
      }
      if (bb.chi) {
        this.tree(bb);
      }
    });
  }

  findFolderLevel({ children = [], ...object }, identifier) {
    let result;
    if (object.identifier === identifier) {
      return object;
    }
    return children.some(o => result = this.findFolderLevel(o, identifier)) && Object.assign({}, object, { chi: [result] });
  }

  downloadReport() {
    this.unitsInLevel = _.map(this.contents, content => {
      return this.findFolderLevel(this.storedCollectionData, content.identifier);
    });

    try {
      const headers = _.map(this.uploadCsvConfig.headers, header => header.name);
      headers.push('Status');
      headers.push('Reason for failure');

      const tableData = _.map(this.contents, (content, i) => {
        let result = {};
        result['name'] = _.get(content, 'name', '');
        result['description'] = _.get(content, 'description', '');
        result['keywords'] = _.join(_.get(content, 'keywords', []), ', ');
        result['audience'] = _.first(_.get(content, 'audience', ''));
        result['creator'] = _.get(content, 'creator', '');
        result['copyright'] = _.get(content, 'copyright', '');
        result['license'] = _.get(content, 'license', '');
        result['attributions'] = _.join(_.get(content, 'attributions', []), ', ');
        result['appIcon'] = _.get(content, 'appIcon', '');
        result['fileFormat'] = this.getFileFormat(_.get(content, 'mimeType', ''));
        result['source'] = _.get(content, 'source', '');
        result['contentType'] = _.get(content, 'primaryCategory');

        const folderStructure = this.unitsInLevel[i];
        this.unitGroup = [];
        this.tree(folderStructure);

        result['level1'] = '';
        result['level2'] = '';
        result['level3'] = '';
        result['level4'] = '';

        if (this.unitGroup.length > 0) {
          result['level1'] = _.get(this.unitGroup, '[0].name', '');
          result['level2'] = _.get(this.unitGroup, '[1].name', '');
          result['level3'] = _.get(this.unitGroup, '[2].name', '');
          result['level4'] = _.get(this.unitGroup, '[3].name', '');
        }

        let status = _.get(content, 'status', '');
        if ((this.stageStatus === 'review' && status === 'Review') || (this.stageStatus === 'publish' && status === 'Live')) {
          status = 'Success';
        }
        result['status'] = status
        result['failedReason'] = _.get(content, 'importError', '') ||  _.get(content, 'publishError', '');

        return result;
      });

      const csvDownloadConfig = {
        filename: `Bulk Upload ${this.storedCollectionData.name.trim()}`,
        tableData: tableData,
        headers: headers,
        showTitle: false
      };
      // console.log('csvDownloadConfig:', JSON.stringify(csvDownloadConfig));
      this.programsService.generateCSV(csvDownloadConfig);
    } catch (err) {
      console.log(err);
      this.toasterService.error(this.resourceService.messages.emsg.bulkUpload.somethingFailed);
    }
  }

  getFileFormat(mimeType) {
    return this.mimeTypes[mimeType];
  }

  getMimeType (fileFormat) {
    fileFormat = (fileFormat == 'html') ? 'zip' : fileFormat;
    return _.findKey(this.mimeTypes, (value) => value === fileFormat);
  }

  updateJob() {
    const reqData = {
      process_id: this.process.process_id,
      overall_stats: this.process.overall_stats,
      status: this.process.status,
      updatedby: _.get(this.userService, 'userid')
    };
    this.bulkJobService.updateBulkJob(reqData)
      .subscribe((updateResponse) => {
        if (this.process.status === 'completed') {
          this.bulkUploadState = 6;
        } else if (this.process.status === 'processing') {
          this.bulkUploadState = 5;
        }
        this.oldProcessStatus = this.process.status;
      }, (error) => {
        console.log(error);
      });
  }

  initiateDocumentUploadModal() {
    this.loading = false;
    this.bulkUploadValidationError = '';
    this.bulkUploadErrorMsgs = [];
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
        allowedExtensions: [this.assetConfig.csv.accepted],
        acceptFiles: ['text/csv'],
        itemLimit: 1,
        sizeLimit: _.toNumber(this.assetConfig.csv.size) * 1024 * 1024  // Convert into MB
      },
      messages: {
        sizeError: `{file} is too large, maximum file size is ${this.assetConfig.csv.size} MB.`,
        typeError: `Invalid content type (supported type: ${this.assetConfig.csv.accepted})`
      },
      callbacks: {
        onStatusChange: () => { },
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
    const file = this.uploader.getFile(0);
    if (file == null) {
      this.toasterService.error('File is required to upload');
      this.uploader.reset();
      return;
    }

    this.bulkUploadState = 3;
    const csvValidator = new CSVFileValidator(this.uploadCsvConfig);
    csvValidator.validate(file).then((csvData: CSVFileValidatorResponse) => {
      if (this.bulkUploadValidationError) {
        this.uploader.reset();
        this.bulkUploadState = 4;
        return;
      }
      this.startBulkUpload(csvData.data);
    }).catch(err => {
        this.uploader.reset();
        console.log(err);
      });
  }

  setBulkUploadCsvConfig() {
    const headerError = (headerName) => {
      this.setError(`${headerName} header is missing.`);
    };
    const requiredError = (headerName, rowNumber, columnNumber) => {
      this.setError(`${headerName} value is missing at row: ${rowNumber}`);
    };
    const uniqueError = (headerName, rowNumber, columnNumber, value) => {
      this.setError(`${headerName} has duplicate value at row: ${rowNumber}`);
    };
    const inError = (headerName, rowNumber, columnNumber, acceptedValues, value) => {
      this.setError(`${headerName} has invalid value at row: ${rowNumber}`);
    };
    const urlError = (headerName, rowNumber, columnNumber, value) => {
      this.setError(`${headerName} has invalid url value at row: ${rowNumber}`);
    };
    const maxLengthError = (headerName, rowNumber, columnNumber, maxLength, length) => {
      this.setError(`Length of ${headerName} exceeds ${maxLength}. Please give a shorter ${headerName} at row: ${rowNumber}`);
    };
    const extraHeaderError = (invalidColumns, expectedColumns, foundColumns) => {
      this.setError(`Invalid data found in columns: ${invalidColumns.join(',')}`);
    };

    const contentTypes = this.contentTypes;//_.union(_.concat(this.contentTypes.map((type) => type.name), this.contentTypes.map((type) => type.value)));
    const licenses = this.licenses.map((license) => license.name);

    const headers = [
      { name: 'Name of the Content', inputName: 'name', maxLength: 50, required: true, requiredError, headerError, maxLengthError },
      { name: 'Description of the content', inputName: 'description', maxLength: 500, maxLengthError, headerError },
      { name: 'Keywords', inputName: 'keywords', isArray: true, headerError },
      // tslint:disable-next-line:max-line-length
      { name: 'Audience', inputName: 'audience', required: true, requiredError, headerError, in: ['Student', 'Teacher', 'Administrator'], inError },
      { name: 'Author', inputName: 'creator', required: true, requiredError, headerError },
      { name: 'Copyright', inputName: 'copyright', required: true, requiredError, headerError },
      { name: 'License', inputName: 'license', in: licenses, inError, isDefault: true, default: '', headerError },
      { name: 'Attributions', inputName: 'attributions', isArray: true, headerError },
      { name: 'Icon File Path', inputName: 'appIcon', required: true, requiredError, headerError, isUrl: true, urlError },
      { name: 'File Format', inputName: 'fileFormat', required: true, requiredError, headerError, in: this.bulkUploadConfig.fileFormats, inError },
      { name: 'File Path', inputName: 'source', required: true, requiredError, headerError, unique: true, uniqueError, isUrl: true, urlError },
      { name: 'Content Type', inputName: 'contentType', required: true, requiredError, headerError, in: contentTypes, inError },
      { name: 'Level 1 Textbook Unit', inputName: 'level1', required: true, requiredError, headerError },
      { name: 'Level 2 Textbook Unit', inputName: 'level2', headerError },
      { name: 'Level 3 Textbook Unit', inputName: 'level3', headerError },
      { name: 'Level 4 Textbook Unit', inputName: 'level4', headerError },
    ];

    const validateRow = (row, rowIndex) => {
      if (_.isEmpty(row.level4) && _.isEmpty(row.level3) && _.isEmpty(row.level2) && _.isEmpty(row.level1)) {
        const name = headers.find((r) => r.inputName === 'level1').name || '';
        this.setError(`${name} is missing at row: ${rowIndex}`);
        return;
      } else if (_.isEmpty(row.level3) && !_.isEmpty(row.level4)) {
        const name = headers.find((r) => r.inputName === 'level3').name || '';
        this.setError(`${name} is missing at row: ${rowIndex}`);

        if (_.isEmpty(row.level2)) {
          const name = headers.find((r) => r.inputName === 'level2').name || '';
          this.setError(`${name} is missing at row: ${rowIndex}`);
        }

        if (_.isEmpty(row.level1)) {
          const name = headers.find((r) => r.inputName === 'level1').name || '';
          this.setError(`${name} is missing at row: ${rowIndex}`);
        }
        return;
      } else if (_.isEmpty(row.level2) && !_.isEmpty(row.level3)) {
        const name = headers.find((r) => r.inputName === 'level2').name || '';
        this.setError(`${name} is missing at row: ${rowIndex}`);

        if (_.isEmpty(row.level1)) {
          const name = headers.find((r) => r.inputName === 'level1').name || '';
          this.setError(`${name} is missing at row: ${rowIndex}`);
        }
        return;
      } else if (_.isEmpty(row.level1) && !_.isEmpty(row.level2)) {
        const name = headers.find((r) => r.inputName === 'level1').name || '';
        this.setError(`${name} is missing at row: ${rowIndex}`);
        return;
      }

      // Validate the textbook level units
      const keys = ['level1', 'level2', 'level3', 'level4'];
      _.map(keys, key => {
        const value = row[key];
        if (!_.isEmpty(value) && _.isEmpty(this.getTextbookUnitIdFromName(value))) {
          const name = headers.find((r) => r.inputName === key).name || '';
          this.setError(`${name} is invalid at row: ${rowIndex}`);
        }
      });

      // Validate the content types
      row.contentType = _.toLower(row.contentType);
      const contentType = _.find(this.contentTypes, (content_type) => {
          return (_.toLower(content_type) === row.contentType);
      });
      if (_.isEmpty(contentType)) {
        this.setError(`Content Type has invalid value at row: ${rowIndex}`);
        this.bulkUploadState = 4;
        return;
      }
      row.contentType = contentType;

      // Validate if content type supports uploading format
      if (_.isEmpty(this.catFormatMapping[_.toLower(row.contentType)])) {
        this.setError(`Content Type value at row: ${rowIndex} is not supported for bulk upload`);
        this.bulkUploadState = 4;
        return;
      }

      // Validate if content type supports given format
      if (!_.includes(this.catFormatMapping[_.toLower(row.contentType)], _.toLower(row.fileFormat))) {
        this.setError(`File format has invalid value at row: ${rowIndex} . Supported formats are ` + _.join(this.catFormatMapping[_.toLower(row.contentType)], ','));
        this.bulkUploadState = 4;
        return;
      }
    };
    const maxRowsError = (maxRows, actualRows) => {
      this.setError(`Expected max ${maxRows} rows but found ${actualRows} rows in the file`);
    };
    const noRowsError = () => {
      this.setError(`Empty rows in the file`);
    };

    this.uploadCsvConfig = {
      headers: headers,
      maxRows: this.bulkUploadConfig.maxRows,
      validateRow,
      maxRowsError,
      noRowsError,
      extraHeaderError
    };
  }

  getTextbookUnitIdFromName(name) {
    const unit = _.find(this.levels, { name: name });
    return _.get(unit, 'identifier', '');
  }

  getUnitIdFromName(row) {
    const level1 = row.level1;
    const level1unitId = this.getTextbookUnitIdFromName(level1);
    if (row.level2) {
      const level2Details = this.getNodebyDeatils(level1unitId, row.level2);
      if (row.level3) {
        const level3Details = this.getNodebyDeatils(level2Details.identifier, row.level3);
        if (row.level4) {
          const level4Details = this.getNodebyDeatils(level3Details.identifier, row.level4);
          return level4Details.identifier;
        }
        return level3Details.identifier;
      }
      return level2Details.identifier;
    }
    return level1unitId;
  }


  getNodebyDeatils(unitId, name) {
    const groupedData = _.mapValues(_.groupBy(this.levels, 'parent'), clist => clist.map(level => _.omit(level, 'parent')));
    const selectedData = _.get(groupedData, unitId);
    const unit = _.find(selectedData, { name: name });
    return unit;
  }

  viewDetails($event) {
    $event.preventDefault();
    this.showBulkUploadModal = true;
    if (this.process.status === 'processing') {
      this.bulkUploadState = 5;
      this.checkBulkUploadStatus();
    } else {
      this.setBulkUploadCsvConfig();
      this.bulkUploadState = 6;
    }
  }

  createImportRequest(csvData) {
    const request = { content: [] };
    _.forEach(csvData, (row) => {
      request.content.push(this.getContentObject(row));
    });
    return this.bulkJobService.createBulkImport(request);
  }

  getContentStatus() {
    // If individual
    if (!this.isContributorOrgUser()) {
      return 'publish';
    }

    // If user from other org
    if (!this.isDefaultContributingOrg()) {
      return 'review';
    }

    // If user from same org then check for skip review option
    return _.get(this.programContext, 'config.defaultContributeOrgReview') ? 'review' : 'publish';
  }

  isContributorOrgUser() {
    return !!(this.userService.userRegistryData && this.userProfile.userRegData &&
      this.userProfile.userRegData.User_Org);
  }

  isDefaultContributingOrg() {
    return !!(this.userProfile.userRegData
      && this.userProfile.userRegData.Org
      && this.programContext.sourcing_org_name === this.userProfile.userRegData.Org.name);
  }

  getContentObject(row) {
    const unitName = row.level4 || row.level3 || row.level2 || row.level1;
    const unitId = this.getUnitIdFromName(row);
    const userId = _.get(this.userService, 'userid');
    const collectionId = _.get(this.sessionContext, 'collection', '');
    const source = this.getDownloadableLink(row.source);
    const license = _.get(row, 'license');
    const organisationId =  _.get(this.sessionContext, 'nominationDetails.organisation_id');

    const reqBody = this.sharedContext.reduce((obj, context) => {
      return { ...obj, [context]: this.sessionContext[context] };
    }, {});
    const sharedMetaData = this.helperService.fetchRootMetaData(this.sharedContext, this.sessionContext);
    const content = {
      stage: this.stageStatus,
      metadata: {
        name: row.name,
        description: row.description,
        source: source,
        artifactUrl: source,
        appIcon: this.getDownloadableLink(row.appIcon),
        creator: row.creator,
        audience: [_.upperFirst(_.toLower(row.audience))],
        code: UUID.UUID(),
        mimeType: this.getMimeType(_.toLower(row.fileFormat)),
        primaryCategory: row.contentType,
        lastPublishedBy: userId,
        createdBy: userId,
        collectionId: collectionId,
        programId: _.get(this.sessionContext, 'programId', ''),
        unitIdentifiers: [unitId],
        copyright: row.copyright,
        attributions: row.attributions,
        keywords: row.keywords,
        contentPolicyCheck: true,
        ...(_.pickBy(sharedMetaData, _.identity))
      },
      collection: [{
        identifier: collectionId,
        unitId: unitId
      }]
    };

    if (!_.isEmpty(license)) {
      content.metadata.license = license;
    }
    if (!_.isEmpty(organisationId)) {
      content.metadata.organisationId = organisationId;
    }

    return content;
  }

  createJobRequest(rowsCount) {
    this.bulkUploadState = 5;
    const org_id = _.get(this.userProfile, 'userRegData.User_Org.orgId', null);
    const createdby = _.get(this.userService, 'userid');
    const program_id = _.get(this.programContext, 'program_id');
    const collection_id = _.get(this.sessionContext, 'collection');

    this.process.overall_stats = {
      total: rowsCount,
      upload_pending: rowsCount,
      upload_failed: 0,
      upload_success: 0
    };
    this.process['data'] = {
      program_id: program_id,
      collection_id: collection_id
    };
    this.process['createdon'] = new Date();
    this.process['createdby'] = createdby;
    this.process['program_id'] = program_id;
    this.process['collection_id'] = collection_id;
    this.process.status = 'processing';

    if (org_id) {
      this.process['data']['org_id'] = org_id;
      this.process['org_id'] = org_id;
    }

    const request = { ...this.process };

    return this.bulkJobService.createBulkJob(request);
  }

  startBulkUpload(csvData) {
    this.completionPercentage = 0;
    this.createImportRequest(csvData).subscribe((importResponse) => {
      this.process.process_id = _.get(importResponse, 'result.processId');
      this.createJobRequest(csvData.length)
        .subscribe((jobResponse) => {
          this.process = _.get(jobResponse, 'result');
          this.oldProcessStatus = this.process.status;
          this.calculateCompletionPercentage();
        }, (error) => {
          console.log(error);
        });
    }, (error) => {
      console.log(error);
    });
  }

  setError(message) {
    this.bulkUploadValidationError = _.get(this.resourceService, 'frmelmnts.lbl.bulkUploadErrorMessage');
    this.bulkUploadErrorMsgs.push(message);
  }

  async openBulkUploadModal() {
    const mappping = await this.getContentTypes();
    this.getLicences();
    this.getChapters();
    this.setBulkUploadCsvConfig();
    this.bulkUploadState = 0;
    this.showBulkUploadModal = true;
    this.updateBulkUploadState('increment');
  }

  closeBulkUploadModal() {
    this.showBulkUploadModal = false;
    this.bulkUploadState = 0;
    if (this.uploader) {
      this.uploader.reset();
    }
  }

  updateBulkUploadState(action) {
    if (this.bulkUploadState === 6 && action === 'increment') {
      return this.closeBulkUploadModal();
    }
    if (this.bulkUploadState === 4 && action === 'decrement') {
      this.bulkUploadState = 3;
    }
    this.bulkUploadState += (action === 'increment') ? 1 : -1;
    if (this.bulkUploadState === 2) {
      this.initiateDocumentUploadModal();
    }
  }
}
