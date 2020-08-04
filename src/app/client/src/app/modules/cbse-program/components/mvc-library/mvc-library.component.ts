import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as _ from 'lodash-es';
import { catchError, map, finalize, tap } from 'rxjs/operators';
import { throwError, forkJoin } from 'rxjs';
import { IImpressionEventInput} from '@sunbird/telemetry';
import { ContentService, ActionService, ProgramsService, UserService } from '@sunbird/core';
import { ConfigService, ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';
import { CbseProgramService } from '../../services';

@Component({
  selector: 'app-mvc-library',
  templateUrl: './mvc-library.component.html',
  styleUrls: ['./mvc-library.component.scss']
})
export class MvcLibraryComponent implements OnInit, AfterViewInit {

  public telemetryImpression: IImpressionEventInput;
  public sessionContext: any;
  public showSelectResourceModal: Boolean = false;
  public isFilterOpen: Boolean = false;
  public showLoader: Boolean = false;
  public skeletonLoader: Boolean = false;
  public selectedContentDetails: string;
  public contentList: any = [];
  public collectionId: string;
  public collectionUnitId: string;
  public selectedUnitName: string;
  public collectionData: any;
  public collectionHierarchy = [];
  public childNodes: any;
  public programId: string;
  public programDetails: any;
  public resourceReorderBreadcrumb: any = [];
  public filterData: any = {};
  public activeFilterData: any = {};
  public showAddedContent: Boolean = true;
  public inViewLogs = [];

  constructor(
    public programTelemetryService: ProgramTelemetryService,
    private contentService: ContentService, private configService: ConfigService, private actionService: ActionService,
    private cbseService: CbseProgramService, private programsService: ProgramsService,
    private toasterService: ToasterService, private route: ActivatedRoute, private router: Router, public resourceService: ResourceService,
    private userService: UserService, private navigationHelperService: NavigationHelperService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.collectionId = params.get('collectionId');
      this.collectionUnitId = params.get('collectionUnitId');
      this.programId = params.get('programId');
      this.showLoader = true;
      this.prepareTelemetryEvents();
      this.initialize();
    });
  }

  prepareTelemetryEvents() {
    this.sessionContext = {
      'collection': this.collectionId,
      'programId': this.programId,
      'collectionUnitId': this.collectionUnitId
    };
     // tslint:disable-next-line:max-line-length
     this.sessionContext.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.programId, 'Program');
     // tslint:disable-next-line:max-line-length
     this.sessionContext.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{ 'type': 'Program', 'id': this.programId }];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.route.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: _.get(this.route, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.route, 'snapshot.data.telemetry.pageid'),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime(),
          visits: this.inViewLogs,
        }
      };
    });
  }

  initialize() {
    forkJoin(this.getCollectionHierarchy(this.collectionId), this.getProgramDetails()).subscribe(
      ([collection, programDetails]) => {
        this.collectionData = collection;
        this.childNodes = _.get(this.collectionData, 'childNodes');
        this.resourceReorderBreadcrumb.push(this.collectionData.name);
        this.collectionHierarchy = this.getUnitWithChildren(this.collectionData, this.collectionId);
        this.programDetails = _.get(programDetails, 'result');
        this.prepareFilterData();
        this.fetchContentFacets();
      }, (error) => {
        this.showLoader = false;
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.error(errorMes || 'Fetching textbook details failed. Please try again...');
        this.handleBack();
      });
  }

  getCollectionHierarchy(identifier: string) {
    const hierarchyUrl = 'content/v3/hierarchy/' + identifier;
    const req = {
      url: hierarchyUrl,
      param: { 'mode': 'edit' }
    };
    return this.actionService.get(req).pipe(map((data: any) => data.result.content));
  }

  getProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req);
  }

  getUnitWithChildren(data, collectionId) {
    const self = this;
    const childData = data.children;
    if (_.isEmpty(childData)) { return []; }
    const tree = childData.map(child => {
      if (child.identifier === this.collectionUnitId) {
        this.selectedUnitName = child.name;
      }
      const treeItem = this.generateNodeMeta(child);
      const treeUnit = self.getUnitWithChildren(child, collectionId);
      const treeChildren = treeUnit && treeUnit.filter(item => item.contentType === 'TextBookUnit');
      treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
      return treeItem;
    });
    return tree;
  }

  generateNodeMeta(node) {
    const nodeMeta = {
      identifier: node.identifier,
      name: node.name,
      contentType: node.contentType,
      topic: node.topic,
      status: node.status,
      creator: node.creator,
      createdBy: node.createdBy || null,
      parentId: node.parent || null,
      organisationId: _.has(node, 'organisationId') ? node.organisationId : null,
      prevStatus: node.prevStatus || null,
    };
    return nodeMeta;
  }

  prepareFilterData(): void {
    this.filterData['medium'] = this.collectionData.medium;
    this.filterData['subject'] = this.collectionData.subject;
    this.filterData['gradeLevel'] = this.plusMinusGradeLevel(this.collectionData.gradeLevel);
    this.filterData['contentType'] = this.programDetails.content_types;
    if (_.isEmpty(this.activeFilterData)) { this.activeFilterData = _.cloneDeep(this.filterData); }
    const textbookLevel = this.getNameAndConceptOfSelectedUnit(this.collectionHierarchy, this.collectionUnitId);
    this.activeFilterData = _.assign(this.activeFilterData, ...textbookLevel);
  }

  fetchContentFacets() {
    const option = {
      url: this.configService.urlConFig.URLS.DOCKCONTENT_MVC.SEARCH,
      data: {
        request: {
          'filters': _.omit(this.activeFilterData, ['contentType']),
          'limit': 0,
          'facets': ['level1Name']
        }
      }
    };
    this.contentService.post(option).pipe(
      finalize(() => {
        this.showLoader = false;
      }),
      map((data: any) => data.result.facets))
      .subscribe((result: any) => {
        const level1Name = _.find(result, { name: 'level1Name' });
        this.filterData['chapter'] = _.map(level1Name['values'], 'name');
        // this.activeFilterData['chapter'] = _.cloneDeep(this.filterData['chapter']);
        this.fetchContentList();
      });
  }

  fetchContentList() {
    this.skeletonLoader = true;
    const option = {
      url: this.configService.urlConFig.URLS.DOCKCONTENT_MVC.SEARCH,
      data: {
        request: {
          'filters': {
            'textbook_name': this.collectionData.name,
            'status': [
              'live'
            ],
            ..._.pick(this.activeFilterData, ['medium', 'subject', 'gradeLevel', 'contentType']),
            'level1Name' : this.activeFilterData.chapter ? _.get(this.activeFilterData, 'chapter') : undefined
          }
        }
      }
    };
    this.contentService.post(option).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Fetching content list failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }),
      tap(data => {
        this.inViewLogs = [];
      }),
      finalize(() => {
        this.skeletonLoader = false;
        if (_.isEmpty(this.contentList)) { this.openFilter(); }
      }),
      map((data: any) => data.result.content ? data.result.content : []))
      .subscribe((result: any) => {
        this.contentList = result;
        this.filterContentList();
      });
  }

  filterContentList(selectedContentId?) {
    if (_.isEmpty(this.contentList)) { return; }
    _.forEach(this.contentList, (value, key) => {
      value.isAdded = _.includes(this.childNodes, value.identifier);
    });
    if (selectedContentId) {
      this.selectedContentDetails = _.pick(
        _.find(this.contentList, { 'identifier': selectedContentId }), ['name', 'identifier', 'isAdded']
      );
    } else {
      const selectedContentIndex = this.showAddedContent ? 0 : _.findIndex(this.contentList, { 'isAdded': false });
      this.selectedContentDetails = _.pick(this.contentList[selectedContentIndex], ['name', 'identifier', 'isAdded']);
    }
  }

  plusMinusGradeLevel(gradeLevel: Array<any>) {
    if (_.isEmpty(gradeLevel)) { return []; }
    const gradeLevelTemp: any = [...gradeLevel];
    _.forEach(gradeLevel, (value, key) => {
      value = _.head(_.map(value.match(/\d+/g), _.parseInt));  // Extract a number from a string
      if (value === 1) {
        gradeLevelTemp.push(`Class ${value + 1}`);
      } else if (value === 12) {
        gradeLevelTemp.push(`Class ${value - 1}`);
      } else if (value > 1 && value < 12) {
        gradeLevelTemp.push(`Class ${value + 1}`);
        gradeLevelTemp.push(`Class ${value - 1}`);
      }
    });
    return _.uniq(gradeLevelTemp);
  }

  openFilter(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.isFilterOpen = true;
  }

  onContentChange(event: any) {
    this.selectedContentDetails = _.pick(event.content, ['name', 'identifier', 'isAdded']);
  }

  onFilterChange(event: any) {
    if (event.action === 'filterDataChange') {
      this.activeFilterData = _.omitBy(_.assign(this.activeFilterData, event.filters), v => _.isEmpty(v));
      this.fetchContentList();
    } else if (event.action === 'filterStatusChange') {
      this.isFilterOpen = event.filterStatus;
    }
  }

  showResourceTemplate(event) {
    switch (event.action) {
      case 'beforeMove':
        this.sessionContext['selectedMvcContentDetails'] = this.selectedContentDetails;
        this.sessionContext['resourceReorderBreadcrumb'] = this.resourceReorderBreadcrumb;
        this.showSelectResourceModal = true;
        break;
      case 'afterMove':
        this.showSelectResourceModal = false;
        this.childNodes.push(event.contentId);
        this.filterContentList(this.showAddedContent ? event.contentId : undefined);
        break;
      case 'cancelMove':
        this.showSelectResourceModal = false;
        break;
      case 'showFilter':
        this.openFilter();
        break;
      case 'showAddedContent':
        this.showAddedContent = event.status;
        this.filterContentList();
        break;
      case 'contentVisits':
        this.prepareVisits(event.visits);
        break;
      default:
        break;
    }
  }

  public prepareVisits(event) {
    _.forEach(event, (content, index) => this.inViewLogs.push({
      objid: content.identifier,
      objtype: content.contentType,
      objver : content.pkgVersion.toString(),
      index: index
    }));
    if (this.telemetryImpression) {
      this.telemetryImpression.edata.visits = this.inViewLogs;
      this.telemetryImpression.edata.subtype = 'pageexit';
      this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
  }

  getParentsHelper(tree: any, id: string, parents: Array<any>) {
    const self = this;
    if (tree.identifier === id) {
      return {
        found: true,
        parents: [...parents, this.generateParentLevel(tree, parents)]
      };
    }
    let result = {
      found: false,
    };
    if (tree.children) {
      _.forEach(tree.children, (subtree, key) => {
        const maybeParents = _.concat([], parents);
        if (tree.identifier !== undefined) {
          maybeParents.push(this.generateParentLevel(tree, maybeParents));
        }
        const maybeResult: any = self.getParentsHelper(subtree, id, maybeParents);
        if (maybeResult.found) {
          result = maybeResult;
          return false;
        }
      });
    }
    return result;
  }

  generateParentLevel(tree, parents) {
    const obj = {};
    const index = parents.length + 1;
    obj[`level${index}Name`] = {
      value: tree.name
    };
    if (!_.isEmpty(tree.topic)) {
      obj[`level${index}Concept`] = {
        value: tree.topic
      };
    }
    return obj;
  }

  getNameAndConceptOfSelectedUnit(data: Array<any>, id: string) {
    const tree = {
      children: data
    };
    const result: any = this.getParentsHelper(tree, id, []);
    if (result.found) {
      return result.parents;
    } else {
      return [];
    }
  }

  handleBack() {
    this.programsService.setMvcStageData({
      collection: this.collectionData,
      lastOpenedUnitId: this.collectionUnitId
    });
    this.router.navigateByUrl(`/contribute/program/${this.programId}`);
  }

}
