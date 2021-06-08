import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PublicDataService, UserService, ActionService, FrameworkService, ProgramsService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService, BrowserCacheTtlService, 
  ServerResponse } from '@sunbird/shared';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
import { HelperService } from '../../services/helper.service';
import { ProgramTelemetryService } from '../../../program/services';
import { CacheService } from 'ng2-cache-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash-es';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bulk-approval',
  templateUrl: './bulk-approval.component.html',
  styleUrls: ['./bulk-approval.component.scss']
})
export class BulkApprovalComponent implements OnInit, OnChanges {

  public showBulkApproveModal = false;
  public bulkApprovalComfirmation = false;
  public showBulkApprovalButton = false;
  public approvalPending: Array<any> = [];
  public folderData: Array<any> = [];
  public originFolderData: Array<any> = [];
  public dikshaContents: Array<any>;
  public unitsInLevel: Array<any> = [];
  public unitGroup: any;
  public bulkApprove: any;
  public processId: string;
  public successPercentage: number;
  public initialized: boolean;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;
  @Input() programContext;
  @Input() sessionContext;
  @Input() storedCollectionData;
  @Input() originalCollectionData;
  @Output() updateToc = new EventEmitter<any>();

  constructor(public resourceService: ResourceService, private bulkJobService: BulkJobService,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private userService: UserService, private programsService: ProgramsService, private httpClient: HttpClient,
    public toasterService: ToasterService, public publicDataService: PublicDataService, private helperService: HelperService,
    private actionService: ActionService, public programTelemetryService: ProgramTelemetryService, public configService: ConfigService) { }

