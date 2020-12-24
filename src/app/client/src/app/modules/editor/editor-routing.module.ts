import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorBaseComponent, QuestionBaseComponent } from './components';
import * as telemetryLabels from '../shared/services/config/telemetry-label.config.json';
const telemetryPage = telemetryLabels.default;

const routes: Routes = [
  {
    path: 'collection/:collectionId/:type', component: EditorBaseComponent, pathMatch: 'full',
    data: {
      hideHeaderNFooter: 'true',
    },
  },
  {
    path: 'questionSet/:questionSetId', component: EditorBaseComponent, pathMatch: 'full',
    data: {
      hideHeaderNFooter: 'true',
      telemetry: {
        env: 'creation-portal', pageid: telemetryPage.pageId.contribute.questionSet, type: telemetryPage.pageType.list,
        subtype: telemetryPage.pageSubtype.paginate
      }
    },
  },
  {
    path: 'questionSet/:questionSetId/question', component: QuestionBaseComponent, pathMatch: 'full',
    data: {
      hideHeaderNFooter: 'true',
      telemetry: {
        env: 'creation-portal', pageid: telemetryPage.pageId.contribute.questionSet, type: telemetryPage.pageType.list,
        subtype: telemetryPage.pageSubtype.paginate
      }
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
