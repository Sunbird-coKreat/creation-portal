import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-question-template',
  templateUrl: './question-template.component.html',
  styleUrls: ['./question-template.component.scss']
})
export class QuestionTemplateComponent implements OnInit, OnDestroy {

  @Input() templateList: any;
  @Output() templateSelection = new EventEmitter<any>();
  showButton = false;
  public templateSelected;
  constructor() { }


  ngOnInit() {
  }


  handleSubmit() {
    /*this.selectedtemplateDetails = _.find(this.templateList, (template) => {
     return template.identifier === this.templateSelected;
    });*/
    /*this.programsService.getCategoryDefinition(this.templateSelected).subscribe((res)=> {
      this.selectedtemplateDetails = _.find(this.programsService.contentCategories, { 'name': this.templateSelected })
    }, (err)=> {

    })*/
    this.submit();
  }

  submit() {
    this.templateSelection.emit(this.templateSelected);
  }

  ngOnDestroy() {}

}
