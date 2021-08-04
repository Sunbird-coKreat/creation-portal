import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QumlPlayerComponent } from './quml-player.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../services/config/config.service';
import { PlayerService } from '../../services/player/player.service';
import { mockData } from './quml-player.component.spec.data';
describe('QumlPlayerComponent', () => {
  let component: QumlPlayerComponent;
  let fixture: ComponentFixture<QumlPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [QumlPlayerComponent],
      providers: [ConfigService, PlayerService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QumlPlayerComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#ngOnInit() should call initialize', () => {
    component.qumlPlayerConfig = mockData.qumlPlayerConfig;
    component.qumlPlayerConfig.mockData = mockData.qumlPlayerConfig.metadata;
    spyOn(component, 'initialize');
    component.ngOnInit();
    expect(component.initialize).toHaveBeenCalled();
  });
  it('#initialize() should set showPreview', () => {
    component.showPreview = false;
    component.qumlPlayerConfig = mockData.qumlPlayerConfig;
    spyOn(component, 'setQumlPlayerData');
    component.initialize();
    expect(component.showPreview).toBeTruthy();
  });
  it('#setQumlPlayerData() should call setQumlPlayerData and isSingleQuestionPreview is false', () => {
    const playerService = TestBed.get(PlayerService);
    component.qumlPlayerConfig = mockData.qumlPlayerConfig;
    component.questionSetHierarchy = mockData.qumlPlayerConfig.metadata;
    component.qumlPlayerConfig.metadata = mockData.qumlPlayerConfig.metadata;
    component.isSingleQuestionPreview = false;
    spyOn(playerService, 'getQumlPlayerConfig').and.returnValue(mockData.qumlPlayerConfig);
    component.setQumlPlayerData();
    expect(component.qumlPlayerConfig.metadata).toEqual(mockData.qumlPlayerConfig.metadata);
    expect(component.qumlPlayerConfig.metadata.totalQuestions).toEqual(mockData.qumlPlayerConfig.metadata.childNodes.length);
    expect(component.qumlPlayerConfig.metadata.maxQuestions).toEqual(mockData.qumlPlayerConfig.metadata.maxQuestions);
    expect(component.qumlPlayerConfig.metadata.maxScore).toEqual(mockData.qumlPlayerConfig.metadata.maxScore);
  });
  it('#setQumlPlayerData() should call setQumlPlayerData and isSingleQuestionPreview is true', () => {
    const playerService = TestBed.get(PlayerService);
    spyOn(playerService, 'getQumlPlayerConfig').and.returnValue(mockData.qumlPlayerConfig);
    component.qumlPlayerConfig = mockData.qumlPlayerConfig;
    component.questionSetHierarchy = mockData.qumlPlayerConfig.metadata;
    component.qumlPlayerConfig.metadata = mockData.qumlPlayerConfig.metadata;
    component.isSingleQuestionPreview = true;
    component.setQumlPlayerData();
    expect(component.isSingleQuestionPreview).toBeTruthy();
    expect(component.qumlPlayerConfig).toBeDefined();
  });
  it('#getPlayerEvents() should call getPlayerEvents', () => {
    spyOn(component, 'getPlayerEvents').and.returnValue(mockData.playerEvent);
    component.getPlayerEvents(mockData.playerEvent);
    expect(component.getPlayerEvents).toHaveBeenCalled();
  });
  it('#getTelemetryEvents() should call getTelemetryEvents', () => {
    spyOn(component, 'getTelemetryEvents').and.returnValue(mockData.telemetryEvent);
    component.getTelemetryEvents(mockData.telemetryEvent);
    expect(component.getTelemetryEvents).toHaveBeenCalled();
  });
});
