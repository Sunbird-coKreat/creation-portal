import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgContriAdminComponent } from './org-contri-admin.component';

describe('OrgContriAdminComponent', () => {
  let component: OrgContriAdminComponent;
  let fixture: ComponentFixture<OrgContriAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgContriAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgContriAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
