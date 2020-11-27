import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentplayerPageComponent } from './contentplayer-page.component';

describe('ContentplayerPageComponent', () => {
  let component: ContentplayerPageComponent;
  let fixture: ComponentFixture<ContentplayerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentplayerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentplayerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
