import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramListComponent } from './program-list.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DaysToGoPipe, TextbookListComponent } from '../../../shared-feature';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';

xdescribe('ProgramListComponent', () => {
  let component: ProgramListComponent;
  let fixture: ComponentFixture<ProgramListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule.forRoot(), SuiModule, TelemetryModule, ReactiveFormsModule ],
      declarations: [ ProgramListComponent, DaysToGoPipe ],
      providers: [ DatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
