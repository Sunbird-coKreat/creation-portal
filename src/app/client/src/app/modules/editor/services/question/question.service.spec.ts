import { TestBed, inject } from '@angular/core/testing';
import { QuestionService } from './question.service';
import { CoreModule, PublicDataService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import * as mockData from './question.service.spec.data';
import { of as observableOf } from 'rxjs';
const testData = mockData.mockRes;
describe('QuestionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [CoreModule, SharedModule.forRoot()],
      providers: [QuestionService]
  }));

  it('should be created', () => {
    const service: QuestionService = TestBed.get(QuestionService);
    expect(service).toBeTruthy();
  });

  it('should call read question', inject([PublicDataService, QuestionService],
    ( publicDataService, questionService) => {
      spyOn(publicDataService, 'get').and.callFake(() => observableOf(testData.questionDetails));
      spyOn(questionService, 'readQuestion').and.callThrough();
      questionService.readQuestion('do_1131737393366138881132');
      expect(publicDataService.get).toHaveBeenCalled();
    }));

  it('should call create question', inject([PublicDataService, QuestionService],
    ( publicDataService, questionService) => {
      spyOn(publicDataService, 'post').and.callFake(() => observableOf(testData.questionCreateResponse));
      spyOn(questionService, 'createQuestion').and.callThrough();
      const questionMetadata = {
        'code': 'e7da75ba-02e5-7ccc-4b16-8b6391ffbfca',
        'body': '<p>question</p>',
        'answer': '<p>answer</p>',
        'status': 'Draft',
        'name': 'untitled SA',
        'mimeType': 'application/vnd.ekstep.qml-archive',
        'primaryCategory': 'Practice Question Set',
        'solutions': []
      };
      questionService.createQuestion(questionMetadata);
      expect(publicDataService.post).toHaveBeenCalled();
    }));

  it('should call update question', inject([PublicDataService, QuestionService],
    ( publicDataService, questionService) => {
      spyOn(publicDataService, 'patch').and.callFake(() => observableOf(testData.questionUpdateResponse));
      spyOn(questionService, 'updateQuestion').and.callThrough();
      const questionMetadata = {
        'body': '<p>question</p>',
        'answer': '<p>answer</p>',
        'name': 'untitled SA',
        'primaryCategory': 'Practice Question Set',
        'solutions': [{
          'id': 'dd1378c8-4244-6630-cb27-29b10787be28',
          'type': 'html',
          'value': '<p>solution</p>'
        }]
      };
      const questionId = 'do_1131772097929134081163';
      questionService.updateQuestion(questionMetadata, questionId);
      expect(publicDataService.patch).toHaveBeenCalled();
    }));

    it('should call add question to questionset', inject([PublicDataService, QuestionService],
      ( publicDataService, questionService) => {
        spyOn(publicDataService, 'patch').and.callFake(() => observableOf(testData.questionSetAdd));
        spyOn(questionService, 'addQuestionToQuestionSet').and.callThrough();
        const questionSetId = 'do_1131737119720488961123'
        const questionId = 'do_1131737393366138881132';
        questionService.addQuestionToQuestionSet(questionSetId, questionId);
        expect(publicDataService.patch).toHaveBeenCalled();
      }));
});
