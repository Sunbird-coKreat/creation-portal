import { ConfigService } from './../../../shared/services/config/config.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { HelpPageComponent } from './help-page.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { SharedModule, NavigationHelperService } from '@sunbird/shared';
import { CoreModule} from '@sunbird/core';
import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';

xdescribe('HelpPageComponent', () => {
  let component: HelpPageComponent;
  let fixture: ComponentFixture<HelpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, SharedModule.forRoot(), TelemetryModule, SuiModule, HttpClientTestingModule, RouterTestingModule ],
      declarations: [ HelpPageComponent ],
      providers: [TelemetryService, ConfigService, {provide: APP_BASE_HREF, useValue: '/', NavigationHelperService}
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
