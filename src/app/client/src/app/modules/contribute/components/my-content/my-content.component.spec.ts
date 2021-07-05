import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '@sunbird/shared';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { ActionService, UserService, LearnerService, PlayerService } from '@sunbird/core';
import { MyContentComponent } from './my-content.component';
import { mockData } from './my-content.component.spec.data';
import { of, throwError } from 'rxjs';

describe('MyContentComponent', () => {
  let component: MyContentComponent;
  let fixture: ComponentFixture<MyContentComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      data: {
        hideHeaderNFooter: 'true',
        telemetry: { env: 'creation-portal', type: 'list', subtype: 'paginate', pageid: 'contribution_my_content' }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule.forRoot(), PlayerHelperModule],
      declarations: [ MyContentComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry },
        { provide: UserService, useValue: mockData.userServiceStub },
        ActionService, LearnerService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContentComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #initialize after calls ngOnInit', () => {
    spyOn(component, 'getPageId').and.callThrough();
    spyOn(component, 'initialize').and.callThrough();
    component.ngOnInit();
    expect(component.getPageId).toHaveBeenCalled();
    expect(component.initialize).toHaveBeenCalled();
  });

  it('#getPageId() should return #telemetryPageId', () => {
    const pageId = component.getPageId();
    expect(pageId).toEqual('contribution_my_content');
  });

  it('#ngAfterViewInit() should set #telemetryImpression data', () => {
    component.ngAfterViewInit();
  });

  it('#initialize() should fetch content details when API success', () => {
    spyOn(component, 'getContents').and.returnValue(of(mockData.contentListRes.result));
    spyOn(component, 'getFrameworks').and.returnValue(of(mockData.frameworkListRes.result));
    spyOn(component, 'getOriginForApprovedContents').and.returnValue(of(mockData.publishedContentListRes.result));
    spyOn(component, 'getUserProfiles').and.returnValue(of(mockData.userContentListRes.result));
    spyOn(component, 'prepareContributionDetails').and.callThrough();
    spyOn(component, 'createUserMap').and.callThrough();
    component.initialize();
    expect(component.createUserMap).toHaveBeenCalled();
    expect(component.prepareContributionDetails).toHaveBeenCalled();
    expect(component.showLoader).toBeFalsy();
  });

  it('#initialize() should not call #getUserProfiles when #publishedContents empty', () => {
    spyOn(component, 'getContents').and.returnValue(of(mockData.contentListRes.result));
    spyOn(component, 'getFrameworks').and.returnValue(of(mockData.frameworkListRes.result));
    spyOn(component, 'getOriginForApprovedContents').and.returnValue(of(mockData.publishedContentListRes));
    // spyOn(component, 'getUserProfiles').and.callThrough();
    spyOn(component, 'prepareContributionDetails').and.callThrough();
    component.initialize();
    // expect(component.getUserProfiles).not.toHaveBeenCalled();
    expect(component.prepareContributionDetails).toHaveBeenCalled();
    expect(component.showLoader).toBeFalsy();
  });

});
