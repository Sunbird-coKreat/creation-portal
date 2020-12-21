import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs';
import { PublicDataService } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private configService: ConfigService, public publicDataService: PublicDataService) { }

  /**
  * create question
  * @param questionMedataData
  */
  createQuestion(questionMedataData): Observable<ServerResponse> {
    const option = {
      url: `${this.configService.urlConFig.URLS.QUESTION.CREATE}`,
      'data': {
        'request': {
         'question': questionMedataData
        }
      }
      };
      return this.publicDataService.post(option);
  }

  addQuestionToQuestionSet(questionSetId, questionId): Observable<ServerResponse> {
    const option = {
      url: `${this.configService.urlConFig.URLS.QUESTION_SET.ADD}`,
      'data': {
        'request': {
          'questionSet' : {
            'rootId': questionSetId,
            'children' : [questionId]
             }
          }
        }
      };
      return this.publicDataService.patch(option);
  }

  readQuestion(questionId) {
    const filters = '?fields=body,answer,templateId,responseDeclaration,interactionTypes,interactions,name,solutions,editorState,media';
    const option = {
      url: `${this.configService.urlConFig.URLS.QUESTION.READ}/${questionId}${filters}`,
    };
    return this.publicDataService.get(option);
  }

  updateQuestion(questionMedataData, questionId): Observable<ServerResponse> {
    const option = {
      url: `${this.configService.urlConFig.URLS.QUESTION.UPDATE}/${questionId}`,
      'data': {
        'request': {
         'question': questionMedataData
        }
      }
      };
      return this.publicDataService.patch(option);
  }
}
