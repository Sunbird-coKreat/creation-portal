import { UserService } from "./../../../core/services/user/user.service";
import { RegistryService, ProgramsService } from "@sunbird/core";
import { Component, Input, OnInit } from "@angular/core";
import {
  ResourceService,
  PaginationService,
  ConfigService,
} from "@sunbird/shared";
import * as _ from "lodash-es";
import { IPagination } from "../../../sourcing/interfaces";
import { IInteractEventEdata } from "@sunbird/telemetry";
import { Output, EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SourcingService } from "./../../../sourcing/services";
import { CacheService } from 'ng2-cache-service';

@Component({
  selector: "app-contributors-list",
  templateUrl: "./contributors-list.component.html",
  styleUrls: ["./contributors-list.component.scss"],
})
export class ContributorsListComponent implements OnInit {
  direction = "";
  orgSortColumn = "name";
  indSortColumn = "firstName";
  orgList: any = [];
  indList: any = [];
  contributorList: any = [];
  paginatedList: any = [];
  public listCnt = 0;
  pager: IPagination;
  pageNumber = 1;
  pageLimit: any;
  public showLoader = true;
  public isDisabledSaveBtn = true;
  searchInput: any;
  @Output() onContributorSave = new EventEmitter();
  @Output() onContributorClose = new EventEmitter();
  @Input() preSelectedContributors: any;
  @Input() allowToModifyContributors: boolean = false;
  public selectedContributors = {
    Org: null,
    User: null,
  };
  public telemetryPageId: string;
  public telemetryInteractCdata: any;
  public telemetryInteractObject: any;
  public telemetryInteractPdata: any;
  public contributorTypes: string[] = ["Organisation", "Individual"];
  public contributorType: string = "Organisation";
  public isIndLoaded = false;
  public isOrgLoaded = false;
  public osLimit = 500;
  public orgLastPage = false;
  public indLastPage = false;

  constructor(
    public resource: ResourceService,
    public registryService: RegistryService,
    public programsService: ProgramsService,
    public paginationService: PaginationService,
    public configService: ConfigService,
    public userService: UserService,
    private activatedRoute: ActivatedRoute,
    private sourcingService: SourcingService,
    private cacheService: CacheService
  ) { }

  ngOnInit(): void {
    this.getPageId();
    this.telemetryInteractCdata = [
      { id: this.userService.channel, type: "sourcing_organization" },
    ];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID,
    };
    this.telemetryInteractObject = {};
    this.pageLimit = this.osLimit;

    if (this.preSelectedContributors['Org'].length > 0) {
      if (!this.selectedContributors.Org) {
        this.selectedContributors.Org = [];
      }
      this.selectedContributors.Org = this.preSelectedContributors['Org'];
    }

    if (this.preSelectedContributors['User'].length > 0) {
      if (!this.selectedContributors.User) {
        this.selectedContributors.User = [];
      }
      this.selectedContributors.User = this.preSelectedContributors['User'];
    }

