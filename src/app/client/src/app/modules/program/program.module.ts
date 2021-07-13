import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ProgramRoutingModule } from './program-routing.module';
import { ProgramComponent } from './components/program/program.component';
import { OnboardPopupComponent } from './components/onboard-popup/onboard-popup.component';
import { ContributorProfilePopupComponent } from './components/contributor-profile-popup/contributor-profile-popup.component';
import { ProgramHeaderComponent } from './components/program-header/program-header.component';
import { CreateProgramComponent } from './components/create-program/create-program.component';
import { ProgramNominationsComponent } from './components/program-nominations/program-nominations.component';
import { ListContributorTextbooksComponent } from './components/list-contributor-textbooks/list-contributor-textbooks.component';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { SourcingModule } from '../sourcing/sourcing.module';
import { CollectionComponent, DashboardComponent, ChapterListComponent } from '../sourcing';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption-v8';
import { OrgReportsComponent } from './components/org-reports/org-reports.component';
import {QuestionEditorModule} from "../question-editor";

@NgModule({
  declarations: [
    // tslint:disable-next-line:max-line-length
    ProgramComponent, OnboardPopupComponent,
    ProgramHeaderComponent, CreateProgramComponent,
    ProgramNominationsComponent,
    ListContributorTextbooksComponent, ContributorProfilePopupComponent, OrgUserListComponent, OrgReportsComponent],
  imports: [
  SuiModule,
    CommonModule,
    ProgramRoutingModule,
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
    DynamicModule.withComponents([CollectionComponent, DashboardComponent, ChapterListComponent]),
    QuestionEditorModule
  ],
  exports: [
    ProgramComponent,
    OnboardPopupComponent
  ]
})
export class ProgramModule { }
