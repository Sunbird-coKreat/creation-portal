import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiPopupModule } from 'ng2-semantic-ui';
import { MvcListComponent } from './mvc-list.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceService, ConfigService, InterpolatePipe, BrowserCacheTtlService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { APP_BASE_HREF } from '@angular/common';
import { mockData} from './mvc-list.component.spec.data';

describe('MvcListComponent', () => {
  let component: MvcListComponent;
  let fixture: ComponentFixture<MvcListComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiPopupModule, RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [ MvcListComponent, InterpolatePipe ],
      providers:[ResourceService, ConfigService, ProgramTelemetryService, CacheService, BrowserCacheTtlService,
        {provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide #addToLibrary button default', () => {
    expect(component.addToLibraryBtnVisibility).toBe(false);
  });

  it('#onContentChange() should emit event with #contentId', () => {
    const contentData = { name: 'DummyName', identifier: 'do_12345'}
    spyOn(component.contentChangeEvent, 'emit');
    component.onContentChange(contentData);
    expect(component.contentChangeEvent.emit).toHaveBeenCalledWith({
      content: contentData
    });
  });

  it('should call onShowAddedContentChange to show the added content', () => {
    component.showAddedContent = true;
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData.showAddedContent);
    component.onShowAddedContentChange();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData.showAddedContent);
  });

  it('should call onShowAddedContentChange to hide added content', () => {
    component.showAddedContent = false;
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData.hideAddedContent);
    component.onShowAddedContentChange();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData.hideAddedContent);
  });

  xit('should show #addToLibrary button when clicked (onContentChange)', () => {
    const contentId = 'do_1130454643544227841156';
    spyOn(component.contentChangeEvent, 'emit');
    component.onContentChange(contentId);
    expect(component.contentChangeEvent.emit).toHaveBeenCalledWith({
      contentId: contentId
    });
  });

  it('#addToLibrary() should emit #beforeMove event', () => {
    spyOn(component.moveEvent, 'emit');
    component.addToLibrary();
    expect(component.moveEvent.emit).toHaveBeenCalledWith({
      action: 'beforeMove'
    });
  });

  it('should call updateContentViewed to hide added content', () => {
    component.inViewLogs = [];
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData.contentVisits);
    component.updateContentViewed();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData.contentVisits);
  });

  it('#changeFilter() should emit #showFilter event', () => {
    spyOn(component.moveEvent, 'emit');
    component.changeFilter();
    expect(component.moveEvent.emit).toHaveBeenCalledWith({
      action: 'showFilter'
    });
  });

});
