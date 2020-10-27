import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { HelperService } from '../../services/helper.service'
import { ProgramTelemetryService } from '../../../program/services';
import { UserService } from '@sunbird/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-resource-reorder',
  templateUrl: './resource-reorder.component.html',
  styleUrls: ['./resource-reorder.component.scss']
})
export class ResourceReorderComponent implements OnInit {
  unitSelected: string;
  @Input() collectionUnits;
  @Input() contentId;
  @Input() sessionContext;
  @Input() programContext;
  @Input() prevUnitSelect;
  @Output() moveEvent = new EventEmitter<any>();
  @ViewChild('modal') modal;
  public telemetryPageId: string;
  public collectionUnitsBreadcrumb: any = [];
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;

  showMoveButton = false;

  constructor(private collectionHierarchyService: CollectionHierarchyService, public toasterService: ToasterService,
    public programTelemetryService: ProgramTelemetryService, public userService: UserService,
    public helperService: HelperService,
    public configService: ConfigService, public resourceService: ResourceService) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID);
    this.setCollectionUnitBreadcrumb();
    this.telemetryPageId = this.sessionContext.telemetryPageDetails.telemetryPageId;
  }

  moveResource() {
    this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitSelected, this.contentId)
      .subscribe((data) => {
        this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.prevUnitSelect, this.contentId)
          .subscribe((res) => {
            this.toasterService.success('The Selected Resource is Successfully Moved');
            this.emitAfterMoveEvent(this.unitSelected);
            this.modal.deny();
          });
      }, err => {
      });
  }

  emitAfterMoveEvent(unitSelected) {
    this.moveEvent.emit({
      action: 'afterMove',
      contentId: this.contentId,
      collection: {
        identifier: unitSelected
      }
    });
  }

  addResource() {
    this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.prevUnitSelect, this.contentId)
      .subscribe((data) => {
        // tslint:disable-next-line:max-line-length
        this.toasterService.InfoToasterCritical('<b>Content added successfully!</b>', `Content "${this.sessionContext.selectedMvcContentDetails.name}" added to  ${this.collectionUnitsBreadcrumb[0]} textbook`);
        this.emitAfterMoveEvent(this.prevUnitSelect);
        this.modal.deny();

        this.helperService.getTextbookDetails(this.sessionContext.collection).subscribe((data) => {
          let array = [];
          if(_.has(data.result.content, 'mvcContributions')) {
            array = data.result.content['mvcContributions'];
          } 
          array.push(this.contentId);
          const request = {
            content: {
              'versionKey': data.result.content.versionKey,
              'mvcContentCount': data.result.content.mvcContentCount ? data.result.content.mvcContentCount + 1 : 1,
            }
          };
          request.content['mvcContributions'] = _.uniq(array)
          this.helperService.updateContent(request, this.sessionContext.collection).subscribe((data) => {
    
          }, err => {
          });
        }, err => {
        });

      }, err => {
      });
  

  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }

  getTelemetryInteractCdata(type, id) {
    return [...this.sessionContext.telemetryInteractCdata, { type: type, id: _.toString(id)} ];
  }

  cancelMove() {
    this.moveEvent.emit({
      action: 'cancelMove',
      contentId: '',
      collection: {
        identifier: ''
      }
    });
  }

  getParentsHelper(tree: any, id: string, parents: Array<any>) {
    const self = this;
    if (tree.identifier === id) {
      return {
        found: true,
        parents: [...parents, tree.name]
      };
    }
    let result = {
      found: false,
    };
    if (tree.children) {
      _.forEach(tree.children, (subtree, key) => {
        const maybeParents = _.concat([], parents);
        if (tree.identifier !== undefined) {
          maybeParents.push(tree.name);
        }
        const maybeResult: any = self.getParentsHelper(subtree, id, maybeParents);
        if (maybeResult.found) {
          result = maybeResult;
          return false;
        }
      });
    }
    return result;
  }

  getParents(data: Array<any>, id: string) {
    const tree = {
      children: data
    };
    return this.getParentsHelper(tree, id, []);
  }

  setCollectionUnitBreadcrumb(): void {
    if (this.sessionContext && !this.sessionContext.selectedMvcContentDetails) { return; }
    const selctedUnitParents: any = this.getParents(this.collectionUnits, this.prevUnitSelect);
    if (selctedUnitParents.found) {
      this.collectionUnitsBreadcrumb = [...this.sessionContext.resourceReorderBreadcrumb, ...selctedUnitParents.parents];
    }
  }
}
