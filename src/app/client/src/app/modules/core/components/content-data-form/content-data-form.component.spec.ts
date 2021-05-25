import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentDataFormComponent } from './content-data-form.component';

xdescribe('ContentDataFormComponent', () => {
  let component: ContentDataFormComponent;
  let fixture: ComponentFixture<ContentDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentDataFormComponent ]
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
});
