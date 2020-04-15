import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { ServerResponse } from '@sunbird/shared';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { ContentService } from '../content/content.service';

@Injectable({
  providedIn: 'root'
})
export class EnrollContributorService {

  // constructor() { }
  public config: ConfigService;
  baseUrl: string;

  constructor(private contentService: ContentService) {
    }
    saveData(option) {
    return this.contentService.post(option).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.params.status !== 'SUCCESSFUL') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
     }

     enrolment(Details) {
      const option = {
        url: 'reg/add',
        data:
        {
          id : 'open-saber.registry.create',
          request: Details
        }
      };
      return this.saveData(option);
    }
}
