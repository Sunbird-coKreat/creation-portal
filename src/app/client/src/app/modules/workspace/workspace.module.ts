import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { PublishedComponent } from './components/published/published.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { ContentListHeaderComponent } from './components/content-list-header/content-list-header.component';
import { ContentListComponent } from './components/content-list/content-list.component';

@NgModule({
  declarations: [WorkspaceComponent, PublishedComponent, ContentListHeaderComponent, ContentListComponent],
  imports: [
    WorkspaceRoutingModule,
    CommonModule,
    SuiModule
  ]
})
export class WorkspaceModule { }
