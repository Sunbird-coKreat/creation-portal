import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnswerComponent } from './answer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import {  DebugElement } from '@angular/core';
import { CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;
  let debugElement: DebugElement;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerComponent ],
      imports: [CoreModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
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
});
