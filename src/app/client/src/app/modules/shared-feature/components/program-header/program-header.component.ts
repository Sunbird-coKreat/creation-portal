import { Component, OnInit, Input, Output, OnChanges, OnDestroy,  EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService, ProgramsService} from '@sunbird/core';
import { ToasterService, ConfigService, ResourceService} from '@sunbird/shared';
import { tap, delay, startWith } from 'rxjs/operators';
import { HelperService } from '../../../sourcing/services/helper.service';
import * as moment from 'moment';

@Component({
  selector: 'app-program-header',
  templateUrl: './program-header.component.html',
  styleUrls: ['./program-header.component.scss']
})
export class ProgramHeaderComponent implements OnInit{
  @Input() programDetails;
  @Input() nominationDetails;
  @Input() roles;
  @Input() telemetryPageId;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public programContentTypes: string;
  public activeDate = '';
  public showSkipReview = false;
  public canNominate = false;
  public targetCollection;
  public targetCollections;
  // @Output() applyFilters = new EventEmitter<any>();
  // @Input() headerComponentInput: any;
  // @Output() emitTabChange = new EventEmitter<any>();

  constructor(public userService: UserService, public configService: ConfigService, public resourceService: ResourceService,
    public programsService: ProgramsService, public helperService: HelperService) { 
   }

  ngOnInit() {
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};

    if (_.get(this.programDetails, 'program_id')){
      this.programContentTypes = (!_.isEmpty(this.programDetails.targetprimarycategories)) ? _.join(_.map(this.programDetails.targetprimarycategories, 'name'), ', ') : _.join(this.programDetails.content_types, ', ');
      this.setActiveDate();
      this.setTargetCollectionValue();
      if (!this.programsService.ifSourcingInstance) { 
        this.checkIfshowSkipReview();
      }
    }
    if (!this.programsService.ifSourcingInstance && !_.get(this.nominationDetails, 'id') || _.get(this.nominationDetails, 'status') === 'Initiated') {
      this.canNominate = this.helperService.isOpenForNomination(this.programDetails);
    }
  }
  checkIfshowSkipReview() {
    const skipTwoLevelReview = !!(_.get(this.programDetails, 'config.defaultContributeOrgReview') === false);
    const restrictedProject = !!(_.get(this.programDetails, 'type') == 'restricted');

    const showSkipReview = skipTwoLevelReview && !!(_.get(this.userService, 'userProfile.rootOrgId') === _.get(this.programDetails, 'rootorg_id') &&
    skipTwoLevelReview);
   
    const currentOrgRole = _.first(this.userService.getUserOrgRole());

    this.showSkipReview = (showSkipReview || (restrictedProject && skipTwoLevelReview && !!(currentOrgRole !== "individual") &&  
      !!(this.roles.currentRoles.includes("CONTRIBUTOR") || this.roles.currentRoles.includes("REVIEWER") || currentOrgRole === 'admin')));
  }
  setTargetCollectionValue() {
    if (!_.isUndefined(this.programDetails)) {
      this.targetCollection = this.programsService.setTargetCollectionName(this.programDetails);
      this.targetCollections = this.programsService.setTargetCollectionName(this.programDetails, 'plural');
    }
  }

  setActiveDate() {
    const dates = ['nomination_enddate', 'shortlisting_enddate', 'content_submission_enddate', 'enddate'];

    dates.forEach(key => {
      const date = moment(moment(this.programDetails[key]).format('YYYY-MM-DD'));
      const today = moment(moment().format('YYYY-MM-DD'));
      const isFutureDate = !date.isSame(today) && date.isAfter(today);

      if (key === 'nomination_enddate' && isFutureDate) {
        this.activeDate = key;
      }

      if (this.activeDate === '' && isFutureDate) {
        this.activeDate = key;
      }
    });
  }
}
