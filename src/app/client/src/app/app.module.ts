import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui-v9';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreModule, SessionExpiryInterceptor } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { BootstrapFramework, WebExtensionModule } from '@project-sunbird/web-extensions';
import { WebExtensionsConfig } from './framework.config';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PluginModules } from './framework.config';
//import { ChatLibModule, ChatLibService } from 'sunbird-chatbot-client';
import { QumlLibraryModule, QuestionCursor } from '@project-sunbird/sunbird-quml-player';
import { CollectionEditorLibraryModule, EditorCursor } from '@project-sunbird/sunbird-collection-editor';
import { QumlPlayerService } from './modules/sourcing/services/quml-player/quml-player.service';
import { CacheService } from './modules/shared/services/cache-service/cache.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CoreModule,
        CommonModule,
        HttpClientModule,
        // ChatLibModule,
        SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
        SuiRatingModule, SuiCollapseModule,
        SharedModule.forRoot(),
        WebExtensionModule.forRoot(),
        TelemetryModule.forRoot(),
        SharedFeatureModule,
        ...PluginModules,
        QumlLibraryModule,
        CollectionEditorLibraryModule,
        AppRoutingModule // don't add any module below this because it contains wildcard route
    ],
    bootstrap: [AppComponent],
    providers: [
        CacheService,
        DatePipe,
        DeviceDetectorService,
        //ChatLibService,
        { provide: HTTP_INTERCEPTORS, useClass: SessionExpiryInterceptor, multi: true },
        { provide: QuestionCursor, useExisting: QumlPlayerService },
        { provide: EditorCursor, useExisting: QumlPlayerService }
    ]
})
export class AppModule {
  constructor(bootstrapFramework: BootstrapFramework) {
    bootstrapFramework.initialize(WebExtensionsConfig);
  }
}
