import { CollectionHierarchyService } from './../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { DaysToGoPipe } from './../../../shared-feature/pipes/days-to-go.pipe';
import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService, ResourceService, ToasterService, UtilService,
   BrowserCacheTtlService, NavigationHelperService } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionComponent} from '../index';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentService, UserService, ProgramsService } from '@sunbird/core';
import { CacheService } from '../../../shared/services/cache-service/cache.service';
import { ProgramStageService } from '../../../program/services';
import { collectionComponentInput, collectionWithCard, searchCollectionResponse,
   userProfile, addParticipentResponseSample, objectCategoryDefinition } from './collection.component.spec.data';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import {APP_BASE_HREF, DatePipe} from '@angular/common';
import { HelperService } from '../../../sourcing/services/helper.service';

const programDetailsTargetCollection = {
  'target_collection_category': [
      'Question paper'
  ]
};

const errorInitiate = false;
const userServiceStub = {
  get() {
    if (errorInitiate) {
      return throwError ({
        result: {
          responseCode: 404
        }
      });
    } else {
      return of(addParticipentResponseSample);
    }
  },
  userid: userProfile.userId,
  userProfile : userProfile
};

const ContentServiceStub = {
  post() {
    return of( searchCollectionResponse );
  }
};

const activatedRouteStub = {
  data: of({
    config: {
      question_categories: [
        'vsa',
        'sa',
        'la',
        'mcq'
      ]
    }
  }),
  snapshot: {
    root: { firstChild: { data: { telemetry: { env: 'env' } } } },
    data: {
      telemetry: { env: 'env' }
    }
  }
};

