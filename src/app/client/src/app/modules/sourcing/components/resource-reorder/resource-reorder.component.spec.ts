import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui-v9';
import { ResourceReorderComponent } from './resource-reorder.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { ProgramTelemetryService } from '../../../program/services';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService } from '@sunbird/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF,DatePipe } from '@angular/common'; 
import * as mockData from './resource-reorder.component.spec.data';
const testData = mockData.mockRes;

describe('ResourceReorderComponent', () => {
  let component: ResourceReorderComponent;
  let fixture: ComponentFixture<ResourceReorderComponent>;
  let debugElement: DebugElement;
  let errorInitiate;
  const errorInitiate1 = false;
  const hierarchyServiceStub: any = {};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule, RouterModule.forRoot([]), TelemetryModule.forRoot()],
      declarations: [ ResourceReorderComponent ],
      providers: [ProgramTelemetryService, ConfigService, UtilService, ToasterService, TelemetryService,
                       ResourceService, CacheService, BrowserCacheTtlService,DatePipe,
                       {provide: CollectionHierarchyService, useValue: hierarchyServiceStub},
                       {provide: APP_BASE_HREF, useValue: '/'}]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceReorderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.sessionContext = {};
    component.sessionContext['collection'] = 'do_1127639035982479361130';
    component.unitSelected = 'do_11282684038818201618';
    component.contentId = 'do_112797719109984256198';
    component.prevUnitSelect = 'do_112826840689098752111';
    component.programContext =  {
        'userDetails': {
          'enrolledOn': '2019-12-27T09:13:33.742Z',
          'onBoarded': true,
          'onBoardingData': {
            'school': 'My School'
          },
          'programId': '18cc8a70-2889-11ea-9bc0-fd6cea67ce9f',
          'roles': [
            'CONTRIBUTOR'
          ],
          'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
        }
      };
    // fixture.detectChanges();
  });

  beforeAll(() => {
    hierarchyServiceStub.addResourceToHierarchy = jasmine.createSpy(' addHierarchySpy').and.callFake(() => {
      if (errorInitiate) {
              return observableError({ result: { responseCode: 404 } });
            } else {
              return observableOf('Success');
            }
    });
    hierarchyServiceStub.removeResourceToHierarchy = jasmine.createSpy(' removeHierarchySpy').and.callFake(() => {
      if (errorInitiate) {
              return observableError({ result: { responseCode: 404 } });
            } else {
              return observableOf('Success');
            }
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should execute moveResource method successfully', () => {
    fixture.detectChanges();
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#moveResource'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).toHaveBeenCalledWith('The Selected Resource is Successfully Moved');
  });
  xit('should not execute removeResource method if addResource fails', () => {
    errorInitiate = true;
    fixture.detectChanges();
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#moveResource'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).not.toHaveBeenCalled();
  });

  it('#emitAfterMoveEvent() should call moveEvent', () => {
    component.contentId = testData.afterMove.contentId;
    spyOn(component.moveEvent, 'emit').and.returnValue(testData.afterMove);
    component.emitAfterMoveEvent(testData.afterMove.collection.identifier);
    expect(component.moveEvent.emit).toHaveBeenCalledWith(testData.afterMove);
  });

  it('#cancelMove() should call moveEvent', () => {
    spyOn(component.moveEvent, 'emit').and.returnValue(testData.cancelMove);
    component.cancelMove();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(testData.cancelMove);
  });

  it('#addResource() calls #collectionHierarchyService.addResourceToHierarchy() with expected parameters', () => {
    component.sessionContext = { collection: testData.addResourceData.collectionId, selectedMvcContentDetails: {name: 'abcd'}};
    component.prevUnitSelect = testData.addResourceData.unitIdentifier;
    component.contentId = testData.addResourceData.contentId;
    component.collectionUnitsBreadcrumb = ['abcd'];
    spyOn(component, 'addResource').and.callThrough();
    component['modal'] = {
      deny: jasmine.createSpy('deny')
    };
    component.addResource();
    expect(component.addResource).toHaveBeenCalled();
    expect(hierarchyServiceStub.addResourceToHierarchy).toHaveBeenCalledWith(
      testData.addResourceData.collectionId,
      testData.addResourceData.unitIdentifier,
      testData.addResourceData.contentId
    );
    expect(component['modal'].deny).toHaveBeenCalled();
  });

  xit('#getParents() call #getParentsHelper() with expected parameters', () => {
    spyOn(component, 'getParentsHelper').and.callThrough();
    spyOn(component, 'getParents').and.callThrough();
    component.getParents(testData.collectionUnits, testData.prevUnitSelect);
    expect(component.getParentsHelper).toHaveBeenCalledWith (
      { 'children': testData.collectionUnits },
        testData.prevUnitSelect,
        []
      );
  });
});
