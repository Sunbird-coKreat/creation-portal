import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranscriptsReviewComponent } from './transcripts-review.component';
import { ResourceService, ConfigService } from '@sunbird/shared';
xdescribe('TranscriptsReviewComponent', () => {
  let component: TranscriptsReviewComponent;
  let fixture: ComponentFixture<TranscriptsReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptsReviewComponent ],
      providers: [ResourceService, ConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
