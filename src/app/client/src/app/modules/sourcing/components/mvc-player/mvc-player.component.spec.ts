import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import * as _ from 'lodash-es';
import { Observable, of as observableOf,  throwError as observableThrowError, } from 'rxjs';
import { PlayerService, ActionService, CoreModule } from '@sunbird/core';
import { SuiModalModule, SuiAccordionModule } from 'ng2-semantic-ui-v9';
import { ConfigService, SharedModule , ToasterService} from '@sunbird/shared';
import { SourcingService } from '../../services';
import { MvcPlayerComponent } from './mvc-player.component';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { mockMvcPlayerData } from './mvc-player.component.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { from } from 'rxjs';

describe('MvcPlayerComponent', () => {
  let component: MvcPlayerComponent;
  let fixture: ComponentFixture<MvcPlayerComponent>;
  let debugElement: DebugElement;

  const playerServiceStub = {
    getConfig() {
        return mockMvcPlayerData.playerConfig;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, RouterTestingModule,
         PlayerHelperModule, SuiModalModule, SuiAccordionModule],
      declarations: [ MvcPlayerComponent ],
      providers: [ToasterService, TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        SourcingService, PlayerService, ActionService, ConfigService,
        {provide: APP_BASE_HREF, useValue: '/'} ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcPlayerComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should exist initial properties on component initialize', () => {
    expect(component.contentId).toBeUndefined();
    expect(component.playerConfig).toBeUndefined();
    expect(component.contentData).toBeDefined();
    expect(component.contentData).toEqual({});
    expect(component.moveEvent).toBeDefined();
  });

  it('#ngOnChanges() should not call getConfigByContent()', () => {
    component.contentDetails = { identifier: 'do_12345'};
    component.contentId = 'do_12345';
    spyOn(component, 'ngOnChanges').and.callThrough();
    spyOn(component, 'getConfigByContent').and.callThrough();
    component.ngOnChanges();
    expect(component.contentDetails).toBeDefined();
    expect(component.contentId).toBeDefined();
    expect(component.contentDetails.identifier).toBe(component.contentId);
    expect(component.getConfigByContent).not.toHaveBeenCalledWith(component.contentId);
  });

  it('#addToLibrary() should emit #beforeMove event', () => {
    spyOn(component, 'addToLibrary').and.callThrough();
    spyOn(component.moveEvent, 'emit');
    component.addToLibrary();
    expect(component.addToLibrary).toHaveBeenCalled();
    expect(component.moveEvent.emit).toHaveBeenCalledWith({
      action: 'beforeMove'
    });
  });

  it ('#getConfigByContent() should call playerservice getConfigByContent()', () => {
    const playerService: PlayerService = TestBed.get(PlayerService);
    spyOn(component, 'getConfigByContent').and.callThrough();
    spyOn(playerService, 'getConfigByContent').and.callFake(() => {
      return from([]);
    });
    component.getConfigByContent('do_12345');
    expect(playerService.getConfigByContent).toHaveBeenCalledWith('do_12345');
  });

});
