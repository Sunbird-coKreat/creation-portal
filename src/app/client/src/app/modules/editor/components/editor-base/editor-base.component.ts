import { Component, OnInit } from '@angular/core';
import { TreeService, EditorService } from '../../services';
import { toolbarConfig, collectionTreeNodes } from '../../editor.config';
import { ActivatedRoute } from '@angular/router';

interface IeditorParams {
  collectionId: string;
  type: string;
}
@Component({
  selector: 'app-editor-base',
  templateUrl: './editor-base.component.html',
  styleUrls: ['./editor-base.component.scss']
})
export class EditorBaseComponent implements OnInit {

  public collectionTreeNodes: any;
  public selectedQuestionData: any = {};
  toolbarConfig = toolbarConfig;
  public showQuestionTemplate: Boolean = false;
  private editorParams: IeditorParams;

  constructor(public treeService: TreeService, private editorService: EditorService, private activatedRoute: ActivatedRoute) {
    this.editorParams = {
      collectionId: this.activatedRoute.snapshot.params.collectionId,
      type: this.activatedRoute.snapshot.params.type
    };
  }

  ngOnInit() {
    this.collectionTreeNodes = collectionTreeNodes;
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent();
        break;
      default:
        break;
    }
  }

  saveContent() {
    const tree = this.treeService.getTreeObject();
    console.log(tree);
    console.log(this.treeService.getActiveNode());
    this.editorService.save();
    console.log(this.editorService.getCollectionHierarchy());
  }

  treeEventListener(event: any) {
    console.log(event);
    switch (event.type) {
      case 'nodeSelect':
        this.selectedQuestionData = event.data;
        break;
      default:
        break;
    }
  }
}
