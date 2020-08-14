import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService, ProgramsService} from '@sunbird/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
import { Router } from '@angular/router';

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
  @Output() emitSelectedNode = new EventEmitter<any>();
  @Output() nodeMeta = new EventEmitter<any>();
  public showModal = false;
  public showAddresource = false;
  visibility: any;
  public unitIdentifier;
  public childlevel;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public sourcingOrgReviewer: boolean;
  public nodeStatusMessage: string;
  constructor(public userService: UserService, public configService: ConfigService, private programsService: ProgramsService,
    public programTelemetryService: ProgramTelemetryService, public resourceService: ResourceService, public router: Router) { }

  ngOnInit() {
    this.childlevel = this.level + 1;
    const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
    this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    this.sourcingOrgReviewer = this.router.url.includes('/sourcing') ? true : false;
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);

    this.visibility = {};
    // tslint:disable-next-line:max-line-length
    this.visibility['showAddresource'] = submissionDateFlag && _.includes(this.programContext.config.actions.showAddResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showEditResource'] = _.includes(this.programContext.config.actions.showEditResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showMoveResource'] = _.includes(this.programContext.config.actions.showMoveResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showDeleteResource'] = _.includes(this.programContext.config.actions.showDeleteResource.roles, this.sessionContext.currentRoleId);
    // tslint:disable-next-line:max-line-length
    this.visibility['showPreviewResource'] = _.includes(this.programContext.config.actions.showPreviewResource.roles, this.sessionContext.currentRoleId);
    this.visibility['showActionMenu'] = this.shouldActionMenuBeVisible();
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.sessionContext.programId, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
  }

  shouldActionMenuBeVisible() {
    return !!(
      this.visibility['showAddresource'] ||
      this.visibility['showEditResource'] ||
      this.visibility['showMoveResource'] ||
      this.visibility['showDeleteResource']
    );
  }
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

  moveResource(e, content, collection) {
    this.nodeMeta.emit({
      action: 'beforeMove',
      content: content,
      collection: collection
    });
  }

  previewResource(e, content, collection, origin, index) {
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

  isSourcingOrgReviewer () {
    return !!(this.userService.userProfile.userRoles.includes('ORG_ADMIN') ||
    this.userService.userProfile.userRoles.includes('CONTENT_REVIEWER'));
  }

}
