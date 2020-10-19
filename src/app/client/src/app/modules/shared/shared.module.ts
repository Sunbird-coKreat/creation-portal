import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import {
  AnnouncementInboxCardComponent, NoResultComponent, AppLoaderComponent, CardComponent,
  CardCreationComponent, ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, RedirectComponent,
  CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, BatchCardComponent, AccountMergeModalComponent,
  FullPageModalComponent, SelectOptionGroupComponent, AppLandingSectionComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService,
  OfflineCardService, RecaptchaService,
} from './services';
import { ContentDirectionDirective } from './directives';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateFormatPipe, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe, SortByPipe} from './pipes';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '@sunbird/telemetry';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
import { HighlightTextDirective } from './directives/highlight-text/highlight-text.directive';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    SlickModule,
    FormsModule,
    TelemetryModule,
    TranslateModule.forChild()
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe,
    BatchCardComponent, NoResultComponent, DateFilterXtimeAgoPipe, CardComponent, CardCreationComponent, FilterPipe, InterpolatePipe,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, RedirectComponent, CustomMultiSelectComponent,
    InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, SelectOptionGroupComponent, SortByPipe,
    HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, AppLandingSectionComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe, SelectOptionGroupComponent,
    BatchCardComponent, NoResultComponent, CardComponent, CardCreationComponent, FilterPipe,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, SortByPipe, RedirectComponent,
    CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, TranslateModule,
    HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, AppLandingSectionComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, PaginationService, RecaptchaService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
        DeviceDetectorModule, DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService, OfflineCardService, TranslateStore]
    };
  }
}
