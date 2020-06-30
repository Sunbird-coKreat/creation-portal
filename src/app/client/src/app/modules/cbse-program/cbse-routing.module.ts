import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MvcLibraryComponent } from './components/mvc-library/mvc-library.component';

const routes: Routes = [
{
  path: 'program/:programId/textbook/:collectionId/:collectionUnitId', component: MvcLibraryComponent, pathMatch: 'full',
  data: {
    hideHeaderNFooter: 'true',
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'mvc-explore' }
  },
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbseRoutingModule { }
