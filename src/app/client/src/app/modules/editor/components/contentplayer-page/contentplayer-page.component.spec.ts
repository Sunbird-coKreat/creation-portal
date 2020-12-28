import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {  DebugElement } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { ConfigService} from '@sunbird/shared';
import { APP_BASE_HREF } from '@angular/common';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { ContentplayerPageComponent } from './contentplayer-page.component';
import { mockData } from './contentplayer-page.component.spec.data';

describe('ContentplayerPageComponent', () => {
  let component: ContentplayerPageComponent;
  let fixture: ComponentFixture<ContentplayerPageComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, RouterTestingModule],
      declarations: [ ContentplayerPageComponent ],
      // tslint:disable-next-line:max-line-length
      providers: [TelemetryService, ConfigService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },{provide: APP_BASE_HREF, useValue: '/'}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentplayerPageComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input #questionMetaData value initial', () => {
    expect(component.questionMetaData).toBeUndefined();
    component.questionMetaData = mockData.questionMetaData;
    expect(component.questionMetaData).not.toBeUndefined();
    expect(component.questionMetaData).toEqual(mockData.questionMetaData);
  });

  it('#removeQuestion() should emit #toolbarEmitter event when #remove button cliked!', () => {
    spyOn(component.toolbarEmitter, 'emit');
    component.removeQuestion();
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith(mockData.removeContentEvent);
  });

  it('#editQuestion() should emit #toolbarEmitter event when #editQuestion button cliked!', () => {
    spyOn(component.toolbarEmitter, 'emit');
    component.editQuestion();
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith(mockData.editContentEvent);
  });

});
