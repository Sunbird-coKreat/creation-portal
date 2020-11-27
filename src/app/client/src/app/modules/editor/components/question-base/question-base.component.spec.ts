import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBaseComponent } from './question-base.component';

describe('QuestionBaseComponent', () => {
  let component: QuestionBaseComponent;
  let fixture: ComponentFixture<QuestionBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBaseComponent ]
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
