import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OptionsComponent } from './options.component';
import { ConfigService } from '@sunbird/shared';
import {  DebugElement } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import * as mockData from './options.component.spec.data';
const testData = mockData.mockRes;

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsComponent ],
      imports: [CoreModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('#getInteractions() should return expected result', fakeAsync(() => {
    const interactionData = component.getInteractions(testData.questionOptions);
    expect(interactionData).toEqual(testData.questionInteraction);
  }));
});
