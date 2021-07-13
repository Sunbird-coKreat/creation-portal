import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import {mockData} from './library.component.spec.data';
import { Router } from '@angular/router';
import { TreeService } from '../../services/tree/tree.service';
import { EditorService } from '../../services/editor/editor.service';
describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService,TreeService, EditorService, { provide: Router, useClass: RouterStub }],
      imports: [HttpClientTestingModule],
      declarations: [ LibraryComponent, TelemetryInteractDirective ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('#fetchCollectionHierarchy should call after ngOnInit', fakeAsync(() => {
    const treeService = TestBed.get(TreeService);
    const editorService = TestBed.get(EditorService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    spyOn(editorService, 'fetchCollectionHierarchy').and.callThrough();
    component.ngOnInit();
    expect(editorService.fetchCollectionHierarchy).toHaveBeenCalled();
  }));

  it('#generateNodeMeta() should return expected result', fakeAsync(() => {
    const generatedNodeData = component.generateNodeMeta(mockData.nodeData);
    expect(generatedNodeData).toEqual(mockData.generatedNodeData);
  }));

  it('#getUnitWithChildren() should return expected result', fakeAsync(() => {
    const collectionHierarchy = component.getUnitWithChildren(mockData.collectionHierarchyData, mockData.collectionId);
    expect(collectionHierarchy).toEqual(mockData.collectionHierarchy);
  }));

  it('#openFilter() should set openFilter value', () => {
    component.openFilter();
    expect(component.isFilterOpen).toBeTruthy();
  });

  it('#filterContentList() should call filterContentList and child nodes are empty', () => {
    component.childNodes = [];
    component.contentList = mockData.initialContentList;
    component.showAddedContent = false;
    component.filterContentList(false);
    expect(component.contentList).toEqual(mockData.initialContentList);
    expect(component.selectedContent).toEqual(mockData.initialContentList[0]); 
  });

  it('#filterContentList() should call filterContentList and child nodes are not empty and show added content is disabled', () => {
    component.childNodes = ['do_11309885724445900818860'];
    component.contentList = mockData.initialContentList;
    component.showAddedContent = false;
    component.filterContentList(false);
    expect(component.contentList).toEqual(mockData.secondContentList);
    expect(component.selectedContent).toEqual(mockData.initialContentList[1]); 
  });

  it('#filterContentList() should call filterContentList and child nodes are not empty and show added content is enabled', () => {
    component.childNodes = ['do_11309885724445900818860'];
    component.contentList = mockData.secondContentList;
    component.showAddedContent = true;
    component.filterContentList(false);
    expect(component.selectedContent).toEqual(mockData.secondContentList[0]);
  });

  it('#onContentChangeEvent() should call onContentChangeEvent and call selected content method ', () => {
    component.onContentChangeEvent(mockData.selectedContent);
    expect(component.selectedContent).toEqual(mockData.selectedContent.content);
  });
  it('should call sortContentList', () => {
    component.contentList = mockData.unSortedContentList;
    component.sortContentList(true);
    expect(component.contentList).toEqual(mockData.secondContentList);
  });
  it('#back() should call back method and emit libraryEmitter', () => {
    spyOn(component.libraryEmitter, 'emit');
    spyOn(component['editorService'], 'contentsCountAddedInLibraryPage');
    component.back();
    expect(component['editorService'].contentsCountAddedInLibraryPage).toHaveBeenCalledWith(true);
    expect(component.libraryEmitter.emit).toHaveBeenCalledWith({});
  });
  it('#onFilterChange should call onFilterChange for filterStatusChange', () => {
    const data = {filterStatus: false, action: 'filterStatusChange'};
    component.onFilterChange(data);
    expect(component.isFilterOpen).toBeFalsy();
  });
  it('#onFilterChange should call onFilterChange for filterDataChange', () => {
    const data = {query: '', action: 'filterDataChange', filters: ''};
    spyOn(component, 'fetchContentList');
    component.onFilterChange(data);
    expect(component.fetchContentList).toHaveBeenCalledWith(data.query, data.filters);
  });
  it('#showResourceTemplate() should call showResourceTemplate for showFilter', () => {
    const data = {action: 'showFilter'};
    spyOn(component, 'openFilter');
    component.showResourceTemplate(data);
    expect(component.openFilter).toHaveBeenCalledWith();
  });
  it('#showResourceTemplate() should call showResourceTemplate for openHierarchyPopup', () => {
    const data = {action: 'openHierarchyPopup'};
    component.showResourceTemplate(data);
    expect(component.showSelectResourceModal).toBeTruthy();
  });
  it('#showResourceTemplate() should call showResourceTemplate for closeHierarchyPopup', () => {
    const data = {action: 'closeHierarchyPopup'};
    component.showResourceTemplate(data);
    expect(component.showSelectResourceModal).toBeFalsy();
  });
  it('#showResourceTemplate() should call showResourceTemplate for showAddedContent', () => {
    const data = {action: 'showAddedContent', status: true};
    spyOn(component, 'filterContentList');
    component.showResourceTemplate(data);
    expect(component.showAddedContent).toBeTruthy();
    expect(component.filterContentList).toHaveBeenCalled();
  });
  it('#showResourceTemplate() should call showResourceTemplate for contentAdded', () => {
    component.childNodes = [];
    const data = {action: 'contentAdded', data: {identifier: 'do_11309894061376307219743'}};
    spyOn(component, 'filterContentList');
    component.showResourceTemplate(data);
    expect(component.filterContentList).toHaveBeenCalledWith(true);
  });
  it('#showResourceTemplate() should call showResourceTemplate for sortContentList', () => {
    const data = {action: 'sortContentList', status: true};
    spyOn(component, 'sortContentList');
    component.showResourceTemplate(data);
    expect(component.sortContentList).toHaveBeenCalledWith(true);
  });
  it('#showResourceTemplate() should call showResourceTemplate for empty/default action', () => {
    const data = {action: ''};
    spyOn(component, 'showResourceTemplate');
    component.showResourceTemplate(data);
    expect(component.showResourceTemplate).toHaveBeenCalledWith(data);
  });
  it('#ngAfterViewInit() should call telemetry impression event', () => {
    const data = {type: 'edit', pageid: undefined , uri: undefined, duration: '0'};
    spyOn(component.telemetryService, 'impression');
    component.ngAfterViewInit();
    expect(component.telemetryService.impression).toHaveBeenCalled();
  });
  it('#fetchContentList() should call fetchContentList', () => {
    spyOn(component, 'fetchContentList');
    component.fetchContentList();
    expect(component.fetchContentList).toHaveBeenCalled();
  });
  it('#showResourceTemplate() should call showResourceTemplate for contentAdded', () => {
    const event = {
      action: 'contentAdded',
      data: {
        identifier: '200'
      }
    };
    component.childNodes = [{ identifier: '100' }];
    component.contentList = [{ identifier: '100' }]
    spyOn(component['editorService'], 'contentsCountAddedInLibraryPage');
    spyOn(component, 'filterContentList');
    component.showResourceTemplate(event);
    expect(component['editorService'].contentsCountAddedInLibraryPage).toHaveBeenCalled();
    expect(component.filterContentList).toHaveBeenCalledWith(true);
  });
  it('#ngOnDestroy() should call ngOnDestroy', () => {
    spyOn(component['editorService'], 'contentsCountAddedInLibraryPage');
    component.ngOnDestroy();
    expect(component['editorService'].contentsCountAddedInLibraryPage).toHaveBeenCalledWith(true);
  });
});