    this.getData(true);
  }


  getOrgList(limit = this.osLimit, offset = 0, filter?) {
    const  reqFilter = {
      ...filter
    };

    if (this.searchInput) {
      reqFilter["name"] = {
        "contains": _.trim(this.searchInput)
      };
    }

    this.registryService.getOrgList(limit, offset, reqFilter).subscribe(
      (data) => {
        this.orgLastPage = !!(_.get(data, "result.Org").length < this.osLimit);
        if (!_.isEmpty(_.get(data, "result.Org"))) {
          // this.orgList = this.orgList.concat(_.get(data, "result.Org"));
          let orgList = _.get(data, "result.Org");
          // offset = offset + this.osLimit;
          // this.getOrgList(limit, offset);
        // } else {
          orgList = _.filter(
            orgList,
            (org) => org.orgId !== this.userService.rootOrgId
          );
          // Org creator user open saber ids
          this.getOrgCreatorInfo(orgList);
        } else {
          this.hideLoader();
        }
      },
      (error) => {
        console.log("Get org list", JSON.stringify(error));
        if (error.response && error.response.data) {
          console.log(`Get org list ==>`, JSON.stringify(error.response.data));
        }

        const errInfo = {
          errorMsg: this.resource.messages.fmsg.contributorjoin.m0001,
          telemetryPageId: this.getPageId(),
          telemetryCdata: this.telemetryInteractCdata,
          env: this.activatedRoute.snapshot.data.telemetry.env,
          request: { entityType: ["Org"] },
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      }
    );
  }

  getPageId() {
    this.telemetryPageId = _.get(
      this.activatedRoute,
      "snapshot.data.telemetry.pageid"
    );
    return this.telemetryPageId;
  }

  getOrgCreatorInfo(orgList) {
    const orgCreatorOsIds = _.map(orgList, (org) => org.createdBy);
    this.registryService.getUserdetailsByOsIds(orgCreatorOsIds).subscribe(
      (data) => {
          let orgCreators = _.get(data, "result.User");
          const orgCreatorIds = _.map(orgCreators, (user) => user.userId) || [];

          // Add user in Org.User
          orgList = _.compact(
            _.map(orgList, (org) => {
              org.User = _.find(orgCreators, (user) => {
                if (user.osid == org.createdBy) {
                  return user;
                }
              });
              if (!_.isUndefined(org.User) && _.get(org, "name")) {
                return org;
              }
            })
          );

          // Get all users profile
          this.getUsers(orgCreatorIds).then(
            (res) => {
              orgList = _.map(orgList, (org) => {
                let userInfo = _.find(res,
                  (user) => {
                    if (user.identifier == _.get(org, "User.userId")) {
                      return user;
                    }
                  }
                );
                org.User = {
                  ...org.User,
                  ...userInfo,
                };
                return org;
              });

              this.orgList = this.orgList.concat(orgList);
              if (!_.isEmpty(this.orgList)) {
                this.programsService.setSessionCache({
                  name: 'orgList',
                  value: this.orgList
                });
              }

              this.orgList = this.setSelected(this.orgList, 'Org');
              this.isOrgLoaded = true;
              this.showFilteredResults();
            },
            (err) => {
              console.log("Get org list", JSON.stringify(err));
            }
          );
        // }
      },
      (error) => {
        console.log("Get org creator", JSON.stringify(error));
        if (error.response && error.response.data) {
          console.log(
            `Get org creator ==>`,
            JSON.stringify(error.response.data)
          );
        }
        const errInfo = {
          errorMsg: this.resource.messages.emsg.profile.m0002,
          telemetryPageId: this.getPageId(),
          telemetryCdata: this.telemetryInteractCdata,
          env: this.activatedRoute.snapshot.data.telemetry.env,
          request: { entityType: ["User"], filters: { osid: { or: [] } } },
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      }
    );
  }

  navigateToPage(page: number): undefined | void {
    this.pageNumber = page;

    if (_.isEmpty(this.paginatedList[this.pageNumber - 1])) {
      this.showLoader = true;
      this.isDisabledSaveBtn = true;
      this.contributorList = [];

      switch (this.contributorType) {
        case "Organisation":
          this.getOrgList(this.osLimit, (this.pageNumber - 1) * this.osLimit);
          break;

        case "Individual":
          this.getIndividualList(this.osLimit, (this.pageNumber - 1) * this.osLimit);
          break;
      }
    }
    else {
      this.contributorList = this.paginatedList[this.pageNumber - 1];
      this.pager = this.paginationService.getPager(
        this.listCnt,
        this.pageNumber,
        this.pageLimit
      );
    }
  }

  displayLoader() {
    this.showLoader = true;
    this.isDisabledSaveBtn = true;
    this.pageNumber = 1;
    this.contributorList = [];
  }

  hideLoader() {
    this.showLoader = false;
    this.isDisabledSaveBtn = false;
  }

  clearSearch() {
    this.searchInput = "";
    this.getData(true);
  }

  showFilteredResults() {
    if (this.contributorType === "Organisation") {
      // this.contributorList = this.applySearchFilter(this.orgList, "name");
      this.contributorList = this.applySort(
        this.orgList,
        this.orgSortColumn
      );
    } else {
      // this.contributorList = this.applyIndSearchFilter(this.indList);
      this.contributorList = this.applySort(
        this.indList,
        this.indSortColumn
      );
    }
    this.contributorList = this.applyPagination(this.contributorList);
    this.hideLoader();
  }

  // Search the option and return match result
  applySearchFilter(list, column) {
    if (this.searchInput) {
      const searchStr = this.searchInput.toLocaleLowerCase();
      return list.filter((item) => {
        if (_.get(item, column)) {
          const str = _.get(item, column).toString().toLocaleLowerCase();
          if (searchStr.includes(str) || str.includes(searchStr)) {
            return item;
          }
        }
      });
    } else {
      return list;
    }
  }

  // Search the option and return match result
  applyIndSearchFilter(list) {
    if (this.searchInput) {
      const searchStr = this.searchInput.toLocaleLowerCase();
      return list.filter((item) => {
        const firstName = _.get(item, 'firstName') ? _.get(item, 'firstName').toString().toLocaleLowerCase() : "";
        const lastName = _.get(item, 'lastName') ? _.get(item, 'lastName').toString().toLocaleLowerCase() : "";
        const fullName = firstName + " " + lastName;
        if (firstName.includes(searchStr) || lastName.includes(searchStr) || fullName.includes(searchStr)) {
          return item;
        }
      });
    } else {
      return list;
    }
  }

  applySort(list, sortColumn) {
    if (!this.direction) {
      return this.sortBySelected(list);
    }

    return this.programsService.sortCollection(
      list,
      sortColumn,
      this.direction
    );
  }

  // @Todo fix this function to show sorted records at top of the list
  sortBySelected(list) {
    const checked = _.filter(list, (obj) => obj.isChecked) || [];
    const unchecked = _.filter(list, (obj) => !obj.isChecked) || [];
    return checked.concat(unchecked);
  }

  applyPagination(list) {
    this.listCnt = list.length;
    this.paginatedList = _.chunk(list, this.pageLimit);
    this.pager = this.paginationService.getPager(
      this.listCnt,
      this.searchInput ? 1 : this.pageNumber,
      this.pageLimit
    );
    return this.searchInput
      ? this.paginatedList[0]
      : this.paginatedList[this.pageNumber - 1];
  }

  getTelemetryInteractEdata(
    id: string,
    type: string,
    subtype: string,
    pageid: string,
    extra?: any
  ): IInteractEventEdata {
    return _.omitBy(
      {
        id,
        type,
        subtype,
        pageid,
        extra,
      },
      _.isUndefined
    );
  }
  save() {
    // if (!_.isEmpty(this.orgList)) {
    //   this.selectedContributors["Org"] = _.map(
    //     _.filter(this.orgList, (org) => org.isChecked),
    //     (org) => {
    //       return {
    //         ..._.pick(org, "osid", "isChecked"),
    //         User: _.pick(org.User, "userId", "maskedEmail", "maskedPhone"),
    //       };
    //     }
    //   );
    // }

    // if (!_.isEmpty(this.indList)) {
    //   this.selectedContributors["User"] = _.map(
    //     _.filter(this.indList, (ind) => ind.isChecked),
    //     (ind) => {
    //       return {
    //         ..._.pick(ind, "osid", "isChecked"),
    //         User: _.pick(ind.User, "userId", "maskedEmail", "maskedPhone"),
    //       };
    //     }
    //   );
    // }

    this.onContributorSave.emit(this.selectedContributors);
  }

  close() {
    this.onContributorClose.emit();
  }

  // @Todo - fix this function
  sortList() {
    this.direction = this.direction === "asc" ? "desc" : "asc";
    // this.getData();
  }

  getUsers(usersIds) {
    usersIds = _.chunk(usersIds, this.osLimit);
    return new Promise((resolve, reject) => {
      let index = 0,
        limit = this.osLimit;
      this.getUsersProfile(usersIds, index, limit, resolve, reject);
    });
  }

  getUsersProfile(userIds, index, limit, resolve, reject, usersData = []) {
    const reqFilters = {
      identifier: userIds[index],
    };
    index++;
    const fields = ["identifier", "maskedEmail", "maskedPhone"];
    this.programsService
      .getOrgUsersDetails(reqFilters, undefined, limit, fields)
      .subscribe(
        (data) => {
          usersData = usersData.concat(
            _.get(data, "result.response.content")
          );
          if (index < userIds.length) {
            this.getUsersProfile(userIds, index, limit, resolve, reject, usersData);
          } else {
            return resolve(_.compact(usersData));
          }
        },
        (error) => {
          console.log("Get user list", JSON.stringify(error));
          if (error.response && error.response.data) {
            console.log(
              `Get user list ==>`,
              JSON.stringify(error.response.data)
            );
          }
          const errInfo = {
            errorMsg: this.getPageId(),
            telemetryPageId: this.telemetryPageId,
            telemetryCdata: this.telemetryInteractCdata,
            env: this.activatedRoute.snapshot.data.telemetry.env,
            request: { filters: { identifier: userIds }, fields: fields },
          };
          this.sourcingService.apiErrorHandling(error, errInfo);
          reject(error);
        }
      );
  }

  setSelected(contributorList, type) {
    contributorList = _.map(contributorList, (obj) => {
      obj.isChecked = false;
      obj.isDisabled = false;
      if (!_.isEmpty(_.get(this.preSelectedContributors, type))) {
        let preSelectedUser = _.find(
          _.get(this.preSelectedContributors, type),
          { osid: obj.osid }
        );
        if (preSelectedUser) {
          obj.isChecked = true;
          obj.isDisabled = preSelectedUser.isDisabled;
        }
      }
      return obj;
    });

    if (this.allowToModifyContributors === false) {
      contributorList = _.filter(
        contributorList,
        (obj) => _.get(obj, "isChecked") === true
      );
    }

    contributorList = _.filter(
      contributorList,
      (obj) => _.get(obj, "User.maskedEmail") || _.get(obj, "User.maskedPhone")
    );

    return _.uniq(contributorList, obj => obj.osid);
  }

  getIndividualList(limit = this.osLimit, offset = 0) {
    const filters = { "roles": { "contains": "individual" } };

    if (this.searchInput) {
      filters["firstName"] = {
        "contains": _.trim(this.searchInput)
      };
    }

    this.registryService.getUserList(limit, offset, filters).subscribe(
      (data) => {
        this.indLastPage = !!(_.get(data, "result.User").length < this.osLimit);
        if (!_.isEmpty(_.get(data, "result.User"))) {
          let osUserList = _.get(data, "result.User");
          const userIds = _.map(osUserList, (ind) => ind.userId);

          // Get all users profile
          this.getUsers(userIds).then(
            (res) => {
              osUserList = _.map(osUserList, (obj) => {
                // Attach user details in User Obj
                obj.User = _.find(res, (user) => {
                  if (user.identifier == _.get(obj, "userId")) {
                    user['userId'] = _.get(user, 'identifier');
                    delete user.identifier;
                    return user;
                  }
                });
                return obj;
              });

              this.indList = this.indList.concat(osUserList);
              if (!_.isEmpty(this.indList)) {
                this.programsService.setSessionCache({
                  name: 'indList',
                  value: this.indList
                });
              }

              this.indList = this.setSelected(this.indList, 'User');
              this.isIndLoaded = true;
              this.showFilteredResults();
            },
            (err) => {
              console.log("Get individual list", JSON.stringify(err));
            }
          );
        }
        else {
          this.indList = this.setSelected(this.indList, 'User');
          this.showFilteredResults();
        }
      },
      (error) => {
        console.log("Get individual list", JSON.stringify(error));
        if (error.response && error.response.data) {
          console.log(
            `Get individual list ==>`,
            JSON.stringify(error.response.data)
          );
        }

        const errInfo = {
          errorMsg: this.resource.messages.fmsg.contributorjoin.m0001,
          telemetryPageId: this.getPageId(),
          telemetryCdata: this.telemetryInteractCdata,
          env: this.activatedRoute.snapshot.data.telemetry.env,
          request: { entityType: ["User"] },
        };
        this.sourcingService.apiErrorHandling(error, errInfo);
      }
    );
  }

  getData(clearList?) {
    this.displayLoader();
    switch (this.contributorType) {
      case "Organisation":
        if (clearList) {
          this.orgList = [];
        }
        this.getOrgList();
      break;

      case "Individual":
        if (clearList) {
          this.indList = [];
        }
        this.getIndividualList();
      break;
    }
  }

  getOrgs() {
    if (this.isOrgLoaded) {
      this.showFilteredResults();
    } else {
      const cachedOrgList = this.cacheService.get('orgList');
      if (cachedOrgList) {
        this.orgList = this.setSelected(cachedOrgList, 'Org');
        this.showFilteredResults();
        this.isOrgLoaded = true;
      } else {
        this.orgList = [];
        this.getOrgList();
      }
    }
  }

  getIndividuals() {
    if (this.isIndLoaded) {
      this.showFilteredResults();
    } else {
      const cachedindList = this.cacheService.get('indList');
      if (cachedindList) {
        this.indList = this.setSelected(cachedindList, 'User');
        this.showFilteredResults();
        this.isIndLoaded = true;
      } else {
        this.indList = [];
        this.getIndividualList(this.osLimit, 0);
      }
    }
  }

  updateSelection(contributor, event) {
    switch (this.contributorType) {
      case "Organisation":
        if (event.target.checked) {
          if (!this.selectedContributors["Org"]) {
            this.selectedContributors["Org"] = [];
          }
          this.selectedContributors["Org"].push({
            ..._.pick(contributor, "osid", "isChecked"),
            User: _.pick(contributor.User, "userId", "maskedEmail", "maskedPhone"),
          });
        } else {
          _.remove(this.selectedContributors["Org"], {osid: event.target.value});
        }
        break;

      case "Individual":
        if (event.target.checked) {
          if (!this.selectedContributors["User"]) {
            this.selectedContributors["User"] = [];
          }

          this.selectedContributors["User"].push({
            ..._.pick(contributor, "osid", "isChecked"),
            User: _.pick(contributor.User, "userId", "maskedEmail", "maskedPhone"),
          })
        } else {
          _.remove(this.selectedContributors["User"], {osid: event.target.value});
        }
        break;
    }
  }
}
