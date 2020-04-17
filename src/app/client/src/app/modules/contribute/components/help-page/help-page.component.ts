import { FormService, UserService, ExtPluginService } from '@sunbird/core';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { ResourceService, ToasterService } from '@sunbird/shared';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss']
})
export class HelpPageComponent implements OnInit {
  cameraSrc;
  constructor() { }

  ngOnInit() {
    this.cameraSrc="videos/sample-video.mp4";
  }
  
}
