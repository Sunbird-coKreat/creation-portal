import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {  DebugElement } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { ConfigService} from '@sunbird/shared';
import { APP_BASE_HREF } from '@angular/common';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { EditorHeaderComponent } from './editor-header.component';
import { mockData } from './editor-header.component.spec.data';

describe('EditorHeaderComponent', () => {
  let component: EditorHeaderComponent;
  let fixture: ComponentFixture<EditorHeaderComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, RouterTestingModule],
      declarations: [ EditorHeaderComponent ],
      // tslint:disable-next-line:max-line-length
      providers: [TelemetryService, ConfigService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },{provide: APP_BASE_HREF, useValue: '/'}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorHeaderComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('#buttonEmitter() should emit #toolbarEmitter event when button cliked!', () => {
    spyOn(component.toolbarEmitter, 'emit');
    component.buttonEmitter(mockData.toolbarMockEvent.event, mockData.toolbarMockEvent.button);
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith(mockData.toolbarMockEvent);
  });

});
