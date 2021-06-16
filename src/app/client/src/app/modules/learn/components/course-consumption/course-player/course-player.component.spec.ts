// import { BehaviorSubject, of } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CoreModule, UserService, PermissionService } from '@sunbird/core';
// import { async, ComponentFixture, TestBed, tick, fakeAsync  } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { CoursePlayerComponent } from './course-player.component';
// import { SharedModule, ResourceService, WindowScrollService, ToasterService, ContentUtilsServiceService } from '@sunbird/shared';
// import { CourseConsumptionService, CourseProgressService, CourseBatchService, AssessmentScoreService } from '@sunbird/learn';
// import { CourseHierarchyGetMockResponse, CourseHierarchyGetMockResponseFlagged } from './course-player.component.mock.data';
// import { TelemetryModule } from '@sunbird/telemetry';
// import { enrolledBatch } from './../../batch/batch-details/batch-details.component.data';
// import { CoursesService } from './../../../../core/services/course/course.service';
// import * as _ from 'lodash-es';
// import { RouterTestingModule } from '@angular/router/testing';
// describe('CoursePlayerComponent', () => {
//   let component: CoursePlayerComponent;
//   let fixture: ComponentFixture<CoursePlayerComponent>;
//   class RouterStub {
//     navigate = jasmine.createSpy('navigate');
//   }
//   const resourceServiceMockData = {
//     messages: {
//       imsg: { m0027: 'Something went wrong' },
//       stmsg: { m0009: 'error' },
//       emsg: { m0005: 'error' }
//     },
//     frmelmnts: {
//       btn: {
//         tryagain: 'tryagain',
//         close: 'close'
//       },
//       lbl: {
//         description: 'description'
//       }
//     }
//   };
//   class ActivatedRouteStub {
//     paramsMock = new BehaviorSubject<any>({ courseId: 'do_212347136096788480178', batchId: 'do_112498388508524544160' });
//     snapshot = {
//       data: {
//         telemetry: { env: 'course', pageid: 'course-read', type: 'workflow', object: { ver: '1.0', type: 'course' } }
//       }
//     };
//     queryParamsMock = { contentId: 'do_112270494168555520130' };
//     queryParams = of(this.queryParamsMock);
//     get params() {
//       return this.paramsMock.asObservable();
//     }
//     public changeParams(params) {
//       this.paramsMock.next(params);
//     }
//     public changeQueryParams(params) {
//       this.queryParamsMock = params;
//     }
//   }

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [CoursePlayerComponent],
//       providers: [CourseConsumptionService, CourseProgressService, CourseBatchService, CoursesService, AssessmentScoreService,
//       ContentUtilsServiceService,
//         { provide: Router, useClass: RouterStub },
//         { provide: ActivatedRoute, useClass: ActivatedRouteStub }
//       ],
//       imports: [RouterTestingModule, SharedModule.forRoot(), CoreModule, HttpClientTestingModule, TelemetryModule.forRoot()],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(CoursePlayerComponent);
//     component = fixture.componentInstance;
//   });

//   afterEach(() => {
//     fixture.destroy();
//   });

//   it('should fetch courseHierarchy from courseConsumptionService', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     const courseBatchService = TestBed.inject(CourseBatchService);
//     spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     component.ngOnInit();
//     expect(component.courseHierarchy).toBeDefined();
//     expect(component.contributions).toBeDefined();
//     expect(_.isString(component.contributions)).toBeTruthy();
//   });

//   it('should set enrolledCourse to true if batchId is provided by activatedRoute', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     const courseBatchService = TestBed.inject(CourseBatchService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeTruthy();
//   });

//   it('should get content state if course is enrolled', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     const courseBatchService = TestBed.inject(CourseBatchService);
//     spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeTruthy();
//     expect(courseConsumptionService.getContentState).toHaveBeenCalled();
//     expect(component.contentStatus).toBeDefined();
//   });

