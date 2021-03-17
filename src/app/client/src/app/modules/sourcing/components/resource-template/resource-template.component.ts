import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ISessionContext, IChapterListComponentInput, IResourceTemplateComponentInput } from '../../interfaces';
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

  @ViewChild('modal', {static: false}) private modal;
  @ViewChild('questionTypeModal', {static: false}) questionTypeModal;
  @ViewChild('modeofcreationmodal', {static: false}) modeofcreationmodal;

  @Input() resourceTemplateComponentInput: IResourceTemplateComponentInput = {};
  @Output() templateSelection = new EventEmitter<any>();
  showButton = false;
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
  constructor( public programTelemetryService: ProgramTelemetryService, public userService: UserService,
    public configService: ConfigService, public resourceService: ResourceService,
    private programsService: ProgramsService, private toasterService: ToasterService) { }


  ngOnInit() {
    this.templateList = _.get(this.resourceTemplateComponentInput, 'templateList');
    console.log(this.templateList);
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
    this.programsService.getCategoryDefinition(this.templateSelected, this.programContext.rootorg_id).subscribe((res) => {
      this.selectedtemplateDetails = res.result.objectCategoryDefinition;
      const catMetaData = this.selectedtemplateDetails.objectMetadata;
      if (_.isEmpty(_.get(catMetaData, 'schema.properties.mimeType.enum'))) {
          this.toasterService.error(this.resourceService.messages.emsg.m0026);
      } else {
        const supportedMimeTypes = catMetaData.schema.properties.mimeType.enum;
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
        if (modeOfCreation.length > 1) {
          this.showModeofCreationModal = true;
          this.showQuestionTypeModal = false;
        } else {
          this.selectedtemplateDetails["modeOfCreation"] = modeOfCreation[0];
          if (this.selectedtemplateDetails["modeOfCreation"] === 'question') {
            this.showModeofCreationModal = false;
            this.showQuestionTypeModal = true;
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
    this.selectedtemplateDetails.filesConfig['size'] = this.configService.contentCategoryConfig.sourcingConfig.defaultfileSize;
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
