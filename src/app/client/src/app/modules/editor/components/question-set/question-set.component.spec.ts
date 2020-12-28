import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {  DebugElement } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { ConfigService} from '@sunbird/shared';
import { APP_BASE_HREF } from '@angular/common';
import { CommonFormElementsModule } from 'v-dynamic-forms';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { mockData} from './question-set.component.spec.data';

import { QuestionSetComponent } from './question-set.component';

describe('QuestionSetComponent', () => {
  let component: QuestionSetComponent;
  let fixture: ComponentFixture<QuestionSetComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreModule, RouterTestingModule, CommonFormElementsModule],
      declarations: [ QuestionSetComponent ],
      // tslint:disable-next-line:max-line-length
      providers: [TelemetryService, ConfigService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, {provide: APP_BASE_HREF, useValue: '/'}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #prepareFormConfiguration() after Angular calls ngOnInit', () => {
    spyOn(component, 'prepareFormConfiguration').and.callThrough();
    component.questionSetMetadata = mockData.questionMetaData;
    component.config = mockData.formConfig;
    component.ngOnInit();
    expect(component.prepareFormConfiguration).toHaveBeenCalled();
  });

  it('#prepareFormConfiguration() should set default values if exists', () => {
    component.questionSetMetadata = mockData.questionMetaData;
    component.config = mockData.formConfig;
    component.prepareFormConfiguration();
    expect(Object.keys(component.config[0])).toContain('default');
  });

  it('#prepareFormConfiguration() should not set default values if not exists', () => {
    component.questionSetMetadata = mockData.questionMetaData;
    component.config = [mockData.formConfig[1]];
    component.prepareFormConfiguration();
    expect(Object.keys(component.config[0])).not.toContain('default');
  });

  it('#addQuestion() should emit #toolbarEmitter event when #addQuestion button cliked!', () => {
    spyOn(component.toolbarEmitter, 'emit');
    component.addQuestion();
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith(mockData.addContentEvent);
  });

  it('#output() should updated node after #sbform values change', () => {
  });

});
