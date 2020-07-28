import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import {NoResultComponent, AppLoaderComponent, InstallAppComponent, AccountMergeModalComponent,
  FullPageModalComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ExternalUrlPreviewService,
  RecaptchaService,
} from './services';
import { ContentDirectionDirective } from './directives';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateFormatPipe, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe } from './pipes';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '@sunbird/telemetry';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
import { HighlightTextDirective } from './directives/highlight-text/highlight-text.directive';


@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    SlickModule,
    FormsModule,
    TelemetryModule
  ],
  declarations: [AppLoaderComponent, DateFormatPipe,
    NoResultComponent, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe,
    CdnprefixPipe,
    InstallAppComponent, ContentDirectionDirective,
    HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent],
  exports: [AppLoaderComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    NoResultComponent, FilterPipe, CdnprefixPipe, InterpolatePipe, InstallAppComponent, ContentDirectionDirective,
    HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, PaginationService, RecaptchaService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService,
        DeviceDetectorModule, DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService]
    };
  }
}
