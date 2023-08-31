import { ComponentFixture, TestBed,  } from '@angular/core/testing';

import { BulkUploadComponent } from './bulk-upload.component';

xdescribe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;

  afterEach(() => {
    fixture.destroy();
  });


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
