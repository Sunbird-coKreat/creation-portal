import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProgramsService, RegistryService, UserService, FrameworkService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService, NavigationHelperService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { IProgram } from '../../../core/interfaces';
import * as _ from 'lodash-es';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { IInteractEventEdata, TelemetryService } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { first } from 'rxjs/operators';
import { SourcingService } from '../../../sourcing/services';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss'],
  providers: [DatePipe]
})
export class ProgramListComponent implements OnInit, AfterViewInit {

  public programs: IProgram[];
  public program: any;
  public programIndex: number;
  public count = 0;
  public activeDates = <any>[];
  public isContributor: boolean;
  public activeAllProgramsMenu: boolean;
  public activeMyProgramsMenu: boolean;
  public contributorOrgUser = [];
  public roles;
  public selectedRole;
  public selectedProgramToAssignRoles;
  public tempSortPrograms: any;
  public direction = 'asc';
  public enrollPrograms: IProgram[];
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public nominationList;
  public sortColumn = '';
  public showLoader = true;
  public roleMapping = [];
  public iscontributeOrgAdmin = true;
  public issourcingOrgAdmin = false;
  public selectedProgramToModify: any;
  public showModifyConfirmation: boolean;
  public showFiltersModal = false;
  public showCloseModal = false;
  public filtersAppliedCount: any;
  public telemetryImpression: any;
  public telemetryPageId: string;
  public isFrameworkDetailsAvailable = false;
  showDeleteModal = false;
  public inviewLogs: any = [];
  public impressionEventTriggered: Boolean = false;
  public userProfile = this.userService.userProfile;

  constructor(public programsService: ProgramsService, private toasterService: ToasterService, private registryService: RegistryService,
    public resourceService: ResourceService, private userService: UserService, private activatedRoute: ActivatedRoute,
    public router: Router, private datePipe: DatePipe, public configService: ConfigService, public cacheService: CacheService,
    private navigationHelperService: NavigationHelperService, public activeRoute: ActivatedRoute,
    private telemetryService: TelemetryService, public frameworkService: FrameworkService,
    private sourcingService: SourcingService) { }

