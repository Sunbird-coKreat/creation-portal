import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private configService: ConfigService, private httpClient: HttpClient) { }

  /**
  * create question
  * @param questionMedataData
  */
 createQuestion(questionMedataData) {
  const data = {
    request: {
      question: {
        name: questionMedataData.name,
        parent: 'do_11225589712877977615', //hardcoded value need to change it later
        visibility: 'Parent',
        code: 'questionMedataData.code',
        mimeType: 'application/vnd.ekstep.qml-archive',
        contentType: 'Resource',
        metadata: questionMedataData
      }
    }
  };

  return this.httpClient.post(this.configService.urlConFig.URLS.QUESTION.CREATE, data);
  }
}
