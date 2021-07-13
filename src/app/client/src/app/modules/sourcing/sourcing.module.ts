import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from './pipe/sanitize-html.pipe';
import { QuestionListComponent,
  QuestionCreationComponent, ChapterListComponent, McqCreationComponent, McqTemplateSelectionComponent,
  CkeditorToolComponent, QuestionPreviewComponent, BulkUploadComponent } from './components';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
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
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { CollectionComponent } from './components/collection/collection.component';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { ContentEditorComponent } from './components/content-editor/content-editor.component';
import { CollectionHierarchyService } from './services/collection-hierarchy/collection-hierarchy.service';
import { SlickModule } from 'ngx-slick';
import { SharedFeatureModule } from '../shared-feature';
import { RouterModule } from '@angular/router';
import { BulkApprovalComponent } from './components/bulk-approval/bulk-approval.component';
import { CoreModule } from '@sunbird/core';
import {SourcingRoutingModule} from './sourcing-routing.module';
import { MvcLibraryComponent } from './components/mvc-library/mvc-library.component';
import { MvcListComponent } from './components/mvc-list/mvc-list.component';
import { MvcFilterComponent } from './components/mvc-filter/mvc-filter.component';
import { MvcPlayerComponent } from './components/mvc-player/mvc-player.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { NgInviewModule } from 'angular-inport';
import { QuestionSetEditorComponent } from './components/question-set-editor/question-set-editor.component';
import { CollectionEditorLibraryModule, EditorCursor } from '@project-sunbird/sunbird-collection-editor-v9';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { QumlPlayerService } from './services/quml-player/quml-player.service';
import { QumlLibraryModule, QuestionCursor } from '@project-sunbird/sunbird-quml-player-v9';


@NgModule({
  declarations: [QuestionListComponent, QuestionCreationComponent,
    ChapterListComponent, McqCreationComponent, CkeditorToolComponent ,
    McqTemplateSelectionComponent, QuestionPreviewComponent, SanitizeHtmlPipe,
    QuestionCreationHeaderComponent, DashboardComponent, RecursiveTreeComponent,
    ContentUploaderComponent,  ResourceTemplateComponent, CollectionComponent,
    ResourceReorderComponent, ContentEditorComponent, MvcLibraryComponent,
    MvcListComponent, MvcFilterComponent, MvcPlayerComponent, SkeletonLoaderComponent,
    BulkApprovalComponent, BulkUploadComponent, QuestionSetEditorComponent],
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
    QumlLibraryModule,
    PlayerHelperModule,
    TelemetryModule,
    SlickModule.forRoot(),
    SourcingRoutingModule,
    DynamicModule.withComponents([QuestionListComponent,
      QuestionCreationComponent, ChapterListComponent, McqCreationComponent, CkeditorToolComponent ,
      McqTemplateSelectionComponent, QuestionPreviewComponent, QuestionCreationHeaderComponent,
      DashboardComponent, RecursiveTreeComponent, ContentUploaderComponent, ResourceTemplateComponent,
      ContentEditorComponent, QuestionSetEditorComponent]),
    NgInviewModule,
    CollectionEditorLibraryModule,
    CarouselModule.forRoot()
  ],
  providers: [
    { provide: QuestionCursor, useExisting: QumlPlayerService },
    { provide: EditorCursor, useExisting: QumlPlayerService },
    CollectionHierarchyService],
    exports: [SanitizeHtmlPipe, QuestionSetEditorComponent]
})
export class SourcingModule { }
