import { Injectable } from '@angular/core';
import 'jquery.fancytree';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
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

  treeCache = {
    nodesModified: {}
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
    // objectType = this.getObjectType(objectType);
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
      newNode.setActive();
    } else {
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
    }
    // selectedNode.sortChildren(null, true);
    selectedNode.setExpanded();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
  }


  getActiveNode () {
    return $(this.treeNativeElement).fancytree('getTree').getActiveNode();
  }

  getFirstChild () {
    return $(this.treeNativeElement).fancytree('getRootNode').getFirstChild();
  }

}
