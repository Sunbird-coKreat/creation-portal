import { TestBed } from '@angular/core/testing';
import { FrameworkService } from './framework.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { DataService } from './../data/data.service';
import * as _ from 'lodash-es';
import { PublicDataService } from '../public-data/public-data.service';

describe('FrameworkService', () => {
  let frameworkService: FrameworkService;
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default,
    editorConfig: {
      'config': {
        'objectType': 'QuestionSet'
      }
    }
  };

  const frameworkMockData = {
    "responseCode": "OK",
    "result": {
      "framework": {
        "identifier": "ekstep_ncert_k-12",
        "code": "ekstep_ncert_k-12",
        "name": "Centre",
        "description": "Centre",
        "categories": [],
        "type": "K-12",
        "objectType": "Framework"
      }
    }
  };
  const framework = 'ekstep_ncert_k-12';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient, {
        provide: ConfigService, useValue: configStub
      }, DataService, PublicDataService]
    });
    frameworkService = TestBed.inject(FrameworkService);
    spyOn(frameworkService, 'getFrameworkCategories').and.returnValue(of(frameworkMockData));
    frameworkService.initialize(framework);
  });

  it('should be created', () => {
    expect(frameworkService).toBeTruthy();
  });

  it('#getFrameworkCategories() should return framework categories', () => {
    const dataService = TestBed.inject(DataService);
    spyOn(dataService, 'get').and.returnValue(of({ responseCode: 'OK' }))
    frameworkService.getFrameworkCategories(framework).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    })
  })

  it('#getTargetFrameworkCategories() should set target framework categories', () => {
    const frameworkIds = "nit_k-12";
    frameworkService.getTargetFrameworkCategories(_.castArray(frameworkIds));
    expect(frameworkService.targetFrameworkIds).toEqual(['nit_k-12'])
  });

  it('#organisationFramework should return framework value', () => {
    expect(frameworkService.organisationFramework).toEqual(framework);
  })

  it('#selectedOrganisationFramework should return selected org framework value', () => {
    frameworkService.selectedOrganisationFramework = framework;
    expect(frameworkService.selectedOrganisationFramework).toEqual(framework);
  })

  it('#getFrameworkData() should return framework data on API success', () => {
    const publicDataService: PublicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({ responseCode: 'OK' }));
    frameworkService.getFrameworkData().subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    })
  })
});