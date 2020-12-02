import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';

import { ICollectionManagementInput, ISessionContext } from '../../interfaces';
import { ProgramsService } from '@sunbird/core';
import { ToasterService, ConfigService, ResourceService, NavigationHelperService, BrowserCacheTtlService } from '@sunbird/shared';
import { ProgramStageService, ProgramTelemetryService } from '../../../program/services';
import { DataFormComponent } from '../../../core/components/data-form/data-form.component';
import { HelperService } from '../../services';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-collection-management',
  templateUrl: './collection-management.component.html',
  styleUrls: ['./collection-management.component.scss']
})
export class CollectionManagementComponent implements OnInit, OnDestroy {
  @Input() compInput: ICollectionManagementInput;
  @ViewChild('formData') formData: DataFormComponent;
  public sessionContext: ISessionContext;
  public programContext: any;
  public viewElements: string[];
  public collectionMetadata: any;
  public visibility: any;
  public showEditMetaForm: boolean;
  public requiredAction: string;
  public categoryMasterList: any;
  private onComponentDestroy$ = new Subject<any>();
  public formFieldProperties: any;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  constructor(private programsService: ProgramsService, public programTelemetryService: ProgramTelemetryService,
    private resourceService: ResourceService, private helperService: HelperService) { }

  ngOnInit() {
    this.sessionContext  = _.get(this.compInput, 'sessionContext');
    this.programContext = _.get(this.compInput, 'programContext');
    this.viewElements = _.get(this.compInput, 'viewElements');
    this.collectionMetadata = _.get(this.compInput, 'collectionMetadata');
    this.handleActionButtons();
    this.fetchCategoryDetails();
  }

  handleActionButtons() {
    this.visibility = {};
    const submissionDateFlag = this.programsService.checkForContentSubmissionDate(this.programContext);

    this.visibility['showCreateCollection'] = submissionDateFlag && this.canCreateCollection();
    this.visibility['showEditCollectionMetadata'] = submissionDateFlag && this.canEditCollectionMetadata();
    this.visibility['showEditCollectionHierarchy'] = submissionDateFlag && this.canEditCollectionHierarchy();
    this.visibility['showCollectionSave'] = submissionDateFlag && this.canCollectionSave();
    this.visibility['showCollectionSubmit'] = submissionDateFlag && this.canCollectionSubmit();
  }

  canCreateCollection() {
    return !!(_.includes(this.viewElements, 'CREATE') && _.includes(this.sessionContext.currentRoles, 'CONTRIBUTOR'));
  }

  canEditCollectionMetadata() {
    // tslint:disable-next-line:max-line-length
    return !!(_.includes(this.viewElements, 'EDITCOLLECTIONMETADATA') && _.includes(this.sessionContext.currentRoles, 'CONTRIBUTOR') && this.collectionMetadata);
  }

  canEditCollectionHierarchy() {
    return !!(_.includes(this.viewElements, 'EDITCOLLECTIONHIERARCHY') && _.includes(this.sessionContext.currentRoles, 'CONTRIBUTOR'));
  }

  canCollectionSave() {
    return !!(_.includes(this.viewElements, 'SAVECOLLECTION') && _.includes(this.sessionContext.currentRoles, 'CONTRIBUTOR'));
  }

  canCollectionSubmit() {
    return !!(_.includes(this.viewElements, 'SUBMITCOLLECTION') && _.includes(this.sessionContext.currentRoles, 'CONTRIBUTOR'));
  }

  fetchFormconfiguration() {
    this.formFieldProperties = _.cloneDeep(this.helperService.getFormConfiguration());
  }

  showEditform(action) {
    this.fetchFormconfiguration();
    this.requiredAction = action;
    // if (_.get(this.selectedSharedContext, 'topic')) {
    // tslint:disable-next-line:max-line-length
    //   this.sessionContext.topic = _.isArray(this.sessionContext.topic) ? this.selectedSharedContext.topic : _.split(this.selectedSharedContext.topic, ',');
    // }

    if (this.requiredAction === 'editForm') {
      this.formFieldProperties = _.filter(this.formFieldProperties, val => val.code !== 'contentPolicyCheck');
    }
    // tslint:disable-next-line:max-line-length
    [this.categoryMasterList, this.formFieldProperties] = this.helperService.initializeMetadataForm(this.sessionContext, this.formFieldProperties, this.collectionMetadata);
    this.showEditMetaForm = true;
  }

  // fetchFrameWorkDetails() {
  //   this.frameworkService.initialize(this.sessionContext.framework);
  //   this.frameworkService.frameworkData$.pipe(takeUntil(this.onComponentDestroy$),
  //     filter(data => _.get(data, `frameworkdata.${this.sessionContext.framework}`)), take(1)).subscribe((frameworkDetails: any) => {
  //     if (frameworkDetails && !frameworkDetails.err) {
  //       // const frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
  //       // this.categoryMasterList = _.cloneDeep(frameworkDetails.frameworkdata[this.sessionContext.framework].categories);
  //       this.sessionContext.frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
  //       // this.sessionContext.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
  //     }
  //   });
  // }

  fetchCategoryDetails() {
    this.helperService.categoryMetaData$.pipe(take(1), takeUntil(this.onComponentDestroy$)).subscribe(data => {
      this.fetchFormconfiguration();
    });
    this.helperService.getCategoryMetaData(this.programContext.content_types[0], _.get(this.programContext, 'rootorg_id'), 'collection');
  }

  ngOnDestroy() {
    this.showEditMetaForm = false;
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
