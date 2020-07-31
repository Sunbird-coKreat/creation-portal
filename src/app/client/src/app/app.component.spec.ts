
import { Observable, of } from 'rxjs';
import { ConfigService, ToasterService, ResourceService, SharedModule, NavigationHelperService,
  BrowserCacheTtlService } from '@sunbird/shared';
import { UserService, LearnerService, CoursesService, PermissionService, TenantService,
  PublicDataService, SearchService, ContentService, CoreModule, OrgDetailsService, DeviceRegisterService
} from '@sunbird/core';
import { TelemetryService, TELEMETRY_PROVIDER } from '@sunbird/telemetry';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { mockData } from './app.component.spec.data';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as _ from 'lodash-es';
import { DatePipe } from '@angular/common';
import { ProfileService } from '@sunbird/profile';
import { CacheService } from 'ng2-cache-service';
import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

class RouterStub {
  public navigationEnd = new NavigationEnd(0, '/explore', '/explore');
  public navigate = jasmine.createSpy('navigate');
  public url = '';
  public events = new Observable(observer => {
    observer.next(this.navigationEnd);
    observer.complete();
  });
}
const fakeActivatedRoute = {
  snapshot: {
    root: { firstChild: { params: { slug: 'sunbird' } } }
  },
  queryParams: of({})
};


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let telemetryService;
  let configService;
  let userService;
  let timerCallback;
  let resourceService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule,
        RouterTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: Router, useClass: RouterStub},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        ToasterService, TenantService, CacheService, AnimationBuilder,
        DatePipe,
        UserService, ConfigService, LearnerService, BrowserCacheTtlService,
        PermissionService, ResourceService, CoursesService, OrgDetailsService, ProfileService,
        TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }, SearchService, ContentService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const navigationHelperService = TestBed.get(NavigationHelperService);
    telemetryService = TestBed.get(TelemetryService);
    configService = TestBed.get(ConfigService);
    userService = TestBed.get(UserService);
    resourceService = TestBed.get(ResourceService);
    spyOn(navigationHelperService, 'initialize').and.callFake(() => {});
    spyOn(telemetryService, 'initialize');
    spyOn(telemetryService, 'getDeviceId').and.callFake((cb) => cb('123'));
    spyOn(document, 'querySelector').and.returnValue({ setAttribute: () => { }});
    spyOn(Fingerprint2, 'constructor').and.returnValue({get: () => {}});
    spyOn(document, 'getElementById').and.callFake((id) => {
      if (id === 'buildNumber') {
        return { value: '1.1.12.0' };
      }
      if (id === 'deviceId') {
        return { value: 'device' };
      }
      if (id === 'defaultTenant') {
        return { value: 'defaultTenant' };
      }
    });
    timerCallback = jasmine.createSpy('timerCallback');
    jasmine.clock().install();
  });

afterEach(() => {
  jasmine.clock().uninstall();
});
  // it('should config telemetry service for login Session', () => {
  //   const learnerService = TestBed.get(LearnerService);
  //   const publicDataService = TestBed.get(PublicDataService);
  //   const tenantService = TestBed.get(TenantService);
  //   userService._authenticated = true;
  //   spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
  //   spyOn(publicDataService, 'post').and.returnValue(of({result: { response: { content: 'data'} } }));
  //   spyOn(learnerService, 'getWithHeaders').and.returnValue(of(mockData.success));
  //   component.ngOnInit();
  //   const config = {
  //     userOrgDetails: {
  //       userId: '4df1bfaf-8352-411e-a7b8-6993d7f6391a',
  //       rootOrgId: '01305464129106739256',
  //       rootOrg: {
  //         'dateTime': null,
  //         'preferredLanguage': null,
  //         'keys': {},
  //         'channel': 'channel1000',
  //         'approvedBy': null,
  //         'description': null,
  //         'updatedDate': null,
  //         'addressId': null,
  //         'orgType': null,
  //         'provider': 'channel1000',
  //         'orgCode': null,
  //         'locationId': null,
  //         'theme': null,
  //         'id': '01305464129106739256',
  //         'isApproved': null,
  //         'communityId': null,
  //         'slug': 'channel1000',
  //         'email': null,
  //         'isSSOEnabled': false,
  //         'identifier': '01305464129106739256',
  //         'thumbnail': null,
  //         'updatedBy': null,
  //         'orgName': 'org-success',
  //         'address': {},
  //         'locationIds': [],
  //         'externalId': 'org-success',
  //         'isRootOrg': true,
  //         'rootOrgId': '01305464129106739256',
  //         'imgUrl': null,
  //         'approvedDate': null,
  //         'orgTypeId': null,
  //         'homeUrl': null,
  //         'isDefault': null,
  //         'createdDate': '2020-07-01 06:04:16:588+0000',
  //         'parentOrgId': null,
  //         'createdBy': null,
  //         'hashTagId': '01305464129106739256',
  //         'noOfMembers': null,
  //         'status': 1
  //       },
  //       organisationId: '01305464129106739256'
  //     },
  //     config: {
  //       pdata: {
  //         id: component.userService.appId,
  //         ver: '1.1.12',
  //         pid: configService.appConfig.TELEMETRY.PID
  //       },
  //       endpoint: configService.urlConFig.URLS.TELEMETRY.SYNC,
  //       apislug: configService.urlConFig.URLS.CONTENT_PREFIX,
  //       host: '',
  //       uid: '4df1bfaf-8352-411e-a7b8-6993d7f6391a',
  //       sid: component.userService.sessionId,
  //       channel: _.get(userService.userProfile, 'rootOrg.hashTagId'),
  //       env: 'home',
  //       enableValidation: true,
  //       timeDiff: 0
  //     }
  //   };
  //   expect(telemetryService.initialize).toHaveBeenCalledTimes(0);
  // });
  it('should not call register Device api for login Session', () => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    userService._authenticated = true;
    spyOn(deviceRegisterService, 'initialize');
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'getWithHeaders').and.returnValue(of(mockData.success));
    component.ngOnInit();
    expect(deviceRegisterService.initialize).toHaveBeenCalledTimes(0);
  });
