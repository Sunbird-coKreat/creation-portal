import { Component, AfterViewInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import 'jquery.fancytree';
import { IFancytreeOptions } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-fancy-tree',
  templateUrl: './fancy-tree.component.html'
})
export class FancyTreeComponent implements AfterViewInit {
  @ViewChild('fancyTree') public tree: ElementRef;
  @Input() public nodes: any;
  @Input() public options: any;
  @Input() public rootNode;
  @Output() public itemSelect: EventEmitter<Fancytree.FancytreeNode> = new EventEmitter();
  config: any = {
    'baseURL': '',
    'corePluginsPackaged': true,
    'pluginRepo': '/plugins',
    'dispatcher': 'console',
    'apislug': '/action',
    'nodeDisplayCriteria': {
      'contentType': ['TextBookUnit']
    },
    'editorType': 'Collection',
    'collectionEditorPlugins': [{
      'id': 'org.ekstep.sunbirdcommonheader',
      'ver': '1.9',
      'type': 'plugin'
    },
    {
      'id': 'org.ekstep.sunbirdmetadata',
      'ver': '1.1',
      'type': 'plugin'
    },
    {
      'id': 'org.ekstep.metadata',
      'ver': '1.5',
      'type': 'plugin'
    },
    {
      'id': 'org.ekstep.lessonbrowser',
      'ver': '1.5',
      'type': 'plugin'
    }
    ],
    keywordsLimit: 500,
    editorConfig: {
      'rules': {
        'levels': 7,
        'objectTypes': [
          {
            'type': 'TextBook',
            'label': 'Textbook',
            'isRoot': true,
            'editable': true,
            'childrenTypes': [
              'TextBookUnit',
              'Collection',
              'Resource'
            ],
            'addType': [
              'Editor'
            ],
            'iconClass': 'fa fa-book'
          },
          {
            'type': 'TextBookUnit',
            'label': 'Textbook Unit',
            'isRoot': false,
            'editable': true,
            'childrenTypes': [
              'TextBookUnit',
              'Collection',
              'Course',
              'Resource',
              'FocusSpot',
              'LearningOutcomeDefinition',
              'PracticeQuestionSet',
              'CuriosityQuestions',
              'MarkingSchemeRubric',
              'ExplanationResource',
              'ExperientialResource',
              'eTextBook',
              'PracticeResource',
              'TeachingMethod',
              'PedagogyFlow',
              'CuriosityQuestionSet',
              'ConceptMap',
              'SelfAssess',
              'ExplanationVideo',
              'ClassroomTeachingVideo',
              'ExplanationReadingMaterial',
              'LearningActivity',
              'PreviousBoardExamPapers',
              'LessonPlanResource',
              'TVLesson'
            ],
            'addType': [
              'Editor'
            ],
            'iconClass': 'fa fa-folder-o'
          },
          {
            'type': 'CourseUnit',
            'label': 'Course Unit',
            'isRoot': false,
            'editable': true,
            'childrenTypes': [
              'CourseUnit',
              'Collection',
              'Course',
              'Resource',
              'FocusSpot',
              'LearningOutcomeDefinition',
              'PracticeQuestionSet',
              'CuriosityQuestions',
              'MarkingSchemeRubric',
              'ExplanationResource',
              'ExperientialResource',
              'eTextBook',
              'PracticeResource',
              'TeachingMethod',
              'PedagogyFlow',
              'CuriosityQuestionSet',
              'ConceptMap',
              'SelfAssess',
              'ExplanationVideo',
              'ClassroomTeachingVideo',
              'ExplanationReadingMaterial',
              'LearningActivity',
              'PreviousBoardExamPapers',
              'LessonPlanResource',
              'TVLesson'
            ],
            'addType': [
              'Editor'
            ],
            'iconClass': 'fa fa-folder-o'
          },
          {
            'type': 'Course',
            'label': 'Course',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': 'Browser',
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'Collection',
            'label': 'Collection',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'Resource',
            'label': 'Resource',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'LessonPlan',
            'label': 'LessonPlan',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'FocusSpot',
            'label': 'FocusSpot',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'LearningOutcomeDefinition',
            'label': 'LearningOutcomeDefinition',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'PracticeQuestionSet',
            'label': 'PracticeQuestionSet',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'CuriosityQuestions',
            'label': 'CuriosityQuestions',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'MarkingSchemeRubric',
            'label': 'MarkingSchemeRubric',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'ExplanationResource',
            'label': 'ExplanationResource',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'ExperientialResource',
            'label': 'ExperientialResource',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'eTextBook',
            'label': 'eTextBook',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'PracticeResource',
            'label': 'PracticeResource',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'TeachingMethod',
            'label': 'TeachingMethod',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'PedagogyFlow',
            'label': 'PedagogyFlow',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'CuriosityQuestionSet',
            'label': 'CuriosityQuestionSet',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'ConceptMap',
            'label': 'ConceptMap',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'SelfAssess',
            'label': 'SelfAssess',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'ExplanationVideo',
            'label': 'ExplanationVideo',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'ClassroomTeachingVideo',
            'label': 'ClassroomTeachingVideo',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'ExplanationReadingMaterial',
            'label': 'ExplanationReadingMaterial',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'LearningActivity',
            'label': 'LearningActivity',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'PreviousBoardExamPapers',
            'label': 'PreviousBoardExamPapers',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'LessonPlanResource',
            'label': 'LessonPlanResource',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          },
          {
            'type': 'TVLesson',
            'label': 'TVLesson',
            'isRoot': false,
            'editable': false,
            'childrenTypes': [],
            'addType': [
              'Browser'
            ],
            'iconClass': 'fa fa-file-o'
          }
        ]
      },
      'publishMode': false,
      'isFlagReviewer': false,
      'mode': 'Edit',
      'contentStatus': 'draft'
    }
  };

