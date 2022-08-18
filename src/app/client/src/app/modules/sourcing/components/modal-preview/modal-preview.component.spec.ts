import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SuiModule} from 'ng2-semantic-ui-v9';
import {BrowserCacheTtlService, ConfigService, ResourceService, SharedModule} from '@sunbird/shared';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalPreviewComponent} from './modal-preview.component';
import {of as observableOf} from 'rxjs';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CacheService} from 'ng2-cache-service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('ModalPreviewComponent', () => {
  let component: ModalPreviewComponent;
  let fixture: ComponentFixture<ModalPreviewComponent>;

  const resourceBundle = {
    languageSelected$: observableOf({})
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, InfiniteScrollModule, RouterTestingModule, SharedModule],
      declarations: [ModalPreviewComponent],
      providers: [
        ConfigService, HttpClient, HttpHandler, CacheService, BrowserCacheTtlService,
        {provide: ResourceService, useValue: resourceBundle}
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(ModalPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should call', () => {
    spyOn(component, 'getLimitedQuestions').and.callThrough();
    component.ngOnInit();
    expect(component.getLimitedQuestions).toHaveBeenCalled();
  });
});
