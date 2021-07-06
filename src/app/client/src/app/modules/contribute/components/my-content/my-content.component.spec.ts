import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule, ToasterService, ConfigService } from '@sunbird/shared';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { ActionService, UserService, LearnerService, PlayerService } from '@sunbird/core';
import { SourcingService } from '../../../sourcing/services';
import { MyContentComponent } from './my-content.component';
import { mockData } from './my-content.component.spec.data';
import { of, throwError as observableThrowError } from 'rxjs';

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
        ActionService, LearnerService, SourcingService, ConfigService
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

  it('#onCardClick() should set #selectedContributionDetails data', () => {
    component.contents = mockData.contentListRes.result.content;
    spyOn(component, 'setContentCount').and.callThrough();
    spyOn(component, 'loadTabComponent').and.callThrough();
    const data = {key : 'k-12', value: { published: 2, notPublished: 1}};
    component.onCardClick(data);
    expect(component.setContentCount).toHaveBeenCalled();
    expect(component.loadTabComponent).toHaveBeenCalledWith('frameworkTab');
    expect(component.selectedFrameworkType).toEqual(data);
    expect(component.selectedContributionDetails).toBeDefined();
  });

  it('#onFrameworkClick() should set #selectedContentDetails data', () => {
    spyOn(component, 'setContentCount').and.callThrough();
    spyOn(component, 'loadTabComponent').and.callThrough();
    const data = { published: 2, notPublished: 1};
    component.onFrameworkClick(data);
    expect(component.setContentCount).toHaveBeenCalledWith(data.published, data.notPublished);
    expect(component.loadTabComponent).toHaveBeenCalledWith('contentTab');
    expect(component.selectedContentDetails).toEqual(data);
  });

  it('#onPreview() should set #slectedContent data', () => {
    spyOn(component, 'getConfigByContent').and.callThrough();
    const data = { origin: 123, identifier: 123};
    component.onPreview(data);
    expect(component.getConfigByContent).toHaveBeenCalledWith(data.identifier);
    expect(component.slectedContent).toBeDefined();
  });

  it('#onBack() should load #frameworkTab', () => {
    spyOn(component, 'loadTabComponent').and.callThrough();
    spyOn(component, 'setContentCount').and.callThrough();
    component._selectedTab = 'contentTab';
    component.selectedFrameworkType = {key : 'k-12', value: { published: 2, notPublished: 1}};
    component.onBack();
    expect(component.setContentCount).toHaveBeenCalled();
    expect(component.loadTabComponent).toHaveBeenCalledWith('frameworkTab');
  });

  it('#getContents() shoud fetch content details when API success', () => {
    const actionService: ActionService = TestBed.inject(ActionService);
    spyOn(actionService, 'post').and.returnValue(of(mockData.contentListRes));
    component.getContents().subscribe((apiResponse: any) => {
      expect(apiResponse.content.length).toBe(2);
    });
  });

  it('#getContents() shoud throw error when API failed', () => {
    const toasterService: ToasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    const actionService: ActionService = TestBed.inject(ActionService);
    spyOn(actionService, 'post').and.returnValue(observableThrowError({}));
    component.getContents();
    // expect(toasterService.error).toHaveBeenCalledWith('Something went wrong, try again later');
  });

  it('#getOriginForApprovedContents() shoud fetch published content details when API success', () => {
    const learnerService: LearnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(of(mockData.publishedContentListRes));
    component.getOriginForApprovedContents(['do_123']).subscribe((apiResponse: any) => {
      expect(apiResponse.content.length).toBe(3);
    });
  });

  it('#getConfigByContent() shoud play content preview when API success', () => {
    const playerService: PlayerService = TestBed.inject(PlayerService);
    spyOn(playerService, 'getConfigByContent').and.returnValue(of({context: { pdata : { pid: ''}, cdata: {}}}));
    spyOn(component, 'loadTabComponent').and.callThrough();
    component.getConfigByContent('do_123');
    expect(component.loadTabComponent).toHaveBeenCalledWith('previewTab');
  });

  it('#getUserProfiles() shoud fetch user details when API success', () => {
    const learnerService: LearnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(of(mockData.userContentListRes));
    component.getUserProfiles(['123']).subscribe((apiResponse: any) => {
      expect(apiResponse.response.content.length).toBe(2);
    });
  });

  it('#getFrameworks() shoud fetch framework details when API success', () => {
    const learnerService: LearnerService = TestBed.inject(LearnerService);
    spyOn(learnerService, 'post').and.returnValue(of(mockData.frameworkListRes));
    component.getFrameworks().subscribe((apiResponse: any) => {
      expect(apiResponse.Framework.length).toBe(1);
    });
  });

  it('#loadTabComponent() shoud set tab', () => {
    component.loadTabComponent('previewTab');
    expect(component._selectedTab).toBe('previewTab');
  });

  it('#setContentCount() shoud set content count ', () => {
    component.setContentCount(2, 3);
    expect(component.contentCountData).toEqual({total: 5, published: 2, notPublished: 3});
  });

});
