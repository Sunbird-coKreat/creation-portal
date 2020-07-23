import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as _ from 'lodash-es';
import { ChapterListComponent } from './chapter-list.component';
import { RecursiveTreeComponent } from '../recursive-tree/recursive-tree.component';
import { ResourceTemplateComponent } from '../resource-template/resource-template.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { ToasterService, SharedModule, ResourceService} from '@sunbird/shared';
import { CoreModule, ActionService, UserService, PublicDataService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, throwError as observableError, of } from 'rxjs';
import { SuiModule, SuiTabsModule } from 'ng2-semantic-ui/dist';
import { ProgramStageService } from '../../../program/services';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import { DatePipe } from '@angular/common';
import {
  chapterListComponentInput, responseSample,
  fetchedQueCount, templateSelectionEvent
} from './chapter-list.component.spec.data';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DynamicModule } from 'ng-dynamic-component';


describe('ChapterListComponent', () => {
  let component: ChapterListComponent;
  let fixture: ComponentFixture<ChapterListComponent>;
  let errorInitiate, de: DebugElement;
  let unitLevelResponse;
  let ResourceServiceMock: ResourceService;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else if (unitLevelResponse) {
        return observableOf({result: {content: responseSample.result.content.children[2]}});
      } else {
        return observableOf(responseSample);
      }
    },
    post() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf({result: {identifier: 'do_123', node_id: 'do_1234', versionKey: '123456'}});
      }
    },
    patch() {
      return observableOf('success');
    },
    delete() {
      return observableOf('success');
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

  const UserServiceStub = {
    userid: '874ed8a5-782e-4f6c-8f36-e0288455901e',
    userProfile: {
      firstName: 'Creator',
      lastName: 'ekstep'
    }
  };
  const PublicDataServiceStub = {
    post() {
      return observableOf(fetchedQueCount);
    }
  };
  const compState = 'chapterListComponent';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule.forRoot(), CoreModule, RouterTestingModule, TelemetryModule.forRoot(), SuiModule,
        SuiTabsModule, FormsModule, DynamicModule],
      declarations: [ChapterListComponent, RecursiveTreeComponent, ResourceTemplateComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [CollectionHierarchyService, ResourceService,
        DatePipe,
             { provide: ActionService, useValue: actionServiceStub }, { provide: UserService, useValue: UserServiceStub },
      { provide: PublicDataService, useValue: PublicDataServiceStub }, ToasterService,
      { provide: ActivatedRoute, useValue: activatedRouteStub}, ProgramStageService]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.chapterListComponentInput = chapterListComponentInput;
    errorInitiate = false;
    unitLevelResponse = false;
    fixture.detectChanges();
  });

    it('Component created', () => {
      component.resourceService.frmelmnts.lbl = 'All Chapter(s)';
      expect(component).toBeDefined();
    });

    it('stageSubscription should get subcribe on component initialize', () => {
      expect(component.stageSubscription).toBeDefined();
    });

    it('Default it should show all Chapters', () => {
      expect(component.selectedChapterOption).toMatch('all');
    });

    it('dynamicOuts should be registered on initialize', () => {
      expect(_.get(component.dynamicOutputs, 'uploadedContentMeta')).toBeDefined();
    });

    it('should call updateAccordianView on componet initialize', () => {
      spyOn(component, 'updateAccordianView');
      component.ngOnInit();
      expect(component.updateAccordianView).toHaveBeenCalled();
    });

    it('sessionContext should be updated if session in chapterListComponentInput changes', () => {
      chapterListComponentInput.sessionContext.subject = ['dummyValue'];
      component.ngOnChanges({});
      expect(component.sessionContext).toEqual(jasmine.objectContaining({subject: ['dummyValue']}));
    });

    it('uploadHandler should be in uploadedContentMeta function', () => {
      spyOn(component, 'uploadHandler');
      component.dynamicOutputs.uploadedContentMeta({contentId: 'do_1234567'});
      expect(component.uploadHandler).toHaveBeenCalledWith({contentId: 'do_1234567'});
    });

    it('should call changeView on stage change', () => {
       // const programStageSpy = jasmine.createSpyObj('programStageService', ['getStage']);
       // programStageSpy.getStage.and.returnValue('stubValue');
       component.programStageService.getStage = jasmine.createSpy('getstage() spy').and.callFake(() => {
           return observableOf({stages: []});
       });
       spyOn(component, 'changeView');
       component.ngOnInit();
       expect(component.changeView).toHaveBeenCalled();
    });

    xit('drop-down should contain only first level of units', () => {
      const firstLevelUnitLength = _.filter(responseSample.result.content.children, {contentType: 'TextBookUnit'}).length;
      expect(firstLevelUnitLength).toEqual(component.levelOneChapterList.length);
    });

    xit('on selecting unit in drop-down of chapterlist which should be in opened state', async() => {
      component.selectedChapterOption = 'do_000000000000000';
      spyOn(component, 'lastOpenedUnit');
      await component.lastOpenedUnit(component.selectedChapterOption);
      expect(component.lastOpenedUnit).toHaveBeenCalled();
    });

    xit('should close template selection-popup on successful selection', () => {
      component.handleTemplateSelection({});
      expect(component.showResourceTemplatePopup).toBeFalsy();
    });

    xit('templateDetails should be defined on successful template selection', () => {
      component.selectedSharedContext = {framework: 'NCFCOPY', topic: ['Topic 2 child']};
      component.handleTemplateSelection(templateSelectionEvent);
      expect(component.templateDetails).toBeDefined();
    });

    xit('templateDetails should be defined on successful template selection', () => {
      // tslint:disable-next-line:prefer-const
      component.selectedSharedContext = {framework: 'NCFCOPY', topic: ['Topic 2 child']};
      spyOn(component, 'componentLoadHandler');
      component.handleTemplateSelection(templateSelectionEvent);
      expect(component.componentLoadHandler).toHaveBeenCalledWith('creation', jasmine.any(Function), 'uploadComponent');
    });

    xit('should show confirmation Modal when delete event comes', () => {
      // tslint:disable-next-line:max-line-length
      component.showResourceTemplate({action: 'delete', content: {identifier: 'do_12345'}, collection: {identifier: 'do_12345', sharedContext: {framework: 'NCFCOPY'}}});
      expect(component.showConfirmationModal).toBeTruthy();
    });

    xit('should define prevUnitSelect beforeMove the content to other unit', () => {
      // tslint:disable-next-line:max-line-length
      component.showResourceTemplate({action: 'beforeMove', content: {identifier: 'do_12345'}, collection: {identifier: 'do_12345', sharedContext: {framework: 'NCFCOPY'}}});
      expect(component.prevUnitSelect).toBeDefined();
    });

    xit('should updateAccordianView after successful move of content', () => {
      spyOn(component, 'updateAccordianView');
      // tslint:disable-next-line:max-line-length
      component.showResourceTemplate({action: 'afterMove', content: {identifier: 'do_12345'}, collection: {identifier: 'do_12345', sharedContext: {framework: 'NCFCOPY'}}});
      expect(component.updateAccordianView).toHaveBeenCalledWith(jasmine.any(String));
    });

    xit('should clear assigned unitIdentifier and contentIdentifier', () => {
      // tslint:disable-next-line:max-line-length
      component.showResourceTemplate({action: 'cancelMove', content: {identifier: 'do_12345'}, collection: {identifier: 'do_12345', sharedContext: {framework: 'NCFCOPY'}}});
      expect(component.unitIdentifier).toEqual('');
    });

    xit('should call handlePreview on preview event', () => {
      spyOn(component, 'handlePreview');
      // tslint:disable-next-line:max-line-length
      component.showResourceTemplate({action: 'preview', content: {identifier: 'do_12345', contentType: 'ExplanationResource'}, collection: {identifier: 'do_12345', sharedContext: {framework: 'NCFCOPY'}}});
      expect(component.handlePreview).toHaveBeenCalled();
    });

    xit('should call componentHandler on preview of content', () => {
      spyOn(component, 'componentLoadHandler');
      // tslint:disable-next-line:max-line-length
      component.handlePreview({action: 'preview', content: {identifier: 'do_12345', contentType: 'ExplanationResource'}, collection: {identifier: 'do_12345', sharedContext: {framework: 'NCFCOPY'}}});
      expect(component.componentLoadHandler).toHaveBeenCalled();
    });

    xit('should call componentHandler only if required contentType present in config', () => {
      spyOn(component, 'componentLoadHandler');
      // tslint:disable-next-line:max-line-length
      component.handlePreview({action: 'preview', content: {identifier: 'do_12345', contentType: 'UnkonwnXYZ'}, collection: {identifier: 'do_12345', sharedContext: {framework: 'NCFCOPY'}}});
      expect(component.componentLoadHandler).not.toHaveBeenCalled();
    });

    xit('should call updateAccordian on uploadHandler', () => {
      component.unitIdentifier = 'do_0000000000';
      spyOn(component, 'updateAccordianView');
      component.uploadHandler({contentId: 'do_1234567890'});
      expect(component.updateAccordianView).toHaveBeenCalled();
    });

    it('should lastOpenedUnitParent be defined with parent do_id of given child-unit', () => {
      component.lastOpenedUnit('do_1127639059664568321138'); // do_id of child-unit
      const lastChild = 'do_1127639059664568321138';
      expect(lastChild).toEqual('do_1127639059664568321138');
    });

    it('should updateAccordianView after successful removal of content', () => {
      component.unitIdentifier = 'do_0000000000';
      ResourceServiceMock = TestBed.get(ResourceService);
      ResourceServiceMock.messages = {smsg: {m0064: 'Content is successfully removed'}};
      spyOn(component, 'updateAccordianView');
      component.removeResourceFromHierarchy();
      expect(component.showConfirmationModal).toBeFalsy();
      expect(component.updateAccordianView).toHaveBeenCalledWith(jasmine.any(String));
    });

   xit('should unsubscribe subject', () => {
    component.ngOnDestroy();
  });
});
