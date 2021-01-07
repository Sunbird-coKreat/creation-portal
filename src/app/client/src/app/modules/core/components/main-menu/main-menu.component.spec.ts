import { UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, SharedModule } from '@sunbird/shared';
import { MainMenuComponent } from './main-menu.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF,DatePipe } from '@angular/common'; 
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';

describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  class FakeActivatedRoute {
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TelemetryModule, HttpClientTestingModule,RouterTestingModule, CoreModule, SharedModule.forRoot()],
      providers: [HttpClient, ResourceService, ConfigService, UserService,DatePipe,TelemetryService,
        LearnerService, ContentService, { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFeatureId method', () => {
    it('should return the feature id', () => {
      const result = component.getFeatureId('user:program:contribute', 'SB-15591');
      expect(result).toEqual([{ id: 'user:program:contribute', type: 'Feature' }, { id: 'SB-15591', type: 'Task' }]);
    });
  });
});
