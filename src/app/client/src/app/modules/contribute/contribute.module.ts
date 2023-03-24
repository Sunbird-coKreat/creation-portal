import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContributeRoutingModule } from './contibute-routing.module';
import { ProgramComponent } from './components/program/program.component';
import { OnboardPopupComponent } from './components/onboard-popup/onboard-popup.component';
import { NgInviewModule } from '@stockopedia/angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { SourcingModule } from '../sourcing/sourcing.module';
import { CollectionComponent, DashboardComponent } from '../sourcing';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption-v8';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { SharedFeatureModule } from '../shared-feature/shared-feature.module';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { MyContentComponent } from './components/my-content/my-content.component';
import { QumlLibraryModule, QuestionCursor } from '@project-sunbird/sunbird-quml-player';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';
import { QumlPlayerService } from '../sourcing';
@NgModule({
  providers: [
    { provide: QuestionCursor, useExisting: QumlPlayerService }
  ],
  declarations: [
    ProgramComponent,
    OnboardPopupComponent,
    OrgUserListComponent,
    MyContentComponent
  ],
  imports: [
    SuiModule,
    CommonModule,
    ContributeRoutingModule,
    CommonConsumptionModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    NgInviewModule,
    TelemetryModule,
    SourcingModule,
    SharedFeatureModule,
    PlayerHelperModule,
    QumlLibraryModule,
    SunbirdVideoPlayerModule,
    DynamicModule.withComponents([CollectionComponent, DashboardComponent])
  ],
  exports: [
    ProgramComponent,
    OnboardPopupComponent,
  ]
})
export class ContributeModule { }
