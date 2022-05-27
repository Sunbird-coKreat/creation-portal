import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { HomeFeedCardComponent } from './home-feed-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeFeedCardComponent', () => {
  let component: HomeFeedCardComponent;
  let fixture: ComponentFixture<HomeFeedCardComponent>;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule,SharedModule.forRoot()],
      declarations: [ HomeFeedCardComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HomeFeedCardComponent);
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
