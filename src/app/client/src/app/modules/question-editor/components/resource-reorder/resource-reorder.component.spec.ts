import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ResourceReorderComponent } from './resource-reorder.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorService } from '../../services/editor/editor.service';
import * as mockData from './resource-reorder.component.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
const testData = mockData.mockRes;

describe('ResourceReorderComponent', () => {
  let component: ResourceReorderComponent;
  let fixture: ComponentFixture<ResourceReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ EditorService ],
      declarations: [ ResourceReorderComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceReorderComponent);
    component = fixture.componentInstance;
    component.collectionId = testData.addResourceData.collectionId;
    component.prevUnitSelect = testData.addResourceData.unitIdentifier;
    component.selectedContentDetails = { identifier: testData.addResourceData.contentId };
    component.collectionUnits = testData.collectionUnits;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#addResource() calls #editorService.addResourceToHierarchy() with expected parameters', inject([EditorService],
    (editorService) => {
      spyOn(editorService, 'addResourceToHierarchy').and.callThrough();
      spyOn(component, 'addResource').and.callThrough();
      component.addResource();
      expect(component.addResource).toHaveBeenCalled();
      expect(editorService.addResourceToHierarchy).toHaveBeenCalledWith(
        testData.addResourceData.collectionId,
        testData.addResourceData.unitIdentifier,
        testData.addResourceData.contentId
      );
  }));

  it('should call #closePopup() to close the hierarchy popup', () => {
    spyOn(component.moveEvent, 'emit').and.returnValue(testData.closePopUp);
    component.closePopup();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(testData.closePopUp);
  });

  it('#getParents() call #getParentsHelper() with expected parameters', () => {
    spyOn(component, 'getParentsHelper').and.callThrough();
    spyOn(component, 'getParents').and.callThrough();
    component.getParents(testData.collectionUnits, testData.prevUnitSelect);
    expect(component.getParentsHelper).toHaveBeenCalledWith (
      { 'children': testData.collectionUnits },
        testData.prevUnitSelect,
        []
      );
  });

  it('#setCollectionUnitBreadcrumb() call #getParents() with expected parameters', () => {
    spyOn(component, 'getParents').and.callThrough();
    spyOn(component, 'setCollectionUnitBreadcrumb').and.callThrough();
    component.setCollectionUnitBreadcrumb();
    expect(component.getParents).toHaveBeenCalledWith(testData.collectionUnits, testData.prevUnitSelect);
    expect(component.collectionUnitsBreadcrumb).toEqual(testData.collectionUnitsBreadcrumb);
  });

});
