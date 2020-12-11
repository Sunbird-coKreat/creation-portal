import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import 'jquery.fancytree';
import { IFancytreeOptions } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { TreeService } from '../../services';
import { editorConfig } from '../../editor.config';
@Component({
  selector: 'app-fancy-tree',
  templateUrl: './fancy-tree.component.html'
})
export class FancyTreeComponent implements AfterViewInit {
  @ViewChild('fancyTree') public tree: ElementRef;
  @Input() public nodes: any;
  @Input() public options: any;
  @Output() public treeEventEmitter: EventEmitter<any> = new EventEmitter();
  config: any = editorConfig;

  constructor(public activatedRoute: ActivatedRoute, public treeService: TreeService) { }

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
      source: this.nodes,
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
