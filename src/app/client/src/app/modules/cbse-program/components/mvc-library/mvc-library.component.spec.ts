import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvcLibraryComponent } from './mvc-library.component';

describe('MvcLibraryComponent', () => {
  let component: MvcLibraryComponent;
  let fixture: ComponentFixture<MvcLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvcLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
