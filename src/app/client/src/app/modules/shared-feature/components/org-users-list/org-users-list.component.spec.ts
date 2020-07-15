import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgUsersListComponent } from './org-users-list.component';

describe('OrgUserListComponent', () => {
  let component: OrgUsersListComponent;
  let fixture: ComponentFixture<OrgUsersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgUsersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
