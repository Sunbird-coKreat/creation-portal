import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash-es';
import { ToasterService, ConfigService, ResourceService} from '@sunbird/shared';
import { ActionService} from '@sunbird/core';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute} from '@angular/router';
import { throwError } from 'rxjs';
import { SourcingService } from '../../services';
import { ProgramTelemetryService } from '../../../program/services';

@Component({
  selector: 'app-accessibility-info',
  templateUrl: './accessibility-info.component.html',
  styleUrls: ['./accessibility-info.component.scss']
})
export class AccessibilityInfoComponent implements OnInit, OnDestroy {

  @ViewChild('accessibilityModel') private accessibilityModel;
  @Input() accessibilityInput: any;
  @Output() accessibilityEmitter = new EventEmitter<any>();
  public accessibilityFormFields: any;
  public accessibilitySubmitBtn = false;
  public sunbirdAccessibilityGuidelinesUrl: string;
  public selectedAccessibility: any = [];
  public showModal = false;
  constructor(
    public configService: ConfigService, public toasterService: ToasterService, public actionService: ActionService,
    public resourceService: ResourceService, public activeRoute: ActivatedRoute, private sourcingService: SourcingService,
    public programTelemetryService: ProgramTelemetryService
    ) {
    this.sunbirdAccessibilityGuidelinesUrl = (<HTMLInputElement>document.getElementById('sunbirdAccessibilityGuidelinesUrl')) ?
      (<HTMLInputElement>document.getElementById('sunbirdAccessibilityGuidelinesUrl')).value : '';
   }

  ngOnInit(): void {
    this.accessibilitySubmitBtn = !(_.some(this.accessibilityInput.accessibilityFormFields, {'required': true }));
    this.accessibilityFormFields = _.groupBy(this.accessibilityInput.accessibilityFormFields, 'need');
    this.selectedAccessibility = [...this.accessibilityInput.selectedAccessibility];
    this.validateAccessibilityModal();
    this.showModal = true;
  }

  createCheckedArray(checkedItem, $event: any) {
    if ($event.target.checked) {
      this.selectedAccessibility.push(checkedItem);
    } else {
      this.selectedAccessibility.splice(_.findIndex(this.selectedAccessibility, _.pick(checkedItem, ['feature'])), 1);
    }
    this.validateAccessibilityModal();
  }

  validateAccessibilityModal() {
    const isNotEditable =  _.every(this.accessibilityInput.accessibilityFormFields, {'editable': false });
    if (isNotEditable) {
      this.accessibilitySubmitBtn = false;
      return;
    }
    const fields = _.flatMap(_.cloneDeep(this.accessibilityInput.accessibilityFormFields));
    this.accessibilitySubmitBtn = _.every(_.filter(fields, (item) => item.required), (item) => {
        return (item.required && _.findIndex(this.selectedAccessibility,  _.pick(item, ['feature'])) !== -1 );
    });
  }

  submitAccessibilityForm() {
    const requestBody = {
      url: `${this.configService.urlConFig.URLS.CONTENT.UPDATE}/${this.accessibilityInput.contentId}`,
      data: {
        request : {
          content : {
            versionKey : this.accessibilityInput.contentMetaData.versionKey,
            accessibility: _.map(this.selectedAccessibility, (item) => _.pick(item, ['need', 'feature']))
          }
        }
      }
    };
    this.actionService.patch(requestBody).pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = {
          errorMsg: 'Something went wrong while updating the accessibility details',
          telemetryPageId: this.accessibilityInput.telemetryPageId,
          telemetryCdata : this.accessibilityInput.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
          request: requestBody
        };
        return throwError(this.sourcingService.apiErrorHandling(err, errInfo));
    })).subscribe( result => {
      this.toasterService.success('Accessibility details updated successfully...');
      this.redirect('submit');
    });
  }

  redirect(type) {
    this.accessibilityEmitter.emit({type});
    this.showModal = false;
  }

  ngOnDestroy() {
    if (this.accessibilityModel && this.accessibilityModel.deny) {
      this.accessibilityModel.deny();
    }
  }

}
