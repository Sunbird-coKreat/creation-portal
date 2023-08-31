import { Component, Input, OnInit, HostListener } from '@angular/core';
import { ResourceService } from '../../services/index';
import * as _ from 'lodash-es';
import { IPopup } from 'ng2-semantic-ui-v9';
@Component({
  selector: 'app-page-help',
  templateUrl: './page-help.component.html',
  styleUrls: ['./page-help.component.scss']
})
export class PageHelpComponent implements OnInit {
  @Input() helpSectionConfig: any;
  @Input() popupPlacement: string;
  @Input() pageid: string;

  public baseUrl;
  public contextualHelpPopup: IPopup;
  constructor(public resourceService: ResourceService) {
    this.baseUrl = (<HTMLInputElement>document.getElementById('portalBaseUrl'))
    ? (<HTMLInputElement>document.getElementById('portalBaseUrl')).value : '';
   }

   @HostListener('document:click', ['$event'])
   click(event) {
     if (event.target.id === this.pageid) {
      this.contextualHelpPopup.toggle();
    } else {
      this.contextualHelpPopup.close();
    }
  }

  ngOnInit(): void {
    if (_.isUndefined(this.popupPlacement)) {
      this.popupPlacement = 'bottom left';
    }
    if (_.isUndefined(this.pageid)) {
      this.pageid = 'contextualHelpIcon';
    }
  }

  openLink(url) {
    window.open(this.baseUrl + url,
    '_blank');
  }

  mouseEnter(popup: IPopup) {
    this.contextualHelpPopup = popup;
    popup.open();
  }
}