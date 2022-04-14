import { ContentResolver } from './resolver/content.resolver';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
{
  path: '', component: WorkspaceComponent, pathMatch: 'full'
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ContentResolver]
})
export class WorkspaceRoutingModule { }
