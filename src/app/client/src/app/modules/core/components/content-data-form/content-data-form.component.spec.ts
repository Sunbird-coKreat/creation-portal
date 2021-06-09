import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDataFormComponent } from './content-data-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
describe('ContentDataFormComponent', () => {
  let component: ContentDataFormComponent;
  let fixture: ComponentFixture<ContentDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDataFormComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#valueChanges() should emit formInputData event', () => {
    const event = {
      attributions: ['kayal'],
      license: 'CC BY 4.0',
      name: 'Lo-may-111',
    };
    spyOn(component.formInputData, 'emit');
    component.valueChanges(event);
    expect(component.formInputData.emit).toHaveBeenCalledWith(event);
  });

  it('#onStatusChanges() should emit formStatus event', () => {
    const event = { isDirty: false,
      isInvalid: true,
      isPristine: true,
      isValid: false };
    spyOn(component.formStatus, 'emit');
    component.onStatusChanges(event);
    expect(component.formStatus.emit).toHaveBeenCalledWith(event);
  });
});
