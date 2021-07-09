import { Injectable } from '@angular/core';
import 'jquery.fancytree';
import { UUID } from 'angular2-uuid';
declare var $: any;
import * as _ from 'lodash-es';
import { IEditorConfig } from '../../interfaces/editor';
import { ToasterService } from '../toaster/toaster.service';
import { HelperService } from '../helper/helper.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root'
})
export class TreeService {
  public config: any;
  treeCache = {
    nodesModified: {},
    nodes: []
  };
  treeNativeElement: any;
  omitFalseyProps: any;
  // tslint:disable-next-line:variable-name
  private _treeStatus$ = new BehaviorSubject<any>(undefined);
  public readonly treeStatus$: Observable<any> = this._treeStatus$
  .asObservable().pipe(skipWhile(status => status === undefined || status === null));

  constructor(private toasterService: ToasterService, private helperService: HelperService, public configService: ConfigService) { }

  public initialize(editorConfig: IEditorConfig) {
    this.config = editorConfig.config;
    this.omitFalseyProps = _.get(this.configService.editorConfig, 'omitFalseyProperties');
  }

  nextTreeStatus(status) {
    this._treeStatus$.next(status);
  }

  setTreeElement(el) {
    this.treeNativeElement = el;
  }

  updateNode(metadata) {
    this.setNodeTitle(metadata.name);
    this.updateTreeNodeMetadata(metadata);
  }

  updateAppIcon(appIconUrl) {
    const activeNode = this.getActiveNode();
    const nodeId = activeNode.data.id;
    activeNode.data.metadata = {...activeNode.data.metadata, appIcon : appIconUrl};
    this.setTreeCache(nodeId, {appIcon : appIconUrl}, activeNode.data);
  }

  updateMetaDataProperty(key, value) {
    const node = this.getFirstChild();
    const nodeId = node.data.id;
    node.data.metadata = {...node.data.metadata, [key] : value};
    this.setTreeCache(nodeId, _.merge({}, {[key] : value}, _.pick(node.data.metadata, ['objectType'])));
  }

  updateTreeNodeMetadata(newData: any) {
    const activeNode = this.getActiveNode();
    const nodeId = activeNode.data.id;
    if (newData.instructions) {
      newData.instructions = { default: newData.instructions };
     }
    activeNode.data.metadata = { ...activeNode.data.metadata, ...newData };
    activeNode.title = newData.name;
    newData = _.omitBy(newData, (v, key ) => _.isUndefined(v) || _.isNull(v) || (v === '' && _.includes(this.omitFalseyProps, key)));
    newData = _.merge({}, newData, _.pick(activeNode.data.metadata, ['objectType', 'contentType', 'primaryCategory']));
    const attributions = newData.attributions;
    if (attributions && _.isString(attributions)) {
      newData.attributions = attributions.split(',');
    }
    const { maxTime, warningTime, copyrightYear } = newData;

    if (copyrightYear) {
      newData.copyrightYear = _.toNumber(copyrightYear);
    }
    const timeLimits: any = {};
    if (maxTime) {
      timeLimits.maxTime = this.helperService.hmsToSeconds(maxTime);
    }
    if (warningTime) {
      timeLimits.warningTime = this.helperService.hmsToSeconds(warningTime);
    }
    newData.timeLimits = timeLimits;
    delete newData.maxTime;
    delete newData.warningTime;
    this.setTreeCache(nodeId, newData, activeNode.data);
  }

  addNode(createType) {
    let newNode;
    const selectedNode = this.getActiveNode();
    // tslint:disable-next-line:max-line-length
    const nodeConfig = (createType === 'sibling') ? this.config.hierarchy[`level${selectedNode.getLevel() - 1}`] : this.config.hierarchy[`level${selectedNode.getLevel()}`];
    const uniqueId = UUID.UUID();
    const nodeTitle = _.get(nodeConfig, 'name');
    const node: any = {
      id: uniqueId,
      title: nodeTitle,
      tooltip: nodeTitle,
      ...(nodeConfig.contentType && { contentType: nodeConfig.contentType }),
      primaryCategory: _.get(nodeConfig, 'primaryCategory'),
      objectType: _.get(this.config, 'objectType'),
      root: false,
      folder: true,
      icon: _.get(nodeConfig, 'iconClass'),
      metadata: {
        mimeType: _.get(nodeConfig, 'mimeType'),
        code: uniqueId,
        name: nodeTitle
      }
    };
    node.metadata = _.merge({}, node.metadata, _.pick(node, ['contentType', 'objectType', 'primaryCategory']));
    newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
    this.setTreeCache(node.id, node.metadata);
    newNode.setActive();
    selectedNode.setExpanded();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
    this.nextTreeStatus('added');
  }

