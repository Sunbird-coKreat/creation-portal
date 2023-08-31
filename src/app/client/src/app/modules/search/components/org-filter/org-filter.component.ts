import { ConfigService, ResourceService } from '@sunbird/shared';
import { Component, OnInit, Input, Output, EventEmitter, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-org-filter',
  templateUrl: './org-filter.component.html'
})
export class OrgFilterComponent implements OnInit {
  queryParams: any;

  public config: ConfigService;
  public resourceService: ResourceService;
  private searchService: SearchService;
  private cdr: ChangeDetectorRef;
  private router: Router;
  searchOrgType: Array<string>;
  label: Array<string>;
  refresh = true;
  isAccordianOpen = false;
  /**
    * Constructor to create injected service(s) object
    Default method of Draft Component class
    * @param {Router} route Reference of Router
    * @param {PaginationService} paginationService Reference of PaginationService
    * @param {ConfigService} config Reference of ConfigService
  */
  constructor(config: ConfigService,
    resourceService: ResourceService, router: Router, cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) {
    this.config = config;
    this.resourceService = resourceService;
    this.router = router;
    this.cdr = cdr;
  }

  removeFilterSelection(filterType, value) {
    const itemIndex = this.queryParams[filterType].indexOf(value);
    if (itemIndex !== -1) {
      this.queryParams[filterType].splice(itemIndex, 1);
      this.refresh = false;
      this.cdr.detectChanges();
      this.refresh = true;
    }
  }

  applyFilters() {
    const queryParams = {};
    _.forIn(this.queryParams, (value, key) => {
      queryParams[key] = [];
      if (value.length > 0 && key === 'key') {
        queryParams[key] = value;
      } else if (value.length > 0) {
        value.forEach((orgDetails) => {
          queryParams[key].push(orgDetails.id);
        });
      }
    });
    this.router.navigate(['/search/Organisations', 1], { queryParams: queryParams });
  }

  resetFilters() {
    this.queryParams = {};
    this.router.navigate(['/search/Organisations', 1]);
    this.refresh = false;
    this.cdr.detectChanges();
    this.refresh = true;
  }

  setFilters() {
    this.label = this.config.dropDownConfig.FILTER.SEARCH.Organisations.label;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = { ...params };
      _.forIn(this.queryParams, (value, key) => {
        if (typeof value === 'string' && key !== 'key') {
          this.queryParams[key] = [value];
        }
      });
      this.setFilters();
    });
  }
}
