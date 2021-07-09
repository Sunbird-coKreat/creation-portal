import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { mergeMap, skipWhile, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ServerResponse } from '../../interfaces/serverResponse';
import { Framework } from '../../interfaces/framework';
import { FrameworkData } from '../../interfaces/framework';
import { DataService } from '../data/data.service';
import { ConfigService } from '../config/config.service';
import { PublicDataService } from '../public-data/public-data.service';

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  private _organisationFramework: string;
  private _selectedOrganisationFramework: string;
  private _targetFrameworkIds: Array<any> =  [];
  private _frameworkData: FrameworkData = {};
  private _frameworkData$ = new BehaviorSubject<Framework>(undefined);
  public frameworkValues: any;
  public readonly frameworkData$: Observable<Framework> = this._frameworkData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));

    constructor(private dataService: DataService,
                private configService: ConfigService,
                private publicDataService: PublicDataService) { }

  public initialize(framework: string) {
    if (framework && _.get(this._frameworkData, framework)) {
      this.organisationFramework = framework;
      this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
    } else if (framework && !_.get(this._frameworkData, framework)) {
        this.organisationFramework = framework;
        this.getFrameworkCategories(framework).subscribe(
          (frameworkData: ServerResponse) => {
            this._frameworkData[framework] = frameworkData.result.framework;
            this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
          },
          err => {
            this._frameworkData$.next({ err, frameworkdata: null });
          });
      }
  }

  public getFrameworkCategories(framework: string) {
    const frameworkOptions = {
      url: `${this.configService.urlConFig.URLS.frameworkRead}${framework}`
    };
    return this.dataService.get(frameworkOptions);
  }

  public getTargetFrameworkCategories(frameworkIds: string) {
    _.forEach(frameworkIds, framework => {
      if (framework && _.get(this._frameworkData, framework)) {
        this.targetFrameworkIds = framework;
        this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
      } else {
        this.targetFrameworkIds = framework;
        this.getFrameworkCategories(framework).subscribe(
          (frameworkData: ServerResponse) => {
            this._frameworkData[framework] = frameworkData.result.framework;
            this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
          },
          err => {
            this._frameworkData$.next({ err, frameworkdata: null });
          });
      }
    });
  }

  public get targetFrameworkIds(): any {
    return this._targetFrameworkIds;
  }

  public set targetFrameworkIds(id: any) {
    _.uniq(_.compact(this._targetFrameworkIds.push(id)));
  }

  public get organisationFramework(): string {
    return this._organisationFramework;
  }

  public set organisationFramework(framework: string) {
    this._organisationFramework = framework;
  }

  public get selectedOrganisationFramework(): string {
    return this._selectedOrganisationFramework;
  }


  public set selectedOrganisationFramework(framework: string) {
    this._selectedOrganisationFramework = framework;
  }


  getFrameworkData(channel?, type?, identifier?, systemDefault?) {
    const option = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        request: {
            filters: {
                objectType: 'Framework',
                status: ['Live'],
                ...(type && {type}),
                ...(identifier && {identifier}),
                ...(channel && {channel}),
                ...(systemDefault && {systemDefault})
            }
        }
    }
      };
    return this.publicDataService.post(option);
  }
}
