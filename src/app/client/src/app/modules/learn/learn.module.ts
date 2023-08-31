import { TelemetryModule } from '@sunbird/telemetry';
import { LearnRoutingModule } from './learn-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
  CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
  UpdateCourseBatchComponent, CurriculumCardComponent, UnEnrollBatchComponent} from './components';
import { CourseConsumptionService, CourseBatchService, CourseProgressService , AssessmentScoreService } from './services';
import { CoreModule } from '@sunbird/core';
import { DashboardModule } from '@sunbird/dashboard';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { PlayerHelperModule } from '@sunbird/player-helper';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    DashboardModule,
    FormsModule,
    LearnRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    TelemetryModule,
    NgInviewModule,
    SharedFeatureModule,
    PlayerHelperModule
  ],
  providers: [CourseConsumptionService, CourseBatchService, CourseProgressService, AssessmentScoreService],
  declarations: [LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
    CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
    UpdateCourseBatchComponent, CurriculumCardComponent, UnEnrollBatchComponent]
})
export class LearnModule { }
