import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MvcLibraryComponent } from './components/mvc-library/mvc-library.component';
import * as telemetryLabels from '../shared/services/config/telemetry-label.config.json';
const telemetryPage = telemetryLabels.default;

const routes: Routes = [
{
  path: 'program/:programId/textbook/:collectionId/:collectionUnitId', component: MvcLibraryComponent, pathMatch: 'full',
  data: {
    hideHeaderNFooter: 'true',
    telemetry: { env: 'creation-portal', pageid: telemetryPage.pageId.contribute.projectAddFromLibrary,
    type: telemetryPage.pageType.workflow, subtype: telemetryPage.pageSubtype.paginate}
  },
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SourcingRoutingModule { }