xdescribe('CollectionComponent', () => {
  let component: CollectionComponent;
  let collectionHierarchyService: CollectionHierarchyService;
  let programsService: ProgramsService;

  let fixture: ComponentFixture<CollectionComponent>;



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponent, DaysToGoPipe ],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ConfigService,
        ToasterService,
        ResourceService,
        CacheService,
        BrowserCacheTtlService,
        UtilService,
        ContentService,
        ProgramStageService,
        {
          provide: ContentService,
          useValue: ContentServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        },
        {provide: APP_BASE_HREF, useValue: '/'},
        CollectionHierarchyService,
        DatePipe,
        NavigationHelperService,
        HelperService
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    component.showError = false;
    component.collectionComponentInput = collectionComponentInput;
    component.userProfile = collectionComponentInput.userProfile;
    component.collectionComponentConfig = collectionComponentInput.config;
    component.programContext = collectionComponentInput.programContext;
    component.collectionsWithCardImage = collectionWithCard;
    programsService = TestBed.get(ProgramsService);
    collectionHierarchyService = TestBed.get(CollectionHierarchyService);
    // fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('stageSubscription should get subcribe on component initialize', () => {
    expect(component.stageSubscription).toBeDefined();
  });

  xit('should call changeView on stage change', () => {
    component.programStageService.getStage = jasmine.createSpy('getstage() spy').and.callFake(() => {
        return of({stages: []});
    });
    spyOn(component, 'changeView');
    component.ngOnInit();
    expect(component.changeView).toHaveBeenCalled();
  });

  it('getImplicitFilters should call filterByCollection and filter by code', () => {
    spyOn(component, 'filterByCollection');
    component.getImplicitFilters();
    expect(component.filterByCollection).toHaveBeenCalledWith(jasmine.any(Array), 'code', jasmine.any(Array));
  });

  it('after filter it should discard unwanted implicit code', () => {
    collectionComponentInput.config.config.filters.implicit.push({
      'code': 'class_unwanted',
      'defaultValue': 'class 10',
      'label': 'Class'
    });
    expect(_.includes(component.getImplicitFilters(), 'class_unwanted')).toBeFalsy();
  });

  xit('should be less than or equal to the filters mentioned in config', () => {
    expect(component.filters.length).toBeLessThanOrEqual(collectionComponentInput.config.config.filters.implicit.length);
  });

  it('Object to key array', () => {
    const object = {
      a: 'test1',
      b: 'test2',
      c: false
    };
    const keyArray = ['a', 'b', 'c'];
    const keyArrayOfObject = component.objectKey(object);
    expect(keyArrayOfObject).toEqual(keyArray);
  });

  it('should filter textbook of same identifier with status Draft', () => {
    expect(_.includes(component.filterTextBook, {status: 'Review'})).toBeFalsy();
  });

  it('onSelect of gradeLevel filter', () => {
   component.setAndClearFilterIndex(2);
   expect(component.selectedIndex).toEqual(2);
   expect(component.activeFilterIndex).toEqual(2);
  });

  it('onDeselect of gradeLevel filter', () => {
    component.setAndClearFilterIndex(2); // To set filter
    component.setAndClearFilterIndex(2); // To clear filter
    expect(component.selectedIndex).toEqual(-1);
    expect(component.activeFilterIndex).toEqual(2);
   });

   it('collectionList should always be object', () => {
     expect(component.collectionList).toEqual(jasmine.any(Object));
   });

   xit('should define chapterListInput value on click of collection', () => {
     const sampleEvent = {
       data: {
         name: 'sampleName',
         metaData: {
           identifier: 'do_sampleId'
         }
       }
     };
     let testData;
     component.isCollectionSelected.subscribe((eventData) => {
       testData = eventData;
     });
     expect(component.chapterListComponentInput).toEqual(jasmine.objectContaining({collection: sampleEvent.data}));
     expect(testData).toEqual(true);
   });

   xit('can pass medium to filterCollectionList as filterValue', () => {
    component.filterCollectionList('Kannada', 'medium');
    expect(_.has(component.collectionList, 'Kannada')).toEqual(true); // As per the spec data
   });

   it ('#setTargetCollectionValue() should set targetCollection values', () => {
    const  service  = TestBed.get(ProgramsService);
    spyOn(service, 'setTargetCollectionName').and.returnValue('Digital Textbook');
    component.programContext = programDetailsTargetCollection;
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).not.toBeUndefined();
    expect(component.targetCollections).not.toBeUndefined();
  });

  it ('#setTargetCollectionValue() should not set targetCollection values in collection', () => {
    component.targetCollection = undefined;
    component.programContext = undefined;
    const  service  = TestBed.get(ProgramsService);
    spyOn(service, 'setTargetCollectionName').and.returnValue(undefined);
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).toBeUndefined();
    expect(component.targetCollections).toBeUndefined();
  });

  it ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    const  service  = TestBed.get(ProgramsService);
    component.programContext = programDetailsTargetCollection;
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    spyOn(service, 'setTargetCollectionName').and.callThrough();
    component.setTargetCollectionValue();
    expect(service.setTargetCollectionName).toHaveBeenCalled();
  });

  it ('#setFrameworkCategories() should call collectionHierarchyService.getCollectionHierarchyDetails', () => {
    spyOn(component, 'setFrameworkCategories').and.callThrough();
    spyOn(collectionHierarchyService, 'getCollectionHierarchyDetails').and.callThrough();
    component.setFrameworkCategories('do_12345');
    expect(collectionHierarchyService.getCollectionHierarchyDetails).toHaveBeenCalledWith('do_12345');
  });

  it ('#setFrameworkCategories() should set sessionContext values', () => {
    const collectionData = {
        result: {
          content: {
            primaryCategory: 'Digital Textbook',
            name: 'test content'
          }
        },
        id: 'api.programsService',
    params: {
        err: null,
        errmsg : null,
        msgid : '31df557d-ce56-e489-9cf3-27b74c90a920',
        resmsgid : null,
        status : 'success'},
   responseCode: 'OK',
   ts:'',
   ver:''
      };
    const frameworkData = {framework: 'cbse_framework'};
    const  helperService  = TestBed.get(HelperService);
    spyOn(collectionHierarchyService, 'getCollectionHierarchyDetails').and.returnValue(of(collectionData));
    spyOn(helperService, 'setFrameworkCategories').and.returnValue(frameworkData);
    spyOn(component, 'setFrameworkCategories').and.callThrough();
    component.setFrameworkCategories('do_12345');
    expect(collectionHierarchyService.getCollectionHierarchyDetails).toHaveBeenCalledWith('do_12345');
    expect(component.sessionContext.targetCollectionPrimaryCategory).toEqual('Digital Textbook');
    expect(helperService.setFrameworkCategories).toHaveBeenCalledWith(collectionData.result.content);
    expect(component.sessionContext.targetCollectionFrameworksData).toBe(frameworkData);
  });

  it('#getCollectionCategoryDefinition() Should call programsService.getCategoryDefinition() method', () => {
    component.programContext = {target_collection_category: 'Course'};
    component['userService'] = TestBed.inject(UserService);
    component.firstLevelFolderLabel = undefined;
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).toHaveBeenCalled();
    expect(component.firstLevelFolderLabel).toBeDefined();
  });
  it('#getCollectionCategoryDefinition() Should not call programsService.getCategoryDefinition() method', () => {
    component.programContext = {target_collection_category: undefined};
    component['userService'] = TestBed.inject(UserService);
    component.firstLevelFolderLabel = undefined;
    component['programsService'] = TestBed.inject(ProgramsService);
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).not.toHaveBeenCalled();
  });

});
