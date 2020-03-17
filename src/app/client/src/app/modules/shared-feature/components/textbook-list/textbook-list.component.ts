import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {  TextbookListService  } from '@sunbird/core';
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
   }
  
  ngOnInit(): void {
     this.apiUrl = _.get(this.textBookConfigs, 'url');
     this.config = _.get(this.textBookConfigs, 'config');
    this.searchCollection();
  }

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
