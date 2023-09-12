import { RouterTestingModule } from '@angular/router/testing';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ConfigService, SharedModule } from '@sunbird/shared';
import { MainFooterComponent } from './main-footer.component';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { of } from 'rxjs';
import { APP_BASE_HREF,DatePipe } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
xdescribe('MainFooterComponent', () => {
    let component: MainFooterComponent;
    let fixture: ComponentFixture<MainFooterComponent>;
    const mockActivatedRoute = {
        queryParams: of({
            dialCode: 'EJ23P',
            source: 'paytm'
        }),
        snapshot: {
            firstChild: {
                firstChild: {
                    params: {
                        slug: 'sunbird'
                    }
                }
            }
        },
        firstChild: {
            firstChild: {
                snapshot: {
                    data: {
                        sendUtmParams: false
                    }
                },
                params: of({})
            }
        },
        path: 'resource'
    };


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MainFooterComponent],
            providers: [CacheService, ConfigService, { provide: ResourceService, useValue: { instance: 'SUNBIRD' } }, {
                provide: ActivatedRoute, useValue: mockActivatedRoute
            },
            {provide: APP_BASE_HREF, useValue: '/'}],
            imports: [HttpClientModule, WebExtensionModule.forRoot(), TelemetryModule.forRoot(), SharedModule, RouterTestingModule],
        })
            .compileComponents();
        fixture = TestBed.createComponent(MainFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
      });
});
