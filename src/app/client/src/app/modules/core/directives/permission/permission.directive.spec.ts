import { mockUserData } from './../../services/user/user.mock.spec.data';
import { PermissionDirective } from './permission.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService, ResourceService, ToasterService , BrowserCacheTtlService} from '@sunbird/shared';
import { UserService, LearnerService, PermissionService, ContentService } from '@sunbird/core';
import { CacheService } from 'ng2-cache-service';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF,DatePipe } from '@angular/common'; 

@Component({
  template: `<a appPermission id="permission" [permission]= 'adminDashboard'
  href="#">dashboard</a>`
})
class TestWrapperComponent {
  adminDashboard = [];
}
xdescribe('PermissionDirective', () => {
  let component: TestWrapperComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,RouterTestingModule],
      declarations: [PermissionDirective, TestWrapperComponent],
      providers: [ToasterService, ResourceService, PermissionService, UserService,
      CacheService, ContentService, ConfigService, LearnerService, HttpClient, BrowserCacheTtlService,
      {provide: APP_BASE_HREF, useValue: '/'}]
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
  });
  it('should create an instance', () => {
    fixture.detectChanges();
  });
});
