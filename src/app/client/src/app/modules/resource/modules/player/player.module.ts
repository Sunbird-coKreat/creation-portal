import { PlayerRoutingModule } from './player-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SuiModule,
        PlayerRoutingModule,
        TelemetryModule,
        FormsModule,
        SharedModule,
        CoreModule,
        PlayerHelperModule,
    ],
    providers: [],
    declarations: [CollectionPlayerComponent, ContentPlayerComponent]
})
export class PlayerModule { }
