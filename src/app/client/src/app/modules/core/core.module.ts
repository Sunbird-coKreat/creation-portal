import { PermissionDirective, BodyScrollDirective, StickyHeaderDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, APP_BASE_HREF, PlatformLocation} from '@angular/common';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { AvatarModule } from 'ngx-avatar';
import {
  MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent,
  DataDrivenFilterComponent, ErrorPageComponent, SortByComponent, FlagContentComponent,
  LanguageDropdownComponent, ProminentFilterComponent, TopicPickerComponent, DataFormComponent
} from './components';
import { ManageModule } from '../manage/manage.module';
import { AuthGuard } from './guard/auth-gard.service';
import { CacheService } from 'ng2-cache-service';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { TelemetryModule } from '@sunbird/telemetry';
import { CommonFormElementsModule } from 'common-form-elements';
@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    SharedModule,
    ManageModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    WebExtensionModule,
    TelemetryModule,
    AvatarModule,
    CommonFormElementsModule
  ],
  declarations: [MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent, PermissionDirective,
    BodyScrollDirective, DataDrivenFilterComponent, SortByComponent,
    ErrorPageComponent, FlagContentComponent, LanguageDropdownComponent,
    ProminentFilterComponent, TopicPickerComponent, StickyHeaderDirective, DataFormComponent],
  exports: [MainHeaderComponent, MainFooterComponent, PermissionDirective, BodyScrollDirective,
    DataDrivenFilterComponent, SortByComponent, FlagContentComponent, DataFormComponent,
    TelemetryModule, LanguageDropdownComponent, ProminentFilterComponent, TopicPickerComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    },
    CacheService,
    AuthGuard]
})
export class CoreModule {
}
