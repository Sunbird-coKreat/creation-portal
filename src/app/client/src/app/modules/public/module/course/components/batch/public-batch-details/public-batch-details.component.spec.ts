/* 
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PublicBatchDetailsComponent } from './public-batch-details.component';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { CoreModule, PermissionService } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { allBatchDetails } from './public-batch-details.component.data';
import { UserService } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}
const fakeActivatedRoute = {
  'params': observableOf({ courseId: 'do_1125083286221291521153' }),
  'queryParams': observableOf({})
};
const resourceServiceMockData = {
  messages : {
    imsg: { m0027: 'Something went wrong'},
    stmsg: { m0009: 'error' },
    fmsg: { m0004: 'error'}
  },
  frmelmnts: {
    btn: {
      tryagain: 'tryagain',
      close: 'close'
    },
    lbl: {
      description: 'description'
    }
  }
};
describe('PublicBatchDetailsComponent', () => {
  let component: PublicBatchDetailsComponent;
  let fixture: ComponentFixture<PublicBatchDetailsComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule.forRoot(), CoreModule, SuiModule],
      declarations: [PublicBatchDetailsComponent],
      providers: [ UserService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    fixture = TestBed.createComponent(PublicBatchDetailsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });


 */