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
});
