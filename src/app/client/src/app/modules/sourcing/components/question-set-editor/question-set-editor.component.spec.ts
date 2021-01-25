import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionSetEditorComponent } from './question-set-editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { CacheService } from 'ng2-cache-service';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import { ActivatedRoute, Router} from '@angular/router';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';

describe('QuestionSetEditorComponent', () => {
  let component: QuestionSetEditorComponent;
  let fixture: ComponentFixture<QuestionSetEditorComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ QuestionSetEditorComponent ],
      providers: [ ConfigService, TelemetryService, CacheService, BrowserCacheTtlService, ToasterService, ResourceService,
        { provide: Router },
        { provide: ActivatedRoute },
        {provide: APP_BASE_HREF, useValue: '/'}],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSetEditorComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
