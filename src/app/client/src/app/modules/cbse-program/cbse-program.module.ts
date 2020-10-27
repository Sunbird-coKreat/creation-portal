import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from './pipe/sanitize-html.pipe';
import { QuestionListComponent,
  QuestionCreationComponent, ChapterListComponent, McqCreationComponent, McqTemplateSelectionComponent,
  CkeditorToolComponent, QuestionPreviewComponent, BulkUploadComponent } from './components';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '@sunbird/shared';
import { QuestionCreationHeaderComponent } from './components/question-creation-header/question-creation-header.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecursiveTreeComponent } from './components/recursive-tree/recursive-tree.component';
import { ContentUploaderComponent } from './components/content-uploader/content-uploader.component';
import { ResourceTemplateComponent } from './components/resource-template/resource-template.component';
import { DynamicModule } from 'ng-dynamic-component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CollectionComponent } from './components/collection/collection.component';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { ContentEditorComponent } from './components/content-editor/content-editor.component';
import { CollectionHierarchyService } from './services/collection-hierarchy/collection-hierarchy.service';
import { SlickModule } from 'ngx-slick';
import { SharedFeatureModule } from '../shared-feature';
import { RouterModule } from '@angular/router';
import { BulkApprovalComponent } from './components/bulk-approval/bulk-approval.component';
import { CoreModule } from '@sunbird/core';
import {CbseRoutingModule} from './cbse-routing.module';
import { MvcLibraryComponent } from './components/mvc-library/mvc-library.component';
import { MvcListComponent } from './components/mvc-list/mvc-list.component';
import { MvcFilterComponent } from './components/mvc-filter/mvc-filter.component';
import { MvcPlayerComponent } from './components/mvc-player/mvc-player.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { NgInviewModule } from 'angular-inport';
@NgModule({
  declarations: [QuestionListComponent, QuestionCreationComponent,
    ChapterListComponent, McqCreationComponent, CkeditorToolComponent ,
    McqTemplateSelectionComponent, QuestionPreviewComponent, SanitizeHtmlPipe,
    QuestionCreationHeaderComponent, DashboardComponent, RecursiveTreeComponent,
    ContentUploaderComponent,  ResourceTemplateComponent, CollectionComponent,
    ResourceReorderComponent, ContentEditorComponent, MvcLibraryComponent,
    MvcListComponent, MvcFilterComponent, MvcPlayerComponent, SkeletonLoaderComponent,
    BulkApprovalComponent, BulkUploadComponent],
  imports: [
    RouterModule,
    CoreModule,
    CommonModule,
    SuiTabsModule,
    CommonConsumptionModule,
    SuiModule,
    ReactiveFormsModule, FormsModule, SharedModule,
    InfiniteScrollModule,
    SharedFeatureModule,
    PlayerHelperModule,
    TelemetryModule,
    SlickModule.forRoot(),
    CbseRoutingModule,
    DynamicModule.withComponents([QuestionListComponent,
      QuestionCreationComponent, ChapterListComponent, McqCreationComponent, CkeditorToolComponent ,
      McqTemplateSelectionComponent, QuestionPreviewComponent, QuestionCreationHeaderComponent,
      DashboardComponent, RecursiveTreeComponent, ContentUploaderComponent, ResourceTemplateComponent,
      ContentEditorComponent]),
    NgInviewModule
  ],
  providers: [CollectionHierarchyService],
  exports: [ SanitizeHtmlPipe ]
})
export class CbseProgramModule { }
