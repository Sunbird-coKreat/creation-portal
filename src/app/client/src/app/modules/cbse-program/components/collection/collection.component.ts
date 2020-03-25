import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ConfigService, UtilService, ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { PublicDataService, ContentService, UserService, ProgramsService, LearnerService  } from '@sunbird/core';
import * as _ from 'lodash-es';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CbseProgramService } from '../../services';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { ISessionContext, IChapterListComponentInput } from '../../interfaces';
import { InitialState } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { programContext } from '../../../program/components/list-contributor-textbooks/data';

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
  public collectionList: any = {};
  public mediums;
  public showError = false;
  public classes;
  public board;
  public filters;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public nominateButton = 'hide';
  public nominate = '';
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
  public currentNominationStatus: any;
  public nominationDetails: any;
  showContentTypeModal = false;
  selectedContentTypes = [];
  selectedCollectionIds = [];
  _slideConfig = {'slidesToShow': 10, 'slidesToScroll': 1, 'variableWidth': true};

  constructor(private configService: ConfigService, public publicDataService: PublicDataService,
    private cbseService: CbseProgramService, public programStageService: ProgramStageService,
    public resourceService: ResourceService, public programTelemetryService: ProgramTelemetryService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    public utilService: UtilService, public contentService: ContentService,
    private activatedRoute: ActivatedRoute, private router: Router, public learnerService: LearnerService,
    private programsService: ProgramsService, private toasterService: ToasterService) {
     }

  ngOnInit() {
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });

    this.currentStage = 'collectionComponent';
    this.userProfile = _.get(this.collectionComponentInput, 'userProfile');
    this.collectionComponentConfig = _.get(this.collectionComponentInput, 'config');
    this.programContext = _.get(this.collectionComponentInput, 'programContext');
    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: this.getSharedContextObjectProperty(context)};
    }, {});
    this.contentType = _.get(this.programContext, 'content_types'),
    this.sessionContext = _.assign(this.collectionComponentInput.sessionContext, {
      // currentRole: _.get(this.programContext, 'userDetails.roles[0]'),
      bloomsLevel: _.get(this.programContext, 'config.scope.bloomsLevel'),
      programId: _.get(this.programContext, 'programId'),
      //programId: '31ab2990-7892-11e9-8a02-93c5c62c03f1' || _.get(this.programContext, 'programId'),
      program: _.get(this.programContext, 'name'),
      onBoardSchool: _.get(this.programContext, 'userDetails.onBoardingData.school'),
      collectionType: _.get(this.collectionComponentConfig, 'collectionType'),
      collectionStatus: _.get(this.collectionComponentConfig, 'status')
    }, this.sharedContext);
    if (this.userProfile.userRegData) {
      this.sessionContext.currentRole = this.userProfile.userRegData.User_Org.roles[0] === 'admin' ? 'CONTRIBUTOR' : 'REVIEWER';
    }
    this.filters = this.getImplicitFilters();
    this.getCollectionCard();

    const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
    this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
    this.sessionContext.programId = this.programContext.program_id;
    this.role.currentRole = this.sessionContext.currentRole;
    this.classes = _.find(this.collectionComponentConfig.config.filters.explicit, {'code': 'gradeLevel'}).range;
    this.mediums = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'medium'}).defaultValue;
    this.board = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'board'}).defaultValue;
    (_.size(this.mediums) > 1) ? this.isMediumClickable = true : this.isMediumClickable = false;

    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.collectionComponentInput.programContext.programId, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID + '.programs');
    this.setActiveDate();
    this.getNominationStatus();
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
      this.collectionList = res.result.content;
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
    if (this.selectedCollectionIds.length > 0) {
      this.nominateButton = 'show';
    } else {
      this.nominateButton = 'hide';
    }
  }
  redirect() {

  }

  toggle(item: any) {
    if (_.includes(this.selectedContentTypes, item.value)) {
      _.remove(this.selectedContentTypes, (data) => {
        return data === item.value;
      });
    } else {
      this.selectedContentTypes.push(item.value);
    }
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
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_UPDATE}`,
      data: {
        request: {
          program_id: this.activatedRoute.snapshot.params.programId,
          user_id: this.userService.userProfile.userId,
          status: 'Pending',
          content_types: this.selectedContentTypes,
          collection_ids: this.selectedCollectionIds,
          createdby: creator
        }
      }
    };
    this.programsService.post(req).subscribe((data) => {
      this.toasterService.success('Nomination sent');
      this.router.navigateByUrl('/contribute/myenrollprograms');
    }, error => {
      this.toasterService.error('User onboarding failed');
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

  expressInterest() {
    const userProfile = this.userService.userProfile;
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_ADD}`,
      data: {
        request: {
          program_id: this.activatedRoute.snapshot.params.programId,
          user_id: this.userService.userProfile.userId,
          status: 'Initiated',
        }
      }
    };
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
      if (data.result && !_.isEmpty(data.result)) {
          this.currentNominationStatus =  _.get(_.first(data.result), 'status');
          this.sessionContext.nominationDetails = _.first(data.result);
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

  goBack() {
    this.navigationHelperService.navigateToPreviousUrl();
  }

  toggleUploadSampleButton(data) {
    data.isSelected = !data.isSelected;
  }

  uploadSampleContent(event, collection) {
    if (this.sessionContext.nominationDetails) {
      this.gotoChapterView(collection);
    } else {
      this.expressInterest().subscribe((data) => {
        if (data.result && !_.isEmpty(data.result)) {
          this.sessionContext.nominationDetails = {
            osid: data.result.id,
            status: 'Initiated',
            program_id: data.result.program_id,
            user_id: data.result.user_id
          };
          if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
            this.sessionContext.nominationDetails['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
          }
          this.gotoChapterView(collection);
        }
      }, error => {
        this.toasterService.error('User onboarding failed');
      });
    }
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
}
