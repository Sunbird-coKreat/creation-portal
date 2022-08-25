import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FullPageModalComponent } from './full-page-modal.component';

describe('FullPageModalComponent', () => {
  let component: FullPageModalComponent;
  let fixture: ComponentFixture<FullPageModalComponent>;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [ FullPageModalComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(FullPageModalComponent);
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
