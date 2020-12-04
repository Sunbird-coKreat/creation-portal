import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { TreeService } from '../tree/tree.service';
import { PublicDataService, UserService, ActionService, FrameworkService, ProgramsService } from '@sunbird/core';

import * as _ from 'lodash-es';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  data: any;
  public questionStream$ = new Subject<any>();
  constructor(public treeService: TreeService, public actionService: ActionService) { }

  fetchCollectionHierarchy(data): Observable<any> {
    const hierarchyUrl = 'content/v3/hierarchy/' + data.collectionId;
    const req = {
      url: hierarchyUrl,
      param: { 'mode': 'edit' }
    };
    return this.actionService.get(req).pipe(map((res: any) => _.get(res, 'result.content')));
  }

  save() {

  }

  public getQuestionStream$() {
    return this.questionStream$;
  }

  public publish(value: any) {
    this.questionStream$.next(value);
  }

  getCollectionHierarchy() {
    const instance = this;
    this.data = {};
    const data = this.treeService.getFirstChild();
    return {
      nodesModified: this.treeService.treeCache.nodesModified,
      hierarchy: instance._toFlatObj(data)
    };
  }

  _toFlatObj(data) {
    const instance = this;
    if (data && data.data) {
      instance.data[data.data.id] = {
        'name': data.title,
        'contentType': data.data.objectType,
        'children': _.map(data.children, (child) => {
          return child.data.id;
        }),
        'root': data.data.root
      };

      _.forEach(data.children, (collection) => {
        instance._toFlatObj(collection);
      });
    }

    return instance.data;
  }
}
