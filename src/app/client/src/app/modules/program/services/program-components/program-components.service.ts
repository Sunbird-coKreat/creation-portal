import { Injectable } from '@angular/core';
import { CollectionComponent } from '../../../sourcing/components/collection/collection.component';
import {DashboardComponent } from '../../../sourcing/components/dashboard/dashboard.component';
import { ContentUploaderComponent } from '../../../sourcing/components/content-uploader/content-uploader.component';
import { QuestionListComponent } from '../../../sourcing/components/question-list/question-list.component';
import { ContentEditorComponent } from '../../../sourcing/components/content-editor/content-editor.component';
import { QuestionSetEditorComponent } from '../../../sourcing/components/question-set-editor/question-set-editor.component';
import { ToasterService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class ProgramComponentsService {
  private componentMapping = {
    dashboardComponent: DashboardComponent,
    collectionComponent: CollectionComponent,
    uploadComponent: ContentUploaderComponent,
    questionSetComponent: QuestionListComponent,
    curiositySetComponent: QuestionListComponent,
    questionSetEditorComponent: QuestionSetEditorComponent,
    editorComponent: ContentEditorComponent
  };
  constructor(public toasterService: ToasterService) {

  }

  getComponentInstance(component) {
    if (!this.componentMapping[component]) {
      this.toasterService.error('Component not configured for the content type');
    }
    return this.componentMapping[component];
  }
}
