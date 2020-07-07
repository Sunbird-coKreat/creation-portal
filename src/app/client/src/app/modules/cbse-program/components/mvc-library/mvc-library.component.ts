import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as _ from 'lodash-es';
import { catchError, map, finalize } from 'rxjs/operators';
import { throwError, forkJoin } from 'rxjs';
import { ContentService, ActionService, ProgramsService } from '@sunbird/core';
import { ConfigService, ToasterService,ResourceService} from '@sunbird/shared';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { CbseProgramService } from '../../services';

@Component({
  selector: 'app-mvc-library',
  templateUrl: './mvc-library.component.html',
  styleUrls: ['./mvc-library.component.scss']
})
export class MvcLibraryComponent implements OnInit {

  public sessionContext: object;
  public showLargeModal: Boolean = false;
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

  constructor(
    private programStageService: ProgramStageService, public programTelemetryService: ProgramTelemetryService,
    private contentService: ContentService, private configService: ConfigService, private actionService: ActionService,
    private cbseService: CbseProgramService, private programsService: ProgramsService,
    private toasterService: ToasterService, private route: ActivatedRoute, private router: Router,public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.collectionId = params.get('collectionId');
      this.collectionUnitId = params.get('collectionUnitId');
      this.programId = params.get('programId');
      this.showLoader = true;
      this.initialize();
    });
  }

  initialize() {
    forkJoin(this.getCollectionHierarchy(this.collectionId), this.getProgramDetails()).subscribe(
      ([collection, programDetails]) => {
        this.collectionData = collection;
        this.childNodes = _.get(this.collectionData, 'childNodes');
        this.resourceReorderBreadcrumb.push(this.collectionData.name);
        this.collectionHierarchy = this.getUnitWithChildren(this.collectionData, this.collectionId);
        this.filterData['mediums'] = this.collectionData.medium;
        this.filterData['subjects'] = this.collectionData.subject;
        this.filterData['gradeLevels'] = this.plusMinusGradeLevel(this.collectionData.gradeLevel);
        this.programDetails = _.get(programDetails, 'result');
        this.filterData['contentTypes'] = this.programDetails.content_types;
        if (_.isEmpty(this.activeFilterData)) { this.activeFilterData = this.filterData; }
        this.showLoader = false;
        this.fetchContentList();
      },
      (error) => {
        this.showLoader = false;
        const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
        this.toasterService.error(errorMes || 'Fetching textbook details failed. Please try again...');
    });
  }

  public getCollectionHierarchy(identifier: string) {
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
    const nodeMeta =  {
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


  fetchContentList(filters?: any) {
    this.skeletonLoader = true;
    const option = {
      url: this.configService.urlConFig.URLS.DOCKCONTENT_MVC.SEARCH,
      data: {
        request: {
          'filters': {
                'contentType': 'TextBook',
                'medium': [
                    'Telegu'
                ],
                'status': [
                    'live'
                ]
            }
        }
      }
    };
    this.contentService.post(option).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Fetching content list failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }),
    finalize(() => {
      this.skeletonLoader = false;
      if (_.isEmpty(this.contentList)) { this.openFilter(); }
    }),
    map((data: any) => data.result.content))
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
      this.selectedContentDetails = _.pick(_.find(this.contentList, {'identifier': selectedContentId}), ['name', 'identifier', 'isAdded']);
      console.log(this.selectedContentDetails);
    } else {
      this.selectedContentDetails = _.pick(this.contentList[0], ['name', 'identifier', 'isAdded']);
    }
  }

  plusMinusGradeLevel(gradeLevel: Array<any>) {
    if (_.isEmpty(gradeLevel))  { return []; }
    const gradeLevelTemp: any = [...gradeLevel];
    _.forEach(gradeLevel, (value, key) => {
      value = _.head(_.map(value.match(/\d+/g), _.parseInt));  // Extract a number from a string
      if (value === 1) {
          gradeLevelTemp.push(`Class ${value + 1}`);
      }  else if (value === 12) {
          gradeLevelTemp.push(`Class ${value - 1}`);
      } else if (value > 1 && value < 12) {
          gradeLevelTemp.push(`Class ${value + 1}`);
          gradeLevelTemp.push(`Class ${value - 1}`);
      }
    });
    return _.uniq(gradeLevelTemp);
  }

  openFilter(): void {
    this.isFilterOpen = true;
  }

  onContentChange(event: any) {
    this.selectedContentDetails = _.pick(event.content, ['name', 'identifier', 'isAdded']);
  }

  onFilterChange(event: any) {
    if (event.action === 'filterDataChange') {
      this.activeFilterData =  event.filters;
      this.fetchContentList(event.filters);
    } else if (event.action === 'filterStatusChange') {
      this.isFilterOpen = event.filterStatus;
    } else {}
  }

  isResourceAdded(identifier): Boolean {
    return _.includes(this.childNodes, identifier);
  }

  showResourceTemplate(event) {
    switch (event.action) {
      case 'beforeMove':
        this.sessionContext = {
          'collection': this.collectionId, 'programId': this.programId,
          'selectedMvcContentDetails': this.selectedContentDetails,
          'resourceReorderBreadcrumb': this.resourceReorderBreadcrumb
        };
        this.showLargeModal = true;
        break;
      case 'afterMove':
        this.showLargeModal = false;
        this.childNodes.push(event.contentId);
        this.filterContentList(event.contentId);
        break;
      case 'cancelMove':
        this.showLargeModal = false;
        this.sessionContext = null;
        break;
      case 'showFilter':
        this.openFilter();
        break;
      default:
        break;
    }
  }

  // handleBack() {
  //   this.programStageService.removeLastStage();
  // }

}
