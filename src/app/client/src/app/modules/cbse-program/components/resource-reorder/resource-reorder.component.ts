import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { ProgramTelemetryService } from '../../../program/services';
import { UserService } from '@sunbird/core';

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
  public collectionUnitsBreadcrumb: any = [];
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;

  showMoveButton = false;

  constructor(private collectionHierarchyService: CollectionHierarchyService, public toasterService: ToasterService,
              public programTelemetryService: ProgramTelemetryService, public userService: UserService,
              public configService: ConfigService) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.sessionContext.programId, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    this.setCollectionUnitBreadcrumb(this.prevUnitSelect);
  }

  moveResource() {
    this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitSelected, this.contentId)
     .subscribe((data) => {
     this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.prevUnitSelect, this.contentId)
      .subscribe((res) => {
        if (this.sessionContext && !this.sessionContext.selectedMvcContentDetails) {
          this.toasterService.success('The Selected Resource is Successfully Moved');
        } else {
          // tslint:disable-next-line:max-line-length
          this.toasterService.InfoToasterCritical(`<b>Content Added!</b>', 'Content "${this.sessionContext.selectedMvcContentDetails.name}" added to textbook- ${this.collectionUnitsBreadcrumb[0]}`);
        }
        this.moveEvent.emit({
          action: 'afterMove',
          contentId: this.contentId,
          collection: {
            identifier: this.unitSelected
          }
        });
        this.modal.deny();
      });
    }, err => {
    });
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
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
        $.each(tree.children, (index, subtree) => {
            const maybeParents = $.merge([], parents);
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

  setCollectionUnitBreadcrumb(selectedUnit?): void {
    if (this.sessionContext && !this.sessionContext.selectedMvcContentDetails) { return; }
    const selctedUnitParents: any = this.getParents(this.collectionUnits, selectedUnit ? selectedUnit : this.unitSelected);
    if (selctedUnitParents.found) {
      this.collectionUnitsBreadcrumb = [...this.sessionContext.resourceReorderBreadcrumb, ...selctedUnitParents.parents];
    }
  }
}
