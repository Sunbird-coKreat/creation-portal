import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '../../services/index';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-page-help',
  templateUrl: './page-help.component.html',
  styleUrls: ['./page-help.component.scss']
})
export class PageHelpComponent implements OnInit {
  @Input() helpSectionConfig: any;
  @Input() popupPlacement: string;
  constructor(public resourceService: ResourceService) { }

  ngOnInit(): void {
    if (_.isUndefined(this.popupPlacement)) {
      this.popupPlacement = 'bottom left';
    }
  }

  openLink(url) {
    window.open(url,
    '_blank');
  }

}
