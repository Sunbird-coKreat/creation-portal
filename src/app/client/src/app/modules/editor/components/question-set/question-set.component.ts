import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {TreeService} from '../../services';
import { templateList } from '../../editor.config';
import { ProgramsService, UserService } from '@sunbird/core';
@Component({
  selector: 'app-question-set',
  templateUrl: './question-set.component.html',
  styleUrls: ['./question-set.component.scss']
})
export class QuestionSetComponent implements OnInit {
  @Input() questionSetMetadata: any;
  @Output() toolbarEmitter = new EventEmitter<any>();

  constructor(private treeService: TreeService) { }

  ngOnInit() {
  }

  changeTitle($event) {
    console.log($event.target.value);
    this.treeService.setNodeTitle($event.target.value);
  }

  addQuestion() {
    this.toolbarEmitter.emit({'button': { 'type' : 'showQuestionTemplate'}});
  }

}
