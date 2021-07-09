import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { async, of } from 'rxjs';
import { PublicDataService } from '../public-data/public-data.service';
import { DataService } from '../data/data.service';

describe('HelperService', () => {
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default,
    editorConfig: { contentPrimaryCategories: [] }
  };
  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient,
        DataService,
        PublicDataService,
        { provide: ConfigService, useValue: configStub }
      ]
    });
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#channelInfo should return channel info', () => {
    spyOn(service, 'getLicenses').and.returnValue(of(
      {
        license: [{
          identifier: '458552951',
          name: '-458552951',
          status: 'Live'
        }]
      }));
    const channelId = '01309282781705830427';
    spyOn(service, 'getChannelData').and.returnValue(of({
      channel: {
        code: '01309282781705830427',
        contentPrimaryCategories: ['Course Assessment', 'eTextbook']
      }
    }));
    service.initialize(channelId);
    expect(service.channelInfo).toBeTruthy();
  });

  it('#contentPrimaryCategories should return primary categories', () => {
    expect(service.contentPrimaryCategories).toBeTruthy();
  });

  it('#getLicenses() should return license on API success', async () => {
    const publicDataService: PublicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of(
      {
        result: {
          license: [{
            identifier: '458552951',
            name: '-458552951',
            status: 'Live'
          }]
        }
      }));
    service.getLicenses().subscribe(data => {
      expect(data.license).toBeTruthy();
    });
  });

  it('#getAvailableLicenses should be truthy', () => {
    expect(service.getAvailableLicenses).toBeTruthy();
  });

  it('#getChannelData should be truthy', () => {
    const dataService: DataService = TestBed.inject(DataService);
    spyOn(dataService, 'get').and.returnValue(of({
      result: {
        channel: {
        }
      }
    }));
    const channelId = '01309282781705830427';
    service.getChannelData(channelId).subscribe(data => {
      expect(data).toBeTruthy();
    });
  });

  it('#channelData should be truthy', () => {
    expect(service.channelData).toBeTruthy();
  });

  it('#hmsToSeconds() should convert and return seconds', () => {
    const result = service.hmsToSeconds('10:10:10');
    expect(result).toEqual('36610');
  });

  it('#getTimerFormat() should return timer format', ()=> {
    const result = service.getTimerFormat({});
    expect(result).toEqual('HH:mm:ss');
  });

  it('#getAllUser() should call publicDataService.post()', () => {
    const publicDataService: PublicDataService = TestBed.inject(PublicDataService);
    const userSearchBody = {
      request: {
        filters: {
            'organisations.roles': 'CONTENT_CREATOR',
            rootOrgId: '12345'
        }
      }
    };
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    spyOn(service, 'getAllUser').and.callThrough();
    service.getAllUser(userSearchBody);
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('#updateCollaborator() should call publicDataService.patch()', () => {
    const publicDataService: PublicDataService = TestBed.inject(PublicDataService);
    spyOn(publicDataService, 'patch').and.returnValue(of({}));
    spyOn(service, 'updateCollaborator').and.callThrough();
    service.updateCollaborator('do_12345', ['12345']);
    expect(publicDataService.patch).toHaveBeenCalled();
  });
});