  ngOnInit() {
    this.getPageId();
    this.programsService.frameworkInitialize(); // initialize framework details here
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkInfo: any) => {
      if (frameworkInfo && !frameworkInfo.err) {
        this.isFrameworkDetailsAvailable = true; // set apply apply filter button enable condition
      }
    });
    this.checkIfUserIsContributor();
    this.issourcingOrgAdmin = this.userService.isSourcingOrgAdmin();
    this.telemetryInteractCdata = [{id: this.userService.channel, type: 'sourcing_organization'}];
    this.telemetryInteractPdata = { id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID };
    this.telemetryInteractObject = {};
  }

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{id: this.userService.channel || '', type: 'sourcing_organization'}];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata,
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}`
          },
          channel: this.userService.slug ?
            (this.programsService.organisationDetails[this.userService.slug] || this.userService.hashTagId) :
            (this.userService.hashTagId || '')
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: this.getPageId(),
          uri: this.userService.slug.length ? `/${this.userService.slug}${this.router.url}` : this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  // check the active tab
  getPageId() {
    // tslint:disable-next-line:max-line-length
    this.telemetryPageId = this.userService.isContributingOrgUser() ? this.configService.telemetryLabels.pageId.contribute.myProjects : _.get(this.activeRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  /**
   * Check if logged in user is contributor or sourcing org
   */
  private checkIfUserIsContributor() {
    // TODO implement based on api and remove url checks
    // this.isContributor = !isContributor;
    const orgId = this.activatedRoute.snapshot.params.orgId;

    // Check if user part of that organisation
    if (this.router.url.includes('/join/' + orgId)) {
      this.programsService.addUsertoContributorOrg(orgId);
    }
    if (this.userService.isContributingOrgUser()
      && !this.router.url.includes('/sourcing')
      && !this.router.isActive('/contribute/myenrollprograms', true)) {
      return this.router.navigateByUrl('/contribute/myenrollprograms');
    }

    this.isContributor = this.router.url.includes('/contribute');
    this.activeAllProgramsMenu = this.router.isActive('/contribute', true);
    this.activeMyProgramsMenu = this.router.isActive('/contribute/myenrollprograms', true);

    this.getProgramsListByRole();
  }

  getProgramsListByRole(setfilters?) {
    this.showLoader = true; // show loader till getting the data
    if (this.isContributor) {
        // tslint:disable-next-line: max-line-length
        const sort = {
          // tslint:disable-next-line: max-line-length
          'medium': _.get(this.userService.userProfile, 'userRegData.User.medium') || [],
          // tslint:disable-next-line: max-line-length
          'gradeLevel': _.get(this.userService.userProfile, 'userRegData.User.gradeLevel') || [],
          // tslint:disable-next-line: max-line-length
          'subject': _.get(this.userService.userProfile, 'userRegData.User.subject') || []
        };

      if (this.activeMyProgramsMenu) {
        // tslint:disable-next-line: max-line-length
        const applyFilters = this.getFilterDetails(setfilters, this.userService.slug ? 'contributeMyProgramAppliedFiltersTenantAccess' : 'contributeMyProgramAppliedFilters');
        // tslint:disable-next-line: max-line-length
        this.getMyProgramsForContrib(['Live', 'Unlisted', 'Closed'], applyFilters, sort); // this method will call with applied req filters data other wise with origional req body
      } else if (this.activeAllProgramsMenu) {
        // tslint:disable-next-line: max-line-length
        const applyFilters = this.getFilterDetails(setfilters, this.userService.slug ? 'contributeAllProgramAppliedFiltersTenantAccess' : 'contributeAllProgramAppliedFilters');

        // tslint:disable-next-line: max-line-length
        this.getAllProgramsForContrib('public', ['Live', 'Unlisted'], applyFilters, sort); // this method will call with applied req filters data other wise with origional req body
      } else {
        this.showLoader = false;
      }
    } else {
      const applyFilters = this.getFilterDetails(setfilters, 'sourcingMyProgramAppliedFilters');
      this.getMyProgramsForOrg(applyFilters); // this method will call with applied req filters data other wise with origional req body
    }
  }
  // finding the applied filters count and putting them into request body other wise put origional req body to api call
  getFilterDetails(setfilters, storageReferenec) {
    const appliedfilters = this.cacheService.get(storageReferenec);  // getting the strored data from cache service
    const applyFilters = setfilters ? setfilters : appliedfilters;
    this.filtersAppliedCount = this.programsService.getFiltersAppliedCount(applyFilters); // getting applied filters count
    return applyFilters;
  }

  setDelete(program, index) {
    if (!this.issourcingOrgAdmin) {
      this.toasterService.error(this.resourceService.messages.imsg.m0035);
      return this.router.navigate(['home']);
    }

    this.program = program;
    this.programIndex = index;

    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.program.program_id,
            status: ['Pending', 'Approved']
          },
          fields: ['organisation_id', 'status'],
          limit: 0
        }
      }
    };

    this.programsService.getNominationList(req.data.request.filters)
      .subscribe((nominationsResponse) => {
        const nominations = _.get(nominationsResponse, 'result');

        if (nominations.length > 1) {
          this.toasterService.error(this.resourceService.frmelmnts.lbl.projectCannotBeDeleted);
          this.showDeleteModal = false;

          return false;
        }

        this.showDeleteModal = true;
      },
        error => {
          console.log(error);
        });

  }

  deleteProject($event: MouseEvent) {
    if (!this.issourcingOrgAdmin) {
      this.toasterService.error(this.resourceService.messages.imsg.m0035);
      return this.router.navigate(['home']);
    }

    const programData = {
      'program_id': this.program.program_id,
      'status': 'Retired'
    };

    this.programsService.updateProgram(programData).subscribe(
      (res) => {
        this.toasterService.success(this.resourceService.frmelmnts.lbl.successTheProjectHasBeenDeleted);
        ($event.target as HTMLButtonElement).disabled = false;
        this.programs.splice(this.programIndex, 1);
        this.showDeleteModal = false;
      },
      (err) => {
        const errInfo = {
          errorMsg: this.resourceService.frmelmnts.lbl.errorMessageTheProjectHasBeenDeleted,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
          request: programData
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
        ($event.target as HTMLButtonElement).disabled = false;
      }
    );
  }

  setClose(program) {
    this.program = program;
    this.showCloseModal = true;
  }

  closeProject($event: MouseEvent) {
    if (!this.issourcingOrgAdmin) {
      this.toasterService.error(this.resourceService.messages.imsg.m0035);
      return this.router.navigate(['home']);
    }

    const programData = {
      'program_id': this.program.program_id,
      'status': 'Closed'
    };

    this.programsService.updateProgram(programData).subscribe(
      (res) => {
        this.showCloseModal = false;
        this.toasterService.success(this.resourceService.frmelmnts.lbl.successMessageOnClose);
        ($event.target as HTMLButtonElement).disabled = false;
        this.program.status = 'Closed';
      },
      (err) => {
        const errInfo = {
          errorMsg: this.resourceService.frmelmnts.lbl.errorMessageonClose,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata: this.telemetryInteractCdata,
          env: this.activeRoute.snapshot.data.telemetry.env,
          request: programData
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
        ($event.target as HTMLButtonElement).disabled = false;
      }
    );
  }
  /**programContext
   * fetch the list of programs.
   */
  private getAllProgramsForContrib(type, status, appliedfilters?, sort?) {
    let req: any;
    if (this.userService.isContributingOrgAdmin()) {
      this.iscontributeOrgAdmin = true;
      // Request body for all programs tab for contributor org admin
      req = {
        request: {
          filters: {
            nomination: {
              organisation_id: {
                ne: this.userProfile.userRegData.User_Org.orgId
              }
            },
          }
        }
      };
    } else {
      this.iscontributeOrgAdmin = false;
      // Request body for all programs tab for individual contributor
      req = {
        request: {
          filters: {
            nomination: {
              user_id: {
                ne: this.userService.userid,
              },
            },
          },
        }
      };
    }
    if (sort) {
      req.request['sort'] = sort;
    }
    if (status) {
      req.request.filters['status'] = status;
    }
    if (type) {
      req.request.filters['type'] = type;
    }
    req.request.filters['nomination_enddate'] = 'open';

    if (appliedfilters && this.filtersAppliedCount) { // add filters in request only when applied filters are there and its length
      req.request.filters = { ...req.request.filters, ...this.addFiltersInRequestBody(appliedfilters) };
    }
    this.programsService.getAllProgramsByType(req)
      .subscribe((myProgramsResponse) => {
        this.programs = _.get(myProgramsResponse, 'result.programs');
        this.count = this.programs.length;
        this.tempSortPrograms = this.programs;
        this.logTelemetryImpressionEvent();
        this.showLoader = false;
      }, error => {
        this.logTelemetryImpressionEvent();
        this.showLoader = false;
        const errInfo = {
          errorMsg: this.resourceService.messages.emsg.projects.m0001,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata: this.telemetryInteractCdata,
          env: this.activeRoute.snapshot.data.telemetry.env,
          request: req
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      }
      );
  }


  sortCollection(column) {
    this.programs = this.programsService.sortCollection(this.tempSortPrograms, column, this.direction);
    if (this.direction === 'asc' || this.direction === '') {
      this.direction = 'desc';
    } else {
      this.direction = 'asc';
    }
    this.sortColumn = column;
  }

  resetSorting() {
    this.sortColumn = 'name';
    this.direction = 'asc';
  }

  /**
   * fetch the list of programs.
   */
  private getMyProgramsForContrib(status, appliedfilters?, sort?) {
    let req: any;
    if (!this.userService.isUserBelongsToOrg()) {
      // Request body for my programs tab for individual contributor
      req = {
        request: {
          filters: {
            nomination: {
              user_id: {
                eq: this.userService.userid,
              }
            },
          }
        }
      };
    } else if (this.userService.isContributingOrgAdmin()) {
      this.iscontributeOrgAdmin = true;
      // Request body for my programs tab for contributor org admin
      req = {
        request: {
          filters: {
            nomination: {
              organisation_id: {
                eq: this.userProfile.userRegData.User_Org.orgId
              }
            },
          }
        }
      };
    } else {
      this.iscontributeOrgAdmin = false;
       // Request body for my programs tab for  contributor org contributor and/or reviewer
      req = {
        request: {
          filters: {
            nomination: {
              user_id: {
                eq: this.userService.userid
              },
              organisation_id: {
                eq: this.userProfile.userRegData.User_Org.orgId
              },
              status: ['Approved'],
              roles: {
                or: ['REVIEWER', 'CONTRIBUTOR']
              }
            }
          }
        }
      };
    }
    if (sort) {
      req.request['sort'] = sort;
    }
    if (status) {
      req.request.filters['status'] = status;
    }
    if (appliedfilters && this.filtersAppliedCount) { // add filters in request only when applied filters are there and its length
      req.request.filters = { ...req.request.filters, ...this.addFiltersInRequestBody(appliedfilters) };
    }
    this.programsService.getMyProgramsForContrib(req).subscribe((programsResponse) => {
      this.programs = _.map(_.get(programsResponse, 'result.programs'), (obj: any) => {
        if (obj.program) {
          obj.program = _.merge({}, obj.program, {
            contributionDate: obj.createdon,
            nomination_status: obj.status,
            nominated_collection_ids: obj.collection_ids,
            nominated_rolemapping: obj.rolemapping,
            myRole: this.getMyProgramRole(obj)
          });
          return obj.program;
        }
      });
      this.enrollPrograms = this.programs;
      this.tempSortPrograms = this.programs;
      this.count = this.programs.length;
      if (!sort) {
        this.sortColumn = 'contributionDate';
        this.direction = 'desc';
        this.sortCollection(this.sortColumn);
      }
      this.logTelemetryImpressionEvent();
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;
      console.log(error);
      this.logTelemetryImpressionEvent();
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.projects.m0001,
        telemetryPageId: this.telemetryPageId,
        telemetryCdata: this.telemetryInteractCdata,
        env: this.activeRoute.snapshot.data.telemetry.env,
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  getProgramsAssignedToMe(nominations) {
    const nominationsAssignedToMe = _.filter(nominations, (nomination) => {
      const myRoles = this.userService.getMyRoleForProgram(nomination);

      // Check if user have CONTRIBUTOR/REVIEWER role and nomination is Approved
      if ((myRoles.includes('CONTRIBUTOR') || myRoles.includes('REVIEWER')) && nomination.status === 'Approved') {
        this.roleMapping.push(nomination);
        return true;
      }
    });

    return _.uniq(_.map(nominationsAssignedToMe, 'program_id'));
  }

  getNominationsByMyOrg() {
    const filters = {
      organisation_id: this.userProfile.userRegData.User_Org.orgId
    };
    return this.programsService.getNominationList(filters);
  }

  getMyProgramRole(program) {
    const roles = this.userService.getMyRoleForProgram(program);
    if (_.isEmpty(roles)) {
      return '-';
    }
    return _.map(roles, role => _.upperFirst(_.toLower(role))).join(", ");
  }
  // add filters to request body
  addFiltersInRequestBody(appliedfilters) {
    const newFilters = {};
    if (_.get(appliedfilters, 'rootorg_id')) {
      newFilters['rootorg_id'] = appliedfilters.rootorg_id;
    }
    if (_.get(appliedfilters, 'medium') && (_.get(appliedfilters, 'medium').length)) {
      newFilters['medium'] = appliedfilters.medium;
    }
    if (_.get(appliedfilters, 'gradeLevel') && (_.get(appliedfilters, 'gradeLevel').length)) {
      newFilters['gradeLevel'] = appliedfilters.gradeLevel;
    }
    if (_.get(appliedfilters, 'subject') && (_.get(appliedfilters, 'subject').length)) {
      newFilters['subject'] = appliedfilters.subject;
    }
    if (_.get(appliedfilters, 'content_types') && (_.get(appliedfilters, 'content_types').length)) {
      newFilters['content_types'] = appliedfilters.content_types;
    }
    if (_.get(appliedfilters, 'target_collection_category') && (_.get(appliedfilters, 'target_collection_category').length)) {
      newFilters['target_collection_category'] = appliedfilters.target_collection_category;
    }
    if (_.get(appliedfilters, 'contribution_date') && _.get(appliedfilters, 'contribution_date') !== 'any') {
      newFilters['content_submission_enddate'] = appliedfilters.contribution_date;
    }
    if (_.get(appliedfilters, 'nomination_date') && _.get(appliedfilters, 'nomination_date') !== 'any') {
      newFilters['nomination_enddate'] = appliedfilters.nomination_date;
    }
    return newFilters;
  }
  /**
   * fetch the list of programs.
   */
  private getMyProgramsForOrg(appliedfilters?) {
    let filters = {};

    if (this.userService.isSourcingOrgAdmin()) {
      filters['rootorg_id'] = _.get(this.userService, 'userProfile.rootOrgId');
      filters['status'] = ['Live', 'Unlisted', 'Draft', 'Closed'];
    } else {
      filters['status'] = ['Live', 'Unlisted', 'Closed'];
      filters['role'] = ['REVIEWER'];
      filters['user_id'] = this.userService.userProfile.userId;
    }
    if (appliedfilters && this.filtersAppliedCount) { // add filters in request only when applied filters are there and its length
      filters = { ...filters, ...this.addFiltersInRequestBody(appliedfilters) };
    }
    // tslint:disable-next-line:max-line-length
    /*if (!_.includes(this.userService.userProfile.userRoles, 'ORG_ADMIN') && _.includes(this.userService.userProfile.userRoles, 'CONTENT_REVIEWER')) {

    }*/
    return this.programsService.getMyProgramsForOrg(filters).subscribe((response) => {
      this.programs = _.get(response, 'result.programs');
      this.count = _.get(response, 'result.count');
      this.tempSortPrograms = this.programs;
      this.showLoader = false;
      this.fetchProjectFeedDays();
      this.logTelemetryImpressionEvent();
    }, error => {
      this.showLoader = false;
      const errInfo = {
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activeRoute.snapshot.data.telemetry.env,
        request: filters
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
      this.logTelemetryImpressionEvent();
    });
  }

  public logTelemetryImpressionEvent() {
    if (this.impressionEventTriggered) { return false; }
    this.impressionEventTriggered = true;
    const telemetryImpression = _.cloneDeep(this.telemetryImpression);
    telemetryImpression.edata.visits = _.map(this.programs, (program) => {
      return { objid: program.program_id, objtype: 'project' };
    });
    this.telemetryService.impression(telemetryImpression);
  }


  getProgramTextbooksCount(program) {
    let count = 0;

    // tslint:disable-next-line:max-line-length
    if (program.nominated_collection_ids && program.nominated_collection_ids.length && _.get(program, 'nomination_status') !== 'Initiated') {
      count = program.nominated_collection_ids.length;
    } else if (program.collection_ids && program.collection_ids.length) {
      count = program.collection_ids.length;
    }

    if (count < 2) {
      return count + ' ' + this.programsService.setTargetCollectionName(program);
    }

    return count + ' ' + this.programsService.setTargetCollectionName(program, 'plural') ;
  }

  getProgramInfo(program, type) {
    if (program && program.config) {
      return this.getCorrectedValue(program.config[type], false);
    } else {
      return this.getCorrectedValue(program[type], true);
    }
  }

  getCorrectedValue(value, isJsonString) {
    try {
      const newparse = (isJsonString) ? JSON.parse(value) : value;
      return _.join(_.compact(_.uniq(newparse)), ', ');
    }
    catch {
      return value;
    }
  }

  getProgramNominationStatus(program) {
    return program.nomination_status;
  }

  getSourcingOrgName(program) {
    return program.sourcing_org_name ? program.sourcing_org_name : '-';
  }

  getProgramContentTypes(program) {
    if (_.isEmpty(program) || _.isEmpty(program.program_id)) {
    return false;
    }
    return program.targetprimarycategories ? _.join(_.map(program.targetprimarycategories, 'name'), ', ') : _.join(program.content_types, ', ');
  }

  viewDetailsBtnClicked(program) {
    if (this.isContributor) {
      return this.router.navigateByUrl('/contribute/program/' + program.program_id);
    } else {
      return this.router.navigateByUrl('/sourcing/nominations/' + program.program_id);
    }
  }

  editOnClick(program) {
    return this.router.navigateByUrl('/sourcing/edit/' + program.program_id);
  }

  isActive(program, name, index) {
    const date = moment(program[name]);
    const today = moment();
    const isFutureDate = date.isAfter(today);

    if (!this.activeDates[index]) {
      this.activeDates[index] = {};
    }

    if (name === 'nomination_enddate' && isFutureDate) {
      this.activeDates[index]['nomination_enddate'] = true;
      return true;
    }

    if (!this.activeDates[index]['nomination_enddate'] && name === 'shortlisting_enddate' && isFutureDate) {
      this.activeDates[index]['shortlisting_enddate'] = true;
      return true;
    }

    if (!this.activeDates[index]['nomination_enddate'] && !this.activeDates[index]['shortlisting_enddate']
      && name === 'content_submission_enddate' && isFutureDate) {
      this.activeDates[index]['content_submission_enddate'] = true;
      return true;
    }

    if (!this.activeDates[index]['nomination_enddate'] && !this.activeDates[index]['shortlisting_enddate'] &&
      !this.activeDates[index]['content_submission_enddate'] && name === 'content_submission_enddate' && isFutureDate) {
      this.activeDates[index]['enddate'] = true;
      return true;
    }
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  canNominate(program) {
    const today = moment();
    return moment(program.nomination_enddate).isSameOrAfter(today, 'day');
  }

  getProjectToModify(program) {
    this.selectedProgramToModify = program;
    this.showModifyConfirmation = true;
  }

  modifyNomination() {
    if (this.selectedProgramToModify) {
      // Update nomination back to Initiated stage
      const req = {
        program_id: this.selectedProgramToModify.program_id,
        status: 'Initiated',
        updatedby: this.userService.userid
      };

      this.programsService.addorUpdateNomination(req).subscribe((data) => {
        if (data === 'Approved' || data === 'Rejected') {
          this.toasterService.error(`${this.resourceService.messages.emsg.modifyNomination.error} ${data}`);
          this.ngOnInit();
        } else {
          this.router.navigateByUrl('/contribute/program/' + this.selectedProgramToModify.program_id);
        }
      }, err => {
        const errInfo = {
          errorMsg: this.resourceService.messages.emsg.bulkApprove.something,
          telemetryPageId: this.telemetryPageId,
          telemetryCdata : this.telemetryInteractCdata,
          env : this.activeRoute.snapshot.data.telemetry.env,
          request: req
        };
        this.sourcingService.apiErrorHandling(err, errInfo);
      });
    } else {
      this.toasterService.error(this.resourceService.messages.emsg.bulkApprove.something);
    }
  }

  getNotificationData() {
    const reqData = {
      nomination: {
        programId: _.map(this.getProgramsForNotification('nomination'), 'program_id'),
        status: [
          'Pending'
        ]
      },
      contribution: {
        programId: _.map(this.getProgramsForNotification('contribution'), 'program_id'),
        status: [
          'Live'
        ]
      },
      channel: _.get(this.userService, 'userProfile.rootOrgId')
    };
    if (!_.isEmpty(reqData.nomination.programId) || !_.isEmpty(reqData.contribution.programId)) {
      this.programsService.getProgramsNotificationData(reqData).subscribe(data => {
        if (!_.isEmpty(data.result)) {
          const countData = data.result;
          _.forEach(this.programs, prg => {
            if (_.get(_.get(countData, prg.program_id), 'nominationCount') ||
              _.get(_.get(countData, prg.program_id), 'contributionCount')) {
              prg['notificationData'] = _.get(countData, prg.program_id);
            }
          });
          this.programsService.sendprogramsNotificationData(this.programs);
        }
      });
    }
  }

  getProgramsForNotification(query) {
    let programsForNotification;
    if (query === 'nomination') {
      programsForNotification = _.filter(this.programs, program => {
        if (program.status === 'Live' && program.nomination_enddate &&
          // tslint:disable-next-line:max-line-length
          ((new Date().getTime() - new Date(program.nomination_enddate).getTime()) / (1000 * 60 * 60 * 24) <= _.toNumber(this.programsService.projectFeedDays))) {
          return program;
        }
      });
      return programsForNotification;
    } else if (query === 'contribution') {
      programsForNotification = _.filter(this.programs, program => {
        if (_.includes(['Live', 'Unlisted'], program.status) && program.content_submission_enddate &&
            // tslint:disable-next-line:max-line-length
            ((new Date().getTime() - new Date(program.content_submission_enddate).getTime()) / (1000 * 60 * 60 * 24) <= _.toNumber(this.programsService.projectFeedDays))) {
              return program;
        }
      });
      return programsForNotification;
    }
  }

  fetchProjectFeedDays() {
    if (!this.programsService.projectFeedDays) {
      this.programsService.fetchProjectFeedDays().subscribe(data => data && this.getNotificationData());
    } else {
      this.getNotificationData();
    }
  }

  getTelemetryInteractCdata(id, type) {
    return [...this.telemetryInteractCdata, { type: type, id: _.toString(id)} ];
  }
}
