import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ISessionContext, IChapterListComponentInput, IResourceTemplateComponentInput } from '../../../sourcing/interfaces';
import { ProgramTelemetryService } from '../../../program/services';
import { ConfigService, ResourceService, ToasterService} from '@sunbird/shared';
import { UserService, ProgramsService } from '@sunbird/core';
import { empty } from 'rxjs';

@Component({
  selector: 'app-resource-template',
  templateUrl: './resource-template.component.html',
  styleUrls: ['./resource-template.component.scss']
})
export class ResourceTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('modal') private modal;
  @ViewChild('questionTypeModal') questionTypeModal;
  @ViewChild('modeofcreationmodal') modeofcreationmodal;

  @Input() resourceTemplateComponentInput: IResourceTemplateComponentInput = {};
  @Output() templateSelection = new EventEmitter<any>();
  @Input() showResourceTemplateQTypePopup;
  showButton = false;
  showInteractiveQuestionTypes = true;
  showCuriosityQuestion = true;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public templateList;
  public templateSelected;
  public programContext;
  public sessionContext;
  public unitIdentifier;
  public telemetryPageId;
  public selectedtemplateDetails;
  public showModeofCreationModal = false;
  public showQuestionTypeModal = false;
  public defaultFileSize: any;
  public defaultVideoSize: any;
  constructor( public programTelemetryService: ProgramTelemetryService, public userService: UserService,
    public configService: ConfigService, public resourceService: ResourceService,
    private programsService: ProgramsService, private toasterService: ToasterService) {
      this.defaultFileSize = (<HTMLInputElement>document.getElementById('dockDefaultFileSize')) ?
      (<HTMLInputElement>document.getElementById('dockDefaultFileSize')).value : 150;
     this.defaultVideoSize =  (<HTMLInputElement>document.getElementById('dockDefaultVideoSize')) ?
     (<HTMLInputElement>document.getElementById('dockDefaultVideoSize')).value : 15000;
     }


  ngOnInit() {
    this.templateList = _.get(this.resourceTemplateComponentInput, 'templateList');
    this.programContext = _.get(this.resourceTemplateComponentInput, 'programContext');
    this.sessionContext = _.get(this.resourceTemplateComponentInput, 'sessionContext');
    this.unitIdentifier  = _.get(this.resourceTemplateComponentInput, 'unitIdentifier');
    this.telemetryPageId = this.sessionContext.telemetryPageDetails.telemetryPageId;
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = _.get(this.sessionContext, 'telemetryPageDetails.telemetryInteractCdata') || [];
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID );
     // tslint:disable-next-line:max-line-length
     this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.unitIdentifier, 'Content', '1.0', {l1: this.sessionContext.collection});
  }

  handleSubmit() {
    this.showResourceTemplateQTypePopup=false;
    this.programsService.getCategoryDefinition(this.templateSelected.name, this.programContext.rootorg_id, this.templateSelected.targetObjectType).subscribe((res) => {
      this.selectedtemplateDetails = res.result.objectCategoryDefinition;
      const catMetaData = this.selectedtemplateDetails.objectMetadata;
      if (_.isEmpty(_.get(catMetaData, 'schema.properties.mimeType.enum'))) {
          this.toasterService.error(this.resourceService.messages.emsg.m0026);
      } else {
        const supportedMimeTypes = catMetaData.schema.properties.mimeType.enum;
        const interactionTypes = _.get(catMetaData, 'schema.properties.interactionTypes.items.enum');
        //const supportedMimeTypes = ['application/vnd.ekstep.quml-archive', 'application/vnd.ekstep.h5p-archive'];

        let catEditorConfig = !_.isEmpty(_.get(catMetaData, 'config.sourcingConfig.editor')) ? catMetaData.config.sourcingConfig.editor : [];
        let appEditorConfig = this.configService.contentCategoryConfig.sourcingConfig.editor;

        const editorTypes = [];
        let tempEditors = _.map(supportedMimeTypes, (mimetype) => {
          const editorObj = _.filter(catEditorConfig, {"mimetype": mimetype});
          if (!_.isEmpty(editorObj)) {
              editorTypes.push(...editorObj);
              //return editorObj.type;
          } else {
            const editorObj = _.filter(appEditorConfig, {"mimetype": mimetype});
            if (!_.isEmpty(editorObj)) {
              editorTypes.push(...editorObj);
              //return editorObj.type;
            }
          }
        });
        let modeOfCreation = _.map(editorTypes, 'type');
        modeOfCreation = _.uniq(modeOfCreation);
        this.selectedtemplateDetails["editors"] = editorTypes;
        this.selectedtemplateDetails["editorTypes"] = _.uniq(modeOfCreation);
        this.selectedtemplateDetails["interactionTypes"] = interactionTypes;
        if (modeOfCreation.length > 1) {
          this.showModeofCreationModal = true;
          this.showQuestionTypeModal = false;
        } else {
          this.selectedtemplateDetails["modeOfCreation"] = modeOfCreation[0];
          if (this.selectedtemplateDetails["modeOfCreation"] === 'question') {
            const temp = _.find(editorTypes, {'type': 'question'});
            if (temp.mimetype === 'application/vnd.sunbird.question') {
              this.showCuriosityQuestion = false;
              this.showInteractiveQuestionTypes = false;
            }
            this.showModeofCreationModal = false;
            this.showQuestionTypeModal = true;
            if(this.selectedtemplateDetails["interactionTypes"][0] === "choice") {
              this.showQuestionTypeModal = false;
              this.submit();
            }
          } else {
            this.submit();
          }
        }
      }
    }, (err) => {
      this.toasterService.error(this.resourceService.messages.emsg.m0027);
      return false;
    });
  }

  setModeOfCreation(mode) {
    this.selectedtemplateDetails["modeOfCreation"] = mode;
  }

  handleModeOfCreation() {
    if (this.selectedtemplateDetails["modeOfCreation"] === 'question') {
      this.showModeofCreationModal = false;
      this.showQuestionTypeModal = true;
    } else {
      this.submit();
    }
  }

  setQuestionType(questionType) {
    this.selectedtemplateDetails['questionCategory'] = questionType;
  }

  submit() {
    this.showModeofCreationModal = false;
    this.showQuestionTypeModal = false;
    switch (this.selectedtemplateDetails['modeOfCreation']) {
      case 'questionset':
        this.selectedtemplateDetails.onClick = 'questionSetEditorComponent';
        this.selectedtemplateDetails.mimeType = ['application/vnd.sunbird.questionset'];
        break;
      case 'question':
        this.selectedtemplateDetails.onClick = 'questionSetComponent';
        const temp = _.find(this.selectedtemplateDetails.editors, {'type': 'question'});
        if(temp.mimetype === 'application/vnd.sunbird.question') {
          this.selectedtemplateDetails.onClick = 'questionSetEditorComponent';
        }
        this.selectedtemplateDetails.mimeType = [temp.mimetype];
        break;
      case 'ecml':
        this.selectedtemplateDetails.onClick = 'editorComponent';
        this.selectedtemplateDetails.mimeType = ['application/vnd.ekstep.ecml-archive'];
        break;
      case 'upload':
      default:
        this.selectedtemplateDetails.onClick  = 'uploadComponent';
        this.selectedtemplateDetails.mimeType = _.map(this.selectedtemplateDetails.editors, 'mimetype');
        break;
    }

    const appEditorConfig = this.configService.contentCategoryConfig.sourcingConfig.files;
    const filesConfig =  _.map(this.selectedtemplateDetails.mimeType, (mimetype) => {
        return appEditorConfig[mimetype];
    });

    this.selectedtemplateDetails['filesConfig'] = {};
    this.selectedtemplateDetails.filesConfig['accepted'] = (!_.isEmpty(filesConfig)) ? _.join(_.compact(filesConfig), ', ') : '';
    this.selectedtemplateDetails.filesConfig['size'] = {
      defaultfileSize:  this.defaultFileSize,
      defaultVideoSize: this.defaultVideoSize
    };
    this.templateSelection.emit({ type: 'next', template: this.templateSelected, templateDetails: this.selectedtemplateDetails });
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
    if (this.modeofcreationmodal) {
      this.modeofcreationmodal.deny();
    }
    if (this.questionTypeModal) {
      this.questionTypeModal.deny();
    }
  }

}
