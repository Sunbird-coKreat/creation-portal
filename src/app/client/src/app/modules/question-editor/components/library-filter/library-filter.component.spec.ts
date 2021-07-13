import { TreeService } from './../../services/tree/tree.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryFilterComponent } from './library-filter.component';
import { FormsModule } from '@angular/forms';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { Router } from '@angular/router';
import { CommonFormElementsModule } from 'common-form-elements-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import * as $ from 'jquery';
import 'jquery.fancytree';
import { EditorService } from '../../services/editor/editor.service';
import { By } from '@angular/platform-browser';

const mockEditorService = {
  editorConfig: {
    config: {
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {}
        }
      }
    }
  }
};

describe('LibraryFilterComponent', () => {
  let component: LibraryFilterComponent;
  let fixture: ComponentFixture<LibraryFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService, { provide: Router, useClass: RouterStub }, TreeService,
         { provide: EditorService, useValue: mockEditorService }],
      declarations: [LibraryFilterComponent, TelemetryInteractDirective],
      imports: [FormsModule, CommonFormElementsModule, HttpClientTestingModule, SuiModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryFilterComponent);
    component = fixture.componentInstance;
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#isFilterShow should be false by default', () => {
    expect(component.isFilterShow).toBeFalsy()
  });

  it('#ngOnInit should call method #setFilterDefaultValues', () => {
    spyOn(component, 'setFilterDefaultValues');
    component.ngOnInit();
    expect(component.setFilterDefaultValues).toHaveBeenCalled();
  });

  it('#ngOnInit should call method #fetchFrameWorkDetails', () => {
    spyOn(component, 'fetchFrameWorkDetails');
    component.ngOnInit();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
  });

  it('#applyFilter should call method #emitApplyFilter', () => {
    spyOn(component, 'emitApplyFilter');
    component.applyFilter();
    expect(component.emitApplyFilter).toHaveBeenCalled();
  });

  it('#showfilter should toggle #isFilterShow', () => {
    component.showfilter();
    expect(component.isFilterShow).toBe(true, 'on after first click');
    component.showfilter();
    expect(component.isFilterShow).toBe(false, 'on after second click');
  });

  it('#showfilter should emit #filterChangeEvent event', () => {
    spyOn(component.filterChangeEvent, 'emit');
    component.showfilter();
    expect(component.filterChangeEvent.emit).toHaveBeenCalled();
  });

  it('#emitApplyFilter should call #emit event', () => {
    spyOn(component.filterChangeEvent, 'emit');
    component.emitApplyFilter();
    expect(component.filterChangeEvent.emit).toHaveBeenCalled();
  });

  it('#onQueryEnter should call method #emitApplyFilter', () => {
    spyOn(component, 'emitApplyFilter');
    component.onQueryEnter({});
    expect(component.emitApplyFilter).toHaveBeenCalled();
  });

  it('#onQueryEnter should call on enter key press in search input field', () => {
    spyOn(component, 'onQueryEnter');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('#searchInputField'));
    input.triggerEventHandler('keyup.enter', {});
    fixture.detectChanges();
    expect(component.onQueryEnter).toHaveBeenCalled();
  });

  it('#onQueryEnter should return false', () => {
    let result = component.onQueryEnter({});
    expect(result).toBe(false)
  });

  it('#resetFilter should remove filters values and call method #emitApplyFilter', () => {
    spyOn(component, 'emitApplyFilter');
    component.resetFilter();
    // expect(component.filterValues).toEqual({});
    expect(component.searchQuery).toEqual('');
    expect(component.emitApplyFilter).toHaveBeenCalled();
  });
  it('#valueChanges should set value in #filterValues', () => {
    component.valueChanges({});
    expect(component.filterValues).toBeDefined();
  });
  it('#ngOnChanges() should set isFilterShow value', () => {
    component.isFilterShow = false;
    component.filterOpenStatus  = true;
    component.ngOnChanges();
    expect(component.isFilterShow).toBeTruthy();
  });
  it('#outputData() should call outputData', () => {
    spyOn(component, 'outputData');
    component.outputData('');
    expect(component.outputData).toHaveBeenCalled();
  });
  it('#onStatusChanges() should call on form value changes', () => {
    spyOn(component, 'onStatusChanges');
    component.onStatusChanges('');
    expect(component.onStatusChanges).toHaveBeenCalled();
  });
});
