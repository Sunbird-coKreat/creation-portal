import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import * as _ from 'lodash-es';
import { of as observableOf,  throwError as observableThrowError, } from 'rxjs';
import { PlayerService, ActionService, CoreModule } from '@sunbird/core';
import { SuiModalModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { ConfigService, SharedModule , ToasterService} from '@sunbird/shared';
import { CbseProgramService } from '../../services/cbse-program/cbse-program.service';
import { MvcPlayerComponent } from './mvc-player.component';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { mockMvcPlayerData } from './mvc-player.component.spec.data';

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
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, PlayerHelperModule, SuiModalModule, SuiAccordionModule],
      declarations: [ MvcPlayerComponent ],
      providers: [ToasterService, TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        CbseProgramService, PlayerService, { provide: PlayerService, useValue: playerServiceStub }, ActionService, ConfigService,
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

  it('#getUploadedContentMeta() should not call when contentId is empty', () => {
    spyOn(component, 'getUploadedContentMeta').and.callThrough();
    component.ngOnChanges();
    expect(component.getUploadedContentMeta).not.toHaveBeenCalled();
  });

  it('#getUploadedContentMeta() should call when contentId is changed', () => {
    component.contentId = mockMvcPlayerData.contentId;
    spyOn(component, 'getUploadedContentMeta').and.callThrough();
    component.ngOnChanges();
    expect(component.getUploadedContentMeta).toHaveBeenCalledWith(mockMvcPlayerData.contentId);
    expect(component.getUploadedContentMeta).toHaveBeenCalledTimes(1);
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

  it('#getUploadedContentMeta() should return expected content', () => {
    const actionService: ActionService = TestBed.get(ActionService);
    spyOn(actionService, 'get').and.returnValue(observableOf(mockMvcPlayerData.readSuccess));
    component.getUploadedContentMeta(mockMvcPlayerData.contentId);
    expect(component.contentData).not.toBe({});
    expect(component.playerConfig).toBeDefined();
  });

  it('should throw toaster error message when content does not exists', () => {
    const actionService: ActionService = TestBed.get(ActionService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(actionService, 'get').and.returnValue(observableThrowError(mockMvcPlayerData.readNotFound));
    spyOn(toasterService, 'error').and.callThrough();
    component.getUploadedContentMeta(mockMvcPlayerData.contentId);
    expect(toasterService.error).toHaveBeenCalledWith('Unable to read the Content, Please Try Again');
  });

});
