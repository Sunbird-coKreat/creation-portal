
import { of as observableOf,
  throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, tick, fakeAsync,  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import {SharedModule, ResourceService, ToasterService} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { CreateBatchComponent } from './create-batch.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';



class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
let originalTimeout;

const fakeActivatedRoute = {
  'params': observableOf({ 'courseId': 'do_1125083286221291521153' }),
  'parent': { 'params': observableOf({ 'courseId': 'do_1125083286221291521153' }) },
  'snapshot': {
      params: [
        {
          courseId: 'do_1125083286221291521153',
        }
      ],
      data: {
        telemetry: {
          object: {}
        }
      }
    }
};

xdescribe('CreateBatchComponent', () => {
  let component: CreateBatchComponent;
  let fixture: ComponentFixture<CreateBatchComponent>;



  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [SharedModule.forRoot(), CoreModule, SuiModule, RouterTestingModule,
        HttpClientTestingModule],
      providers: [ToasterService, ResourceService, UserService, 
         TelemetryService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
    })
    .compileComponents();
    fixture = TestBed.createComponent(CreateBatchComponent);
    component = fixture.componentInstance;
  });
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    fixture.destroy();
  });



});
