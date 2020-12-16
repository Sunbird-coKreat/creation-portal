import { Injectable } from '@angular/core';
import 'jquery.fancytree';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash-es';
import { editorConfig } from '../../editor.config';

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
      this.treeCache.nodesModified[node.id] = { isNew: true, root: false, metadata: { mimeType: 'application/vnd.ekstep.content-collection' } };
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
    this.setActiveNode();
  }

  setActiveNode() {
    const rootFirstChildNode = this.getFirstChild();
    const firstChild = rootFirstChildNode.getFirstChild(); // rootNode.getFirstChild() will always be available.
    firstChild ? firstChild.setActive() : rootFirstChildNode.setActive(); // select the first children node by default
  }

  setNodeTitle(title) {
    if (!title) { title = 'Untitled'; }
    // title = instance.removeSpecialChars(title);
    this.getActiveNode().applyPatch({ 'title': title }).done((a, b) => {
      // instance.onRenderNode(undefined, { node: ecEditor.jQuery('#collection-tree').fancytree('getTree').getActiveNode() }, true)
    });
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
  }

  replaceNodeId(identifiers) {
    this.getTreeObject().visit((node) => {
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

  getTreeObject() {
    return $(this.treeNativeElement).fancytree('getTree');
  }

  getActiveNode() {
    return this.getTreeObject().getActiveNode();
  }

  getFirstChild() {
    return $(this.treeNativeElement).fancytree('getRootNode').getFirstChild();
  }

}
