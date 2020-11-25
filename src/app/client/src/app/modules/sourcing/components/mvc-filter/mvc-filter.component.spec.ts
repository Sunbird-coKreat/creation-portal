import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { SuiPopupModule, SuiModule } from 'ng2-semantic-ui';
import { MvcFilterComponent } from './mvc-filter.component';
import { mockMvcFilterData } from './mvc.filter.component.spec.data';



describe('MvcFilterComponent', () => {
  let component: MvcFilterComponent;
  let fixture: ComponentFixture<MvcFilterComponent>;
  let debugElement: DebugElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SuiPopupModule, SuiModule],
      declarations: [ MvcFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcFilterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide filter initial', () => {
    expect(component.isFilterShow).toBe(false);
  });

  it('#initializeForm() should call after calls ngOnInit', () => {
    spyOn(component, 'initializeForm');
    component.ngOnInit();
    expect(component.initializeForm).toHaveBeenCalled();
  });

  it('should initialize form after calls #initializeForm()', () => {
    component.filters = mockMvcFilterData.filters;
    component.activeFilterData = mockMvcFilterData.activeFilters;
    component.initializeForm();
    expect(component.searchFilterForm.get('contentTypes').value).toEqual(component.activeFilterData.contentTypes);
    expect(component.searchFilterForm.get('subjects').value).toEqual(component.activeFilterData.subjects);
    expect(component.searchFilterForm.get('gradeLevels').value).toEqual(component.activeFilterData.gradeLevels);
    expect(component.searchFilterForm.get('chapters').value).toEqual(component.activeFilterData.chapters);
  });

  it('should emit #filterChangeEvent event when form values changed', fakeAsync(() => {
    spyOn(component.filterChangeEvent, 'emit');
    component.filters = mockMvcFilterData.filters;
    component.activeFilterData = mockMvcFilterData.activeFilters;
    component.initializeForm();
    component.searchFilterForm.controls.subjects.setValue(['English']);
    tick(1000);
    expect(component.filterChangeEvent.emit).toHaveBeenCalledWith({
      action : 'filterDataChange',
      filters : component.searchFilterForm.value
    });
  }));

  it('should not emit #filterChangeEvent event when form values not changed', fakeAsync(() => {
    spyOn(component.filterChangeEvent, 'emit');
    component.filters = mockMvcFilterData.filters;
    component.activeFilterData = mockMvcFilterData.activeFilters;
    component.initializeForm();
    tick(1000);
    expect(component.filterChangeEvent.emit).not.toHaveBeenCalled();
  }));

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
