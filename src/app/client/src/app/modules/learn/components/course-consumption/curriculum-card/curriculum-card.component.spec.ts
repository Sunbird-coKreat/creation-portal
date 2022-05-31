import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurriculumCardComponent } from './curriculum-card.component';
import {SharedModule} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('CurriculumCardComponent', () => {
  let component: CurriculumCardComponent;
  let fixture: ComponentFixture<CurriculumCardComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      declarations: [ CurriculumCardComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(CurriculumCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    fixture.destroy();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
