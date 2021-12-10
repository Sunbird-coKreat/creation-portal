import { Component, Input, OnInit } from '@angular/core';
import { ResourceService } from '../../services/index';
@Component({
  selector: 'app-page-help',
  templateUrl: './page-help.component.html',
  styleUrls: ['./page-help.component.scss']
})
export class PageHelpComponent implements OnInit {

  @Input() helpSectionConfig;
  constructor(public resourceService: ResourceService) { }

  ngOnInit(): void {
  }

  openLink(url) {
    window.open(url,
    '_blank');
  }

}
