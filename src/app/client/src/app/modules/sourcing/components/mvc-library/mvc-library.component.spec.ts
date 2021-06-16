import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of as observableOf,  throwError as observableThrowError, } from 'rxjs';
import { ConfigService, ToasterService, SharedModule} from '@sunbird/shared';
import { ActionService, ProgramsService, ContentService } from '@sunbird/core';
import { APP_BASE_HREF } from '@angular/common';
import { SourcingService } from '../../services';
import { DatePipe } from '@angular/common';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { MvcLibraryComponent } from './mvc-library.component';
import { mockMvcLibraryData } from './mvc-library.component.spec.data';

describe('MvcLibraryComponent', () => {
  let component: MvcLibraryComponent;
  let fixture: ComponentFixture<MvcLibraryComponent>;
  let debugElement: DebugElement;

  const fakeActivatedRoute = {
    paramMap: observableOf(convertToParamMap(mockMvcLibraryData.fakeParamMap)),
    snapshot: {
      data: {
        hideHeaderNFooter: 'true',
        telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'mvc-explore' }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule.forRoot()],
      declarations: [ MvcLibraryComponent ],
      providers: [{ provide: Router }, { provide: ActivatedRoute, useValue: fakeActivatedRoute }, ConfigService,
        {provide: APP_BASE_HREF, useValue: '/'}, ToasterService, TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        DatePipe, ActionService, ProgramsService, SourcingService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcLibraryComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide #add_to_textbook popup and #filter initially', () => {
    expect(component.showLargeModal).toBe(false);
    expect(component.isFilterOpen).toBe(false);
  });

  it('#initialize() should call after calls ngOnInit', () => {
    spyOn(component, 'initialize').and.callThrough();
    component.ngOnInit();
    expect(component.showLoader).toBe(true);
    expect(component.collectionId).toBe(mockMvcLibraryData.fakeParamMap.collectionId);
    expect(component.collectionUnitId).toBe(mockMvcLibraryData.fakeParamMap.collectionUnitId);
    expect(component.programId).toBe(mockMvcLibraryData.fakeParamMap.programId);
    expect(component.initialize).toHaveBeenCalled();
  });

  it('#initialize() should set collection and program details data', () => {
    const actionService: ActionService = TestBed.inject(ActionService);
    const programService: ActionService = TestBed.inject(ProgramsService);
    spyOn(component, 'getCollectionHierarchy').and.callThrough();
    spyOn(component, 'getProgramDetails').and.callThrough();
    spyOn(component, 'getUnitWithChildren').and.callThrough();
    spyOn(component, 'fetchContentFacets').and.callThrough();
    spyOn(actionService, 'get').and.returnValue(observableOf(mockMvcLibraryData.collectionHierarchyReadSuccess));
    spyOn(programService, 'get').and.returnValue(observableOf(mockMvcLibraryData.programReadSuccess));
    component.initialize();
    expect(component.getCollectionHierarchy).toHaveBeenCalled();
    expect(component.getProgramDetails).toHaveBeenCalled();
    expect(component.getUnitWithChildren).toHaveBeenCalled();
    expect(component.fetchContentFacets).toHaveBeenCalled();
    expect(component.collectionHierarchy).not.toBeUndefined();
  });

  xit('#initialize() should throw error message when collection hierarchy API failed', () => {
    const actionService: ActionService = TestBed.inject(ActionService);
    spyOn(actionService, 'get').and.returnValue(observableThrowError({}));
    const toasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.initialize();
    expect(component.showLoader).toBe(false);
    expect(toasterService.error).toHaveBeenCalledWith('Fetching textbook details failed. Please try again...');
  });

  xit('#getCollectionHierarchy() should return expected collection data', () => {
    const actionService: ActionService = TestBed.inject(ActionService);
    spyOn(actionService, 'get').and.returnValue(observableOf(mockMvcLibraryData.collectionHierarchyReadSuccess));
    component.getCollectionHierarchy('do_1130307931241103361441').subscribe((res: any) => {
        expect(res).toEqual(mockMvcLibraryData.collectionHierarchyReadSuccess.result.content, 'expected collection hierarchy');
    });
  });

  it('#getProgramDetails() should return expected program details', () => {
    const programService: ProgramsService = TestBed.inject(ProgramsService);
    spyOn(programService, 'get').and.returnValue(observableOf(mockMvcLibraryData.programReadSuccess));
    component.programId = '60ad12d0-b07c-11ea-92c9-6f8fff7dce02s';
    component.getProgramDetails().subscribe((res: any) => {
        expect(res).toEqual(mockMvcLibraryData.programReadSuccess, 'expected program details');
    });
  });

  xit('#fetchContentList() should return expected content list', () => {
    const contentService: ContentService = TestBed.inject(ContentService);
    spyOn(contentService, 'post').and.returnValue(observableOf(mockMvcLibraryData.mvcSearchSuccess));
    spyOn(component, 'openFilter').and.callThrough();
    component.fetchContentList();
    expect(component.contentList).toEqual(mockMvcLibraryData.mvcSearchSuccess.result.content);
    expect(component.selectedContentId).toBe(mockMvcLibraryData.mvcSearchSuccess.result.content[0].identifier);
    expect(component.openFilter).not.toHaveBeenCalled();
  });

  xit('#fetchContentList() should show filter when content list empty', () => {
    const contentService: ContentService = TestBed.inject(ContentService);
    spyOn(contentService, 'post').and.returnValue(observableOf({result : { content: []}}));
    spyOn(component, 'openFilter').and.callThrough();
    component.fetchContentList();
    expect(component.openFilter).toHaveBeenCalled();
    expect(component.isFilterOpen).toBe(true);
    expect(component.contentList.length).toBe(0);
  });

  xit('#fetchContentList() should throw error message when API failed', () => {
    const contentService: ContentService = TestBed.inject(ContentService);
    const toasterService = TestBed.inject(ToasterService);
    spyOn(contentService, 'post').and.returnValue(observableThrowError({}));
    spyOn(toasterService, 'error').and.callThrough();
    component.fetchContentList();
    expect(component.showLoader).toBe(false);
    expect(toasterService.error).toHaveBeenCalledWith('Fetching content list failed');
  });

  it('#plusMinusGradeLevel() should plusMinus #gradeLevel', () => {
      const result = component.plusMinusGradeLevel(mockMvcLibraryData.collectionHierarchyReadSuccess.result.content.gradeLevel);
      expect(result).toEqual(mockMvcLibraryData.plusMinusGradeLevelRes);
  });

  it('#plusMinusGradeLevel() should return empty when gradeLevel is empty', () => {
    const result = component.plusMinusGradeLevel([]);
    expect(result).toEqual([]);
  });

  it('#openFilter() should set #isFilterOpen to "true"', () => {
    component.openFilter();
    expect(component.isFilterOpen).toBe(true);
  });

  it('#onContentChange() should set #selectedContentId', () => {
    let event = {
      content: {name: 'abc', identifier: 'do_12345', isAdded: true }
    }
    component.onContentChange(event);
    expect(component.selectedContentDetails).not.toBeUndefined();
  });

  xit('#onFilterChange() should call #fetchContentList() and set #activeFilterData', () => {
    spyOn(component, 'fetchContentList').and.callThrough();
    component.onFilterChange({action: 'filterDataChange', filters: mockMvcLibraryData.filters});
    // expect(component.showLoader).toBe(true);
    expect(component.activeFilterData).toEqual(mockMvcLibraryData.filters);
    expect(component.fetchContentList).toHaveBeenCalled();
  });

  it('#onFilterChange() should toggle #isFilterOpen', () => {
    spyOn(component, 'fetchContentList').and.callThrough();
    component.onFilterChange({action: 'filterStatusChange', filterStatus: true});
    expect(component.isFilterOpen).toBe(true, 'show at first click');
    component.onFilterChange({action: 'filterStatusChange', filterStatus: false});
    expect(component.isFilterOpen).toBe(false, 'hide at second click');
  });

  it('#showResourceTemplate() should open collection hierarchy popup when event #beforeMove', () => {
    component.sessionContext = {'selectedContentDetails': '', 'resourceReorderBreadcrumb': ''};
    component.selectedContentDetails = 'dummyData';
    component.resourceReorderBreadcrumb  = 'dummyData';
    component.showResourceTemplate({action: 'beforeMove'});
    expect(component.showSelectResourceModal).toBe(true);
  });

  it('#showResourceTemplate() should close collection hierarchy popup when event #afterMove', () => {
    spyOn(component, 'filterContentList').and.callThrough();
    component.childNodes = [];
    component.showResourceTemplate({action: 'afterMove', contentId: 'do_12345'});
    expect(component.showSelectResourceModal).toBe(false);
    expect(component.filterContentList).toHaveBeenCalled();
  });

  it('#showResourceTemplate() should close collection hierarchy popup when event #cancelMove', () => {
    component.showResourceTemplate({action: 'cancelMove'});
    expect(component.showSelectResourceModal).toBe(false);
  });

  it('#showResourceTemplate() should show filter when event #showFilter', () => {
    spyOn(component, 'openFilter').and.callThrough();
    component.showResourceTemplate({action: 'showFilter'});
    expect(component.isFilterOpen).toBe(true);
    expect(component.openFilter).toHaveBeenCalled();
  });

  it('#showResourceTemplate() should stop when event action empty', () => {
    component.showResourceTemplate({action: ''});
  });

});
