import { TestBed } from "@angular/core/testing"
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { QuestionService } from './question.service';
import { ConfigService } from '../config/config.service';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { of } from 'rxjs';
import { PublicDataService } from '../public-data/public-data.service';
import { EditorService } from '../../services/editor/editor.service';
import { editorConfig } from './../../components/editor/editor.component.spec.data';


describe('QuestionService', () => {
    let questionService: QuestionService;
    let publicDataService: PublicDataService;

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
    const editorConfigStub = { 'editorConfig': editorConfig };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [QuestionService, HttpClient,
                { provide: ConfigService, useValue: configStub },
                { provide: EditorService, useValue: editorConfigStub }
            ]
        });
        questionService = TestBed.inject(QuestionService);
        publicDataService = TestBed.inject(PublicDataService);
    })

    it('should be created', () => {
        expect(questionService).toBeTruthy();
    });

    it('#readQuestion() it should read the question on API success', () => {
        const questionId = 'do_123';
        spyOn(publicDataService, 'get').and.returnValue(of({
            responseCode: 'OK'
        }));
        questionService.readQuestion(questionId).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    });

    it('#updateHierarchyQuestionCreate() it should update hierarchy on question create', () => {
        const hierarchyBody = {};
        spyOn(publicDataService, 'patch').and.returnValue(of({
            responseCode: 'OK'
        }));
        questionService.updateHierarchyQuestionCreate(hierarchyBody).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    });

    it('#updateHierarchyQuestionUpdate() it should update hierarchy on question update', () => {
        const hierarchyBody = {};
        spyOn(publicDataService, 'patch').and.returnValue(of({
            responseCode: 'OK'
        }));
        questionService.updateHierarchyQuestionUpdate(hierarchyBody).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    });

    it('#getAssetMedia() it should return assets on API success', () => {
        spyOn(publicDataService, 'post').and.returnValue(of({
            responseCode: 'OK'
        }));
        questionService.getAssetMedia().subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    });

    it('#createMediaAsset() it should create asset on API success', () => {
        spyOn(publicDataService, 'post').and.returnValue(of({
            responseCode: 'OK'
        }));
        questionService.createMediaAsset().subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    });

    it('#uploadMedia() it should upload asset on API success', () => {
        spyOn(publicDataService, 'post').and.returnValue(of({
            responseCode: 'OK'
        }));
        const req = {};
        const assetId = 'do_123';
        questionService.uploadMedia(req, assetId).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    })

    it('#generatePreSignedUrl() it should generate pre signed url on API success', () => {
        spyOn(publicDataService, 'post').and.returnValue(of({
            responseCode: 'OK'
        }));
        const req = {};
        const contentId = 'do_123';
        questionService.generatePreSignedUrl(req, contentId).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    })

    it('#getVideo() it should return video details on API success', () => {
        spyOn(publicDataService, 'get').and.returnValue(of({
            responseCode: 'OK'
        }));
        const videoId = 'do_123';
        questionService.getVideo(videoId).subscribe(data => {
            expect(data.responseCode).toEqual('OK');
        })
    })
})