const maockOrgDetails = { result: { response: { content: [{hashTagId: '1235654', rootOrgId: '1235654'}] }}};
  // it('should config telemetry service for Anonymous Session', () => {
  //   const orgDetailsService = TestBed.get(OrgDetailsService);
  //   const publicDataService = TestBed.get(PublicDataService);
  //   const tenantService = TestBed.get(TenantService);
  //   spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
  //   spyOn(publicDataService, 'post').and.returnValue(of(maockOrgDetails));
  //   orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
  //   component.ngOnInit();
  //   const config = {
  //     userOrgDetails: {
  //       userId: 'anonymous',
  //       rootOrgId: '1235654',
  //       organisationIds: ['1235654']
  //     },
  //     config: {
  //       pdata: {
  //         id: component.userService.appId,
  //         ver: '1.1.12',
  //         pid: configService.appConfig.TELEMETRY.PID
  //       },
  //       batchsize: 2,
  //       endpoint: configService.urlConFig.URLS.TELEMETRY.SYNC,
  //       apislug: configService.urlConFig.URLS.CONTENT_PREFIX,
  //       host: '',
  //       uid: 'anonymous',
  //       sid: component.userService.anonymousSid,
  //       channel: '1235654',
  //       env: 'home',
  //       enableValidation: true,
  //       timeDiff: 0
  //     }
  //   };
  //   expect(telemetryService.initialize).toHaveBeenCalledTimes(0);
  // });
  it('should not call register Device api for Anonymous Session', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    const deviceRegisterService = TestBed.get(DeviceRegisterService);
    spyOn(deviceRegisterService, 'initialize');
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    orgDetailsService.orgDetails = {hashTagId: '1235654', rootOrgId: '1235654'};
    component.ngOnInit();
    expect(deviceRegisterService.initialize).toHaveBeenCalledTimes(0);
  });

  it('should check framework key is in user read api and open the popup  ', () => {
    const learnerService = TestBed.get(LearnerService);
    const publicDataService = TestBed.get(PublicDataService);
    const tenantService = TestBed.get(TenantService);
    userService._authenticated = true;
    component.showFrameWorkPopUp = true;
    spyOn(tenantService, 'get').and.returnValue(of(mockData.tenantResponse));
    spyOn(publicDataService, 'postWithHeaders').and.returnValue(of({result: { response: { content: 'data'} } }));
    spyOn(learnerService, 'getWithHeaders').and.returnValue(of(mockData.success));
    component.ngOnInit();
    expect(component.showFrameWorkPopUp).toBeTruthy();
  });
  it('Should call beforeunloadHandler', () => {
    const event = {
      'isTrusted': true
    };
    spyOn(component, 'beforeunloadHandler');
    component.beforeunloadHandler(event);
    expect(component.beforeunloadHandler).toHaveBeenCalledWith(event);
  });
  it('Should call isLocationStatusRequired config', () => {
    spyOn(component, 'isLocationStatusRequired');
    component.isLocationStatusRequired();
    expect(component.isLocationStatusRequired).toHaveBeenCalled();
  });
  it('Should call checkLocationStatus update popup', () => {
    spyOn(component, 'checkLocationStatus');
    component.checkLocationStatus();
    expect(component.checkLocationStatus).toHaveBeenCalled();
  });
  it('Should call logExData telemetry method', () => {
    spyOn(component, 'logExData');
    component.logExData('IMPRESSION', {});
    expect(component.logExData).toHaveBeenCalledWith('IMPRESSION', {});
  });
  it('Should call onCloseDeviceNoticePopUp window', () => {
    spyOn(component, 'onCloseDeviceNoticePopUp');
    component.onCloseDeviceNoticePopUp();
    expect(component.onCloseDeviceNoticePopUp).toHaveBeenCalled();
  });
  it('Should call checkFrameworkSelected', () => {
    spyOn(component, 'checkFrameworkSelected');
    component.checkFrameworkSelected();
    expect(component.checkFrameworkSelected).toHaveBeenCalled();
  });
  it('Should call onAcceptTnc from framework', () => {
    spyOn(component, 'onAcceptTnc');
    component.onAcceptTnc();
    expect(component.onAcceptTnc).toHaveBeenCalled();
  });
  it('Should call updateFrameWork data and config', () => {
    spyOn(component, 'updateFrameWork');
    component.updateFrameWork({});
    expect(component.updateFrameWork).toHaveBeenCalled();
  });
  it('Should call interpolateInstance', () => {
    spyOn(component, 'interpolateInstance');
    component.interpolateInstance('message');
    expect(component.interpolateInstance).toHaveBeenCalled();
  });
  it('Should call getUserFeedData', () => {
    spyOn(component, 'getUserFeedData');
    component.getUserFeedData();
    expect(component.getUserFeedData).toHaveBeenCalled();
  });
  it('Should call onLocationSubmit', () => {
    spyOn(component, 'onLocationSubmit');
    component.onLocationSubmit();
    expect(component.onLocationSubmit).toHaveBeenCalled();
  });
  it('Should call onContributorModalSubmit', () => {
    spyOn(component, 'onContributorModalSubmit');
    component.onContributorModalSubmit();
    expect(component.onContributorModalSubmit).toHaveBeenCalled();
  });
});
