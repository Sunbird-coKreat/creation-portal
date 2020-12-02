import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionManagementComponent } from './collection-management.component';

describe('CollectionManagementComponent', () => {
  let component: CollectionManagementComponent;
  let fixture: ComponentFixture<CollectionManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
