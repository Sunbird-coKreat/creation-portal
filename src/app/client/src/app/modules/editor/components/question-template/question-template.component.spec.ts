import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {  DebugElement } from '@angular/core';
import { SuiPopupModule, SuiModule } from 'ng2-semantic-ui';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { ConfigService} from '@sunbird/shared';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { QuestionTemplateComponent } from './question-template.component';
import {mockData} from './question-template.component.spec.data';
describe('QuestionTemplateComponent', () => {
  let component: QuestionTemplateComponent;
  let fixture: ComponentFixture<QuestionTemplateComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiPopupModule, SuiModule, CoreModule, RouterTestingModule],
      declarations: [ QuestionTemplateComponent ],
      // tslint:disable-next-line:max-line-length
      providers: [TelemetryService, ConfigService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, {provide: APP_BASE_HREF, useValue: '/'}],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionTemplateComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disabled #next button initial', () => {
    expect(component.showButton).toBeFalsy();
  });

  it('should set #templateList value initial', () => {
    expect(component.templateList).toBeUndefined();
    component.templateList = mockData.templateList;
    expect(component.templateList).not.toBeUndefined();
  });

  it('should set #templateSelected value when template selected', () => {
    component.templateSelected = mockData.templateList[0];
    expect(component.templateSelected).toEqual(mockData.templateList[0]);
  });

  it('#next() should emit #templateSelection event when #next button cliked!', () => {
    spyOn(component.templateSelection, 'emit');
    component.templateSelected = mockData.templateList[0];
    component.next();
    expect(component.templateSelection.emit).toHaveBeenCalledWith(mockData.templateList[0]);
  });

});