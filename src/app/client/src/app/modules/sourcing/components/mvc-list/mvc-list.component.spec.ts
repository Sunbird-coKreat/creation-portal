import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiPopupModule } from 'ng2-semantic-ui';
import { MvcListComponent } from './mvc-list.component';
import { DebugElement } from '@angular/core';

describe('MvcListComponent', () => {
  let component: MvcListComponent;
  let fixture: ComponentFixture<MvcListComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiPopupModule],
      declarations: [ MvcListComponent ]
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

  it('should show #addToLibrary button after calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.addToLibraryBtnVisibility).toBe(true);
  });

  it('#onContentChange() should emit event with #contentId', () => {
    const contentId = 'do_1130454643544227841156';
    spyOn(component.contentChangeEvent, 'emit');
    component.onContentChange(contentId);
    expect(component.contentChangeEvent.emit).toHaveBeenCalledWith({
      contentId: contentId
    });
  });

  it('should show #addToLibrary button when clicked (onContentChange)', () => {
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

  it('#changeFilter() should emit #showFilter event', () => {
    spyOn(component.moveEvent, 'emit');
    component.changeFilter();
    expect(component.moveEvent.emit).toHaveBeenCalledWith({
      action: 'showFilter'
    });
  });

});
