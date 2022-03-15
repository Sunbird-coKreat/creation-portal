import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { PublishedComponent } from './components/published/published.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { MatDialogModule } from '@angular/material/dialog';
import { ContentListHeaderComponent } from './components/content-list-header/content-list-header.component';
import { ContentListComponent } from './components/content-list/content-list.component';
import { SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedFeatureModule } from '@sunbird/shared-feature';

@NgModule({
  declarations: [WorkspaceComponent, PublishedComponent, ContentListHeaderComponent, ContentListComponent],
  imports: [
    WorkspaceRoutingModule,
    CommonModule,
    SuiModule,
    SharedModule,
    TelemetryModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedFeatureModule
  ],
  providers: [
    SearchService
  ]
})
export class WorkspaceModule { }
