import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { QuestionBaseComponent } from './question-base.component';
import { CoreModule, ContentService, PublicDataService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
describe('QuestionBaseComponent', () => {
  let component: QuestionBaseComponent;
  let fixture: ComponentFixture<QuestionBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBaseComponent ],
      imports: [CoreModule, SharedModule.forRoot(), RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
