import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService, UserService, LearnerService, PlayerService } from '@sunbird/core';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { forkJoin, iif, of, throwError } from 'rxjs';
import { SourcingService, HelperService } from '../../../sourcing/services';

@Component({
  selector: 'app-my-content',
  templateUrl: './my-content.component.html',
  styleUrls: ['./my-content.component.scss']
})
export class MyContentComponent implements OnInit, AfterViewInit {

  public telemetryPageId: string;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryImpression: IImpressionEventInput;
  public impressionEventTriggered: Boolean = false;
  public showLoader: Boolean = true;
  public contents: any = [];
  public publishedContents: any = [];
  public framework: any = [];
  public contributionDetails: any;
  public isExpanded: Boolean = false;
  public fwIdTypeMap: any = {};
  public publishedContentMap: any = {};
  public userMap: any = {};
  public _selectedTab: string;
  public selectedFrameworkType: any;
  public playerConfig: any;
  public totalContent: number;
  public totalPublishedContent: number;
  public contentCountData: any = {
    total: 0,
    published: 0,
    notPublished: 0
  };
  public selectedContributionDetails: any;
  public selectedContentDetails: any;
  public slectedContent: any;
  constructor(public resourceService: ResourceService, private actionService: ActionService,
    private userService: UserService, private configService: ConfigService,
    private activatedRoute: ActivatedRoute, private router: Router, private navigationHelperService: NavigationHelperService,
    private telemetryService: TelemetryService, private toasterService: ToasterService,
    private learnerService: LearnerService, private sourcingService: SourcingService,
    private playerService: PlayerService, private cd: ChangeDetectorRef, private helperService: HelperService) { }

