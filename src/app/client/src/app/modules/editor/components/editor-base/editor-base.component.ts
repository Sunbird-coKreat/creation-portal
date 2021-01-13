import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryService, IImpressionEventInput, IStartEventInput, IEndEventInput } from '@sunbird/telemetry';
import { TreeService, EditorService, HelperService } from '../../services';
import { templateList, toolbarConfig, reviewerToolbarConfig } from '../../editor.config';
import { CbseProgramService } from '../../../cbse-program/services';
import { ProgramsService, UserService } from '@sunbird/core';
import { ConfigService, ToasterService, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { ProgramTelemetryService } from '../../../program/services';

interface IeditorParams {
  collectionId: string;
  type?: string;
}
@Component({
  selector: 'app-editor-base',
  templateUrl: './editor-base.component.html',
  styleUrls: ['./editor-base.component.scss']
})
export class EditorBaseComponent implements OnInit, AfterViewInit {

  public telemetryImpression: IImpressionEventInput;
  public telemetryPageDetails: any = {};
  public telemetryPageId: string;
  public impressionEventTriggered: Boolean = false;
  public telemetryStart: IStartEventInput;
  public telemetryEnd: IEndEventInput;
  public toolbarConfig: any;
  public templateList: any;
  public collectionTreeNodes: any;
  public selectedQuestionData: any = {};
  public showQuestionTemplate: Boolean = false;
  public editorParams: IeditorParams;
  public showLoader: Boolean = true;
  public showQuestionTemplatePopup: Boolean = false;
  public showConfirmPopup: Boolean = false;
  public submitFormStatus: Boolean = false;
  public pageStartTime;
  public rootObject = 'QuestionSet';
  public childObject = 'Question';
  public mode = 'create';

  constructor(public programTelemetryService: ProgramTelemetryService, private treeService: TreeService,
    private editorService: EditorService, private activatedRoute: ActivatedRoute, private cbseService: CbseProgramService,
    private userService: UserService, private programsService: ProgramsService, private navigationHelperService: NavigationHelperService,
    private configService: ConfigService, private toasterService: ToasterService, public resourceService: ResourceService,
    private router: Router, private telemetryService: TelemetryService, private deviceDetectorService: DeviceDetectorService,
    public helperService: HelperService, private cdr: ChangeDetectorRef) {
    this.editorParams = {
      collectionId: _.get(this.activatedRoute, 'snapshot.params.questionSetId'),
    };
  }

  ngOnInit() {
    if (this.mode === 'review') {
      this.toolbarConfig = reviewerToolbarConfig;
    } else if (this.mode === 'create') {
      this.toolbarConfig = toolbarConfig;
    }
    this.pageStartTime = Date.now();
    this.prepareTelemetryEvents();
    this.fetchQuestionSetHierarchy();
    this.helperService.initialize();
  }

  prepareTelemetryEvents() {
    this.telemetryPageDetails.telemetryPageId = this.getPageId();
    this.telemetryPageDetails.telemetryInteractCdata = [
      { id: this.userService.channel, type: 'sourcing_organization' },
      // { id: '', type: 'project' },
      // { id: '', type: 'linked_collection' } // TODO: Check
    ];
    // tslint:disable-next-line:max-line-length
    this.telemetryPageDetails.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID);
    // tslint:disable-next-line:max-line-length
    this.telemetryPageDetails.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.editorParams.collectionId, 'Content', '1.0');
    this.setTelemetryStartData();
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryPageDetails.telemetryInteractCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime(),
        }
      };
    });
  }

  setTelemetryStartData() {
    const deviceInfo = this.deviceDetectorService.getDeviceInfo();
    setTimeout(() => {
      this.telemetryStart = {
        object: {
          id: this.editorParams.collectionId || '',
          type: 'question_set',
        },
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: this.telemetryPageDetails.telemetryInteractCdata || [],
        },
        edata: {
          type: this.configService.telemetryLabels.pageType.editor || '',
          pageid: this.telemetryPageId,
          uaspec: {
            agent: deviceInfo.browser,
            ver: deviceInfo.browser_version,
            system: deviceInfo.os_version,
            platform: deviceInfo.os,
            raw: deviceInfo.userAgent
          }
        }
      };
    });
  }

  generateTelemetryEndEvent(eventMode) {
    this.telemetryEnd = {
      object: {
        id: this.editorParams.collectionId || '',
        type: 'question_set',
      },
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env,
        cdata: this.telemetryPageDetails.telemetryInteractCdata || [],
      },
      edata: {
        type: this.configService.telemetryLabels.pageType.editor || '',
        pageid: this.telemetryPageId,
        mode: eventMode || '',
        duration: _.toString((Date.now() - this.pageStartTime) / 1000)
      }
    };
    this.telemetryService.end(this.telemetryEnd);
  }

  logTelemetryImpressionEvent() {
    if (this.impressionEventTriggered) { return false; }
    this.impressionEventTriggered = true;
    const telemetryImpression = _.cloneDeep(this.telemetryImpression);
    telemetryImpression.edata.visits = _.map(this.collectionTreeNodes.children, (question) => {
      return { objid: question.identifier, objtype: 'question' };
    });
    this.telemetryService.impression(telemetryImpression);
  }


  fetchQuestionSetHierarchy() {
    this.editorService.getQuestionSetHierarchy(this.editorParams.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Fetching question set details failed. Please try again...',
      };
      return throwError(this.cbseService.apiErrorHandling(error, errInfo));
    }), finalize(() => {
      this.showLoader = false;
      this.logTelemetryImpressionEvent();
    })).subscribe(res => {
      if (_.isUndefined(this.editorService.hierarchyConfig)) {
        // tslint:disable-next-line:max-line-length
        this.programsService.getCategoryDefinition(res.primaryCategory, this.userService ? this.userService.channel : null, this.rootObject).subscribe((categoryDefRes) => {
          console.log('categoryDefRes ', categoryDefRes);
          const objectMetadata = categoryDefRes.result.objectCategoryDefinition.objectMetadata;
          if (!_.isEmpty(_.get(objectMetadata, 'config.hierarchyConfig'))) {
            this.editorService.hierarchyConfig = objectMetadata.config.hierarchyConfig;
          } else {
            this.editorService.hierarchyConfig = {
              'maxDepth': 1,
              'children': {
                  'Question': ['Multiple Choice Question', 'Subjective Question']
              }
            };
          }
          this.templateList = this.editorService.hierarchyConfig.children[this.childObject];
        }, (err) => {
          this.toasterService.error(this.resourceService.messages.emsg.m0027);
        });
      } else {
        this.templateList = this.editorService.hierarchyConfig.children[this.childObject];
      }
      this.toolbarConfig.title = res.name;
      this.collectionTreeNodes = res;
      this.cdr.detectChanges();
      if (_.isEmpty(res.children)) {
        if (this.mode === 'create') {
          this.hideButton('submitCollection');
        }
      } else {
          if (this.mode === 'create') {
            this.showButton('submitCollection');
          }
      }
    });
  }

  toolbarEventListener(event) {
    switch (event.button.type) {
      case 'saveCollection':
        this.saveCollection();
        break;
      case 'submitCollection':
        this.submitHandler();
        break;
      case 'removeContent':
        this.removeNode();
        break;
      case 'editContent':
        this.redirectToQuestionTab('edit');
        break;
      case 'showQuestionTemplate':
        this.showQuestionTemplatePopup = true;
        break;
      case 'onFormChange':
        this.submitFormStatus = event.event.isValid;
        break;
      case 'publishCollection':
        this.publishCollection();
        break;
      case 'rejectCollection':
        this.rejectCollection();
        break;
      default:
        break;
    }
  }

  saveCollection() {
    this.editorService.updateQuestionSetHierarchy()
      .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
        this.treeService.replaceNodeId(response.identifiers);
        this.treeService.clearTreeCache();
        this.toasterService.success('Question set updated successfully');
      });
  }

  submitHandler() {
    if (!this.submitFormStatus) {
      this.toasterService.error('Please fill the required metadata');
      return false;
    }
    this.showConfirmPopup = true;
  }

  submitCollection() {
    this.editorService.sendQuestionSetForReview(this.editorParams.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Sending question set for review failed. Please try again...',
      };
      return throwError(this.cbseService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.showConfirmPopup = false;
      this.generateTelemetryEndEvent('submit');
      this.toasterService.success('Question set sent for review');
    });
  }

  publishCollection() {
    this.editorService.publishQuestionSet(this.editorParams.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Publishing question set failed. Please try again...',
      };
      return throwError(this.cbseService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.showConfirmPopup = false;
      this.generateTelemetryEndEvent('submit');
      this.toasterService.success('Question set published successfully');
    });
  }

  rejectCollection() {
    this.editorService.rejectQuestionSet(this.editorParams.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Rejecting question set failed. Please try again...',
      };
      return throwError(this.cbseService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.showConfirmPopup = false;
      this.generateTelemetryEndEvent('submit');
      this.toasterService.success('Question set rejected successfully');
    });
  }

  removeNode() {
    this.treeService.removeNode();
  }

  treeEventListener(event: any) {
    switch (event.type) {
      case 'nodeSelect':
        this.selectedQuestionData = event.data;
        console.log(this.selectedQuestionData);
        break;
      default:
        break;
    }
  }

  handleTemplateSelection($event) {
    const selectedQuestionType = $event;
    if (selectedQuestionType === 'close') { return false; }
    console.log(selectedQuestionType);
    // tslint:disable-next-line:max-line-length
    this.programsService.getCategoryDefinition(selectedQuestionType, this.userService ? this.userService.channel : null, this.childObject).subscribe((res) => {
      const selectedtemplateDetails = res.result.objectCategoryDefinition;
      const catMetaData = selectedtemplateDetails.objectMetadata;
      if (_.isEmpty(_.get(catMetaData, 'schema.properties.interactionTypes.items.enum'))) {
          // this.toasterService.error(this.resourceService.messages.emsg.m0026);
          this.editorService.selectedChildren = {
            primaryCategory: selectedQuestionType,
            mimeType: catMetaData.schema.properties.mimeType.enum[0],
            interactionType: null
          };
          this.redirectToQuestionTab(undefined, 'default');
      } else {
        const interactionTypes = catMetaData.schema.properties.interactionTypes.items.enum;
        this.editorService.selectedChildren = {
          primaryCategory: selectedQuestionType,
          mimeType: catMetaData.schema.properties.mimeType.enum[0],
          interactionType: interactionTypes[0]
        };
        this.redirectToQuestionTab(undefined, interactionTypes[0]);
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0027);
    });
  }

  redirectToQuestionTab(mode?, interactionType?) {
    let queryParams = '?';
    if (interactionType) {
      queryParams += `type=${interactionType}`;
    }
    if (mode === 'edit' && this.selectedQuestionData.data.metadata.identifier) {
      queryParams += `questionId=${this.selectedQuestionData.data.metadata.identifier}`;
    }
    this.router.navigateByUrl(`/create/questionSet/${this.editorParams.collectionId}/question${queryParams}`);
  }

  showButton(buttonType) {
    const buttonIndex = _.findIndex(this.toolbarConfig.buttons, {type: buttonType});
    this.toolbarConfig.buttons[buttonIndex].display = 'display';
  }

  hideButton(buttonType) {
    const buttonIndex = _.findIndex(this.toolbarConfig.buttons, {type: buttonType});
    this.toolbarConfig.buttons[buttonIndex].display = 'none';
  }
}
