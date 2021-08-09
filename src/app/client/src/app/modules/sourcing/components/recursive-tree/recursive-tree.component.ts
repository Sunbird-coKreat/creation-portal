import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService, ProgramsService} from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-recursive-tree',
  templateUrl: './recursive-tree.component.html',
  styleUrls: ['./recursive-tree.component.scss']
})
export class RecursiveTreeComponent implements OnInit {

  @Input() collectionUnits;
  @Input() selectedChapter;
  @Input() programContext;
  @Input() sessionContext;
  @Input() originalCollectionData;
  @Input() level;
  @Input() selectedStatus;
  @Output() emitSelectedNode = new EventEmitter<any>();
  @Output() nodeMeta = new EventEmitter<any>();
  public showModal = false;
  public showAddresource = false;
  visibility: any;
  mvcLibraryFeatureConfiguration: any;
  public unitIdentifier;
  public childlevel;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public sourcingOrgReviewer: boolean;
  public nodeStatusMessage: string;
  public telemetryPageId: string;
  public userId: any;
  public showActionMenu: any;
  constructor(public userService: UserService, public configService: ConfigService, private programsService: ProgramsService,
    private helperService: HelperService, public programTelemetryService: ProgramTelemetryService, public resourceService: ResourceService, public router: Router) { }

  ngOnInit() {
    this.childlevel = this.level + 1;
    const currentRoles = _.filter(this.programContext.config.roles, role => this.sessionContext.currentRoles.includes(role.name));
    this.sessionContext.currentRoleIds = !_.isEmpty(currentRoles) ? _.map(currentRoles, role => role.id) : null;
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);
    this.mvcLibraryFeatureConfiguration = this.helperService.mvcLibraryFeatureConfiguration;
    this.telemetryPageId = this.sessionContext.telemetryPageDetails.telemetryPageId;

    this.visibility = {};
    // tslint:disable-next-line:max-line-length
    this.visibility['showAddresource'] = submissionDateFlag && this.hasAccessFor(['CONTRIBUTOR']);
    // tslint:disable-next-line:max-line-length
    this.visibility['showEditResource'] = this.hasAccessFor(['CONTRIBUTOR']);
    // tslint:disable-next-line:max-line-length
    this.visibility['showMoveResource'] = this.hasAccessFor(['CONTRIBUTOR']);
    // tslint:disable-next-line:max-line-length
    this.visibility['showDeleteResource'] = this.hasAccessFor(['CONTRIBUTOR']);
    // tslint:disable-next-line:max-line-length
    this.visibility['showPreviewResource'] = this.hasAccessFor(['REVIEWER']);
    this.visibility['showActionMenu'] = this.shouldActionMenuBeVisible();
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    this.userId = this.userService.userid;
    this.showActionMenu = this.visibility && this.visibility['showActionMenu'];
  }

  hasAccessFor(roles: Array<string>) {
    return !_.isEmpty(_.intersection(roles, this.sessionContext.currentRoles || []));
  }

  includes(sourcingOrgReviewer: Boolean, selectedStatus: Array<string>, currentStatus: String) {
    // Always return true if not sourcingOrgReviewer
    if(!sourcingOrgReviewer) return true;
    // Always return true if sampleContent
    else if(this.sessionContext.sampleContent) return true;
    else {
      // Always return true if no status selected
      return (!selectedStatus.length) || _.includes(selectedStatus, currentStatus)
    }

  }

  shouldActionMenuBeVisible() {
    return !!(
      this.visibility['showAddresource'] ||
      this.visibility['showEditResource'] ||
      this.visibility['showMoveResource'] ||
      this.visibility['showDeleteResource']
    );
  }

  // canViewActionMenu(content) {
  //   return !!(this.visibility && this.visibility['showActionMenu'] && content.createdBy === this.userService.userid);
  // }

  nodeMetaEmitter(event) {
    this.nodeMeta.emit({
      action: event.action,
      showPopup: event.action === 'add' ? true : false,
      collection: event.collection,
      content: event.content
    });
  }

  createResource(e, collection) {
    e.stopPropagation();
    this.showModal = true;
    this.nodeMeta.emit({
      action: 'add',
      showPopup: this.showModal,
      collection: collection
    });
  }

  deleteResource(e, content, collection) {
    this.nodeMeta.emit({
      action: 'delete',
      content: content,
      collection: collection,
      showPopup: null,
    });
  }
  removeResource(e, content, collection) {
    this.nodeMeta.emit({
      action: 'remove',
      content: content,
      collection: collection,
      showPopup: null,
    });
  }
  moveResource(e, content, collection) {
    this.nodeMeta.emit({
      action: 'beforeMove',
      content: content,
      collection: collection
    });
  }

  previewResource(e, content, collection, origin, index) {
    this.programsService.emitHeaderEvent(false);
    content.originUnitStatus = collection.statusMessage ? 'Retired' : collection.status;
    this.nodeMeta.emit({
      action: 'preview',
      content: content,
      collection: collection,
      originCollectionData: origin
    });
  }

  menuClick(e) {
    e.stopPropagation();
  }

  goToAddLibrary(identifier) {
    // tslint:disable-next-line:max-line-length
    this.router.navigateByUrl(`/contribute/program/${this.sessionContext.programId}/textbook/${this.sessionContext.collection}/${identifier}`);
  }

}
