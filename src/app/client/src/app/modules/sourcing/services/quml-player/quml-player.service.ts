import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash-es';
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player-v9';
import { EditorCursor } from '@samagra-x/sunbird-collection-editor-v9';
import { CsModule } from '@project-sunbird/client-services';
import { PublicPlayerService } from '@sunbird/public';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CsLibInitializerService } from './../../../../service/CsLibInitializer/cs-lib-initializer.service';
@Injectable({ providedIn: 'root' })

export class QumlPlayerService implements QuestionCursor, EditorCursor {
  private questionMap =  new Map();
  private contentCsService: any;
  constructor(public csLibInitializerService: CsLibInitializerService,
    public playerService: PublicPlayerService,
    private http: HttpClient) {
    if (!CsModule.instance.isInitialised) {
      this.csLibInitializerService.initializeCs();
    }
    this.contentCsService = CsModule.instance.contentService;
  }

  getQuestion(questionId: string): Observable<any> {
    if (_.isEmpty(questionId)) { return of({}); }
    const question = this.getQuestionData(questionId);
    if (question) {
        return of({questions : _.castArray(question)});
    } else {
        return this.contentCsService.getQuestionList(_.castArray(questionId));
    }
  }

  getQuestions(questionIds: string[]): Observable<any> {
    return this.contentCsService.getQuestionList(questionIds);
  }

  getQuestionData(questionId) {
    return this.questionMap.get(_.first(_.castArray(questionId))) || undefined;
  }

  setQuestionMap(key, value) {
    this.questionMap.set(key, value);
  }

  clearQuestionMap() {
    this.questionMap.clear();
  }

  getQuestionSet(identifier) {
    const hierarchy =  this.http.get('action/questionset/v1/hierarchy/' + identifier + '?mode=edit');
    const questionSet = this.http.get(`action/questionset/v1/read/${identifier}?fields=instructions`);
    return (
      forkJoin([hierarchy, questionSet]).pipe(
          map(res => {
              let questionSet =  _.get(res[0], 'result.questionSet');
              const instructions =  _.get(res[1], 'result.questionset.instructions');
              if (questionSet && instructions) {
                  // tslint:disable-next-line:no-unused-expression
                  questionSet['instructions'] = instructions;
              }
              return {questionSet};
          })
      ));
  }

  getAllQuestionSet(identifiers: string[]): Observable<any> {
    return of({});
  }

}
