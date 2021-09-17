import { LearnerService } from './../learner/learner.service';
import { Injectable } from '@angular/core';
import { UserService  } from './../user/user.service';
import {
  ConfigService, ToasterService, ResourceService, ServerResponse, Framework, FrameworkData,
  BrowserCacheTtlService
} from '@sunbird/shared';
import { Observable, BehaviorSubject } from 'rxjs';
import { skipWhile, mergeMap } from 'rxjs/operators';
import { PublicDataService } from './../public-data/public-data.service';
import * as _ from 'lodash-es';
import { CacheService } from 'ng2-cache-service';
@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  private _frameworkData: FrameworkData = {};
  private _channelData: any = {};
  private _frameworkData$ = new BehaviorSubject<Framework>(undefined);
  private _channelData$ = new BehaviorSubject<any>(undefined);
  private _orgAndTargetFrameworkCategories: any;
  public orgFrameworkCategories: any;
  // tslint:disable-next-line:max-line-length
  public targetFrameworkCategories: any;

  public readonly frameworkData$: Observable<Framework> = this._frameworkData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  public readonly channelData$: Observable<any> = this._channelData$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));

  constructor(private cacheService: CacheService, private browserCacheTtlService: BrowserCacheTtlService,
    private userService: UserService, private configService: ConfigService,
    public toasterService: ToasterService, public resourceService: ResourceService,
    private publicDataService: PublicDataService, public learnerService: LearnerService
  ) { }

  public initialize(framework?: string, hashTagId?: string) {
    const channelKey =  hashTagId ? hashTagId : this.userService.hashTagId;
    const  channelData = this.cacheService.get(channelKey);
    const frameWorkKey = framework ? framework : _.get(channelData, 'defaultFramework');
    if (framework && _.get(this._frameworkData, framework)) {
      this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
      this._channelData$.next({ err: null, channelData: channelData });
      this._channelData = channelData;
    } else if ( frameWorkKey && this.cacheService.get(frameWorkKey)) {
      const data = this.cacheService.get(frameWorkKey);
      const frameWorkName = framework ? framework : 'defaultFramework';
      this._frameworkData[frameWorkName] = data;
      this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
      this._channelData$.next({ err: null, channelData: channelData });
      this._channelData = channelData;
    } else if (framework && !_.get(this._frameworkData, framework)) {
        if (_.isArray(framework)) {
          this.addUnlistedFrameworks(framework);
        } else {
          this.getFrameworkCategories(framework).subscribe(
            (frameworkData: ServerResponse) => {
              this.setFrameWorkData(frameworkData);
              const frameWorkName = framework ? framework : 'defaultFramework';
              this._frameworkData[frameWorkName] = frameworkData.result.framework;
              this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
            },
            err => {
              this._frameworkData$.next({ err: err, frameworkdata: null });
            });
        }
      } else if (!_.get(this._frameworkData, 'defaultFramework')) {
          this.getDefaultFrameWork(hashTagId ? hashTagId : this.userService.hashTagId)
            .pipe(mergeMap(data => {
              this.setChannelData(hashTagId ? hashTagId : this.userService.hashTagId, data);
              this._channelData = data.result.channel;
              this._channelData$.next({ err: null, channelData: this._channelData });
             return this.getFrameworkCategories(_.get(data, 'result.channel.defaultFramework'));
            })).subscribe(
              (frameworkData: ServerResponse) => {
               this.setFrameWorkData(frameworkData);
               const frameWorkName = framework ? framework : 'defaultFramework';
                this._frameworkData[frameWorkName] = frameworkData.result.framework;
                if (_.get(frameworkData, 'result.framework.identifier')) {
                  this._frameworkData[_.get(frameworkData, 'result.framework.identifier')] = frameworkData.result.framework;
                  }
                this._frameworkData$.next({ err: null, frameworkdata: this._frameworkData });
              },
              err => {
                this._frameworkData$.next({ err: err, frameworkdata: null });
              });
        }

    this.getMasterCategories();
  }

  public getChannelData(channelId) {
    const channelData = this.cacheService.get(channelId);
    if (!channelData) {
      this.getDefaultFrameWork(channelId).subscribe(data => {
        this._channelData$.next({ err: null, channelData: _.get(data, 'result.channel') });
        this.setChannelData(channelId, data);
      });
    } else {
      this._channelData$.next({ err: null, channelData: channelData });
    }
  }

  private getDefaultFrameWork(hashTagId) {
    const channelOptions = {
      url: this.configService.urlConFig.URLS.CHANNEL.READ + '/' + hashTagId
    };
    return this.learnerService.get(channelOptions);
  }
  public getFrameworkCategories(framework: string) {
    const frameworkOptions = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + framework
    };
    return this.learnerService.get(frameworkOptions);
  }

  private setFrameWorkData(framework?: any) {
    this.cacheService.set(framework.result.framework.code  , framework.result.framework,
      { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }

  private setChannelData(hashTagId, channelData) {
    this.cacheService.set(hashTagId ? hashTagId : this.userService.hashTagId , channelData.result.channel,
      { maxAge: this.browserCacheTtlService.browserCacheTtl });
  }
  public getCourseFramework() {
    const systemSetting = {
      url: this.configService.urlConFig.URLS.COURSE_FRAMEWORK.COURSE_FRAMEWORKID,
    };
    return this.learnerService.get(systemSetting);
  }

  public getDefaultLicense() {
    return _.get(this._channelData, 'defaultLicense');
  }

  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
  }

  public get frameworkData(): any {
    return this._frameworkData;
  }

  public addUnlistedFrameworks(unlistedframeworkIds) {
    const frameWork = this._frameworkData;
    _.forEach(unlistedframeworkIds, (value) => {
      if (!_.isUndefined(value)) {
        this.getFrameworkCategories(value).subscribe(
          (targetFrameworkData: ServerResponse) => {
            const otherFrameworkData = targetFrameworkData.result.framework;
            frameWork[value] = otherFrameworkData;
            this._frameworkData = frameWork ;
          },
          err => {
            console.log('err', err);
            const errInfo = { errorMsg: 'Something went wrong' };
            this.apiErrorHandling(err, errInfo);
          });
      }
    });
  }

  public get orgAndTargetFrameworkCategories(): any {
    return this._orgAndTargetFrameworkCategories;
  }

  public setOrgAndTargetFrameworkCategories() {
    // tslint:disable-next-line:max-line-length
    this._orgAndTargetFrameworkCategories = {
      'orgFrameworkCategories': this.orgFrameworkCategories,
      'targetFrameworkCategories': this.targetFrameworkCategories
    };
  }


  public getMasterCategories() {
    const option =  {
      url: this.configService.urlConFig.URLS.COMPOSITE.SEARCH,
      data: {
        'request' : {
        'filters': {
            'objectType': 'Category',
            'status': ['Live']
        },
        'exists': ['orgIdFieldName', 'targetIdFieldName'],
        'fields': ['code', 'identifier', 'orgIdFieldName', 'targetIdFieldName'],
        'limits': 300
      }
    }
    };

   const frameworkCategories$ =  this.learnerService.post(option);

  frameworkCategories$.subscribe((data: ServerResponse) => {
    const result = _.get(data, 'result.Category');
      this.orgFrameworkCategories = _.sortBy(_.map(result, category => {
        return {
          code: category.code,
          orgIdFieldName: category.orgIdFieldName
        };
      }), 'code');
      this.orgFrameworkCategories.unshift({
        code: 'framework',
        orgIdFieldName: 'framework'
      });

      this.targetFrameworkCategories = _.sortBy(_.map(result, category => {
        return {
          code: category.code,
          targetIdFieldName: category.targetIdFieldName
        };
      }), 'code');
      this.targetFrameworkCategories.unshift({
        code: 'targetFWIds',
        targetIdFieldName: 'targetFWIds'
      });

      this.setOrgAndTargetFrameworkCategories();
    });
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
    return this.learnerService.post(option);
  }
}
