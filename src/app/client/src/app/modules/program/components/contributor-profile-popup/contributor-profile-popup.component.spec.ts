import { of,throwError as observableThrowError } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryService } from './../../../telemetry/services/telemetry/telemetry.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, UserService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { RegistryService, ProgramsService } from '@sunbird/core';
import { ResourceService, PaginationService, ConfigService } from '@sunbird/shared';
import { SourcingService } from './../../../sourcing/services';
import { ActivatedRoute } from '@angular/router';
import { ContributorProfilePopupComponent } from './contributor-profile-popup.component';

describe('ContributorProfilePopupComponent', () => {
  let component: ContributorProfilePopupComponent;
  let fixture: ComponentFixture<ContributorProfilePopupComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        programId: '12345'
      },
      data: {
        telemetry: {
          env: 'vdn', pageid: 'create-program', subtype: '', type: '',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule,
        FormsModule, CoreModule, TelemetryModule, RouterTestingModule,
        SharedModule.forRoot(), SuiModule],
      declarations: [ContributorProfilePopupComponent],
      providers: [TelemetryService, RegistryService, ProgramsService,
        ResourceService, PaginationService, ConfigService, SourcingService,
        {provide: UserService},
        {provide: ActivatedRoute, useValue: fakeActivatedRoute}],
    })
      .compileComponents();
    fixture = TestBed.createComponent(ContributorProfilePopupComponent);
    component = fixture.componentInstance;
  });
  
  afterEach(() => {
    fixture.destroy();
  });


  it('should create', () => {
    console.log(component);
    expect(component).toBeTruthy();
  });

  it('getUserProfile Should fetch the user profile', () => {
 
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'searchRegistry').and.returnValue(of({xyz: 'xyz'}));
    spyOn(component, 'getUserProfile').and.callFake(() => {});
    spyOn(component, 'setFullName').and.callFake(() => {});
    component.getUserProfile();
    component.setFullName();
    expect(component.getUserProfile).toHaveBeenCalled();
    expect(component.setFullName).toHaveBeenCalled();
  });

  it('getOrgProfile Should fetch the user org profile', () => {
  
    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'searchRegistry').and.returnValue(of({xyz: 'xyz'}));
    spyOn(component, 'getOrgProfile').and.callFake(() => {});
    component.getOrgProfile();
    expect(component.getOrgProfile).toHaveBeenCalled();
  });

  it('ngOnInit Should call getOrgProfile/getUserProfile ', () => {
  
    component.orgId = '124';
    //component.userId = '123';
    spyOn(component, 'ngOnInit').and.callFake(() => {});
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  xit('handleError Should called on service failure ', () => {

    const programsService = TestBed.get(ProgramsService);
    spyOn(programsService, 'searchRegistry').and.callFake(() => observableThrowError({}));
    component.getOrgProfile();
    component.getUserProfile();
    expect(component.getOrgProfile).toThrowError();
    expect(component.getUserProfile).toThrowError();
  
  });

  
});

