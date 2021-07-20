import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuestionEditorRoutingModule} from './question-editor-routing.module';
// import {CertificateDetailsComponent} from './components/certificate-details/certificate-details.component';
import {SuiModalModule, SuiModule, SuiPopupModule} from 'ng2-semantic-ui-v9';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '@sunbird/shared';
import {PlayerHelperModule} from '@sunbird/player-helper';
import {
  AnswerComponent, CkeditorToolComponent,
  MetaFormComponent,
  OptionsComponent,
  QuestionComponent,
  QumlPlayerComponent
} from "./components";
import {CollectionIconComponent} from "./components/collection-icon/collection-icon.component";
import {CommonFormElementsModule} from "common-form-elements-v9";
import {HeaderComponent} from "./components/header/header.component";
import {TelemetryInteractDirective} from "./directives/telemetry-interact/telemetry-interact.directive";
import {QumlLibraryModule} from "@project-sunbird/sunbird-quml-player-v9";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {AssetBrowserComponent} from "./components/asset-browser/asset-browser.component";
import {DialcodeComponent} from "./components/dialcode/dialcode.component";
import {EditorComponent} from "./components/editor/editor.component";
import {FancyTreeComponent} from "./components/fancy-tree/fancy-tree.component";
import {ContentplayerPageComponent} from "./components/contentplayer-page/contentplayer-page.component";
import {QumlplayerPageComponent} from "./components/qumlplayer-page/qumlplayer-page.component";
import {CoreModule} from "../core";
import { DynamicModule } from 'ng-dynamic-component';
import {TemplateComponent} from "./components/template/template.component";
import {LibraryComponent} from "./components/library/library.component";
import {ManageCollaboratorComponent} from "./components/manage-collaborator/manage-collaborator.component";
import {SunbirdPdfPlayerModule} from "@project-sunbird/sunbird-pdf-player-v9";
import {SunbirdVideoPlayerModule} from "@project-sunbird/sunbird-video-player-v9";
import {LibraryFilterComponent} from "./components/library-filter/library-filter.component";
import {LibraryListComponent} from "./components/library-list/library-list.component";
import {LibraryPlayerComponent} from "./components/library-player/library-player.component";
import {ResourceReorderComponent} from "./components/resource-reorder/resource-reorder.component";
import {SkeletonLoaderComponent} from "./components/skeleton-loader/skeleton-loader.component";

@NgModule({
  declarations: [
    // CertificateDetailsComponent,
    MetaFormComponent,
    AnswerComponent,
    QuestionComponent,
    QumlPlayerComponent,
    OptionsComponent,
    CkeditorToolComponent,
    CollectionIconComponent,
    HeaderComponent,
    TelemetryInteractDirective,
    AssetBrowserComponent,
    DialcodeComponent,
    EditorComponent,
    FancyTreeComponent,
    ContentplayerPageComponent,
    QumlplayerPageComponent,
    TemplateComponent,
    LibraryComponent,
    ManageCollaboratorComponent,
    LibraryFilterComponent,
    LibraryListComponent,
    LibraryPlayerComponent,
    ResourceReorderComponent,
    SkeletonLoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModalModule,
    QuestionEditorRoutingModule,
    FormsModule,
    SharedModule,
    PlayerHelperModule,
    CommonFormElementsModule,
    SuiPopupModule,
    QumlLibraryModule,
    DynamicModule.withComponents([QuestionComponent]),
    InfiniteScrollModule,
    SuiModule,
    CoreModule,
    SunbirdPdfPlayerModule,
    SunbirdVideoPlayerModule
  ],
  exports: [
    MetaFormComponent,
    EditorComponent
  ],
  entryComponents: [
    QuestionComponent
  ]
})
export class QuestionEditorModule {
}
