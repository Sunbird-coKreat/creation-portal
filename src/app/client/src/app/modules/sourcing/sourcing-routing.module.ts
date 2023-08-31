import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MvcLibraryComponent } from './components/mvc-library/mvc-library.component';
import * as telemetryLabels from '../shared/services/config/telemetry-label.config.json';
import { QuestionSetEditorComponent } from './components/question-set-editor/question-set-editor.component';
const telemetryPage = telemetryLabels.default;

const routes: Routes = [
{
  path: 'program/:programId/textbook/:collectionId/:collectionUnitId', component: MvcLibraryComponent, pathMatch: 'full',
  data: {
    hideHeaderNFooter: 'true',
    telemetry: { env: 'creation-portal', pageid: telemetryPage.pageId.contribute.projectAddFromLibrary,
    type: telemetryPage.pageType.workflow, subtype: telemetryPage.pageSubtype.paginate}
  },
},
{
  path: 'questionSet/:questionSetId', component: QuestionSetEditorComponent, pathMatch: 'full',
  data: {
    hideHeaderNFooter: 'true',
    telemetry: {
      env: 'creation-portal', pageid: telemetryPage.pageId.contribute.questionSet, type: telemetryPage.pageType.list,
      subtype: telemetryPage.pageSubtype.paginate
    }
  }
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourcingRoutingModule { }
