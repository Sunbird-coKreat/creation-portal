import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {  TextbookListService  } from '@sunbird/core';
import { ConfigService, UtilService} from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';


@Component({
  selector: 'app-textbook-list',
  templateUrl: './textbook-list.component.html',
  styleUrls: ['./textbook-list.component.scss']
})
export class TextbookListComponent implements OnInit {

  @Input() textBookConfigs: any;
  @Output() textbookList  = new EventEmitter<any>();
  public programId: string;
  public config : any;
  public textbooks: any;
  public programContext: any;
  public sharedContext: any = {};
  public collectionComponentConfig: any;
  public filters;
  public apiUrl;

  constructor(public activatedRoute: ActivatedRoute, private router: Router, public TextbookListService: TextbookListService
    ) {
    //this.programId = this.activatedRoute.snapshot.params.programId;
    //31ab2990-7892-11e9-8a02-93c5c62c03f1
    this.programId = '31ab2990-7892-11e9-8a02-93c5c62c03f1';
   }
  
  ngOnInit(): void {
    // this.programContext = _.get(this.textBookConfigs, 'programContext');
    // this.collectionComponentConfig = _.get(this.textBookConfigs, 'config');
     this.apiUrl = _.get(this.textBookConfigs, 'url');
     this.config = _.get(this.textBookConfigs, 'config');
    // this.sharedContext = this.textBookConfigs.programContext.config.sharedContext.reduce((obj, context) => {
    //   return {...obj, [context]: this.getSharedContextObjectProperty(context)};
    // }, {});

    // this.filters = this.getImplicitFilters();
    this.searchCollection();
  }

  // getSharedContextObjectProperty(property) {
  //   if (property === 'channel') {
  //      return _.get(this.programContext, 'config.scope.channel');
  //   } else if ( property === 'topic' ) {
  //     return null;
  //   } else {
  //     const filters =  this.collectionComponentConfig.config.filters;
  //     const explicitProperty =  _.find(filters.explicit, {'code': property});
  //     const implicitProperty =  _.find(filters.implicit, {'code': property});
  //     return (implicitProperty) ? implicitProperty.range || implicitProperty.defaultValue :
  //      explicitProperty.range || explicitProperty.defaultValue;
  //   }
  // }

  // generateSearchFilterRequestData() {
  //   let payloadArray = [];
  //   payloadArray = [{
  //     objectType: 'content',
  //     programId: this.programId,
  //     status: this.collectionComponentConfig.config.filters.status || ['Draft', 'Live'],
  //     contentType: this.collectionComponentConfig.config.filters.collectionType || 'Textbook'
  //   }];
  //   this.filters.forEach( (element) => {
  //     payloadArray[0][element['code']] = element['defaultValue'];
  //   });
  //   return payloadArray[0];
  // }

  // getImplicitFilters(): string[] {
  //   const sharedContext = this.textBookConfigs.programContext.config.sharedContext,
  //   implicitFilter = this.collectionComponentConfig.config.filters.implicit,
  //   availableFilters = this.filterByCollection(implicitFilter, 'code', sharedContext);
  //   return availableFilters;
  // }

  // filterByCollection(collection: any[], filterBy: any, filterValue: any[]) {
  //   return collection.filter( (el) => {
  //     return filterValue.some((f: any) => {
  //       if ( _.isArray(el[filterBy])) {
  //         return f === _.intersectionBy(el[filterBy], filterValue).toString();
  //       } else {
  //         return el[filterBy].includes(f);
  //       }
  //     });
  //   });
  // }

  searchCollection() {
    const req = {data: {request: { filters: ''}, }, url: ''};
    // req.data.request.filters = this.generateSearchFilterRequestData();
    this.TextbookListService.getTextbookList(this.apiUrl,  this.config).subscribe(
      (res) => this.showTexbooklist(res),
      (err) => console.log(err)
    );
  }
  
  showTexbooklist (res) {
    this.textbooks = res.result.content;
  }


}
