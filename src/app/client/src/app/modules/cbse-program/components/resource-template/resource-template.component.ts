import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ISessionContext, IChapterListComponentInput, IResourceTemplateComponentInput } from '../../interfaces';
import { ProgramTelemetryService } from '../../../program/services';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';

@Component({
  selector: 'app-resource-template',
  templateUrl: './resource-template.component.html',
  styleUrls: ['./resource-template.component.scss']
})
export class ResourceTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('modal') private modal;
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
  constructor( public programTelemetryService: ProgramTelemetryService, public userService: UserService,
    public configService: ConfigService, public resourceService: ResourceService) { }


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
    this.selectedtemplateDetails = _.find(this.templateList, (template) => {
     return template.identifier === this.templateSelected;
    });
    const catEditors = [];
    const catMimeTypes = this.selectedtemplateDetails.metadata.schema.properties.mimeType.enum;
    let modeOfCreation = _.map(catMimeTypes, (mimetype) => {
       const editorObj = _.find(this.configService.contentCategoryConfig.sourcingConfig.editor, {"mimetype": mimetype});
       if (editorObj) {
        catEditors.push(editorObj);
          return editorObj.target;
       }
    });
    this.selectedtemplateDetails["editors"] = catEditors;

    modeOfCreation = _.uniq(modeOfCreation);
    if (modeOfCreation.length > 1) {
      this.showModeofCreationModal = true;
    } else {
      this.selectedtemplateDetails["modeOfCreation"] = modeOfCreation;
      this.templateSelection.emit({ type: 'next', template: this.templateSelected, templateDetails: this.selectedtemplateDetails });
    }
  }

  handleModeOfCreation(mode) {
    this.selectedtemplateDetails["modeOfCreation"] = mode;
    this.templateSelection.emit({ type: 'next', template: this.templateSelected, templateDetails: this.selectedtemplateDetails });
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
