import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { SuiPopupModule, SuiModule } from 'ng2-semantic-ui';
import { MvcFilterComponent } from './mvc-filter.component';
import { mockMvcFilterData } from './mvc.filter.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { ConfigService, ToasterService, ResourceService, SharedModule, NavigationHelperService,
  BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { RouterTestingModule } from '@angular/router/testing';
import {APP_BASE_HREF} from '@angular/common';
import { TelemetryService} from '@sunbird/telemetry';

describe('MvcFilterComponent', () => {
  let component: MvcFilterComponent;
  let fixture: ComponentFixture<MvcFilterComponent>;



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, SuiPopupModule, SuiModule, TelemetryModule.forRoot()],
      declarations: [ MvcFilterComponent ],
      providers: [ TelemetryService, ResourceService, ConfigService, CacheService,
        BrowserCacheTtlService, ToasterService, {provide: APP_BASE_HREF, useValue: '/'}
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should hide filter initial', () => {
    expect(component.isFilterShow).toBe(false);
  });

  xit('#initializeForm() should call after calls ngOnInit', () => {
    component.sessionContext = {telemetryPageId: 'mvc-library'};
    spyOn(component, 'initializeForm').and.callThrough();
    component.ngOnInit();
    expect(component.initializeForm).toHaveBeenCalled();
  });

  it('should initialize form after calls #initializeForm()', () => {
    component.filters = mockMvcFilterData.filters;
    component.activeFilterData = mockMvcFilterData.activeFilters;
    component.initializeForm();
    expect(component.searchFilterForm).not.toBeUndefined();
  });

  it('#showfilter() should toggle #isFilterShow', () => {
    expect(component.isFilterShow).toBe(false, 'hide at first');
    component.showfilter();
    expect(component.isFilterShow).toBe(true, 'show after click');
    component.showfilter();
    expect(component.isFilterShow).toBe(false, 'hide after second click');
  });

  it('#showfilter() should emit #filterStatusChange event', () => {
    spyOn(component.filterChangeEvent, 'emit');
    component.showfilter();
    expect(component.filterChangeEvent.emit).toHaveBeenCalledWith({
      action: 'filterStatusChange',
      filterStatus: true
    });
  });

  it('#ngOnChanges() should toggle #isFilterShow', () => {
    expect(component.isFilterShow).toBe(false, 'hide at first');
    component.filterOpenStatus = true;
    component.ngOnChanges();
    expect(component.isFilterShow).toBe(true, 'show after ngOnChanges');
    component.filterOpenStatus = false;
    component.ngOnChanges();
    expect(component.isFilterShow).toBe(false, 'hide after second ngOnChanges');
  });

});
