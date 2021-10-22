import { Injectable } from '@angular/core';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { UserService, ActionService , ProgramsService} from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';
import { throwError, BehaviorSubject, Observable} from 'rxjs';
import { map, catchError, skipWhile } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { ProgramComponentsService } from '../../../contribute/services/program-components/program-components.service';
import { ProgramStageService, ProgramTelemetryService} from '../../../program/services';
import { ISessionContext } from '../../../contribute/interfaces';
import { HelperService, SourcingService } from '../../../sourcing/services';
import { UUID } from 'angular2-uuid';


@Injectable({
  providedIn: 'root'
})
export class ContentHelperService {
  private _contentId: any;
  private _templateDetails: any;
  private _sessionContext: ISessionContext = {};
  private _programDetails: any;
  private _component: any;
  private _dynamicInputs: any;
  private _telemetryPageId: any;
  private _telemetryInteractCdata: any;
  private _selectedSharedContext: any;
  private _dynamicInputs$ = new BehaviorSubject(undefined);
  public readonly dynamicInputs$: Observable<any> = this._dynamicInputs$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  private _component$ = new BehaviorSubject(undefined);
  public readonly currentOpenedComponent$: Observable<any> = this._component$
    .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  public defaultFileSize: any;
  public defaultVideoSize: any;
  constructor(private configService: ConfigService, private programComponentsService: ProgramComponentsService,
    private programStageService: ProgramStageService, private userService: UserService, private helperService: HelperService,
    private programsService: ProgramsService, public resourceService: ResourceService, 
    public actionService: ActionService, public activatedRoute: ActivatedRoute, private sourcingService: SourcingService) {
      this.defaultFileSize = (<HTMLInputElement>document.getElementById('dockDefaultFileSize')) ?
      (<HTMLInputElement>document.getElementById('dockDefaultFileSize')).value : 150;
     this.defaultVideoSize =  (<HTMLInputElement>document.getElementById('dockDefaultVideoSize')) ?
     (<HTMLInputElement>document.getElementById('dockDefaultVideoSize')).value : 15000;
     }

