import { Injectable } from '@angular/core';
import 'jquery.fancytree';
import { UUID } from 'angular2-uuid';
import {editorConfig} from '../../editor.config';

import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  config: any = editorConfig;
  treeCache = {
    nodesModified: {},
    nodes: []
  };

  treeNativeElement: any;

  constructor() { }

  getTreeObject () {
    return $(this.treeNativeElement).fancytree('getTree');
  }

  getHierarchy() {

  }

  setTreeElement(el) {
    this.treeNativeElement = el;
  }

  addNode(objectType, data, createType) {
    let newNode;
    data = data || {};
    const selectedNode = this.getActiveNode();
    const node: any = {};
    node.title = data.name ? (data.name) : 'Untitled ' + objectType.label;
    node.tooltip = data.name;
    node.objectType = data.contentType || objectType.type;
    node.id = data.identifier ? data.identifier : UUID.UUID();
    node.root = false;
    node.folder = (data.visibility && data.visibility === 'Default') ? false : (objectType.childrenTypes.length > 0);
    node.icon = (data.visibility && data.visibility === 'Default') ? 'fa fa-file-o' : objectType.iconClass;
    node.metadata = data;
    if (node.folder) {
      // to check child node should not be created more than the set configlevel
      if ((selectedNode.getLevel() >= this.config.editorConfig.rules.levels - 1) && createType === 'child') {
        alert('Sorry, this operation is not allowed.');
        return;
      }
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
      // tslint:disable-next-line:max-line-length
      this.treeCache.nodesModified[node.id] = { isNew: true, root: false, metadata: { mimeType: 'application/vnd.ekstep.content-collection', contentType: _.get(this.getActiveNode(), 'data.objectType'), code: node.id, name: node.title } };
      this.treeCache.nodes.push(node.id);
    } else {
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
    }
    newNode.setActive();
    // selectedNode.sortChildren(null, true);
    selectedNode.setExpanded();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
  }

  removeNode() {
    const selectedNode = this.getActiveNode();
    selectedNode.remove();
    this.getFirstChild().setExpanded();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
  }

  getActiveNode () {
    return $(this.treeNativeElement).fancytree('getTree').getActiveNode();
  }

  getFirstChild () {
    // console.log($(this.treeNativeElement).fancytree('getRootNode').getChildren());
    return $(this.treeNativeElement).fancytree('getRootNode').getFirstChild();
  }

  findNode(nodeId) {
    return $(this.treeNativeElement).fancytree('getTree').findFirst((node) => node.data.id === nodeId);
  }

  expandNode(nodeId) {
    this.findNode(nodeId).setExpanded(true);
  }

  replaceNodeId(identifiers) {
    $(this.treeNativeElement).fancytree('getTree').visit((node) => {
      if (identifiers[node.data.id]) {
        node.data.id = identifiers[node.data.id];
      }
    });
  }

  clearTreeCache(node?) {
    if (node) {
      delete this.treeCache.nodesModified[node.id];
      _.remove(this.treeCache.nodes, val => val === node.id);
    } else {
      this.treeCache.nodesModified = {};
      this.treeCache.nodes = [];
    }
  }

}
