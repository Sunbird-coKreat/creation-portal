import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateComponent } from './template.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TemplateComponent', () => {
  let component: TemplateComponent;
  let fixture: ComponentFixture<TemplateComponent>;
  const templateList = [{ type: 'Multile Choice Question' }, { type: 'Subjective Question'}];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ TemplateComponent, TelemetryInteractDirective ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disabled #next button initial', () => {
    expect(component.showButton).toBeFalsy();
  });

  it('should set #templateList value initial', () => {
    expect(component.templateList).toBeUndefined();
    component.templateList = templateList;
    expect(component.templateList).not.toBeUndefined();
  });

  it('should set #templateSelected value when template selected', () => {
    component.templateSelected = templateList[0];
    expect(component.templateSelected).toEqual(templateList[0]);
  });

  it('#next() should emit #templateSelection event when #next button cliked!', () => {
    spyOn(component.templateSelection, 'emit');
    component.templateSelected = templateList[0];
    component.next();
    expect(component.templateSelection.emit).toHaveBeenCalledWith(templateList[0]);
  });
  it('#onClosePopup() should call modal deny', () => {
    component['modal'] = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(component.templateSelection, 'emit');
    component.onClosePopup();
    expect(component['modal'].deny).toHaveBeenCalled();
    expect(component.templateSelection.emit).toHaveBeenCalledWith({ type: 'close' });
  });
});
