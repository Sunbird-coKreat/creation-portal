import {
  Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter,
  OnDestroy, OnInit, ViewEncapsulation, ChangeDetectorRef
} from '@angular/core';
import 'jquery.fancytree';
import * as _ from 'lodash-es';
import { TreeService } from '../../services/tree/tree.service';
import { EditorService } from '../../services/editor/editor.service';
import { HelperService } from '../../services/helper/helper.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { ConfigService } from '../../services/config/config.service';


import { Subject } from 'rxjs';
import { UUID } from 'angular2-uuid';
declare var $: any;

@Component({
  selector: 'lib-fancy-tree',
  templateUrl: './fancy-tree.component.html',
  styleUrls: ['./fancy-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FancyTreeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fancyTree') public tree: ElementRef;
  @Input() public nodes: any;
  @Input() public options: any;
  @Input( ) buttonLoaders: any;
  @Output() public treeEventEmitter: EventEmitter<any> = new EventEmitter();
  public config: any;
  public showTree: boolean;
  public visibility: any;
  public showAddChildButton: boolean;
  public showAddSiblingButton: boolean;
  public rootNode: any;
  public showLibraryButton = false;
  public rootMenuTemplate = `<span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0">
  <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id= "contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addchild" class="item">Add Child</div>
  </span>
  </span>`;
  public folderMenuTemplate = `<span class="ui dropdown sb-dotted-dropdown" autoclose="itemClick" suidropdown="" tabindex="0">
  <span id="contextMenu" class="p-0 w-auto"><i class="icon ellipsis vertical sb-color-black"></i></span>
  <span id= "contextMenuDropDown" class="menu transition hidden" suidropdownmenu="" style="">
    <div id="addsibling" class="item">Add Sibling</div>
    <div id="addchild" class="item">Add Child</div>
    <div id="delete" class="item">Delete</div>
  </span>
  </span>
  <span id= "removeNodeIcon"> <i class="fa fa-trash-o" type="button"></i> </span>`;
  // tslint:disable-next-line:max-line-length
  public contentMenuTemplate = `<span id="contextMenu"><span id= "removeNodeIcon"> <i class="fa fa-trash-o" type="button"></i> </span></span>`;
  constructor(public treeService: TreeService, private editorService: EditorService,
              public telemetryService: EditorTelemetryService, private helperService: HelperService,
              private toasterService: ToasterService, private cdr: ChangeDetectorRef,
              public configService: ConfigService) { }
  private onComponentDestroy$ = new Subject<any>();

  ngOnInit() {
    this.config = _.cloneDeep(this.editorService.editorConfig.config);
    this.config.mode =  _.get(this.config, 'mode').toLowerCase();
    if (!_.has(this.config, 'maxDepth')) { // TODO:: rethink this
      this.config.maxDepth = 4;
    }
    this.initialize();
  }

  ngAfterViewInit() {
    this.renderTree(this.getTreeConfig());
  }

  private initialize() {
    const data = this.nodes.data;
    const treeData = this.buildTree(this.nodes.data);
    this.rootNode = [{
      id: data.identifier || UUID.UUID(),
      title: data.name,
      tooltip: data.name,
      ...(data.contentType && {contentType: data.contentType}),
      primaryCategory: data.primaryCategory,
      objectType: data.objectType,
      metadata: _.omit(data, ['children', 'collections']),
      folder: true,
      children: treeData,
      root: true,
      icon: _.get(this.config, 'iconClass')
    }];
  }

  buildTree(data, tree?, level?) {
    tree = tree || [];
    if (data.children) { data.children = _.sortBy(data.children, ['index']); }
    data.level = level ? (level + 1) : 1;
    _.forEach(data.children, (child) => {
      const childTree = [];
      tree.push({
        id: child.identifier || UUID.UUID(),
        title: child.name,
        tooltip: child.name,
        ...(child.contentType && {contentType: child.contentType}),
        primaryCategory: child.primaryCategory,
        objectType: child.objectType,
        metadata: _.omit(child, ['children', 'collections']),
        folder: this.isFolder(child),
        children: childTree,
        root: false,
        icon: this.getIconClass(child, data.level)
      });
      if (child.visibility === 'Parent') {
        this.buildTree(child, childTree, data.level);
      }
    });
    return tree;
  }

  isFolder(child: any) {
    if (this.isContent(child)) {
      return false;
    } else {
      return child.visibility === 'Parent' ? true : false;
    }
  }

  getIconClass(child: any, level: number) {
    if (this.isContent(child)) {
      return 'fa fa-file-o';
    } else if (child.visibility === 'Parent') {
        return _.get(this.config, `hierarchy.level.${level}.iconClass`) || 'fa fa-folder-o';
    } else {
      return 'fa fa-file-o';
    }
  }

  isContent(child: any) {
    // tslint:disable-next-line:max-line-length
    return (_.get(this.config, 'objectType') === 'QuestionSet' && child.objectType === 'Question');
  }

  renderTree(options) {
    options = { ...options, ...this.options };
    $(this.tree.nativeElement).fancytree(options);
    this.treeService.setTreeElement(this.tree.nativeElement);
    if (this.options.showConnectors) {
      $('.fancytree-container').addClass('fancytree-connectors');
    }
    setTimeout(() => {
      this.treeService.reloadTree(this.rootNode);
      this.treeService.setActiveNode();
      const rootNode = this.treeService.getFirstChild();
      rootNode.setExpanded(true);
      this.eachNodeActionButton(rootNode);
    });
    this.treeService.nextTreeStatus('loaded');
    this.showTree = true;
  }

  getTreeConfig() {
    const options: any = {
      extensions: ['glyph', 'dnd5'],
      clickFolderMode: 3,
      source: this.rootNode,
      escapeTitles: true,
      glyph: {
        preset: 'awesome4',
        map: {
          folder: 'icon folder sb-fancyTree-icon',
          folderOpen: 'icon folder outline sb-fancyTree-icon'
        }
      },
      dnd5: {
        autoExpandMS: 400,
        // focusOnClick: true,
        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
        preventRecursion: true, // Prevent dropping nodes on own descendants
        dragStart: (node, data) => {
          /** This function MUST be defined to enable dragging for the tree.
           *  Return false to cancel dragging of node.
           */
          const draggable = _.get(this.config, 'mode') === 'edit' ? true : false;
          return draggable;
        },
        dragEnter: (node, data) => {
          /** data.otherNode may be null for non-fancytree droppables.
           *  Return false to disallow dropping on node. In this case
           *  dragOver and dragLeave are not called.
           *  Return 'over', 'before, or 'after' to force a hitMode.
           *  Return ['before', 'after'] to restrict available hitModes.
           *  Any other return value will calc the hitMode from the cursor position.
           */
          // Prevent dropping a parent below another parent (only sort
          // nodes under the same parent)
          /*           if(node.parent !== data.otherNode.parent){
                      return false;
                    }
                    // Don't allow dropping *over* a node (would create a child)
                    return ["before", "after"];
          */
          return true;
        },
        dragDrop: (node, data) => {
          /** This function MUST be defined to enable dropping of items on
           *  the tree.
           */
          // data.otherNode.moveTo(node, data.hitMode);
          return this.dragDrop(node, data);
        },
        filter: {
          autoApply: true,
          autoExpand: false,
          counter: true,
          fuzzy: false,
          hideExpandedCounter: true,
          hideExpanders: false,
          highlight: true,
          leavesOnly: false,
          nodata: true,
          mode: 'dimm'
        }
      },
      init: (event, data) => { },
      click: (event, data): boolean => {
        this.tree.nativeElement.click();
        this.telemetryService.interact({ edata: this.getTelemetryInteractEdata() });
        return true;
      },
      activate: (event, data) => {
        this.treeEventEmitter.emit({ type: 'nodeSelect', data: data.node });
        setTimeout(() => {
          this.attachContextMenu(data.node, true);
          this.eachNodeActionButton(data.node);
        }, 10);
      },
      renderNode: (event, data) => {
        const node = data.node;
        const $nodeSpan = $(node.span);

        // check if span of node already rendered
        if (!$nodeSpan.data('rendered')) {
          this.attachContextMenu(node);
          // span rendered
          $nodeSpan.data('rendered', true);
        }
      }
    };
    return options;
  }

  eachNodeActionButton(node) {
    this.visibility = {};
    const nodeLevel = node.getLevel() - 1;
    this.visibility.addChild = ((node.folder === false) || (nodeLevel >= this.config.maxDepth)) ? false : true;
    // tslint:disable-next-line:max-line-length
    this.visibility.addSibling = ((node.folder === true) && (!node.data.root) && !((node.getLevel() - 1) > this.config.maxDepth)) ? true : false;
    if (nodeLevel === 0) {
      this.visibility.addFromLibrary = _.isEmpty(_.get(this.config, 'children')) ? false : true;
      this.visibility.createNew = _.isEmpty(_.get(this.config, 'children')) ? false : true;
    } else {
      const hierarchylevelData = this.config.hierarchy[`level${nodeLevel}`];
      this.visibility.addFromLibrary = ((node.folder === false) || _.isEmpty(_.get(hierarchylevelData, 'children'))) ? false : true;
      this.visibility.createNew = ((node.folder === false) || _.isEmpty(_.get(hierarchylevelData, 'children'))) ? false : true;
    }
    this.cdr.detectChanges();
  }

  addChild() {
    this.telemetryService.interact({ edata: this.getTelemetryInteractEdata('add_child') });
    const tree = $(this.tree.nativeElement).fancytree('getTree');
    const nodeConfig = this.config.hierarchy[tree.getActiveNode().getLevel()];
    const childrenTypes = _.get(nodeConfig, 'children.Content');
    if ((((tree.getActiveNode().getLevel() - 1) >= this.config.maxDepth))) {
      return this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.007'));
    }
    this.treeService.addNode('child');
  }

  addSibling() {
    this.telemetryService.interact({ edata: this.getTelemetryInteractEdata('add_sibling') });
    const tree = $(this.tree.nativeElement).fancytree('getTree');

    const node = tree.getActiveNode();
    if (!node.data.root) {
      this.treeService.addNode('sibling');
    } else {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.007'));
    }
  }

  getActiveNode() {
    return $(this.tree.nativeElement).fancytree('getTree').getActiveNode();
  }

  attachContextMenu(node, activeNode?) {
    if (_.get(this.config, 'mode') !== 'edit' || (node.data.root === true && _.isEmpty(this.config.hierarchy) )) {
      return;
    }
    const $nodeSpan = $(node.span);
    // tslint:disable-next-line:max-line-length   // TODO:: (node.data.contentType === 'CourseUnit') check this condition
    const menuTemplate = node.data.root === true ? this.rootMenuTemplate : (node.data.root === false && node.folder === true  ? this.folderMenuTemplate : this.contentMenuTemplate);
    const iconsButton = $(menuTemplate);
    if ((node.getLevel() - 1) >= this.config.maxDepth) {
      iconsButton.find('#addchild').remove();
    }

    let contextMenu = $($nodeSpan[0]).find(`#contextMenu`);

    if (!contextMenu.length) {
      $nodeSpan.append(iconsButton);

      if (!activeNode) {
        iconsButton.hide();
      }

      $nodeSpan[0].onmouseover = () => {
        iconsButton.show();
      };

      $nodeSpan[0].onmouseout = () => {
        iconsButton.hide();
      };

      contextMenu = $($nodeSpan[0]).find(`#contextMenu`);

      contextMenu.on('click', (event) => {
        this.treeService.closePrevOpenedDropDown();
        setTimeout(() => {
          const nSpan = $(this.getActiveNode().span);

          const dropDownElement = $(nSpan[0]).find(`#contextMenuDropDown`);
          dropDownElement.removeClass('hidden');
          dropDownElement.addClass('visible');
          _.forEach(_.get(_.first(dropDownElement), 'children'), item => {
            item.addEventListener('click', (ev) => {
              this.treeService.closePrevOpenedDropDown();
              this.handleActionButtons(ev.currentTarget);
              ev.stopPropagation();
            });
          });
        }, 100);
        // event.stopPropagation();
      });

      $($nodeSpan[0]).find(`#removeNodeIcon`).on('click', (ev) => {
        this.removeNode();
      });
    }

  }

  dropNode(node, data) {
    // tslint:disable-next-line:max-line-length
    if (data.otherNode.folder === true && (this.maxTreeDepth(data.otherNode) + (node.getLevel() - 1)) > _.get(this.config, 'maxDepth')) {
      return this.dropNotAllowed();
    }
    if (data.otherNode.folder === false && !this.checkContentAddition(node, data.otherNode)) {
      return this.dropNotAllowed();
    }
    data.otherNode.moveTo(node, data.hitMode);
    this.treeService.nextTreeStatus('reorder');
    return true;
  }

  dragDrop(node, data) {
    if ((data.hitMode === 'before' || data.hitMode === 'after' || data.hitMode === 'over') && data.node.data.root) {
      return this.dropNotAllowed();
    }
    if (_.get(this.config, 'maxDepth')) {
      return this.dropNode(node, data);
    }
  }

  dropNotAllowed() {
    this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.007'));
    return false;
  }

  maxTreeDepth(root) {
    const buffer = [{ node: root, depth: 1 }];
    let current = buffer.pop();
    let max = 0;

    while (current && current.node) {
      // Find all children of this node.
      _.forEach(current.node.children, (child) => {
        buffer.push({ node: child, depth: current.depth + 1 });
      });
      if (current.depth > max) {
        max = current.depth;
      }
      current = buffer.pop();
    }
    return max;
  }

  checkContentAddition(targetNode, contentNode): boolean {
    if (targetNode.folder === false) {
      return false;
    }
    const nodeConfig = this.config.hierarchy[`level${targetNode.getLevel() - 1}`];
    const contentPrimaryCategories = _.flatMap(_.get(nodeConfig, 'children'));
    if (!_.isEmpty(contentPrimaryCategories)) {
      return _.includes(contentPrimaryCategories, _.get(contentNode, 'data.metadata.primaryCategory')) ? true : false;
    }
    return false;
  }

  removeNode() {
    this.treeEventEmitter.emit({ type: 'deleteNode' });
    this.telemetryService.interact({ edata: this.getTelemetryInteractEdata('delete') });
  }

  handleActionButtons(el) {
    console.log('action buttons -------->', el.id);
    switch (el.id) {
      case 'edit':
        break;
      case 'delete':
        this.removeNode();
        break;
      case 'addsibling':
        this.addSibling();
        break;
      case 'addchild':
        this.addChild();
        break;
      case 'addresource':
        break;
    }
  }

  addFromLibrary() {
    this.editorService.emitshowLibraryPageEvent('showLibraryPage');
  }
  getTelemetryInteractEdata(id?) {
    return {
      id: id || 'collection-toc',
      type: 'click',
      subtype: 'launch',
      pageid: this.telemetryService.telemetryPageId,
      extra: {
        values: [_.get(this.getActiveNode(), 'data')]
      }
    };
  }

  createNewContent() {
    this.treeEventEmitter.emit({ type: 'createNewContent' });
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
