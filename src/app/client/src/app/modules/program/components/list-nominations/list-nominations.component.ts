import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import * as _ from 'lodash-es';
import { tap, first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ISessionContext } from '../../../cbse-program/interfaces';

@Component({
  selector: 'app-list-nominations',
  templateUrl: './list-nominations.component.html',
  styleUrls: ['./list-nominations.component.scss']
})
export class ListNominationsComponent implements OnInit, AfterViewInit, OnChanges {
	 @Input() nominations: any;
   @Output()
	 onApprove = new EventEmitter();
	 @Output()
   onReject = new EventEmitter();

   public sessionContext: ISessionContext = {};
   show = false;
   public programId: string;
   public programDetails: any;
   public userProfile: any;
   nominationsCount = 0;

  constructor(public frameworkService: FrameworkService, private programsService: ProgramsService,
    public resourceService: ResourceService, private config: ConfigService,
    private publicDataService: PublicDataService, private activatedRoute: ActivatedRoute,
    private router: Router, private navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService, public userService: UserService)  {
      this.programId = this.activatedRoute.snapshot.params.programId;
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.getProgramDetails();
  }

  ngOnChanges() {
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
      url: `/program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
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

  onApproveClick(nomination) {
    this.onApprove.emit(nomination);
  }

  onRejectClick(nomination) {
    this.onReject.emit(nomination);
  }

  goToProfile() {
    this.router.navigateByUrl('/profile');
  }
}
