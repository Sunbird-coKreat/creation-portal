import {filter, first, map} from 'rxjs/operators';
import { UserService, PermissionService, TenantService, OrgDetailsService, FormService, ProgramsService} from './../../services';
import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { ConfigService, ResourceService, IUserProfile, IUserData } from '@sunbird/shared';
import { Router, ActivatedRoute, NavigationEnd, RoutesRecognized } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { CacheService } from 'ng2-cache-service';
import { environment } from '@sunbird/environment';
declare var jQuery: any;
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './main-header.component.html'
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @Input() routerEvents;
  languageFormQuery = {
    formType: 'content',
    formAction: 'search',
    filterEnv: 'resourcebundle'
  };
  exploreButtonVisibility: string;
  queryParam: any = {};
  showExploreHeader = false;
  showQrmodal = false;
  showAccountMergemodal = false;
  isValidCustodianOrgUser = true;
  tenantInfo: any = {};
  userProfile: IUserProfile;
  adminDashboard: Array<string>;
  announcementRole: Array<string>;
  myActivityRole: Array<string>;
  orgAdminRole: Array<string>;
  orgSetupRole: Array<string>;
  avtarMobileStyle = {
    backgroundColor: 'transparent',
    color: '#AAAAAA',
    fontFamily: 'inherit',
    fontSize: '17px',
    lineHeight: '38px',
    border: '1px solid #e8e8e8',
    borderRadius: '50%',
    height: '38px',
    width: '38px'
  };
  avtarDesktopStyle = {
    backgroundColor: 'transparent',
    color: '#AAAAAA',
    fontFamily: 'inherit',
    fontSize: '17px',
    lineHeight: '38px',
    border: '1px solid #e8e8e8',
    borderRadius: '50%',
    height: '38px',
    width: '38px'
  };
  public signUpInteractEdata: IInteractEventEdata;
  public enterDialCodeInteractEdata: IInteractEventEdata;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  pageId: string;
  searchBox = {
    'center': false,
    'smallBox': false,
    'mediumBox': false,
    'largeBox': false
  };
  slug: string;
  isOffline: boolean = environment.isOffline;
  languages: Array<any>;
  showOfflineHelpCentre = false;
  contributeTabActive: boolean;
  activeTab = {};
  public sourcingOrgAdmin: boolean;
  public notificationSubscription: Subscription;
  public notificationData: Array<any>;
  public showGlobalNotification: boolean;
  public notification: any;
 public showSubHeader = true;
 public unSubscribeShowSubHeader: any;
  constructor(public config: ConfigService, public resourceService: ResourceService, public router: Router,
    public permissionService: PermissionService, public userService: UserService, public tenantService: TenantService,
    public orgDetailsService: OrgDetailsService, private _cacheService: CacheService, public formService: FormService,
    public activatedRoute: ActivatedRoute, private cacheService: CacheService, private cdr: ChangeDetectorRef,
    public programsService: ProgramsService, private location: Location) {
      try {
        this.exploreButtonVisibility = (<HTMLInputElement>document.getElementById('exploreButtonVisibility')).value;
      } catch (error) {
        this.exploreButtonVisibility = 'false';
      }
      this.adminDashboard = this.config.rolesConfig.headerDropdownRoles.adminDashboard;
      this.announcementRole = this.config.rolesConfig.headerDropdownRoles.announcementRole;
      this.myActivityRole = this.config.rolesConfig.headerDropdownRoles.myActivityRole;
      this.orgSetupRole = this.config.rolesConfig.headerDropdownRoles.orgSetupRole;
      this.orgAdminRole = this.config.rolesConfig.headerDropdownRoles.orgAdminRole;
      router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.onRouterChange();
        }
      });
  }
  ngOnInit() {
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          this.userProfile = user.userProfile;
          this.getLanguage(this.userService.channel);
          // this.isCustodianOrgUser();
          this.sourcingOrgAdmin = this.userProfile.userRoles.includes('ORG_ADMIN') ? true : false;
        }
      });
    } else {
      this.orgDetailsService.orgDetails$.pipe(first()).subscribe((data) => {
        if (data && !data.err) {
          this.getLanguage(data.orgDetails.hashTagId);
        }
      });
    }
    this.getUrl();
    this.activatedRoute.queryParams.subscribe(queryParams => this.queryParam = { ...queryParams });
    this.tenantService.tenantData$.subscribe(({tenantData}) => {
      this.tenantInfo.logo = tenantData ? tenantData.logo : undefined;
      this.tenantInfo.titleName = (tenantData && tenantData.titleName) ? tenantData.titleName.toUpperCase() : undefined;
    });
    this.setInteractEventData();
    this.cdr.detectChanges();
    this.setWindowConfig();
    this.onRouterChange();

    // This subscription is only for offline and it checks whether the page is offline
    // help centre so that it can load its own header/footer
    if (this.isOffline) {
      this.router.events.subscribe((val) => {
        if (_.includes(this.router.url, 'help-center')) {
          this.showOfflineHelpCentre = true;
        } else {
          this.showOfflineHelpCentre = false;
        }
      });
    }
    // maintain active tab state
    if (this.router.isActive('/contribute', true)) {
      this.handleActiveTabState('allPrograms');
    } else if (this.router.isActive('/contribute/orglist', true) || this.router.isActive('/sourcing/orglist', true)) {
      this.handleActiveTabState('manageUsers');
    } else if (this.router.isActive('/contribute/help', true) || this.router.isActive('/sourcing/help', true)) {
      this.handleActiveTabState('contributorHelp');
    } else if (this.router.isActive('/sourcing/orgreports', true)) {
      this.handleActiveTabState('organisationReports');
    } else {
      this.handleActiveTabState('myPrograms');
    }
    this.telemetryInteractCdata = [{id: this.userService.channel || '', type: 'sourcing_organization'}];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.config.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};

  this.notificationSubscription = this.programsService.programsNotificationData.subscribe(data => {
    if (!_.isEmpty(data)) {
      this.notificationData = _.filter(data, prg => prg.notificationData);
    }
  });
  this.getNumberofNotification();
        this.unSubscribeShowSubHeader = this.programsService.getHeaderEmitter()
      .subscribe(status => this.showSubHeader = status );
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.unSubscribeShowSubHeader) {
      this.unSubscribeShowSubHeader.unsubscribe();
    }
  }

  private isCustodianOrgUser() {
    this.orgDetailsService.getCustodianOrgDetails().subscribe((custodianOrg) => {
      if (_.get(this.userService, 'userProfile.rootOrg.rootOrgId') === _.get(custodianOrg, 'result.response.value')) {
        this.isValidCustodianOrgUser = true;
      } else {
        this.isValidCustodianOrgUser = false;
      }
    });
  }
  getLanguage(channelId) {
    const isCachedDataExists = this._cacheService.get(this.languageFormQuery.filterEnv + this.languageFormQuery.formAction);
    if (isCachedDataExists) {
      this.languages = isCachedDataExists[0].range;
    } else {
      const formServiceInputParams = {
        formType: this.languageFormQuery.formType,
        formAction: this.languageFormQuery.formAction,
        contentType: this.languageFormQuery.filterEnv
      };
      // this.formService.getFormConfig(formServiceInputParams, channelId).subscribe((data: any) => {
      //   this.languages = data[0].range;
      //   this._cacheService.set(this.languageFormQuery.filterEnv + this.languageFormQuery.formAction, data,
      // tslint:disable-next-line:max-line-length
      //     { maxAge: this.config.appConfig.cacheServiceConfig.setTimeInMinutes * this.config.appConfig.cacheServiceConfig.setTimeInSeconds});
      // }, (err: any) => {
        this.languages = [{ 'value': 'en', 'label': 'English', 'dir': 'ltr' }];
      // });
    }
  }
  navigateToHome() {
    if (this.isOffline) {
      this.router.navigate(['']);
    } else if (this.userService.loggedIn) {
      if (this.router.url.includes('/contribute')) {
        if (this.userService.userRegistryData && this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org &&
          !this.userService.userProfile.userRegData.User_Org.roles.includes('admin')) {
          this.router.navigateByUrl('/contribute/myenrollprograms');
        } else {
          this.router.navigate(['contribute']);
        }
      } else {
        this.router.navigate(['sourcing']);
      }
    } else {
      window.location.href = this.slug ? this.slug + '/explore'  : '/explore';
    }
  }
  onEnter(key) {
    this.queryParam = {};
    if (key && key.length) {
      this.queryParam.key = key;
    }
    if (this.isOffline) {
      this.routeToOffline();
    } else {
      const url = this.router.url.split('?')[0];
      let redirectUrl;
      if (url.indexOf('/explore-course') !== -1) {
        redirectUrl = url.substring(0, url.indexOf('explore-course')) + 'explore-course';
      } else {
        redirectUrl = url.substring(0, url.indexOf('explore')) + 'explore';
      }
      this.router.navigate([redirectUrl, 1], { queryParams: this.queryParam });
    }
  }

  /* This method searches only for offline module*/
  routeToOffline() {
    if (_.includes(this.router.url, 'browse')) {
      this.router.navigate(['browse', 1], { queryParams: this.queryParam });
    } else {
      this.router.navigate(['search', 1], { queryParams: this.queryParam });
    }
  }

  getSearchButtonInteractEdata(key) {
    const searchInteractEdata = {
      id: `search-button`,
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
    if (key) {
      searchInteractEdata['extra'] = {
        query: key
      };
    }
    return searchInteractEdata;
  }

  getUrl() {
    this.routerEvents.subscribe((urlAfterRedirects: NavigationEnd) => {
      let currentRoute = this.activatedRoute.root;
      this.contributeTabActive = this.router.isActive('/sourcing', true);
      if (currentRoute.children) {
        while (currentRoute.children.length > 0) {
          const child: ActivatedRoute[] = currentRoute.children;
          child.forEach(route => {
            currentRoute = route;
            if (route.snapshot.data.telemetry) {
              if (route.snapshot.data.telemetry.pageid) {
                this.pageId = route.snapshot.data.telemetry.pageid;
              } else {
                this.pageId = route.snapshot.data.telemetry.env;
              }
            }
          });
        }
      }
      this.slug = _.get(this.activatedRoute, 'snapshot.firstChild.firstChild.params.slug');
      if (_.includes(urlAfterRedirects.url, '/explore-course') || _.includes(urlAfterRedirects.url, '/explore')) {
        this.showExploreHeader = true;
      } else {
        this.showExploreHeader = false;
      }
    });
  }

  setInteractEventData() {
    this.signUpInteractEdata = {
      id: 'signup',
      type: 'click',
      pageid: 'public'
    };
    // this.telemetryInteractObject = {
    //   id: '',
    //   type: 'signup',
    //   ver: '1.0'
    // };
    this.enterDialCodeInteractEdata = {
      id: 'click-dial-code',
      type: 'click',
      pageid: 'explore'
    };
  }

  getLogoutInteractEdata() {
    return {
      id: 'logout',
      type: this.config.telemetryLabels.eventType.click,
      subtype: this.config.telemetryLabels.eventSubtype.launch,
      pageid: this.pageId
    };
  }

  logout() {
    window.location.replace('/logoff');
    this.cacheService.removeAll();
  }
  setWindowConfig() {
    if (window.innerWidth <= 1023 && window.innerWidth > 548) {
      this.searchBox.center = true;
      this.searchBox.largeBox = true;
      this.searchBox.smallBox = false;
      this.searchBox.mediumBox = false;
    } else if (window.innerWidth <= 548) {
      this.searchBox.smallBox = true;
      this.searchBox.largeBox = false;
      this.searchBox.mediumBox = false;
    } else {
      this.searchBox.center = false;
      this.searchBox.smallBox = false;
      this.searchBox.largeBox = false;
      this.searchBox.mediumBox = true;
    }
    window.onresize = (e) => {
      if (window.innerWidth <= 1023 && window.innerWidth > 548) {
        this.searchBox.center = true;
        this.searchBox.largeBox = true;
        this.searchBox.smallBox = false;
        this.searchBox.mediumBox = false;
      } else if (window.innerWidth <= 548) {
        this.searchBox.largeBox = false;
        this.searchBox.mediumBox = false;
        this.searchBox.smallBox = true;
      } else {
        this.searchBox.center = false;
        this.searchBox.smallBox = false;
        this.searchBox.largeBox = false;
        this.searchBox.mediumBox = true;
      }
    };
  }
  showSideBar() {
    jQuery('.ui.sidebar').sidebar('setting', 'transition', 'overlay').sidebar('toggle');
  }

  handleActiveTabState(tab) {
    this.activeTab = {}; // As only one property should available at a time
    this.activeTab[tab] = true;
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }

  onRouterChange() {
    // maintain active tab state
    this.showSubHeader = true;
    if (this.location.path() === '/contribute') {
     this.handleActiveTabState('allPrograms');
     } else if (this.location.path() === '/contribute/orglist' || this.location.path() === '/sourcing/orglist') {
       this.handleActiveTabState('manageUsers');
     } else if (this.location.path() === '/contribute/myenrollprograms' || this.location.path() === '/sourcing') {
      this.handleActiveTabState('myPrograms');
     } else if (this.location.path() === '/contribute/help' || this.location.path() === '/sourcing/help' ) {
      this.handleActiveTabState('contributorHelp');
    } else if (this.location.path() === '/sourcing/orgreports') {
      this.handleActiveTabState('organisationReports');
    }

    if (this.location.path() === '/sourcing') {
      this.showGlobalNotification = true;
    } else {
      this.showGlobalNotification = false;
    }
  }

  getNumberofNotification() {
    const notificationArray = _.map(this.notificationData, data => {
      return _.compact([_.get(data, 'notificationData.nominationCount'), _.get(data, 'notificationData.contributionCount')]);
    });
    this.notification =  _.flattenDeep(notificationArray).length;
  }
}
