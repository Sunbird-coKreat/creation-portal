import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranscriptsReviewComponent } from './transcripts-review.component';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
describe('TranscriptsReviewComponent', () => {
  let component: TranscriptsReviewComponent;
  let fixture: ComponentFixture<TranscriptsReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ TranscriptsReviewComponent ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService]
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

  it('ngOnInit should call setTranscripts', () => {
    spyOn(component, 'setTranscripts').and.callFake(() => {});
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.setTranscripts).toHaveBeenCalled();
  });

  it('setTranscripts should return transcripts with file name', () => {
    component.contentTranscript = [
      {
          "identifier": "do_11341782099017728011533",
          "language": "Bengali",
          "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11341782099017728011533/srt-e.srt"
      }];
    spyOn(component, 'setTranscripts').and.callThrough();
    component.setTranscripts();
    expect(component.transcripts).toBeDefined();
  });

  it('downloadFile should call window.open', () => {
    spyOn(window, 'open').and.callFake(() => {});
    spyOn(component, 'downloadFile').and.callThrough();
    component.downloadFile("https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11341782099017728011533/srt-e.srt");
    expect(window.open).toHaveBeenCalled();
  });
});
