import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'jquery.fancytree';
import { IFancytreeOptions, ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { TelemetryInteractDirective } from '@sunbird/telemetry';
import { TreeService } from '../../services';
import { editorConfig } from '../../editor.config';
@Component({
  selector: 'app-fancy-tree',
  templateUrl: './fancy-tree.component.html'
})
export class FancyTreeComponent implements OnInit, AfterViewInit {
  @ViewChild('fancyTree') public tree: ElementRef;
  @Input() telemetryEventsInput: any;
  @Input() public nodes: any;
  @Input() public options: any;
  @Output() public treeEventEmitter: EventEmitter<any> = new EventEmitter();
  config: any = editorConfig;
  public rootNode: any;
  @ViewChild(TelemetryInteractDirective) telemetryInteractDirective: TelemetryInteractDirective;
  constructor(public activatedRoute: ActivatedRoute, public treeService: TreeService, public configService: ConfigService) { }


  ngOnInit() {
    this.initialize();
  }

  private initialize() {
    const data = this.nodes;
    const treeData = this.buildTree(this.nodes);
    this.rootNode = [{
      'id': data.identifier || UUID.UUID(),
      'title': data.name,
      'tooltip': data.name,
      'objectType': data.objectType,
      'metadata': _.omit(data, ['children']),
      'folder': true,
      'children': treeData,
      'root': true,
      'icon': this.getObjectType(data.objectType).iconClass
    }];
  }

  buildTree(data, tree?) {
    tree = tree || [];
    if (data.children) { data.children = _.sortBy(data.children, ['index']); }
    _.forEach(data.children, (child, index) => {
      const objectType = this.getObjectType(child.objectType);
      const childTree = [];
      if (objectType) {
        tree.push({
          'id': child.identifier || UUID.UUID(),
          'title': `Q${index + 1} | ${child.objectType}`,
          'tooltip': child.name,
          'objectType': child.objectType,
          'metadata': _.omit(child, ['children']),
          'folder': child.visibility === 'Default' ? false : (objectType.childrenTypes.length > 0),
          'children': childTree,
          'root': false,
          'icon': child.visibility === 'Default' ? 'fa fa-file-o' : objectType.iconClass
        });
        if (child.visibility === 'Parent') {
          this.buildTree(child, childTree);
        }
      }
    });
    return tree;
  }

  ngAfterViewInit() {
    this.renderTree(this.getTreeConfig());
  }

  renderTree(options) {
    options = { ...options, ...this.options };
    $(this.tree.nativeElement).fancytree(options);
    this.treeService.setTreeElement(this.tree.nativeElement);
    if (this.options.showConnectors) {
      $('.fancytree-container').addClass('fancytree-connectors');
    }
    this.treeService.setActiveNode();
  }

  getTreeConfig() {
    const options: any = {
      extensions: ['glyph'],
      clickFolderMode: 3,
      source: this.rootNode,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'icon folder sb-fancyTree-icon',
          folderOpen: 'icon folder outline sb-fancyTree-icon'
        }
      },
      init: (event, data) => {
          // $(this.tree.nativeElement).fancytree('getTree').getNodeByKey('_2').setActive();
      },
      click: (event, data): boolean => {
        this.telemetryInteractDirective.telemetryInteractObject = this.getTelemetryInteractObject(_.get(data, 'node.data'));
        this.telemetryInteractDirective.telemetryInteractEdata = this.getTelemetryInteractEdata();
        this.telemetryInteractDirective.telemetryInteractCdata = this.telemetryEventsInput.telemetryInteractCdata || [];
        this.tree.nativeElement.click();
        const node = data.node;
        this.treeEventEmitter.emit({ 'type': 'nodeSelect', 'data': node });
        return true;
      },
      activate: (event, data) => {
        setTimeout(() => {
          this.treeEventEmitter.emit({ 'type': 'nodeSelect', 'data': data.node });
        }, 0);
      },
      renderNode: (event, data) => {
        if (data.node.data.root) {
          // data.node.span.style.display = 'none';
        }
      }
    };
    return options;
  }

  getTelemetryInteractObject(data) {
    return {
      id: _.get(data, 'id'),
      type: _.get(data, 'metadata.objectType') || 'Content',
      ver: _.get(data, 'metadata.pkgVersion') || '1.0',
      rollup: {
        l1: _.get(this.rootNode[0], 'id')
      }
    };
  }

  getTelemetryInteractEdata() {
    return {
      id: 'questionset_toc',
      type: this.configService.telemetryLabels.eventType.click,
      subtype: this.configService.telemetryLabels.eventSubtype.launch,
      pageid: this.telemetryEventsInput.telemetryPageId
    };
  }

  addChild() {
    const rootNode = this.treeService.getFirstChild();
    const node = this.treeService.getActiveNode();
    if (this.getObjectType(node.data.objectType).editable) {
      const childrenTypes = this.getObjectType(rootNode.data.objectType).childrenTypes;
      this.treeService.addNode(this.getObjectType(childrenTypes[0]), {}, 'child');
      // this.treeEventEmitter.emit({'type': 'addChild', 'data' : (rootNode.data.root ? 'child' : 'sibling')});
    } else {
      alert('Sorry, this operation is not allowed.');
    }
  }

  addSibling() {
    const rootNode = this.treeService.getFirstChild();
    const node = this.treeService.getActiveNode();
    if (!node.data.root) {
      const childrenTypes = this.getObjectType(rootNode.data.objectType).childrenTypes;
      this.treeService.addNode(this.getObjectType(childrenTypes[0]), {}, 'sibling');
      // this.treeEventEmitter.emit({'type': 'addSibling', 'data' : 'sibling'});
    } else {
      alert('Sorry, this operation is not allowed.');
    }
  }

  getObjectType(type) {
    return _.find(this.config.editorConfig.rules.objectTypes, (obj) => {
      return obj.type === type;
    });
  }

}
