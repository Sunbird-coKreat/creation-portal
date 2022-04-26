import { ViewAllComponent } from './../../../shared-feature/components/view-all/view-all.component';
import { IUserProfile } from './../../../shared/interfaces/userProfile';
import { userProfile } from './../../../program/components/create-program/create-program.spec.data';
import { SourcingService } from './../../../sourcing/services/sourcing/sourcing.service';
import { ResourceService } from './../../../shared/services/resource/resource.service';
import { ToasterService } from './../../../shared/services/toaster/toaster.service';
import { HelperService } from './../../../sourcing/services/helper.service';
import { ActivatedRoute } from '@angular/router';
import { isEmpty, first, filter } from 'rxjs/operators';
import { Component, Input, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { IPagination } from '../../../sourcing/interfaces';
import { ConfigService, PaginationService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { UserService, ProgramsService, SearchService } from '@sunbird/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { ContentService } from '../../services/content/content.service';
import { ContentIDParam } from '../../interfaces/params';
import { WorkSpace } from '../../classes/workspace';
import { WorkSpaceService } from '../../services';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent extends WorkSpace implements OnInit {
  @ViewChild('createPopUpMat') createPopUpMat: TemplateRef<any>;
  @ViewChild('filterPopUpMat') filterPopUpMat: TemplateRef<any>;
  @Input() selectedTab: string;
  protected facets: [] = [];
  dialogRef: any;
  filters: any = {};
  showFiltersModal = false;
  query: string = '';
  list: any;
  result: any;
  showLoader = true;
  public pager: IPagination;
  pageNumber = 1;
  pageLimit = 100;
  maxLimit = 1000;
  countByStatus: any = { review: 0, draft: 0, live: 0 };

  public filterForm: FormGroup;
  public direction = 'desc';
  public sortColumn = 'lastUpdatedOn';
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public telemetryPageId: string;
  public filtersAppliedCount: number = 0;
  public totalContentCount: number = 0;
  public liveContentCount: number = 0;
  public draftContentCount: number = 0;
  public reviewContentCount: number = 0;
  public userProfile: IUserProfile;
  public orgAdmin: boolean = false;
  public creator: boolean = false;
  public reviewer: boolean = false;
  public bothCreatorAndReviewer: boolean = false;
  public contentSummary;
  public itemToDelete: any;
  public filtersToShow = {
    published: [
      "board",
      "medium",
      "gradeLevel",
      "subject",
      "contentType"
    ],
    mycontent: [
      "board",
      "medium",
      "gradeLevel",
      "subject",
      "status",
      "contentType"
    ],
    review: [],
    collaboration: [
      "board",
      "medium",
      "gradeLevel",
      "subject",
      "status",
      "contentType"
    ]
  };
  showDeleteModal:boolean = false;
  searchService: SearchService;
  public tab = 'collection';

  /**
  * To store all the collection details to be shown in collection modal
  */
  public collectionData: Array<any>;

  /**
  * Flag to show/hide loader on first modal
  */
  private showCollectionLoader: boolean;

  /**
  * To define collection modal table header
  */
  private headers: any;

  /**
  * To store deleting content id
  */
  private currentContentId: ContentIDParam;

  /**
  * To store deleteing content type
  */
  private contentMimeType: string;

  /**
   * To store modal object of first yes/No modal
   */
  private deleteModal: any;

  /**
   * To show/hide collection modal
   */
  public collectionListModal = false;

  constructor(private paginationService: PaginationService,
    public userService: UserService,
    public configService: ConfigService,
    searchService: SearchService,
    public programsService: ProgramsService,
    public dialog: MatDialog,
    public sbFormBuilder: FormBuilder,
    public cacheService: CacheService,
    private telemetryService: TelemetryService,
    private route: ActivatedRoute,
    private contentService: ContentService,
    private helperService: HelperService,
    private toasterService: ToasterService,
    private resourceService: ResourceService,
    private sourcingService: SourcingService,
    private activatedRoute: ActivatedRoute,
    public workSpaceService: WorkSpaceService,
  ) {
    super(searchService, workSpaceService, userService);
    this.searchService = searchService;
  }

  ngOnInit(): void {
    this.telemetryInteractCdata = [{ id: this.userService.channel, type: 'content_list' }];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
    if (this.userService.loggedIn) {
      this.userRoles();
    }
  }

  userRoles() {
    this.userService.userData$.subscribe((user: any) => {
      if (user && !user.err) {
        let userRoles = user?.userProfile?.userRoles;
        this.orgAdmin = userRoles?.includes('ORG_ADMIN');
        this.creator = userRoles?.some(e => e === 'CONTENT_CREATOR' || e === 'BOOK_CREATOR');
        this.reviewer = userRoles?.some(e => e === 'CONTENT_REVIEWER' || e === 'BOOK_REVIEWER' || e === 'REPORT_REVIEWER');
        this.bothCreatorAndReviewer = this.creator && this.reviewer;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedTab) {
      this.getContents(0);
      this.getFacets();
    }
  }

  getFacets() {
    let reqFilterSub = {};
    switch (this.selectedTab) {
      case "published":
        reqFilterSub = {
          // @Todo --> Remove comment
          // "createdFor": [this.userService?.rootOrgId]
        }
        break;

      case "mycontent":
        reqFilterSub = {
          "createdBy": this.userService.userid
        }
        break;

      case "review":
        reqFilterSub = {
          "createdFor": [this.userService?.rootOrgId]
        }
        break;

      case "collaboration":
        reqFilterSub = {
          "collaborators": [this.userService.userid]
        }
        break;
    }

    const req = {
      "filters": {
        "objectType": [
          "Content"
        ],
        "status": [],
        ...reqFilterSub
      },
      "limit": 0,
      "facets": ["status"]
    };

    this.searchService.compositeSearch(req).subscribe(res => {
      this.facets = _.get(res, 'result');
      this.totalContentCount = _.get(this.facets, 'count');
      this.countByStatus = _.get(_.first(_.get(this.facets, 'facets')), 'values').reduce((prev, curr) => {
        prev[curr.name] = curr.count;
        return prev;
      }, {});
    }, err => {
      console.log(err);
    });
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.pager = this.paginationService.getPager(this.result.count > 1000 ? 1000 : this.result.count, this.pageNumber, this.pageLimit);
    this.getContents(this.pageLimit * (this.pageNumber - 1));
  }

  getPublishedContentsFilter() {
    return {
      "status": ["Live"],
      // @Todo - remove comment
      // "createdFor": [this.userService?.rootOrgId],
      "objectType": "Content",
    };
  }

  getReviewContentsFilter() {
    // {"request":{"filters":{"createdBy":{"!=":"d0a3cd48-402f-43dc-99be-5c9d8cb502b2"},"objectType":"Content","primaryCategory":["Course","Content Playlist","Explanation Content","Learning Resource","Practice Question Set","eTextbook","Teacher Resource","Course Assessment"]},"offset":0,"limit":9,"query":"","sort_by":{"lastUpdatedOn":"desc"}}}
    return {
      "status": ["Review"],
      "createdFor": [this.userService?.rootOrgId],
      "createdBy": {
        "!=": this.userService?.userid
      },
      "objectType": "Content",
    };
  }

  getCollaborationFilter() {
    return {
      "status": ["Draft", "FlagDraft", "Review", "Processing", "Live", "Unlisted", "FlagReview"],
      "collaborators": [this.userService.userid],
      "objectType": "Content"
    }
  }

  getMyContentsFilter() {
    return {
      status: ["Draft", "FlagDraft", "Review", "Processing", "Live", "Unlisted", "FlagReview"],
      createdBy: this.userService.userid,
      "objectType": "Content"
    }
  }

  getContents(offset) {
    this.showLoader = true;
    const req = {
      "filters": {
        // @Todo add filter for category
        "primaryCategory": [
          "Course Assessment",
          "eTextbook",
          "Explanation Content",
          "Learning Resource",
          "Practice Question Set",
          "Teacher Resource",
          "Exam Question",
          "Content Playlist",
          "Course",
          "Digital Textbook",
          "Question paper"
        ]
      },
      "offset": offset,
      "limit": 200,
      "query": this.query,
      "sort_by": {
        "lastUpdatedOn": "desc"
      }
    };

    switch (this.selectedTab) {
      case "published":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getPublishedContentsFilter() }, _.identity);
        break;

      case "mycontent":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getMyContentsFilter() }, _.identity);
        break;

      case "review":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getReviewContentsFilter() }, _.identity);
        break;

      case "collaboration":
        req.filters = _.pickBy({ ...req.filters, ...this.getFilterDetails(), ...this.getCollaborationFilter() }, _.identity);
        break;
    }

    this.searchService.compositeSearch(req).subscribe(res => {
      if (res.responseCode === "OK") {
        this.list = res?.result?.content?.map(item => {
          item['allowDelete'] = false;

          switch (this.selectedTab) {
            case 'mycontent':
              item.allowDelete = this.allowDelete(item);
              break;
            case 'published':
              item['allowDelete'] = true;
              break;
            case 'review':
              break;
            case 'collaboration':
              break;
          }

          return item;
        });

        this.sortColumn = 'lastUpdatedOn';
        this.direction = 'desc';
        this.result = _.get(res, 'result');
        this.pager = this.paginationService.getPager(this.result.count > 1000 ? 1000 : this.result.count, this.pageNumber, this.pageLimit);
        this.showLoader = false;
      }
    }, error => {
      console.log(error);
    });
  }

  allowDelete(item) {
    return (item.createdBy === this.userService.userid)
      && (item.status === 'Draft' || item.status === 'FlagDraft');
  }

  searchResults(clearSearch?) {
    if (clearSearch) {
      this.query = '';
    }

    let offset = this.pageLimit * (this.pageNumber - 1);
    this.getContents(offset);
  }

  applyFilters(filters) {
    let offset = this.pageLimit * (this.pageNumber - 1);
    this.getContents(offset)
  }

  // finding the applied filters count and putting them into request body other wise put origional req body to api call
  getFilterDetails(setfilters?) {
    const appliedfilters = this.cacheService.get('workspaceAdminAppliedFilters');  // getting the strored data from cache service
    const applyFilters = setfilters ? setfilters : appliedfilters;
    this.filtersAppliedCount = this.programsService.getFiltersAppliedCount(applyFilters); // getting applied filters count
    return applyFilters;
  }

  sortList(column) {
    this.list = this.programsService.sortCollection(this.list, this.sortColumn, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  openCreatePopUpMat() {
    if (this.createPopUpMat) {
      this.dialogRef = this.dialog.open(this.createPopUpMat);
    }
  }

  openFilterPopUpMat() {
    this.showFiltersModal = true;
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
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

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

  confirmDelete(item) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
    this.currentContentId = _.get(item, 'identifier');
  }

  deleteContent(identifier) {
    this.showDeleteModal = false;
    this.helperService.retireContent(identifier).subscribe(response => {
      if (response && response.result && response.result.node_id) {
        this.list = this.list.filter(e => e.identifier !== identifier);
        this.toasterService.success(this.resourceService.messages.smsg.m0064);
      } else {
        this.toasterService.error(this.resourceService.messages.fmsg.m00103);
      }
    }, error => {
      const errInfo = {
        errorMsg: this.resourceService.messages.fmsg.m00103,
        telemetryPageId: this.telemetryPageId,
        telemetryCdata: this.telemetryInteractCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  selectTab(tabname) {
    this.tab = tabname;
  }

  /**
   * Show linked content if admin trying to delete Live content and
   * don't allow to delete if content is linked to collection
   * @param modal
   * @returns
   */
  public checkLinkedCollections(modal) {
    if (this.itemToDelete?.status != 'Live') {
      this.deleteContent(this.currentContentId);
      return;
    }

    if (!_.isUndefined(modal)) {
      this.deleteModal = modal;
    }
    this.showCollectionLoader = true;
    if (this.itemToDelete?.mimeType=== 'application/vnd.ekstep.content-collection') {
      this.deleteContent(this.currentContentId);
      return;
    }
    this.getLinkedCollections(this.currentContentId)
      .subscribe((response) => {
        // @Todo Remove mock data
        response = {"id":"api.v1.search","ver":"1.0","ts":"2022-04-19T16:13:33.116Z","params":{"resmsgid":"a8ca27c0-bffb-11ec-a8b6-8b6d917b3a2a","msgid":"5f330be6-14e7-4678-a1a2-3e42be9703e1","status":"successful","err":null,"errmsg":null},"responseCode":"OK","result":{"count":1,"content":[{"ownershipType":["createdBy"],"publish_type":"public","copyright":"NIT123","se_gradeLevelIds":["ekstep_ncert_k-12_gradelevel_class10","ekstep_ncert_k-12_gradelevel_class1","ekstep_ncert_k-12_gradelevel_class2","ekstep_ncert_k-12_gradelevel_class3","ekstep_ncert_k-12_gradelevel_class4","ekstep_ncert_k-12_gradelevel_class5","ekstep_ncert_k-12_gradelevel_class6","ekstep_ncert_k-12_gradelevel_class7","ekstep_ncert_k-12_gradelevel_class8","ekstep_ncert_k-12_gradelevel_class9"],"keywords":["New collection linked"],"subject":["Mathematics","Social Science","Political Science/Civics","Geography","Economics","Health and Physical Education","Science","English","Hindi","Environmental Studies","History"],"channel":"01309282781705830427","downloadUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113519847789355008146/new-collection-linked_1650372132623_do_113519847789355008146_1_SPINE.ecar","organisation":["NIT","MPPS MUKKADAMPALLI"],"language":["English"],"mimeType":"application/vnd.ekstep.content-collection","variants":{"spine":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113519847789355008146/new-collection-linked_1650372132623_do_113519847789355008146_1_SPINE.ecar","size":"14423"},"online":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113519847789355008146/new-collection-linked_1650372132944_do_113519847789355008146_1_ONLINE.ecar","size":"5605"}},"leafNodes":["do_113519844427513856139"],"objectType":"Content","se_mediums":["English","Hindi"],"gradeLevel":["Class 10","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9"],"appIcon":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/collection/do_113519847789355008146/artifact/apple.thumb.png","primaryCategory":"Content Playlist","contentEncoding":"gzip","lockKey":"cf65c71b-c2ff-4e49-be16-be8a44e2f51d","generateDIALCodes":"Yes","totalCompressedSize":3028,"mimeTypesCount":"{\"application/pdf\":1,\"application/vnd.ekstep.content-collection\":2}","contentType":"Collection","se_gradeLevels":["Class 10","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9"],"trackable":{"enabled":"No","autoBatch":"No"},"identifier":"do_113519847789355008146","audience":["Student"],"se_boardIds":["ekstep_ncert_k-12_board_cbse"],"subjectIds":["ekstep_ncert_k-12_subject_mathematics","ekstep_ncert_k-12_subject_socialscience","ekstep_ncert_k-12_subject_politicalsciencecivics","ekstep_ncert_k-12_subject_geography","ekstep_ncert_k-12_subject_economics","ekstep_ncert_k-12_subject_healthandphysicaleducation","ekstep_ncert_k-12_subject_science","ekstep_ncert_k-12_subject_english","ekstep_ncert_k-12_subject_hindi","ekstep_ncert_k-12_subject_environmentalstudies","ekstep_ncert_k-12_subject_history"],"toc_url":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113519847789355008146/artifact/do_113519847789355008146_toc.json","visibility":"Default","contentTypesCount":"{\"Collection\":2,\"Resource\":1}","author":"N11","consumerId":"bfe5883f-ac66-4744-a064-3ed88d986eba","childNodes":["do_113519844427513856139","do_113519848100020224149","do_113519848100003840147"],"discussionForum":{"enabled":"No"},"mediaType":"content","osId":"org.ekstep.quiz.app","graph_id":"domain","nodeType":"DATA_NODE","lastPublishedBy":"ae94b68c-a535-4dce-8e7a-fb9662b0ad68","version":2,"se_subjects":["Mathematics","Social Science","Political Science/Civics","Geography","Economics","Health and Physical Education","Science","English","Hindi","Environmental Studies","History"],"license":"CC BY 4.0","size":14423,"lastPublishedOn":"2022-04-19T12:42:11.888+0000","name":"New collection linked","mediumIds":["ekstep_ncert_k-12_medium_english","ekstep_ncert_k-12_medium_hindi"],"attributions":[],"status":"Live","code":"org.sunbird.Lyr75K","credentials":{"enabled":"No"},"prevStatus":"Processing","description":"Enter description for Collection","medium":["English","Hindi"],"posterImage":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113217576977719296120/artifact/apple.png","idealScreenSize":"normal","createdOn":"2022-04-19T12:40:44.608+0000","se_boards":["CBSE"],"se_mediumIds":["ekstep_ncert_k-12_medium_english","ekstep_ncert_k-12_medium_hindi"],"copyrightYear":2022,"contentDisposition":"inline","additionalCategories":[],"lastUpdatedOn":"2022-04-19T12:42:13.331+0000","dialcodeRequired":"No","createdFor":["01309282781705830427"],"creator":"N11","os":["All"],"se_subjectIds":["ekstep_ncert_k-12_subject_mathematics","ekstep_ncert_k-12_subject_socialscience","ekstep_ncert_k-12_subject_politicalsciencecivics","ekstep_ncert_k-12_subject_geography","ekstep_ncert_k-12_subject_economics","ekstep_ncert_k-12_subject_healthandphysicaleducation","ekstep_ncert_k-12_subject_science","ekstep_ncert_k-12_subject_english","ekstep_ncert_k-12_subject_hindi","ekstep_ncert_k-12_subject_environmentalstudies","ekstep_ncert_k-12_subject_history"],"se_FWIds":["ekstep_ncert_k-12"],"pkgVersion":1,"versionKey":"1650372122143","idealScreenDensity":"hdpi","framework":"ekstep_ncert_k-12","depth":0,"s3Key":"content/do_113519847789355008146/artifact/do_113519847789355008146_toc.json","boardIds":["ekstep_ncert_k-12_board_cbse"],"lastSubmittedOn":"2022-04-19T12:42:01.059+0000","createdBy":"5a587cc1-e018-4859-a0a8-e842650b9d64","compatibilityLevel":1,"leafNodesCount":1,"userConsent":"No","gradeLevelIds":["ekstep_ncert_k-12_gradelevel_class10","ekstep_ncert_k-12_gradelevel_class1","ekstep_ncert_k-12_gradelevel_class2","ekstep_ncert_k-12_gradelevel_class3","ekstep_ncert_k-12_gradelevel_class4","ekstep_ncert_k-12_gradelevel_class5","ekstep_ncert_k-12_gradelevel_class6","ekstep_ncert_k-12_gradelevel_class7","ekstep_ncert_k-12_gradelevel_class8","ekstep_ncert_k-12_gradelevel_class9"],"board":"CBSE","resourceType":"Collection","node_id":518600}]}};
        const count = _.get(response, 'result.count');
        if (!count) {
          this.deleteContent(this.currentContentId);
          return;
        }

        const collections = _.get(response, 'result.content', []);
        const channels = _.map(collections, (collection) => {
          return _.get(collection, 'channel');
        });

        const channelMapping = {};
        forkJoin(_.map(channels, (channel: string) => {
            return this.getChannelDetails(channel);
          })).subscribe((forkResponse) => {
            this.collectionData = [];
            _.forEach(forkResponse, channelResponse => {
              const channelId = _.get(channelResponse, 'result.channel.code');
              const channelName = _.get(channelResponse, 'result.channel.name');
              channelMapping[channelId] = channelName;
            });

            _.forEach(collections, collection => {
              const obj = _.pick(collection, ['contentType', 'board', 'medium', 'name', 'gradeLevel', 'subject', 'channel']);
              obj['channel'] = channelMapping[obj.channel];
              this.collectionData.push(obj);
          });

          this.headers = {
             type: 'Type',
             name: 'Name',
             subject: 'Subject',
             grade: 'Grade',
             medium: 'Medium',
             board: 'Board',
             channel: 'Tenant Name'
             };
             if (!_.isUndefined(this.deleteModal)) {
              this.deleteModal.deny();
            }
          this.showCollectionLoader = false;
          this.showDeleteModal = false;
          this.collectionListModal = true;
          },
          (error) => {
            this.showCollectionLoader = false;
            this.showDeleteModal = false;
           this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0014'));
            console.log(error);
          });
        },
        (error) => {
          this.showCollectionLoader = false;
          this.showDeleteModal = false;
         this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0015'));
          console.log(error);
        });
  }
}
