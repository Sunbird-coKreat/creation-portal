import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkApprovalComponent } from './bulk-approval.component';

describe('BulkApprovalComponent', () => {
  let component: BulkApprovalComponent;
  let fixture: ComponentFixture<BulkApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
