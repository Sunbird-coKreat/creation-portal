import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash-es';
import { QuestionCursor } from '@project-sunbird/sunbird-quml-player';
import { EditorCursor } from '@project-sunbird/sunbird-questionset-editor';
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
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  removeQuestionMap(key) {
    sessionStorage.removeItem(key);
  }

  clearQuestionMap() {
    this.questionMap.clear();
  }

  getQuestionSet(identifier) {
    const hierarchy =  this.http.get('action/questionset/v2/hierarchy/' + identifier + '?mode=edit');
    const questionSet = this.http.get(`action/questionset/v2/read/${identifier}?fields=instructions,outcomeDeclaration`);
    return (
      forkJoin([hierarchy, questionSet]).pipe(
          map(res => {
            const questionSet = _.get(res[0], 'result.questionset');
            const { instructions, outcomeDeclaration } = _.get(res[1], 'result.questionset') || {};

            if (questionSet) {
                _.assign(questionSet, _.pickBy({ instructions, outcomeDeclaration }, _.identity));
            }
            return {questionSet};
          })
      ));
  }

  getAllQuestionSet(identifiers: string[]): Observable<any> {
    return of({});
  }

}
