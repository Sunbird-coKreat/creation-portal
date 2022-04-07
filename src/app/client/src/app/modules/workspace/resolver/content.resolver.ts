import { SearchService } from './../../core/services/search/search.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { reject } from 'lodash';

@Injectable()
export class ContentResolver implements Resolve<Promise<any>> {
  constructor(private searchService: SearchService) {

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const req = {
      "filters": {
        "objectType": [
          "Content"
        ],
        "status": []
      },
      "limit": 0,
      "facets": ["status"]
    };

    return this.searchService.compositeSearch(req);
  }
}

