import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { TreeService, EditorService } from '../../services';
import { toolbarConfig, collectionTreeNodes } from '../../editor.config';
import { CbseProgramService } from '../../../cbse-program/services';
import { QuestionService } from '../../services/question/question.service';
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
  public showLoader: Boolean = true;

  constructor(public treeService: TreeService, private editorService: EditorService, private activatedRoute: ActivatedRoute,
    private cbseService: CbseProgramService, public questionService: QuestionService, private router: Router) {
    this.editorParams = {
      collectionId: _.get(this.activatedRoute, 'snapshot.params.questionSetId'),
      type: _.get(this.activatedRoute, 'snapshot.params.type')
    };
  }

  ngOnInit() {
    this.fetchQuestionSetHierarchy();
  }

  fetchQuestionSetHierarchy() {
    this.editorService.getQuestionSetHierarchy(this.editorParams.collectionId).pipe(catchError(error => {
      this.showLoader = false;
      const errInfo = {
        errorMsg: 'Fetching question set details failed. Please try again...',
       };
      return throwError(this.cbseService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.collectionTreeNodes = res;
      this.showLoader = false;
      // this.collectionTreeNodes = collectionTreeNodes;
    });
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent();
        break;
      case 'removeQuestion':
        this.removeNode();
        break;
      // case 'editQuestion':
      //   this.editQuestion();
      //   break;
      default:
        break;
    }
  }

  saveContent() {
    this.editorService.updateQuestionSetHierarchy()
    .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
      this.treeService.replaceNodeId(response.identifiers);
      this.treeService.clearTreeCache();
      alert('Hierarchy is Sucessfuly Updated');
    });
  }

  removeNode() {
    this.treeService.removeNode();
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

  // editQuestion() {
  //   this.questionService.setQuestionType("mcq");
  //   this.questionService.setQuestionData(this.selectedQuestionData);
  //   const questionsetId = _.get(this.activatedRoute, 'snapshot.params.questionSetId');
  //     this.router.navigateByUrl(`create/questionSet/${questionsetId}/question`);
  // }
}
