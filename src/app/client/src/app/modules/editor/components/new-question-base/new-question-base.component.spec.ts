import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuestionBaseComponent } from './new-question-base.component';

describe('NewQuestionBaseComponent', () => {
  let component: NewQuestionBaseComponent;
  let fixture: ComponentFixture<NewQuestionBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewQuestionBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewQuestionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
