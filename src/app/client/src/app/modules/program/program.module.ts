import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ProgramRoutingModule } from './program-routing.module';
import { OnboardPopupComponent } from './components/onboard-popup/onboard-popup.component';
import { ContributorProfilePopupComponent } from './components/contributor-profile-popup/contributor-profile-popup.component';
import { CreateProgramComponent } from './components/create-program/create-program.component';
import { ProgramNominationsComponent } from './components/program-nominations/program-nominations.component';
import { ListContributorTextbooksComponent } from './components/list-contributor-textbooks/list-contributor-textbooks.component';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';

import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { SourcingModule } from '../sourcing/sourcing.module';
import { CollectionComponent, DashboardComponent, ChapterListComponent } from '../sourcing';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption-v8';
import { OrgReportsComponent } from './components/org-reports/org-reports.component';
import { ContributorsListComponent } from './components/contributors-list/contributors-list.component';
import { CommonFormElementsModule } from 'common-form-elements-web-v9';

@NgModule({
  declarations: [
    // tslint:disable-next-line:max-line-length
    OnboardPopupComponent,
    CreateProgramComponent,
    ProgramNominationsComponent,
    ListContributorTextbooksComponent, ContributorProfilePopupComponent, OrgUserListComponent, OrgReportsComponent, ContributorsListComponent],
  imports: [
  SuiModule,
    CommonModule,
    ProgramRoutingModule,
    CommonConsumptionModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    TelemetryModule,
    SourcingModule,
    SharedFeatureModule,
    CommonFormElementsModule,
    DynamicModule.withComponents([CollectionComponent, DashboardComponent, ChapterListComponent])
  ],
  exports: [
    OnboardPopupComponent
  ]
})
export class ProgramModule { }
