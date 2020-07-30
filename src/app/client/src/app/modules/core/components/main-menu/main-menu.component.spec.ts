import { UserService, LearnerService, ContentService, CoreModule } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService, SharedModule } from '@sunbird/shared';
import { MainMenuComponent } from './main-menu.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';

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
      imports: [HttpClientModule, CoreModule, SharedModule.forRoot(), RouterTestingModule],
      providers: [HttpClient, ResourceService, ConfigService, UserService,
        LearnerService, ContentService, { provide: ActivatedRoute, useClass: FakeActivatedRoute },
        { provide: Router, useClass: RouterStub }, DatePipe]
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