  constructor(public activatedRoute: ActivatedRoute) { }
  ngAfterViewInit() {
    let options: any = {
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
      click: (event, data): boolean => {
        this.tree.nativeElement.click();
        const node = data.node;
        this.itemSelect.emit(node);
        return true;
      },
      activate:  (event, data) => {
        setTimeout(() => {
          this.itemSelect.emit(data.node);
        }, 0);
      }
    };
    options = { ...options, ...this.options };
    $(this.tree.nativeElement).fancytree(options);
    if (this.options.showConnectors) {
      $('.fancytree-container').addClass('fancytree-connectors');
    }
    const rootNode = $(this.tree.nativeElement).fancytree('getRootNode');
    const firstChild = rootNode.getFirstChild().getFirstChild(); // rootNode.getFirstChild() will always be available.
    firstChild ? firstChild.setActive() : rootNode.getFirstChild().setActive(); // select the first children node by default
  }

  expandAll(flag) {
    $(this.tree.nativeElement).fancytree('getTree').visit( (node) => { node.setExpanded(flag); });
  }

  collapseAllChildrens(flag) {
    const rootNode = $(this.tree.nativeElement).fancytree('getRootNode').getFirstChild();
    _.forEach(rootNode.children, (child) => {
      child.setExpanded(flag);
    });
  }

  addChild() {
    const tree = $(this.tree.nativeElement).fancytree('getTree');
    const rootNode = $(this.tree.nativeElement).fancytree('getRootNode').getFirstChild();

    const node = tree.getActiveNode();
    if (this.getObjectType(node.data.objectType).editable) {
      const childrenTypes = this.getObjectType(rootNode.data.objectType).childrenTypes;
      this.addNode(childrenTypes[0], {}, 'child');
    } else {
      alert('Sorry, this operation is not allowed.');
    }
  }

  addSibling() {
    const tree = $(this.tree.nativeElement).fancytree('getTree');
    const rootNode = $(this.tree.nativeElement).fancytree('getRootNode').getFirstChild();

    const node = tree.getActiveNode();
    if (!node.data.root) {
      const childrenTypes = this.getObjectType(rootNode.data.objectType).childrenTypes;
      this.addNode(childrenTypes[0], {}, 'sibling');
    } else {
      alert('Sorry, this operation is not allowed.');
    }
  }

  getActiveNode () {
    return $(this.tree.nativeElement).fancytree('getTree').getActiveNode();
  }

  addNode(objectType, data, createType) {
    let newNode;
    data = data || {};
    const selectedNode = this.getActiveNode();
    objectType = this.getObjectType(objectType);
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
      newNode.setActive();
    } else {
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
    }
    // selectedNode.sortChildren(null, true);
    selectedNode.setExpanded();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.tree.nativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.tree.nativeElement).scrollTop($('.fancytree-lastsib').height());
  }

  getObjectType(type) {
    return _.find(this.config.editorConfig.rules.objectTypes, function (obj) {
      return obj.type === type;
    });
  }

}
