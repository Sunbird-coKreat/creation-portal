import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TreeService } from '../tree/tree.service';

import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  data: any;

  constructor(public treeService: TreeService) { }

  save() {

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
