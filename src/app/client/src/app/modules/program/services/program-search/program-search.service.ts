import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions, ConfigService, ToasterService, ServerResponse } from '@sunbird/shared';
import { ProgramsService } from '@sunbird/core';
import { Observable, throwError, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgramSearchService {

  constructor(private httpClient: HttpClient, private config: ConfigService, private programsService: ProgramsService) { }

  searchWithProgramId(reqBody): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: {
        'content-type': 'application/json',
      }
    };
    const option = {
      url: 'content/composite/v1/search',
      data: {
        request: reqBody
      }
    };
    return this.httpClient.post<any>(option.url, option.data, httpOptions).pipe(
      mergeMap((data: ServerResponse) => {
        if (data.responseCode !== 'OK') {
          return throwError(data);
        }
        return of(data);
      }));
  }

  getCollectionWithProgramId(req) {
       const reqBody = {
          filters: {
            programId: req.programId,
            objectType: 'content',
            status: req.status,
            contentType: 'Textbook'
          },
          fields: ['name', 'medium', 'gradeLevel', 'subject', 'chapterCount', 'acceptedContents', 'rejectedContents'],
          limit: 1000
        };
       return this.searchWithProgramId(reqBody);
  }

  getSampleContentWithProgramId(req) {
    const reqBody = {
          filters: {
            programId: req.programId,
            objectType: 'content',
            status: req.status,
            sampleContent: true
          },
          facets: [
            'sampleContent', 'collectionId', 'status'
        ],
        limit: 0
        };
      return  this.searchWithProgramId(reqBody);
  }

  getContributionWithProgramId(req) {
    const reqBody = {
          filters: {
            programId: req.programId,
            objectType: 'content',
            status: req.status,
            contentType: { '!=': 'Asset' },
            mimeType: { '!=': 'application/vnd.ekstep.content-collection' }
          },
          not_exists: ['sampleContent'],
          facets: ['status'],
        limit: 0
        };
      return  this.searchWithProgramId(reqBody);
  }

  getNominationWithProgramId(programId) {
    const req = {
      url: `${this.config.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: programId
          },
          facets: ['collection_ids', 'status']
        }
      }
    };
    return this.programsService.post(req);
  }
}
