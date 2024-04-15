import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule , ModuleWithProviders} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ViewAllComponent, ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
  OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
  UserLocationComponent, EnrollContributorComponent, TextbookListComponent, ProgramListComponent, OrgUsersListComponent, ProjectFilterComponent, ProgramHeaderComponent, ResourceTemplateComponent
} from './components';
import { DaysToGoPipe } from './pipes';

import { TelemetryModule } from '@sunbird/telemetry';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiDimmerModule} from '@project-sunbird/ng2-semantic-ui';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { CommonFormElementsModule } from '@project-sunbird/common-form-elements-full';

@NgModule({
  imports: [
    CommonModule,
    
    SharedModule,
    CoreModule,
    TelemetryModule,
    RouterModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
    SuiProgressModule, SuiRatingModule, SuiCollapseModule, SuiDimmerModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule,
    CommonFormElementsModule
  ],
  declarations: [ViewAllComponent, ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent, EnrollContributorComponent, ProgramListComponent, DaysToGoPipe,
    TextbookListComponent, OrgUsersListComponent, HelpPageComponent, ProjectFilterComponent, ProgramHeaderComponent, ResourceTemplateComponent
  ],
  exports: [ViewAllComponent, ProfileFrameworkPopupComponent, TermsAndConditionsPopupComponent,
    OtpPopupComponent, BatchInfoComponent, SsoMergeConfirmationComponent, ValidateTeacherIdentifierPopupComponent,
    UserLocationComponent, EnrollContributorComponent, ProgramListComponent, DaysToGoPipe, TextbookListComponent, ProgramHeaderComponent, OrgUsersListComponent, ResourceTemplateComponent]
})
export class SharedFeatureModule { }
