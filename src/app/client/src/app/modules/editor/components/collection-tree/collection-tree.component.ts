import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICollectionTreeNodes, ICollectionTreeOptions, MimeTypeTofileType } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { editorConfig } from '../../editor.config';

@Component({
  selector: 'app-collection-tree-new',
  templateUrl: './collection-tree.component.html',
  styleUrls: ['./collection-tree.component.scss']
})
export class CollectionTreeComponent implements OnInit {

  @Input() public nodes: any;
  config: any = editorConfig;
  @Output() public treeEventEmitter: EventEmitter<any> = new EventEmitter();
  public rootNode: any;
  constructor() { }

  ngOnInit() {
    this.initialize();
  }

  private initialize() {
    const data = this.nodes.data;
    const treeData = this.buildTree(this.nodes.data);
    this.rootNode = [{
      'id': data.identifier || UUID.UUID(),
      'title': data.name,
      'tooltip': data.name,
      'objectType': data.contentType,
      'metadata': _.omit(data, ['children', 'collections']),
      'folder': true,
      'children': treeData,
      'root': true,
      'icon': this.getObjectType(data.contentType).iconClass
    }];
  }

  buildTree(data, tree?) {
    tree = tree || [];
    if (data.children) { data.children = _.sortBy(data.children, ['index']); }
    _.forEach(data.children, (child) => {
      const objectType = this.getObjectType(child.contentType);
      const childTree = [];
      if (objectType) {
        tree.push({
          'id': child.identifier || UUID.UUID(),
          'title': child.name,
          'tooltip': child.name,
          'objectType': child.contentType,
          'metadata': _.omit(child, ['children', 'collections']),
          'folder': child.visibility === 'Default' ? false : (objectType.childrenTypes.length > 0),
          'children': childTree,
          'root': false,
          'icon': child.visibility === 'Default' ? 'fa fa-file-o' : this.getObjectType(child.contentType).iconClass
        });
        if (child.visibility === 'Parent') {
          this.buildTree(child, childTree);
        }
      }
    });
    return tree;
  }

  getObjectType(type) {
    return _.find(this.config.editorConfig.rules.objectTypes, (obj) => {
      return obj.type === type;
    });
  }

  public treeEventListener(event: any) {
    switch (event.type) {
      case 'nodeSelect':
        this.treeEventEmitter.emit({ 'type': 'nodeSelect', 'data': event.data });
        break;
      case 'addChild':
        this.treeEventEmitter.emit({ 'type': 'addChild', 'data': event.data });
        break;
      case 'addSibling':
        this.treeEventEmitter.emit({ 'type': 'addChild', 'data': event.data });
        break;
      default:
        break;
    }
  }

}
