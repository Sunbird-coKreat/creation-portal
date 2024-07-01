import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule } from '@sunbird/telemetry';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v9';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';
import { SunbirdEpubPlayerModule } from '@project-sunbird/sunbird-epub-player-v9';
import {
  ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
  CollectionTreeComponent, FancyTreeComponent, CollectionPlayerMetadataComponent,
  ContentRatingComponent, CommingSoonComponent
} from './components';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    TelemetryModule,
    SharedModule,
    CoreModule,
    SunbirdPdfPlayerModule,
    SunbirdVideoPlayerModule,
    SunbirdEpubPlayerModule
  ],
  declarations: [ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
    CollectionTreeComponent, FancyTreeComponent, CollectionPlayerMetadataComponent, ContentRatingComponent,
    CommingSoonComponent],
  exports: [ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
    CollectionTreeComponent, FancyTreeComponent, CollectionPlayerMetadataComponent, ContentRatingComponent,
    CommingSoonComponent]
})
export class PlayerHelperModule { }
