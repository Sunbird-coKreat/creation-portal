import { CollectionHierarchyService } from './../../../sourcing/services/collection-hierarchy/collection-hierarchy.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextbookListComponent } from './textbook-list.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule } from '@sunbird/telemetry';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, ProgramsService, UserService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import {  throwError , of } from 'rxjs';
import * as SpecData from './textbook-list.component.spec.data';
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
      return of(SpecData.addParticipentResponseSample);
    }
  },
  userid: SpecData.userProfile.userId,
  userProfile : SpecData.userProfile
};

describe('TextbookListComponent', () => {
  let component: TextbookListComponent;
  let collectionHierarchyService: CollectionHierarchyService;
  let programsService: ProgramsService;
  let fixture: ComponentFixture<TextbookListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SharedModule.forRoot(), TelemetryModule, RouterTestingModule, CoreModule, FormsModule, ReactiveFormsModule],
      declarations: [ TextbookListComponent ],
      providers: [
        {
          provide: UserService,
          useValue: userServiceStub
        },
        DatePipe,
        TelemetryService,
        CollectionHierarchyService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextbookListComponent);
    component = fixture.componentInstance;
    programsService = TestBed.inject(ProgramsService);
    collectionHierarchyService = TestBed.get(CollectionHierarchyService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('#setTargetCollectionValue() should set targetCollection values', () => {
    spyOn(programsService, 'setTargetCollectionName').and.returnValue('Digital Textbook');
    component.programDetails = programDetailsTargetCollection;
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).not.toBeUndefined();
  });

  xit ('#setTargetCollectionValue() should not set targetCollection values', () => {
    component.targetCollection = undefined;
    component.programDetails = undefined;
    spyOn(programsService, 'setTargetCollectionName').and.returnValue(undefined);
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    component.setTargetCollectionValue();
    expect(component.targetCollection).toBeUndefined();
  });

  xit ('#setTargetCollectionValue() should call programsService.setTargetCollectionName()', () => {
    component.programDetails = programDetailsTargetCollection;
    spyOn(component, 'setTargetCollectionValue').and.callThrough();
    spyOn(programsService, 'setTargetCollectionName').and.callThrough();
    component.setTargetCollectionValue();
    expect(programsService.setTargetCollectionName).toHaveBeenCalled();
  });

  xit('#getCollectionCategoryDefinition() Should call programsService.getCategoryDefinition() method', () => {
    component['programDetails'] = {target_collection_category: 'Course'};
    component['userService'] = TestBed.inject(UserService);
    component.firstLevelFolderLabel = undefined;
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(SpecData.objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).toHaveBeenCalled();
    expect(component.firstLevelFolderLabel).toBeDefined();
  });
  xit('#getCollectionCategoryDefinition() Should not call programsService.getCategoryDefinition() method', () => {
    component.programDetails.target_collection_category = undefined;
    component['userService'] = TestBed.inject(UserService);
    component.firstLevelFolderLabel = undefined;
    spyOn(component['programsService'], 'getCategoryDefinition').and.returnValue(of(SpecData.objectCategoryDefinition));
    component.getCollectionCategoryDefinition();
    expect(component['programsService'].getCategoryDefinition).not.toHaveBeenCalled();
  });
});
