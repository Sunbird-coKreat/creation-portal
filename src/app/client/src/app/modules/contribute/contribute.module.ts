import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContributeRoutingModule } from './contibute-routing.module';
import { ListAllProgramsComponent } from './components';
import { ProgramComponent } from './components/program/program.component';
import { OnboardPopupComponent } from './components/onboard-popup/onboard-popup.component';
import { ProgramHeaderComponent } from './components/program-header/program-header.component';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { DynamicModule } from 'ng-dynamic-component';
import { CbseProgramModule } from '../../modules/cbse-program/cbse-program.module';
import { CollectionComponent, DashboardComponent } from '../cbse-program';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption';
import { ListAllMyProgramsComponent } from './components/list-all-my-programs/list-all-my-programs.component';
import { ListNominatedTextbooksComponent} from './components/list-nominated-textbooks/list-nominated-textbooks.component';
// import { MyProgramComponent} from './components/my-program/my-program.component';
@NgModule({
  
  declarations: [ListAllProgramsComponent, ProgramComponent, OnboardPopupComponent, ProgramHeaderComponent, ListAllMyProgramsComponent, ListNominatedTextbooksComponent  ],
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
    CbseProgramModule,
    
    DynamicModule.withComponents([CollectionComponent, DashboardComponent])
  ],
  exports: [
    ProgramComponent,
    OnboardPopupComponent,
  ]
})
export class ContributeModule { }
