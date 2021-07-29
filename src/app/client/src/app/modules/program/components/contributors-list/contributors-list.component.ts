import { style } from '@angular/animations';
import { map, isEmpty } from 'rxjs/operators';
import { RegistryService, ProgramsService } from '@sunbird/core';
import { Component, Input, OnInit } from '@angular/core';
import { ResourceService, PaginationService, ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IPagination } from '../../../sourcing/interfaces';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject, TelemetryService } from '@sunbird/telemetry';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contributors-list',
  templateUrl: './contributors-list.component.html',
  styleUrls: ['./contributors-list.component.scss']
})
export class ContributorsListComponent implements OnInit {
  direction = 'asc';
  sortColumn = 'name';
  orgList: any;
  contributorList: any;
  orgListOffset = 0;
  orgListLimit = 100;
  public listCnt = 0;
  pager: IPagination;
  pageNumber = 1;
  pageLimit: any;
  public showLoader = true;
  searchInput: any;
  @Output() onContributorSave = new EventEmitter();
  @Input() preSelectedContributors: any;
  public selectedContributors = {
    Org: [],
    User: []
  };

  constructor(public resource: ResourceService, public registryService: RegistryService, public programsService: ProgramsService, public paginationService: PaginationService, public configService: ConfigService) { }

  ngOnInit(): void {
    this.getOrgList(this.orgListLimit, this.orgListOffset);
    this.pageLimit = this.registryService.programUserPageLimit;
  }