  ngOnInit(): void {
    this.getPageId();
    this.telemetryInteractCdata = [{ id: this.userService.channel, type: 'sourcing_organization' }];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
    this.initialize();
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryInteractCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}.programs`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  public logTelemetryImpressionEvent(data: any, type: string) {
    // if (this.impressionEventTriggered) { return false; }
    // this.impressionEventTriggered = true;
    // const telemetryImpression = _.cloneDeep(this.telemetryImpression);
    // if (data && !_.isEmpty(data)) {
    //   telemetryImpression.edata.visits = _.map(data, (row) => {
    //     return { objid: _.toString(row['identifier']), objtype: type };
    //   });
    // } else {
    //   telemetryImpression.edata.visits = [];
    // }
    // this.telemetryService.impression(telemetryImpression);
  }

  initialize() {
    forkJoin([this.getContents(), this.getFrameworks()]).pipe(
      map(([contentRes, frameworkRes]: any) => {
        this.contents = _.compact(_.concat(_.get(contentRes, 'content'), _.get(contentRes, 'QuestionSet')));
        this.framework = _.get(frameworkRes, 'Framework');
        this.totalContent = _.get(contentRes, 'count') || 0;
        const contentIds = _.map(this.contents, (content => _.get(content, 'identifier')));
        return contentIds;
      }),
      mergeMap(contentIds => this.getOriginForApprovedContents(contentIds).pipe(
        map((contentRes: any) => {
          this.publishedContents = _.compact(_.concat(_.get(contentRes, 'content'), _.get(contentRes, 'QuestionSet')));
          this.totalPublishedContent = _.get(contentRes, 'count') || 0;
          const userIds =  _.compact(_.uniq(_.map(this.publishedContents, (content => _.get(content, 'lastPublishedBy')))));
          return userIds;
        }))),
      mergeMap(userIds => iif(() => !_.isEmpty(userIds),
          this.getUserProfiles(userIds).pipe(
            map((userRes: any) => {
              this.createUserMap(userRes);
              return userRes;
          })), of([]))
      ))
      .subscribe((response: any) => {
        console.log('userRes', response);
        this.prepareContributionDetails();
        this.showLoader = false;
      }, (err: any) => {
        this.showLoader = false;
      });
  }

  createUserMap(data): void {
    const users = _.get(data, 'response.content');
    _.forEach(users, (value) => {
      this.userMap[value.identifier] = !_.isEmpty(value.lastName) ? value.firstName + ' ' + value.lastName :
      value.firstName;
    });
  }

  prepareContributionDetails() {
    _.forEach(this.framework, (value) => {
      this.fwIdTypeMap[value.identifier] = value.type;
    });
    _.map(this.publishedContents, (value) => {
      this.publishedContentMap[value.origin] = {
        identifier: value.identifier,
        userId: value.lastPublishedBy
       };
    });
    const obj = {};
    _.forEach(this.contents, (value) => {
      value.origin = _.get(this.publishedContentMap[value.identifier], 'identifier');
      value.lastPublishedId = _.get(this.publishedContentMap[value.identifier], 'userId');
      value.publishBy = this.userMap[value.lastPublishedId];
      value.frameworkType = this.fwIdTypeMap[value.framework];
      value.isPublished = _.has(this.publishedContentMap, value.identifier);
      if (value && !_.isEmpty(value.frameworkType)) {
        obj[value.frameworkType] = obj[value.frameworkType] || {};
        obj[value.frameworkType] = {
          board: this.getUniqValue(obj[value.frameworkType], value, 'board'),
          gradeLevel: this.getUniqValue(obj[value.frameworkType], value, 'gradeLevel'),
          medium: this.getUniqValue(obj[value.frameworkType], value, 'medium'),
          subject: this.getUniqValue(obj[value.frameworkType], value, 'subject'),
          published: this.getPublishedContentCount(obj[value.frameworkType], value),
          notPublished: this.getNotPublishedContentCount(obj[value.frameworkType], value)
        };
      }
    });
    this.contributionDetails = obj;
    this.setContentCount(this.totalPublishedContent, (this.totalContent - this.totalPublishedContent ));
  }

  onCardClick(selectedCard: any) {
    this.selectedFrameworkType = selectedCard;
    const filteredContent = _.filter(this.contents, (content) => content.frameworkType === selectedCard.key);
    const obj = {};
    _.forEach(filteredContent, (content) => {
      const groupKey = content.board + '_' + content.medium + '_' + content.gradeLevel + '_' + content.subject;
      obj[groupKey] = obj[groupKey] || {};
      obj[groupKey] = {
        board: content.board,
        gradeLevel: content.gradeLevel,
        medium: content.medium,
        subject: content.subject,
        contents: obj[groupKey].contents ? [...obj[groupKey].contents, content] : _.castArray(content),
        published: this.getPublishedContentCount(obj[groupKey], content),
        notPublished: this.getNotPublishedContentCount(obj[groupKey], content)
      };
    });
    this.selectedContributionDetails = obj;
    this.setContentCount(this.selectedFrameworkType.value.published, this.selectedFrameworkType.value.notPublished);
    this.loadTabComponent('frameworkTab');
  }

  onFrameworkClick(selectedIndex: any) {
    this.selectedContentDetails = selectedIndex;
    this.setContentCount(selectedIndex.published, selectedIndex.notPublished);
    this.loadTabComponent('contentTab');
  }

  onPreview(content: any) {
    this.slectedContent = content;
    this.slectedContent.originPreviewUrl = this.helperService.getContentOriginUrl(this.slectedContent.origin);
    this.getConfigByContent(content.identifier);
  }

  onBack(): void {
    if (this._selectedTab === 'contentTab') {
      this.setContentCount(this.selectedFrameworkType.value.published, this.selectedFrameworkType.value.notPublished);
      this.loadTabComponent('frameworkTab');
    } else if (this._selectedTab === 'previewTab') {
      this.setContentCount(this.selectedContentDetails.published, this.selectedContentDetails.notPublished);
      this.loadTabComponent('contentTab');
    } else {
      this.setContentCount(this.totalPublishedContent, (this.totalContent - this.totalPublishedContent ));
      this.loadTabComponent(null);
    }
  }

  setContentCount(publishedCount: number, notPublishedCount: number) {
    this.contentCountData = {
      total: (publishedCount + notPublishedCount),
      published: publishedCount,
      notPublished: notPublishedCount
    };
  }

  loadTabComponent(tab: any) {
    this._selectedTab = tab;
  }

  getPublishedContentCount(value, content) {
    if (_.has(value, 'published')) {
      return content.isPublished ? (value.published + 1) : value.published;
    } else {
      return content.isPublished ? 1 : 0;
    }
  }

  getNotPublishedContentCount(value, content) {
    if (_.has(value, 'notPublished')) {
      return content.isPublished === false ? (value.notPublished + 1) : value.notPublished;
    } else {
      return content.isPublished === false ? 1 : 0;
    }
  }

  getUniqValue(value, defaultValue, category) {
    if (_.has(value, category)) {
      return _.compact(_.uniq([...value[category], ..._.castArray(defaultValue[category])]));
    } else {
      return _.castArray(defaultValue[category]);
    }
  }

  getContents() {
    const option = {
      url: 'composite/v3/search',
      data: {
        'request': {
          'filters': {
            'objectType': ['content', 'questionset'],
            'status': ['Live'],
            'createdBy': this.userService.userid,
            'mimeType': { '!=': 'application/vnd.ekstep.content-collection' },
            'contentType': { '!=': 'Asset' }
          },
          'exists': ['programId'],
          'not_exists': ['sampleContent'],
          'fields': [
            'name', 'status', 'framework', 'board', 'gradeLevel', 'medium',
            'subject', 'creator', 'mimeType', 'lastPublishedBy'],
          'limit': 1000
        }
      }
    };

    return this.actionService.post(option).pipe(map((res: any) => {
      return res.result;
    }), catchError(err => {
      const errInfo = {
        errorMsg: 'Something went wrong, try again later',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata: this.telemetryInteractCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  getOriginForApprovedContents(contentIds) {
    const option = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        request: {
          filters: {
            origin: contentIds
          },
          exists: ['originData'],
          fields: ['status', 'origin', 'lastPublishedBy'],
          limit: 1000
        }
      }
    };
    return this.learnerService.post(option).pipe(map((res: any) => {
      return res.result;
    }), catchError(err => {
      const errInfo = {
        errorMsg: 'Something went wrong, try again later',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata: this.telemetryInteractCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  getUserProfiles(identifier?: any) {
    const option = {
      url: 'user/v1/search',
      data: {
        request: {
          filters: {
            'identifier': identifier
          }
        }
      }
    };
    return this.learnerService.post(option).pipe(map((res: any) => {
      return res.result;
    }), catchError(err => {
      const errInfo = {
        errorMsg: 'Something went wrong, try again later',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata: this.telemetryInteractCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  getFrameworks() {
    const option = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'framework',
            'status': ['Live']
          },
          'fields': ['identifier', 'type'],
          'limit': 1000
        }
      }
    };
    return this.learnerService.post(option).pipe(map((res: any) => {
      return res.result;
    }), catchError(err => {
      const errInfo = {
        errorMsg: 'Something went wrong, try again later',
        telemetryPageId: this.telemetryPageId,
        telemetryCdata: this.telemetryInteractCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  getConfigByContent(contentId: string) {
    this.playerService.getConfigByContent(contentId).pipe(catchError(err => {
      const errInfo = {
        errorMsg: 'Unable to read the Content, Please Try Again',
        telemetryPageId: this.telemetryPageId, telemetryCdata: this.telemetryInteractCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env
      };
      return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe(config => {
      this.loadTabComponent('previewTab');
      this.playerConfig = config;
      this.playerConfig.context.pdata.pid = `${this.configService.appConfig.TELEMETRY.PID}`;
      this.playerConfig.context.cdata = this.telemetryInteractCdata;
      this.cd.detectChanges();
    });
  }

  onExpand(selectedIndex: number, category: string) {
    const divElement = (<HTMLInputElement>document.getElementById(`${category}List${selectedIndex}`));
    const btnElement = (<HTMLInputElement>document.getElementById(`${category}Btn${selectedIndex}`));
    divElement.classList.remove('d-none');
    btnElement.classList.add('d-none');
  }

}