//   it('should not play the content obtained from url if enrolled course and course is flagged', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     const courseBatchService = TestBed.inject(CourseBatchService);
//     spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').
//       and.returnValue(of(CourseHierarchyGetMockResponseFlagged.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponseFlagged.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeTruthy();
//     expect(component.contentId).toBeUndefined();
//     expect(component.flaggedCourse).toBeTruthy();
//     expect(component.playerConfig).toBeUndefined();
//     expect(component.contentTitle).toBeUndefined();
//     expect(component.enableContentPlayer).toBeFalsy();
//   });
//   it('should play the content obtained from url if enrolled course and should set prev and next playable content', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     const courseBatchService = TestBed.inject(CourseBatchService);
//     spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeTruthy();
//     expect(component.contentId).toBeDefined();
//     expect(component.prevPlaylistItem).toBeDefined();
//     expect(component.nextPlaylistItem).toBeUndefined();
//     expect(component.playerConfig).toBeDefined();
//     expect(component.contentTitle).toBeDefined();
//     expect(component.enableContentPlayer).toBeTruthy();
//   });

//   it('should play content if course status is unlisted', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178', courseStatus: 'Unlisted' });
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeFalsy();
//     expect(component.contentId).toBeDefined();
//     expect(component.playerConfig).toBeDefined();
//     expect(component.enableContentPlayer).toBeTruthy();
//   });

//   it('should not play content if course is not enrolled', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeFalsy();
//     expect(component.contentId).toBeUndefined();
//     expect(component.playerConfig).toBeUndefined();
//     expect(component.enableContentPlayer).toBeFalsy();
//   });

//   it('should play content for course creator', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     const userService = TestBed.inject(UserService);
//     userService._userid = 'testUser';
//     activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeFalsy();
//     expect(component.contentId).toBeDefined();
//     expect(component.playerConfig).toBeDefined();
//     expect(component.enableContentPlayer).toBeTruthy();
//   });
//   it('should not play content if his not course creator', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     const userService = TestBed.inject(UserService);
//     userService._userid = 'testUser2';
//     activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeFalsy();
//     expect(component.contentId).toBeUndefined();
//     expect(component.playerConfig).toBeUndefined();
//     expect(component.enableContentPlayer).toBeFalsy();
//   });
//   it('should play content for course mentor', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     const userService = TestBed.inject(UserService);
//     const permissionService = TestBed.inject(PermissionService);
//     activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     spyOn(permissionService, 'checkRolesPermissions').and.returnValue(true);
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeFalsy();
//     expect(component.permissionService.checkRolesPermissions)
//       .toHaveBeenCalledWith(['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION']);
//     expect(component.contentId).toBeDefined();
//     expect(component.playerConfig).toBeDefined();
//     expect(component.enableContentPlayer).toBeTruthy();
//   });
//   it('should not play content if not course mentor', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     const userService = TestBed.inject(UserService);
//     const permissionService = TestBed.inject(PermissionService);
//     activatedRouteStub.changeParams({ courseId: 'do_212347136096788480178' });
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     spyOn(permissionService, 'checkRolesPermissions').and.returnValue(false);
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     spyOn(courseConsumptionService, 'getConfigByContent').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeFalsy();
//     expect(component.permissionService.checkRolesPermissions)
//       .toHaveBeenCalledWith(['COURSE_MENTOR', 'CONTENT_REVIEWER', 'CONTENT_CREATOR', 'CONTENT_CREATION']);
//     expect(component.contentId).toBeUndefined();
//     expect(component.playerConfig).toBeUndefined();
//     expect(component.enableContentPlayer).toBeFalsy();
//   });
//   it('should not play the content enrolled batch status is 0', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const resourceService = TestBed.inject(ResourceService);
//     resourceService.messages = resourceServiceMockData.messages;
//     resourceService.frmelmnts = resourceServiceMockData.frmelmnts;
//     const windowScrollService = TestBed.inject(WindowScrollService);
//     const courseBatchService = TestBed.inject(CourseBatchService);
//     enrolledBatch.result.response.status = 0;
//     spyOn(courseBatchService, 'getEnrolledBatchDetails').and.returnValue(of(enrolledBatch.result.response));
//     spyOn(windowScrollService, 'smoothScroll');
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     spyOn(courseConsumptionService, 'getContentState').and.returnValue(of(CourseHierarchyGetMockResponse.result));
//     component.ngOnInit();
//     expect(component.enrolledCourse).toBeTruthy();
//     expect(component.contentId).toBeUndefined();
//     expect(component.playerConfig).toBeUndefined();
//     expect(component.contentTitle).toBeUndefined();
//     expect(component.enableContentPlayer).toBeFalsy();
//     enrolledBatch.result.response.status = 1;
//   });
//   it('should not display error message if content id is not available in queryparams', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const toasterService = TestBed.inject(ToasterService);
//     const activatedRouteStub = TestBed.inject(ActivatedRoute);
//     spyOn(courseConsumptionService, 'getCourseHierarchy').and.returnValue(of(CourseHierarchyGetMockResponse.result.content));
//     activatedRouteStub.queryParams = of({});
//     activatedRouteStub.changeParams({ courseStatus: 'Unlisted' });
//     spyOn(toasterService, 'error').and.callThrough();
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     component.ngOnInit();
//     expect(toasterService.error).not.toHaveBeenCalled();
//     expect(component.courseStatus).toEqual('Unlisted');
//   });
//   it('should make update contentState api call if the content is youTube and progress is greater than 20%', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'video/x-youtube'}};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 20}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.batchId = '123';
//     component.enrolledBatchInfo = {status: 1};
//     component.contentProgressEvent(telemetryEvent);

