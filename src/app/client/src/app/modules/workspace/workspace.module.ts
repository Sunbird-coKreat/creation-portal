import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [WorkspaceComponent],
  imports: [
    WorkspaceRoutingModule,
    CommonModule,
    MatSliderModule
  ]
})
export class WorkspaceModule { }
