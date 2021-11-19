import { TranscriptsComponent } from './components/transcripts/transcripts.component';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContributeRoutingModule } from './contibute-routing.module';
import { ProgramComponent } from './components/program/program.component';
import { OnboardPopupComponent } from './components/onboard-popup/onboard-popup.component';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { SourcingModule } from '../sourcing/sourcing.module';
import { CollectionComponent, DashboardComponent } from '../sourcing';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption-v8';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { SharedFeatureModule } from '../shared-feature/shared-feature.module';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { MyContentComponent } from './components/my-content/my-content.component';
import { QumlLibraryModule, QuestionCursor } from '@project-sunbird/sunbird-quml-player-v9';
import { QumlPlayerService } from '../sourcing';
@NgModule({
  providers: [
    { provide: QuestionCursor, useExisting: QumlPlayerService }
  ],
  declarations: [
    ProgramComponent,
    OnboardPopupComponent,
    OrgUserListComponent,
    MyContentComponent,
    TranscriptsComponent
  ],
  imports: [
    SuiModule,
    CommonModule,
    ContributeRoutingModule,
    CommonConsumptionModule,
    SlickModule,
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
    DynamicModule.withComponents([CollectionComponent, DashboardComponent])
  ],
  exports: [
    ProgramComponent,
    OnboardPopupComponent,
    TranscriptsComponent
  ]
})
export class ContributeModule { }