  ngOnInit() {
    this.checkBulkApproveHistory();
    this.checkOriginFolderStatus([this.originalCollectionData]);
    this.approvalPendingContents([this.storedCollectionData]);
    this.initialized = true;
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.sessionContext.collection, 'Content', '1.0', { l1: this.sessionContext.collection });
    this.telemetryPageId = this.sessionContext.telemetryPageDetails.telemetryPageId;
  }

  ngOnChanges() {
    if (this.initialized) {
      this.approvalPending = [];
      this.approvalPendingContents([this.storedCollectionData]);
      if (this.approvalPending && this.approvalPending.length) {
        if (!this.bulkApprove || this.bulkApprove && this.bulkApprove.status !== 'processing') {
          this.showBulkApprovalButton = true;
        }
      }
    }
  }

  approvalPendingContents(hierarchy) {
    _.forEach(hierarchy, obj => {
      const isMainCollection = this.helperService.checkIfMainCollection(obj);
      const isCollectionFolder = this.helperService.checkIfCollectionFolder(obj);
      if (isMainCollection || isCollectionFolder) {
        const unit = _.pick(obj, ['identifier', 'origin']);
        if (isMainCollection) {
          const originUnit = _.find(this.originFolderData, o => o.identifier === unit.origin && o.status === 'Draft');
          if (originUnit) {
            this.folderData.push({identifier: obj.identifier, origin: obj.origin});
          }
        }
        if (isCollectionFolder) {
          const originUnit = _.find(this.originFolderData, o => o.identifier === unit.origin);
          if (originUnit) {
            this.folderData.push({identifier: obj.identifier, origin: obj.origin});
          }
        }
      }

      if (!isMainCollection && !isCollectionFolder && obj.status === 'Live' && this.checkApprovalPending(obj)) {
          const content = _.pick(obj, ['name', 'code', 'mimeType', 'framework', 'contentType', 'identifier', 'parent']);
          const unitData = _.find(this.folderData, data => data.identifier === content.parent);
          if (unitData) {
            content['originUnitId'] = unitData.origin;
            if (!_.find(this.approvalPending, cont => cont.identifier === content.identifier)) {
              this.approvalPending.push(content);
            }
          }
      }
      if (obj.children && obj.children.length) {
        this.approvalPendingContents(obj.children);
      }
    });
  }

  checkApprovalPending(content) {
    const reviewedContents = [...this.storedCollectionData.acceptedContents || [],
                                    ...this.storedCollectionData.rejectedContents || []];
    if (reviewedContents && reviewedContents.length &&
      _.includes(reviewedContents, content.identifier)) {
         return false;
   } else {
     return true;
   }
  }

  checkOriginFolderStatus(hierarchy) {
    _.forEach(hierarchy, obj => {
      const isMainCollection = this.helperService.checkIfMainCollection(obj);
      const isCollectionFolder = this.helperService.checkIfCollectionFolder(obj);
      if (isMainCollection || isCollectionFolder) {
        this.originFolderData.push({identifier: obj.identifier, status: obj.status});
      }
      if (obj.children && obj.children.length) {
        this.checkOriginFolderStatus(obj.children);
      }
    });
  }

  bulkApproval() {
    this.sendContentForBulkApproval();
  }

  sendContentForBulkApproval() {
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
    ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : window.location.origin;
    const contents = _.compact(_.map(this.approvalPending, contnet => {
      if (contnet.originUnitId) {
        const channel =  _.get(this.storedCollectionData.originData, 'channel');
        if (_.isString(channel)) {
          contnet['createdFor'] = [channel];
        } else if (_.isArray(channel)) {
          contnet['createdFor'] = channel;
        }
        const reqFormat = {
          source: `${baseUrl}/api/content/v1/read/${contnet.identifier}`,
          metadata: {..._.pick(this.storedCollectionData, ['framework']),
                       ..._.pick(_.get(this.storedCollectionData, 'originData'), ['channel']),
                        ..._.pick(contnet, ['name', 'code', 'mimeType', 'contentType', 'createdFor']),
                          ...{lastPublishedBy: this.userService.userProfile.userId}},
          collection: [
            {
              identifier: this.storedCollectionData.origin,
              unitId: contnet.originUnitId
            }
          ]
        };
        return reqFormat;
      }
    }));
    if (contents && contents.length) {
      const data = {
        request: {
          content: [
            ...contents
          ]
        }
      };
      this.httpClient.post('learner/content/v1/import', data).subscribe((res: any) => {
        if (res && res.result && res.result.processId) {
          this.processId = res.result.processId;
          this.createBulkApprovalJob();
          this.updateCollection();
        }
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
      });
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
    }
  }

  createBulkApprovalJob() {
    const reqData = {
      process_id: this.processId,
      program_id: this.programContext.program_id,
      collection_id: this.sessionContext.collection,
      org_id: this.userService.userProfile.rootOrgId || '',
      type: 'bulk_approval',
      status: 'processing',
      overall_stats: {
        approve_success: 0,
        approve_failed: 0,
        approve_pending: this.approvalPending.length,
        total: this.approvalPending.length
      },
      createdby: this.userService.userProfile.userId,
      createdon: new Date()
    };
    this.bulkJobService.createBulkJob(reqData).subscribe(res => {
      this.bulkApprove = reqData;
      this.bulkJobService.setProcess(this.bulkApprove);
      this.showBulkApprovalButton = false;
      this.toasterService.success(this.resourceService.messages.smsg.bulkApprove.create);
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
    });
  }

  updateBulkApprovalJob() {
    if (!_.get(this.bulkApprove, 'overall_stats.approve_pending')) {
      this.bulkApprove.status = 'completed';
      this.bulkApprove['completedon'] = new Date();
    }
    const request = _.pick(this.bulkApprove, ['process_id', 'status', 'overall_stats', 'completedon']);
    request['updatedby'] = this.userService.userProfile.userId;
    this.bulkJobService.updateBulkJob(request).subscribe((res: any) => {
      if (this.bulkApprove.status === 'completed') {
        this.showBulkApprovalButton = true;
      }
      this.bulkJobService.setProcess(this.bulkApprove);
      this.toasterService.success(this.resourceService.messages.smsg.bulkApprove.update);
    }, err => {
      this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
    });
  }

  updateCollection() {
    const option = {
      url: 'content/v3/read/' + this.sessionContext.collection,
      param: { 'mode': 'edit', 'fields': 'acceptedContents,versionKey' }
    };
    this.actionService.get(option).pipe(map((res: any) => res.result.content)).subscribe((data) => {
      const request = {
        content: {
          'versionKey': data.versionKey
        }
      };
      // tslint:disable-next-line:max-line-length
      request.content['acceptedContents'] = _.compact(_.uniq([...this.storedCollectionData.acceptedContents || [],
                                            ..._.map(_.filter(this.approvalPending, content => content.originUnitId), 'identifier')]));
      this.helperService.updateContent(request, this.sessionContext.collection).subscribe(res => {
        this.updateToc.emit('bulkApproval_completed');
        this.showBulkApprovalButton = false;
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.updateToc);
      });
    });
  }

  viewBulkApprovalStatus() {
    if (this.bulkApprove && this.bulkApprove.status === 'processing') {
      this.bulkJobService.searchContentWithProcessId(this.bulkApprove.process_id, this.bulkApprove.type).subscribe((res: any) => {
        if (res.result && res.result.content && res.result.content.length) {
          const overallStats = this.bulkApprove && this.bulkApprove.overall_stats;
          this.dikshaContents = _.get(res, 'result.content');

          overallStats['approve_success'] = _.filter(this.dikshaContents, content => content.status === 'Live').length;
          // tslint:disable-next-line:max-line-length
          overallStats['approve_failed'] = _.filter(this.dikshaContents, content => content.status === 'Failed').length;
          overallStats['approve_pending'] = overallStats.total - (overallStats['approve_success'] + overallStats['approve_failed']);
          this.bulkApprove.overall_stats = overallStats;
          // tslint:disable-next-line:max-line-length
          this.successPercentage = Math.round((this.bulkApprove.overall_stats.approve_success / this.bulkApprove.overall_stats.total) * 100);
          this.updateBulkApprovalJob();
          } else {
          this.successPercentage = 0;
        }
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
      });
    }
  }

  findFolderLevel({ children = [], ...object }, identifier) {
    let result;
    if (object.identifier === identifier) {
      return object;
    }
    return children.some(o => result = this.findFolderLevel(o, identifier)) && Object.assign({}, object, { chi: [result] });
  }

  tree(ob) {
    _.forEach(ob.chi, bb => {
      if (this.helperService.checkIfCollectionFolder(bb)) {
        this.unitGroup.push({name: bb.name, identifier: bb.identifier});
      }
      if (bb.chi) {
        this.tree(bb);
      }
    });
  }

  prepareTableData() {
    const failedContent = _.filter(this.dikshaContents, content => content.status === 'Failed');
    this.unitsInLevel = _.map(failedContent, content => {
      return this.findFolderLevel(this.storedCollectionData, content.origin);
    });

    try {
      const headers = [
       // tslint:disable-next-line:max-line-length
       'identifier', 'name', 'contentType', 'Level 1 Textbook Unit', 'Level 2 Textbook Unit', 'Level 3 Textbook Unit', 'Level 4 Textbook Unit'
      ];
      const tableData = _.map(failedContent, (con, i) => {
        const result = _.pick(con, ['identifier', 'name', 'primaryCategory']);
        const folderStructure = this.unitsInLevel[i];
        this.unitGroup = [];
        this.tree(folderStructure);
        if (this.unitGroup && this.unitGroup.length) {
          result['Level 1 Textbook Unit'] = this.unitGroup[0] && this.unitGroup[0].name || '';
          result['Level 2 Textbook Unit'] = this.unitGroup[1] && this.unitGroup[1].name || '';
          result['Level 3 Textbook Unit'] = this.unitGroup[2] && this.unitGroup[2].name || '';
          result['Level 4 Textbook Unit'] = this.unitGroup[3] && this.unitGroup[3].name || '';
        }
        return result;
      });

      const csvDownloadConfig = {
        filename: `Bulk Approval Failed Content Report Of Book - ${this.storedCollectionData.name.trim()}`,
        tableData: tableData,
        headers: headers,
        showTitle: false
      };
        this.programsService.generateCSV(csvDownloadConfig);
      } catch (err) {
        this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
      }
  }

  downloadFailedContentReport() {
    if (!this.dikshaContents) {
      this.bulkJobService.searchContentWithProcessId(this.bulkApprove.process_id, this.bulkApprove.type).subscribe((res: any) => {
        if (res.result && res.result.content && res.result.content.length) {
          this.dikshaContents = _.get(res, 'result.content');
          this.prepareTableData();
        }
      });
    } else {
      this.prepareTableData();
    }
  }

  checkBulkApproveHistory() {
    this.bulkApprove = this.cacheService.get('bulk_approval_' + this.sessionContext.collection);
    if (this.bulkApprove) {
      if (this.bulkApprove.status === 'processing') {
      } else {
        this.showBulkApprovalButton = true;
      }
    } else {
      const reqData = {
        filters: {
          program_id: this.programContext.program_id,
          collection_id: this.sessionContext.collection
        }
      };
      this.bulkJobService.getBulkOperationStatus(reqData).subscribe(res => {
        if (res.result && res.result.process && res.result.process.length) {
          this.bulkApprove = this.cacheService.get('bulk_approval_' + this.sessionContext.collection);
        }
        if (!this.bulkApprove || this.bulkApprove && this.bulkApprove.status !== 'processing') {
          this.showBulkApprovalButton = true;
        }
      }, err => {
        this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
      });
    }
  }
}
