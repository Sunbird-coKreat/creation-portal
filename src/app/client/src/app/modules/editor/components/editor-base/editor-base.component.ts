import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfigService, ICollectionTreeOptions } from '@sunbird/shared';
import { TreeService, EditorService } from '../../services';
import {toolbarConfig, templateList, collectionTreeNodes} from '../../editor.config';
@Component({
  selector: 'app-editor-base',
  templateUrl: './editor-base.component.html',
  styleUrls: ['./editor-base.component.scss']
})
export class EditorBaseComponent implements OnInit {

  public collectionTreeNodes: any;
  public selectedQuestionData: any = {};
  editorState: any = {};
  toolbarConfig = toolbarConfig;
  templateListInput: any = templateList;
  public showQuestionTemplate: Boolean = false;
  private nodeCreateType = 'child';

  constructor(private configService: ConfigService, public treeService: TreeService,
    public editorService: EditorService) {
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