  getOrgList(limit?, offset?) {
    this.registryService.getOrgList(limit, offset).subscribe(data => {
      this.orgList = _.get(data, 'result.Org') || [];
      // Org creator user open saber ids
      const orgCreatorOsIds = _.map(this.orgList, (org) => org.createdBy);
      this.getOrgCreatorDikshaIds(orgCreatorOsIds);
    }, (error) => {
      console.log(error);
      const errInfo = {
        // errorMsg: this.resourceService.messages.emsg.m0077,
        // telemetryPageId: this.telemetryPageId,
        // telemetryCdata : this.telemetryInteractCdata,
        // env : this.activatedRoute.snapshot.data.telemetry.env,
        // request: {'id': osid, role: role}
      };
      // this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  getOrgCreatorDikshaIds(orgCreatorOsIds) {
    this.registryService.getUserdetailsByOsIds(orgCreatorOsIds).subscribe(data => {
      const orgCreatorDikshaIds = _.map(_.get(data, 'result.User'), (user) => user.userId) || [];
      this.orgList = _.compact(_.map(this.orgList,
        (org) => {
          org.User = _.find(_.get(data, 'result.User'), (user) => {
            if (user.osid == org.createdBy) {
              return user;
            }
          });

          if (!_.isUndefined(org.User) && _.get(org, 'name')) {
            return org;
          }
        }
      ));
      this.getOrgUsersDetails(orgCreatorDikshaIds);
    }, (error) => {
      console.log(error);
      const errInfo = {
        // errorMsg: this.resourceService.messages.emsg.m0077,
        // telemetryPageId: this.telemetryPageId,
        // telemetryCdata : this.telemetryInteractCdata,
        // env : this.activatedRoute.snapshot.data.telemetry.env,
        // request: {'id': osid, role: role}
      };
      // this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    // this.contributorOrgUsers = this.paginatedContributorOrgUsers[this.pageNumber -1];
    this.pager = this.paginationService.getPager(this.orgList, this.pageNumber, this.pageLimit);
  }

  getOrgUsersDetails(orgCreatorDikshaIds) {
    const reqFilters = {
      'identifier': orgCreatorDikshaIds
    };
    const fields = ['identifier', 'maskedEmail', 'maskedPhone'];
    this.programsService.getOrgUsersDetails(reqFilters, undefined, undefined, fields).subscribe(data => {
      this.orgList = _.map(this.orgList,
        (org) => {
          let userInfo = _.find(_.get(data, 'result.response.content'), (user) => {
            if (user.identifier == _.get(org, 'User.userId')) {
              return user;
            }
          });
          org.User = {
            ...org.User,
            ...userInfo
          };
          if (!_.isEmpty(_.get(this.preSelectedContributors, 'Org'))) {
            if (_.find(_.get(this.preSelectedContributors, 'Org'), { 'osid': org.osid })) {
              org.isChecked = true;
            }
          }
          return org;
        }
      );
      this.showFilteredResults()
    }, (error) => {
      console.log(error);
      const errInfo = {
        // errorMsg: this.resourceService.messages.emsg.m0077,
        // telemetryPageId: this.telemetryPageId,
        // telemetryCdata : this.telemetryInteractCdata,
        // env : this.activatedRoute.snapshot.data.telemetry.env,
        // request: {'id': osid, role: role}
      };
      // this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  // onChangeSelection(contributor) {
  //   // this.onContributorSelectionChange.emit(contributor);
  // }

  displayLoader() {
    this.showLoader = true;
  }

  hideLoader() {
    this.showLoader = false;
  }

  clearSearch() {
    this.searchInput = '';
    this.showFilteredResults();
  }

  showFilteredResults() {
    this.displayLoader();
    this.contributorList = this.applySearchFilter(this.orgList);
    this.contributorList = this.applySort(this.contributorList);
    this.contributorList = this.applyPagination(this.contributorList);
    this.hideLoader();
  }

  // Search the option and return match result
  applySearchFilter(list) {
    if (this.searchInput) {
      return list.filter(item => {
        if (_.get(item, 'name')) {
          if (_.get(item, 'name').toString().toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase())) {
            return item;
          }
        }
      });
    } else {
      return this.orgList;
    }
  }

  applySort(list) {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    return this.programsService.sortCollection(list, this.sortColumn, this.direction);
  }

  applyPagination(list) {
    this.listCnt = list.length;
    const paginatedList = _.chunk(list, this.pageLimit);
    this.pager = this.paginationService.getPager(this.listCnt, this.searchInput ? 1 : this.pageNumber, this.pageLimit);
    return this.searchInput ? paginatedList[0] : paginatedList[this.pageNumber - 1];
    // this.orgUserscnt = usersList.length;
    // this.allContributorOrgUsers = this.programsService.sortCollection(usersList, this.sortColumn, this.direction);
    // isUserSearch ? this.allContributorOrgUsers:  this.initialSourcingOrgUser =  this.allContributorOrgUsers
    // usersList = _.chunk(this.allContributorOrgUsers, this.pageLimit);
    // this.paginatedContributorOrgUsers = usersList;
    // this.contributorOrgUsers = isUserSearch ? usersList[0] : usersList[this.pageNumber-1];
    // this.logTelemetryImpressionEvent();
    // this.pager = this.paginationService.getPager(this.orgUserscnt, isUserSearch ? 1 : this.pageNumber, this.pageLimit);

  }

  sortUsersList(usersList, isUserSearch?) {
    // this.orgUserscnt = usersList.length;
    // isUserSearch ? this.allContributorOrgUsers:  this.initialSourcingOrgUser =  this.allContributorOrgUsers
    // usersList = _.chunk(this.allContributorOrgUsers, this.pageLimit);
    // this.paginatedContributorOrgUsers = usersList;
    // this.contributorOrgUsers = isUserSearch ? usersList[0] : usersList[this.pageNumber-1];
    // this.logTelemetryImpressionEvent();
    // this.pager = this.paginationService.getPager(this.orgUserscnt, isUserSearch ? 1 : this.pageNumber, this.pageLimit);
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
  save() {
    this.selectedContributors.Org = _.compact(_.map(this.orgList, org => {
      if (org.isChecked) {
        return org.osid;
      }
    }));
    this.onContributorSave.emit(this.selectedContributors);
  }
}