//     expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();
//   });
//   it('should make update contentState api call if the content is video/mp4 and progress is greater than 20%', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'video/mp4'}};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 20}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.batchId = '123';
//     component.enrolledBatchInfo = {status: 1};
//     component.contentProgressEvent(telemetryEvent);
//     expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();
//   });
//   it('should not make update contentState api call if the content is youTube and progress is greater than 20%', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'video/x-youtube'}};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 19}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.batchId = '123';
//     component.enrolledBatchInfo = {status: 1};
//     component.contentProgressEvent(telemetryEvent);
//     expect(courseConsumptionService.updateContentsState).not.toHaveBeenCalled();
//   });
//   it('should not make update contentState api call if the content is video/mp4 and progress is greater than 20%', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'video/mp4'}};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 19}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.batchId = '123';
//     component.enrolledBatchInfo = {status: 1};
//     component.contentProgressEvent(telemetryEvent);
//     expect(courseConsumptionService.updateContentsState).not.toHaveBeenCalled();
//   });
//   it('should make update contentState api call if the content is html and progress is greater than 0%', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'application/vnd.ekstep.html-archive'}};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 0}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.courseProgressData = { content: [{ contentId: '123', status: 1}]};
//     component.enrolledBatchInfo = {status: 1};
//     component.batchId = '123';
//     component.contentProgressEvent(telemetryEvent);
//     expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();
//   });
//   it('should make update contentState api call if the content is h5p and progress is greater than 0%', () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'application/vnd.ekstep.h5p-archive'}};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 0}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.courseProgressData = { content: [{ contentId: '123', status: 1}]};
//     component.enrolledBatchInfo = {status: 1};
//     component.batchId = '123';
//     component.contentProgressEvent(telemetryEvent);
//     expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();
//   });
//   it('should make update contentState api call if the the content is not(html,h5p,video/youtub) and progress is equal to 100',
//   () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'application/vnd.ekstep.eclm-archive'}};
//     const playerDestroyData = { contentId: '123'};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 100}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.courseProgressData = { content: [{ contentId: '123', status: 1}]};
//     component.enrolledBatchInfo = {status: 1};
//     component.batchId = '123';
//     component.contentProgressEvent(telemetryEvent);
//     expect(courseConsumptionService.updateContentsState).toHaveBeenCalled();
//   });
//   it('should not make update contentState api call if the the content is not(html,h5p,video/youtub) and progress is equal to 100',
//   () => {
//     const courseConsumptionService = TestBed.inject(CourseConsumptionService);
//     const contentData = {model: { mimeType: 'application/vnd.ekstep.eclm-archive'}};
//     const playerDestroyData = { contentId: '123'};
//     const telemetryEvent = { detail: {
//       telemetryData: { eid: 'END',
//         edata: {summary: [{progress: 20}]}
//       }}};
//     spyOn(component, 'findContentById').and.returnValue(contentData);
//     spyOn(component, 'closeContentPlayer').and.returnValue(undefined);
//     spyOn(courseConsumptionService, 'updateContentsState').and.returnValue(of({}));
//     component.courseProgressData = { content: [{ contentId: '123', status: 1}]};
//     component.enrolledBatchInfo = {status: 1};
//     component.contentProgressEvent(telemetryEvent);
//     expect(courseConsumptionService.updateContentsState).not.toHaveBeenCalled();
//   });
// });
