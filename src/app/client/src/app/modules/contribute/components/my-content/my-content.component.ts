import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService, UserService, LearnerService, PlayerService, ProgramsService } from '@sunbird/core';
import { ConfigService, ResourceService, NavigationHelperService , ToasterService} from '@sunbird/shared';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { forkJoin, iif, of, throwError } from 'rxjs';
import { SourcingService, HelperService } from '../../../sourcing/services';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';

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
  public showLoader = true;
  public contents: any = [];
  public publishedContents: any = [];
  public framework: any = [];
  public contributionDetails: any;
  public fwIdTypeMap: any = {};
  public publishedContentMap: any = {};
  public channelMap: any = {};
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
  public usageDetailsCount: any = {
    totalPlays: 0,
    averageRating: 0
  };
  public direction = 'asc';
  public sortColumn = '';
  public selectedContributionDetails: any;
  public selectedContentDetails: any;
  public slectedContent: any;
  private playerService: PlayerService;
  private helperService: HelperService;
  private configService: ConfigService;
  private sourcingService: SourcingService;
  private programsService: ProgramsService;
  private toasterService: ToasterService;
  private router: Router;
  private navigationHelperService: NavigationHelperService;
  constructor(public resourceService: ResourceService, private actionService: ActionService,
    private userService: UserService, private activatedRoute: ActivatedRoute,
    private learnerService: LearnerService, private cd: ChangeDetectorRef, public injector: Injector) {
      this.playerService = injector.get<PlayerService>(PlayerService);
      this.helperService = injector.get<HelperService>(HelperService);
      this.configService = injector.get<ConfigService>(ConfigService);
      this.sourcingService = injector.get<SourcingService>(SourcingService);
      this.programsService = injector.get<ProgramsService>(ProgramsService);
      this.navigationHelperService = injector.get<NavigationHelperService>(NavigationHelperService);
      this.router = injector.get<Router>(Router);
      this.toasterService = injector.get<ToasterService>(ToasterService);
     }

  ngOnInit(): void {
    this.getPageId();
    this.telemetryInteractCdata = [{ id: this.userService.channel, type: 'sourcing_organization' }];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
    this.initialize();
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          cdata: this.telemetryInteractCdata || [],
          env: this.activatedRoute.snapshot.data.telemetry.env,
          pdata: {
            id: this.userService.appId,
            pid: this.configService.appConfig.TELEMETRY.PID,
            ver: version
          }
        },
        edata: {
          pageid: this.getPageId(),
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  initialize() {
    forkJoin([this.getContents(), this.getFrameworks(), this.getAllTenantList()]).pipe(
      map(([contentRes, frameworkRes]: any) => {
        this.contents = _.compact(_.concat(_.get(contentRes, 'content'), _.get(contentRes, 'QuestionSet')));
        this.framework = _.get(frameworkRes, 'Framework');
        this.totalContent = _.get(contentRes, 'count') || 0;
        return _.map(this.contents, (content => _.get(content, 'identifier')));
      }),
      mergeMap(contentIds => iif(() => !_.isEmpty(contentIds),
        this.getOriginForApprovedContents(contentIds).pipe(
          map((contentRes: any) => {
            this.publishedContents = _.compact(_.concat(_.get(contentRes, 'content'), _.get(contentRes, 'QuestionSet')));
            this.totalPublishedContent = _.get(contentRes, 'count') || 0;
            return _.compact(_.uniq(_.map(this.publishedContents, (content => _.get(content, 'lastPublishedBy')))));
          })), of([]))),
      mergeMap(userIds => iif(() => !_.isEmpty(userIds),
        this.getUserProfiles(userIds).pipe(
          map((userRes: any) => {
            this.createUserMap(userRes);
            return userRes;
          })), of([]))
      ))
      .subscribe((response: any) => {
        this.prepareContributionDetails();
        this.showLoader = false;
      }, (err: any) => {
        this.showLoader = false;
        const errInfo = {
          errorMsg: 'Something went wrong, try again later',
          telemetryPageId: this.telemetryPageId,
          telemetryCdata: this.telemetryInteractCdata,
          env: this.activatedRoute.snapshot.data.telemetry.env,
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  createUserMap(data): void {
    const users = _.get(data, 'response.content');
    _.forEach(users, (value) => {
      this.userMap[value.identifier] = !_.isEmpty(value.lastName) ? value.firstName + ' ' + value.lastName :
        value.firstName;
    });
  }

  prepareContributionDetails() {
    if (_.isEmpty(this.contents)) { return; }
    _.forEach(this.framework, (value) => {
      this.fwIdTypeMap[value.identifier] = value.type;
    });
    _.map(this.publishedContents, (value) => {
      this.publishedContentMap[value.origin] = {
        identifier: value.identifier,
        userId: value.lastPublishedBy,
        lastPublishedOn: value.lastPublishedOn,
        publisher: value.publisher
      };
    });
    const obj = {};
    _.forEach(this.contents, (value) => {
      value.origin = _.get(this.publishedContentMap[value.identifier], 'identifier');
      value.lastPublishedId = _.get(this.publishedContentMap[value.identifier], 'userId');
      value.publishBy = this.userMap[value.lastPublishedId];
      value.frameworkType = this.fwIdTypeMap[value.framework];
      value.isPublished = _.has(this.publishedContentMap, value.identifier);
      value.lastPublishedOn = _.get(this.publishedContentMap[value.identifier], 'lastPublishedOn');
      value.publisher = _.get(this.publishedContentMap[value.identifier], 'publisher');
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

      if (value.isPublished) {
        // tslint:disable-next-line:max-line-length
        this.usageDetailsCount.totalPlays = value.me_totalPlaySessionCount ? (this.usageDetailsCount.totalPlays + this.getCountData(value, 'me_totalPlaySessionCount')) : this.usageDetailsCount.totalPlays;
        // tslint:disable-next-line:max-line-length
        this.usageDetailsCount.averageRating = value.me_averageRating ? (value.me_averageRating + this.usageDetailsCount.averageRating) : this.usageDetailsCount.averageRating;
      }

    });
    this.contributionDetails = obj;
    this.setContentCount(this.totalPublishedContent, (this.totalContent - this.totalPublishedContent));
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
    this.selectedContributionDetails = _.map(obj);
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
    this.slectedContent['totalViews'] = this.getCountData(content, 'me_totalPlaySessionCount');
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
      this.setContentCount(this.totalPublishedContent, (this.totalContent - this.totalPublishedContent));
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
      return _.compact(_.castArray(defaultValue[category]));
    }
  }

  sortCollection(column) {

    if (this._selectedTab === 'frameworkTab') {
      this.selectedContributionDetails = this.programsService.sortCollection(this.selectedContributionDetails, column, this.direction);
    } else if (this._selectedTab === 'contentTab') {
      // tslint:disable-next-line:max-line-length
      this.selectedContentDetails.contents = this.programsService.sortCollection(this.selectedContentDetails.contents, column, this.direction);
    }

    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  getAllTenantList() {
    return this.programsService.getAllTenantList().pipe(map(response => {
      const channel = _.get(response, 'result.content');
      _.forEach(channel, (value) => {
        this.channelMap[value.id] = value.orgName;
      });
    }));
  }

  getContents() {
    const isContributingOrgAdmin =  this.userService.isContributingOrgAdmin();
    const option = {
      url: `${this.configService.urlConFig.URLS.DOCKCONTENT.SEARCH}`,
      data: {
        request: {
          filters: {
            objectType: ['content', 'questionset'],
            status: ['Live'],
            ...(!isContributingOrgAdmin && { 'createdBy' : this.userService.userid }),
            ...(isContributingOrgAdmin && { 'organisationId' : _.get(this.userService, 'userProfile.userRegData.Org.osid')}),
            mimeType: { '!=': 'application/vnd.ekstep.content-collection' },
            contentType: { '!=': 'Asset' }
          },
          exists: ['programId'],
          not_exists: ['sampleContent'],
          fields: [
            'name', 'status', 'framework', 'board', 'gradeLevel', 'medium',
          'subject', 'creator', 'mimeType', 'lastPublishedBy', 'me_totalRatingsCount', 'me_averageRating',
          'me_totalTimeSpentInSec', 'me_totalPlaySessionCount', 'createdOn', 'primaryCategory', 'channel'],
          limit: 10000
        }
      }
    };

    return this.actionService.post(option).pipe(map((res: any) => {
      return res.result;
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
          fields: ['status', 'origin', 'lastPublishedBy', 'lastPublishedOn', 'publisher'],
          limit: 10000
        }
      }
    };
    return this.learnerService.post(option).pipe(map((res: any) => {
      return res.result;
    }));
  }

  getUserProfiles(identifier?: any) {
    const option = {
      url: 'user/v1/search',
      data: {
        request: {
          filters: {
            identifier: identifier
          }
        }
      }
    };
    return this.learnerService.post(option).pipe(map((res: any) => {
      return res.result;
    }));
  }

  getFrameworks() {
    const option = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        request: {
          filters: {
            objectType: 'framework',
            status: ['Live']
          },
          fields: ['identifier', 'type'],
          limit: 1000
        }
      }
    };
    return this.learnerService.post(option).pipe(map((res: any) => {
      return res.result;
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

  downloadReport() {
    const allContents = [];
    _.forEach(this.selectedContributionDetails, (value) => {
      allContents.push(...(value.contents ? value.contents : {}));
    });
    const csvDownloadConfig = {
      filename: 'Contributor-Content Usage Report',
      tableData: this.prepareContentUsageReportData(allContents),
      headers: this.contentUsageReportHeaders(),
      showTitle: false
    };
    if (_.get(this.contentCountData, 'published') && csvDownloadConfig.tableData.length) {
      this.programsService.generateCSV(csvDownloadConfig);
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.m0079);
    }
  }

  contentUsageReportHeaders() {
    return [
      'Content id', 'Content Name', 'Content Category', 'Content Mimetype', 'Created On', 'Created By',
      'Last Published Date', 'Publisher Organization', 'Total No of Plays', 'Average Play Time in mins',
      'Average Rating (Out of 5)', 'Board', 'Medium', 'Class', 'Subject'
    ];
  }

  prepareContentUsageReportData(contents) {
    const tableData = [];
    _.forEach(contents, (value) => {
        if (value.isPublished) {
          const obj = {
            'Content id' : value.identifier,
            'Content Name' : value.name,
            'Content Category' : value.primaryCategory,
            'Content Mimetype' : value.mimeType,
            'Created On' : value.createdOn,
            'Created By' : value.creator,
            'Last Published Date' : value.lastPublishedOn,
            'Publisher Organization' : _.get(this.channelMap, value.channel) || '',
            'Total No of Plays' : this.getCountData(value, 'me_totalPlaySessionCount'),
            'Average Play Time in mins' : Math.floor(this.getCountData(value, 'me_totalTimeSpentInSec') / 60),
            'Average Rating (Out of 5)' : value.me_averageRating ? value.me_averageRating : 0,
            'Board' : value.board ? value.board : '',
            'Medium' : value.medium ? value.medium : '',
            'Class' : value.gradeLevel ? value.gradeLevel : '',
            'Subject' : value.subject ? value.subject : '',
          };
          tableData.push(obj);
        }
    });
    return tableData;
  }

  getCountData(value, key) {
    let count = 0;
    if (_.get(value, `${key}.portal`)) {
      count += _.get(value, `${key}.portal`);
    }

    if (_.get(value, `${key}.app`)) {
      count += _.get(value, `${key}.app`);
    }
    return count;
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

}
