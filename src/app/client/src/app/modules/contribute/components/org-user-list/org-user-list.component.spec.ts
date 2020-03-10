import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUserListComponent } from './org-user-list.component';

describe('OrgUserListComponent', () => {
  let component: OrgUserListComponent;
  let fixture: ComponentFixture<OrgUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
