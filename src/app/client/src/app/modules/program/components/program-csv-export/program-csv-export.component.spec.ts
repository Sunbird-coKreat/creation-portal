import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramCsvExportComponent } from './program-csv-export.component';

describe('ProgramCsvExportComponent', () => {
  let component: ProgramCsvExportComponent;
  let fixture: ComponentFixture<ProgramCsvExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramCsvExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramCsvExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
