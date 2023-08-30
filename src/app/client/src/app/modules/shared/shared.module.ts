import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui-v9';

import { FormsModule } from '@angular/forms';
import {
  AnnouncementInboxCardComponent, PageSectionComponent, NoResultComponent, AppLoaderComponent, ShareLinkComponent, QrCodeModalComponent, RedirectComponent,
  CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, AccountMergeModalComponent,
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
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, PageSectionComponent, NoResultComponent, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe,
    ShareLinkComponent, QrCodeModalComponent, CdnprefixPipe, RedirectComponent, CustomMultiSelectComponent,
    InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective,
    HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, PageHelpComponent, ToCharCodePipe],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    PageSectionComponent, NoResultComponent, CardComponent, FilterPipe,
    ShareLinkComponent, QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent,
    CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective,
    HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, PageHelpComponent, ToCharCodePipe]
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
