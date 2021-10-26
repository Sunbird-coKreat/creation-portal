import { InterpolatePipe } from '@sunbird/shared';
import { async, TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { FrameworkService, UserService, ExtPluginService } from '@sunbird/core';
import * as _ from 'lodash-es';
import {  throwError , of } from 'rxjs';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RecursiveTreeComponent } from './recursive-tree.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigService, BrowserCacheTtlService, ToasterService, ResourceService } from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { DatePipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { recursiveTreeComponentInput } from './recursive-tree.component.spec.data';
import { TelemetryService, TELEMETRY_PROVIDER } from '../../../telemetry/services/telemetry/telemetry.service';
import {  NavigationHelperService } from '@sunbird/shared';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';

xdescribe('RecursiveTreeComponent', () => {

  let fixture: ComponentFixture<RecursiveTreeComponent>;
  let component: RecursiveTreeComponent;
  let mockResponseData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SuiModule,
        ReactiveFormsModule,
        FormsModule,
        TelemetryModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        InterpolatePipe,
        RecursiveTreeComponent
      ],
      providers: [
        TelemetryService, ConfigService,
        {
          provide: TELEMETRY_PROVIDER, useValue: EkTelemetry
        },
        {
          provide : NavigationHelperService,
        },
        {
          provide: CacheService,
        },
        {
          provide: BrowserCacheTtlService,
        },
        {
          provide: ToasterService,
        },
        {
          provide: ResourceService,
        },
        {
          provide: ExtPluginService,
        },
        {
          provide: DatePipe,
        },
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveTreeComponent);
    component = fixture.componentInstance;
    component.programContext = recursiveTreeComponentInput.programContext;
    component.sessionContext = recursiveTreeComponentInput.sessionContext;
    component.dynamicHeaders = recursiveTreeComponentInput.dynamicHeaders;
    fixture.detectChanges();
    component.nodeMeta.subscribe((outputData) => {
      mockResponseData = outputData;
    });
  });

  it('should create', () => {
    component.resourceService.frmelmnts.lbl = 'All Chapter(s)';
    expect(component).toBeTruthy();
  });

  it('add button should be false on component initialize', () => {
    expect(component.showAddresource).toBeFalsy();
  });

  it('should execute nodeMetaEmitter on event', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'nodeMetaEmitter').and.callThrough();
    component.nodeMetaEmitter({sampleEvent: 'NodeMetaEmit', action : 'SampleAdd'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'SampleAdd'}));
    });
  });

  it('should execute nodeMetaEmitter on event for eventAction add to be true', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'nodeMetaEmitter').and.callThrough();
    component.nodeMetaEmitter({action : 'add'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'add'}));
    });
  });

  it('should execute createResource on event & collection', async(() => {
    fixture.detectChanges();
    const spy = spyOn(component, 'createResource').and.callThrough();
    component.createResource({stopPropagation() {return null; }}, 'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'add', collection: 'do_id=232323343434rff'}));
    });
  }));

  it('should execute deleteResource on event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'deleteResource').and.callThrough();
    component.deleteResource({}, 'sampleContent_do_id', 'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      // tslint:disable-next-line:max-line-length
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'delete', content: 'sampleContent_do_id', collection: 'do_id=232323343434rff'}));
    });
  });

  it('should execute moveResource on event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'moveResource').and.callThrough();
    component.moveResource({}, 'sampleContent_do_id', 'do_id=232323343434rff');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      // tslint:disable-next-line:max-line-length
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'beforeMove', content: 'sampleContent_do_id', collection: 'do_id=232323343434rff'}));
    });
  });

  it('should execute previewResource on event, collection, content', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'previewResource').and.callThrough();
    component.previewResource({}, 'sampleContent_do_id', 'do_id=232323343434rff', 'do_123456','123456');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      // tslint:disable-next-line:max-line-length
      expect(mockResponseData).toEqual(jasmine.objectContaining({action: 'preview', content: 'sampleContent_do_id', collection: 'do_id=232323343434rff'}));
    });
  });

  it('should execute menuClick on event', () => {
    fixture.detectChanges();
    const spy = spyOn(component, 'menuClick').and.callThrough();
    component.menuClick({stopPropagation() {return null; }, sampleEvent: 'clicked'});
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should check dynamic headers', () => {
    if(component.dynamicHeaders && component.dynamicHeaders.length == 0){
      expect(fixture.debugElement.query(By.css('.dynamic-header'))).toBeUndefined(); 
    }else{
      expect(fixture.debugElement.query(By.css('.dynamic-header'))).toBeDefined(); 
    }
  });
});

