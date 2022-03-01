import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';

@NgModule({
  declarations: [WorkspaceComponent],
  imports: [
    WorkspaceRoutingModule,
    CommonModule
  ]
})
export class WorkspaceModule { }
