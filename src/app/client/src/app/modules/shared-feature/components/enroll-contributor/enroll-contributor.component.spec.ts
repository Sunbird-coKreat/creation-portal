import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule, TelemetryService} from '@sunbird/telemetry';
import { EnrollContributorComponent } from './enroll-contributor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InterpolatePipe, ToasterService, ResourceService, ConfigService,
        NavigationHelperService, BrowserCacheTtlService , UtilService} from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DatePipe } from '@angular/common';

describe('EnrollContributorComponent', () => {
  let component: EnrollContributorComponent;
  let fixture: ComponentFixture<EnrollContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule,  SuiModule, TelemetryModule, FormsModule, ReactiveFormsModule ],
      declarations: [InterpolatePipe, EnrollContributorComponent ],
      providers: [DatePipe, TelemetryService, UtilService,
         ToasterService, ResourceService, ConfigService, BrowserCacheTtlService, CacheService,
         {provide: APP_BASE_HREF, useValue: '/', NavigationHelperService}, NavigationHelperService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
