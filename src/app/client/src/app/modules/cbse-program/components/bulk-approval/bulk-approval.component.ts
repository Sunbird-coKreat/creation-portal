import { Component, OnInit, Input } from '@angular/core';
import { PublicDataService, UserService, ActionService, FrameworkService, ProgramsService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService, BrowserCacheTtlService } from '@sunbird/shared';
import { BulkJobService } from '../../services/bulk-job/bulk-job.service';
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: 'app-bulk-approval',
  templateUrl: './bulk-approval.component.html',
  styleUrls: ['./bulk-approval.component.scss']
})
export class BulkApprovalComponent implements OnInit {

  public showBulkApproveModal = false;
  public bulkApprovalInProgress = false;
  public bulkApprovalComfirmation = false;
  public bulkApprovalCompleted = false;
  public showBulkApprovalLoader = false;
  public bulkApproveHistory = false;
  @Input() programContext;
  @Input() sessionContext;

  constructor(public resourceService: ResourceService, private bulkJobService: BulkJobService,
    private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService) { }

  ngOnInit() {
  }

  bulkApproval() {
    // this.approvalPendingContents(this.collectionHierarchy);
    // console.log(this.approvalPending, '==========>');
    this.showBulkApproveModal = false;
    this.bulkApprovalComfirmation = false;
    this.showBulkApprovalLoader = true;
    this.bulkApprovalCompleted = false;
    this.bulkApproveHistory = false;
    this.cacheService.set('hasHistory', true,
    { maxAge: this.browserCacheTtlService.browserCacheTtl });
    setTimeout(() => {
      this.bulkApproveHistory = true;
      this.cacheService.set('hasHistory', false,
    { maxAge: this.browserCacheTtlService.browserCacheTtl });
    }, 30000);
  }

  checkBulkApprovalStatus() {
    const reqData = {
      program_id: this.programContext.program_id,
      collection_id: this.sessionContext.collection
    };
    // this.bulkJobService.getBulkOperationStatus(reqData);
  }

  viewBulkApprovalStatus() {
    if (this.bulkApproveHistory) {
      this.bulkApprovalInProgress = false;
      this.showBulkApprovalLoader = false;
      this.bulkApprovalCompleted = true;
    } else {
      this.bulkApprovalInProgress = true;
    }
  }

  checkBulkApproveHistory() {
    if (this.cacheService.get('hasHistory')) {
      this.bulkApprovalInProgress = true;
      this.bulkApproval();
    }
  }
}
