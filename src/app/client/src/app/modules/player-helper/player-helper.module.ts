import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { TelemetryModule } from '@sunbird/telemetry';
import {PlayerComponent, ContentRatingComponent
} from './components';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    TelemetryModule,
    SharedModule,
    CoreModule
  ],
  declarations: [PlayerComponent, ContentRatingComponent],
  exports: [PlayerComponent, ContentRatingComponent]
})
export class PlayerHelperModule { }
