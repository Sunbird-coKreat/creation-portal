import { InterpolatePipe } from './../../pipes';
import { ComponentFixture, TestBed,  } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { InstallAppComponent } from './install-app.component';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services';
import { CacheService } from '../../../shared/services/cache-service/cache.service';

describe('InstallAppComponent', () => {
    let comp: InstallAppComponent;
    let fixture: ComponentFixture<InstallAppComponent>;


    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [ InstallAppComponent, InterpolatePipe ],
            providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
            schemas: [NO_ERRORS_SCHEMA]
          })
          .compileComponents();
        fixture = TestBed.createComponent(InstallAppComponent);
        comp = fixture.componentInstance;
    });
    afterEach(() => {
        fixture.destroy();
      });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('showPopUp defaults to: true', () => {
        expect(comp.showPopUp).toEqual(true);
    });
    it(' makes expected calls to   navigateToLibrary', () => {
      spyOn(comp, 'closePopUp');
      comp.navigateToLibrary();
      expect(comp.closePopUp).toHaveBeenCalled();
  });
});
