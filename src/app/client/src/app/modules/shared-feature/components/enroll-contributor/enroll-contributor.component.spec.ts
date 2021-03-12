import { SuiModule } from 'ng2-semantic-ui';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { EnrollContributorComponent } from './enroll-contributor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

xdescribe('EnrollContributorComponent', () => {
  let component: EnrollContributorComponent;
  let fixture: ComponentFixture<EnrollContributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[ SuiModule, TelemetryModule, FormsModule, ReactiveFormsModule ],
      declarations: [ EnrollContributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollContributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
