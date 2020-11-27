import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorBaseComponent } from './editor-base.component';

describe('EditorBaseComponent', () => {
  let component: EditorBaseComponent;
  let fixture: ComponentFixture<EditorBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
