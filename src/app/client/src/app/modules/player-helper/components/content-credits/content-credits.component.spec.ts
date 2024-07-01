import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { ContentCreditsComponent } from './content-credits.component';
import { ResourceService, ConfigService, BrowserCacheTtlService, InterpolatePipe } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Response } from './content-credits.component.spec.data';
import { CacheService } from '../../../shared/services/cache-service/cache.service';

describe('ContentCreditsComponent', () => {
  let component: ContentCreditsComponent;
  let fixture: ComponentFixture<ContentCreditsComponent>;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule , HttpClientTestingModule ],
      declarations: [ContentCreditsComponent, InterpolatePipe],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(ContentCreditsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should take content data as  INPUT  ', () => {
    component.contentData = Response.metaData;
    const actualKeys = Object.keys(component.contentData);
    const expectedKeys = 'contentCredits';
    expect(component.showContentCreditModal).toBeDefined();
    expect(component.showContentCreditModal).toBeFalsy();
    expect(component.contentData).toBeDefined();
    expect(actualKeys).toContain(expectedKeys);

  });

  it('should show content credits data', () => {
    component.contentData = Response.metaData;
    component.ngOnChanges();
    const actualKeys = Object.keys(component.contentCreditsData);
    const expectedKeys = ['contributors', 'creators', 'attributions', 'copyright'];
    fixture.detectChanges();
    expect(actualKeys).toEqual(expectedKeys);
    expect(component.contentCreditsData).toBeDefined();
  });
});
