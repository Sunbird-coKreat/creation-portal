import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { TreeService, EditorService } from '../../services';
import { templateList, toolbarConfig} from '../../editor.config';
import { CbseProgramService } from '../../../cbse-program/services';
import { ProgramsService, UserService } from '@sunbird/core';
import { ConfigService, ToasterService, ResourceService} from '@sunbird/shared';

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

  public toolbarConfig = toolbarConfig;
  public templateList: any = templateList;
  public collectionTreeNodes: any;
  public selectedQuestionData: any = {};
  public showQuestionTemplate: Boolean = false;
  private editorParams: IeditorParams;
  public showLoader: Boolean = true;
  public showQuestionTemplatePopup: Boolean = false;

  constructor(public treeService: TreeService, private editorService: EditorService, private activatedRoute: ActivatedRoute,
    private cbseService: CbseProgramService, private userService: UserService, private programsService: ProgramsService,
    public configService: ConfigService, private toasterService: ToasterService, public resourceService: ResourceService,
    public router: Router) {
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
      const errInfo = {
        errorMsg: 'Fetching question set details failed. Please try again...',
       };
      return throwError(this.cbseService.apiErrorHandling(error, errInfo));
    }), finalize(() => { this.showLoader = false; })).subscribe(res => {
      this.collectionTreeNodes = res;
      if (_.isEmpty(res.children)) {
          // TODO: Call update questionSet APIs if children property empty
      }
    });
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveContent':
        this.saveContent();
        break;
      case 'submitContent':
        this.submitContent();
        break;
      case 'removeQuestion':
        this.removeNode();
        break;
      case 'editQuestion':
        this.redirectToQuestionTab();
        break;
      case 'showQuestionTemplate':
        this.showQuestionTemplatePopup = true;
        break;
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

  submitContent() {
    this.editorService.sendQuestionSetForReview(this.editorParams.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Sending question set for review failed. Please try again...',
       };
      return throwError(this.cbseService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.toasterService.success('Question set sent for review');
    });
  }

  removeNode() {
    this.treeService.removeNode();
  }

  treeEventListener(event: any) {
    switch (event.type) {
      case 'nodeSelect':
        this.selectedQuestionData = event.data;
        console.log(this.selectedQuestionData);
        break;
      default:
        break;
    }
  }

  handleTemplateSelection($event) {
    this.showQuestionTemplatePopup = false;
    const selectedQuestionType = $event.type;
    if (selectedQuestionType === 'close') { return false; }
    console.log(selectedQuestionType);
    // this.programsService.getCategoryDefinition(selectedQuestionType, this.userService.channel).subscribe((res) => {
    //   const selectedtemplateDetails = res.result.objectCategoryDefinition;
    //   const catMetaData = selectedtemplateDetails.objectMetadata;
    //   if (_.isEmpty(_.get(catMetaData, 'schema.properties.interactionTypes.enum'))) {
    //       this.toasterService.error(this.resourceService.messages.emsg.m0026);
    //   } else {
    //     const supportedMimeTypes = catMetaData.schema.properties.interactionTypes.enum;
    //     console.log(supportedMimeTypes);
    //   }
    // }, (err) => {
    //   this.toasterService.error(this.resourceService.messages.emsg.m0027);
    // });
    this.redirectToQuestionTab('default');
  }

  redirectToQuestionTab(type?) {
    let questionId;
    if (!type) {
      type = this.selectedQuestionData.data.metadata.interactionTypes || 'default';
      questionId = this.selectedQuestionData.data.metadata.identifier;
    }
    let queryParams = `?type=${type}`;
    if (questionId) { queryParams += `&questionId=${questionId}`; }
    this.router.navigateByUrl(`/create/questionSet/${this.editorParams.collectionId}/question${queryParams}`);
  }
}
