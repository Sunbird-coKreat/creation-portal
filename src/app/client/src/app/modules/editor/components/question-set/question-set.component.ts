import { Component, OnInit, ViewChild } from '@angular/core';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { QuestionService } from '../../services/question/question.service';
@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html',
  styleUrls: ['./question-set.component.scss']
})
export class QuestionSetComponent implements OnInit {

  @ViewChild('modal')
  public modalTemplate: ModalTemplate<{ data: string }, string, string>;
  constructor(public activatedRoute:ActivatedRoute,
    public router: Router, public questionService: QuestionService) { }

  ngOnInit() {
  }

  public AddQuestionModal = false;

  openAddQuestionModal() {
    this.AddQuestionModal = true;
  }

  closeAddQuestionModal() {
    this.AddQuestionModal = false;
  }

  directToComponent(modal){
    const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
    // console.log("config", config);
    // console.log("modal", modal);
    modal.close();
    // this.questionService.setQuestionType("mcq");
    // this.questionService.setQuestionData(undefined);
    const questionsetId = _.get(this.activatedRoute, 'snapshot.params.questionSetId');
    this.router.navigate([`create/questionSet/${questionsetId}/question`], { queryParams: { type: 'default' } });
  }

}
