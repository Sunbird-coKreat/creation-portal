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
import { ProgramHeaderComponent } from './components/program-header/program-header.component';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { SourcingModule } from '../sourcing/sourcing.module';
import { CollectionComponent, DashboardComponent } from '../sourcing';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption-v8';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { SharedFeatureModule } from '../shared-feature/shared-feature.module';
import { QuestionEditorModule } from '../question-editor/question-editor.module';
import { QumlPlayerService } from '../sourcing/services/quml-player/quml-player.service';
import { EditorCursor } from '../question-editor/collection-editor-cursor.service';
@NgModule({
  declarations: [
    ProgramComponent,
    OnboardPopupComponent,
    ProgramHeaderComponent,
    OrgUserListComponent],
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
    DynamicModule.withComponents([CollectionComponent, DashboardComponent]),
    QuestionEditorModule
  ],
  providers: [
    { provide: EditorCursor, useExisting: QumlPlayerService },
  ],
  exports: [
    ProgramComponent,
    OnboardPopupComponent,
  ]
})
export class ContributeModule { }
