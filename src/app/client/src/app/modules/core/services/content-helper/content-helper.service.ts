import { Injectable } from '@angular/core';
import { ConfigService } from '@sunbird/shared';
import { UserService, ActionService } from '@sunbird/core';
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

  constructor(private configService: ConfigService, private programComponentsService: ProgramComponentsService,
    private programStageService: ProgramStageService, private userService: UserService, private helperService: HelperService,
    public actionService: ActionService, public activatedRoute: ActivatedRoute, private sourcingService: SourcingService) { }

    initialize(programDetails, sessionContext) {
      this._sessionContext = _.cloneDeep(sessionContext);
      this._programDetails = programDetails;
      this.setSharedProperties();
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
            // tslint:disable-next-line:max-line-length
            this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
          });
      } else if (event.templateDetails) {
        this._templateDetails = event.templateDetails;
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
      this._templateDetails.filesConfig['size'] = this.configService.contentCategoryConfig.sourcingConfig.defaultfileSize;
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
    setSharedProperties() {
      this._selectedSharedContext = this._programDetails.config.sharedContext.reduce((obj, context) => {
        return {...obj, [context]: this.getSharedContextObjectProperty(context)};
      }, {});
    }
    getSharedContextObjectProperty(property) {
      let ret;
      switch (property) {
        case 'channel':
          ret =  _.get(this._programDetails, 'rootorg_id');
          break;
        case 'topic':
          ret = null;
          break;
        default:
          ret =  _.get(this._programDetails, `config.${property}`);
          break;
      }
      if (_.includes(['gradeLevel', 'medium', 'subject'], property)) {
        ret = _.isArray(ret) ? ret : _.split(ret, ',');
      }
      return ret || null;

      /*if (property === 'channel') {
         return _.get(this.programDetails, 'rootorg_id');
      } else if ( property === 'topic' ) {
        return null;
      } else {
        const collectionComComponent = _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.collection' });
        const filters =  collectionComComponent.config.filters;
        const explicitProperty =  _.find(filters.explicit, {'code': property});
        const implicitProperty =  _.find(filters.implicit, {'code': property});
        return (implicitProperty) ? implicitProperty.range || implicitProperty.defaultValue :
         explicitProperty.range || explicitProperty.defaultValue;
      }*/
    }
    setFrameworkCategories() {
      this._sessionContext.targetCollectionFrameworksData = {};
      // tslint:disable-next-line:max-line-length
      this._sessionContext.targetCollectionFrameworksData['framework'] = _.isArray(this._programDetails.config.framework) ? _.first(this._programDetails.config.framework): this._programDetails.config.framework;
    }
    setNominationDetails(nominationDetails){
      this._sessionContext.nominationDetails = nominationDetails;
    }
}
