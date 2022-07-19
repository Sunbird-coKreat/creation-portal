import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { MatDialogModule } from '@angular/material/dialog';
import { ContentListComponent } from './components/content-list/content-list.component';
import { SearchService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ContentService } from './services/content/content.service';
import { DynamicModule } from 'ng-dynamic-component';
import { SourcingModule } from '../sourcing/sourcing.module';
import { CollectionComponent, DashboardComponent, ChapterListComponent } from '../sourcing';
@NgModule({
  declarations: [WorkspaceComponent, ContentListComponent],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    CommonModule,
    SuiModule,
    SharedModule,
    TelemetryModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedFeatureModule,
    SourcingModule,
    DynamicModule.withComponents([CollectionComponent, DashboardComponent, ChapterListComponent])
  ],
  providers: [
    SearchService,
    ContentService
  ]
})
export class WorkspaceModule { }
