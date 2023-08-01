import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import {
  ResourceService, ToasterService, SharedModule, ConfigService,
  UtilService, BrowserCacheTtlService, NavigationHelperService
} from '@sunbird/shared';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { SourcingService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { AppLoaderComponent } from '../../../shared/components/app-loader/app-loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { sessionContext, sampleTextbook, textbookList,
  programContext } from './dashboard.component.spec.data';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ExportToCsv } from 'export-to-csv';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

xdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
    // tslint:disable-next-line:prefer-const
  let errorInitiate;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(sampleTextbook);
      }
    }
  };

  const ContentServiceStub = {
    post() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(textbookList);
      }
    }
  };
  const routerStub = {
    navigate: jasmine.createSpy('navigate')
  };
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {
        dialCode: 'D4R4K4'
      },
      data: {
        telemetry: { env: 'programs'}
      }
    }
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule,RouterTestingModule, TelemetryModule.forRoot()],
      declarations: [ DashboardComponent, AppLoaderComponent ],
      // tslint:disable-next-line:max-line-length
      providers: [ConfigService, UtilService, ToasterService,
        SourcingService, TelemetryService, ResourceService,
        CacheService, BrowserCacheTtlService, NavigationHelperService,
        // tslint:disable-next-line:max-line-length
        { provide: ContentService, useValue: ContentServiceStub },
        { provide: ActionService, useValue: actionServiceStub },
        { provide: Router, useValue: routerStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    component.dashboardComponentInput = {sessionContext: sessionContext};
    component.dashboardComponentInput = {programContext: programContext};
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate component with default Program Level Report', () => {
    expect(component.selectedReport).toEqual('Program Level Report Status');
  });

  it('tableData should be loaded on component initialize', () => {
    expect(component.tableData).toBeDefined();
  });

  it('should have same table rows textbook list count', () => {
    expect(component.tableData.length).toEqual(component.textbookList.length);
  });

  xit('should execute generateProgramLevelData on component initialize', () => {
    component.ngOnInit();
    expect(component.generateProgramLevelData).toHaveBeenCalledWith('Program Level Report Status');
    spyOn(component, 'generateProgramLevelData');
  });

  it('should execute generateTableData on component initialize', () => {
    spyOn(component, 'generateTableData');
    component.ngOnInit();
    expect(component.generateTableData).toHaveBeenCalledWith('Program Level Report Status');
  });

  it('should initialize dataTable and stop loading', () => {
    component.showLoader = true;
    fixture.detectChanges();
    component.initializeDataTable('Program Level Report Status');
    expect(component.showLoader).toBeFalsy();
  });

  it('on refresh it should go for api call to fetch text-book', () => {
    component.contentService.post = jasmine.createSpy(' search call spy').and.callFake(() => {
      return observableOf(textbookList);
    });
     component.refreshReport();
     expect(component.contentService.post).toHaveBeenCalled();
  });

  it('on download generateCsv should be called', () => {
    spyOn(ExportToCsv.prototype, 'generateCsv').and.callFake((a) => {
    alert('csv generated');
   });
      spyOn(window, 'alert');
    component.downloadReport();
    expect(window.alert).toHaveBeenCalled();
  });

});
