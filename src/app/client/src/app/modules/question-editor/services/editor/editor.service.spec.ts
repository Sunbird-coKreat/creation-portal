import { DataService } from './../data/data.service';
import { editorConfig } from './../../components/editor/editor.component.spec.data';
import { TestBed } from '@angular/core/testing';
import { EditorService } from './editor.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { of } from 'rxjs';
import { PublicDataService } from '../public-data/public-data.service';


describe('EditorService', () => {
  let editorService: EditorService;
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient,
        DataService,
        PublicDataService,
        { provide: ConfigService, useValue: configStub }]
    });
    editorService = TestBed.get(EditorService);
    editorService.initialize(editorConfig);
  });

  it('should be created', () => {
    const service: EditorService = TestBed.get(EditorService);
    expect(service).toBeTruthy();
  });

  it('#selectedChildren() it should return set values only', ()=> {
    editorService.selectedChildren = {
      primaryCategory: 'Course Unit',
      mimeType: 'application/vnd.ekstep.content-collection',
      interactionType: null
    };
    expect(editorService.selectedChildren).toEqual({
      primaryCategory: 'Course Unit',
      mimeType: 'application/vnd.ekstep.content-collection'
    });
    editorService.selectedChildren = {
      primaryCategory: 'Course Unit',
      mimeType: 'application/vnd.ekstep.content-collection',
      interactionType: 'test'
    };
    expect(editorService.selectedChildren).toEqual({
      primaryCategory: 'Course Unit',
      mimeType: 'application/vnd.ekstep.content-collection',
      interactionType: 'test'
    });
  });

  it('#editorConfig should return editor config', ()=> {
    expect(editorService.editorConfig).toBeTruthy();
  });

  it('it should return #editorMode = edit', ()=> {
    expect(editorService.editorMode).toEqual('edit');
  });

  it('it should return #contentPolicyUrl', ()=> {
    expect(editorService.contentPolicyUrl).toEqual('/term-of-use.html');
  });

  it('#getToolbarConfig should return toolbar config', ()=> {
    const result = editorService.getToolbarConfig();
    expect(result).toBeTruthy();
  });

  it('#emitshowLibraryPageEvent() should call #showLibraryPage.emit event', ()=> {
    spyOn(editorService.showLibraryPage, 'emit');
    editorService.emitshowLibraryPageEvent('test');
    expect(editorService.showLibraryPage.emit).toHaveBeenCalledWith('test');
  });

  it('#contentsCountAddedInLibraryPage() should increase value of contentsCount', () => {
    const service: EditorService = TestBed.get(EditorService);
    service.contentsCount = 0;
    service.contentsCountAddedInLibraryPage(undefined);
    expect(service.contentsCount).toBe(1);
  });

  it('#contentsCountAddedInLibraryPage() should set value of contentsCount to zero', () => {
    const service: EditorService = TestBed.get(EditorService);
    service.contentsCount = 2;
    service.contentsCountAddedInLibraryPage(true);
    expect(service.contentsCount).toBe(0);
  });

  it('#getshowLibraryPageEmitter() should return event emitter object', ()=> {
    const result: EventEmitter<number> = editorService.getshowLibraryPageEmitter();
    expect(result).toBeTruthy();
  });

  it('#getQuestionList() should return question list', async()=> {
    const questionIds: string[] = [
      "do_11330103476396851218",
      "do_113301035530600448110"
    ];
    const dataService = TestBed.get(DataService);
    spyOn(dataService, 'post').and.returnValue(of({
      "id": "api.questions.list",
      "result": {
        "questions": [
        ],
        "count": 0
      }
    }));
    editorService.getQuestionList(questionIds).subscribe(data => {
      expect(data.questions).toBeTruthy();
    });
  });

  it('#fetchCollectionHierarchy() should return collection hierarchy', async()=> {
    const collectionId = 'do_11330102570702438417';
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of({"responseCode": "OK"}));
    editorService.fetchCollectionHierarchy(collectionId).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#readQuestionSet() should return question set', async()=> {
    const questionSetId = 'do_11330102570702438417';
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of({"responseCode": "OK"}));
    editorService.readQuestionSet(questionSetId).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#fetchContentDetails() should return content details', async()=> {
    const contentId = 'do_113297001817145344190';
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'get').and.returnValue(of({"responseCode": "OK"}));
    editorService.fetchContentDetails(contentId).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#updateHierarchy() should update hierarchy', async()=> {
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(editorService, 'getCollectionHierarchy').and.callFake(()=>{
      return {
        "id": "api.content.hierarchy.get",
        "ver": "3.0",
        "ts": "2021-06-29T09:17:27ZZ",
        "responseCode": "OK",
        "result": {
          "content": {}
        }
      };
    })
    spyOn(publicDataService, 'patch').and.returnValue(of({"responseCode": "OK"}));
    editorService.updateHierarchy().subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#reviewContent() should update hierarchy', async()=> {
    const contentId = 'do_11326714211239526417';
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({"responseCode": "OK"}));
    editorService.reviewContent(contentId).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#submitRequestChanges() should submit change request', async()=> {
    const contentId = 'do_11326714211239526417';
    const comment = 'No appropriate description'
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({"responseCode": "OK"}));
    editorService.submitRequestChanges(contentId, comment).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#publishContent() should publish content when API success', async()=> {
    const contentId = 'do_11326714211239526417';
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({"responseCode": "OK"}));
    editorService.publishContent(contentId).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#addResourceToHierarchy() should add resouce to hierarchy when API success', async()=> {
    const collection = 'do_11326714211239526417';
    const unitIdentifier = 'do_11326714211239526417';
    const contentId = 'do_11326714211239526417';
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'patch').and.returnValue(of({"responseCode": "OK"}));
    editorService.addResourceToHierarchy(collection, unitIdentifier, contentId).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#getCategoryDefinition() should return #objectCategoryDefinition when API success ', async()=> {
    const categoryName = 'objectMetadata';
    const channel = 'forms';
    const objectType = 'name';
    const publicDataService = TestBed.get(PublicDataService);
    spyOn(publicDataService, 'post').and.returnValue(of({"responseCode": "OK"}));
    editorService.getCategoryDefinition(categoryName, channel, objectType).subscribe(data => {
      expect(data.responseCode).toEqual('OK');
    });
  });

  it('#checkIfContentsCanbeAdded() should return true', ()=> {
    editorService.contentsCount = 0;
    spyOn(editorService, 'getContentChildrens').and.callFake(() => []);
    let result = editorService.checkIfContentsCanbeAdded();
    expect(editorService.getContentChildrens).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('#checkIfContentsCanbeAdded() should return false', ()=> {
    editorService.contentsCount = 0;
    spyOn(editorService, 'getContentChildrens').and.callFake(() => [1,2,3,4,5,6,7,8,9,10]);
    let result = editorService.checkIfContentsCanbeAdded();
    expect(editorService.getContentChildrens).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
