import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService } from '@sunbird/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { tap, first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ISessionContext } from '../../../cbse-program/interfaces';

@Component({
  selector: 'app-list-nominations',
  templateUrl: './list-nominations.component.html',
  styleUrls: ['./list-nominations.component.scss']
})
export class ListNominationsComponent implements OnInit {
  @Input() nominations: any;
  @Input() nominationsCount: Number;
  @Output()
  approve = new EventEmitter();
  @Output()
  reject = new EventEmitter();

   public sessionContext: ISessionContext = {};
   show = false;
   public programId: string;
   public programDetails: any;
   public userProfile: any;
   public mediums: any;
   public grades: any;
   public selectedNomineeProfile: any;
   showNomineeProfile;

  constructor(public frameworkService: FrameworkService, private programsService: ProgramsService,
    public resourceService: ResourceService, private config: ConfigService,
    private publicDataService: PublicDataService, private activatedRoute: ActivatedRoute,
    private router: Router, private navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService, public userService: UserService)  {
      this.programId = this.activatedRoute.snapshot.params.programId;
  }

  ngOnInit() {
    this.getProgramDetails();
  }

  private getNominatedTextbooksCount(nomination) {
    const count = nomination.collection_ids ? nomination.collection_ids.length : 0 ;

    if (count < 2) {
      return count + ' ' + this.resourceService.frmelmnts.lbl.textbook;
    }

    return count + ' ' + this.resourceService.frmelmnts.lbl.textbooks;
  }

  getProgramDetails() {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
    });
  }

  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
      this.mediums = _.join(this.programDetails.config['medium'], ', ');
      this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');

      this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
      if (this.sessionContext.framework) {
        this.userProfile = this.userService.userProfile;
        this.fetchFrameWorkDetails();
      }
    }));
  }

  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        this.sessionContext.frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
      }
    }, error => {
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching framework details failed');
    });
  }

  getProgramInfo(type) {
    const config = JSON.parse(this.programDetails.config);
    return type  === 'board' ? config[type] : _.join(config[type], ', ');
  }

  onApproveClick(nomination) {
    this.approve.emit(nomination);
  }

  onRejectClick(nomination) {
    this.reject.emit(nomination);
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }

  getNomineeProfile(nominee) {
     this.selectedNomineeProfile = nominee.nominationData.userData;
  }
}
