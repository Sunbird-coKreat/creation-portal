import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptsComponent } from './transcripts.component';

describe('TranscriptsComponent', () => {
  let component: TranscriptsComponent;
  let fixture: ComponentFixture<TranscriptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
