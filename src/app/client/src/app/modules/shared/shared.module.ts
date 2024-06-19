import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule } from '@project-sunbird/ng2-semantic-ui';

import { FormsModule } from '@angular/forms';
import {
  PageSectionComponent, NoResultComponent, AppLoaderComponent, ShareLinkComponent, RedirectComponent,
  CustomMultiSelectComponent,
  FullPageModalComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService,
  OfflineCardService, RecaptchaService,
} from './services';
import { ContentDirectionDirective } from './directives';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateFormatPipe, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe, ToCharCodePipe } from './pipes';
import { CacheService } from '../shared/services/cache-service/cache.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '@sunbird/telemetry';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
import { HighlightTextDirective } from './directives/highlight-text/highlight-text.directive';
import { PageHelpComponent } from './components/page-help/page-help.component';


@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,

    FormsModule,
    TelemetryModule
  ],
  declarations: [AppLoaderComponent, DateFormatPipe, PageSectionComponent, NoResultComponent, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe,
    ShareLinkComponent, CdnprefixPipe, RedirectComponent, CustomMultiSelectComponent, ContentDirectionDirective,
    HighlightTextDirective, FullPageModalComponent, PageHelpComponent, ToCharCodePipe],
  exports: [AppLoaderComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    PageSectionComponent, NoResultComponent, FilterPipe,
    ShareLinkComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent,
    CustomMultiSelectComponent, ContentDirectionDirective,
    HighlightTextDirective, FullPageModalComponent, PageHelpComponent, ToCharCodePipe]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, PaginationService, RecaptchaService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
        DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService, OfflineCardService]
    };
  }
}
