import { Component, OnInit } from '@angular/core';
import { TreeService, EditorService } from '../../services';
import { toolbarConfig, collectionTreeNodes } from '../../editor.config';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from '@sunbird/shared';
import { concatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash-es';

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
  public selectedNodeData: any = {};
  toolbarConfig = toolbarConfig;
  public showQuestionTemplate: Boolean = false;
  private editorParams: IeditorParams;

  constructor(public treeService: TreeService, private editorService: EditorService, private activatedRoute: ActivatedRoute,
      public toasterService: ToasterService) {
    this.editorParams = {
      collectionId: this.activatedRoute.snapshot.params.collectionId,
      type: this.activatedRoute.snapshot.params.type
    };
  }

  ngOnInit() {
    this.fetchCollectionHierarchy().subscribe();
  }

  fetchCollectionHierarchy(): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.editorService.fetchCollectionHierarchy(this.editorParams).pipe(tap(data => this.collectionTreeNodes = {data: _.get(data, 'result.content')}));
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent();
        break;
      case 'deleteContent':
          this.removeNode();
        break;
      default:
        break;
    }
  }

  saveContent() {
    // const tree = this.treeService.getTreeObject();
    // console.log(tree);
    // console.log(this.treeService.getActiveNode());
    this.editorService.updateHierarchy()
    .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
      this.treeService.replaceNodeId(response.identifiers);
      this.treeService.clearTreeCache();
      this.toasterService.success('Hierarchy is Sucessfuly Updated');
    });
  }

  removeNode() {
    this.treeService.removeNode();
  }

  treeEventListener(event: any) {
    console.log(event);
    switch (event.type) {
      case 'nodeSelect':
        this.selectedNodeData = event.data;
        break;
      default:
        break;
    }
  }
}
