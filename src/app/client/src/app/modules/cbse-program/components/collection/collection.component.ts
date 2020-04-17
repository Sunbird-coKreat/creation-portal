import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ConfigService, UtilService, ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { PublicDataService, ContentService, UserService, ProgramsService, LearnerService, ActionService  } from '@sunbird/core';
import * as _ from 'lodash-es';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CbseProgramService, CollectionHierarchyService} from '../../services';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { ISessionContext, IChapterListComponentInput } from '../../interfaces';
import { InitialState } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy {

  @Input() collectionComponentInput: any;
  @Output() isCollectionSelected  = new EventEmitter<any>();
  public sessionContext: ISessionContext = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public programContext: any;
  public userProfile: any;
  public sharedContext: any = {};
  public collectionComponentConfig: any;
  public stageSubscription: any;
  public filteredList: Array<any>;
  public collection;
  public collectionsWithCardImage;
  public role: any = {};
  public collectionList: any = [];
  public tempSortCollectionList: any = [];
  public direction = 'asc';
  public sortColumn = '';
  public mediums;
  public showError = false;
  public classes;
  public board;
  public filters;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public nominateButton = 'hide';
  public nominate = '';
  public programContentTypes: string;
  isMediumClickable = false;
  showLoader = true;
  selectedIndex = -1;
  activeFilterIndex = -1;
  public state: InitialState = {
    stages: []
  };
  public activeDate = '';
  public showStage;
  public currentStage: any;
  public contentType:any;
  public sampleDataCount = 0;
  public chapterCount = 0;
  public currentNominationStatus: any;
  public nominationDetails: any;
  showContentTypeModal = false;
  selectedContentTypes = [];
  selectedCollectionIds = [];
  public currentUserID;
  _slideConfig = {'slidesToShow': 10, 'slidesToScroll': 1, 'variableWidth': true};
  public preSavedContentTypes = [];

  constructor(private configService: ConfigService, public publicDataService: PublicDataService,
    public actionService: ActionService,
    private cbseService: CbseProgramService, private collectionHierarchyService: CollectionHierarchyService,
    public programStageService: ProgramStageService, public resourceService: ResourceService,
    public programTelemetryService: ProgramTelemetryService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    public utilService: UtilService, public contentService: ContentService,
    private activatedRoute: ActivatedRoute, private router: Router, public learnerService: LearnerService,
    private programsService: ProgramsService, private toasterService: ToasterService) {
     }

  ngOnInit() {
    this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.currentUserID = this.userService.userProfile.userId;
    this.programStageService.addStage('collectionComponent');
    this.currentStage = 'collectionComponent';
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.collectionComponentConfig = _.get(this.collectionComponentInput, 'config');
    this.programContext = _.get(this.collectionComponentInput, 'programContext');
    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: this.getSharedContextObjectProperty(context)};
    }, {});
    this.contentType = _.filter(this.programsService.contentTypes, (type) => {
      return _.includes(_.get(this.programContext, 'content_types'), type.value);
    });
    this.sessionContext = _.assign(this.collectionComponentInput.sessionContext, {
      // currentRole: _.get(this.programContext, 'userDetails.roles[0]'),
      bloomsLevel: _.get(this.programContext, 'config.scope.bloomsLevel'),
      programId: _.get(this.programContext, 'programId'),
      program: _.get(this.programContext, 'name'),
      onBoardSchool: _.get(this.programContext, 'userDetails.onBoardingData.school'),
      collectionType: _.get(this.collectionComponentConfig, 'collectionType'),
      collectionStatus: _.get(this.collectionComponentConfig, 'status')
    }, this.sharedContext);
    if (this.userProfile.userRegData && this.userProfile.userRegData.User_Org) {
      this.sessionContext.currentRole = this.userProfile.userRegData.User_Org.roles[0] === 'admin' ? 'CONTRIBUTOR' : 'REVIEWER';
    }
    this.filters = this.getImplicitFilters();

    const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
    this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    this.sessionContext.programId = this.programContext.program_id;
    this.role.currentRole = this.sessionContext.currentRole;
    this.classes = _.find(this.collectionComponentConfig.config.filters.explicit, {'code': 'gradeLevel'}).range;
    this.mediums = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'medium'}).defaultValue;
    this.board = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'board'}).defaultValue;
    (_.size(this.mediums) > 1) ? this.isMediumClickable = true : this.isMediumClickable = false;

    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.collectionComponentInput.programContext.program_id, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID + '.programs');
    this.programContentTypes = this.programsService.getContentTypesName(this.programContext.content_types);
    this.setActiveDate();
    this.getNominationStatus();
    this.getCollectionCard();
  }

  sortCollection(column) {
    this.collectionList = this.programsService.sortCollection(this.tempSortCollectionList, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  getImplicitFilters(): string[] {
    const sharedContext = this.collectionComponentInput.programContext.config.sharedContext,
    implicitFilter = this.collectionComponentConfig.config.filters.implicit,
    availableFilters = this.filterByCollection(implicitFilter, 'code', sharedContext);
    return availableFilters;
  }

  filterByCollection(collection: any[], filterBy: any, filterValue: any[]) {
    return collection.filter( (el) => {
      return filterValue.some((f: any) => {
        if ( _.isArray(el[filterBy])) {
          return f === _.intersectionBy(el[filterBy], filterValue).toString();
        } else {
          return el[filterBy].includes(f);
        }
      });
    });
  }

  getCollectionCard() {
    this.searchCollection().subscribe((res) => {
      const { constantData, metaData, dynamicFields } = this.configService.appConfig.LibrarySearch;
      const filterArr = _.groupBy(res.result.content, 'identifier');
      const filteredTextbook = this.filterTextBook(filterArr);
      const collectionCards = this.utilService.getDataForCard(filteredTextbook, constantData, dynamicFields, metaData);
      this.collectionsWithCardImage = _.forEach(collectionCards, collection => this.addCardImage(collection));
      this.filterCollectionList(this.classes);
      if (!_.isEmpty(res.result.content)) {
        const collectionIds = _.map(res.result.content, 'identifier');
        this.collectionHierarchyService.getCollectionHierarchy(collectionIds)
          .subscribe(response => {
            const hierarchies = _.map(response, r => {
              if (r.result && r.result.content) {
                return r.result.content;
              } else {
                return r.result;
              }
            });
            _.forEach(hierarchies, hierarchy => {
              this.collectionHierarchyService.sampleDataCount = 0;
              this.collectionHierarchyService.chapterCount = 0;
              // tslint:disable-next-line:max-line-length
              const {sampleDataCount, chapterCount} = this.collectionHierarchyService.getSampleContentStatusCount(hierarchy, this.currentUserID);
              hierarchy.sampleContentCount = sampleDataCount;
              hierarchy.chapterCount = chapterCount;
            });
            this.selectedCollectionIds = [];
            this.collectionList = _.map(res.result.content, content => {
              const contentWithHierarchy =  _.find(hierarchies, {identifier: content.identifier});
              content.chapterCount = contentWithHierarchy.chapterCount;
              // tslint:disable-next-line:max-line-length
              if (contentWithHierarchy.sampleContentCount > 0) {
                content.sampleContentCount = contentWithHierarchy.sampleContentCount;
                this.selectedCollectionIds.push(contentWithHierarchy.identifier);
              }
              return content;
            });
            this.tempSortCollectionList = this.collectionList;
            this.selectedCollectionIds = _.uniq(this.selectedCollectionIds);
            this.toggleNominationButton();
        });

      }
      this.showLoader = false;
      this.showError = false;
    });
  }


  filterTextBook(filterArr) {
    const filteredTextbook = [];
    _.forEach(filterArr, (collection) => {
      if (collection.length > 1) {
        const groupedCollection = _.find(collection, (item) => {
          return item.status === 'Draft';
        });
        filteredTextbook.push(groupedCollection);
      } else {
        filteredTextbook.push(collection[0]);
      }
    });
    return filteredTextbook;
  }


  setAndClearFilterIndex(index: number) {
    if (this.activeFilterIndex === index && this.selectedIndex >= 0)  {
      this.filterCollectionList(this.classes);
      this.selectedIndex =  -1;
    } else {
      this.selectedIndex = this.activeFilterIndex  = index;
    }
  }

  filterCollectionList(filterValue?: any, filterBy = 'gradeLevel') {
    let filterValueItem: any[];
    if (_.isArray(filterValue)) {
      filterValueItem = filterValue;
    } else {
      const filterArray = [];
      filterArray.push(filterValue);
      filterValueItem = filterArray;
    }
    this.filteredList = this.filterByCollection(this.collectionsWithCardImage, filterBy, filterValueItem);
  }

  getSharedContextObjectProperty(property) {
    if (property === 'channel') {
       return _.get(this.programContext, 'config.scope.channel');
    } else if ( property === 'topic' ) {
      return null;
    } else {
      const filters =  this.collectionComponentConfig.config.filters;
      const explicitProperty =  _.find(filters.explicit, {'code': property});
      const implicitProperty =  _.find(filters.implicit, {'code': property});
      return (implicitProperty) ? implicitProperty.range || implicitProperty.defaultValue :
       explicitProperty.range || explicitProperty.defaultValue;
    }
  }

  objectKey(obj) {
    return Object.keys(obj);
  }
  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage  = _.last(this.state.stages).stage;
    }
    if (this.sessionContext && this.programContext && this.currentStage === 'collectionComponent') {
      this.getNominationStatus();
      this.getCollectionCard();
    }
   }

  searchCollection() {
    const req = {
      url : `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        request: {
          filters: {
            objectType: 'content',
            programId: this.sessionContext.programId || this.programContext.program_id,
            status: this.sessionContext.collectionStatus || ['Draft', 'Live'],
            contentType: this.sessionContext.collectionType || 'Textbook'
          }
        }
      }
    };
    return this.contentService.post(req)
      .pipe(
        catchError(err => {
          const errInfo = { errorMsg: 'Question creation failed' };
          this.showLoader = false;
          this.showError = true;
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  addCardImage(collection) {
    collection.cardImg = collection.image;
    return collection;
  }


  checkArrayCondition(param) {
    // tslint:disable-next-line:max-line-length
    this.sharedContext[param] = _.isArray(this.sharedContext[param]) ? this.sharedContext[param] : _.split(this.sharedContext[param], ',');
  }

  viewMoreClickHandler(event) {
    console.log(event);
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }

  ChangeUploadStatus(rowId) {
    this.nominate = rowId;
    this.nominate = 'uploadSample';
    // this.uploadSample = 'uploadSample';
  }

  nominationChecked(rowId) {
    if (_.includes(this.selectedCollectionIds, rowId)) {
      _.remove(this.selectedCollectionIds, (data) => {
        return data === rowId;
      });
    } else {
      this.selectedCollectionIds.push(rowId);
    }
    this.toggleNominationButton();
  }


  toggleNominationButton() {
    if (this.selectedCollectionIds.length > 0) {
      this.nominateButton = 'show';
    } else {
      this.nominateButton = 'hide';
    }
  }

  toggle(item: any) {
    if (_.includes(this.selectedContentTypes, item.value)) {
      _.remove(this.selectedContentTypes, (data) => {
        return data === item.value;
      });
    } else {
      this.selectedContentTypes.push(item.value);
    }
   this.markSelectedContentTypes();
  }

  markSelectedContentTypes() {
    this.contentType = _.map(this.contentType, (type) => {
      if (_.includes(this.selectedContentTypes, type.value)) {
         type['isSelected'] = true;
      } else {
        type['isSelected'] = false;
      }
      return type;
  });
  }

  uploadSample(event, collection) {
    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: collection[context] || this.sharedContext[context]};
    }, this.sharedContext);

    _.forEach(['gradeLevel', 'medium', 'subject'], (val) => {
       this.checkArrayCondition(val);
    });
    this.sessionContext = _.assign(this.sessionContext, this.sharedContext);
    this.sessionContext.collection =  collection.metaData.identifier;
    this.sessionContext.collectionName = collection.name;
    this.collection = collection;
    this.chapterListComponentInput = {
      sessionContext: this.sessionContext,
      collection: this.collection,
      config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.chapterList'}),
      programContext: this.programContext,
      role: this.role
    };
    this.programStageService.addStage('chapterListComponent');
    this.isCollectionSelected.emit(collection.metaData.identifier ? true : false);
  }

  addNomination() {
    this.showContentTypeModal = false;
    let creator = this.userService.userProfile.firstName;
    if (!_.isEmpty(this.userService.userProfile.lastName)) {
      creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
    }
    // check nomination available
    const request = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
          program_id: this.activatedRoute.snapshot.params.programId,
          user_id: this.userService.userProfile.userId
          }
        }
      }
    };
    this.programsService.post(request).subscribe((res) => {
      const req = {
        url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_UPDATE}`,
        data: {
          request: {
            program_id: this.activatedRoute.snapshot.params.programId,
            user_id: this.userService.userProfile.userId,
            status: 'Pending',
            content_types: this.selectedContentTypes,
            collection_ids: this.selectedCollectionIds,
            updatedby: creator
          }
        }
      };
       if (res.result && res.result.length) {
        this.programsService.post(req).subscribe((data) => {
          this.toasterService.success('Nomination sent');
          this.router.navigateByUrl('/contribute/myenrollprograms');
        }, error => {
          this.toasterService.error('Nomination submit failed... Please try later');
        });
       } else {
        req['url'] = `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_ADD}`;
        req.data.request['status'] = 'Pending';
        req.data.request['createdby'] = creator;
        if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
          req.data.request['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
        }
        this.programsService.post(req).subscribe((data) => {
          this.toasterService.success('Nomination sent');
          this.router.navigateByUrl('/contribute/myenrollprograms');
        }, error => {
          this.toasterService.error('Nomination submit failed... Please try later');
        });
       }
    });
  }
  setActiveDate() {
    const dates = [ 'nomination_enddate', 'shortlisting_enddate', 'content_submission_enddate', 'enddate'];

    dates.forEach(key => {
      const date  = moment(moment(this.programContext[key]).format('YYYY-MM-DD'));
      const today = moment(moment().format('YYYY-MM-DD'));
      const isFutureDate = !date.isSame(today) && date.isAfter(today);

      if (key === 'nomination_enddate' && isFutureDate) {
        this.activeDate = key;
      }

      if (this.activeDate === '' && isFutureDate) {
        this.activeDate = key;
      }
    });
  }

  expressInterest(apiCall) {
    const userProfile = this.userService.userProfile;
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_ADD}`,
      data: {
        request: {
          program_id: this.activatedRoute.snapshot.params.programId,
          user_id: this.userService.userProfile.userId,
          status: 'Initiated',
          content_types: this.selectedContentTypes || null
        }
      }
    };
    if (apiCall === 'update') {
      req['url'] = `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_UPDATE}`;
    }
    if (userProfile.userRegData && userProfile.userRegData.User_Org) {
      req.data.request['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
    }

    return this.programsService.post(req);
  }

  getNominationStatus() {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId
          }
        }
      }
    };
    if (this.userProfile.userRegData && this.userProfile.userRegData.User_Org) {
      req.data.request.filters['organisation_id'] = this.userProfile.userRegData.User_Org.orgId;
    } else {
      req.data.request.filters['user_id'] = this.userService.userProfile.userId;
    }
    this.programsService.post(req).subscribe((data) => {
      if (data.result && !_.isEmpty(data.result)
      && this.router.url.includes('/contribute/program/' + this.activatedRoute.snapshot.params.programId) &&
      _.get(_.first(data.result), 'status') !== 'Initiated') {
          this.router.navigateByUrl('/contribute/nominatedtextbooks/' + this.activatedRoute.snapshot.params.programId);
      } else if (data.result && !_.isEmpty(data.result)) {
          this.currentNominationStatus =  _.get(_.first(data.result), 'status');
          this.sessionContext.nominationDetails = _.first(data.result);
          this.selectedContentTypes = this.sessionContext.nominationDetails.content_types || [];
          this.markSelectedContentTypes();
      }
      if (this.userProfile.userRegData && this.userProfile.userRegData.User_Org) {
        this.sessionContext.currentOrgRole = this.userProfile.userRegData.User_Org.roles[0];
        if (this.userProfile.userRegData.User_Org.roles[0] === 'admin') {
          // tslint:disable-next-line:max-line-length
          this.sessionContext.currentRole = (this.currentNominationStatus === 'Approved' ||  this.currentNominationStatus === 'Rejected') ? 'REVIEWER' : 'CONTRIBUTOR';
        } else if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.rolemapping) {
            _.find(this.sessionContext.nominationDetails.rolemapping, (users, role) => {
              if (_.includes(users, this.userProfile.userRegData.User.userId)) {
                this.sessionContext.currentRole = role;
              }
          });
        }
      } else {
        this.sessionContext.currentRole = 'CONTRIBUTOR';
        this.sessionContext.currentOrgRole = 'individual';
      }
      const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
      this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    }, error => {
      this.toasterService.error('Failed fetching current nomination status');
    });
  }

  toggleUploadSampleButton(data) {
    data.isSelected = !data.isSelected;
  }

  canNominate() {
    const today = moment();
    return moment(this.programContext.nomination_enddate).isSameOrAfter(today, 'day');
  }

  uploadSampleContent(event, collection) {
    let apiCall = 'add';
    if (this.sessionContext.nominationDetails) {
      apiCall = 'update';
    }
      this.expressInterest(apiCall).subscribe((data) => {
        if (data.result && !_.isEmpty(data.result)) {
          this.sessionContext.nominationDetails = {
            osid: data.result.id,
            status: 'Initiated',
            program_id: data.result.program_id,
            user_id: data.result.user_id,
            content_types: this.selectedContentTypes
          };
          if (this.userService.userProfile.userRegData &&
            this.userService.userProfile.userRegData.User_Org) {
            this.sessionContext.nominationDetails['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
          }
          this.gotoChapterView(collection);
        }
      }, error => {
        this.toasterService.error('User onboarding failed');
      });
  }

  gotoChapterView(collection) {
    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: collection[context] || this.sharedContext[context]};
    }, this.sharedContext);
    _.forEach(['gradeLevel', 'medium', 'subject'], (val) => {
       this.checkArrayCondition(val);
    });
    this.sessionContext = _.assign(this.sessionContext, this.sharedContext);
    this.sessionContext.collection =  collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.chapterListComponentInput = {
      sessionContext: this.sessionContext,
      collection: collection,
      userProfile: this.userProfile,
      config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.chapterList'}),
      programContext: this.programContext,
      role: this.role
    };
    this.programStageService.addStage('chapterListComponent');
  }

  handleCancel(event: boolean) {
    !event ? this.preSavedContentTypes = _.clone(this.selectedContentTypes) : this.selectedContentTypes = this.preSavedContentTypes;
    this.markSelectedContentTypes();
    if (event && !this.selectedContentTypes.length) {
      this.toasterService.error(this.resourceService.messages.emsg.nomination.m001);
    }
  }
}
