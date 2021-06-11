import { TelemetryService } from '../../../telemetry/services/telemetry/telemetry.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { McqTemplateSelectionComponent } from './mcq-template-selection.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProgramTelemetryService } from '../../../program/services';
import { TelemetryModule } from '@sunbird/telemetry';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService, ToasterService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF, DatePipe } from '@angular/common';

describe('BulkApprovalComponent', () => {
  let component: McqTemplateSelectionComponent;
  let fixture: ComponentFixture<McqTemplateSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule.forRoot(), TelemetryModule, SuiModule, HttpClientTestingModule],
      declarations: [McqTemplateSelectionComponent],
      providers: [
        ResourceService,
        ConfigService,
        ToasterService, BrowserCacheTtlService,
        DatePipe, TelemetryService,
        ProgramTelemetryService,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqTemplateSelectionComponent);
    component = fixture.componentInstance;
  });

  it('#handleSubmit() should call handleSubmit', () => {
    spyOn(component.templateSelection, 'emit');
    component.handleSubmit();
    expect(component.templateSelection.emit).toHaveBeenCalledWith({ type: 'submit', template: undefined });
  });
  it('#ngOnDestroy() should call modal deny ', () => {
    component['modal'] = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component['modal'].deny).toHaveBeenCalled();
  });

  it('#getTelemetryInteractObject() should call getTelemetryInteractObject', () => {
    component.sessionContext = {
      collection: 'do_1131700101604311041350'
    };
    const data = spyOn(component, 'getTelemetryInteractObject').and.returnValue({ object: { pageId: 'dummaypage' } });
    component.getTelemetryInteractObject('do_1131700101604311041350', 'type');
    expect(component.getTelemetryInteractObject).toHaveBeenCalledWith('do_1131700101604311041350', 'type');
    expect(data).toBeDefined();
  });
});
