import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService, RegistryService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { tap, first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgramStageService } from '../../services/';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import * as moment from 'moment';

@Component({
  selector: 'app-list-contributor-textbooks',
  templateUrl: './list-nominated-textbooks.component.html',
  styleUrls: ['./list-nominated-textbooks.component.scss']
})
export class ListNominatedTextbooksComponent implements OnInit, AfterViewInit {

  public contributor;
  public contributorTextbooks: any = [];
  public noResultFound;
  public telemetryImpression: IImpressionEventInput;
  public component: any;
  public sessionContext: ISessionContext = {};
  public programContext: any = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public dynamicInputs;
  collection;
  configData;
  showChapterList = false;
  public currentNominationStatus: any;
  public nominationDetails: any = {};
  public nominated = false;
  public programId: string;
  public programDetails: any;
  public mediums: any;
  public grades: any;
  public userProfile: any;
  public activeDate = '';
  public contributorOrgUser: any = [];
  public orgDetails: any = {};
  public roles;
  public selectedRole;
  public showNormalModal = false;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any = {};
  public currentUserRole: any;
  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
    private configService: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  public toasterService: ToasterService, private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient,
  public frameworkService: FrameworkService, public userService: UserService, public registryService: RegistryService,
  public activeRoute: ActivatedRoute) {
    this.programId = this.activatedRoute.snapshot.params.programId;
   }

  ngOnInit() {
  this.getProgramDetails();
  this.getProgramTextbooks();
  if (!_.isEmpty(this.userService.userProfile.userRegData)
  && this.userService.userProfile.userRegData.User_Org.roles.includes('admin'))  {
    this.getContributionOrgUsers();
  }
  this.getNominationStatus();
  this.telemetryInteractCdata = [{id: this.activatedRoute.snapshot.params.programId, type: 'Program_ID'}];
  this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
  }

  getProgramDetails() {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.programDetails = _.get(programDetails, 'result');
      this.roles = _.get(this.programDetails, 'config.roles');
      this.setActiveDate();
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
      this.programContext = this.programDetails;
      this.mediums = _.join(this.programDetails.config['medium'], ', ');
      this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');

      this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
      if (this.sessionContext.framework) {
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

  getProgramTextbooks() {
     const option = {
      url: 'content/composite/v1/search',
       data: {
      request: {
         filters: {
          objectType: 'content',
          programId: this.activatedRoute.snapshot.params.programId,
          status: ['Draft', 'Live'],
          contentType: 'Textbook'
        }
      }
      }
    };

    this.httpClient.post<any>(option.url, option.data).subscribe(
      (res) =>  {
        if (res && res.result && res.result.content) {
          this.contributorTextbooks = res.result.content;
        }
      },
      (err) => console.log(err)
    );
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{ 'type': 'Program_ID', 'id': this.activatedRoute.snapshot.params.programId }];
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata,
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.activeRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  viewContribution(collection) {
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection =  collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.dynamicInputs = {
      chapterListComponentInput: {
        sessionContext: this.sessionContext,
        collection: collection,
        config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.chapterList'}),
        programContext: this.programContext,
        role: {
          currentRole : this.sessionContext.currentRole
        }
      }
    };
    this.showChapterList = true;
    this.programStageService.addStage('chapterListComponent');
  }

   setActiveDate() {
    const dates = [ 'nomination_enddate', 'shortlisting_enddate', 'content_submission_enddate', 'enddate'];

    dates.forEach(key => {
      const date  = moment(moment(this.programDetails[key]).format('YYYY-MM-DD'));
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


  getNominationStatus() {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId
          }
        }
      }
    };
    if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
      req.data.request.filters['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
    } else {
      req.data.request.filters['user_id'] = this.userService.userProfile.userId;
    }
    this.programsService.post(req).subscribe((data) => {
      if (data.result && !_.isEmpty(data.result)) {
        this.nominated = true;
        this.nominationDetails = _.first(data.result);
        this.sessionContext.nominationDetails = _.first(data.result);
        this.currentNominationStatus =  _.get(_.first(data.result), 'status');
        if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
          this.sessionContext.currentOrgRole = this.userService.userProfile.userRegData.User_Org.roles[0];
          if (this.userService.userProfile.userRegData.User_Org.roles[0] === 'admin') {
            // tslint:disable-next-line:max-line-length
            this.sessionContext.currentRole = (this.currentNominationStatus === 'Approved' ||  this.currentNominationStatus === 'Rejected') ? 'REVIEWER' : 'CONTRIBUTOR';
          } else if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.rolemapping) {
              _.find(this.sessionContext.nominationDetails.rolemapping, (users, role) => {
                if (_.includes(users, this.userService.userProfile.userRegData.User.userId)) {
                  this.sessionContext.currentRole = role;
                }
            });
          } else {
            this.sessionContext.currentRole = 'CONTRIBUTOR';
          }
        } else {
          this.sessionContext.currentRole = 'CONTRIBUTOR';
          this.sessionContext.currentOrgRole = 'individual';
        }
        const getCurrentRoleId = _.find(this.programContext.config.roles, {'name': this.sessionContext.currentRole});
        this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;

      }
    }, error => {
      this.toasterService.error('Failed fetching current nomination status');
    });
  }

  getContributionOrgUsers() {
    const baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
      ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : '';
    const orgUsers = this.registryService.getContributionOrgUsers(this.userService.userProfile.userRegData.User_Org.orgId);
    this.orgDetails.name = this.userService.userProfile.userRegData.Org.name;
    this.orgDetails.id = this.userService.userProfile.userRegData.Org.osid;
    this.orgDetails.orgLink = `${baseUrl}contribute/join/${this.userService.userProfile.userRegData.Org.osid}`;
    orgUsers.subscribe(response => {
        const result = _.get(response, 'result');
        if (!result || _.isEmpty(result)) {
          console.log('NO USER FOUND');
        } else {
          // get Ids of all users whose role is 'user'
          const userIds = _.map(_.filter(result[_.first(_.keys(result))], ['roles', ['user']]), 'userId');
          const getUserDetails = _.map(userIds, id => this.registryService.getUserDetails(id));
          forkJoin(...getUserDetails)
            .subscribe((res: any) => {
              if (res) {
                _.forEach(res, r => {
                  if (r.result && r.result.User) {
                    let creator = r.result.User.firstName;
                    if (r.result.User.lastName) {
                      creator  = creator + r.result.User.lastName;
                    }
                    r.result.User.fullName = creator;
                    if (this.nominationDetails.rolemapping) {
                      _.find(this.nominationDetails.rolemapping, (users, role) => {
                        if (_.includes(users, r.result.User.userId)) {
                          r.result.User.selectedRole = role;
                        }
                    });
                    }
                    this.contributorOrgUser.push(r.result.User);
                  }
                });
              }
            }, error => {
              console.log(error);
            });
        }
      }, error => {
        console.log(error);
      });
  }

  onRoleChange() {
    const roleMap = {};
    _.forEach(this.roles, role => {
      roleMap[role.name] = _.filter(this.contributorOrgUser, user => {
        if (user.selectedRole === role.name) {  return user.userId; }
      }).map(({userId}) => userId);
    });
    const req = {
      'request': {
          'program_id': this.activatedRoute.snapshot.params.programId,
          'user_id': this.userService.userid,
          'rolemapping': roleMap
      }
    };
    const updateNomination = this.programsService.updateNomination(req);
    updateNomination.subscribe(response => {
      this.toasterService.success('Roles updated');
    }, error => {
      console.log(error);
    });
  }

  copyLinkToClipboard(inputLink) {
    inputLink.select();
    document.execCommand('copy');
    inputLink.setSelectionRange(0, 0);
    this.toasterService.success(this.resourceService.frmelmnts.lbl.linkCopied);
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }

}
