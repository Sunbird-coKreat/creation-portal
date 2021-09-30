import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgramHeaderComponent } from './program-header.component';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { ToasterService, ConfigService } from '@sunbird/shared';
import { mockRes } from './program-header.component.spec.data';
import { of } from 'rxjs';
import * as _ from 'lodash-es';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';


const fakeActivatedRoute = {
  snapshot: {
    params: {
      programId: '6835f250-1fe1-11ea-93ea-2dffbaedca40'
    },
    data: {
      telemetry: {
        env: 'programs'
      }
    }
  }
};
class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

const testStage = {stageId: 1, stage: 'collectionComponent'};

xdescribe('ProgramHeaderComponent', () => {
  let component: ProgramHeaderComponent;
  let fixture: ComponentFixture<ProgramHeaderComponent>;
  let programStageService;
  let configService;
  let telemetryService;
  let de;

  const programTelemetryServiceStub = {

    getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
      return _.omitBy({
        id,
        type,
        pageid,
        extra
      }, _.isUndefined);
    },
    getTelemetryInteractPdata(id?: string, pid?: string) {
      const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
      const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
      return {
        id,
        ver: version,
        pid
      };
    },
    getTelemetryInteractObject(id: string, type: string, ver: string): IInteractEventObject {
      return {
        id, type, ver
      };
    },
    getTelemetryInteractCdata(id: string, type: string) {
      return [{
        type, id
      }];
    }
  };
  // let serviceSpy: jasmine.SpyObj<ProgramStageService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TelemetryModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ ProgramHeaderComponent ],
      providers: [ ProgramStageService, ToasterService, TelemetryService, ConfigService,
        { provide: ProgramTelemetryService, useValue: programTelemetryServiceStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub},
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ProgramHeaderComponent);
    de = fixture.debugElement;
    programStageService = TestBed.get(ProgramStageService);
    configService = TestBed.get(ConfigService);
    telemetryService = TestBed.get(TelemetryService);
    component = fixture.componentInstance;
    component.programDetails = mockRes.inputData;
    component.nominationDetails = mockRes.inputData;
    component.roles = mockRes.inputData;
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));


  it('should checkIfshowSkipReview based on config', () => {
    const spyOne = spyOn(component, 'checkIfshowSkipReview').and.callThrough();
    component.ngOnInit();
    // programStageService.getStage();
    fixture.detectChanges();
    expect(spyOne).toHaveBeenCalled();
    expect(component.checkIfshowSkipReview).toEqual(false);
  });

  it('should have setActiveDate stage', () => {
    const spyOne = spyOn(component, 'setActiveDate').and.callThrough();
    component.ngOnInit();
    expect(spyOne).toHaveBeenCalled();
    expect(component.setActiveDate).toEqual('nomination_enddate');
  });


  xit('should call setTargetCollectionValue on  ', () => {
    const spy = spyOn(component, 'setTargetCollectionValue').and.callThrough();
    expect(spy).toHaveBeenCalled();
  });
});
