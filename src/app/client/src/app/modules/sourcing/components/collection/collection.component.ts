import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ConfigService, UtilService, ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { PublicDataService, ContentService, UserService, ProgramsService, LearnerService, ActionService,
  FrameworkService  } from '@sunbird/core';
import * as _ from 'lodash-es';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TelemetryService, IInteractEventEdata , IImpressionEventInput} from '@sunbird/telemetry';
import { SourcingService, CollectionHierarchyService} from '../../services';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { ISessionContext, IChapterListComponentInput } from '../../interfaces';
import { InitialState } from '../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { isEmpty } from 'lodash';
import { HelperService } from '../../../sourcing/services/helper.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit, OnDestroy, AfterViewInit {

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
  public roles: any = {};
  public collectionList: any = [];
  public tempSortCollectionList: any = [];
  public direction = 'asc';
  public sortColumn = 'name';
  public mediums;
  public showError = false;
  public classes;
  public board;
  public filters;
  public telemetryPageId: string;
  public telemetryInteractCdata: any;
  public contentStatusCounts: any = {};
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryImpression: IImpressionEventInput;
  public nominateButton = 'hide';
  public nominate = '';
  public programContentTypes: string;
  showNominateModal = false;
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
  public uploadSampleClicked = false;
  _slideConfig = {'slidesToShow': 10, 'slidesToScroll': 1, 'variableWidth': true};
  public preSavedContentTypes = [];
  public disableNominate = false;
  public targetCollection: string;
  public targetCollections: string;
  public firstLevelFolderLabel: string;
  constructor(public configService: ConfigService, public publicDataService: PublicDataService,
    public actionService: ActionService,
    private sourcingService: SourcingService, private collectionHierarchyService: CollectionHierarchyService,
    public programStageService: ProgramStageService, public resourceService: ResourceService,
    public programTelemetryService: ProgramTelemetryService,
    public userService: UserService, private navigationHelperService: NavigationHelperService,
    public utilService: UtilService, public contentService: ContentService,
    private activatedRoute: ActivatedRoute, private router: Router, public learnerService: LearnerService,
    private programsService: ProgramsService, private toasterService: ToasterService,
    public frameworkService: FrameworkService, private helperService: HelperService) {
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
    this.setTargetCollectionValue();
    this.getCollectionCategoryDefinition();
    this.sharedContext = this.collectionComponentInput.programContext.config.sharedContext.reduce((obj, context) => {
      return {...obj, [context]: this.getSharedContextObjectProperty(context)};
    }, {});
    
    this.contentType = this.programsService.getProgramTargetPrimaryCategories(this.programContext);
    
    this.sessionContext = _.assign(this.collectionComponentInput.sessionContext, {
      bloomsLevel: _.get(this.programContext, 'config.scope.bloomsLevel'),
      programId: _.get(this.programContext, 'programId'),
      program: _.get(this.programContext, 'name'),
      onBoardSchool: _.get(this.programContext, 'userDetails.onBoardingData.school'),
      collectionType: _.get(this.collectionComponentConfig, 'collectionType'),
      collectionStatus: _.get(this.collectionComponentConfig, 'status'),
      currentRoles: []
    }, this.sharedContext);
    if (this.userService.isUserBelongsToOrg()) {
      this.sessionContext.currentRoles = _.first(this.userService.getUserOrgRole()) === 'admin' ? ['REVIEWER'] : ['CONTRIBUTOR'];
    }
    this.filters = this.getImplicitFilters();

    // tslint:disable-next-line:max-line-length
    const currentRoles = _.filter(this.programContext.config.roles, role => _.get(this.sessionContext, 'currentRoles', []).includes(role.name));
    this.sessionContext.currentRoleIds = !_.isEmpty(currentRoles) ? _.map(currentRoles, role => role.id) : null;
    this.roles.currentRoles = this.sessionContext.currentRoles;

    this.sessionContext.programId = this.programContext.program_id;
    this.classes = _.find(this.collectionComponentConfig.config.filters.explicit, {'code': 'gradeLevel'}).range;
    this.mediums = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'medium'}).defaultValue;
    this.board = _.find(this.collectionComponentConfig.config.filters.implicit, {'code': 'board'}).defaultValue;
    (_.size(this.mediums) > 1) ? this.isMediumClickable = true : this.isMediumClickable = false;
    this.telemetryPageId = _.get(this.sessionContext, 'telemetryPageDetails.telemetryPageId');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
    this.telemetryInteractObject = {};
    this.programContentTypes = (!_.isEmpty(this.programContext.targetprimarycategories)) ? _.join(_.map(this.programContext.targetprimarycategories, 'name'), ', ') : _.join(this.programContext.content_types, ', ');
    this.setActiveDate();
    // To avoid nomination list api call if nominationDetails already available
    this.afterNominationCheck(this.sessionContext.nominationDetails);
  }

  setTargetCollectionValue() {
    if (!_.isUndefined(this.programContext)) {
      this.targetCollection = this.programsService.setTargetCollectionName(this.programContext);
      this.targetCollections = this.programsService.setTargetCollectionName(this.programContext, 'plural');
    }
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
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: this.configService.telemetryLabels.pageType.workflow || _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  cancelNomination() {
    this.showNominateModal = false;
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
      const filterArr = _.groupBy(res.result.content || res.result.QuestionSet, 'identifier');
      const filteredTextbook = this.filterTextBook(filterArr);
      const collectionCards = this.utilService.getDataForCard(filteredTextbook, constantData, dynamicFields, metaData);
      this.collectionsWithCardImage = _.forEach(collectionCards, collection => this.addCardImage(collection));
      this.filterCollectionList(this.classes);
      if (!_.isEmpty(res.result.content)) {
        this.sortColumn = 'name';
        this.direction = 'asc';
        const collections = res.result.content || res.result.QuestionSet;
        let sampleValue, organisation_id, createdBy;
        if (!_.isUndefined(this.currentNominationStatus)) {
          // tslint:disable-next-line:max-line-length
          if (this.currentNominationStatus === 'Initiated' ||  this.currentNominationStatus === 'Pending') {
            sampleValue = true;
          }
          if (this.userService.isUserBelongsToOrg()) {
            organisation_id = this.userService.getUserOrgId();
          } else {
            createdBy = this.userService.userid;
          }
        // tslint:disable-next-line:max-line-length
        this.collectionHierarchyService.getContentAggregation(this.activatedRoute.snapshot.params.programId, sampleValue, organisation_id, createdBy)
          .subscribe(
            (response) => {
              if (response && response.result && (_.get(response.result, 'content')|| _.get(response.result, 'QuestionSet'))) {
                //const contents = _.get(response.result, 'content');

                const contents = _.compact(_.concat(_.get(response.result, 'QuestionSet'), _.get(response.result, 'content')));

                if (this.userService.isUserBelongsToOrg()) {
                  this.contentStatusCounts = this.collectionHierarchyService.getContentCounts(contents, this.userService.getUserOrgId(), collections);
                } else {
                  // tslint:disable-next-line:max-line-length
                  this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForIndividual(contents, this.userService.userid, collections);
                }
              } else {
                this.contentStatusCounts = this.collectionHierarchyService.getContentCountsForAll([], collections);
              }
              this.collectionList = this.collectionHierarchyService.getIndividualCollectionStatus(this.contentStatusCounts, collections);
              if (_.isEmpty(this.selectedCollectionIds)) {
                this.selectedCollectionIds = _.map(_.filter(this.collectionList, c => c.totalSampleContent > 0), 'identifier');
              }
              this.tempSortCollectionList = this.collectionList;
              this.selectedCollectionIds = _.uniq(this.selectedCollectionIds);
              this.toggleNominationButton();
              this.sortCollection(this.sortColumn);
              _.map(this.collectionList, textbook => {
                textbook.isSelected = _.includes(this.selectedCollectionIds, textbook.identifier);
              });
              this.showLoader = false;
            },
            (error) => {
              console.log(error);
              this.showLoader = false;
              const errInfo = {
                errorMsg: 'Fetching textbooks failed. Please try again...',
                telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
                env : this.activatedRoute.snapshot.data.telemetry.env
              };
              this.sourcingService.apiErrorHandling(error, errInfo);
            }
          );
        } else {
          this.collectionList = collections;
          if (_.isEmpty(this.selectedCollectionIds)) {
            this.selectedCollectionIds = _.map(_.filter(this.collectionList, c => c.totalSampleContent > 0), 'identifier');
          }
          this.tempSortCollectionList = this.collectionList;
          this.selectedCollectionIds = _.uniq(this.selectedCollectionIds);
          this.sortCollection(this.sortColumn);
          _.map(this.collectionList, textbook => {
            textbook.isSelected = _.includes(this.selectedCollectionIds, textbook.identifier);
          });
          this.showLoader = false;
        }
      } else {
        this.showLoader = false;
      }
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
      this.uploadSampleClicked = false;
      this.getNominationStatus();
    }
   }

  searchCollection() {
    const req = {
      url : `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        request: {
          filters: {
            objectType: ['collection', 'questionset'],
            programId: this.sessionContext.programId || this.programContext.program_id,
            status: this.sessionContext.collectionStatus || ['Draft', 'Live'],
            primaryCategory: !_.isNull(this.programContext.target_collection_category) ? this.programContext.target_collection_category : 'Digital Textbook'
          },
          fields: ['name', 'gradeLevel', 'mimeType', 'medium', 'subject', 'status', 'chapterCount', 'chapterCountForContribution'],
          limit: 1000
        }
      }
    };
    return this.contentService.post(req)
      .pipe(
        catchError(err => {
          const errInfo = {
            errorMsg: 'Question creation failed',
            telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
            env : this.activatedRoute.snapshot.data.telemetry.env, request: req
          };
          this.showLoader = false;
          this.showError = true;
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    }));
  }

  getCollectionCategoryDefinition() {
    if (this.programContext.target_collection_category && this.userService.userProfile.rootOrgId) {
      // tslint:disable-next-line:max-line-length
      this.programsService.getCategoryDefinition(this.programContext.target_collection_category, this.userService.userProfile.rootOrgId).subscribe(res => {
        const objectCategoryDefinition = res.result.objectCategoryDefinition;
        if (_.has(objectCategoryDefinition.objectMetadata.config, 'sourcingSettings.collection.hierarchy.level1.name')) {
          // tslint:disable-next-line:max-line-length
        this.firstLevelFolderLabel = objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection.hierarchy.level1.name;
        } else {
          this.firstLevelFolderLabel = _.get(this.resourceService, 'frmelmnts.lbl.deafultFirstLevelFolders');
        }
      });
    }
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
    if (this.stageSubscription) {
      this.stageSubscription.unsubscribe();
    }
  }

  ChangeUploadStatus(rowId) {
    this.nominate = rowId;
    this.nominate = 'uploadSample';
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
    let catObj = _.find(this.selectedContentTypes, (element) => {
      return element.name === item.name;
    });
    if (catObj) {
      _.remove(this.selectedContentTypes, (data) => {
        return data.name === item.name;
      });
    } else {
      this.selectedContentTypes.push(item);
    }
  }

  checkIfSelected(contentType) {
    let catObj = _.find(this.selectedContentTypes, (element) => {
      return element.name === contentType.name;
    });
    return (catObj) ? true : false;
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
      roles: this.roles
    };
    this.programStageService.addStage('chapterListComponent');
    this.isCollectionSelected.emit(collection.metaData.identifier ? true : false);
  }

  addNomination() {
    this.showContentTypeModal = false;
    this.disableNominate = true;
    const programId = this.activatedRoute.snapshot.params.programId;
    const request = {
      program_id: programId,
      status: 'Pending',
      collection_ids: this.selectedCollectionIds,
    };

    if (!isEmpty(this.programContext.targetprimarycategories)) {
      request['targetprimarycategories'] =  this.selectedContentTypes;
      request['content_types'] = [];
    } else {
      request['content_types'] = _.map(this.selectedContentTypes, 'name');
    }

    this.programsService.addorUpdateNomination(request).subscribe(
      (data) => {
        if (data === 'Approved' || data === 'Rejected') {
          this.showNominateModal = false;
          this.toasterService.error(`${this.resourceService.messages.emsg.modifyNomination.error} ${data}`);
          setTimeout(() => {
            this.router.navigateByUrl('/contribute/myenrollprograms');
          }, 10);
        } else if (data.result && !_.isEmpty(data.result)) {
            this.showNominateModal = false;
            const router = this.router;
            setTimeout(function() {
              router.navigateByUrl('/contribute/myenrollprograms');
            }, 10);
            this.toasterService.success('Nomination sent');
          }
      }, (error) => {
        this.disableNominate = false;
        const errInfo = {
          errorMsg: 'Nomination submit failed... Please try later',
          telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
          env : this.activatedRoute.snapshot.data.telemetry.env, request: request
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
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
    if (this.userService.isUserBelongsToOrg()) {
      req.data.request.filters['organisation_id'] = this.userService.getUserOrgId();
    } else {
      req.data.request.filters['user_id'] = this.userService.userid;
    }
    this.programsService.post(req).subscribe((data) => {
      const nomination = _.first(_.get(data, 'result', []));
      this.afterNominationCheck(nomination);
    }, error => {
      this.getCollectionCard();
      const errInfo = {
        errorMsg: 'Failed fetching current nomination status',
        telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env, request: req
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  afterNominationCheck(nominationDetails) {
    if (!_.isEmpty(nominationDetails)) {
      this.currentNominationStatus =  _.get(nominationDetails, 'status');
      this.sessionContext.nominationDetails = nominationDetails;
      this.selectedContentTypes = this.programsService.getNominatedTargetPrimaryCategories(this.programContext, nominationDetails);
    }
    if (this.userService.isUserBelongsToOrg()) {
      this.sessionContext.currentOrgRole = _.first(this.userService.getUserOrgRole());

      if (this.sessionContext.currentOrgRole === 'admin') {
        this.sessionContext.currentRoles = ['Approved', 'Rejected'].includes(this.currentNominationStatus) ? ['REVIEWER'] : ['CONTRIBUTOR'];
      } else if (this.sessionContext.nominationDetails.rolemapping) {
        this.sessionContext.currentRoles = this.userService.getMyRoleForProgram(this.sessionContext.nominationDetails);
      }
    } else {
      this.sessionContext.currentRoles = ['CONTRIBUTOR'];
      this.sessionContext.currentOrgRole = 'individual';
    }
    this.getCollectionCard();
    const currentRoles = _.filter(this.programContext.config.roles, role => this.sessionContext.currentRoles.includes(role.name));
    this.sessionContext.currentRoleIds = !_.isEmpty(currentRoles) ? _.map(currentRoles, role => role.id) : null;
    this.roles.currentRoles = this.sessionContext.currentRoles;
  }

  toggleUploadSampleButton(data) {
    data.isSelected = !data.isSelected;
  }

  canNominate() {
    const today = moment();
    return moment(this.programContext.nomination_enddate).isSameOrAfter(today, 'day') && this.programsService.isProjectLive(this.programContext);
  }

  uploadSampleContent(event, collection) {
    if (_.has(collection, 'identifier')) {
      this.setFrameworkCategories(collection.identifier);
    }
    this.uploadSampleClicked = true;
    if (!this.selectedContentTypes.length) {
        this.toasterService.error(this.resourceService.messages.emsg.nomination.m001);
    } else {
      const programId = this.activatedRoute.snapshot.params.programId;
      const userId = this.userService.userid;
      const request = {
        program_id: programId,
        status: 'Initiated',
      };

      if (!isEmpty(this.programContext.targetprimarycategories)) {
        request['targetprimarycategories'] =  this.selectedContentTypes;
        request['content_types'] = [];
      } else {
        request['content_types'] = _.map(this.selectedContentTypes, 'name');
      }
      this.programsService.addorUpdateNomination(request).subscribe(
        (data) => {
          if (data.result && !_.isEmpty(data.result)) {
            this.sessionContext.nominationDetails = {
              osid: data.result.id,
              status: 'Initiated',
              program_id: programId,
              user_id: userId,
            };

            if (!isEmpty(this.programContext.targetprimarycategories)) {
              this.sessionContext.nominationDetails['targetprimarycategories'] =  this.selectedContentTypes;
              request['content_types'] = [];
            } else {
              this.sessionContext.nominationDetails['content_types'] = _.map(this.selectedContentTypes, 'name');
            }
          
            if (this.userService.isUserBelongsToOrg()) {
              this.sessionContext.nominationDetails['organisation_id'] = this.userService.getUserOrgId();
            }
            this.gotoChapterView(collection);
          }
        }, error => {
          const errInfo = {
            errorMsg: 'User onboarding failed',
            telemetryPageId: this.telemetryPageId, telemetryCdata : this.telemetryInteractCdata,
            env : this.activatedRoute.snapshot.data.telemetry.env, request: request
          };
          this.sourcingService.apiErrorHandling(error, errInfo);
        });
    }
  }

  setFrameworkCategories(collectionId) {
    this.collectionHierarchyService.getCollectionHierarchyDetails(collectionId).subscribe((res) => {
      if (res.result) {
        const collection = res.result.content;
        this.sessionContext.targetCollectionPrimaryCategory = _.get(collection, 'primaryCategory');
        this.sessionContext.targetCollectionFrameworksData = this.helperService.setFrameworkCategories(collection);
      }
    },
    err => {
      const errInfo = { errorMsg: 'Unable to fetch collection details' };
      this.apiErrorHandling(err, errInfo);
    });
  }

  apiErrorHandling(err, errorInfo) {
    this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
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
    this.sessionContext.telemetryPageDetails = {
      telemetryPageId : this.configService.telemetryLabels.pageId.contribute.submitNominationTargetCollection,
      telemetryInteractCdata: [...this.telemetryInteractCdata, { 'id': collection.identifier, 'type': 'linked_collection'}]
    };
    this.chapterListComponentInput = {
      sessionContext: this.sessionContext,
      collection: collection,
      userProfile: this.userProfile,
      config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.chapterList'}),
      programContext: this.programContext,
      roles: this.roles
    };
    this.programStageService.addStage('chapterListComponent');
  }

  handleCancel(event: boolean) {
    !event ? this.preSavedContentTypes = _.clone(this.selectedContentTypes) : this.selectedContentTypes = this.preSavedContentTypes;
    //this.markSelectedContentTypes();
    if (event && !this.selectedContentTypes.length) {
      this.toasterService.error(this.resourceService.messages.emsg.nomination.m001);
    }
  }

  getTelemetryInteractCdata(type, id) {
    return [ ...this.telemetryInteractCdata, { type: type, id: _.toString(id)} ];
  }

}
