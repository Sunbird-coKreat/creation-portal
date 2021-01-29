import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopicPickerComponent } from './topic-picker.component';
import { FormsModule } from '@angular/forms';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { RouterTestingModule } from '@angular/router/testing';

describe('TopicPickerComponent', () => {
    let component: TopicPickerComponent;
    let fixture: ComponentFixture<TopicPickerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpClientTestingModule,RouterTestingModule],
            declarations: [ TopicPickerComponent ],
            providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TopicPickerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
