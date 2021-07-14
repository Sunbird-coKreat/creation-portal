import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionIconComponent } from './collection-icon.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {mockData} from './collection-icon.component.spec.data';

describe('CollectionIconComponent', () => {
  let component: CollectionIconComponent;
  let fixture: ComponentFixture<CollectionIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionIconComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#initializeImagePicker() should set showImagePicker to true', () => {
    component.appIconConfig  = {isAppIconEditable: true };
    spyOn(component, 'initializeImagePicker').and.callThrough();
    component.initializeImagePicker();
    expect(component.showImagePicker).toBeTruthy();
  });

  it('#initializeImagePicker() should set showImagePicker to false', () => {
    component.appIconConfig  = {isAppIconEditable: false };
    spyOn(component, 'initializeImagePicker').and.callThrough();
    component.initializeImagePicker();
    expect(component.showImagePicker).toBeFalsy();
  });

  it('#collectionIconHandler() should emit proper event', () => {
    spyOn(component, 'collectionIconHandler').and.callThrough();
    spyOn(component.iconEmitter, 'emit').and.returnValue(mockData.assetBrowserEvent);
    component.collectionIconHandler(mockData.assetBrowserEvent);
    expect(component.iconEmitter.emit).toHaveBeenCalledWith(mockData.assetBrowserEvent);
  });

  it('#collectionIconHandler() should set appIcon value', () => {
    spyOn(component, 'collectionIconHandler').and.callThrough();
    component.collectionIconHandler(mockData.assetBrowserEvent);
    expect(component.appIcon).toBe(mockData.assetBrowserEvent.url);
  });

  it('#collectionIconHandler() should set showImagePicker to false', () => {
    spyOn(component, 'collectionIconHandler').and.callThrough();
    component.collectionIconHandler(mockData.assetBrowserEvent);
    expect(component.showImagePicker).toBeFalsy();
  });
});
