// Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
// Custome component(s) and services
import {
  CourseConsumptionService, DashboardUtilsService, OrganisationService,
  RendererService, LineChartService, DownloadService, CourseProgressService,
  UsageService
} from './services';
import {
  OrganisationComponent, UsageReportsComponent,
  DataTableComponent, DataChartComponent
} from './components';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// SB core and shared services
import { SearchService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OrderModule,
    TelemetryModule,
    NgxDaterangepickerMd.forRoot()
  ],
  declarations: [OrganisationComponent, UsageReportsComponent,
    DataTableComponent, DataChartComponent],
  exports: [DataTableComponent],
  providers: [
    RendererService,
    DashboardUtilsService,
    SearchService,
    LineChartService,
    CourseConsumptionService,
    OrganisationService, DownloadService, CourseProgressService, UsageService]
})
export class DashboardModule { }