  removeNode() {
    const selectedNode = this.getActiveNode();
    const afterDeleteNode = selectedNode.getPrevSibling() ? selectedNode.getPrevSibling() : selectedNode.getParent();
    this.setActiveNode(afterDeleteNode);
    selectedNode.remove();
    this.clearTreeCache(selectedNode.data);
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
    this.nextTreeStatus('removed');
  }

  getTreeObject() {
    return $(this.treeNativeElement).fancytree('getTree');
  }

  getActiveNode() {
    return this.getTreeObject().getActiveNode();
  }

  setActiveNode(node?) {
    const rootFirstChildNode = this.getFirstChild();
    if (node) {
      node.setActive(true);
    } else {
      rootFirstChildNode.setActive(true);
    }
  }

  getFirstChild() {
    return $(this.treeNativeElement).fancytree('getRootNode').getFirstChild();
  }

  findNode(nodeId) {
    return this.getTreeObject().findFirst((node) => node.data.id === nodeId);
  }

  expandNode(nodeId) {
    this.findNode(nodeId).setExpanded(true);
  }

  replaceNodeId(identifiers) {
    this.getTreeObject().visit((node) => {
      if (identifiers[node.data.id]) {
        node.data.id = identifiers[node.data.id];
      }
    });
  }

  getNodeById(id) {
    // tslint:disable-next-line:variable-name
    let _node: any;
    this.getTreeObject().visit((node) => {
      if (node.data.id === id) { _node = node; }
    });
    return _node;
  }

  // Generate a flat list of node children and sub children
  getChildren() {
    const nodes = [];
    this.getActiveNode().visit((node) => {
      nodes.push(node);
    });
    return nodes;
  }

  highlightNode(nodeId: string, action: string) {
    const nodeElem = this.getNodeById(nodeId);
    if (!nodeElem) { return; }
    if (action === 'add') {
      nodeElem.span.childNodes[1].classList.add('highlightNode');
      nodeElem.span.childNodes[2].classList.add('highlightNode');
    } else if (action === 'remove') {
      nodeElem.span.childNodes[1].classList.remove('highlightNode');
      nodeElem.span.childNodes[2].classList.remove('highlightNode');
    } else {}
  }

  setTreeCache(nodeId, metadata, activeNode?) {
    if (this.treeCache.nodesModified[nodeId]) {
      // tslint:disable-next-line:max-line-length
      this.treeCache.nodesModified[nodeId].metadata = _.assign(this.treeCache.nodesModified[nodeId].metadata, _.omit(metadata, 'objectType'));
    } else {
      this.treeCache.nodesModified[nodeId] = {
        root: activeNode && activeNode.root ? true : false,
        objectType: metadata.objectType,
        metadata: { ..._.omit(metadata, ['objectType']) },
        ...(nodeId.includes('do_') ? { isNew: false } : { isNew: true })
      };
      this.treeCache.nodes.push(nodeId); // To track sequence of modifiation
    }
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

  setNodeTitle(title) {
    if (!title) {
      title = 'Untitled';
    }
    title = this.removeSpecialChars(title);
    this.getActiveNode().applyPatch({ title }).done((a, b) => { });
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
  }

  removeSpecialChars(text) {
    if (text) {
      // tslint:disable-next-line:quotemark
      const iChars = "!`~@#$^*+=[]\\\'{}|\"<>%/";
      for (let i = 0; i < text.length; i++) {
        if (iChars.indexOf(text.charAt(i)) !== -1) {
          this.toasterService.error('Special character "' + text.charAt(i) + '" is not allowed');
        }
      }
      // tslint:disable-next-line:max-line-length
      text = text.replace(/[^\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\uFB50-\uFDFF\u0980-\u09FF\u0900-\u097F\u0D00-\u0D7F\u0A80-\u0AFF\u0C80-\u0CFF\u0B00-\u0B7F\u0A00-\u0A7F\u0B80-\u0BFF\u0C00-\u0C7F\w:&_\-.(\),\/\s]|[/]/g, '');
      return text;
    }
  }

  closePrevOpenedDropDown() {
    this.getTreeObject().visit((node) => {
      const nSpan = $(node.span);
      const dropDownElement = $(nSpan[0]).find(`#contextMenuDropDown`);
      dropDownElement.addClass('hidden');
      dropDownElement.removeClass('visible');
    });
  }

  reloadTree(nodes: any) {
    this.getTreeObject().reload(nodes);
    $('span.fancytree-title').attr('style', 'width:15em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
  }
}
