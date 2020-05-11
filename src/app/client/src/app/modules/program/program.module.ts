import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { ProgramRoutingModule } from './program-routing.module';
import { ListAllProgramsComponent } from './components';
import { ProgramComponent } from './components/program/program.component';
import { OnboardPopupComponent } from './components/onboard-popup/onboard-popup.component';
import { ContributorProfilePopupComponent } from './components/contributor-profile-popup/contributor-profile-popup.component';
import { ProgramHeaderComponent } from './components/program-header/program-header.component';
import { CreateProgramComponent } from './components/create-program/create-program.component';
import { ProgramNominationsComponent } from './components/program-nominations/program-nominations.component';
import { ListNominationsComponent } from './components/list-nominations/list-nominations.component';
import { ListContributorTextbooksComponent } from './components/list-contributor-textbooks/list-contributor-textbooks.component';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { CbseProgramModule } from '../../modules/cbse-program/cbse-program.module';
import { CollectionComponent, DashboardComponent, ChapterListComponent } from '../cbse-program';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption';
import { ProgramCsvExportComponent } from './components/program-csv-export/program-csv-export.component';

@NgModule({
  declarations: [ListAllProgramsComponent,
    // tslint:disable-next-line:max-line-length
    ProgramComponent, OnboardPopupComponent,
    ProgramHeaderComponent, CreateProgramComponent,
    ProgramNominationsComponent, ListNominationsComponent,
    ListContributorTextbooksComponent, ContributorProfilePopupComponent, ProgramCsvExportComponent],
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
    CbseProgramModule,
    SharedFeatureModule,
    DynamicModule.withComponents([CollectionComponent, DashboardComponent, ChapterListComponent, ListNominationsComponent])
  ],
  exports: [
    ProgramComponent,
    OnboardPopupComponent
  ]
})
export class ProgramModule { }