    initialize(programDetails, sessionContext) {
      this._sessionContext = _.cloneDeep(sessionContext);
      this._programDetails = programDetails;
      this._selectedSharedContext = _.get(this._sessionContext, 'selectedSharedProperties');
      this.setFrameworkCategories();
      this._telemetryPageId = _.get(this.activatedRoute,'snapshot.data.telemetry.pageid');
      // tslint:disable-next-line:max-line-length
      this._telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}, {id: programDetails.program_id, type: 'project'}];
    }

    get currentOpenedComponent() {
      return this._component;
    }
    set currentOpenedComponent(component) {
      this._component = component;
      this._component$.next(component);
    }
    get dynamicComponentsInput() {
      return this._dynamicInputs;
    }
    set dynamicComponentsInput(input) {
      this._dynamicInputs = input;
      this._dynamicInputs$.next(input);
    }
    set currentProgramDetails(programDetails) {
      this._programDetails = programDetails;
    }
    handleContentCreation(event) {
      this._sessionContext['templateDetails'] =  event.templateDetails;
      if (event.template && event.templateDetails && !(event.templateDetails.onClick === 'uploadComponent')) {
        const creationInput  = {
          sessionContext: this._sessionContext,
          templateDetails: event.templateDetails,
          selectedSharedContext: this._selectedSharedContext,
          action: 'creation',
          programContext: this._programDetails,
        }
        const createContentReq = this.helperService.createContent(creationInput);
        createContentReq.pipe(map((res: any) => res.result), catchError(
          err => {
           const errInfo = {
            errorMsg: 'Unable to create contentId, Please Try Again',
            telemetryPageId: this._telemetryPageId,
            telemetryCdata : this._telemetryInteractCdata,
            env : this.activatedRoute.snapshot.data.telemetry.env,
            request: {}
          };
          return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
          }))
          .subscribe(result => {
            this._contentId = result.identifier;
            this.programsService.emitHeaderEvent(false);
            // tslint:disable-next-line:max-line-length
            this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
          });
      } else if (event.templateDetails) {
        this._templateDetails = event.templateDetails;
        this.programsService.emitHeaderEvent(false);
        // tslint:disable-next-line:max-line-length
        this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
      }
    }
    openContent(content) {
      this._contentId = content.identifier;
      this._templateDetails = {
        'name' : content.primaryCategory
      };
      const appEditorConfig = this.configService.contentCategoryConfig.sourcingConfig.files;
      const acceptedFile = appEditorConfig[content.mimeType];
      this._templateDetails['filesConfig'] = {};
      this._templateDetails.filesConfig['accepted'] = acceptedFile || '';
      this._templateDetails.filesConfig['size'] = {
        defaultfileSize:  this.defaultFileSize,
        defaultVideoSize: this.defaultVideoSize
      };
      this._templateDetails.questionCategories = content.questionCategories;
      if (content.mimeType === 'application/vnd.ekstep.ecml-archive' && !_.isEmpty(content.questionCategories)) {
        this._templateDetails.onClick = 'questionSetComponent';
      } else if (content.mimeType === 'application/vnd.ekstep.ecml-archive' && _.isEmpty(content.questionCategories)) {
        this._templateDetails.onClick = 'editorComponent';
      } else if (content.mimeType === 'application/vnd.ekstep.quml-archive') {
        this._templateDetails.onClick = 'questionSetComponent';
      } else if (content.mimeType === 'application/vnd.sunbird.questionset'){
        this._templateDetails.onClick = 'questionSetEditorComponent';
      } else {
        this._templateDetails.onClick = 'uploadComponent';
      }
      this.programsService.emitHeaderEvent(false);
      this.componentLoadHandler('preview',
      // tslint:disable-next-line:max-line-length
      this.programComponentsService.getComponentInstance(this._templateDetails.onClick), this._templateDetails.onClick, {'content': content});
    }
    componentLoadHandler(action, component, componentName, event?) {
      this.initiateInputs(action, (event ? event.content : undefined));
      this.currentOpenedComponent = component;
      this.programStageService.addStage(componentName);
    }
    initiateInputs(action?, content?) {
      // this.showLoader = false;
      const sourcingStatus = !_.isUndefined(content) ? content.sourcingStatus : null;
      this._sessionContext.programId = this._programDetails.program_id;
      this._sessionContext.telemetryPageDetails = {
        telemetryPageId : this.configService.telemetryLabels.pageId.contribute.submitNomination,
        telemetryInteractCdata: this._telemetryInteractCdata
      };
      this.dynamicComponentsInput = {
        contentUploadComponentInput: {
          config: _.find(this._programDetails.config.components, {'id': 'ng.sunbird.uploadComponent'}),
          sessionContext: this._sessionContext,
          templateDetails: this._templateDetails,
          selectedSharedContext: this._selectedSharedContext,
          contentId: this._contentId,
          action: action,
          programContext: this._programDetails,
          sourcingStatus: sourcingStatus,
          content: content,
        },
        practiceQuestionSetComponentInput: {
          config: _.find(this._programDetails.config.components, {'id': 'ng.sunbird.practiceSetComponent'}),
          sessionContext: this._sessionContext,
          templateDetails: this._templateDetails,
          selectedSharedContext: this._selectedSharedContext,
          contentIdentifier: this._contentId,
          action: action,
          programContext: this._programDetails,
          sourcingStatus: sourcingStatus,
          content: content
        },
        contentEditorComponentInput: {
          contentId: this._contentId,
          action: action,
          content: content,
          sessionContext: this._sessionContext,
          programContext: this._programDetails,
          sourcingStatus: sourcingStatus,
          selectedSharedContext: this._selectedSharedContext,
        },
        questionSetEditorComponentInput: {
          contentId: this._contentId,
          action: action,
          content: content,
          sessionContext: this._sessionContext,
          programContext: this._programDetails,
          sourcingStatus: sourcingStatus,
          selectedSharedContext: this._selectedSharedContext,
        }
      };
    }
    setFrameworkCategories() {
      this._sessionContext.targetCollectionFrameworksData = {};
      // tslint:disable-next-line:max-line-length
      this._sessionContext.targetCollectionFrameworksData['framework'] = _.isArray(this._programDetails.config.framework) ? _.first(this._programDetails.config.framework): this._programDetails.config.framework;
    }
    setNominationDetails(nominationDetails){
      this._sessionContext.nominationDetails = nominationDetails;
    }
    hasAccessFor(roles: Array<string>, currentRoles) {
      return !_.isEmpty(_.intersection(roles, currentRoles || []));
    }
    shouldContentBeVisible(content, programDetails, currentNominationStatus?, currentRoles?) {
      const sourcingInstance = this.programsService.ifSourcingInstance() ? true : false;
      if (sourcingInstance) {
        const isSourcingOrgReviewer = this.userService.isSourcingOrgReviewer(programDetails);
        if (isSourcingOrgReviewer && (content.status === 'Live'|| (content.prevStatus === 'Live' && content.status === 'Draft' ))) {
          return true;
        } else {
          return false;
        }
      } else {
        const hasAccessForContributor =  this.hasAccessFor(['CONTRIBUTOR'], currentRoles);
        const hasAccessForReviewer =  this.hasAccessFor(['REVIEWER'], currentRoles);
        const hasAccessForBoth =  hasAccessForContributor && hasAccessForReviewer;
        const currentUserID = this.userService.userid;
        const contributingOrgAdmin = this.userService.isContributingOrgAdmin();
        const myOrgId = (this.userService.userRegistryData
          && this.userService.userProfile.userRegData
          && this.userService.userProfile.userRegData.User_Org
          && this.userService.userProfile.userRegData.User_Org.orgId) ? this.userService.userProfile.userRegData.User_Org.orgId : '';
        if ((currentNominationStatus && _.includes(['Approved', 'Rejected'], currentNominationStatus))
          && content.sampleContent === true) {
          return false;
        // tslint:disable-next-line:max-line-length
        } else if (hasAccessForBoth) {
          if (( (_.includes(['Review', 'Live'], content.status) || (content.prevStatus === 'Live' && content.status === 'Draft' ) || (content.prevStatus === 'Review' && content.status === 'Draft' )) && currentUserID !== content.createdBy && content.organisationId === myOrgId) || currentUserID === content.createdBy) {
            return true;
          } else if (content.status === 'Live' && content.sourceURL) {
            return true;
          }
        } else if (hasAccessForReviewer && (content.status === 'Review' || content.status === 'Live' || (content.prevStatus === 'Review' && content.status === 'Draft' ) || (content.prevStatus === 'Live' && content.status === 'Draft' ))
        && currentUserID !== content.createdBy
        && content.organisationId === myOrgId) {
          return true;
        } else if (hasAccessForContributor && currentUserID === content.createdBy) {
          return true;
        } else if (contributingOrgAdmin && content.organisationId === myOrgId) {
          return true;
        } else if (content.status === 'Live' && content.sourceURL) {
          return true;
        }
        return false;
      }
    }
    checkSourcingStatus(content, programDetails) {
      if (programDetails.acceptedcontents  &&
           _.includes(programDetails.acceptedcontents || [], content.identifier)) {
              return 'Approved';
        } else if (programDetails.rejectedcontents  &&
                _.includes(programDetails.rejectedcontents || [], content.identifier)) {
              return 'Rejected';
        } else if (content.status === 'Draft' && content.prevStatus === 'Live') {
              return 'PendingForCorrections';
        } else {
          return null;
        }
    }
    getContentDisplayStatus(content) {
      const resourceStatus = content.status;
      const sourcingStatus = content.sourcingStatus;
      const prevStatus = content.prevStatus;
      let resourceStatusText,resourceStatusClass;
      if (resourceStatus === 'Review') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.reviewInProgress;
        resourceStatusClass = 'sb-color-primary';
      } else if (resourceStatus === 'Draft' && prevStatus === 'Review') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.notAccepted;
        resourceStatusClass = 'sb-color-error';
      } else if (resourceStatus === 'Draft' && prevStatus === 'Live') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.correctionsPending;
        resourceStatusClass = 'sb-color-primary';
      } else if (resourceStatus === 'Live' && _.isEmpty(sourcingStatus)) {
        resourceStatusText = this.resourceService.frmelmnts.lbl.approvalPending;
        resourceStatusClass = 'sb-color-warning';
      } else if ( sourcingStatus=== 'Rejected') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.rejected;
        resourceStatusClass = 'sb-color-error';
      } else if (sourcingStatus === 'Approved') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.approved;
        resourceStatusClass = 'sb-color-success';
      } else if (resourceStatus === 'Failed') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.failed;
        resourceStatusClass = 'sb-color-error';
      } else if (resourceStatus === 'Processing') {
        resourceStatusText = this.resourceService.frmelmnts.lbl.processing;
        resourceStatusClass = '';
      } else {
        resourceStatusText = resourceStatus;
        resourceStatusClass = 'sb-color-gray-400';
      }
      return [resourceStatusText, resourceStatusClass];
    }
}
