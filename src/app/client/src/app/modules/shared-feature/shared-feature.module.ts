import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule , ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
  OtpPopupComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
  UserLocationComponent, EnrollContributorComponent, TextbookListComponent, ProgramListComponent, OrgUsersListComponent
} from './components';
import { DaysToGoPipe } from './pipes';
import { SlickModule } from 'ngx-slick';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiDimmerModule} from 'ng2-semantic-ui';
import { HelpPageComponent } from './components/help-page/help-page.component';

@NgModule({
  imports: [
    CommonModule,
    SlickModule,
    SharedModule,
    CoreModule,
    TelemetryModule,
    RouterModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiDimmerModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule
  ],
  declarations: [ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent, EnrollContributorComponent, ProgramListComponent, DaysToGoPipe,
    TextbookListComponent, OrgUsersListComponent, HelpPageComponent
  ],
  exports: [ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent, EnrollContributorComponent, ProgramListComponent, DaysToGoPipe, TextbookListComponent, OrgUsersListComponent]
})
export class SharedFeatureModule { }
