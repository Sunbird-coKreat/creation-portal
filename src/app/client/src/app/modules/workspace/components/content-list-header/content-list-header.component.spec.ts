import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentListHeaderComponent } from './content-list-header.component';

describe('ContentListHeaderComponent', () => {
  let component: ContentListHeaderComponent;
  let fixture: ComponentFixture<ContentListHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentListHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
