import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibraryPlayerComponent } from './library-player.component';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';

describe('LibraryPlayerComponent', () => {
  let component: LibraryPlayerComponent;
  let fixture: ComponentFixture<LibraryPlayerComponent>;
  const mockData = {action: 'openHierarchyPopup'};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService],
      imports: [HttpClientTestingModule],
      declarations: [ LibraryPlayerComponent, TelemetryInteractDirective ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryPlayerComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#addToLibrary() should call moveEvent and emit value', () => {
    spyOn(component.editorService, 'checkIfContentsCanbeAdded').and.returnValue(true);
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData);
    component.addToLibrary();
    expect(component.editorService.checkIfContentsCanbeAdded).toBeTruthy();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData);
  });
  it('#addToLibrary() should not call moveEvent when limit reached to max ', () => {
    spyOn(component.editorService, 'checkIfContentsCanbeAdded').and.returnValue(false);
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData);
    component.addToLibrary();
    expect(component.moveEvent.emit).not.toHaveBeenCalledWith(mockData);
  });
});
