import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditorComponent } from './content-editor.component';
import { contentEditorComponentInput, playerConfig } from './content-editor.spec.data';
import { ActionService, PlayerService, FrameworkService, UserService } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { TelemetryService } from '@sunbird/telemetry';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, ConfigService, UtilService, BrowserCacheTtlService,
  NavigationHelperService } from '@sunbird/shared';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('ContentEditorComponent', () => {
  let component: ContentEditorComponent;
  let fixture: ComponentFixture<ContentEditorComponent>;

  const userServiceStub = {
    userProfile: {
      userId: '123456789',
      firstName: 'abc',
      lastName: 'xyz',
      organisationIds: ['Org01']
    }
  };

  const collectionHierarchyServiceStub = {
    addResourceToHierarchy() {
      return of('success');
    }
  };

  const playerServiceStub = {
    getConfig() {
      return playerConfig;
    },
    getContent() {
      return of({
        result: {
          content: {
            status: 'Review'
          }
        }
      });
    },
    updateContentBodyForReviewer(data) {
      return data;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlayerHelperModule, SuiModule, FormsModule, RouterTestingModule, TelemetryModule],
      declarations: [ ContentEditorComponent ],
      providers: [ConfigService, ResourceService, BrowserCacheTtlService, TelemetryService, NavigationHelperService, UtilService,
        ToasterService, {provide: CollectionHierarchyService, useValue: collectionHierarchyServiceStub},
                   {provide: UserService, useValue: userServiceStub}, {provide: PlayerService, useValue: playerServiceStub},
                   {provide: ActivatedRoute, useValue: {snapshot: {data: {telemetry: { env: 'program'}}}}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEditorComponent);
    component = fixture.componentInstance;
    component.contentEditorComponentInput = contentEditorComponentInput;
    fixture.detectChanges();
    component.getDetails = jasmine.createSpy('getDetails() spy').and.callFake(() => {
      return of({tenantDetails: { titleName: 'sunbird', logo: 'http://localhost:3000/assets/images/sunbird_logo.png'},
                 ownershipType: ['createdBy']});
  });
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
